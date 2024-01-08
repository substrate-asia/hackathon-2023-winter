#![no_std]

use core::u128;

use gstd::{collections::BTreeMap,ActorId, ToOwned, exec, msg::{self}, prelude::*};
// use gstd::collections::btree_map::Entry;
use inscribe_io::{Query, Reply, Action, Event, InscribeIoStates, Inscribe, VerifyStatus, InscribeIndexes, OrderId, Order, OrderStatus, OrderType };
// static mut map_inscribes: 
// static mut ORDER: Option<Order> = None;
// static mut ORDER_STATUS: Option<OrderStatus> = None;
// static mut ORDER_TYPE: Option<OrderType> = None;
// static mut ORDERID: Option<OrderId> = None;
// static mut INSCRIBE: Option<Inscribe> = None;

static mut INSCRIBEIOSTATES: Option<InscribeIoStates> = None;
// static mut INSCRIBEINDEXES: Option<InscribeIndexes> = None;

// static mut MAP_INSCRIBES: Option<BTreeMap<InscribeIndexes, Inscribe>> = None;
// static mut BALANCES: Option<BTreeMap<InscribeIndexes, BTreeMap<ActorId, u128>>> = None;
// static mut TOTALSUPPLY: Option<BTreeMap<InscribeIndexes,u128>> = None;
// static mut INSCRIBES_MINTED: Option<BTreeMap<ActorId, BTreeMap<u64, Inscribe>>> = None;
// static mut INSCRIBES: Option<BTreeMap<ActorId, BTreeMap<u64, InscribeIndexes>>> = None;
// // static mut MINT_TIMES: Option<BTreeMap<InscribeIndexes, MintTimes>> = None;
// static mut ALL_ORDERS: Option<BTreeMap<OrderId, Order>> = None;
// static mut ORDERS_OF_ACTORID: Option<BTreeMap<ActorId, BTreeMap<OrderId, Order>>> = None;



// static mut VERIFICATION_STAGES: Option<HashMap<ActorId, VerificationStage>> = None;
//     VERIFICATION_STAGES = Some(HashMap::new());
// static mut BALANCES: BTreeMap<InscribeIndexes, BTreeMap<ActorId, u128>> = None;


// static mut PROOF_DATA: Option<HashMap<ActorId, Vec<u8>>> = None;

// #[no_mangle]
// unsafe extern "C" fn init() {
//     PROOF_DATA = Some(HashMap::new());
// }

