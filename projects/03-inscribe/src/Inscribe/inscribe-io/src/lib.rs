#![no_std]

// use alloc::collections::btree_map::Entry;
// use core::usize;
use codec::{Decode, Encode};
use gstd::{collections::BTreeMap, MessageId, prelude::*, ActorId};
use scale_info::TypeInfo;
use gmeta::{InOut, Metadata};

#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash)]
pub struct Order {
    pub creator: ActorId,
    pub inscribe_id: InscribeIndexes,
    pub amt: u128,
    pub price: u128,
    pub order_status: OrderStatus,
    pub order_type: OrderType,
}


#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash)]
pub enum OrderStatus {
    #[default]
    Listed,
    Canceled,
    Successed,
}

#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash)]
pub struct OrderId(pub u128);

#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash)]
pub enum OrderType {
    #[default]
    LimitSell,
    LimitBuy,    
}


#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash, Copy)]
pub enum VerifyStatus {
    #[default]
    None,
    Verified,
    Evildoer,
}

#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash, Copy)]
pub enum InscribeType {
    #[default]
    Organization,
    Individual,
    None,
}

#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash, Copy)]
pub enum MediaType {
    #[default]
    Twitter,
    Website, 
    Email,
    Other,
}

#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash, Copy)]
pub enum InscribeState {
    #[default]
    Deployed,
    MintStart,
    MintEnd,    
}

// #[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash)]
// pub struct MintTimes(pub BTreeMap<ActorId, u64>);


#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash, Copy)]
pub struct InscribeIndexes(pub u128);

#[derive(Default, Debug, Encode, Decode, PartialEq, Eq, PartialOrd, Ord, Clone, TypeInfo, Hash)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct Inscribe{
    pub inscribe_type:InscribeType,
    pub inscribe_index: u128,
    pub deployer: ActorId,
    pub tick: String,
    pub max_supply: u128,
    pub total_supply: u128,
    pub amt_per_mint: u128,
    pub slogan: String,
    pub media: MediaType,
    pub media_link: String,
    pub verify: VerifyStatus,
    pub icon: String,
    pub frame: String,
    pub decimals: u8,
    pub inscribe_state:InscribeState,
}


#[derive(Clone, Default, Encode, Decode, TypeInfo)]
pub struct InscribeIoStates {
    // inscribe
    pub map_inscribes: BTreeMap<InscribeIndexes, Inscribe>,
    pub balances: BTreeMap<InscribeIndexes, BTreeMap<ActorId, u128>>,
    pub totalsupply: BTreeMap<InscribeIndexes,u128>,
    pub inscribes_minted: BTreeMap<ActorId, BTreeMap<u64, Inscribe>>,
    pub inscribes: BTreeMap<ActorId, BTreeMap<u64, Inscribe>>,
    pub mint_times: BTreeMap<InscribeIndexes, BTreeMap<ActorId, u64>>,
    pub all_orders: BTreeMap<OrderId, Order>,
    pub orders_of_actorid: BTreeMap<ActorId, BTreeMap<OrderId, Order>>,
}


impl InscribeIoStates {
    pub fn total_inscribes(&mut self) ->u128 {
        let inscribes = self.map_inscribes.last_key_value().expect("Get last key occurs erros").clone();
        let total = inscribes.0.0;
        return total;
    } 

    pub fn total_orders(&mut self) -> u128 {
        return self.last_order_id();
    }

    pub fn insert_actorid_order(&mut self, actor:ActorId, id: OrderId, order: Order) -> bool {
        // Note: check code's logic.

        if self.orders_of_actorid.is_empty() != true {
            // self.orders_of_actorid.insert(id, order);
            if self.orders_of_actorid.contains_key(&actor) == true {
                // self.orders_of_actorid.insert(actor, value)
            }
        }
        else {
            // init
            let mut od_map:BTreeMap<OrderId,Order> = BTreeMap::new();
            od_map.insert(id, order);
            self.orders_of_actorid.insert(actor, od_map);
        }




        return true;
    }

