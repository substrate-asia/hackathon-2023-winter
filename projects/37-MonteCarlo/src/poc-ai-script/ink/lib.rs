#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod charge_job_fee {
    use ink::storage::Mapping;

    type PoolId = u32;
    type JobId = u32;

    #[ink(storage)]
    pub struct ChargeJobFee {
        fees: Mapping<(PoolId, JobId, AccountId), Balance>,
    }

    impl Default for ChargeJobFee {
        fn default() -> Self {
            Self {
                fees: Mapping::new()
            }
        }
    }

    impl ChargeJobFee {
        #[ink(constructor)]
        pub fn new() -> Self {
            Default::default()
        }

        #[ink(message, payable, selector = 1)]
        pub fn on_job_creating(&mut self, pool_id: PoolId, job_id: JobId) {
            let caller = self.env().caller();
            let transferred = self.env().transferred_value();
            self.fees.insert((pool_id, job_id, &caller), &transferred);
        }

        #[ink(message, payable, selector = 1)]
        pub fn on_job_success(&mut self, pool_id: PoolId, job_id: JobId) {
            // TODO:
        }

        #[ink(message, payable, selector = 1)]
        pub fn on_job_failed(&mut self, pool_id: PoolId, job_id: JobId) {
            // TODO:
        }
    }
}