#[no_mangle]
extern "C" fn init() {
    // unsafe { MAP_INSCRIBES = Some(BTreeMap::new()) };
    // unsafe { BALANCES = Some(BTreeMap::new())};
    // unsafe { TOTALSUPPLY = Some(BTreeMap::new()) };
    // unsafe { INSCRIBES_MINTED = Some(BTreeMap::new()) };
    // unsafe { INSCRIBES = Some(BTreeMap::new()) };
    // // unsafe { MINT_TIMES = Some(BTreeMap::new()) };
    // unsafe { ALL_ORDERS = Some(BTreeMap::new()) };
    // unsafe { ORDERS_OF_ACTORID = Some(BTreeMap::new()) };


    // unsafe { ORDER_STATUS = Some(OrderStatus::default()) };
    // unsafe { ORDER_TYPE = Some(OrderType::default()) };
    // unsafe { ORDERID = Some(OrderId::default()) };
    // unsafe { ORDER = Some(Order::default()) };
    // unsafe { INSCRIBE = Some(Inscribe::default()) };
    // unsafe { INSCRIBEINDEXES = Some(InscribeIndexes::default()) };
    unsafe { INSCRIBEIOSTATES = Some(InscribeIoStates::default()) };


    let state = unsafe { INSCRIBEIOSTATES.as_mut().expect("failed to get state as mut") };

    let inscribe_init = Inscribe { 
        inscribe_type: inscribe_io::InscribeType::Organization, 
        inscribe_index: 1, 
        deployer: msg::source(), 
        tick: "VEIN".to_owned(), 
        max_supply: 1000000000000, 
        total_supply: 0, 
        amt_per_mint: 1000, 
        slogan: "WE DO THE BEST.".to_owned(), 
        media: inscribe_io::MediaType::Twitter,
        media_link: "https://x.com/vein".to_owned(), 
        verify: VerifyStatus::None, 
        icon: "https://ipfs.io/icon".to_owned(), 
        frame: "https://ipfs.io/frame".to_owned(), 
        decimals: 0, 
        inscribe_state: inscribe_io::InscribeState::MintStart 
    };

    state.map_inscribes.insert(inscribe_io::InscribeIndexes(1), inscribe_init.clone());

    // pub balances: BTreeMap<InscribeIndexes, BTreeMap<ActorId, u128>>,
    let mut balance_inner_map = BTreeMap::new();
    balance_inner_map.insert(msg::source(), 0);
    state.balances.insert(InscribeIndexes(1), balance_inner_map);


    // pub totalsupply: BTreeMap<InscribeIndexes,u128>,
    state.totalsupply.insert(InscribeIndexes(1), 0);

    // pub inscribes_minted: BTreeMap<ActorId, BTreeMap<u64, Inscribe>>,
    let mut actors_insc_inner_map:BTreeMap<u64, Inscribe> = BTreeMap::new();
    actors_insc_inner_map.insert(1, inscribe_init.clone());
    state.inscribes_minted.insert(msg::source(), actors_insc_inner_map);

    // pub inscribes: BTreeMap<ActorId, BTreeMap<u64, Inscribe>>,
    let mut inscribes_inner_map:BTreeMap<u64, Inscribe> = BTreeMap::new();
    inscribes_inner_map.insert(1, inscribe_init.clone());
    state.inscribes.insert(msg::source(), inscribes_inner_map);

    // pub mint_times: BTreeMap<InscribeIndexes, MintTimes>,
    let mut actor_mint_times:BTreeMap<ActorId, u64> = BTreeMap::new();
    actor_mint_times.insert(msg::source(), 0);
    state.mint_times.insert(InscribeIndexes(1), actor_mint_times);

    // pub all_orders: BTreeMap<OrderId, Order>,
    let order: Order = Order { creator:msg::source(), inscribe_id:InscribeIndexes(1), amt: 1, price:1, order_status:OrderStatus::Canceled, order_type: OrderType::LimitBuy };
    state.all_orders.insert(OrderId(1), order.clone());

    // pub orders_of_actorid: BTreeMap<ActorId, BTreeMap<OrderId, Order>>,
    let mut user_order_inner_map:BTreeMap<OrderId, Order> = BTreeMap::new();
    user_order_inner_map.insert(OrderId(1), order.clone());
    state.orders_of_actorid.insert(msg::source(), user_order_inner_map);

}



