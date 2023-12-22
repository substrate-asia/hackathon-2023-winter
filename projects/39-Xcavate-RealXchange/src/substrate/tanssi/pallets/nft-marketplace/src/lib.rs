#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;
pub use weights::WeightInfo;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;
pub use weights::*;

use frame_support::{
	traits::{Currency, ExistenceRequirement::KeepAlive, Incrementable, ReservableCurrency},
	PalletId,
};

use frame_support::sp_runtime::traits::{
	AccountIdConversion, CheckedDiv, CheckedMul, StaticLookup,
};

use enumflags2::BitFlags;

use pallet_nfts::{
	CollectionConfig, CollectionSetting, CollectionSettings, ItemConfig, ItemSettings, MintSettings,
};

type AccountIdOf<T> = <T as frame_system::Config>::AccountId;

type BalanceOf<T> =
	<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

type BalanceOf1<T> = <<T as pallet_nfts::Config>::Currency as Currency<
	<T as frame_system::Config>::AccountId,
>>::Balance;

#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	pub type ListedNftIndex = u32;

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	#[cfg(feature = "runtime-benchmarks")]
	pub struct NftHelper;

	#[cfg(feature = "runtime-benchmarks")]
	pub trait BenchmarkHelper<CollectionId, ItemId> {
		fn to_collection(i: u32) -> CollectionId;
		fn to_nft(i: u32) -> ItemId;
	}

	#[cfg(feature = "runtime-benchmarks")]
	impl<CollectionId: From<u32>, ItemId: From<u32>> BenchmarkHelper<CollectionId, ItemId>
		for NftHelper
	{
		fn to_collection(i: u32) -> CollectionId {
			i.into()
		}
		fn to_nft(i: u32) -> ItemId {
			i.into()
		}
	}

	#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
	#[derive(Encode, Decode, Clone, PartialEq, Eq, MaxEncodedLen, RuntimeDebug, TypeInfo)]
	#[scale_info(skip_type_params(T))]
	pub struct NftDetails<Balance, CollectionId, ItemId, T: Config> {
		pub real_estate_developer: AccountIdOf<T>,
		pub owner: AccountIdOf<T>,
		pub price: Balance,
		pub collection_id: CollectionId,
		pub item_id: ItemId,
		pub sold: bool,
	}

	#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
	#[derive(Encode, Decode, Clone, PartialEq, Eq, MaxEncodedLen, RuntimeDebug, TypeInfo)]
	#[scale_info(skip_type_params(T))]
	pub struct CollectionDetails {
		pub spv_created: bool,
	}

	/// AccountId storage
	#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
	#[derive(Encode, Decode, Clone, PartialEq, Eq, MaxEncodedLen, RuntimeDebug, TypeInfo)]
	pub struct PalletIdStorage<T: Config> {
		pallet_id: AccountIdOf<T>,
	}

	/// The module configuration trait.
	#[pallet::config]
	pub trait Config:
		frame_system::Config + pallet_nfts::Config + pallet_whitelist::Config
	{
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// Type representing the weight of this pallet.
		type WeightInfo: WeightInfo;

		/// The currency type.
		type Currency: Currency<AccountIdOf<Self>> + ReservableCurrency<AccountIdOf<Self>>;

		/// The marketplace's pallet id, used for deriving its sovereign account ID.
		#[pallet::constant]
		type PalletId: Get<PalletId>;

		#[cfg(feature = "runtime-benchmarks")]
		type Helper: crate::BenchmarkHelper<
			<Self as pallet_nfts::Config>::CollectionId,
			<Self as pallet_nfts::Config>::ItemId,
		>;

		/// The maximum amount of nfts that can be listed at the same time.
		#[pallet::constant]
		type MaxListedNfts: Get<u32>;

		/// The maximum amount of nfts for a collection.
		type MaxNftInCollection: Get<u32>;

		type CollectionId: IsType<<Self as pallet_nfts::Config>::CollectionId>
			+ Parameter
			+ From<u32>
			+ Ord
			+ Copy
			+ MaxEncodedLen
			+ Encode;

		type ItemId: IsType<<Self as pallet_nfts::Config>::ItemId>
			+ Parameter
			+ From<u32>
			+ Ord
			+ Copy
			+ MaxEncodedLen
			+ Encode;

		/// The Trasury's pallet id, used for deriving its sovereign account ID.
		#[pallet::constant]
		type TreasuryId: Get<PalletId>;

		/// The CommunityProjects's pallet id, used for deriving its sovereign account ID.
		#[pallet::constant]
		type CommunityProjectsId: Get<PalletId>;
	}

	pub type CollectionId<T> = <T as Config>::CollectionId;
	pub type ItemId<T> = <T as Config>::ItemId;

	/// Vector with all currently ongoing listings.
	#[pallet::storage]
	#[pallet::getter(fn listed_nfts)]
	pub(super) type ListedNfts<T: Config> = StorageValue<
		_,
		BoundedVec<
			(<T as pallet::Config>::CollectionId, <T as pallet::Config>::ItemId),
			T::MaxListedNfts,
		>,
		ValueQuery,
	>;

	/// Mapping from the nft to the nft details.
	#[pallet::storage]
	#[pallet::getter(fn ongoing_nft_details)]
	pub(super) type OngoingNftDetails<T: Config> = StorageDoubleMap<
		_,
		Blake2_128Concat,
		<T as pallet::Config>::CollectionId,
		Blake2_128Concat,
		<T as pallet::Config>::ItemId,
		NftDetails<
			BalanceOf<T>,
			<T as pallet::Config>::CollectionId,
			<T as pallet::Config>::ItemId,
			T,
		>,
		OptionQuery,
	>;

	/// Details of a collection.
	#[pallet::storage]
	#[pallet::getter(fn listed_collection_details)]
	pub(super) type ListedCollectionDetails<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		<T as pallet::Config>::CollectionId,
		CollectionDetails,
		OptionQuery,
	>;

	/// Mapping of collection to the listed nfts of this collection.
	#[pallet::storage]
	#[pallet::getter(fn listed_nfts_of_collection)]
	pub(super) type ListedNftsOfCollection<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		<T as pallet::Config>::CollectionId,
		BoundedVec<<T as pallet::Config>::ItemId, T::MaxNftInCollection>,
		ValueQuery,
	>;

	/// Mapping of collection to the already sold nfts of this collection.
	#[pallet::storage]
	#[pallet::getter(fn sold_nfts_collection)]
	pub(super) type SoldNftsCollection<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		<T as pallet::Config>::CollectionId,
		BoundedVec<<T as pallet::Config>::ItemId, T::MaxNftInCollection>,
		ValueQuery,
	>;

	/// Mapping from real estate developer to his listed nfts.
	#[pallet::storage]
	#[pallet::getter(fn seller_listings)]
	pub(super) type SellerListings<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		AccountIdOf<T>,
		BoundedVec<
			(<T as pallet::Config>::CollectionId, <T as pallet::Config>::ItemId),
			T::MaxListedNfts,
		>,
		ValueQuery,
	>;

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// A new object has been listed on the marketplace.
		ObjectListed {
			collection_index: <T as pallet::Config>::CollectionId,
			price: BalanceOf<T>,
			seller: AccountIdOf<T>,
		},
		/// A nft has been bought.
		NftBought {
			collection_index: <T as pallet::Config>::CollectionId,
			item_index: <T as pallet::Config>::ItemId,
			buyer: AccountIdOf<T>,
			price: BalanceOf<T>,
		},
		/// A sigle nft has been listed.
		NftListed {
			collection_index: <T as pallet::Config>::CollectionId,
			price: BalanceOf<T>,
			seller: AccountIdOf<T>,
		},
		/// The price of the nft has been updated.
		NftUpdated {
			collection_index: <T as pallet::Config>::CollectionId,
			item_index: <T as pallet::Config>::ItemId,
			new_price: BalanceOf<T>,
		},
		/// The nft has been delisted.
		NftDelisted {
			collection_index: <T as pallet::Config>::CollectionId,
			item_index: <T as pallet::Config>::ItemId,
		},
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Max amount of listed Nfts reached.
		TooManyListedNfts,
		/// This index is not taken.
		InvalidIndex,
		/// Too many nfts for this collection.
		TooManyNfts,
		/// The buyer doesn't have enough funds.
		NotEnoughFunds,
		/// The collection has not been found.
		CollectionNotFound,
		/// Not enough nfts available to buy.
		NotEnoughNftsAvailable,
		/// Distribution of the nfts failed.
		DistributionError,
		/// Error by convertion to balance type.
		ConversionError,
		/// Error by dividing a number.
		DivisionError,
		/// Error by multiplying a number.
		MultiplyError,
		/// There is an issue by calling the next collection id.
		UnknownCollection,
		/// The nft has not been found.
		ItemNotFound,
		/// No sufficient permission.
		NoPermission,
		/// The Nft is not listed on the marketplace.
		NftNotListed,
		/// The nft is relisted and can't be bought with this function.
		NftIsRelisted,
		/// The nft can't be bought with this function.
		NftAlreadyRelisted,
		/// Nft can only be bought through presale.
		SpvNotCreated,
		/// The Nft is not listed on the marketplace.
		NftNotForSale,
		/// Collection is not known to this pallet.
		CollectionNotKnown,
		/// User has not passed the kyc.
		UserNotWhitelisted,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// List a real estate object. A new collection is created and 100 nfts get minted.
		/// This function calls the nfts-pallet to creates a collection, mint nfts and set the Metadata.
		///
		/// The origin must be Signed and the sender must have sufficient funds free.
		///
		/// Parameters:
		/// - `price`: The price of the real estate object that is offered.
		/// - `data`: The Metadata of the collection and the single nfts.
		///
		/// Emits `ObjectListed` event when succesfful
		#[pallet::call_index(0)]
		#[pallet::weight(<T as pallet::Config>::WeightInfo::list_object())]
		pub fn list_object(
			origin: OriginFor<T>,
			price: BalanceOf<T>,
			data: BoundedVec<u8, T::StringLimit>,
		) -> DispatchResult {
			let signer = ensure_signed(origin.clone())?;

			ensure!(
				pallet_whitelist::Pallet::<T>::whitelisted_accounts().contains(&signer),
				Error::<T>::UserNotWhitelisted
			);

			if pallet_nfts::NextCollectionId::<T>::get().is_none() {
				pallet_nfts::NextCollectionId::<T>::set(
					<T as pallet_nfts::Config>::CollectionId::initial_value(),
				);
			};
			let collection_id =
				pallet_nfts::NextCollectionId::<T>::get().ok_or(Error::<T>::UnknownCollection)?;
			let next_collection_id = collection_id.increment();
			pallet_nfts::NextCollectionId::<T>::set(next_collection_id);
			let collection_id: CollectionId<T> = collection_id.into();

			pallet_nfts::Pallet::<T>::do_create_collection(
				collection_id.into(),
				signer.clone(),
				signer.clone(),
				Self::default_collection_config(),
				T::CollectionDeposit::get(),
				pallet_nfts::Event::Created {
					creator: Self::account_id(),
					owner: Self::account_id(),
					collection: collection_id.into(),
				},
			)?;
			pallet_nfts::Pallet::<T>::set_collection_metadata(
				origin.clone(),
				collection_id.into(),
				data.clone(),
			)?;

			let collection_details = CollectionDetails { spv_created: Default::default() };
			ListedCollectionDetails::<T>::insert(collection_id, collection_details);
			for x in 1..=100 {
				let item_id: <T as pallet::Config>::ItemId = x.into();
				let nft = NftDetails {
					real_estate_developer: signer.clone(),
					owner: Self::account_id(),
					price: price
						.checked_div(&Self::u64_to_balance_option(100)?)
						.ok_or(Error::<T>::DivisionError)?,
					collection_id,
					item_id,
					sold: Default::default(),
				};
				pallet_nfts::Pallet::<T>::do_mint(
					collection_id.into(),
					item_id.into(),
					Some(Self::account_id()),
					Self::account_id(),
					Self::default_item_config(),
					|_, _| Ok(()),
				)?;
				pallet_nfts::Pallet::<T>::set_metadata(
					origin.clone(),
					collection_id.into(),
					item_id.into(),
					data.clone(),
				)?;
				OngoingNftDetails::<T>::insert(collection_id, item_id, nft.clone());
				ListedNftsOfCollection::<T>::try_mutate(collection_id, |keys| {
					keys.try_push(item_id).map_err(|_| Error::<T>::TooManyNfts)?;
					Ok::<(), DispatchError>(())
				})?;
				ListedNfts::<T>::try_append((collection_id, item_id))
					.map_err(|_| Error::<T>::TooManyListedNfts)?;
				SellerListings::<T>::try_mutate(signer.clone(), |keys| {
					keys.try_push((collection_id, item_id)).map_err(|_| Error::<T>::TooManyNfts)?;
					Ok::<(), DispatchError>(())
				})?;
			}
			pallet_nfts::Pallet::<T>::set_team(
				origin.clone(),
				collection_id.into(),
				None,
				None,
				None,
			)?;
			Self::deposit_event(Event::<T>::ObjectListed {
				collection_index: collection_id,
				price,
				seller: signer,
			});
			Ok(())
		}

		/// List a single nft on the marketplace.
		/// The nft collection must be registered on the marketplace.
		///
		/// The origin must be Signed and the sender must have sufficient funds free.
		///
		/// Parameters:
		/// - `collection_id`: The collection of the nft.
		/// - `item_id`: The item id of the nft.
		/// - `price`: The price of the nft that is offered.
		///
		/// Emits `NftListed` event when succesfful
		#[pallet::call_index(1)]
		#[pallet::weight(<T as pallet::Config>::WeightInfo::list_nft())]
		pub fn list_nft(
			origin: OriginFor<T>,
			collection_id: <T as pallet::Config>::CollectionId,
			item_id: <T as pallet::Config>::ItemId,
			price: BalanceOf<T>,
		) -> DispatchResult {
			let signer = ensure_signed(origin.clone())?;

			ensure!(
				pallet_whitelist::Pallet::<T>::whitelisted_accounts().contains(&signer),
				Error::<T>::UserNotWhitelisted
			);

			ensure!(
				Self::listed_collection_details(collection_id).is_some(),
				Error::<T>::CollectionNotKnown
			);
			let pallet_lookup = <T::Lookup as StaticLookup>::unlookup(Self::account_id());
			pallet_nfts::Pallet::<T>::transfer(
				origin,
				collection_id.into(),
				item_id.into(),
				pallet_lookup,
			)?;
			let nft = NftDetails {
				real_estate_developer: signer.clone(),
				owner: signer.clone(),
				price,
				collection_id,
				item_id,
				sold: Default::default(),
			};
			OngoingNftDetails::<T>::insert(collection_id, item_id, nft.clone());
			ListedNftsOfCollection::<T>::try_mutate(collection_id, |keys| {
				keys.try_push(item_id).map_err(|_| Error::<T>::TooManyNfts)?;
				Ok::<(), DispatchError>(())
			})?;
			ListedNfts::<T>::try_append((collection_id, item_id))
				.map_err(|_| Error::<T>::TooManyListedNfts)?;
			SellerListings::<T>::try_mutate(signer.clone(), |keys| {
				keys.try_push((collection_id, item_id)).map_err(|_| Error::<T>::TooManyNfts)?;
				Ok::<(), DispatchError>(())
			})?;
			Self::deposit_event(Event::<T>::NftListed {
				collection_index: collection_id,
				price,
				seller: signer,
			});
			Ok(())
		}

		/// Buy listed nfts from the marketplace.
		///
		/// The origin must be Signed and the sender must have sufficient funds free.
		///
		/// Parameters:
		/// - `collection`: The collection that the investor wants to buy from.
		/// - `amount`: The amount of nfts that the investor wants to buy.
		///
		/// Emits `NftBought` event when succesfful.
		#[pallet::call_index(2)]
		#[pallet::weight(<T as pallet::Config>::WeightInfo::buy_nft())]
		pub fn buy_nft(
			origin: OriginFor<T>,
			collection: <T as pallet::Config>::CollectionId,
			amount: u32,
		) -> DispatchResult {
			let origin = ensure_signed(origin)?;
			ensure!(
				pallet_whitelist::Pallet::<T>::whitelisted_accounts().contains(&origin),
				Error::<T>::UserNotWhitelisted
			);
			ensure!(Self::collection_exists(collection), Error::<T>::CollectionNotFound);
			ensure!(
				Self::listed_nfts_of_collection(collection).len() as u32 >= amount,
				Error::<T>::NotEnoughNftsAvailable
			);
			let collection_details =
				Self::listed_collection_details(collection).ok_or(Error::<T>::InvalidIndex)?;
			ensure!(!collection_details.spv_created, Error::<T>::NftAlreadyRelisted);
			for _x in 0..amount as usize {
				let mut listed_items = Self::listed_nfts_of_collection(collection);
				let mut nft = <OngoingNftDetails<T>>::take(collection, listed_items[0])
					.ok_or(Error::<T>::InvalidIndex)?;
				nft.owner = origin.clone();
				nft.sold = true;
				SoldNftsCollection::<T>::try_mutate(collection, |keys| {
					keys.try_push(nft.item_id).map_err(|_| Error::<T>::TooManyNfts)?;
					Ok::<(), DispatchError>(())
				})?;
				let price = nft
					.price
					.checked_mul(&Self::u64_to_balance_option(1000000000000)?)
					.ok_or(Error::<T>::MultiplyError)?;
				Self::transfer_funds(&origin, &Self::account_id(), price)?;
				let mut listed_nfts = Self::listed_nfts();
				let index = listed_nfts
					.iter()
					.position(|x| *x == (nft.collection_id, nft.item_id))
					.unwrap();
				listed_nfts.remove(index);
				ListedNfts::<T>::put(listed_nfts);
				let index = listed_items
					.iter()
					.position(|x| *x == nft.item_id)
					.ok_or(Error::<T>::ItemNotFound)?;
				listed_items.remove(index);
				ListedNftsOfCollection::<T>::insert(collection, listed_items);
				let price = nft.price;
				let item = nft.item_id;
				OngoingNftDetails::<T>::insert(collection, item, nft.clone());
				if Self::sold_nfts_collection(collection).len() == 100 {
					Self::distribute_nfts(collection)?;
				}
				SellerListings::<T>::try_mutate(nft.real_estate_developer.clone(), |keys| {
					let index = keys
						.iter()
						.position(|x| *x == (collection, item))
						.ok_or(Error::<T>::ItemNotFound)?;
					keys.remove(index);
					Ok::<(), DispatchError>(())
				})?;
				Self::deposit_event(Event::<T>::NftBought {
					collection_index: collection,
					item_index: item,
					buyer: origin.clone(),
					price,
				});
			}
			Ok(())
		}

		/// Buy single nfts from the marketplace.
		///
		/// The origin must be Signed and the sender must have sufficient funds free.
		///
		/// Parameters:
		/// - `collection_id`: The collection that the investor wants to buy from.
		/// - `item_id`: The Item from the collection that the investor wants to buy from.
		///
		/// Emits `NftBought` event when succesfful.
		#[pallet::call_index(3)]
		#[pallet::weight(<T as pallet::Config>::WeightInfo::buy_single_nft())]
		pub fn buy_single_nft(
			origin: OriginFor<T>,
			collection_id: <T as pallet::Config>::CollectionId,
			item_id: <T as pallet::Config>::ItemId,
		) -> DispatchResult {
			let origin = ensure_signed(origin)?;
			ensure!(
				pallet_whitelist::Pallet::<T>::whitelisted_accounts().contains(&origin),
				Error::<T>::UserNotWhitelisted
			);
			ensure!(Self::collection_exists(collection_id), Error::<T>::CollectionNotFound);
			let collection_details =
				Self::listed_collection_details(collection_id).ok_or(Error::<T>::InvalidIndex)?;
			ensure!(collection_details.spv_created, Error::<T>::SpvNotCreated);
			let nft = <OngoingNftDetails<T>>::take(collection_id, item_id)
				.ok_or(Error::<T>::NftNotForSale)?;
			let price = nft
				.price
				.checked_mul(&Self::u64_to_balance_option(1000000000000)?)
				.ok_or(Error::<T>::MultiplyError)?;
			let fees = price
				.checked_div(&Self::u64_to_balance_option(100)?)
				.ok_or(Error::<T>::MultiplyError)?;
			let treasury_id = Self::treasury_account_id();
			let treasury_fees = fees
				.checked_mul(&Self::u64_to_balance_option(90)?)
				.ok_or(Error::<T>::MultiplyError)?
				.checked_div(&Self::u64_to_balance_option(100)?)
				.ok_or(Error::<T>::DivisionError)?;
			let community_projects_id = Self::community_account_id();
			let community_fees = fees
				.checked_div(&Self::u64_to_balance_option(10)?)
				.ok_or(Error::<T>::DivisionError)?;
			let seller_part = price
				.checked_mul(&Self::u64_to_balance_option(99)?)
				.ok_or(Error::<T>::MultiplyError)?
				.checked_div(&Self::u64_to_balance_option(100)?)
				.ok_or(Error::<T>::DivisionError)?;
			Self::transfer_funds(&origin, &treasury_id, treasury_fees)?;
			Self::transfer_funds(&origin, &community_projects_id, community_fees)?;
			Self::transfer_funds(&origin, &nft.owner, seller_part)?;
			pallet_nfts::Pallet::<T>::do_transfer(
				collection_id.into(),
				item_id.into(),
				origin.clone(),
				|_, _| Ok(()),
			)?;
			let mut listed_nfts = Self::listed_nfts();
			let index =
				listed_nfts.iter().position(|x| *x == (nft.collection_id, nft.item_id)).unwrap();
			listed_nfts.remove(index);
			ListedNfts::<T>::put(listed_nfts);
			let mut listed_items = Self::listed_nfts_of_collection(collection_id);
			let index = listed_items
				.iter()
				.position(|x| *x == nft.item_id)
				.ok_or(Error::<T>::ItemNotFound)?;
			listed_items.remove(index);
			ListedNftsOfCollection::<T>::insert(collection_id, listed_items);
			SellerListings::<T>::try_mutate(nft.real_estate_developer.clone(), |keys| {
				let index = keys
					.iter()
					.position(|x| *x == (nft.collection_id, nft.item_id))
					.ok_or(Error::<T>::ItemNotFound)?;
				keys.remove(index);
				Ok::<(), DispatchError>(())
			})?;
			Self::deposit_event(Event::<T>::NftBought {
				collection_index: collection_id,
				item_index: item_id,
				buyer: origin.clone(),
				price: nft.price,
			});
			Ok(())
		}

		/// Upgrade the price from a listed nft.
		///
		/// The origin must be Signed and the sender must have sufficient funds free.
		///
		/// Parameters:
		/// - `collection_id`: The collection that the seller wants to upgrade.
		/// - `item_id`: The Item from the collection that the seller wants to update.
		/// - `new_price`: The new price of the nft.
		///
		/// Emits `NftUpdated` event when succesfful.
		#[pallet::call_index(4)]
		#[pallet::weight(<T as pallet::Config>::WeightInfo::upgrade_listing())]
		pub fn upgrade_listing(
			origin: OriginFor<T>,
			collection_id: <T as pallet::Config>::CollectionId,
			item_id: <T as pallet::Config>::ItemId,
			new_price: BalanceOf<T>,
		) -> DispatchResult {
			let signer = ensure_signed(origin)?;
			ensure!(
				pallet_whitelist::Pallet::<T>::whitelisted_accounts().contains(&signer),
				Error::<T>::UserNotWhitelisted
			);
			ensure!(
				Self::ongoing_nft_details(collection_id, item_id).is_some(),
				Error::<T>::NftNotListed
			);
			let mut nft = Self::ongoing_nft_details(collection_id, item_id)
				.ok_or(Error::<T>::InvalidIndex)?;
			ensure!(nft.owner == signer, Error::<T>::NoPermission);
			nft.price = new_price;
			OngoingNftDetails::<T>::insert(collection_id, item_id, nft);
			Self::deposit_event(Event::<T>::NftUpdated {
				collection_index: collection_id,
				item_index: item_id,
				new_price,
			});
			Ok(())
		}

		/// Upgrade the price from a listed object.
		///
		/// The origin must be Signed and the sender must have sufficient funds free.
		///
		/// Parameters:
		/// - `collection_id`: The collection that the investor wants to buy from.
		/// - `new_price`: The new price of the nft.
		///
		/// Emits `NftUpdated` event when succesfful.
		#[pallet::call_index(5)]
		#[pallet::weight(<T as pallet::Config>::WeightInfo::upgrade_object())]
		pub fn upgrade_object(
			origin: OriginFor<T>,
			collection_id: <T as pallet::Config>::CollectionId,
			new_price: BalanceOf<T>,
		) -> DispatchResult {
			let signer = ensure_signed(origin)?;
			ensure!(
				pallet_whitelist::Pallet::<T>::whitelisted_accounts().contains(&signer),
				Error::<T>::UserNotWhitelisted
			);
			ensure!(Self::collection_exists(collection_id), Error::<T>::CollectionNotFound);
			let collection_details =
				Self::listed_collection_details(collection_id).ok_or(Error::<T>::InvalidIndex)?;
			ensure!(!collection_details.spv_created, Error::<T>::NftAlreadyRelisted);
			let list = Self::listed_nfts_of_collection(collection_id);
			let new_item_price = new_price
				.checked_div(&Self::u64_to_balance_option(100)?)
				.ok_or(Error::<T>::DivisionError)?;
			for item in list {
				let mut nft = Self::ongoing_nft_details(collection_id, item)
					.ok_or(Error::<T>::InvalidIndex)?;
				ensure!(nft.real_estate_developer == signer, Error::<T>::NoPermission);
				nft.price = new_item_price;
				OngoingNftDetails::<T>::insert(collection_id, item, nft);
			}
			Ok(())
		}

		/// Delist the choosen nft from the marketplace.
		/// Works only for relisted nfts.
		///
		/// The origin must be Signed and the sender must have sufficient funds free.
		///
		/// Parameters:
		/// - `collection_id`: The collection that the investor wants to buy from.
		/// - `item_id`: The Item from the collection that the investor wants to buy from.
		///
		/// Emits `NftDelisted` event when succesfful.
		#[pallet::call_index(6)]
		#[pallet::weight(<T as pallet::Config>::WeightInfo::delist_nft())]
		pub fn delist_nft(
			origin: OriginFor<T>,
			collection_id: <T as pallet::Config>::CollectionId,
			item_id: <T as pallet::Config>::ItemId,
		) -> DispatchResult {
			let signer = ensure_signed(origin)?;
			ensure!(
				pallet_whitelist::Pallet::<T>::whitelisted_accounts().contains(&signer),
				Error::<T>::UserNotWhitelisted
			);
			ensure!(
				Self::ongoing_nft_details(collection_id, item_id).is_some(),
				Error::<T>::NftNotListed
			);
			let nft = <OngoingNftDetails<T>>::take(collection_id, item_id)
				.ok_or(Error::<T>::InvalidIndex)?;
			ensure!(nft.owner == signer, Error::<T>::NoPermission);
			pallet_nfts::Pallet::<T>::do_transfer(
				collection_id.into(),
				item_id.into(),
				signer.clone(),
				|_, _| Ok(()),
			)?;
			let mut listed_nfts = Self::listed_nfts();
			let index =
				listed_nfts.iter().position(|x| *x == (nft.collection_id, nft.item_id)).unwrap();
			listed_nfts.remove(index);
			ListedNfts::<T>::put(listed_nfts);
			let mut listed_items = Self::listed_nfts_of_collection(collection_id);
			let index = listed_items
				.iter()
				.position(|x| *x == nft.item_id)
				.ok_or(Error::<T>::ItemNotFound)?;
			listed_items.remove(index);
			ListedNftsOfCollection::<T>::insert(collection_id, listed_items);
			SellerListings::<T>::try_mutate(nft.real_estate_developer.clone(), |keys| {
				let index = keys
					.iter()
					.position(|x| *x == (collection_id, item_id))
					.ok_or(Error::<T>::ItemNotFound)?;
				keys.remove(index);
				Ok::<(), DispatchError>(())
			})?;
			Self::deposit_event(Event::<T>::NftDelisted {
				collection_index: collection_id,
				item_index: item_id,
			});
			Ok(())
		}
	}

	impl<T: Config> Pallet<T> {
		/// Get the account id of the pallet
		pub fn account_id() -> AccountIdOf<T> {
			T::PalletId::get().into_account_truncating()
		}

		pub fn treasury_account_id() -> AccountIdOf<T> {
			T::TreasuryId::get().into_account_truncating()
		}

		pub fn community_account_id() -> AccountIdOf<T> {
			T::CommunityProjectsId::get().into_account_truncating()
		}

		/// Sends the nfts to the new owners and the funds to the real estate developer once all 100 Nfts
		/// of a collection are sold.
		fn distribute_nfts(collection_id: <T as pallet::Config>::CollectionId) -> DispatchResult {
			let list = <SoldNftsCollection<T>>::take(collection_id);

			let sum: BalanceOf<T> = list.iter().try_fold(Default::default(), |acc, item| {
				let nft_details = Self::ongoing_nft_details(collection_id, item)
					.ok_or(Error::<T>::InvalidIndex)?;
				Ok::<_, Error<T>>(acc + nft_details.price)
			})?;
			let nft_details = Self::ongoing_nft_details(collection_id, list[0])
				.ok_or(Error::<T>::InvalidIndex)?;
			let price = sum
				.checked_mul(&Self::u64_to_balance_option(1000000000000)?)
				.ok_or(Error::<T>::MultiplyError)?;
			let fees = price
				.checked_div(&Self::u64_to_balance_option(100)?)
				.ok_or(Error::<T>::MultiplyError)?;
			let treasury_id = Self::treasury_account_id();
			let treasury_fees = fees
				.checked_mul(&Self::u64_to_balance_option(90)?)
				.ok_or(Error::<T>::MultiplyError)?
				.checked_div(&Self::u64_to_balance_option(100)?)
				.ok_or(Error::<T>::DivisionError)?;
			let community_projects_id = Self::community_account_id();
			let community_fees = fees
				.checked_div(&Self::u64_to_balance_option(10)?)
				.ok_or(Error::<T>::DivisionError)?;
			let seller_part = price
				.checked_mul(&Self::u64_to_balance_option(99)?)
				.ok_or(Error::<T>::MultiplyError)?
				.checked_div(&Self::u64_to_balance_option(100)?)
				.ok_or(Error::<T>::DivisionError)?;
			Self::transfer_funds(&Self::account_id(), &treasury_id, treasury_fees)?;
			Self::transfer_funds(&Self::account_id(), &community_projects_id, community_fees)?;
			Self::transfer_funds(
				&Self::account_id(),
				&nft_details.real_estate_developer,
				seller_part,
			)?;
			for x in list {
				let nft_details = <OngoingNftDetails<T>>::take(collection_id, x)
					.ok_or(Error::<T>::InvalidIndex)?;
				pallet_nfts::Pallet::<T>::do_transfer(
					collection_id.into(),
					nft_details.item_id.into(),
					nft_details.owner.clone(),
					|_, _| Ok(()),
				)?;
			}
			let mut collection_details =
				Self::listed_collection_details(collection_id).ok_or(Error::<T>::InvalidIndex)?;
			collection_details.spv_created = true;
			ListedCollectionDetails::<T>::insert(collection_id, collection_details);
			Ok(())
		}

		/// Set the default collection configuration for creating a collection.
		fn default_collection_config() -> CollectionConfig<
			BalanceOf1<T>,
			BlockNumberFor<T>,
			<T as pallet_nfts::Config>::CollectionId,
		> {
			Self::collection_config_from_disabled_settings(
				CollectionSetting::DepositRequired.into(),
			)
		}

		fn collection_config_from_disabled_settings(
			settings: BitFlags<CollectionSetting>,
		) -> CollectionConfig<
			BalanceOf1<T>,
			BlockNumberFor<T>,
			<T as pallet_nfts::Config>::CollectionId,
		> {
			CollectionConfig {
				settings: CollectionSettings::from_disabled(settings),
				max_supply: None,
				mint_settings: MintSettings::default(),
			}
		}

		/// Set the default item configuration for minting a nft.
		fn default_item_config() -> ItemConfig {
			ItemConfig { settings: ItemSettings::all_enabled() }
		}

		/// Converts a u64 to a balance.
		pub fn u64_to_balance_option(input: u64) -> Result<BalanceOf<T>, Error<T>> {
			input.try_into().map_err(|_| Error::<T>::ConversionError)
		}

		/// Checks if the collection exists
		fn collection_exists(collection: <T as pallet::Config>::CollectionId) -> bool {
			let listed_nfts_count = ListedNftsOfCollection::<T>::contains_key(collection);
			let sold_nfts_count = SoldNftsCollection::<T>::contains_key(collection);
			listed_nfts_count || sold_nfts_count
		}

		fn transfer_funds(
			from: &AccountIdOf<T>,
			to: &AccountIdOf<T>,
			amount: BalanceOf<T>,
		) -> DispatchResult {
			Ok(<T as pallet::Config>::Currency::transfer(from, to, amount, KeepAlive)
				.map_err(|_| Error::<T>::NotEnoughFunds)?)
		}
	}
}
