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

// #[cfg(feature = "runtime-benchmarks")]
// mod benchmarking;
// mod mock;
// mod tests;

// pub mod weights;
// pub use weights::*;

use codec::{Decode, Encode, MaxEncodedLen};
use cumulus_primitives_core::relay_chain::ValidatorId;
use frame_support::{
	pallet_prelude::*,
	traits::{Get, OneSessionHandler},
	BoundedSlice, WeakBoundedVec,
};
use frame_system::{
	offchain::{SendTransactionTypes, SubmitTransaction},
	pallet_prelude::*,
};
use rc_validator_fetch::ValidatorsInfo;
use redot_core_primitives::{AuthorityStatus, GetValidatorsFromRuntime};
use scale_info::TypeInfo;
use sp_application_crypto::RuntimeAppPublic;
use sp_runtime::RuntimeDebug;
use sp_std::prelude::*;
// use sp_runtime::{
// 	generic::{DigestItem, Era},
// 	traits::{BlakeTwo256, Block as BlockT, Header as HeaderT, IdentityLookup},
// 	transaction_validity::{
// 		InvalidTransaction, TransactionValidityError, UnknownTransaction, ValidTransaction,
// 	},
// 	DispatchError,
// };

use melo_das_db::offchain::OffchainKv;

pub use pallet::*;

// A prefix constant used for the off-chain database.
const DB_PREFIX: &[u8] = b"redot/validator-registry/";
pub const DELAY_CHECK_THRESHOLD: u32 = 1;
// Weight constant for each blob.
pub const WEIGHT_PER_BLOB: Weight = Weight::from_parts(1024, 0);

// Typedef for Authorization Index.
pub type AuthIndex = u32;

/// Possible errors that can occur during off-chain execution.
#[cfg_attr(test, derive(PartialEq))]
enum OffchainErr {
	FailedSigning,
	SubmitTransaction,
}

impl sp_std::fmt::Debug for OffchainErr {
	fn fmt(&self, fmt: &mut sp_std::fmt::Formatter) -> sp_std::fmt::Result {
		match *self {
			OffchainErr::FailedSigning => write!(fmt, "Failed to sign report"),
			OffchainErr::SubmitTransaction => write!(fmt, "Failed to submit transaction"),
		}
	}
}

// Typedef for results returned by off-chain operations.
type OffchainResult<A> = Result<A, OffchainErr>;

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, RuntimeDebug)]
pub struct ValidatorVoteInfo<BlockNumber>
where
	BlockNumber: PartialEq + Eq + Decode + Encode,
{
	pub remove: Vec<ValidatorId>,
	pub add: Vec<ValidatorId>,
	pub authority_index: AuthIndex,
	/// Total length of session validator set.
	pub validators_len: u32,
	pub at_block: BlockNumber,
}

#[frame_support::pallet]
pub mod pallet {
	use super::*;

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	/// Provides configuration parameters for the pallet.
	#[pallet::config]
	pub trait Config: SendTransactionTypes<Call<Self>> + frame_system::Config {
		/// This type represents an event in the runtime, which includes events emitted by this
		/// pallet.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// This type represents the computation cost of the pallet's operations.
		// type WeightInfo: WeightInfo;

		/// Defines the upper limit for the number of keys that can be stored.
		type MaxKeys: Get<u32>;

		/// This type defines the unique identifier for an authority or a trusted node in the
		/// network.
		type AuthorityId: Member
			+ Parameter
			+ RuntimeAppPublic
			+ Ord
			+ MaybeSerializeDeserialize
			+ MaxEncodedLen;

		/// Defines the upper limit for the number of keys that can be stored.
		type MaxPending: Get<u32>;

		/// The maximum number of blobs that can be handled.
		#[pallet::constant]
		type MaxBlobNum: Get<u32>;

		/// The maximum number of commitments that can be extended.
		#[pallet::constant]
		type MaxExtedLen: Get<u32>;

		/// This defines the priority for unsigned transactions in the Melo context.
		#[pallet::constant]
		type MeloUnsignedPriority: Get<TransactionPriority>;
	}

