use ink::prelude::vec::Vec;
use openbrush::traits::AccountId;

use crate::nft_collection_factory::types::CollectionFactoryError;


#[openbrush::wrapper]
pub type CollectionFactoryRef = dyn CollectionFactoryTraitRef;


/// Collection method definitions.
/// Actually only methods used by other contract (cross-contract call) are needed.
#[openbrush::trait_definition]
pub trait CollectionFactoryTraitRef {
    #[ink(message)]
    fn get_collections_by_creator(
        &self,
        creator: AccountId,
    ) -> Result<Vec<AccountId>, CollectionFactoryError>;
}
