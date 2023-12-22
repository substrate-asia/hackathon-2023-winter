use crate::{AccountId, Assets, Runtime};
use frame_support::traits::fungibles::{Balanced, Credit};
use pallet_asset_tx_payment::HandleCredit;

/// A `HandleCredit` implementation that naively transfers the fees to the block author.
/// Will drop and burn the assets in case the transfer fails.
pub struct CreditToBlockAuthor;
impl HandleCredit<AccountId, Assets> for CreditToBlockAuthor {
	fn handle_credit(credit: Credit<AccountId, Assets>) {
		//		fn handle_credit(credit: CreditOf<AccountId, Assets>) {
		if let Some(author) = pallet_authorship::Pallet::<Runtime>::author() {
			// Drop the result which will trigger the `OnDrop` of the imbalance in case of error.
			let _ = Assets::resolve(&author, credit);
		}
	}
}

// pub struct CreditToBlockAuthor<R, I = ()>(PhantomData<(R, I)>);
// impl<R, I> HandleCredit<AccountIdOf<R>, pallet_assets::Pallet<R, I>> for CreditToBlockAuthor<R>
// where
//     I: 'static,
//     R: pallet_authorship::Config + pallet_assets::Config<I>,
//     AccountIdOf<R>:
//         From<polkadot_primitives::v2::AccountId> + Into<polkadot_primitives::v2::AccountId>,
// {
//     fn handle_credit(credit: CreditOf<AccountIdOf<R>, pallet_assets::Pallet<R, I>>) {
//         if let Some(author) = pallet_authorship::Pallet::<R>::author() {
//             // In case of error: Will drop the result triggering the `OnDrop` of the imbalance.
//             let _ = pallet_assets::Pallet::<R, I>::resolve(&author, credit);
//         }
//     }
// }
