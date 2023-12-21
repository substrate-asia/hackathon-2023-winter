use ink::prelude::vec::Vec;

use openbrush::traits::{AccountId, Hash, Storage};

use openbrush::contracts::{
    ownable, psp34,
    psp34::{extensions::metadata::PSP34MetadataImpl, PSP34Impl},
};

use crate::nft_collection_factory::types::{
    CollectionFactoryData, CollectionFactoryError, CollectionInfo,
};

#[openbrush::trait_definition]
pub trait CollectionFactoryTrait:
    Storage<CollectionFactoryData>
    + Storage<ownable::Data>
{
    #[ink(message)]
    fn get_collections_address_by_creator(
        &self,
        creator: AccountId,
    ) -> Result<Vec<AccountId>, CollectionFactoryError> {
        let collections_by_creator = self
            .data::<CollectionFactoryData>()
            .creator_collections
            .get(&creator)
            .unwrap_or_default();

        Ok(collections_by_creator)
    }

    #[ink(message)]
    fn get_current_id(&self) -> Result<u64, CollectionFactoryError> {
        let id = self.data::<CollectionFactoryData>().collection_count;

        Ok(id)
    }

    #[ink(message)]
    fn get_collection_by_nft_address(
        &self,
        nft_contract_address: AccountId,
    ) -> Option<CollectionInfo> {
        self.data::<CollectionFactoryData>()
            .collection_info
            .get(&nft_contract_address)
    }

    #[ink(message)]
    fn get_contract_by_id(&self, id: u64) -> Option<AccountId> {
        self.data::<CollectionFactoryData>()
            .collection_by_id
            .get(&id)
    }

    #[ink(message)]
    fn set_collection_hash(&mut self, collection_hash: Hash) -> Result<(), CollectionFactoryError> {
        self.data::<CollectionFactoryData>().collection_code_hash = collection_hash;
        Ok(())
    }
}
