#![no_std]

use gmeta::{Metadata, InOut, In};
use gstd::{ActorId, Decode, Encode, TypeInfo, Vec};


pub struct KeeBeeMetadata;



impl Metadata for KeeBeeMetadata {
    type Init = In<InitConfig>;
    type Handle = InOut<KBAction, KBEvent>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    /// State message type.
    ///
    /// Describes the type for the queried state returned by the `state()`
    /// function.
    ///
    /// We use a [`StateQuery`] and [`StateReply`]struct.
    type State = InOut<StateQuery,StateReply>;
}

#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum StateQuery {
    Price {supply:u128,amount:u128},
    BuyPrice { shares_subject: ActorId,amount:u128 },
    SellPrice { shares_subject: ActorId,amount:u128 },
    BuyPriceAfterFee{shares_subject: ActorId,amount:u128},
    SellPriceAfterFee{shares_subject: ActorId,amount:u128},
    SubjectShareUser{subject:ActorId,user:ActorId},
    FullState,
}

#[derive(Debug,Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum StateReply {
    Price(u128),
    FullState(IoKeeBeeShare),
    ShareAmount(u128),
}

#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitConfig {
    pub protocol_fee_destination: ActorId,
    pub protocol_fee_percent:u128,
    pub subject_fee_percent:u128,
    pub max_fee_percent:u128,
    pub max_amount:u8,
}


#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum KBAction {
    BuyShare {
        shares_subject: ActorId,
        amount: u128,
    },
    SellShare {
        shares_subject: ActorId,
        amount: u128,
    },
}

#[derive(Debug, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum KBEvent {
    Trade {
        trader: ActorId,
        subject: ActorId,
        is_buy: bool,
        share_amount: u128,
        eth_amount: u128,
        protocol_eth_amount: u128,
        subject_eth_amount: u128,
        supply: u128,
    },
}

#[derive(Debug, Clone, Default, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct IoKeeBeeShare {
    pub shares_balance: Vec<(ActorId, Vec<(ActorId, u128)>)>,
    pub share_supply: Vec<(ActorId, u128)>,
    pub manager: Vec<(ActorId, bool)>,
    pub protocol_fee_destination: ActorId,
    pub protocol_fee_percent: u128,
    pub subject_fee_percent: u128,
    pub max_fee_percent: u128,
    pub max_amount: u8,
}