    pub fn check_inscribe_by_id(&mut self, index: u128) -> bool {
        let is_contain = self.map_inscribes.contains_key(&InscribeIndexes(index));

        return is_contain;        
    }

    pub fn get_total_supply(&mut self, index: u128) -> u128{
        let total_supply = self.totalsupply.get_key_value(&InscribeIndexes(index)).expect("msg").1.clone();

        return total_supply;        
    }

    pub fn update_totalsupply(&mut self, index: u128, total: u128) -> bool {
        // let oldsupply = self.totalsupply.get_key_value(&InscribeIndexes(index)).expect("get totalsupply error").1.clone();
        let update = self.totalsupply.get_mut(&InscribeIndexes(index)).expect("msg");
        *update = total;

        return true;
    }

    pub fn balances_map(&mut self, index: u128) -> BTreeMap<ActorId, u128> {
        let balances_map = self.balances.get_key_value(&InscribeIndexes(index)).expect("Get any Inscribes balances's BTreeMap occurs error").1.clone();

        return balances_map;
    }

    pub fn check_amt_of_user(&mut self, index: u128, user: ActorId, amt: u128) -> bool {
        // let inscirbe = self.inscribe_of_index(index);
        // is useramt >= amt == true. use balances: BTreeMap.
        let balances = self.balances_map(index);

        let user_amt = balances.get_key_value(&user).expect("get amt occurs error").1.clone();
        
        return user_amt - amt >= 0 as u128;
    }

    pub fn inscribe_of_index(&mut self, index: u128) -> Inscribe {
        let inscribe = self.map_inscribes.get_key_value(&InscribeIndexes(index)).expect("msg").1.clone();

        return inscribe;
    }

    pub fn last_order_id(&mut self) -> u128 {
        let id = self.all_orders.last_key_value().expect("msg").0.clone();

        return id.0 + 1;
    }

    pub fn insert_order_to_all_orders(&mut self, id: OrderId, order: Order) -> bool {
        if self.all_orders.is_empty() != true {
            self.all_orders.insert(id, order);
        }
        else {
            // init
            let mut _all_orders:BTreeMap<OrderId,Order> = BTreeMap::new();
            self.all_orders.insert(id, order);
        }

        return true;
    }


    pub fn deploy(&mut self, mut inscribe_data: Inscribe, id:ActorId) -> bool {
        let index: u128 = self.check_last_inscribe_indexes().0 + 1;
        inscribe_data.verify = VerifyStatus::None;
        inscribe_data.inscribe_state = InscribeState::MintStart;
        inscribe_data.total_supply = 0;
        inscribe_data.inscribe_index = index;
        self.map_inscribes.insert(InscribeIndexes(index), inscribe_data);

        // init balances for store......
        let amt:u128 = 0;
        let mut map: BTreeMap<ActorId, u128> = BTreeMap::new();
        map.insert(id, amt);
        self.balances.insert(InscribeIndexes(index), map);

        // init totalsupply 
        // let init_value = &inscribe_data.total_supply.clone();
        let mut totalsupply:BTreeMap<InscribeIndexes, u128> = BTreeMap::new();
        totalsupply.insert(InscribeIndexes(index), 0);
    
        return true;
    }

    pub fn check_last_inscribe_indexes(&mut self) -> InscribeIndexes{
        let last_inscribe_indexes = self.map_inscribes.last_key_value().expect("check inscribe indexed error").0.to_owned();
        return last_inscribe_indexes;
    }

    pub fn check_order_id_exsiting(&mut self, id: u128) -> bool {
        let status = self.all_orders.contains_key(&OrderId(id));
        return status;
    }


