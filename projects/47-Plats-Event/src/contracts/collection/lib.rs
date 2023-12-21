#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub use self::my_collection::{Collection, CollectionRef};

#[openbrush::implementation(PSP34, PSP34Metadata, PSP34Enumerable, Ownable)]
#[openbrush::contract]
pub mod my_collection {
    use common_traits::collection::impls::CollectionTrait;
    use common_traits::collection::traits::collectiontrait_external;
    use common_traits::collection::types::{CollectionData, CollectionError};
    use openbrush::{
        contracts::ownable::*,
        contracts::psp34,
        contracts::psp34::extensions::{burnable::*, enumerable::*, metadata::*},
        traits::Storage,
    };
    use openbrush::traits::String;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Collection {
        #[storage_field]
        psp34: psp34::Data,
        #[storage_field]
        ownable: ownable::Data,
        #[storage_field]
        metadata: metadata::Data,
        #[storage_field]
        enumerable: enumerable::Data,
        #[storage_field]
        collection: CollectionData,
    }

    impl CollectionTrait for Collection {}

    impl Collection {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(contract_owner: AccountId, name: String, symbol: String) -> Self {
            let mut instance = Self::default();
            openbrush::contracts::ownable::Internal::_init_with_owner(&mut instance, contract_owner);
            instance._set_attribute(
                Id::U8(0),
                String::from("name"),
                name,
            );
            instance._set_attribute(
                Id::U8(0),
                String::from("symbol"),
                symbol,
            );
            instance
        }

        #[ink(message)]
        pub fn mint(&mut self, uri: String) -> Result<(), CollectionError> {
            let creator = self.env().caller();
            if let Some(token_id) = self.collection.token_id.checked_add(1) {
                self.collection.token_id = token_id;
                if psp34::Internal::_mint_to(self, creator, Id::U64(self.collection.token_id))
                    .is_err()
                {
                    return Err(CollectionError::CannotMint);
                }
                self._set_attribute(
                    Id::U64(token_id),
                    String::from("uri"),
                    uri,
                );
                return Ok(());
            } else {
                return Err(CollectionError::CannotIncrease);
            }
        }
    }
}
