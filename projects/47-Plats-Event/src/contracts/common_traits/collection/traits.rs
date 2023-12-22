use crate::collection::types::CollectionError;
use openbrush::contracts::psp34::extensions::{enumerable::*, metadata::*};
use openbrush::traits::String;

#[openbrush::wrapper]
pub type CollectionTraitRef = dyn CollectionTrait + PSP34 + PSP34Metadata;

/// Collection method definitions.
/// Actually only methods used by other contract (cross-contract call) are needed.
#[openbrush::trait_definition]
pub trait CollectionTrait {
    #[ink(message)]
    fn set_base_uri(&mut self, uri: String) -> Result<(), CollectionError>;
    
    #[ink(message)]
    fn get_token_uri(&self, token_id: u64) -> String;
}
