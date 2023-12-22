use crate::{mock::*, Error};
use frame_support::{assert_noop, assert_ok};

macro_rules! bvec {
	($( $x:tt )*) => {
		vec![$( $x )*].try_into().unwrap()
	}
}

#[test]
fn list_object_works() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_eq!(NftMarketplace::listed_nfts().len(), 100);
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 22).is_some(), true);
		assert_eq!(NftMarketplace::listed_collection_details(0).unwrap().spv_created, false);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(0).len(), 100);
	})
}

#[test]
fn buy_nft_works() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([0; 32].into()), 0, 30));
		assert_eq!(Balances::free_balance(&(NftMarketplace::account_id())), 20_300_000);
		assert_eq!(NftMarketplace::listed_nfts().len(), 70);
		assert_eq!(NftMarketplace::sold_nfts_collection(0).len(), 30);
	})
}

#[test]
fn buy_nft_doesnt_work() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_noop!(
			NftMarketplace::buy_nft(RuntimeOrigin::signed([0; 32].into()), 1, 1),
			Error::<Test>::CollectionNotFound
		);
	})
}

#[test]
fn distributes_nfts_and_funds() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_eq!(NftMarketplace::listed_nfts().len(), 100);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 0, 100));
		assert_eq!(Balances::free_balance(&([0; 32].into())), 20989998);
		assert_eq!(Balances::free_balance(&NftMarketplace::treasury_account_id()), 9000);
		assert_eq!(Balances::free_balance(&NftMarketplace::community_account_id()), 1000);
		assert_eq!(Balances::free_balance(&([0; 32].into())), 20989998);
		assert_eq!(Balances::free_balance(&([1; 32].into())), 14_000_000);
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_eq!(NftMarketplace::listed_collection_details(0).unwrap().spv_created, true);
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 22).is_some(), false);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(0).len(), 0);
	})
}

#[test]
fn listing_and_selling_multiple_objects() {
	new_test_ext().execute_with(|| {
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [3; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [2; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([3; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([2; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_eq!(NftMarketplace::listed_nfts().len(), 300);
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 1, 100));
		assert_eq!(NftMarketplace::listed_nfts().len(), 200);
		assert_eq!(NftMarketplace::ongoing_nft_details(1, 8), None);
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 2, 20));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([3; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([2; 32].into()), 0, 33));
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 3).unwrap().sold, true);
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 34).unwrap().sold, false);
		assert_eq!(NftMarketplace::listed_nfts().len(), 247);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(0).len(), 67);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(1).len(), 0);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(2).len(), 80);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(3).len(), 100);
		assert_eq!(NftMarketplace::ongoing_nft_details(2, 2).unwrap().sold, true);
	});
}

#[test]
fn relist_a_nft() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 0, 100));
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_eq!(NftMarketplace::listed_collection_details(0).unwrap().spv_created, true);
		assert_ok!(NftMarketplace::list_nft(RuntimeOrigin::signed([1; 32].into()), 0, 100, 100));
		assert_eq!(NftMarketplace::listed_nfts()[0], (0, 100));
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 22).is_some(), false);
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 100).is_some(), true);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(0).len(), 1);
		assert_eq!(NftMarketplace::seller_listings::<AccountId>([1; 32].into()).len(), 1);
	})
}

#[test]
fn relist_nfts_not_created_with_marketplace_fails() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(Uniques::create(
			RuntimeOrigin::signed([0; 32].into()),
			sp_runtime::MultiAddress::Id([0; 32].into()),
			Default::default()
		));
		assert_ok!(Uniques::mint(
			RuntimeOrigin::signed([0; 32].into()),
			0,
			0,
			sp_runtime::MultiAddress::Id([0; 32].into()),
			None
		));
		assert_noop!(
			NftMarketplace::list_nft(RuntimeOrigin::signed([0; 32].into()), 0, 0, 100),
			Error::<Test>::CollectionNotKnown
		);
	})
}

#[test]
fn buy_single_nft_works() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [3; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_eq!(NftMarketplace::listed_nfts().len(), 100);
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 0, 100));
		assert_eq!(Balances::free_balance(&([0; 32].into())), 20989998);
		assert_eq!(Balances::free_balance(&NftMarketplace::treasury_account_id()), 9000);
		assert_eq!(Balances::free_balance(&NftMarketplace::community_account_id()), 1000);
		assert_eq!(Balances::free_balance(&([1; 32].into())), 14_000_000);
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_eq!(NftMarketplace::listed_collection_details(0).unwrap().spv_created, true);
		assert_ok!(NftMarketplace::list_nft(RuntimeOrigin::signed([1; 32].into()), 0, 27, 100));
		assert_ok!(NftMarketplace::buy_single_nft(RuntimeOrigin::signed([3; 32].into()), 0, 27));
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 27).is_some(), false);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(0).len(), 0);
		assert_eq!(NftMarketplace::seller_listings::<AccountId>([1; 32].into()).len(), 0);
	})
}