#[no_mangle]
extern "C" fn handle() {
    let state = unsafe { INSCRIBEIOSTATES.as_mut().expect("failed to get state as mut") };
    let action: Action = gstd::msg::load().expect("failed to load action");
    // let map_balance = unsafe { BALANCES.as_mut().expect("failed to get map balance") };

    match action {
        Action::Deploy { inscribe_data  } => {
            // check inscribe ticks is existing
            let id:ActorId = msg::source();
            let is_deployed = state.deploy(inscribe_data.clone(), id);
            assert_eq!(is_deployed, true);
            msg::reply(Event::DeployEvent { inscribe_data },0).expect("Got error");
            
        },

        Action::Transfer { inscribe_id, from, to, amt } => {

            let msg_sender = msg::source();

            state.trnsfer(inscribe_id, from, to, amt, msg_sender);
            let _reply = msg::reply("transfer", 0);

            // todo!();
        },
        Action::Mint { inscribe_id  } => {
            let to = msg::source();
            // check inscribe_id is exsiting.
            // assert_eq!(state.inscribe_indexes.contains_key(&InscribeIndexes(inscribe_id)), true);
            // let mut balances_of_inscribe = state.balances.get_key_value(&InscribeIndexes(inscribe_id)).expect("msg").1.clone();
            
            // let mut inscribe_of_id = state.inscribe_indexes.get_key_value(&InscribeIndexes(inscribe_id)).expect("msg").1.clone();
            // let max_supply = inscribe_of_id.max_supply;
            // let total_supply = inscribe_of_id.total_supply;
            // let amt = inscribe_of_id.amt_per_mint;
            // // check max amt is reach ?

            // assert_eq!(max_supply - (total_supply + amt) >= 0 as u128, true);

            // // check actorid's current amt.

            // let mut cureent_amt = balances_of_inscribe.get_key_value(&to).expect("msg").1.clone();

            // cureent_amt += amt;           

            // balances_of_inscribe.insert(to, cureent_amt);
            // inscribe_of_id.total_supply += amt;

            state.mint(inscribe_id, to);

            let _ = msg::reply(Event::Mint { inscribe_id, to  }, 0);

        },
        Action::Burn { inscribe_id, from, to, amt  } => {
            // check inscribe_id is exsiting.
            assert_eq!(state.map_inscribes.contains_key(&InscribeIndexes(inscribe_id)), true);
            let balances = state.balances.get_key_value(&InscribeIndexes(inscribe_id)).expect("msg").1.clone();
            // get balance from & to and clone it
            let balance_from = balances.get_key_value(&from).expect("msg").1.clone();
            let balance_to = balances.get_key_value(&to).expect("msg").1.clone();

            let inscribe_of_id = state.map_inscribes.get_key_value(&InscribeIndexes(inscribe_id)).expect("msg").1.clone();
            // when do burn action, the total_supply changed.
            let max_supply = inscribe_of_id.max_supply;
            let total_supply = inscribe_of_id.total_supply;
            // check max amt is reach ?
            // assert_eq!(max_supply - (total_supply + amt) >= 0 as u128, true);

            // update new amt for from and to
            let is_succes_from = state.update_amt_index_id(inscribe_id, from, balance_from - amt);
            let is_succes_to = state.update_amt_index_id(inscribe_id, to, balance_to + amt);

            assert_eq!(is_succes_from, is_succes_to);
        },
        Action::ListOrder { inscribe_id, amt, price, ordertype } => {
            // check inscribe_id is exsiting.
            let msg_sender = msg::source();

            let is_contain = state.check_inscribe_by_id(inscribe_id);
            assert_eq!(is_contain, true);

            let is_amt_ok = state.check_amt_of_user(inscribe_id, msg_sender, amt);
            assert_eq!(is_amt_ok, true);

            // assert_eq!(creator, msg_sender);            

            // let market_contract = exec::program_id();

            let order_id:OrderId = OrderId(state.last_order_id());

            // create order info.
            let creator = msg_sender;
            let order_status = OrderStatus::Listed;
            let order_type = ordertype;
            let inscribe_id = InscribeIndexes(inscribe_id);
            // let sell_or_buy =ordertype;
            let order = Order {
                creator,
                inscribe_id,
                amt,
                price,
                order_status,
                order_type,
            };

            // update && save order info.
            // When user list LimitBuyOrder need to send vara value of price to the contract.
            if order.order_type == OrderType::LimitBuy {
                assert_eq!(msg::value(), price);
            }

            state.insert_order_to_all_orders(order_id.clone(), order.clone());

            // store actorid's order info.
            state.insert_actorid_order(creator, order_id.clone(), order.clone());
            // state.orders_of_actorid.insert(msg_sender, o)


            // let _ = msg::reply(Event::ListSellOrder { creator, inscribe_id, amt, price }, 0);


        },
        Action::FillBuyOrder {  oriderid } => {
            // When Action == FillBuyOrder, Buyer Send vara to contract, contract send vara to Seller. And Contract send Inscribe to Buyer.
            // orderid is existing ?
            let is_orderid_valid = state.check_order_id_exsiting(oriderid);
            assert_eq!(is_orderid_valid, true);

            // check orderid's status,read orderid's info
            let mut order = state.all_orders.get_key_value(&OrderId(oriderid)).expect("msg").1.clone();
            assert_eq!(order.order_status, OrderStatus::Listed);

            let msg_send_value = msg::value();
            let price = order.price;

            let inscribe_id = order.inscribe_id.0;
            let amt = order.amt;
            let seller = order.creator;
            let buyer = msg::source();

            // get and Check contract id's inscribe amt
            let contract_amt_ok = state.check_amt_of_user(inscribe_id, exec::program_id(), amt);
            assert_eq!(contract_amt_ok, true);

            // transfer vara check
            assert_eq!(price, msg_send_value);
            let seller_value = msg_send_value - 1000000000000;

            // transfer inscribe to buyer: index, amt, from, to.
            state.update_amt_index_id(inscribe_id, buyer, amt);

            // update amt : contract address.
            state.update_amt_index_id(inscribe_id, exec::program_id(), amt);
            assert_eq!(buyer, msg::source());    
            
            // update && save order info in states.
            order.order_status = OrderStatus::Successed;

            // state.all_orders.insert(OrderId(oriderid), order.clone());
            state.update_order_status(oriderid, order);

            // Events of this action
            // we need use reply to send vara to seller
            // let _ = msg::reply("Order Filled {}", msg_send_value);
            let admin = ActorId::from_bs58("1F22iHpizWc2C8vsFtWxy85ne7ucHZzpGs9uX3FSHTzk4Fu".to_owned()).expect("msg");

            let _send = msg::send(seller, "Order filled", seller_value).expect("Send Vara Failed");
            let _send = msg::send(admin, "fee", 1000000000000).expect("Send market fee Failed");
        },
        
        Action::FillSellOrder { orderid } => {
            // check orderid is exsiting
            let is_order_exsiting = state.all_orders.contains_key(&OrderId(orderid));
            assert_eq!(true, is_order_exsiting);
            // read order
            let order = state.all_orders.get_key_value(&OrderId(orderid)).expect("msg").1.clone();
            // decode Order info.
            let index = order.inscribe_id.clone();
            let amt = order.amt.clone();
            let creator = order.creator.clone();
            let price = order.price.clone();
            let order_type = order.order_type.clone();
            assert_eq!(order_type, OrderType::LimitSell);

            // check actorid: msg::souce() is have this inscribe, and amt is >= order amt
            let user = msg::source();
            let is_have_this_inscribe = state.check_amt_of_user(index.0, user, amt);
            assert_eq!(is_have_this_inscribe, true);
            
            // update infos in states of this inscribe
            let amt_of_buyer = state.balances_map(index.0).get_key_value(&creator).expect("get buyer's inscribe amt error").1.clone();
            let buyer_new_amt = amt_of_buyer + amt;
            state.update_amt_index_id(index.0, creator, buyer_new_amt);

            let amt_of_seller = state.balances_map(index.0).get_key_value(&user).expect("get seller's inscibe amt error").1.clone();
            let seller_new_amt = amt_of_seller - amt;
            state.update_amt_index_id(index.0, user, seller_new_amt);


            // update order type info 
            // order.order_status = OrderStatus::Successed;
            let mut od = order.clone();
            od.order_status = OrderStatus::Successed
            ;
            state.update_order_status(orderid, od.clone());

            // event of sell action.

            // Event::
        },
        Action::CancelSellOrder { orderid } => {
            // check orderid
            let is_order_exsiting = state.check_order_id_exsiting(orderid);
            assert_eq!(is_order_exsiting, true);
            // check order's status
            let order = state.all_orders.get_key_value(&OrderId(orderid)).expect("msg").1.clone();


            assert_eq!(order.order_status.clone(), OrderStatus::Listed);
            // some action to cancele
            let index = order.inscribe_id.clone();
            let user_amt = state.balances_map(index.0).get_key_value(&order.creator).expect("msg").1.clone();
            state.update_amt_index_id(index.0, order.creator.clone(), user_amt + order.amt);

            // update order status
            let mut od = order.clone();
            od.order_status = OrderStatus::Canceled;
            let is_update_sucess = state.update_order_status(orderid, od.clone());
            assert_eq!(is_update_sucess, true);
        },
        Action::UpdateInscribe { inscribe_id, inscribedata } => {
            // check msg.value.
            let value = msg::value();
            let fee: u128 = 16000000000000;
            assert_eq!(value, fee);
            // check inscribe id
            assert_eq!(state.map_inscribes.contains_key(&InscribeIndexes(inscribe_id)), true);
            // check msg sender is owner
            let inscribe_owner = state.map_inscribes.get_key_value(&InscribeIndexes(inscribe_id)).expect("msg").1.deployer;
            let msg_sender = msg::source();
            assert_eq!(inscribe_owner, msg_sender);
            // new infos.
            let mut new_inscribe_data: Inscribe = state.map_inscribes.get_key_value(&InscribeIndexes(inscribe_id)).expect("msg").1.clone();
            // Only this properties can be updated.
            new_inscribe_data.frame = inscribedata.frame;
            new_inscribe_data.icon = inscribedata.icon;
            new_inscribe_data.media = inscribedata.media;
            new_inscribe_data.slogan = inscribedata.slogan;
            new_inscribe_data.inscribe_type = inscribedata.inscribe_type;     

            // update action. user & other states
            state.update_inscribe(inscribe_id, new_inscribe_data.clone());
            let _ =msg::reply(Event::UpdateInscribe { inscribe_id, new_inscribe_data }, 0);

        },

        Action::Verify { inscribe_id, verifystatus } => {
            let msg_sender = msg::source();
            state.verify_status(inscribe_id, msg_sender, verifystatus.clone());

            let _ = msg::reply(Event::Verify { inscribe_id, verifystatus }, 0);      
        },
        Action::BalanceTest { id,  actor, amt } =>{
            let mut map: BTreeMap<ActorId, u128> = BTreeMap::new();
            map.insert(actor, amt);

            state.balances.insert(id, map);
        },
    }
}



