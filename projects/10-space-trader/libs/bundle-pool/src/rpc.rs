use codec::Encode;
use jsonrpsee::{
	core::{async_trait, Error as JsonRpseeError, RpcResult},
	proc_macros::rpc,
	types::error::{CallError, ErrorObject},
};

use parking_lot::RwLock;
use sp_api::ProvideRuntimeApi;
use sp_blockchain::HeaderBackend;
use sp_core::Bytes;
use sp_runtime::traits::{Block as BlockT, Extrinsic as ExtrinsicT};
use std::sync::Arc;

use crate::bundle::*;
use crate::pool::*;

pub(crate) const LOG_TARGET: &str = "bundlepool::rpc";

const BUNDLEPOOL_ERROR_BASE: i32 = 10000;
const BUNDLEPOOL_TOO_MUCH_BUNDLES: i32 = BUNDLEPOOL_ERROR_BASE + 1;
const BUNDLEPOOL_TOO_MUCH_EXTRINSICS: i32 = BUNDLEPOOL_ERROR_BASE + 2;
const BUNDLEPOOL_BUNDLE_SIZE_EXCEEDLIMIT: i32 = BUNDLEPOOL_ERROR_BASE + 3;
const BUNDLEPOOL_BUNDLE_DUPLICATED: i32 = BUNDLEPOOL_ERROR_BASE + 4;
const BUNDLEPOOL_BUNDLE_NOT_FOUND: i32 = BUNDLEPOOL_ERROR_BASE + 5;
const BUNDLEPOOL_INCORRECT_STATUS: i32 = BUNDLEPOOL_ERROR_BASE + 6;
const BUNDLEPOOL_PERMISSION_DENIED: i32 = BUNDLEPOOL_ERROR_BASE + 7;
const BUNDLEPOOL_DECODED_FAILED: i32 = BUNDLEPOOL_ERROR_BASE + 8;

impl From<BundlePoolError> for JsonRpseeError {
	fn from(e: BundlePoolError) -> Self {
		match e {
			BundlePoolError::TooMuchBundles => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_TOO_MUCH_BUNDLES,
				format!("Too much bundles: {:?}", e),
				None::<()>,
			)),
			BundlePoolError::TooMuchExtrinsics => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_TOO_MUCH_EXTRINSICS,
				format!("Too much extrinsics: {:?}", e),
				None::<()>,
			)),
			BundlePoolError::BundleSizeExceedLimit => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_BUNDLE_SIZE_EXCEEDLIMIT,
				format!("Bundle size exceeds limit: {:?}", e),
				None::<()>,
			)),
			BundlePoolError::BundleDuplicated => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_BUNDLE_DUPLICATED,
				format!("Bundle dumplicated: {:?}", e),
				None::<()>,
			)),
			BundlePoolError::BundleNotFound => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_BUNDLE_NOT_FOUND,
				format!("Bundle not found: {:?}", e),
				None::<()>,
			)),
			BundlePoolError::IncorrectStatus => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_INCORRECT_STATUS,
				format!("Incorrect status: {:?}", e),
				None::<()>,
			)),
			BundlePoolError::PermissionDenied => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_PERMISSION_DENIED,
				format!("Permission denied: {:?}", e),
				None::<()>,
			)),
			BundlePoolError::DecodedFailed => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_DECODED_FAILED,
				format!("Decoded failed: {:?}", e),
				None::<()>,
			)),
			e => CallError::Failed(e.into()),
		}
		.into()
	}
}

/// SpaceTrader BundlePool RPC API
#[rpc(client, server)]
pub trait BundlePoolApi<Extrinsic: Clone> {
	/// Submit hex-encoded extrinsics for inclusion in block.
	/// Which would be composed to a bundle save to bundle pool.
	#[method(name = "bundlepool_submitBundle")]
	fn submit_bundle(&self, id: u32, exes: Vec<Bytes>) -> RpcResult<()>;

	/// Remove a bundle from bundle pool.
	/// A bundle can only be canceled before being attached to an Space Order.
	#[method(name = "bundlepool_cancelBundle")]
	fn cancel_bundle(&self, id: u32) -> RpcResult<()>;

	/// Attach a bundle to a specific Space Order.
	/// By attaching the bundle and Order, indicating that extrinsics can be submit
	/// to validators and included into bock.
	#[method(name = "bundlepool_attachBundle")]
	fn attach_bundle(&self, bundle: u32, order: u32) -> RpcResult<()>;

