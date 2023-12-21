#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(Ownable)]
#[openbrush::contract]
mod nft_collection_factory {
    use common_traits::collection::traits::CollectionTraitRef;
    use common_traits::nft_collection_factory::impls::{
        collectionfactorytrait_external, CollectionFactoryTrait,
    };
    use common_traits::nft_collection_factory::types::{
        CollectionFactoryData, CollectionFactoryError, CollectionInfo,
    };
    use ink::env::CallFlags;
    use ink::prelude::{vec, vec::Vec};
    use ink::ToAccountId;
    use my_collection::CollectionRef;
    use openbrush::contracts::psp34::Id;
    use openbrush::contracts::traits::psp34::*;
    use openbrush::{contracts::ownable, traits::Storage};
    use openbrush::traits::String;
    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct NftCollectionFactory {
        #[storage_field]
        ownable: ownable::Data,
        #[storage_field]
        collection_data: CollectionFactoryData,
    }

    impl CollectionFactoryTrait for NftCollectionFactory {}

    //impl CollectionTrait for NftCollectionFactory {}
    impl NftCollectionFactory {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(collection_code_hash: Hash, creation_fee: Balance) -> Self {
            let mut instance = NftCollectionFactory::default();

            instance
                .initialize(collection_code_hash, creation_fee)
                .ok()
                .unwrap();

            instance
        }

        #[ink(message)]
        pub fn initialize(
            &mut self,
            collection_code_hash: Hash,
            creation_fee: Balance,
        ) -> Result<(), CollectionFactoryError> {
            self.collection_data.collection_code_hash = collection_code_hash;
            self.collection_data.collection_count = 0;
            self.collection_data.creation_fee = creation_fee;

            Ok(())
        }

        #[ink(message)]
        #[ink(payable)]
        pub fn create_collection(
            &mut self,
            name: String,
            symbol: String,
            description: String,
            base_uri: String,
        ) -> Result<(), CollectionFactoryError> {
            let creator = Self::env().caller();

            let collection_contract = CollectionRef::new(creator, name.clone(), symbol)
                .code_hash(self.collection_data.collection_code_hash)
                .endowment(0)
                .salt_bytes(self.collection_data.collection_count.to_le_bytes())
                .instantiate();
            let contract_account: AccountId = collection_contract.to_account_id();
            self.collection_data.collection_count += 1;


            let creator_collections = self.collection_data.creator_collections.get(&creator);
            // Existing collection for creator
            if let Some(mut collections) = creator_collections {
                collections.push(contract_account);
                self.collection_data
                    .creator_collections
                    .insert(&creator, &collections);
            } else {
                // First collection for that creator
                let collections = vec![contract_account];
                self.collection_data
                    .creator_collections
                    .insert(&creator, &collections);
            }
            let new_collection = CollectionInfo {
                name,
                uri: base_uri,
                description,
                nft_collection_address: Some(contract_account),
                creator: Some(creator),
            };
            self.collection_data
                .collection_info
                .insert(&contract_account, &new_collection);

            self.collection_data
                .collection_by_id
                .insert(&self.collection_data.collection_count, &contract_account);
            Ok(())
        }

        #[ink(message)]
        pub fn distribute_nft(
            &mut self,
            nft_contract_address: AccountId,
            token_id: u64,
        ) -> Result<(), CollectionFactoryError> {
            let caller = Self::env().caller();
            let collection_info = self
                .collection_data
                .collection_info
                .get(&nft_contract_address);
            if let Some(collection) = collection_info {
                let creator = collection.creator.unwrap();
                assert!(caller == creator, "You are not owner");
                // Check if this contract has been approved to be able to transfer the NFT on owner behalf
                let allowance = CollectionTraitRef::allowance(
                    &nft_contract_address,
                    caller,
                    self.env().account_id(),
                    Some(Id::U64(token_id.clone())),
                );
                if !allowance {
                    return Err(CollectionFactoryError::NotApproved);
                }
                if PSP34Ref::transfer_builder(
                    &nft_contract_address,
                    self.env().account_id(),
                    Id::U64(token_id),
                    Vec::<u8>::new(),
                )
                .call_flags(CallFlags::default().set_allow_reentry(true))
                .invoke()
                .is_err()
                {
                    return Err(CollectionFactoryError::CannotTransfer);
                }
            } else {
                return Err(CollectionFactoryError::CollectionNotExist);
            }

            Ok(())
        }

        #[ink(message)]
        pub fn claim_nft(
            &mut self,
            nft_contract_address: AccountId,
            token_id: u64,
        ) -> Result<(), CollectionFactoryError> {
            let caller = self.env().caller();

            if CollectionTraitRef::transfer(
                &nft_contract_address,
                caller,
                Id::U64(token_id),
                Vec::<u8>::new(),
            )
            .is_err()
            {
                return Err(CollectionFactoryError::CannotTransfer);
            } else {
                return Ok(());
            }
        }
    }
}