#[no_mangle]

extern "C" fn state() {
    let query = gstd::msg::load().expect("failed to load query");
    let state = unsafe { INSCRIBEIOSTATES.as_mut().expect("failed to get state as mut").clone() };

    let reply = match query {
        Query::All => { Reply::All(state.clone()) },
        Query::Whoami => Reply::Whoami(gstd::msg::source()), // all zero addr
        Query::BlockNumber => Reply::BlockNumber(gstd::exec::block_height()),
        Query::BlockTimestamp => Reply::BlockTimestamp(gstd::exec::block_timestamp()),
        Query::ProgramId => Reply::ProgramId(gstd::exec::program_id()),
        Query::MessageId => Reply::MessageId(gstd::msg::id()),
        Query::QueryInscribe(index) => {
            let rt: Inscribe = state.map_inscribes.get_key_value(&InscribeIndexes(index)).expect("msg").1.clone();
            Reply::ReplyInscribe(rt)
        },
        Query::QueryInscribeByActorId(index, s58address) => {
            let actor_amt_map = state.balances.get_key_value(&InscribeIndexes(index)).expect("msg").1.clone();
            let actor: ActorId = ActorId::from_bs58(s58address).expect("get actorid from s58address meet error, please check");

            let amt = actor_amt_map.get_key_value(&actor).expect("msg").1.clone();
            Reply::ReplyInscribeByActorId(amt)
        },
        Query::QueryOrderById(id) => {
            let order = state.clone().get_order(id);
            Reply::ReplyOrderById(order)
        },
            
        // Query::Inscribes => Reply::Inscribes(100),
        // Query::InscribesOfActorId => Reply::InscribesOfActorId(ActorId::from_bs58("16CkY8WrzVREYNSvMJKd1nLQ2S8bjGbhoYCE95thV2CqSSXX".to_owned()).expect("msg")),
        // Query::BalanceOf(_, _) => todo!(),
        // Query::InscribeInfoByIndex(_) => todo!(),
        // Query::Inscribeowner => todo!(),
        // Query::Inscribestick => todo!(),
        // Query::InscribesMaxSupply => todo!(),
        // Query::InscribeTotalLimit => todo!(),
        // Query::InscribeMintPerActorid => todo!(),
        // Query::InscribeSlogan => todo!(),
        // Query::InscribeSocialLink => todo!(),
        // Query::InscribeIconLink => todo!(),
        // Query::InscribeFrame => todo!(),
        // Query::InscribeSupply => todo!(),
        // Query::InscribeBalances => todo!(),
        // Query::InscribeAllowances => todo!(),
        // Query::InscribeDecimals => todo!(),
        // Query::InscribeVerifyStatus => todo!(),
    };
    gstd::msg::reply(reply, 0).expect("Failed to share state");

}