	/// Return all pending bundles in the pool.
	#[method(name = "bundlepool_pendingBundles")]
	fn pending_bundles(&self) -> RpcResult<Vec<Bytes>>;

	/// Return all validated bundles in the pool.
	#[method(name = "bundlepool_validBundles")]
	fn valid_bundles(&self) -> RpcResult<Vec<Bytes>>;

	/// Return all invalid bundles in the pool.
	#[method(name = "bundlepool_invalidBundles")]
	fn invalid_bundles(&self) -> RpcResult<Vec<Bytes>>;

	/// Return all attached bundles in the pool.
	#[method(name = "bundlepool_attachedBundles")]
	fn attached_bundles(&self) -> RpcResult<Vec<Bytes>>;
}

/// BundlePool API
pub struct BundlePoolService<Block, BP, Client> {
	/// Substrate client
	pub client: Arc<Client>,
	/// Bundle pool
	pub pool: Arc<RwLock<BP>>,
	/// Chain API
	pub _blockType: std::marker::PhantomData<Block>,
}

impl<Block, BP, Client> BundlePoolService<Block, BP, Client> {
	/// Create new instance of BundlePool API.
	pub fn new(client: Arc<Client>, pool: Arc<RwLock<BP>>) -> Self {
		BundlePoolService { client, pool, _blockType: std::marker::PhantomData }
	}
}

#[async_trait]
impl<Block, Extrinsic, BP, Client> BundlePoolApiServer<Extrinsic>
	for BundlePoolService<Block, BP, Client>
where
	Block: BlockT + Send + Sync + 'static,
	Extrinsic: ExtrinsicT + Clone + codec::Encode + codec::Decode,
	BP: BundlePoolT<Extrinsic> + Sync + Send + 'static,
	Client: HeaderBackend<Block> + ProvideRuntimeApi<Block> + Send + Sync + 'static,
{
	/// Submit hex-encoded extrinsics for inclusion in block.
	/// Which would be composed to a bundle save to bundle pool.
	fn submit_bundle(&self, id: u32, exes: Vec<Bytes>) -> RpcResult<()> {
		let mut pending_exs: Vec<Extrinsic> = Vec::new();
		for ex in exes.iter() {
			match codec::Decode::decode(&mut &ex[..]) {
				Ok(xt) => pending_exs.push(xt),
				_ => return Err(BundlePoolError::DecodedFailed.into()),
			}
		}
		self.pool.write().insert_bundle(Bundle {
			id,
			exs: pending_exs,
			builder: [0; 32],
			valid_till: 4,
			status: BundleStatus::Pending,
		})?;
		Ok(())
	}

	/// Remove a bundle from bundle pool.
	/// A bundle can only be canceled before being attached to an Space Order.
	fn cancel_bundle(&self, id: u32) -> RpcResult<()> {
		if self.pool.read().attached_bundles().iter().find(|b| b.id == id).is_some() {
			return Err(BundlePoolError::IncorrectStatus.into());
		}
		self.pool.write().remove_bundle(id)?;
		Ok(())
	}

	/// Attach a bundle to a specific Space Order.
	/// By attaching the bundle and Order, indicating that extrinsics can be submit
	/// to validators and included into bock.
	fn attach_bundle(&self, bundle: u32, order: u32) -> RpcResult<()> {
		// TODO: parse builder
		self.pool.write().set_to_attached([0; 32], bundle, order)?;
		Ok(())
	}

	/// Return all pending bundles in the pool.
	fn pending_bundles(&self) -> RpcResult<Vec<Bytes>> {
		Ok(self
			.pool
			.read()
			.pending_bundles()
			.iter()
			.map(|bundle| bundle.clone().encode().into())
			.collect())
	}

	/// Return all validated bundles in the pool.
	fn valid_bundles(&self) -> RpcResult<Vec<Bytes>> {
		Ok(self
			.pool
			.read()
			.valid_bundles()
			.iter()
			.map(|bundle| bundle.clone().encode().into())
			.collect())
	}

	/// Return all invalid bundles in the pool.
	fn invalid_bundles(&self) -> RpcResult<Vec<Bytes>> {
		Ok(self
			.pool
			.read()
			.invalid_bundles()
			.iter()
			.map(|bundle: &Bundle<Extrinsic>| bundle.clone().encode().into())
			.collect())
	}

	/// Return all attached bundles in the pool.
	fn attached_bundles(&self) -> RpcResult<Vec<Bytes>> {
		Ok(self
			.pool
			.read()
			.attached_bundles()
			.iter()
			.map(|bundle| bundle.clone().encode().into())
			.collect())
	}
}