    pub fn mint(&mut self, inscribe_id: u128, to: ActorId) -> bool {
        // check inscribe_id is exsiting.
        assert_eq!(self.map_inscribes.contains_key(&InscribeIndexes(inscribe_id)), true);
        let inscribe = self.map_inscribes.get_key_value(&InscribeIndexes(inscribe_id)).expect("msg").1.clone();
        let max_supply = inscribe.max_supply;
        let total_supply = inscribe.total_supply;
        let amt = inscribe.amt_per_mint;
        assert_eq!(max_supply - (total_supply + amt) >= 0 as u128, true);

        let balances_of_inscribe = self.balances.get_mut(&InscribeIndexes(inscribe_id)).expect("msg");        
        // check max amt is reach ?
        // balances_of_inscribe.insert(to, amt).expect("msg");
        // let amts = balances_of_inscribe.get_mut(&to).expect("msg");
        // *amts = *amts + amt;

        if balances_of_inscribe.contains_key(&to) {
            let amts = balances_of_inscribe.get_key_value(&to).expect("msg").1.clone();
            balances_of_inscribe.insert(to, amts + amt);  

            return true; 
        }
        else {
            balances_of_inscribe.insert(to, amt);

            return true;
        }

    }

    // pub fn burn(&mut self) {
    //     todo!()
    // }

    pub fn trnsfer(&mut self, inscribe_id: u128, from: ActorId, to: ActorId, amt: u128, msg_sender: ActorId) {
        assert_eq!(self.map_inscribes.contains_key(&InscribeIndexes(inscribe_id)), true);
        let balances_of_inscribe = self.balances.get_mut(&InscribeIndexes(inscribe_id)).expect("msg").clone();        
        let amts_from = balances_of_inscribe.get_key_value(&from).expect("msg").1.clone();
        self.update_amt_index_id(inscribe_id, from, amts_from - amt);
        let amts_to = balances_of_inscribe.get_key_value(&to).expect("msg").1.clone();
        self.update_amt_index_id(inscribe_id, to, amts_to + amt);
        assert_eq!(from, msg_sender);        
    }

    // update_inscribe_amt_by_inscribeindex_and_actorid
    pub fn update_amt_index_id(&mut self, index: u128, id:ActorId, amt: u128) -> bool {
        let inscribe_balance = self.balances.get_mut(&InscribeIndexes(index)).expect("msg");
        if inscribe_balance.contains_key(&id) {
            let amts = inscribe_balance.get_mut(&id).expect("msg");
            *amts = *amts + amt;   
        } else {
            let _ = inscribe_balance.insert(id, amt).expect("insert action get error.");
        }

        return true;
    }

    // pub fn insert_
    pub fn update_order_status(&mut self, orderid: u128, order: Order) -> bool {
        // check order is exsiting && call this function to update Order Status.
        let _order = self.all_orders.get_mut(&OrderId(orderid)).expect("get all orders occurs errors");
        *_order = order;

        return true;
    }

    pub fn get_new_order_id(&mut self) -> u128 {

        let id = self.all_orders.last_key_value().expect("get last order id occurs error").0.clone();
        return id.0 + 1;
    }

    pub fn get_order(&mut self, id: u128) -> Order{
        let order = self.all_orders.get_key_value(&OrderId(id)).expect("get order action error").1.clone();

        return order;
    }


    pub fn update_inscribe(&mut self, index: u128, new_inscribe_data: Inscribe) -> bool {
        self.map_inscribes.insert(InscribeIndexes(index), new_inscribe_data);
        return true;
    }

    pub fn verify_status(&mut self, inscribe_id: u128, msg_sender: ActorId, verifystatus:VerifyStatus) -> bool {
        assert_eq!(self.map_inscribes.contains_key(&InscribeIndexes(inscribe_id)), true);
        // check msg sender is admin
        let admin = ActorId::from_bs58("1F22iHpizWc2C8vsFtWxy85ne7ucHZzpGs9uX3FSHTzk4Fu".to_owned()).expect("msg");
        // let msg_sender = msg::source();
        assert_eq!(admin, msg_sender);
        let mut new_inscribe_data: Inscribe = self.map_inscribes.get_key_value(&InscribeIndexes(inscribe_id)).expect("msg").1.clone();
        new_inscribe_data.verify = verifystatus.clone();

        self.update_inscribe(inscribe_id, new_inscribe_data);

        return true;
    }

}


