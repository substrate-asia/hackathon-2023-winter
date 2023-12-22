use sp_runtime::{
	traits::Extrinsic as ExtrinsicT, transaction_validity::TransactionLongevity as Longevity,
};
use std::fmt;

#[derive(
	Debug, PartialEq, Eq, Clone, codec::Encode, codec::Decode, serde::Serialize, serde::Deserialize,
)]
pub enum BundleStatus {
	Pending,
	Validated,
	Droped,
	Attached([u8; 32], u32),
}

#[derive(
	PartialEq, Eq, Clone, codec::Encode, codec::Decode, serde::Serialize, serde::Deserialize,
)]
pub struct Bundle<Extrinsic: Clone> {
	pub id: u32,
	pub exs: Vec<Extrinsic>,
	pub builder: [u8; 32],
	pub valid_till: Longevity,
	pub status: BundleStatus,
}

impl<Extrinsic> Bundle<Extrinsic>
where
	Extrinsic: fmt::Debug + codec::Encode + Clone,
{
	pub fn new(
		id: u32,
		exs: Vec<Extrinsic>,
		builder: [u8; 32],
		valid_till: Longevity,
		status: BundleStatus,
	) -> Self {
		Self { id, exs, builder, valid_till, status }
	}

	/// Calculate the total encoded size of all extrinsices in the bundle
	pub fn size(&self) -> usize {
		let mut total_bytes: usize = 0;
		for ex in self.exs.iter() {
			total_bytes += ex.using_encoded(|x| x.len())
		}
		total_bytes
	}
}

impl<Extrinsic> Default for Bundle<Extrinsic>
where
	Extrinsic: fmt::Debug + ExtrinsicT + codec::Encode + Clone,
{
	fn default() -> Self {
		Self::new(0, vec![], [0; 32], Longevity::default(), BundleStatus::Pending)
	}
}

impl<Extrinsic> fmt::Debug for Bundle<Extrinsic>
where
	Extrinsic: fmt::Debug + ExtrinsicT + Clone,
{
	fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
		write!(fmt, "Bundle {{ ")?;
		write!(fmt, "id: {:?}, ", &self.id)?;
		write!(fmt, "builder: {:?}, ", &hex::encode(self.builder))?;
		write!(fmt, "valid_till: {:?}, ", &self.valid_till)?;
		write!(fmt, "status: {:?}, ", &self.status)?;
		write!(fmt, "}}")?;
		Ok(())
	}
}
