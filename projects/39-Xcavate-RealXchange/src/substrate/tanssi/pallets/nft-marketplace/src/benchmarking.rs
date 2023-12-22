//! Benchmarking setup for pallet-template
#![cfg(feature = "runtime-benchmarks")]
use super::*;

#[allow(unused)]
use crate::Pallet as NftMarketplace;
use frame_benchmarking::__private::vec;
use frame_benchmarking::v2::*;
use frame_support::sp_runtime::traits::Bounded;
use frame_support::traits::Get;
use frame_system::RawOrigin;
use pallet_whitelist::Pallet as Whitelist;
type DepositBalanceOf<T> = <<T as pallet_nfts::Config>::Currency as Currency<
	<T as frame_system::Config>::AccountId,
>>::Balance;

fn setup_object_listing<T: Config>() -> (T::AccountId, BalanceOf<T>) {
	let value: BalanceOf<T> = 100_000u32.into();
	let caller: T::AccountId = whitelisted_caller();
	<T as pallet_nfts::Config>::Currency::make_free_balance_be(
		&caller,
		DepositBalanceOf::<T>::max_value(),
	);
	(caller, value)
}

#[benchmarks]
mod benchmarks {
	use super::*;
	#[benchmark]
	fn list_object() {
		let (caller, value) = setup_object_listing::<T>();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), caller.clone());

		#[extrinsic_call]
		list_object(
			RawOrigin::Signed(caller),
			value,
			vec![0; T::StringLimit::get() as usize].try_into().unwrap(),
		);

		assert_eq!(NftMarketplace::<T>::listed_nfts().len(), 100);
	}

	#[benchmark]
	fn list_nft() {
		let (caller, value) = setup_object_listing::<T>();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), caller.clone());
		NftMarketplace::<T>::list_object(
			RawOrigin::Signed(caller.clone()).into(),
			value,
			vec![0; T::StringLimit::get() as usize].try_into().unwrap(),
		);
		NftMarketplace::<T>::buy_nft(RawOrigin::Signed(caller.clone()).into(), 0.into(), 100);
		let listing_value: BalanceOf<T> = 2_000u32.into();
		#[extrinsic_call]
		list_nft(RawOrigin::Signed(caller), 0.into(), 22.into(), listing_value);
		assert_eq!(NftMarketplace::<T>::listed_nfts().len(), 1);
	}

	#[benchmark]
	fn buy_nft() {
		let (caller, value) = setup_object_listing::<T>();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), caller.clone());
		NftMarketplace::<T>::list_object(
			RawOrigin::Signed(caller.clone()).into(),
			value,
			vec![0; T::StringLimit::get() as usize].try_into().unwrap(),
		);
		#[extrinsic_call]
		buy_nft(RawOrigin::Signed(caller), 0.into(), 100);

		assert_eq!(NftMarketplace::<T>::listed_nfts().len(), 0);
	}

	#[benchmark]
	fn buy_single_nft() {
		let (caller, value) = setup_object_listing::<T>();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), caller.clone());
		NftMarketplace::<T>::list_object(
			RawOrigin::Signed(caller.clone()).into(),
			value,
			vec![0; T::StringLimit::get() as usize].try_into().unwrap(),
		);
		NftMarketplace::<T>::buy_nft(RawOrigin::Signed(caller.clone()).into(), 0.into(), 100);
		let listing_value: BalanceOf<T> = 2_000u32.into();
		NftMarketplace::<T>::list_nft(
			RawOrigin::Signed(caller.clone()).into(),
			0.into(),
			22.into(),
			listing_value,
		);
		let nft_buyer: T::AccountId = whitelisted_caller();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), nft_buyer.clone());
		<T as pallet_nfts::Config>::Currency::make_free_balance_be(
			&nft_buyer,
			DepositBalanceOf::<T>::max_value(),
		);
		#[extrinsic_call]
		buy_single_nft(RawOrigin::Signed(nft_buyer), 0.into(), 22.into());
		assert_eq!(NftMarketplace::<T>::listed_nfts().len(), 0);
	}

	#[benchmark]
	fn upgrade_listing() {
		let (caller, value) = setup_object_listing::<T>();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), caller.clone());
		NftMarketplace::<T>::list_object(
			RawOrigin::Signed(caller.clone()).into(),
			value,
			vec![0; T::StringLimit::get() as usize].try_into().unwrap(),
		);
		NftMarketplace::<T>::buy_nft(RawOrigin::Signed(caller.clone()).into(), 0.into(), 100);
		let listing_value: BalanceOf<T> = 2_000u32.into();
		NftMarketplace::<T>::list_nft(
			RawOrigin::Signed(caller.clone()).into(),
			0.into(),
			22.into(),
			listing_value,
		);
		let new_price: BalanceOf<T> = 5_000u32.into();
		#[extrinsic_call]
		upgrade_listing(RawOrigin::Signed(caller), 0.into(), 22.into(), new_price);
		assert_eq!(
			NftMarketplace::<T>::ongoing_nft_details::<
				<T as pallet::Config>::CollectionId,
				<T as pallet::Config>::ItemId,
			>(0.into(), 22.into())
			.unwrap()
			.price,
			new_price
		);
	}

	#[benchmark]
	fn upgrade_object() {
		let (caller, value) = setup_object_listing::<T>();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), caller.clone());
		NftMarketplace::<T>::list_object(
			RawOrigin::Signed(caller.clone()).into(),
			value,
			vec![0; T::StringLimit::get() as usize].try_into().unwrap(),
		);

		let new_price: BalanceOf<T> = 300_000u32.into();
		let nft_price: BalanceOf<T> = 3_000u32.into();
		#[extrinsic_call]
		upgrade_object(RawOrigin::Signed(caller), 0.into(), new_price);
		assert_eq!(
			NftMarketplace::<T>::ongoing_nft_details::<
				<T as pallet::Config>::CollectionId,
				<T as pallet::Config>::ItemId,
			>(0.into(), 22.into())
			.unwrap()
			.price,
			nft_price
		);
	}

	#[benchmark]
	fn delist_nft() {
		let (caller, value) = setup_object_listing::<T>();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), caller.clone());
		NftMarketplace::<T>::list_object(
			RawOrigin::Signed(caller.clone()).into(),
			value,
			vec![0; T::StringLimit::get() as usize].try_into().unwrap(),
		);
		NftMarketplace::<T>::buy_nft(RawOrigin::Signed(caller.clone()).into(), 0.into(), 100);
		let listing_value: BalanceOf<T> = 2_000u32.into();
		NftMarketplace::<T>::list_nft(
			RawOrigin::Signed(caller.clone()).into(),
			0.into(),
			22.into(),
			listing_value,
		);
		#[extrinsic_call]
		delist_nft(RawOrigin::Signed(caller), 0.into(), 22.into());
		assert_eq!(NftMarketplace::<T>::listed_nfts().len(), 0);
	}
	impl_benchmark_test_suite!(NftMarketplace, crate::mock::new_test_ext(), crate::mock::Test);
}
