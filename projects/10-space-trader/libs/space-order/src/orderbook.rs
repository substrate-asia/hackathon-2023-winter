use sp_runtime::traits::AtLeast32BitUnsigned;

use crate::order::{Order, OrderStatus};
use std::collections::HashMap;

pub(crate) const LOG_TARGET: &str = "spaceorder::orderbook";

#[derive(Debug, PartialEq, Eq, Clone, thiserror::Error)]
pub enum OrderBookError {
	DuplicatedOrder,
	OrderNotFound,
	OrderImmutable,
	DecodedFailed,
}

impl std::fmt::Display for OrderBookError {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		match self {
			OrderBookError::DuplicatedOrder => write!(f, "Duplicated order"),
			OrderBookError::OrderNotFound => write!(f, "Order not found"),
			OrderBookError::OrderImmutable => write!(f, "Order immutable"),
			OrderBookError::DecodedFailed => write!(f, "Decoded failed"),
		}
	}
}

#[derive(Clone)]
pub struct OrderBook<BlockNumber> {
	pub orders: HashMap<u32, Order<BlockNumber>>,
}

pub trait OrderBookT<BlockNumber>: Send + Sync {
	/// Insert an order into the order book
	/// An order being inserted successfully will be indicated as `Created`,
	/// but only `Validated` order can be used to create auction by owner
	fn insert_order(
		&mut self,
		order: Order<BlockNumber>,
	) -> std::result::Result<(), OrderBookError>;

	/// Remove an order from order book
	/// Only order that hasn't combined an auction can be removed
	fn remove_order(&mut self, id: u32) -> std::result::Result<(), OrderBookError>;

	/// Return all order exist in order book
	fn get_orders(&self) -> Vec<Order<BlockNumber>>;
}

impl<BlockNumber> OrderBookT<BlockNumber> for OrderBook<BlockNumber>
where
	BlockNumber: std::fmt::Debug
		+ codec::Codec
		+ Clone
		+ Ord
		+ Eq
		+ AtLeast32BitUnsigned
		+ Sync
		+ Send
		+ 'static,
{
	/// Insert an order into the order book
	/// An order being inserted successfully will be indicated as `Created`,
	/// but only `Validated` order can be used to create auction by owner
	fn insert_order(
		&mut self,
		order: Order<BlockNumber>,
	) -> std::result::Result<(), OrderBookError> {
		if self.orders.get(&order.id).is_some() {
			return Err(OrderBookError::DuplicatedOrder);
		}
		self.orders.insert(order.id, order);

		Ok(())
	}

	/// Remove an order from order book
	/// Only order that hasn't combined an auction can be removed
	fn remove_order(&mut self, id: u32) -> std::result::Result<(), OrderBookError> {
		if let Some(order) = self.orders.get(&id) {
			if order.status == OrderStatus::Listed {
				log::debug!(target: LOG_TARGET, "Order can not be removed due to list {:?}", &order);
				return Err(OrderBookError::OrderImmutable);
			}
			log::debug!(target: LOG_TARGET, "Order been removed {:?}", &order);
		} else {
			return Err(OrderBookError::OrderNotFound);
		}
		self.orders.remove(&id);

		Ok(())
	}

	/// Return all order exist in order book
	fn get_orders(&self) -> Vec<Order<BlockNumber>> {
		self.orders.values().cloned().collect()
	}
}