	#[pallet::storage]
	#[pallet::getter(fn keys)]
	pub(super) type Keys<T: Config> =
		StorageValue<_, WeakBoundedVec<T::AuthorityId, T::MaxKeys>, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn pending)]
	pub(super) type Pending<T: Config> =
		StorageValue<_, WeakBoundedVec<ValidatorId, T::MaxPending>, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn validators)]
	pub(super) type Validators<T: Config> =
		StorageValue<_, WeakBoundedVec<ValidatorId, T::MaxKeys>, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn validators_map)]
	pub(super) type ValidatorsStatus<T: Config> =
		StorageMap<_, Twox64Concat, ValidatorId, AuthorityStatus, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn remove_vote)]
	pub(super) type RemoveVote<T: Config> =
		StorageDoubleMap<_, Twox64Concat, BlockNumberFor<T>, Twox64Concat, ValidatorId, u32>;

	#[pallet::storage]
	#[pallet::getter(fn add_vote)]
	pub(super) type AddVote<T: Config> =
		StorageDoubleMap<_, Twox64Concat, BlockNumberFor<T>, Twox64Concat, ValidatorId, u32>;

	#[pallet::storage]
	#[pallet::getter(fn votes)]
	pub(super) type Votes<T: Config> = StorageMap<
		_,
		Twox64Concat,
		BlockNumberFor<T>,
		WeakBoundedVec<AuthIndex, T::MaxBlobNum>,
		ValueQuery,
	>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		VoteReceived { at_block: BlockNumberFor<T>, from: AuthIndex },
		/// Denotes the successful registration of a new validator ID.
		Registered { validator_id: ValidatorId, from: T::AccountId },
	}

	/// Enumerates all possible errors that might occur while using this pallet.
	#[pallet::error]
	pub enum Error<T> {
		/// User is blocked
		UserBlocked,
		/// User has not submitted registration
		UserNotRegistered,
		/// Unable to register more users
		ExceedMaxUserLimit,
		/// Duplicate voting
		DuplicateVote,
		/// Validator not found
		ValidatorNotFound,
		/// Duplicate report submission
		InvalidKey,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(Weight::from_parts(10_000, 0) + T::DbWeight::get().writes(1))]
		pub fn registry(origin: OriginFor<T>, validator_id: ValidatorId) -> DispatchResult {
			let who = ensure_signed(origin)?;

			// TODO 我们是否允许绑定其他 ID 还是直接使用 validator_id？

			// 检查 ValidatorsStatus 中对应的 AuthorityStatus
			let status = ValidatorsStatus::<T>::get(&validator_id);
			match status {
				AuthorityStatus::Block => Err(Error::<T>::InvalidKey)?,
				AuthorityStatus::Enabled => {
					let mut pending = Pending::<T>::get();
					ensure!(!pending.contains(&validator_id), Error::<T>::UserNotRegistered);

					pending
						.try_push(validator_id.clone())
						.map_err(|_| Error::<T>::ExceedMaxUserLimit)?;
					Pending::<T>::put(pending);

					Self::deposit_event(Event::Registered { validator_id, from: who });
				},
			}

			Ok(())
		}

		#[pallet::call_index(1)]
		#[pallet::weight(Weight::from_parts(10_000, 0) + T::DbWeight::get().writes(1))]
		pub fn update(
			origin: OriginFor<T>,
			votes: ValidatorVoteInfo<BlockNumberFor<T>>,
			_signature: <T::AuthorityId as RuntimeAppPublic>::Signature,
		) -> DispatchResult {
			ensure_none(origin)?;

			let now = <frame_system::Pallet<T>>::block_number();

			let keys = Keys::<T>::get();

			ensure!(keys.get(votes.authority_index as usize).is_some(), Error::<T>::InvalidKey);

			let vote_map = Votes::<T>::get(now);

			ensure!(vote_map.contains(&votes.authority_index), Error::<T>::DuplicateVote);

			let mut validators = Validators::<T>::get();
			let mut pending = Pending::<T>::get();

			votes.add.iter().try_for_each(|id| {
				ensure!(!pending.contains(id), Error::<T>::ValidatorNotFound);

				let mut add_vote = AddVote::<T>::get(now, id).unwrap_or_default();
				add_vote += 1;
				AddVote::<T>::insert(now, id, add_vote);

				if add_vote > keys.len() as u32 / 2 {
					validators.try_push(id.clone()).map_err(|_| Error::<T>::ExceedMaxUserLimit)?;
					pending.retain(|v| v != id);
				}

				Ok::<(), Error<T>>(())
			})?;

			votes.remove.iter().try_for_each(|id| {
				let mut validators = Validators::<T>::get();

				ensure!(!validators.contains(id), Error::<T>::ValidatorNotFound);

				let mut remove_vote = RemoveVote::<T>::get(now, id).unwrap_or_default();
				remove_vote += 1;
				RemoveVote::<T>::insert(now, id, remove_vote);

				if remove_vote > keys.len() as u32 / 2 {
					validators.retain(|v| v != id);
				}

				Ok::<(), Error<T>>(())
			})?;

			Validators::<T>::put(validators);
			Pending::<T>::put(pending);

			Ok(())
		}
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn on_finalize(now: BlockNumberFor<T>) {
			// // Deletion of expired polling data
			// if T::BlockNumber::from(DELAY_CHECK_THRESHOLD + 1) >= now {
			// 	return;
			// }
			// let _ = ValidatorVoteInfo::<T>::clear_prefix(
			// 	now - (DELAY_CHECK_THRESHOLD + 1).into(),
			// 	T::MaxBlobNum::get(),
			// 	None,
			// );
		}

		fn offchain_worker(now: BlockNumberFor<T>) {
			// Only send messages if we are a potential validator.
			if sp_io::offchain::is_validator() {
				for res in Self::send_validators_update(now).into_iter().flatten() {
					if let Err(e) = res {
						log::debug!(
							target: "runtime::melo-store",
							"Skipping report at {:?}: {:?}",
							now,
							e,
						)
					}
				}
			} else {
				log::trace!(
					target: "runtime::melo-store",
					"Skipping report at {:?}. Not a validator.",
					now,
				)
			}
		}
	}

	pub(crate) const INVALID_VALIDATORS_LEN: u8 = 10;

	#[pallet::validate_unsigned]
	impl<T: Config> ValidateUnsigned for Pallet<T> {
		type Call = Call<T>;

		fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
			if let Call::update { votes, signature } = call {
				let keys = Keys::<T>::get();

				let authority_id = match keys.get(votes.authority_index as usize) {
					Some(id) => id,
					None => return InvalidTransaction::Stale.into(),
				};

				let keys = Keys::<T>::get();
				if keys.len() as u32 != votes.validators_len {
					return InvalidTransaction::Custom(INVALID_VALIDATORS_LEN).into();
				}

				let signature_valid = votes.using_encoded(|encoded_report| {
					authority_id.verify(&encoded_report, signature)
				});

				if !signature_valid {
					return InvalidTransaction::BadProof.into();
				}

				ValidTransaction::with_tag_prefix("MeloStore")
					.priority(T::MeloUnsignedPriority::get())
					.longevity(DELAY_CHECK_THRESHOLD as u64)
					.propagate(true)
					.build()
			} else {
				InvalidTransaction::Call.into()
			}
		}
	}
}

