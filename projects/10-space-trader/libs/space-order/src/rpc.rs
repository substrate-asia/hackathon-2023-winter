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
use sp_runtime::traits::{AtLeast32BitUnsigned, Block as BlockT, Extrinsic as ExtrinsicT};
use std::sync::Arc;

use crate::order::*;
use crate::orderbook::*;

const SPACEORDER_ERROR_BASE: i32 = 20000;
const BUNDLEPOOL_DUPLICATED_ORDER: i32 = SPACEORDER_ERROR_BASE + 1;
const BUNDLEPOOL_ORDER_NOT_FUND: i32 = SPACEORDER_ERROR_BASE + 2;
const BUNDLEPOOL_ORDER_IMMUTABLE: i32 = SPACEORDER_ERROR_BASE + 3;
const BUNDLEPOOL_DECODED_FAILED: i32 = SPACEORDER_ERROR_BASE + 4;

impl From<OrderBookError> for JsonRpseeError {
	fn from(e: OrderBookError) -> Self {
		match e {
			OrderBookError::DuplicatedOrder => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_DUPLICATED_ORDER,
				format!("Duplicated order: {:?}", e),
				None::<()>,
			)),
			OrderBookError::OrderNotFound => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_ORDER_NOT_FUND,
				format!("Order not found: {:?}", e),
				None::<()>,
			)),
			OrderBookError::OrderImmutable => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_ORDER_IMMUTABLE,
				format!("Order immutable: {:?}", e),
				None::<()>,
			)),
			OrderBookError::DecodedFailed => CallError::Custom(ErrorObject::owned(
				BUNDLEPOOL_DECODED_FAILED,
				format!("Order decoded failed: {:?}", e),
				None::<()>,
			)),
			e => CallError::Failed(e.into()),
		}
		.into()
	}
}

/// SpaceTrader OrderBook RPC API
#[rpc(client, server)]
pub trait OrderBookApi<BlockNumber: Clone> {
	/// Submit hex-encoded space Order.
	/// Order will be validated by reading state from Relaychain.
	#[method(name = "orderbook_submitOrder")]
	fn submit_order(&self, order: Bytes) -> RpcResult<()>;

	/// Remove an order from orderbook
	/// A bundle can only be canceled before being attached to an Space Order.
	#[method(name = "orderbook_cancelOrder")]
	fn cancel_order(&self, id: u32) -> RpcResult<()>;

	/// Check an order if it is still valid
	/// Generally, the lifecycle of a space Order is limited to a specific range of relchain
	/// blocks, an outdated Order can not be used to create auction.
	#[method(name = "orderbook_checkOrder")]
	fn check_order(&self, id: u32) -> RpcResult<bool>;

	/// Return all orders in the order book.
	#[method(name = "orderbook_getOrders")]
	fn get_orders(&self) -> RpcResult<Vec<Bytes>>;
}

/// OrderBook API
pub struct OrderBookService<Block, OB, Client> {
	/// Substrate client
	pub client: Arc<Client>,
	/// Bundle pool
	pub orderbook: Arc<RwLock<OB>>,
	/// Chain API
	pub _blockType: std::marker::PhantomData<Block>,
}

impl<Block, OB, Client> OrderBookService<Block, OB, Client> {
	/// Create new instance of OrderBook API.
	pub fn new(client: Arc<Client>, orderbook: Arc<RwLock<OB>>) -> Self {
		OrderBookService { client, orderbook, _blockType: std::marker::PhantomData }
	}
}

#[async_trait]
impl<BlockNumber, Block, OB, Client> OrderBookApiServer<BlockNumber>
	for OrderBookService<Block, OB, Client>
where
	BlockNumber: codec::Codec + codec::Decode + Clone + Ord + Eq + AtLeast32BitUnsigned,
	Block: BlockT + Send + Sync + 'static,
	OB: OrderBookT<BlockNumber> + codec::Encode + codec::Decode + Sync + Send + 'static,
	Client: HeaderBackend<Block> + ProvideRuntimeApi<Block> + Send + Sync + 'static,
{
	/// Submit hex-encoded space Order.
	/// Order will be validated by reading state from Relaychain.
	fn submit_order(&self, order: Bytes) -> RpcResult<()> {
		// TODO: verify order along with chain API by checking relaychain state

		match codec::Decode::decode(&mut &order[..]) {
			Ok(o) => self.orderbook.write().insert_order(o)?,
			_ => return Err(OrderBookError::DecodedFailed.into()),
		}

		Ok(())
	}

	/// Remove an order from orderbook
	/// A bundle can only be canceled before being attached to an Space Order.
	fn cancel_order(&self, id: u32) -> RpcResult<()> {
		self.orderbook.write().remove_order(id)?;
		Ok(())
	}

	/// Check an order if it is still valid
	/// Generally, the lifecycle of a space Order is limited to a specific range of relchain
	/// blocks, an outdated Order can not be used to create auction.
	fn check_order(&self, id: u32) -> RpcResult<bool> {
		// TODO: verify order along with chain API by checking relaychain state
		Ok(true)
	}

	/// Return all orders in the order book.
	fn get_orders(&self) -> RpcResult<Vec<Bytes>> {
		Ok(self
			.orderbook
			.read()
			.get_orders()
			.iter()
			.map(|o| o.clone().encode().into())
			.collect())
	}
}
