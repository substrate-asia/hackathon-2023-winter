use gstd::Encode;
use gtest::{Program, System};
use kee_bee_io::*;
const USERS: &[u64] = &[3, 4, 5];

fn init_with_mint(sys: &System) {
    sys.init_logger();
    // load the contract.
    let ft = Program::current_opt(sys);
    // 68750000
    let res = ft.send(
        USERS[0],
        InitConfig {
            protocol_fee_destination: USERS[2].into(),
            protocol_fee_percent: 100000000000,
            subject_fee_percent: 100000000000,
            max_fee_percent: 100000000000,
            max_amount: 1,
        },
    );

    assert!(!res.main_failed());

}

#[test]
fn buy_share() {
    let sys = System::new();
    init_with_mint(&sys);
    const ETH1: u128 = 10u128.pow(12);
    let ft = sys.get_program(1);
    // buy first share by other people failed.
    let buy_share_res = ft.send(USERS[1], KBAction::BuyShare {
        shares_subject: USERS[2].into(),
        amount: 1,
    });
    assert!(buy_share_res.main_failed());
    // println!("buy_share_res is:{buy_share_res:?}");
    println!("end buy first share by other people failed-----------------");

    // buy share amount too high
    // await expect(keeBeeSharesV1Contract.connect(friend).buyShares(friend.address,2,{from:friend.address,value:buySharePrice})).to.be.revertedWith("amount too high");
    let buy_share_amount_too_high = ft.send(USERS[1], KBAction::BuyShare {
        shares_subject: USERS[1].into(),
        amount: 2,
    });

    assert!(buy_share_amount_too_high.main_failed());
    println!("buy share amount too high-----------------");
    

    // buy first share by self success.

    let state:StateReply = ft.read_state(StateQuery::FullState).expect("read fullstate error");
    if let StateReply::FullState(io_kee_bee_share) = state{
        assert!(io_kee_bee_share.protocol_fee_percent==100000000000,"protocolFeePercent test fail");
        assert!(io_kee_bee_share.subject_fee_percent==100000000000,"subject_fee_percent test fail");
    }

    let buy_price:StateReply = ft.read_state(StateQuery::BuyPrice { shares_subject: USERS[1].into(), amount: 1 }).expect("read buy price error!");
    if let StateReply::Price(price) = buy_price{
        assert!(price == 0,"buy price error!");
    }

    let buy_share_res = ft.send(USERS[1], KBAction::BuyShare {
        shares_subject: USERS[1].into(),
        amount: 1,
    });
    assert!(!buy_share_res.main_failed());

    println!("-------------------------------------");
    // let buy_share_log = buy_share_res.log();
    // println!("buy_share_log is:{buy_share_log:?}");

    assert!(buy_share_res.contains(&(
        USERS[1],
        KBEvent::Trade {
            trader: USERS[1].into(),
            subject: USERS[1].into(),
            is_buy: true,
            share_amount: 1,
            eth_amount: 0,
            protocol_eth_amount: 0,
            subject_eth_amount: 0,
            supply: 1
        }.encode()
    )));

    let user_has_subject_share_amount:StateReply = ft.read_state(StateQuery::SubjectShareUser { subject: USERS[1].into(), user: USERS[1].into() }).expect("user have the subject share read error!");
    println!("user_has_subject_share_amount is:{:?}",user_has_subject_share_amount);

    // buy share twice
    let buy_second_price:StateReply = ft.read_state(StateQuery::Price{supply: 1, amount: 1 }).expect("read buy price error!");
    let mut price:u128=0;
    if let StateReply::Price(p)=buy_second_price{
        price = p;
    }
    println!("price is-----------------------:{:?}",price);
    let protocol_fee = price*100000000000/ETH1;
    println!("protocol_fee is-----------------------:{:?}",protocol_fee);
    let subject_fee = price*100000000000/ETH1;
    println!("subject_fee is-----------------------:{:?}",subject_fee);

    let buy_second_price_after_fee:StateReply = ft.read_state(StateQuery::BuyPriceAfterFee { shares_subject: USERS[1].into(), amount: 1 }).expect("read buy price error!");
    println!("buy_second_price_after_fee is:{:?}",buy_second_price_after_fee);
    if let StateReply::Price(price_after_fee) = buy_second_price_after_fee{
        assert!(price_after_fee == 120000000000000,"buy price error!");
    }
    sys.mint_to(USERS[1], 120000000000000);
    
    let buy_second_share_res = ft.send_with_value(USERS[1], KBAction::BuyShare {
        shares_subject: USERS[1].into(),
        amount: 1,
    },120000000000000);

    assert!(!buy_second_share_res.main_failed());
    
    assert!(buy_second_share_res.contains(&(
        USERS[1],
        KBEvent::Trade {
            trader: USERS[1].into(),
            subject: USERS[1].into(),
            is_buy: true,
            share_amount: 1,
            eth_amount: price,
            protocol_eth_amount: protocol_fee,
            subject_eth_amount: subject_fee,
            supply: 2
        }.encode()
    )));

    // to check the user has the share
    let user_has_subject_share_amount:StateReply = ft.read_state(StateQuery::SubjectShareUser { subject: USERS[1].into(), user: USERS[1].into() }).expect("user have the subject share read error!");
    println!("user_has_subject_share_amount is:{:?}",user_has_subject_share_amount);
    let mut user_share_amount = 0;
    if let StateReply::ShareAmount(share_amount) = user_has_subject_share_amount{
        user_share_amount = share_amount;
    }
    assert!(user_share_amount > 0,"user have no subject share!");


    // start to sell the share
    let sell_first_price:StateReply = ft.read_state(StateQuery::Price{supply: 2-1, amount: 1 }).expect("read price error!");
    if let StateReply::Price(p) = sell_first_price{
        price = p;
    }
    println!("price is-----------------------:{:?}",price);
    let protocol_fee = price*100000000000/ETH1;
    println!("protocol_fee is-----------------------:{:?}",protocol_fee);
    let subject_fee = price*100000000000/ETH1;
    println!("subject_fee is-----------------------:{:?}",subject_fee);

    let sell_second_price_after_fee:StateReply = ft
        .read_state(StateQuery::SellPriceAfterFee { shares_subject: USERS[1].into(), amount: 1 })
        .expect("read buy price error!");
    println!("sell_second_price_after_fee is:{:?}",sell_second_price_after_fee);
    

    sys.mint_to(USERS[1], 1000000000000000000000);
    let sell_second_share_res = ft.send(USERS[1], KBAction::SellShare {
        shares_subject: USERS[1].into(),
        amount: 1,
    });

    assert!(!sell_second_share_res.main_failed());

    assert!(sell_second_share_res.contains(&(
        USERS[1],
        KBEvent::Trade {
            trader: USERS[1].into(),
            subject: USERS[1].into(),
            is_buy: false,
            share_amount: 1,
            eth_amount: price,
            protocol_eth_amount: protocol_fee,
            subject_eth_amount: subject_fee,
            supply: 1
        }.encode()
    )));
    
    let balance_user1 = sys.balance_of(USERS[1]);
    let contract_balance=ft.balance();
    println!("after sell contract_balance: {:?}", contract_balance);
    // TODO: check the balance of user1
    println!("balance_user1: {:?}", balance_user1);
    // start to sell first
    let sell_first_share_res = ft.send(USERS[1], KBAction::SellShare {
        shares_subject: USERS[1].into(),
        amount: 1,
    });

    assert!(sell_first_share_res.main_failed());

}

