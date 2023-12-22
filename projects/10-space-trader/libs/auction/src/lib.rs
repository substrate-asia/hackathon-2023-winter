use rand::prelude::*;
use sp_core::Bytes;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Error {
	/// Used to indicate functionality need to be implemented by ChatGPT
	Unimplemented,
	/// Auction is not found
	AuctionNotFound,
	/// Auction has not started yet
	AuctionNotStarted,
	/// Auction has ended
	AuctionEnded,
	/// Bid below current price,
	BidTooCheap,
	/// There are insufficient funds for biders to join
	InsufficientFund,
}

/// The information of bid
#[derive(Clone)]
pub struct Bid {
	pub id: u32,
	/// The auction that to join
	pub auction: u32,
	/// The bider account
	pub bider: [u8; 32],
	/// The signature of bider
	pub sig: Bytes,
	/// The price used to bid
	pub price: u128,
}

impl Bid {
	pub fn new(id: u32, auction: u32, bider: [u8; 32], sig: Bytes, price: u128) -> Self {
		Self { id, auction, bider, sig, price }
	}

	/// Reserve bid funds
	fn reserve() -> std::result::Result<(), Error> {
		Err(Error::Unimplemented)
	}

	/// Release bid funds
	fn release() -> std::result::Result<(), Error> {
		Err(Error::Unimplemented)
	}

	// Calculate bid proof
	fn build_proof() -> std::result::Result<Bytes, Error> {
		Err(Error::Unimplemented)
	}
}

#[derive(Clone, PartialEq, Eq, codec::Encode, codec::Decode)]
pub struct BidRecipient {
	/// The proof used to verify the result when attach to a specific Order
	proof: [u8; 32],
}

#[derive(Clone, PartialEq, Eq, codec::Encode, codec::Decode)]
pub enum AuctionStatus {
	NotStarted,
	Started,
	Stopped,
	End,
}

struct Auction {
	auction_id: u32,
	created_at: u64,
	start_price: u128,
	current_price: Arc<Mutex<u128>>,
	duration: u64,
	/// Id of the pace order
	order: Arc<Mutex<u32>>,
	/// Bider and its price
	bids: Arc<Mutex<HashMap<[u8; 32], Bid>>>,
	auction_ended: Arc<Mutex<bool>>,
	/// VRF randomness
	randomness: Arc<Mutex<u64>>,
}

impl Auction {
	fn new(auction_id: u32, start_price: u128, duration: u64, order: u32) -> Self {
		let created_at = Self::get_current_timestamp();
		let randomness = Self::get_random_number();

		Auction {
			auction_id,
			created_at,
			start_price,
			current_price: Arc::new(Mutex::new(start_price)),
			duration,
			order: Arc::new(Mutex::new(order)),
			bids: Arc::new(Mutex::new(HashMap::new())),
			auction_ended: Arc::new(Mutex::new(false)),
			randomness: Arc::new(Mutex::new(randomness)),
		}
	}

	fn is_auction_outdated(&self, current_time: u64) -> bool {
		current_time > self.created_at + self.duration
	}

	fn place_bid(&self, user: [u8; 32], bid: Bid) -> Result<(), Error> {
		if *self.auction_ended.lock().unwrap() {
			return Err(Error::AuctionEnded);
		}

		let current_price = *self.current_price.lock().unwrap();
		if bid.price < current_price {
			return Err(Error::BidTooCheap);
		}

		let order = *self.order.lock().unwrap();
		if bid.price > order as u128 * current_price {
			return Err(Error::InsufficientFund);
		}

		let mut bids = self.bids.lock().unwrap();
		bids.insert(user, bid);
		self.update_price();

		let mut order = self.order.lock().unwrap();
		*order -= 1;

		Ok(())
	}

	fn update_price(&self) {
		let elapsed_time = self.remaining_time();
		let mut current_price = self.current_price.lock().unwrap();
		*current_price =
			self.start_price - (elapsed_time as u128 * self.start_price) / self.duration as u128;

		if *current_price == 0 {
			*current_price = 1; // Ensure the price doesn't become negative
		}
	}

	fn remaining_time(&self) -> u64 {
		let current_time = Self::get_current_timestamp();
		if self.is_auction_outdated(current_time) {
			*self.auction_ended.lock().unwrap() = true;
			0
		} else {
			self.duration - (current_time - self.created_at)
		}
	}

	fn end_auction(&self) {
		*self.auction_ended.lock().unwrap() = true;
		*self.current_price.lock().unwrap() = 0;
	}

	fn has_auction_ended(&self) -> bool {
		*self.auction_ended.lock().unwrap()
	}

	fn get_current_timestamp() -> u64 {
		// TODO
		0
	}

	fn get_random_number() -> u64 {
		thread_rng().gen()
	}
}

#[cfg(test)]
mod tests {
	use super::*;
	use substrate_test_runtime_client::AccountKeyring;

	#[test]
	fn test_place_bid_successful() {
		// Create a new auction starting at a price of 100, lasting for 5 seconds
		let auction = Arc::new(Auction::new(1, 100, 5, 10));

		// Create a user and a bid
		let bid = Bid::new(1, 1, AccountKeyring::Alice.into(), Bytes::from(vec![1, 2, 3, 5]), 120);

		// Place a bid in the auction
		let result = auction.place_bid(AccountKeyring::Alice.into(), bid);

		// Check if the bid was placed successfully
		assert_eq!(result, Ok(()));
	}

	#[test]
	fn test_place_bid_auction_ended() {
		// Create a new auction starting at a price of 100, lasting for 5 seconds
		let auction = Arc::new(Auction::new(1, 100, 5, 10));

		// End the auction
		auction.end_auction();

		// Create a user and a bid
		let bid = Bid::new(1, 1, AccountKeyring::Alice.into(), Bytes::from(vec![1, 2, 3, 5]), 120);

		// Attempt to place a bid in the ended auction
		let result = auction.place_bid(AccountKeyring::Alice.into(), bid);

		// Check if the result is AuctionEnded error
		assert_eq!(result, Err(Error::AuctionEnded));
	}

	#[test]
	fn test_place_bid_below_current_price() {
		let auction = Arc::new(Auction::new(1, 100, 5, 10));

		// Create a user and a bid with a price below the current price
		let bid = Bid::new(1, 1, AccountKeyring::Alice.into(), Bytes::from(vec![1, 2, 3, 5]), 80);

		// Place a bid with a price below the current price
		let result = auction.place_bid(AccountKeyring::Alice.into(), bid);

		// Check if the result is BidTooCheap error
		assert_eq!(result, Err(Error::BidTooCheap));
	}

	#[test]
	fn test_place_bid_exceeds_available_tokens() {
		let auction = Arc::new(Auction::new(1, 100, 5, 10));

		// Create a user and a bid with a price that exceeds available tokens
		let bid = Bid::new(1, 1, AccountKeyring::Alice.into(), Bytes::from(vec![1, 2, 3, 5]), 120);

		// Place a bid with a price that exceeds available tokens
		let result = auction.place_bid(AccountKeyring::Alice.into(), bid);

		// Check if the result is InsufficientFund error
		assert_eq!(result, Err(Error::InsufficientFund));
	}
}
