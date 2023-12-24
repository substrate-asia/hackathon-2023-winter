#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://docs.substrate.io/reference/frame-pallets/>
pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;
pub use weights::*;

#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_support::{
		inherent::Vec,
		pallet_prelude::*,
		traits::{BalanceStatus, Currency, ReservableCurrency},
	};
	use frame_system::pallet_prelude::*;
	use scale_info::prelude::string::String;
	use risc0_zkvm::{SegmentReceipt, Receipt};

	type ImageId = [u32; 8];

	#[pallet::pallet]
	// TODO: Needs proper BoundedVec encoding from offchain in order to get bounded types working
	#[pallet::without_storage_info]
	pub struct Pallet<T>(_);

	// pub type BalanceOf<T> =
	// 	<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		// TODO: Figure out rewards
		// type Currency: Currency<<Self as frame_system::Config>::AccountId>
		// 	+ ReservableCurrency<Self::AccountId>;
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		/// Type representing the weight of this pallet
		type WeightInfo: WeightInfo;
	}

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Proof was successfully verified and will be stored
		ProofVerified,
	}

	#[pallet::error]
	pub enum Error<T> {
		/// Could not verify proof
		ProofInvalid,
		/// Proof did not pass verification
		ProofNotVerified,
	}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		// Request a proof of a known program, passing some arguments
		// TODO: Figure out requests later
		// #[pallet::call_index(1)]
		// #[pallet::weight(T::WeightInfo::cause_error())]
		// pub fn request_proof(
		// 	origin: OriginFor<T>,
		// 	image_id: ImageId,
		// 	args: Vec<Vec<u32>>,
		// 	reward: BalanceOf<T>,
		// ) -> DispatchResult {
		// 	let who = ensure_signed(origin)?;

		// 	T::Currency::reserve(&who, reward)?;

		// 	ProofRequests::<T>::insert(
		// 		image_id,
		// 		ProofRequest { requester: who, reward, args: args.clone() },
		// 	);

		// 	Self::deposit_event(Event::ProofRequested { image_id, args });

		// 	Ok(())
		// }

		/// An extrinsic which verifies proofs for programs, forming a trustless relationship for
		/// others to check the verification result
		#[pallet::call_index(2)]
		#[pallet::weight(25000000)]
		pub fn store_and_verify_proof(
			origin: OriginFor<T>,
			image_id: ImageId,
			mut receipt_bytes: Vec<u8>
		) -> DispatchResult {
			let who = ensure_signed(origin)?;

			// TODO: Figure out payments, rewards, and requests for work later
			// // If a request for proof of the program exists, the submitter needs to receive the
			// // designated reward
			// if let Some(proof_request) = ProofRequests::<T>::get(image_id) {
			// 	T::Currency::repatriate_reserved(
			// 		&proof_request.requester,
			// 		&who,
			// 		proof_request.reward,
			// 		BalanceStatus::Free,
			// 	)?;
			// }

			let receipt_json: String = Decode::decode(&mut &receipt_bytes[..]).unwrap();
			let receipt: Receipt = serde_json::from_str(&receipt_json).unwrap();

			receipt.verify(image_id).map_err(|_| Error::<T>::ProofNotVerified)?;

			Self::deposit_event(Event::<T>::ProofVerified);
			Ok(())
		}
	}
}
