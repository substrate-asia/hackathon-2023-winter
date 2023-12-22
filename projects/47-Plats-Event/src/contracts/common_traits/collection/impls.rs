use openbrush::traits::{Storage, String};

use crate::collection::types::CollectionError;
use openbrush::contracts::psp34;
use openbrush::{
    contracts::ownable::*,
    contracts::psp34::extensions::{enumerable::*, metadata::*},
};
use ink::prelude::string::ToString;

#[openbrush::trait_definition]
pub trait CollectionTrait:
    Storage<psp34::Data>
    + Storage<ownable::Data>
    + Storage<metadata::Data>
    + psp34::Internal
    + psp34::extensions::metadata::PSP34Metadata
    + psp34::extensions::metadata::Internal
    + Storage<psp34::extensions::enumerable::Data>
    + PSP34
{
    #[ink(message)]
    fn set_base_uri(&mut self, uri: String) -> Result<(), CollectionError> {
        self._set_attribute(Id::U8(0), String::from("uri"), uri);
        Ok(())
    }
    #[ink(message)]
    fn get_token_uri(&self, token_id: u64) -> String {
        let uri = self.get_attribute(Id::U64(token_id), String::from("uri"));
        if let Some(token_uri) = uri {
            return token_uri
        } else {
            return String::from("");
        }

    }
}
