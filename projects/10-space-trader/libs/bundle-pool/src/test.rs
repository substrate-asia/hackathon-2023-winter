use super::*;
use crate::bundle::Bundle;
use crate::rpc::{BundlePoolApiServer, BundlePoolService};
use assert_matches::assert_matches;

use codec::Encode;
use jsonrpsee::{
	core::Error as RpcError,
	types::{error::CallError, EmptyServerParams as EmptyParams},
	RpcModule,
};

use sp_core::{testing::TaskExecutor, Bytes};
use substrate_test_runtime_client::{
	self,
	runtime::{Block, Extrinsic, ExtrinsicBuilder, Transfer},
	AccountKeyring, Backend, Client, DefaultTestClientBuilderExt, TestClientBuilderExt,
};

use parking_lot::RwLock;
use std::{future::Future, sync::Arc};

/// Executor for testing.
pub fn test_executor() -> Arc<sp_core::testing::TaskExecutor> {
	Arc::new(TaskExecutor::default())
}

/// Wrap a future in a timeout a little more concisely
pub fn timeout_secs<I, F: Future<Output = I>>(s: u64, f: F) -> tokio::time::Timeout<F> {
	tokio::time::timeout(std::time::Duration::from_secs(s), f)
}

fn uxt(sender: AccountKeyring, nonce: u64) -> Extrinsic {
	let tx = Transfer {
		amount: Default::default(),
		nonce,
		from: sender.into(),
		to: AccountKeyring::Bob.into(),
	};
	ExtrinsicBuilder::new_transfer(tx).build()
}

struct TestSetup {
	pub client: Arc<Client<Backend>>,
	pub pool: Arc<RwLock<pool::BundlePool<Extrinsic>>>,
}

impl Default for TestSetup {
	fn default() -> Self {
		let client = Arc::new(substrate_test_runtime_client::TestClientBuilder::new().build());
		let pool = Arc::new(RwLock::new(pool::BundlePool::<Extrinsic>::new()));
		TestSetup { client, pool }
	}
}

impl TestSetup {
	fn bundlepool_service(
		&self,
	) -> BundlePoolService<Block, pool::BundlePool<Extrinsic>, Client<Backend>> {
		BundlePoolService {
			client: self.client.clone(),
			pool: self.pool.clone(),
			_blockType: std::marker::PhantomData,
		}
	}

	fn into_rpc(
	) -> RpcModule<BundlePoolService<Block, pool::BundlePool<Extrinsic>, Client<Backend>>> {
		Self::default().bundlepool_service().into_rpc()
	}
}

#[tokio::test]
async fn submit_bundle_should_work() {
	let _ = env_logger::try_init();
	let bundlepool = TestSetup::default().bundlepool_service();
	let api = bundlepool.into_rpc();
	let xt: Bytes = uxt(AccountKeyring::Alice, 123).encode().into();
	let _res: () = api.call("bundlepool_submitBundle", (0, vec![xt.clone()])).await.unwrap();
	let res: Vec<Bytes> = api.call("bundlepool_pendingBundles", EmptyParams::new()).await.unwrap();
	let bundles: Vec<Bundle<Extrinsic>> = res
		.iter()
		.map(|bytes| codec::Decode::decode(&mut &bytes.0[..]).unwrap())
		.collect();
	println!("bundles: {:?}", &bundles);
	assert_eq!(bundles.len(), 1);
	assert_eq!(bundles[0].exs.len(), 1);
}

#[tokio::test]
async fn cancel_bundle_should_work() {
	let _ = env_logger::try_init();
	let bundlepool = TestSetup::default().bundlepool_service();
	let api = bundlepool.into_rpc();
	let xt1: Bytes = uxt(AccountKeyring::Alice, 123).encode().into();
	let xt2: Bytes = uxt(AccountKeyring::Bob, 456).encode().into();
	// Submit bundle 1
	let _res: () = api.call("bundlepool_submitBundle", (1, vec![xt1.clone()])).await.unwrap();
	// Submit bundle 2
	let _res: () = api.call("bundlepool_submitBundle", (2, vec![xt2.clone()])).await.unwrap();

	let res: Vec<Bytes> = api.call("bundlepool_pendingBundles", EmptyParams::new()).await.unwrap();
	let bundles: Vec<Bundle<Extrinsic>> = res
		.iter()
		.map(|bytes| codec::Decode::decode(&mut &bytes.0[..]).unwrap())
		.collect();
	println!("bundles: {:?}", &bundles);
	assert_eq!(bundles.len(), 2);

	// Cancel bundle1 should be ok
	let cancel_res1: std::result::Result<(), RpcError> =
		api.call("bundlepool_cancelBundle", vec![1]).await;
	assert_eq!(cancel_res1.is_ok(), true);

	// Set bundle2 to attached
	let _res: () = api.call("bundlepool_attachBundle", (2, 100)).await.unwrap();

	// Cancel bundle2 should return error
	assert_matches!(
		api.call::<_, ()>("bundlepool_cancelBundle", vec![2]).await,
		Err(RpcError::Call(CallError::Custom(err))) if err.message().contains("Incorrect status")
	);
}