impl<T: Config> Pallet<T> {
	pub fn fetch_list() -> (Vec<ValidatorId>, Vec<ValidatorId>) {
		let mut db = OffchainKv::new(Some(DB_PREFIX));
		let validators_info = ValidatorsInfo::from_db(&mut db);

		if let Some(validators_info) = validators_info {
			let pending = Pending::<T>::get();
			let add = validators_info.get_new_validators(&pending.to_vec());
			let old = Validators::<T>::get();
			let remove = validators_info.get_removed_validators(&old.to_vec());
			return (add, remove);
		} else {
			return (vec![], vec![]);
		}
	}

	pub(crate) fn send_validators_update(
		now: BlockNumberFor<T>,
	) -> OffchainResult<impl Iterator<Item = OffchainResult<()>>> {
		let at_block = now;
		let (add, remove) = Self::fetch_list();

		Ok(Self::local_authority_keys().map(move |(authority_index, key)| {
			Self::send_single_validators_update(
				authority_index,
				key,
				at_block,
				now,
				remove.clone(),
				add.clone(),
			)
		}))
	}

	fn send_single_validators_update(
		authority_index: u32,
		key: T::AuthorityId,
		at_block: BlockNumberFor<T>,
		now: BlockNumberFor<T>,
		remove: Vec<ValidatorId>,
		add: Vec<ValidatorId>,
	) -> OffchainResult<()> {
		if add.is_empty() && remove.is_empty() {
			return Ok(());
		}

		let prepare_votes = || -> OffchainResult<Call<T>> {
			let validators_len = Keys::<T>::decode_len().unwrap_or_default() as u32;
			let votes =
				ValidatorVoteInfo { at_block, remove, add, authority_index, validators_len };

			let signature = key.sign(&votes.encode()).ok_or(OffchainErr::FailedSigning)?;

			Ok(Call::update { votes, signature })
		};

		let call = prepare_votes()?;
		log::info!(
			target: "runtime::validator-registry",
			"[index: {:?}] Update data of {:?} (at block: {:?}) : {:?}",
			authority_index,
			at_block,
			now,
			call,
		);

		SubmitTransaction::<T, Call<T>>::submit_unsigned_transaction(call.into())
			.map_err(|_| OffchainErr::SubmitTransaction)?;

		Ok(())
	}

