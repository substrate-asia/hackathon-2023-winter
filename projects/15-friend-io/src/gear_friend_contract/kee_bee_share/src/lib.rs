#![no_std]

use gstd::{collections::HashMap, msg, prelude::*, ActorId, MessageId, debug};
use kee_bee_io::{InitConfig, IoKeeBeeShare, KBAction, KBEvent, StateQuery, StateReply};

pub mod utils;

static mut KEE_BEE_SHARE: Option<KeeBeeShare> = None;
const ETH1: u128 = 10u128.pow(12);

#[derive(Debug, Clone, Default)]
pub struct KeeBeeShare {
    pub shares_balance: HashMap<ActorId, HashMap<ActorId, u128>>,
    pub share_supply: HashMap<ActorId, u128>,
    pub manager: HashMap<ActorId, bool>,
    pub protocol_fee_destination: ActorId,
    pub protocol_fee_percent: u128,
    pub subject_fee_percent: u128,
    pub max_fee_percent: u128,
    pub max_amount: u8,
}

#[no_mangle]
extern "C" fn init() {
    let init_config: InitConfig = msg::load().expect("Unable to decode protocoal fee destination");
    let mut kee_bee_share = KeeBeeShare {
        protocol_fee_destination: init_config.protocol_fee_destination,
        protocol_fee_percent: init_config.protocol_fee_percent,
        subject_fee_percent: init_config.subject_fee_percent,
        max_fee_percent: ETH1,
        max_amount: 1,
        ..Default::default()
    };
    kee_bee_share.manager.insert(msg::source(), true);
    unsafe {
        KEE_BEE_SHARE = Some(kee_bee_share);
    }
}

impl KeeBeeShare {
    fn get_price(&self, supply: u128, amount: u128) -> u128 {
        assert!(amount <= self.max_amount.into(), "amount too high");
        let sum1 = if supply == 0 {
            0
        } else {
            (supply - 1) * (supply) * (2 * (supply - 1) + 1) / 6
        };
        let sum2 = if supply == 0 && amount == 1 {
            0
        } else {
            (supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1) / 6
        };
        let summation = sum2 - sum1;
        return summation * ETH1 * 100;
    }

    pub fn get_buy_price(&self, shares_subject: ActorId, amount: u128) -> u128 {
        return self.get_price(
            *self.share_supply.get(&shares_subject).unwrap_or(&0u128),
            amount,
        );
    }

    pub fn get_sell_price(&self, shares_subject: ActorId, amount: u128) -> u128 {
        return self.get_price(
            *self.share_supply.get(&shares_subject).unwrap_or(&0u128) - amount,
            amount,
        );
    }

    pub fn get_buy_price_after_fee(&self, shares_subject: ActorId, amount: u128) -> u128 {
        let price = self.get_buy_price(shares_subject, amount);
        let protocol_fee = price * self.protocol_fee_percent / ETH1;
        let subject_fee = price * self.subject_fee_percent / ETH1;
        return price + protocol_fee + subject_fee;
    }

    pub fn get_sell_price_after_fee(&self, shares_subject: ActorId, amount: u128) -> u128 {
        let price = self.get_sell_price(shares_subject, amount);
        let protocol_fee = price * self.protocol_fee_percent / ETH1;
        let subject_fee = price * self.subject_fee_percent / ETH1;
        return price - protocol_fee - subject_fee;
    }

    pub fn buy_shares(&mut self, shares_subject: ActorId, amount: u128) {
        let supply = self.share_supply.get(&shares_subject).unwrap_or(&0).clone();
        let trader = msg::source();
        debug!("supply:{supply:?},amount is:{amount:?}");
        assert!(
            supply > 0 || shares_subject == trader,
            "Only the shares' subject can buy the first share"
        );
        let price = self.get_price(supply, amount);
        let protocol_fee = price * self.protocol_fee_percent / ETH1;
        let subject_fee = price * self.subject_fee_percent / ETH1;
        assert!(
            msg::value() >= price + protocol_fee + subject_fee,
            "Insufficient payment"
        );
        self.shares_balance
            .entry(shares_subject)
            .or_insert(Default::default())
            .entry(trader)
            .and_modify(|share_balance| *share_balance += amount)
            .or_insert(amount);
        // sharesSupply[sharesSubject] = supply + amount;
        self.share_supply
            .entry(shares_subject)
            .and_modify(|supply| *supply += amount)
            .or_insert(amount);
        msg::send(self.protocol_fee_destination, "", protocol_fee).expect(&format!("send ptotocal fee fail,protocol_fee is:{},msg value is:{}",protocol_fee,msg::value()));
        msg::send(shares_subject, "", subject_fee).expect("send subject fee fail");

        // Trade(msg.sender, sharesSubject, true, amount, price, protocolFee, subjectFee, supply + amount);
        let trade = KBEvent::Trade {
            trader,
            subject: shares_subject,
            is_buy: true,
            share_amount: amount,
            eth_amount: price,
            protocol_eth_amount: protocol_fee,
            subject_eth_amount: subject_fee,
            supply: supply + amount,
        };
        debug!("trade is:{trade:?}");
        msg::reply(trade, 0).unwrap();
    }

