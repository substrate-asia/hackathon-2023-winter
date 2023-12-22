use sp_core::Bytes;
use sp_runtime::traits::AtLeast32BitUnsigned;

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum OrderError {
	InvalidOrder,
}

#[derive(Debug, PartialEq, Eq, Clone, codec::Encode, codec::Decode)]
pub enum OrderStatus {
	Created,
	Validated,
	Listed,
	Dropped,
	Outdated,
}

#[derive(Debug, PartialEq, Eq, Clone, codec::Encode, codec::Decode)]
pub struct Order<BlockNumber> {
	/// ID of the space order
	pub id: u32,
	/// Start relaychain block of the Order
	pub start: BlockNumber,
	/// End relaychain block of the Order
	pub end: BlockNumber,
	/// Maximized bytes the space order can hold
	pub cap: Bytes,
	/// Last price of the space order
	pub price: u128,
	/// Current owner of the space order
	pub owner: [u8; 32],
	/// Status of the space order
	pub status: OrderStatus,
}

impl<BlockNumber> Order<BlockNumber>
where
	BlockNumber: codec::Codec + Clone + Ord + Eq + AtLeast32BitUnsigned,
{
	pub fn new(
		id: u32,
		start: BlockNumber,
		end: BlockNumber,
		cap: Bytes,
		price: u128,
		owner: [u8; 32],
	) -> Self {
		assert!(end >= start, "Invalid space lifetime");
		Self { id, start, end, cap, price, owner, status: OrderStatus::Created }
	}

	pub fn transfer_ownership(&mut self, owner: [u8; 32]) -> std::result::Result<(), OrderError> {
		if self.status == OrderStatus::Dropped || self.status == OrderStatus::Outdated {
			return Err(OrderError::InvalidOrder);
		}
		self.owner = owner;
		Ok(())
	}
}
