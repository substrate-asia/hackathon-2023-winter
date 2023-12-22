
use openbrush::traits::{AccountId, Balance, String, Hash};
use ink::prelude::vec::Vec;

#[cfg(feature = "std")]
use ink::storage::traits::StorageLayout;
use openbrush::storage::Mapping;




#[derive(Default, Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(StorageLayout, scale_info::TypeInfo))]
pub struct CollectionInfo {
    pub name: String,
    pub uri: String,
    pub description: String,
    pub creator: Option<AccountId>,
    pub nft_collection_address:Option<AccountId>,

}

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(StorageLayout, scale_info::TypeInfo))]
pub struct CreatorInfo {
    pub address: AccountId,
    pub claimed: u8,
}

#[derive(Default, Debug)]
#[openbrush::storage_item]
pub struct CollectionFactoryData {
    /// Collection Info : Collection Contract => CollectionInfo
    pub collection_info: Mapping<AccountId, CollectionInfo>,
    pub collection_by_id: Mapping<u64, AccountId>,
    pub creator_collections: Mapping<AccountId, Vec<AccountId>>,
    pub collection_count: u64,
    pub collection_code_hash : Hash,
    pub creation_fee: Balance,

}

/// The Adventure error type. Contract will throw one of this errors.
#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum CollectionFactoryError {
    NotExists,
    CannotMint,
    ClaimNFTError,
    NotApproved,
    CannotTransfer,
    CollectionNotExist
}