#[test]
fn delist_single_nft_works() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 0, 100));
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_ok!(NftMarketplace::list_nft(RuntimeOrigin::signed([1; 32].into()), 0, 27, 100));
		assert_ok!(NftMarketplace::delist_nft(RuntimeOrigin::signed([1; 32].into()), 0, 27));
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
	})
}

#[test]
fn delist_fails() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [4; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 0, 100));
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_ok!(NftMarketplace::list_nft(RuntimeOrigin::signed([1; 32].into()), 0, 27, 100));
		assert_noop!(
			NftMarketplace::delist_nft(RuntimeOrigin::signed([4; 32].into()), 0, 27),
			Error::<Test>::NoPermission
		);
		assert_noop!(
			NftMarketplace::delist_nft(RuntimeOrigin::signed([4; 32].into()), 0, 28),
			Error::<Test>::NftNotListed
		);
	})
}

#[test]
fn upgrade_price_works() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 0, 100));
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_ok!(NftMarketplace::list_nft(RuntimeOrigin::signed([1; 32].into()), 0, 27, 100));
		assert_ok!(NftMarketplace::upgrade_listing(
			RuntimeOrigin::signed([1; 32].into()),
			0,
			27,
			300
		));
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 27).unwrap().price, 300);
	})
}

#[test]
fn upgrade_price_fails_if_not_owner() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [4; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 0, 100));
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_ok!(NftMarketplace::list_nft(RuntimeOrigin::signed([1; 32].into()), 0, 27, 100));
		assert_noop!(
			NftMarketplace::upgrade_listing(RuntimeOrigin::signed([4; 32].into()), 0, 27, 300),
			Error::<Test>::NoPermission
		);
	})
}

#[test]
fn upgrade_object_works() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::upgrade_object(RuntimeOrigin::signed([0; 32].into()), 0, 30000));
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 27).unwrap().price, 300);
	})
}

#[test]
fn upgrade_object_and_distribute_works() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [1; 32].into()));
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [2; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_eq!(NftMarketplace::listed_nfts().len(), 100);
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([1; 32].into()), 0, 50));
		assert_ok!(NftMarketplace::upgrade_object(
			RuntimeOrigin::signed([0; 32].into()),
			0,
			2_000_000
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([2; 32].into()), 0, 50));
		assert_eq!(Balances::free_balance(&([0; 32].into())), 21484998);
		assert_eq!(Balances::free_balance(&NftMarketplace::treasury_account_id()), 13500);
		assert_eq!(Balances::free_balance(&NftMarketplace::community_account_id()), 1500);
		assert_eq!(Balances::free_balance(&([1; 32].into())), 14_500_000);
		assert_eq!(Balances::free_balance(&([2; 32].into())), 150_000);
		assert_eq!(NftMarketplace::listed_nfts().len(), 0);
		assert_eq!(NftMarketplace::listed_collection_details(0).unwrap().spv_created, true);
		assert_eq!(NftMarketplace::ongoing_nft_details(0, 22).is_some(), false);
		assert_eq!(NftMarketplace::listed_nfts_of_collection(0).len(), 0);
	})
}

#[test]
fn upgrade_single_nft_from_listed_object_fails() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_noop!(
			NftMarketplace::upgrade_listing(RuntimeOrigin::signed([0; 32].into()), 0, 27, 300),
			Error::<Test>::NoPermission
		);
	})
}

#[test]
fn upgrade_object_for_relisted_nft_fails() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_ok!(NftMarketplace::list_object(
			RuntimeOrigin::signed([0; 32].into()),
			1_000_000,
			bvec![22, 22]
		));
		assert_ok!(NftMarketplace::buy_nft(RuntimeOrigin::signed([0; 32].into()), 0, 100));
		assert_ok!(NftMarketplace::list_nft(RuntimeOrigin::signed([0; 32].into()), 0, 100, 100));
		assert_noop!(
			NftMarketplace::upgrade_object(RuntimeOrigin::signed([0; 32].into()), 0, 300),
			Error::<Test>::NftAlreadyRelisted
		);
	})
}

#[test]
fn upgrade_unknown_collection_fails() {
	new_test_ext().execute_with(|| {
		System::set_block_number(1);
		assert_ok!(Whitelist::add_to_whitelist(RuntimeOrigin::root(), [0; 32].into()));
		assert_noop!(
			NftMarketplace::upgrade_object(RuntimeOrigin::signed([0; 32].into()), 0, 300),
			Error::<Test>::CollectionNotFound
		);
	})
}
