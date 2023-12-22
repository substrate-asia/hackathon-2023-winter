#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod hkt_plats {
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;
    #[ink(storage)]
    pub struct HktPlats {
        owner: AccountId,
        participants: Mapping<AccountId, Balance>,
    }

    #[ink(event)]
    pub struct Deposited {
        #[ink(topic)]
        from: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct Rewarded {
        #[ink(topic)]
        from: AccountId,
        #[ink(topic)]
        to: AccountId,
        amount: Balance,
    }

    impl HktPlats {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(owner: AccountId) -> Self {
            Self {
                owner,
                participants: Mapping::new(),
            }
        }

        #[ink(message, payable)]
        pub fn deposit(&mut self) {
            let balance = self.env().transferred_value();
            let sender = self.env().caller();
            let old_balance = self.participants.get(sender).unwrap_or(0);
            self.participants.insert(sender, &(old_balance + balance));
            self.env().emit_event(Deposited {
                from: sender,
                amount: balance,
            })
        }

        #[ink(message)]
        pub fn reward(&mut self, lucky_user: Vec<AccountId>) {
            let length_person = u128::try_from(lucky_user.len()).unwrap();
            let caller = self.env().caller();
            let balance_caller = self.participants.get(caller).unwrap_or(0);
            if balance_caller == 0 {
                panic!("The amount must be greater than zero")
            }
            let token_per_person = balance_caller / length_person;
            for user in lucky_user.iter() {
                let res = self.env().transfer(user.clone(), token_per_person);
                match res.ok() {
                    Some(_) => self.env().emit_event(Rewarded {
                        from: caller,
                        to: *user,
                        amount: token_per_person,
                    }),
                    None => panic!("rewarded failed"),
                }
            }
            self.participants.insert(caller, &0);
        }

        #[ink(message)]
        pub fn getBalance(&mut self) -> u128 {
            let caller = self.env().caller();
            self.participants.get(caller).unwrap()
        }
    }
}
