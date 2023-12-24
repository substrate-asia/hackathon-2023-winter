// Copyright 2023 ZeroDAO

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

// #[cfg(test)]
// mod mock;

// #[cfg(test)]
// mod tests;

// #[cfg(feature = "runtime-benchmarks")]
// mod benchmarking;

#[frame_support::pallet]
pub mod pallet {

	use frame_support::{dispatch::DispatchResultWithPostInfo, pallet_prelude::*, WeakBoundedVec};
	use frame_system::pallet_prelude::*;
	// use redot_core_primitives::{DkgSignature, WrapVerifyingKey};
	use ed25519_consensus::{Signature, VerificationKey};

	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// The event type of this pallet, which is dependent on the runtime's definition of an event.
		///
		/// This is required because this pallet emits events.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// The maximum length allowed for metadata.
		///
		/// This parameter sets the upper limit for the length of metadata that can be stored.
		type MaxMetadataLen: Get<u32>;
	}

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	/// Storage for tracking the last task ID.
	///
	/// This value is incremented with each new task, ensuring that each task has a unique ID.
	#[pallet::storage]
	#[pallet::getter(fn last_task_id)]
	pub type LastTaskId<T> = StorageValue<_, u32>;

	/// Storage for the current verifying key.
	///
	/// This key is used for various cryptographic operations within the pallet.
	#[pallet::storage]
	#[pallet::getter(fn verifying_key)]
	pub type VerifyingKey<T> = StorageValue<_, [u8; 32]>;

	/// Storage for metadata, organized by task ID and a secondary nonce.
	///
	/// Each entry of metadata is bounded in size by `MaxMetadataLen` and is associated with a
	/// specific task, allowing for versioning or multiple pieces of metadata per task.
	#[pallet::storage]
	#[pallet::getter(fn remove_vote)]
	pub(super) type Metadata<T: Config> = StorageDoubleMap<
		_,
		Twox64Concat,
		u32,
		Twox64Concat,
		u32,
		WeakBoundedVec<u8, T::MaxMetadataLen>,
	>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Event emitted when a value is stored.
		/// Parameters: [Value, Account ID]
		SomethingStored(u32, T::AccountId),

		/// Event emitted when a new verifying key is added.
		/// Parameters: [Account ID, New Verifying Key]
		NewKey(T::AccountId, [u8; 32]),

		/// Event emitted when a new metadata is added.
		/// Parameters: [Task ID, Metadata ID, Account ID]
		MetadataAdded(u32, u32, T::AccountId),

		/// Event emitted when a new key is added.
		/// Parameters: [Account ID, New Key]
		KeyAdded(T::AccountId, [u8; 32]),
	}

	#[pallet::error]
	pub enum Error<T> {
		/// Invalid signature provided for a new key.
		/// This error occurs when the provided signature for a new key rotation does not match.
		InvalidNewSignature,

		/// Invalid signature.
		/// This error is raised when a provided signature is invalid or does not match the expected value.
		InvalidSignature,

		/// No existing key.
		/// This error indicates that there is no existing key available for operations requiring one.
		NoExistingKey,

		/// Task ID exceeds the allowable limit.
		/// This error occurs when a task ID is provided that is greater than the allowable limit.
		TaskIdOverflow,

		/// Invalid task ID.
		/// Raised when an invalid task ID is provided, such as a task ID that is too high or does not exist.
		InvalidTaskId,

		/// Nonce mismatch.
		/// This error is raised when the provided nonce does not match the expected value for a given operation.
		NonceMismatch,

		/// Metadata length exceeds the maximum limit.
		/// This error occurs when the provided metadata exceeds the length limit set by `MaxMetadataLen`.
		MetadataTooLong,

		/// Invalid old verification key.
		InvalidOldVerificationKey,
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Rotate the verifying key.
		///
		/// Allows a user to rotate the verifying key used for subsequent operations. This function
		/// requires the new key to be signed with the old key to ensure that the key rotation is authorized.
		///
		/// The dispatch origin for this call must be `Signed` by the account that holds the current
		/// verifying key.
		///
		/// Parameters:
		/// - `origin`: The origin of the call, which must be signed.
		/// - `new_key`: The new verifying key to be set.
		/// - `signature_bytes`: A signature over the new verifying key, created using the old key, to
		///   authenticate the rotation request.
		///
		/// Emits `NewKey` event when successful.
		#[pallet::call_index(0)]
		#[pallet::weight(Weight::from_parts(10_000, 0) + T::DbWeight::get().writes(1))]
		pub fn rotate_key(
			origin: OriginFor<T>,
			new_key: [u8; 32],
			signature_bytes: [u8; 64],
		) -> DispatchResultWithPostInfo {
			let from = ensure_signed(origin)?;

			let signature = Signature::try_from(signature_bytes)
				.map_err(|_| Error::<T>::InvalidNewSignature)?;

			let old_key_bytes = <VerifyingKey<T>>::get().ok_or(Error::<T>::NoExistingKey)?;

			let old_key = VerificationKey::try_from(old_key_bytes)
				.map_err(|_| Error::<T>::InvalidOldVerificationKey)?;

			let msg = new_key.encode();

			let is_valid = old_key.verify(&signature, &msg).is_ok();
			ensure!(is_valid, Error::<T>::InvalidSignature);

			<VerifyingKey<T>>::put(new_key.clone());

			Self::deposit_event(Event::NewKey(from, new_key));

			Ok(().into())
		}

		/// Add a new metadata entry.
		///
		/// The dispatch origin for this call must be `Signed` by the caller.
		///
		/// Parameters:
		/// - `origin`: The origin of the call.
		/// - `id`: Identifier of the task, must be at most `LastTaskId + 1`.
		/// - `metadata`: The metadata to be stored, limited by `MaxMetadataLen`.
		/// - `nonce`: A sequentially increasing number representing the metadata entry.
		#[pallet::call_index(1)]
		#[pallet::weight(Weight::from_parts(10_000, 0) + T::DbWeight::get().writes(1))]
		pub fn new_metadata(
			origin: OriginFor<T>,
			id: u32,
			nonce: u32,
			metadata: WeakBoundedVec<u8, T::MaxMetadataLen>,
			signature_bytes: [u8; 64],
		) -> DispatchResultWithPostInfo {
			let who = ensure_signed(origin)?;

			let signature = Signature::try_from(signature_bytes)
				.map_err(|_| Error::<T>::InvalidNewSignature)?;

			let mut msg = metadata.encode();
			msg.extend_from_slice(&id.encode());
			msg.extend_from_slice(&nonce.encode());

			let key_bytes = <VerifyingKey<T>>::get().ok_or(Error::<T>::NoExistingKey)?;

			let key = VerificationKey::try_from(key_bytes)
				.map_err(|_| Error::<T>::InvalidOldVerificationKey)?;

			let is_valid = key.verify(&signature, &msg).is_ok();
			ensure!(is_valid, Error::<T>::InvalidSignature);

			let current_id = LastTaskId::<T>::get().unwrap_or(0);

			ensure!(id <= current_id + 1, Error::<T>::InvalidTaskId);

			if id == current_id + 1 {
				LastTaskId::<T>::put(id);
			}

			ensure!(Metadata::<T>::contains_key(id, nonce), Error::<T>::NonceMismatch);
			Metadata::<T>::insert(id, nonce, metadata.clone());

			Self::deposit_event(Event::MetadataAdded(id, nonce, who));
			Ok(().into())
		}

		/// Add a new verifying key.
		///
		/// The dispatch origin for this call must be `Signed` by the caller.
		///
		/// Parameters:
		/// - `origin`: The origin of the call.
		/// - `new_key`: The new verifying key to be stored.
		#[pallet::call_index(2)]
		#[pallet::weight(Weight::from_parts(10_000, 0) + T::DbWeight::get().writes(1))]
		pub fn new_key(origin: OriginFor<T>, new_key: [u8; 32]) -> DispatchResultWithPostInfo {
			let who = ensure_signed(origin)?;

			VerifyingKey::<T>::put(new_key.clone());

			Self::deposit_event(Event::KeyAdded(who, new_key));
			Ok(().into())
		}
	}
}