// #[test]
// fn burn() {
//     let sys = System::new();
//     init_with_mint(&sys);
//     let ft = sys.get_program(1);
//     let res = ft.send(USERS[0], FTAction::Burn(1000));
//     assert!(res.contains(&(
//         USERS[0],
//         FTEvent::Transfer {
//             from: USERS[0].into(),
//             to: 0.into(),
//             amount: 1000,
//         }
//         .encode()
//     )));
//     let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[0].into()));
//     assert!(res.contains(&(USERS[0], FTEvent::Balance(999000).encode())));
// }

// #[test]
// fn burn_failures() {
//     let sys = System::new();
//     sys.init_logger();
//     init_with_mint(&sys);
//     let ft = sys.get_program(1);
//     // must fail since the amount > the user balance
//     let res = ft.send(USERS[0], FTAction::Burn(1000001));
//     assert!(res.main_failed());
// }

// #[test]
// fn transfer() {
//     let sys = System::new();
//     init_with_mint(&sys);
//     let ft = sys.get_program(1);
//     let res = ft.send(
//         USERS[0],
//         FTAction::Transfer {
//             from: USERS[0].into(),
//             to: USERS[1].into(),
//             amount: 500,
//         },
//     );

//     assert!(res.contains(&(
//         USERS[0],
//         FTEvent::Transfer {
//             from: USERS[0].into(),
//             to: USERS[1].into(),
//             amount: 500,
//         }
//         .encode()
//     )));