	// Fetch all local authority keys.
	fn local_authority_keys() -> impl Iterator<Item = (u32, T::AuthorityId)> {
		let authorities = Keys::<T>::get();

		let mut local_keys = T::AuthorityId::all();

		local_keys.sort();

		authorities.into_iter().enumerate().filter_map(move |(index, authority)| {
			local_keys
				.binary_search(&authority)
				.ok()
				.map(|location| (index as u32, local_keys[location].clone()))
		})
	}

	// Initialize the authority keys.
	fn initialize_keys(keys: &[T::AuthorityId]) {
		if !keys.is_empty() {
			assert!(Keys::<T>::get().is_empty(), "Keys are already initialized!");
			let bounded_keys = <BoundedSlice<'_, _, T::MaxKeys>>::try_from(keys)
				.expect("More than the maximum number of keys provided");
			Keys::<T>::put(bounded_keys);
		}
	}

	// Set the authority keys (used for testing purposes).
	#[cfg(test)]
	fn set_keys(keys: Vec<T::AuthorityId>) {
		let bounded_keys = WeakBoundedVec::<_, T::MaxKeys>::try_from(keys)
			.expect("More than the maximum number of keys provided");
		Keys::<T>::put(bounded_keys);
	}
}

// impl<T: Config> GetValidatorsFromRuntime for Pallet<T> {
// 	type ValidatorId = ValidatorId;
// 	fn validators() -> Vec<ValidatorId> {
// 		Validators::<T>::get()
// 	}

// 	fn is_validator(validator_id: ValidatorId) -> bool {
// 		Validators::<T>::get().contains(&validator_id)
// 	}

// 	fn validator_count() -> u32 {
// 		Validators::<T>::decode_len().unwrap_or_default() as u32
// 	}
// }

impl<T: Config> sp_runtime::BoundToRuntimeAppPublic for Pallet<T> {
	type Public = T::AuthorityId;
}

impl<T: Config> OneSessionHandler<T::AccountId> for Pallet<T> {
	type Key = T::AuthorityId;

	fn on_genesis_session<'a, I: 'a>(validators: I)
	where
		I: Iterator<Item = (&'a T::AccountId, T::AuthorityId)>,
	{
		let keys = validators.map(|x| x.1).collect::<Vec<_>>();
		Self::initialize_keys(&keys);
	}

	fn on_new_session<'a, I: 'a>(_changed: bool, validators: I, _queued_validators: I)
	where
		I: Iterator<Item = (&'a T::AccountId, T::AuthorityId)>,
	{
		// Remember who the authorities are for the new session.
		let keys = validators.map(|x| x.1).collect::<Vec<_>>();
		let bounded_keys = WeakBoundedVec::<_, T::MaxKeys>::force_from(
			keys,
			Some(
				"Warning: The session has more keys than expected. \
  				A runtime configuration adjustment may be needed.",
			),
		);
		Keys::<T>::put(bounded_keys);
	}

	fn on_before_session_ending() {
		// ingore
	}

	fn on_disabled(i: u32) {
		Keys::<T>::mutate(|keys| {
			keys.remove(i as usize);
		});
	}
}
