use sp_runtime::traits::Extrinsic as ExtrinsicT;
use std::collections::{BTreeSet, HashMap};

use crate::bundle::*;

pub(crate) const LOG_TARGET: &str = "bundlepool::pool";

/// Maximized bundls in bundle pool
const BUNDLEPOOL_MAX_BUNDLES: usize = 100;
/// Maximized extrinsices included in the bundle
const BUNDLE_MAX_EXS: usize = 1000;
/// Maxmized bytes of all encoded extrinsices in the bundle
const BUNDLE_MAX_BYTES: usize = 4 * 1024;

/// Queue limits
#[derive(Debug, Clone)]
pub struct Limit {
	/// Maximal number of transactions in the bundle.
	pub count: usize,
	/// Maximal size of encodings of all transactions in the bundle.
	pub total_bytes: usize,
}

impl Limit {
	pub fn new(count: usize, total_bytes: usize) -> Self {
		Self { count, total_bytes }
	}

	/// Returns true if any of the provided values exceeds the limit.
	pub fn is_count_exceeded(&self, count: usize) -> bool {
		self.count < count
	}

	/// Returns true if any of the provided values exceeds the limit.
	pub fn is_size_exceed(&self, bytes: usize) -> bool {
		self.total_bytes < bytes
	}
}

pub trait BundlePoolT<Extrinsic: Clone>: Send + Sync {
	fn insert_bundle(
		&mut self,
		bundle: Bundle<Extrinsic>,
	) -> std::result::Result<(), BundlePoolError>;

	fn remove_bundle(&mut self, id: u32) -> std::result::Result<(), BundlePoolError>;

	fn set_to_valid(&mut self, id: u32) -> std::result::Result<BundleStatus, BundlePoolError>;

	fn set_to_invalid(&mut self, id: u32) -> std::result::Result<BundleStatus, BundlePoolError>;

	fn set_to_attached(
		&mut self,
		builder: [u8; 32],
		id: u32,
		order: u32,
	) -> std::result::Result<BundleStatus, BundlePoolError>;

	fn pending_bundles(&self) -> Vec<Bundle<Extrinsic>>;

	fn valid_bundles(&self) -> Vec<Bundle<Extrinsic>>;

	fn invalid_bundles(&self) -> Vec<Bundle<Extrinsic>>;

	fn attached_bundles(&self) -> Vec<Bundle<Extrinsic>>;
}

#[derive(Clone)]
pub struct BundlePool<Extrinsic: Clone> {
	bundles: HashMap<u32, Bundle<Extrinsic>>,
	pending: BTreeSet<u32>,
	valid: BTreeSet<u32>,
	invalid: BTreeSet<u32>,
	attached: BTreeSet<u32>,
	limit: Limit,
}

#[derive(Debug, PartialEq, Eq, Clone, thiserror::Error)]
pub enum BundlePoolError {
	TooMuchBundles,
	TooMuchExtrinsics,
	BundleSizeExceedLimit,
	BundleDuplicated,
	BundleNotFound,
	IncorrectStatus,
	PermissionDenied,
	DecodedFailed,
}

impl std::fmt::Display for BundlePoolError {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		match self {
			BundlePoolError::TooMuchBundles => write!(f, "Too much bundles"),
			BundlePoolError::TooMuchExtrinsics => write!(f, "Too much extrinsics"),
			BundlePoolError::BundleSizeExceedLimit => write!(f, "Bundle size exceeds limit"),
			BundlePoolError::BundleDuplicated => write!(f, "Bundle is duplicated"),
			BundlePoolError::BundleNotFound => write!(f, "Bundle not found"),
			BundlePoolError::IncorrectStatus => write!(f, "Incorrect status"),
			BundlePoolError::PermissionDenied => write!(f, "Permission denied"),
			BundlePoolError::DecodedFailed => write!(f, "Decoded failed"),
		}
	}
}

impl<Extrinsic: Clone> Default for BundlePool<Extrinsic> {
	fn default() -> Self {
		Self::new()
	}
}

impl<Extrinsic: Clone> BundlePool<Extrinsic> {
	pub fn new() -> Self {
		Self {
			bundles: HashMap::new(),
			pending: BTreeSet::new(),
			valid: BTreeSet::new(),
			invalid: BTreeSet::new(),
			attached: BTreeSet::new(),
			limit: Limit::new(BUNDLE_MAX_EXS, BUNDLE_MAX_BYTES),
		}
	}
}