    pub fn sell_shares(&mut self, shares_subject: ActorId, amount: u128) {
        let supply = self.share_supply.get(&shares_subject).unwrap_or(&0).clone();
        let trader = msg::source();
        debug!("supply:{supply:?},debug is:{amount:?}");
        assert!(supply > amount, "Cannot sell the last share");
        let price = self.get_price(supply - amount, amount);
        let protocol_fee = price * self.protocol_fee_percent / ETH1;
        let subject_fee = price * self.subject_fee_percent / ETH1;
        let share_balance = self
            .shares_balance
            .get(&shares_subject)
            .unwrap()
            .get(&trader)
            .unwrap()
            .clone();
        assert!(share_balance >= amount, "Insufficient shares");
        self.shares_balance
            .get_mut(&shares_subject)
            .unwrap()
            .entry(trader)
            .and_modify(|share| *share -= amount);
        self.share_supply
            .entry(shares_subject)
            .and_modify(|supply| *supply -= amount);
        debug!("price - protocol_fee - subject_fee is:{:?}",price - protocol_fee - subject_fee);
        debug!("trader is:{:?}",trader);

        

        msg::send(trader, (), price - protocol_fee - subject_fee).unwrap();
        msg::send(self.protocol_fee_destination, (), protocol_fee).unwrap();
        msg::send(shares_subject, (), subject_fee).expect("send subject fee fail");
        let trade = KBEvent::Trade {
            trader,
            subject: shares_subject,
            is_buy: false,
            share_amount: amount,
            eth_amount: price,
            protocol_eth_amount: protocol_fee,
            subject_eth_amount: subject_fee,
            supply: supply - amount,
        };
        debug!("sell trade is:{trade:?}");
        msg::reply(trade, 0).unwrap();
    }

    pub fn set_max_amount(&mut self, max_amount: u8) {
        self.assert_admin();
        self.max_amount = max_amount;
    }

    pub fn set_fee_destination(&mut self, _fee_destination: ActorId) {
        self.assert_admin();
        self.protocol_fee_destination = _fee_destination;
    }

    pub fn set_protocol_fee_percent(&mut self, _fee_percent: u128) {
        self.assert_admin();
        self.protocol_fee_percent = _fee_percent;
    }

    pub fn set_subject_fee_percent(&mut self, _fee_percent: u128) {
        self.assert_admin();
        self.subject_fee_percent = _fee_percent;
    }
}

fn common_state(kee_bee_share:KeeBeeShare) -> IoKeeBeeShare {
    let KeeBeeShare {
        shares_balance,
        share_supply,
        manager,
        protocol_fee_destination,
        protocol_fee_percent,
        subject_fee_percent,
        max_fee_percent,
        max_amount,
    } = kee_bee_share;

    let share_supply = share_supply.iter().map(|(k, v)| (*k, *v)).collect();
    let manager = manager.iter().map(|(k, v)| (*k, *v)).collect();
    let shares_balance = shares_balance
        .iter()
        .map(|(id, balance)| (*id, balance.iter().map(|(k, v)| (*k, *v)).collect()))
        .collect();
    IoKeeBeeShare {
        shares_balance,
        share_supply,
        manager,
        protocol_fee_destination,
        protocol_fee_percent,
        subject_fee_percent,
        max_fee_percent,
        max_amount,
    }
}


#[no_mangle]
extern "C" fn state() {
    let kee_bee_share = unsafe { KEE_BEE_SHARE.take().expect("Failed to get state") }.clone();
    let query: StateQuery = msg::load().expect("Unable to load the state query");
    let state_reply: StateReply = match query {
        StateQuery::Price { supply, amount } => {
            let price = kee_bee_share.get_price(supply, amount);
            StateReply::Price(price)
        }
        StateQuery::BuyPrice {
            shares_subject,
            amount,
        } => {
            let price = kee_bee_share.get_buy_price(shares_subject, amount);
            StateReply::Price(price)
        }
        StateQuery::SellPrice {
            shares_subject,
            amount,
        } => {
            let price = kee_bee_share.get_sell_price(shares_subject, amount);
            StateReply::Price(price)
        }
        StateQuery::BuyPriceAfterFee {
            shares_subject,
            amount,
        } => {
            let price = kee_bee_share.get_buy_price_after_fee(shares_subject, amount);
            StateReply::Price(price)
        }
        StateQuery::SellPriceAfterFee {
            shares_subject,
            amount,
        } => {
            let price = kee_bee_share.get_sell_price_after_fee(shares_subject, amount);
            StateReply::Price(price)
        }
        StateQuery::FullState => StateReply::FullState(common_state(kee_bee_share)),
    };

    reply(state_reply)
        .expect("Failed to encode or reply with `<AppMetadata as Metadata>::State` from `state()`");
}

fn reply(payload: impl Encode) -> gstd::errors::Result<MessageId> {
    msg::reply(payload, 0)
}

#[no_mangle]
extern "C" fn handle() {
    let action: KBAction = msg::load().expect("Could not load Action");
    let kee_bee_share: &mut KeeBeeShare =
        unsafe { KEE_BEE_SHARE.get_or_insert(Default::default()) };
    match action {
        KBAction::BuyShare {
            shares_subject,
            amount,
        } => {
            kee_bee_share.buy_shares(shares_subject, amount);
        }
        KBAction::SellShare {
            shares_subject,
            amount,
        } => {
            kee_bee_share.sell_shares(shares_subject, amount);
        }
    }
}