//     // check that the balance of `USER[0]` decreased and the balance of `USER[1]` increased
//     let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[0].into()));
//     assert!(res.contains(&(USERS[0], FTEvent::Balance(999500).encode())));
//     let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[1].into()));
//     assert!(res.contains(&(USERS[0], FTEvent::Balance(500).encode())));
// }

// #[test]
// fn transfer_failures() {
//     let sys = System::new();
//     init_with_mint(&sys);
//     let ft = sys.get_program(1);
//     //must fail since the amount > balance
//     let res = ft.send(
//         USERS[0],
//         FTAction::Transfer {
//             from: USERS[0].into(),
//             to: USERS[1].into(),
//             amount: 2000000,
//         },
//     );
//     assert!(res.main_failed());

//     //must fail transfer to zero address
//     let res = ft.send(
//         USERS[2],
//         FTAction::Transfer {
//             from: USERS[0].into(),
//             to: 0.into(),
//             amount: 100,
//         },
//     );
//     assert!(res.main_failed());
// }

// #[test]
// fn approve_and_transfer() {
//     let sys = System::new();
//     init_with_mint(&sys);
//     let ft = sys.get_program(1);

//     let res = ft.send(
//         USERS[0],
//         FTAction::Approve {
//             to: USERS[1].into(),
//             amount: 500,
//         },
//     );
//     assert!(res.contains(&(
//         USERS[0],
//         FTEvent::Approve {
//             from: USERS[0].into(),
//             to: USERS[1].into(),
//             amount: 500,
//         }
//         .encode()
//     )));

//     let res = ft.send(
//         USERS[1],
//         FTAction::Transfer {
//             from: USERS[0].into(),
//             to: USERS[2].into(),
//             amount: 200,
//         },
//     );
//     assert!(res.contains(&(
//         USERS[1],
//         FTEvent::Transfer {
//             from: USERS[0].into(),
//             to: USERS[2].into(),
//             amount: 200,
//         }
//         .encode()
//     )));

//     // check that the balance of `USER[0]` decreased and the balance of `USER[1]` increased
//     let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[0].into()));
//     assert!(res.contains(&(USERS[0], FTEvent::Balance(999800).encode())));
//     let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[2].into()));
//     assert!(res.contains(&(USERS[0], FTEvent::Balance(200).encode())));

//     // must fail since not enough allowance
//     let res = ft.send(
//         USERS[1],
//         FTAction::Transfer {
//             from: USERS[0].into(),
//             to: USERS[2].into(),
//             amount: 800,
//         },
//     );
//     assert!(res.main_failed());
// }