impl<Extrinsic: Clone> BundlePoolT<Extrinsic> for BundlePool<Extrinsic>
where
	Extrinsic: std::fmt::Debug + ExtrinsicT + codec::Encode + Send + Sync + 'static,
{
	fn insert_bundle(
		&mut self,
		bundle: Bundle<Extrinsic>,
	) -> std::result::Result<(), BundlePoolError> {
		if self.bundles.get(&bundle.id).is_some() {
			return Err(BundlePoolError::BundleDuplicated);
		}

		// Check limitations
		if self.pending.len() == BUNDLEPOOL_MAX_BUNDLES {
			return Err(BundlePoolError::TooMuchBundles);
		}
		if self.limit.is_count_exceeded(bundle.exs.len()) {
			return Err(BundlePoolError::TooMuchExtrinsics);
		}
		if self.limit.is_size_exceed(bundle.size()) {
			return Err(BundlePoolError::BundleSizeExceedLimit);
		}

		// TODO: Verify extrinsics before insert

		self.pending.insert(bundle.id);
		self.bundles.insert(bundle.id, bundle.clone());
		log::debug!(target: LOG_TARGET, "New pending bundle been added {:?}", &bundle);

		Ok(())
	}

	fn remove_bundle(&mut self, id: u32) -> std::result::Result<(), BundlePoolError> {
		if let Some(bundle) = self.bundles.get(&id) {
			self.pending.remove(&id);
			self.valid.remove(&id);
			self.invalid.remove(&id);
			self.attached.remove(&id);
			log::debug!(target: LOG_TARGET, "Bundle been removed {:?}", &bundle);
		} else {
			return Err(BundlePoolError::BundleDuplicated);
		}
		self.bundles.remove(&id);

		Ok(())
	}

	fn set_to_valid(&mut self, id: u32) -> std::result::Result<BundleStatus, BundlePoolError> {
		if let Some(bundle) = self.bundles.get_mut(&id) {
			if bundle.status != BundleStatus::Pending {
				return Err(BundlePoolError::IncorrectStatus);
			}
			bundle.status = BundleStatus::Validated;
			self.pending.remove(&id);
			self.valid.insert(id);

			log::debug!(target: LOG_TARGET, "Bundle set to valid {:?}", &bundle);
		} else {
			return Err(BundlePoolError::BundleNotFound);
		}

		Ok(BundleStatus::Validated)
	}

	fn set_to_invalid(&mut self, id: u32) -> std::result::Result<BundleStatus, BundlePoolError> {
		if let Some(bundle) = self.bundles.get_mut(&id) {
			if bundle.status != BundleStatus::Pending {
				return Err(BundlePoolError::IncorrectStatus);
			}
			// Invalid bundle should be dropped directly
			bundle.status = BundleStatus::Droped;
			self.pending.remove(&id);

			log::debug!(target: LOG_TARGET, "Bundle set to invalid {:?}", &bundle);
		} else {
			return Err(BundlePoolError::BundleNotFound);
		}

		Ok(BundleStatus::Droped)
	}

	fn set_to_attached(
		&mut self,
		builder: [u8; 32],
		id: u32,
		order: u32,
	) -> std::result::Result<BundleStatus, BundlePoolError> {
		if let Some(bundle) = self.bundles.get_mut(&id) {
			// TODO: Uncomment when bundle verification implemented
			// if bundle.status != BundleStatus::Validated {
			// 	return Err(BundlePoolError::IncorrectStatus);
			// }

			// Check ownership
			if bundle.builder != builder {
				return Err(BundlePoolError::PermissionDenied);
			}

			// Invalid bundle should be dropped directly
			bundle.status = BundleStatus::Attached(builder, order);
			self.valid.remove(&bundle.id);
			self.attached.insert(bundle.id);

			log::debug!(target: LOG_TARGET, "Bundle set to attached {:?}", &bundle);
		} else {
			return Err(BundlePoolError::BundleNotFound);
		}

		Ok(BundleStatus::Attached(builder, order))
	}

	fn pending_bundles(&self) -> Vec<Bundle<Extrinsic>> {
		self.pending.iter().map(|id| self.bundles.get(&id).unwrap().clone()).collect()
	}

	fn valid_bundles(&self) -> Vec<Bundle<Extrinsic>> {
		self.valid.iter().map(|id| self.bundles.get(&id).unwrap().clone()).collect()
	}

	fn invalid_bundles(&self) -> Vec<Bundle<Extrinsic>> {
		self.invalid.iter().map(|id| self.bundles.get(&id).unwrap().clone()).collect()
	}

	fn attached_bundles(&self) -> Vec<Bundle<Extrinsic>> {
		self.attached.iter().map(|id| self.bundles.get(&id).unwrap().clone()).collect()
	}
}