#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum Action {
    Deploy {
        // inscribe_id: u64,
        inscribe_data: Inscribe,
    },

    Mint {
        // inscribe_id: which inscribe
        inscribe_id: u128,
        // to: ActorId
    },

    Burn {
        inscribe_id: u128,
        from: ActorId,
        to: ActorId,
        amt: u128,
    },

    Transfer {
        inscribe_id: u128,
        from: ActorId,
        to: ActorId,
        amt: u128,
    },
    ListOrder {
        // index: OrderId,
        // creator: ActorId,
        inscribe_id: u128,
        amt: u128,
        price: u128,
        ordertype: OrderType,
    },

    CancelSellOrder {
        orderid: u128,
    },

    FillBuyOrder {
        // buyer: ActorId,
        oriderid: u128,
    },

    // ListBuyOrder {
    //     index: OrderId,
    //     creator: ActorId,
    //     inscribe_id: u128,
    //     amt: u128,
    //     price: u128,
    // },

    // CancelBuyOrder {
    //     orderid: u128,
    // },

    FillSellOrder {
        // seller: ActorId,
        orderid: u128,
    },

    UpdateInscribe {
        inscribe_id: u128,
        inscribedata: Inscribe,
    },

    Verify {
        inscribe_id: u128,
        verifystatus: VerifyStatus,
    },

    // static mut BALANCES: Option<BTreeMap<InscribeIndexes, BTreeMap<ActorId, u128>>> = None;

    BalanceTest {
        id: InscribeIndexes,
        actor: ActorId,
        amt: u128,
        // map: BTreeMap<>,
    }

}



#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum Event {
    DeployEvent{inscribe_data: Inscribe},
    TransferEvent {_inscribe_id: u128,_to: ActorId, _amount: u128},
    BalanceOf(ActorId, u128),

    Deploy {

    },
    Mint {
        inscribe_id: u128, 
        to:ActorId,
    },
    Burn {
    },
    Transfer {
        _inscribe_id: u128,
        _to: ActorId, 
        _amount: u128
    },
    ListSellOrder {
        creator:ActorId, 
        inscribe_id: u128,
        amt: u128,
        price:u128,
    },

    UpdateInscribe {
        inscribe_id: u128,
        new_inscribe_data: Inscribe,
    },

    Verify {
        inscribe_id: u128,
        verifystatus: VerifyStatus
    }
}



#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum Query {
    All,

    QueryInscribe(u128),
    QueryInscribeByActorId(u128, String),
    QueryOrderById(u128),
    // InscribeInfoByIndex(u128),
    // InscribesOfActorId,
    // BalanceOf(ActorId, u128),
    // Inscribeowner,
    // Inscribestick,
    // InscribesMaxSupply,
    // InscribeTotalLimit,
    // InscribeMintPerActorid,
    // InscribeSlogan,
    // InscribeSocialLink,
    // InscribeIconLink,
    // InscribeFrame,
    // InscribeSupply,
    // InscribeBalances,
    // InscribeAllowances,
    // InscribeDecimals,
    // InscribeVerifyStatus,
    BlockNumber,
    BlockTimestamp,
    ProgramId,
    MessageId,
    Whoami,
}

// impl Query {
    
// }

#[derive(Encode, Decode, TypeInfo)]
pub enum Reply {
    All(InscribeIoStates),
    ReplyInscribe(Inscribe),
    ReplyInscribeByActorId(u128),
    ReplyOrderById(Order),

    InscribeInfoByIndex(Inscribe),
    InscribesOfActorId(ActorId),
    // retrun balance of address Inscribes amount.
    BalanceOf(ActorId, u128, u128),
    // Url(Option<String>),
    Whoami(ActorId),
    BlockNumber(u32),
    BlockTimestamp(u64),
    ProgramId(ActorId),
    MessageId(MessageId),
}


pub struct ProgramMetadata;

/// TODO: 0️⃣ Copy `Metadata` from the first lesson and push changes to the master branch
impl Metadata for ProgramMetadata {
    type Init = ();
    type Handle = InOut<Action, Event>;
    type State = InOut<Query, Reply>;
    type Reply = ();
    type Others = ();
    type Signal = ();
}