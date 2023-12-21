

#[derive(Default, Debug)]
#[openbrush::storage_item]
pub struct CollectionData {
    pub token_id: u64

}


#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum CollectionError {
    CannotInitialize,
    CannotMint,
    NotOwner,
    NotExists,
    CannotIncrease
}