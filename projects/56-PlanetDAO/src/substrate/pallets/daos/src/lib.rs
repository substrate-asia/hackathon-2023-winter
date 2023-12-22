#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Encode, Decode};
pub use pallet::*;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;
use scale_info::prelude::string::String;
pub use weights::*;
// pub mod rpc;
pub mod types;


#[frame_support::pallet]
pub mod pallet {

	use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;
	use types::*;

	#[pallet::pallet]
	#[pallet::without_storage_info]
	pub struct Pallet<T>(_);

	#[pallet::config]
	pub trait Config: frame_system::Config {
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		type WeightInfo: WeightInfo;
	}

	#[pallet::storage]
	#[pallet::getter(fn _dao_ids)]
	pub type _dao_ids<T> = StorageValue<_, u32>;

	/// Get the details of a daos by its' id.
	#[pallet::storage]
	#[pallet::getter(fn dao_by_id)]
	pub type DaoById<T: Config> = StorageMap<_, Twox64Concat, u32, DAO>;

	#[pallet::storage]
	#[pallet::getter(fn template_by_id)]
	pub type TemplateById<T: Config> = StorageMap<_, Twox64Concat, u32, String>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		SomethingStored { something: u32, who: T::AccountId },
	}

	#[pallet::error]
	pub enum Error<T> {
		NoneValue,
		StorageOverflow,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(T::WeightInfo::create_dao())]
		pub fn create_dao(
			origin: OriginFor<T>,
			_dao_wallet: String,
			_dao_uri: String,
			_template: String,
		) -> DispatchResult {

			let mut new_id = 0;
			match <_dao_ids<T>>::try_get(){
				Ok(old)=>{
					new_id = old;
					<_dao_ids<T>>::put(new_id + 1);
				}
				Err(_)=>{<_dao_ids<T>>::put(1);}
			}

			let new_dao = &mut  DAO {
				id: new_id,
				dao_uri: _dao_uri,
				dao_wallet: _dao_wallet,
				finished:  String::from("False")
			} ;

			DaoById::<T>::insert(new_id, new_dao);
			TemplateById::<T>::insert(new_id, _template);
			Ok(())
		}


		#[pallet::call_index(1)]
		#[pallet::weight(T::WeightInfo::update_template())]
		pub fn update_template(
			_origin: OriginFor<T>,
			_dao_id: u32,
			_template: String,
		) -> DispatchResult {

			TemplateById::<T>::set(_dao_id, Some( _template));
			Ok(())
		}

		#[pallet::call_index(2)]
		#[pallet::weight(T::WeightInfo::cause_error())]
		pub fn cause_error(origin: OriginFor<T>) -> DispatchResult {
			let _who = ensure_signed(origin)?;

			// Read a value from storage.
			match <_dao_ids<T>>::get() {
				// Return an error if the value has not been set.
				None => return Err(Error::<T>::NoneValue.into()),
				Some(old) => {
					let new = old.checked_add(1).ok_or(Error::<T>::StorageOverflow)?;
					<_dao_ids<T>>::put(new);
					Ok(())
				},
			}
		}

	}
}
