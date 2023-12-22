#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod betting {
    use chrono::{DateTime, Utc};

    use ink::env::hash;
    use ink::prelude::{string::String, vec::Vec};
    use ink::storage::Mapping;

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
    pub enum Error {
        /// Caller is not a final decision maker
        NotFinalDecisionMaker,
        /// The requested Bet does not exist
        BetDoesNotExist,
        /// Bettor can only be 1 or 2
        BettorDoesNotExist,
        /// The String is not in a parseable datetime format
        NotDatetimeString,
        /// Not enough was sent
        InssufficientAmountOfTokensSent,
        /// Cannot reject bet if account id does not correspond to bettor 2's
        NotBettor2,
        /// The caller is not a valid party to the bet
        CallerNotValidBettor,
        InvalidStateForCallingFunction,
        AlreadyWithdrewWinnings,
    }

    /// Different states that a bet can be in
    #[derive(Debug, Clone, Copy, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
    pub enum BetState {
        Created,
        BetAcceptedByBettor2,
        BetRefusedByBettor2,
        Bettor1Voted,
        Bettor2Voted,
        Bettor1Wins,
        Bettor2Wins,
        BettorsDrew,
        BettorsDisagree,
        YetToPayBettor1,
        YetToPayBettor2,
        Concluded,
    }

    /// Different states that a bet's outcome can be in
    #[derive(Debug, Clone, Copy, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
    pub enum BetOutcome {
        Draw,
        Bettor1Wins,
        Bettor2Wins,
        /// Undecideable could be because the terms turned out not to be sufficiently clear
        Undecideable,
    }

    /// Information regarding a particular bet
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
    pub struct Bet {
        /// How much is wagered on the event's outcome
        amount_wagered: Balance,
        /// Who is bettor 1?
        bettor_1: Option<AccountId>,
        /// Who is bettor 2?
        bettor_2: Option<AccountId>,
        /// How is the winner decided?
        criteria_for_winning: String,
        /// When will the event conclude by (in unix timestamp, milliseconds)
        event_decided_by: String,
        ///
        outcome_claimed_by_bettor_1: Option<BetOutcome>,
        ///
        outcome_claimed_by_bettor_2: Option<BetOutcome>,
        ///
        reviewer: Option<AccountId>,
        ///
        outcome_claimed_by_reviewer: Option<BetOutcome>,
        ///
        state: BetState,
    }

    #[ink(storage)]
    pub struct Betting {
        /// The amount bettor_1 pays the smart contract to create a bet
        bet_creation_fee: Balance,
        /// A set of registered reviewers
        reviewers: Mapping<AccountId, ()>,
        /// How many registered reviewers there are
        number_of_reviewers: u32,
        /// The accountId that has final say should a reviewer's decision be appealed
        final_decision_maker: AccountId,
        /// Number of bets that have been made
        latest_bet: u32,
        /// A vector of bet information
        bets: Vec<Bet>,
        salt: u128,
    }

    impl Betting {
        #[ink(constructor)]
        pub fn new(final_decision_maker: AccountId, bet_creation_fee: Balance) -> Self {
            Self {
                bet_creation_fee,
                reviewers: Mapping::default(),
                number_of_reviewers: 0,
                final_decision_maker,
                latest_bet: 0,
                bets: Vec::default(),
                salt: u128::default(),
            }
        }

        // --------------------------------------------------------
        // Helper functions
        // --------------------------------------------------------
        /// A pseudo-random number generator made to go from 0 to `max_value`.
        /// Taken from https://docs.astar.network/docs/build/builder-guides/xvm_wasm/pseudo_random/
        #[ink(message)]
        pub fn get_pseudo_random(&mut self, max_value: u8) -> u8 {
            let seed = self.env().block_timestamp();
            let mut input: Vec<u8> = Vec::new();
            input.extend_from_slice(&seed.to_be_bytes());
            input.extend_from_slice(&self.salt.to_be_bytes());
            let mut output = <hash::Keccak256 as hash::HashOutput>::Type::default();
            ink::env::hash_bytes::<hash::Keccak256>(&input, &mut output);
            self.salt += 1;
            let number = output[0] % (max_value + 1);
            number
        }

        /// Get contract balance
        #[ink(message)]
        pub fn balance(&self) -> Result<Balance, ()> {
            Ok(self.env().balance())
        }

        /// Get bet creation fee
        #[ink(message)]
        pub fn get_bet_creation_fee(&self) -> Result<Balance, ()> {
            Ok(self.bet_creation_fee)
        }

        /// Get current block timestamp
        #[ink(message)]
        pub fn get_current_block_timestamp(&self) -> Result<u64, Error> {
            Ok(self.env().block_timestamp())
        }

        /// Convert datetime to milliseconds since Unix epoch
        #[ink(message)]
        pub fn convert_datetime_to_ms(&self, dt: String) -> Result<i64, Error> {
            match dt.as_str().parse::<DateTime<Utc>>() {
                Ok(y) => Ok(y.timestamp_millis()),
                Err(_) => Err(Error::NotDatetimeString),
            }
        }

        /// Check if current datetime is past specified datetime
        #[ink(message)]
        pub fn has_past_datetime(&self, dt: String) -> Result<bool, Error> {
            let now = self.env().block_timestamp();
            match dt.as_str().parse::<DateTime<Utc>>() {
                Ok(y) => Ok(now as i128 > y.timestamp_millis() as i128),
                Err(_) => Err(Error::NotDatetimeString),
            }
        }

        // --------------------------------------------------------
        // Bet-related functions
        // --------------------------------------------------------
        #[ink(message, payable)]
        pub fn create_bet(
            &mut self,
            amount_to_wager: Balance,
            bettor_2: Option<AccountId>,
            criteria_for_winning: String,
            event_decided_by: String,
        ) -> Result<Option<u32>, Error> {
            if self.env().transferred_value() < self.bet_creation_fee + amount_to_wager {
                return Err(Error::InssufficientAmountOfTokensSent);
            }
            if event_decided_by.as_str().parse::<DateTime<Utc>>().is_err() {
                return Err(Error::NotDatetimeString);
            }

            let bet = Bet {
                amount_wagered: amount_to_wager,
                bettor_1: Some(self.env().caller()),
                bettor_2,
                criteria_for_winning,
                event_decided_by,
                state: BetState::Created,
                outcome_claimed_by_bettor_1: None,
                outcome_claimed_by_bettor_2: None,
                reviewer: None,
                outcome_claimed_by_reviewer: None,
            };
            // update latest bet number
            let bet_number = self.latest_bet;
            self.latest_bet = self.latest_bet + 1;

            self.bets.push(bet);
            Ok(Some(bet_number))
        }

        #[ink(message, payable)]
        pub fn reject_bet(&mut self, n: u32) -> Result<bool, Error> {
            let caller = self.env().caller();

            match self.bets.get_mut(n as usize) {
                Some(x) => match x.bettor_2 {
                    Some(bettor) => {
                        if bettor == caller {
                            x.state = BetState::BetRefusedByBettor2;
                        } else {
                            return Err(Error::NotBettor2);
                        }
                        Ok(true)
                    }
                    None => Err(Error::NotBettor2),
                },
                None => Err(Error::BetDoesNotExist),
            }
        }

        #[ink(message, payable)]
        pub fn get_amount_transferred(&mut self) -> Result<Balance, ()> {
            Ok(self.env().transferred_value())
        }

        #[ink(message, payable)]
        pub fn accept_bet(&mut self, n: u32) -> Result<bool, Error> {
            let caller = self.env().caller();
            let transferred_amount = self.env().transferred_value();

            match self.bets.get_mut(n as usize) {
                Some(x) => {
                    // make sure bettor2 candidate sent enough tokens
                    if transferred_amount < x.amount_wagered {
                        return Err(Error::InssufficientAmountOfTokensSent);
                    }

                    // allow caller to accept bet if either
                    //   1. bettor2 has not been assigned by bettor1 or
                    //   2. bettor2 has been assigned by bettor1 and is caller
                    match x.bettor_2 {
                        Some(bettor) => {
                            if bettor == caller {
                                x.state = BetState::BetAcceptedByBettor2;
                            } else {
                                return Err(Error::NotBettor2);
                            }
                            Ok(true)
                        }
                        None => {
                            x.state = BetState::BetAcceptedByBettor2;
                            x.bettor_2 = Some(caller);
                            Ok(true)
                        }
                    }
                }
                None => Err(Error::BetDoesNotExist),
            }
        }

        /// (For bettors): Submit event's outcome.
        ///   winner = 0 (draw), 1 (bettor1 wins), or 2 (bettor2 wins)
        #[ink(message, payable)]
        pub fn submit_outcome(&mut self, n: u32, winner: u8) -> Result<(), Error> {
            let caller = self.env().caller();
            let bet;
            match self.bets.get_mut(n as usize) {
                Some(y) => bet = y,
                None => {
                    return Err(Error::BetDoesNotExist);
                }
            }

            // figure out what state `winner` corresponds to
            let outcome = match winner {
                0 => BetOutcome::Draw,
                1 => BetOutcome::Bettor1Wins,
                2 => BetOutcome::Bettor2Wins,
                _ => BetOutcome::Undecideable,
            };

            // check if caller is bettor 1
            if bet.bettor_1.unwrap() == caller {
                // update state
                if bet.state == BetState::Bettor2Voted {
                    bet.state = match (outcome, bet.outcome_claimed_by_bettor_2.unwrap()) {
                        (BetOutcome::Draw, BetOutcome::Draw) => BetState::BettorsDrew,
                        (BetOutcome::Undecideable, BetOutcome::Undecideable) => {
                            BetState::BettorsDrew
                        }
                        (BetOutcome::Bettor1Wins, BetOutcome::Bettor1Wins) => BetState::Bettor1Wins,
                        (BetOutcome::Bettor2Wins, BetOutcome::Bettor2Wins) => BetState::Bettor2Wins,
                        _ => BetState::BettorsDisagree,
                    }
                } else if bet.state == BetState::BetAcceptedByBettor2 {
                    bet.outcome_claimed_by_bettor_1 = Some(outcome);
                    bet.state = BetState::Bettor1Voted;
                } else {
                    return Err(Error::InvalidStateForCallingFunction);
                }

                return Ok(());
            }

            // check if caller is bettor 2
            match bet.bettor_2 {
                Some(bettor_2) if bettor_2 == caller => {
                    // update state
                    if bet.state == BetState::Bettor1Voted {
                        bet.state = match (bet.outcome_claimed_by_bettor_1.unwrap(), outcome) {
                            (BetOutcome::Draw, BetOutcome::Draw) => BetState::BettorsDrew,
                            (BetOutcome::Undecideable, BetOutcome::Undecideable) => {
                                BetState::BettorsDrew
                            }
                            (BetOutcome::Bettor1Wins, BetOutcome::Bettor1Wins) => {
                                BetState::Bettor1Wins
                            }
                            (BetOutcome::Bettor2Wins, BetOutcome::Bettor2Wins) => {
                                BetState::Bettor2Wins
                            }
                            _ => BetState::BettorsDisagree,
                        }
                    } else if bet.state == BetState::BetAcceptedByBettor2 {
                        bet.outcome_claimed_by_bettor_2 = Some(outcome);
                        bet.state = BetState::Bettor2Voted;
                    } else {
                        return Err(Error::InvalidStateForCallingFunction);
                    }
                    return Ok(());
                }
                _ => {}
            }

            Err(Error::CallerNotValidBettor)
        }

        #[ink(message, payable)]
        pub fn withdraw_winnings(&mut self, n: u32) -> Result<bool, Error> {
            // update bet's state to "concluded"
            let x = self.bets.get(n as usize);
            if x.is_none() {
                return Err(Error::BetDoesNotExist);
            }

            // pay winnings
            let mut concluded = true;
            let mut yet_to_pay_1 = false;
            let mut yet_to_pay_2 = false;
            match x {
                None => {}
                Some(bet) => {
                    // if bettors agree on outcome, send money to correct better(s)
                    match bet.state {
                        BetState::Bettor1Wins | BetState::YetToPayBettor1 => {
                            concluded = self
                                .env()
                                .transfer(bet.bettor_1.unwrap(), 2 * bet.amount_wagered)
                                .is_ok();
                        }
                        BetState::Bettor2Wins | BetState::YetToPayBettor2 => {
                            concluded = self
                                .env()
                                .transfer(bet.bettor_2.unwrap(), 2 * bet.amount_wagered)
                                .is_ok();
                        }
                        BetState::BettorsDrew => {
                            if self
                                .env()
                                .transfer(bet.bettor_1.unwrap(), bet.amount_wagered)
                                .is_err()
                            {
                                yet_to_pay_1 = true;
                                concluded = false;
                            }
                            if self
                                .env()
                                .transfer(bet.bettor_2.unwrap(), bet.amount_wagered)
                                .is_err()
                            {
                                yet_to_pay_2 = true;
                                concluded = false;
                            }
                        }
                        BetState::BettorsDisagree => {}
                        BetState::Concluded => return Err(Error::AlreadyWithdrewWinnings),
                        _ => {}
                    }
                }
            }

            let bet = self.bets.get_mut(n as usize).unwrap();
            match concluded {
                true => {
                    bet.state = BetState::Concluded;
                }
                false => {
                    if bet.state == BetState::BettorsDrew {
                        if yet_to_pay_1 && yet_to_pay_2 {
                            ();
                        } else if yet_to_pay_1 {
                            bet.state = BetState::YetToPayBettor1
                        } else if yet_to_pay_2 {
                            bet.state = BetState::YetToPayBettor2
                        }
                    }
                    // else, do nothing
                }
            }

            Ok(concluded)
        }

        /// Get amount wagered
        #[ink(message)]
        pub fn get_amount_wagered(&self, n: u32) -> Result<Balance, Error> {
            match self.bets.get(n as usize) {
                Some(x) => Ok(x.amount_wagered),
                None => Err(Error::BetDoesNotExist),
            }
        }

        /// Get datetime of when even finishes by
        #[ink(message)]
        pub fn get_event_decided_by(&self, n: u32) -> Result<String, Error> {
            match self.bets.get(n as usize) {
                Some(x) => Ok(x.event_decided_by.clone()),
                None => Err(Error::BetDoesNotExist),
            }
        }

        /// Get datetime of when even finishes by
        #[ink(message)]
        pub fn get_event_decided_by_as_ms(&self, n: u32) -> Result<i64, Error> {
            match self.bets.get(n as usize) {
                Some(x) => self.convert_datetime_to_ms(x.event_decided_by.clone()),
                None => Err(Error::BetDoesNotExist),
            }
        }

        /// Get bet state
        #[ink(message)]
        pub fn get_bet_state(&self, n: u32) -> Result<BetState, Error> {
            match self.bets.get(n as usize) {
                Some(x) => Ok(x.state),
                None => Err(Error::BetDoesNotExist),
            }
        }

        /// Get criteria for winning
        #[ink(message)]
        pub fn get_criteria_for_winning(&self, n: u32) -> Result<String, Error> {
            match self.bets.get(n as usize) {
                Some(x) => Ok(x.criteria_for_winning.clone()),
                None => Err(Error::BetDoesNotExist),
            }
        }

        /// Get bettor account id
        #[ink(message)]
        pub fn get_bettor_account_id(
            &self,
            n: u32,
            bettor: u8,
        ) -> Result<Option<AccountId>, Error> {
            match self.bets.get(n as usize) {
                Some(x) => match bettor {
                    1 => Ok(x.bettor_1),
                    2 => Ok(x.bettor_2),
                    _ => Err(Error::BettorDoesNotExist),
                },
                None => Err(Error::BetDoesNotExist),
            }
        }

        // --------------------------------------------------------
        // Reputation-related functions
        // --------------------------------------------------------
        #[ink(message)]
        pub fn register_as_reviewer(&mut self) -> Result<(), ()> {
            self.reviewers.insert(self.env().caller(), &());
            self.number_of_reviewers += 1;
            Ok(())
        }

        #[ink(message)]
        pub fn is_registered_as_reviewer(&self) -> Result<bool, ()> {
            Ok(self.reviewers.contains(self.env().caller()))
        }

        #[ink(message)]
        pub fn is_final_decision_maker(&self) -> Result<bool, ()> {
            Ok(self.final_decision_maker == self.env().caller())
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        fn default_accounts() -> ink::env::test::DefaultAccounts<ink::env::DefaultEnvironment> {
            ink::env::test::default_accounts::<Environment>()
        }

        fn set_next_caller(caller: AccountId) {
            ink::env::test::set_caller::<Environment>(caller)
        }

        fn create_sample_bet(
            betting: &mut Betting,
            bob: Option<AccountId>,
            amount_to_wager: Balance,
            fee: Balance,
        ) -> u32 {
            let event_concludes_by = String::from("2023-12-21T00:00:00Z");
            let criteria_for_winning: String =
                "Red wins game against blue on December 21st, 2023.".into();

            ink::env::pay_with_call!(
                betting.create_bet(
                    amount_to_wager,
                    bob,
                    criteria_for_winning.clone(),
                    event_concludes_by.clone()
                ),
                amount_to_wager + 2 * fee
            )
            .unwrap()
            .unwrap()
        }

        #[cfg(any(feature = "runtime-benchmarks", feature = "std"))]
        #[ink::test]
        fn test_helper_function() {
            let alice = default_accounts().alice;
            set_next_caller(alice);
            let betting = Betting::new(alice, 1);

            let dt1 = String::from("2022-01-01T12:34:56Z");
            let dt2 = String::from("2023-12-22T00:00:00Z");

            // timestamp requires the `Z` at the end to specify UTC timezone
            assert_eq!(
                betting.has_past_datetime("2023-12-22T00:00:00".into()),
                Err(Error::NotDatetimeString)
            );
            assert_eq!(
                betting.convert_datetime_to_ms(dt1.clone()),
                Ok(1_641_040_496_000)
            );

            assert_eq!(
                betting.convert_datetime_to_ms(dt2.clone()),
                Ok(1_703_203_200_000)
            );
        }

        #[ink::test]
        fn register_alice() {
            let alice = default_accounts().alice;
            set_next_caller(alice);
            let mut betting = Betting::new(alice, 1);

            // not registered yet
            assert_eq!(
                betting.is_registered_as_reviewer(),
                Ok(false),
                "Alice was already registered"
            );

            assert_eq!(
                betting.number_of_reviewers, 0,
                "Smart contract was initialized with at least 1 reviewer."
            );

            // but is final decision maker
            assert_eq!(
                betting.is_final_decision_maker(),
                Ok(true),
                "Alice is not the final decision maker"
            );

            let register = betting.register_as_reviewer();
            assert!(register.is_ok(), "Unable to register Alice.");

            // registered
            assert_eq!(
                betting.is_registered_as_reviewer(),
                Ok(true),
                "Alice is not registered"
            );

            assert_eq!(betting.number_of_reviewers, 1, "Wrong number of reviewers.");
        }

        #[ink::test]
        fn create_bet() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;
            let event_concludes_by = String::from("2023-12-21T00:00:00Z");

            set_next_caller(alice);

            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);
            assert!(betting.balance().unwrap() == 1_000_000); // alice has 1 million to begin with

            let criteria_for_winning: String =
                "Red wins game against blue on December 21st, 2023.".into();

            let amount_to_wager = 100_000;
            let amount_sent = amount_to_wager + 2 * fee;
            let bet_number = ink::env::pay_with_call!(
                betting.create_bet(
                    amount_to_wager,
                    Some(bob),
                    criteria_for_winning.clone(),
                    event_concludes_by.clone()
                ),
                amount_sent
            )
            .unwrap()
            .unwrap();
            assert_eq!(bet_number, 0);

            // check using getter methods
            assert_eq!(
                betting.get_bettor_account_id(bet_number, 1),
                Ok(Some(alice))
            );
            assert_eq!(betting.get_bettor_account_id(bet_number, 2), Ok(Some(bob)));
            assert_eq!(
                betting.get_criteria_for_winning(bet_number),
                Ok(criteria_for_winning)
            );
            assert_eq!(
                betting.get_event_decided_by(bet_number),
                Ok(event_concludes_by)
            );
            assert_eq!(
                betting.get_event_decided_by_as_ms(bet_number),
                Ok(1703116800000)
            );
            assert_eq!(betting.get_bet_state(bet_number), Ok(BetState::Created));
            let amount_wagered = betting.get_amount_wagered(bet_number).unwrap();
            assert_eq!(
                amount_wagered, amount_to_wager,
                "Actual amount: {amount_wagered}"
            );
        }

        #[ink::test]
        fn create_and_accept_bet_when_bettor2_is_assgined() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;
            let charlie = default_accounts().charlie;

            set_next_caller(alice);
            let amount_to_wager = 100;
            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);
            let bet_number = create_sample_bet(&mut betting, Some(bob), amount_to_wager, fee);

            assert_eq!(betting.get_amount_wagered(bet_number), Ok(amount_to_wager));

            // Charlie should not be able to accept or reject the bet from Alice
            set_next_caller(charlie);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), 0),
                Err(Error::InssufficientAmountOfTokensSent)
            );
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Err(Error::NotBettor2)
            );
            assert_eq!(
                ink::env::pay_with_call!(betting.reject_bet(bet_number), 0),
                Err(Error::NotBettor2)
            );
            assert_eq!(
                ink::env::pay_with_call!(betting.reject_bet(bet_number), amount_to_wager),
                Err(Error::NotBettor2)
            );

            // Bob should be able to accept if he sent sufficient coins
            set_next_caller(bob);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), 0),
                Err(Error::InssufficientAmountOfTokensSent)
            );
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Ok(true)
            );
        }

        #[ink::test]
        fn create_and_reject_bet_when_bettor2_is_assgined() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;
            let charlie = default_accounts().charlie;

            set_next_caller(alice);
            let amount_to_wager = 100;
            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);
            let bet_number = create_sample_bet(&mut betting, Some(bob), amount_to_wager, fee);

            assert_eq!(betting.get_amount_wagered(bet_number), Ok(amount_to_wager));

            // Charlie should not be able to accept or reject the bet from Alice
            set_next_caller(charlie);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), 0),
                Err(Error::InssufficientAmountOfTokensSent)
            );
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Err(Error::NotBettor2)
            );
            assert_eq!(
                ink::env::pay_with_call!(betting.reject_bet(bet_number), 0),
                Err(Error::NotBettor2)
            );
            assert_eq!(
                ink::env::pay_with_call!(betting.reject_bet(bet_number), amount_to_wager),
                Err(Error::NotBettor2)
            );

            // Bob should be able to reject even if he sent zero coin
            set_next_caller(bob);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), 0),
                Err(Error::InssufficientAmountOfTokensSent)
            );
            assert_eq!(
                ink::env::pay_with_call!(betting.reject_bet(bet_number), 0),
                Ok(true)
            );
        }

        #[ink::test]
        fn bettors_agree_on_outcome_alice_wins() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;

            set_next_caller(alice);
            let amount_to_wager = 100;
            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);

            // alice creates bet
            let bet_number = create_sample_bet(&mut betting, Some(bob), amount_to_wager, fee);

            assert_eq!(betting.get_amount_wagered(bet_number), Ok(amount_to_wager));

            // bob accepts bet
            set_next_caller(bob);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Ok(true)
            );

            // Event ends: Alice wins!
            set_next_caller(alice);
            assert_eq!(betting.submit_outcome(bet_number, 1).is_ok(), true);
            assert_eq!(
                betting.get_bet_state(bet_number),
                Ok(BetState::Bettor1Voted)
            );

            set_next_caller(bob);
            assert_eq!(betting.submit_outcome(bet_number, 1).is_ok(), true);
            assert_eq!(betting.get_bet_state(bet_number), Ok(BetState::Bettor1Wins));

            set_next_caller(alice);
            assert_eq!(betting.withdraw_winnings(bet_number), Ok(true));
            assert_eq!(betting.get_bet_state(bet_number), Ok(BetState::Concluded));
            // Cannot withdraw winnings a 2nd time
            assert_eq!(
                betting.withdraw_winnings(bet_number),
                Err(Error::AlreadyWithdrewWinnings)
            );
        }

        #[ink::test]
        fn bettors_agree_on_outcome_bob_wins() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;

            set_next_caller(alice);
            let amount_to_wager = 100;
            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);

            // alice creates bet
            let bet_number = create_sample_bet(&mut betting, Some(bob), amount_to_wager, fee);

            assert_eq!(betting.get_amount_wagered(bet_number), Ok(amount_to_wager));

            // bob accepts bet
            set_next_caller(bob);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Ok(true)
            );

            // Event ends: Bob wins!
            set_next_caller(alice);
            assert_eq!(betting.submit_outcome(bet_number, 2).is_ok(), true);
            assert_eq!(
                betting.get_bet_state(bet_number),
                Ok(BetState::Bettor1Voted)
            );

            set_next_caller(bob);
            assert_eq!(betting.submit_outcome(bet_number, 2).is_ok(), true);
            assert_eq!(betting.get_bet_state(bet_number), Ok(BetState::Bettor2Wins));

            // bob withdraws winnings
            assert_eq!(betting.withdraw_winnings(bet_number), Ok(true));
            assert_eq!(betting.get_bet_state(bet_number), Ok(BetState::Concluded));
            // Cannot withdraw winnings a 2nd time
            assert_eq!(
                betting.withdraw_winnings(bet_number),
                Err(Error::AlreadyWithdrewWinnings)
            );
        }

        #[ink::test]
        fn bettors_agree_on_outcome_draw() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;

            set_next_caller(alice);
            let amount_to_wager = 100;
            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);

            // alice creates bet
            let bet_number = create_sample_bet(&mut betting, Some(bob), amount_to_wager, fee);

            assert_eq!(betting.get_amount_wagered(bet_number), Ok(amount_to_wager));

            // bob accepts bet
            set_next_caller(bob);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Ok(true)
            );

            // Event ends: Alice and Bob draws!
            set_next_caller(alice);
            assert_eq!(betting.submit_outcome(bet_number, 0).is_ok(), true);
            assert_eq!(
                betting.get_bet_state(bet_number),
                Ok(BetState::Bettor1Voted)
            );
            
            set_next_caller(bob);
            assert_eq!(betting.submit_outcome(bet_number, 0).is_ok(), true);
            assert_eq!(betting.get_bet_state(bet_number), Ok(BetState::BettorsDrew));

            set_next_caller(alice);
            assert_eq!(betting.withdraw_winnings(bet_number), Ok(true));
            assert_eq!(betting.get_bet_state(bet_number), Ok(BetState::Concluded));
            // Cannot withdraw winnings a 2nd time
            assert_eq!(
                betting.withdraw_winnings(bet_number),
                Err(Error::AlreadyWithdrewWinnings)
            );
        }

        #[ink::test]
        fn bettors_agree_on_outcome_undecideable() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;

            set_next_caller(alice);
            let amount_to_wager = 100;
            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);

            // alice creates bet
            let bet_number = create_sample_bet(&mut betting, Some(bob), amount_to_wager, fee);

            assert_eq!(betting.get_amount_wagered(bet_number), Ok(amount_to_wager));

            // bob accepts bet
            set_next_caller(bob);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Ok(true)
            );

            // Event ends: bettors agree that conditions for winning turned out to be unclear!
            set_next_caller(alice);
            assert_eq!(betting.submit_outcome(bet_number, 3).is_ok(), true);
            assert_eq!(
                betting.get_bet_state(bet_number),
                Ok(BetState::Bettor1Voted)
            );

            set_next_caller(bob);
            assert_eq!(betting.submit_outcome(bet_number, 3).is_ok(), true);
            assert_eq!(betting.get_bet_state(bet_number), Ok(BetState::BettorsDrew));
        }

        #[ink::test]
        fn bettors_disagree_on_outcome_voted_for_self() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;

            set_next_caller(alice);
            let amount_to_wager = 100;
            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);

            // alice creates bet
            let bet_number = create_sample_bet(&mut betting, Some(bob), amount_to_wager, fee);

            assert_eq!(betting.get_amount_wagered(bet_number), Ok(amount_to_wager));

            // bob accepts bet
            set_next_caller(bob);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Ok(true)
            );

            // Event ends: bettors disagree!
            set_next_caller(alice);
            assert_eq!(betting.submit_outcome(bet_number, 1).is_ok(), true);
            assert_eq!(
                betting.get_bet_state(bet_number),
                Ok(BetState::Bettor1Voted)
            );

            set_next_caller(bob);
            assert_eq!(betting.submit_outcome(bet_number, 2).is_ok(), true);
            assert_eq!(
                betting.get_bet_state(bet_number),
                Ok(BetState::BettorsDisagree)
            );
        }

        #[ink::test]
        fn bettors_disagree_on_outcome_alice_voted_for_self_bob_drew() {
            let alice = default_accounts().alice;
            let bob = default_accounts().bob;

            set_next_caller(alice);
            let amount_to_wager = 100;
            let fee: Balance = 10;
            let mut betting = Betting::new(alice, fee);

            // alice creates bet
            let bet_number = create_sample_bet(&mut betting, Some(bob), amount_to_wager, fee);

            assert_eq!(betting.get_amount_wagered(bet_number), Ok(amount_to_wager));

            // bob accepts bet
            set_next_caller(bob);
            assert_eq!(
                ink::env::pay_with_call!(betting.accept_bet(bet_number), amount_to_wager),
                Ok(true)
            );

            // Event ends: bettors disagree!
            set_next_caller(alice);
            assert_eq!(betting.submit_outcome(bet_number, 1).is_ok(), true);
            assert_eq!(
                betting.get_bet_state(bet_number),
                Ok(BetState::Bettor1Voted)
            );

            set_next_caller(bob);
            assert_eq!(betting.submit_outcome(bet_number, 0).is_ok(), true);
            assert_eq!(
                betting.get_bet_state(bet_number),
                Ok(BetState::BettorsDisagree)
            );
        }
    }
}
