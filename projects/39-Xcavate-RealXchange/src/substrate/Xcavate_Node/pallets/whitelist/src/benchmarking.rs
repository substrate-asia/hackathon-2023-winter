//! Benchmarking setup for pallet-template
#![cfg(feature = "runtime-benchmarks")]
use super::*;

#[allow(unused)]
use crate::Pallet as Whitelist;
use frame_benchmarking::__private::vec;
use frame_benchmarking::v2::*;
use frame_system::RawOrigin;

#[benchmarks]
mod benchmarks {
	use super::*;

	#[benchmark]
	fn add_to_whitelist() {
		let caller: T::AccountId = whitelisted_caller();
		#[extrinsic_call]
		add_to_whitelist(RawOrigin::Root, caller.clone());

		assert_eq!(Whitelist::<T>::whitelisted_accounts()[0], caller);
	}

	#[benchmark]
	fn remove_from_whitelist() {
		let caller: T::AccountId = whitelisted_caller();
		Whitelist::<T>::add_to_whitelist(RawOrigin::Root.into(), caller.clone());
		assert_eq!(Whitelist::<T>::whitelisted_accounts()[0], caller);
		#[extrinsic_call]
		remove_from_whitelist(RawOrigin::Root, caller.clone());

		assert_eq!(Whitelist::<T>::whitelisted_accounts().len(), 0);
	}

	impl_benchmark_test_suite!(Whitelist, crate::mock::new_test_ext(), crate::mock::Test);
}
