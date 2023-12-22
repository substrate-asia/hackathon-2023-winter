use super::{
	AccountId, AllPalletsWithSystem, Balances, ParachainInfo, ParachainSystem, PolkadotXcm,
	Runtime, RuntimeCall, RuntimeEvent, RuntimeOrigin, WeightToFee, XcmpQueue,
};
use frame_support::{
	match_types, parameter_types,
	traits::{ConstU32, Everything, Nothing},
	weights::Weight,
};
use frame_system::EnsureRoot;
use pallet_xcm::XcmPassthrough;
use polkadot_parachain::primitives::Sibling;
use polkadot_runtime_common::impls::ToAuthor;
use sp_runtime::AccountId32;
use xcm::latest::prelude::*;
use xcm_builder::{
	AccountId32Aliases, AllowExplicitUnpaidExecutionFrom, AllowTopLevelPaidExecutionFrom,
	CurrencyAdapter, DenyReserveTransferToRelayChain, DenyThenTry, EnsureXcmOrigin,
	FixedWeightBounds, IsConcrete, NativeAsset, ParentIsPreset, RelayChainAsNative,
	SiblingParachainAsNative, SiblingParachainConvertsVia, SignedAccountId32AsNative,
	SignedToAccountId32, SovereignSignedViaLocation, TakeWeightCredit, TrailingSetTopicAsId,
	UsingComponents, WithComputedOrigin, WithUniqueTopic,
};
use xcm_executor::{traits::Error, XcmExecutor};

parameter_types! {
	pub const RelayLocation: MultiLocation = MultiLocation::parent();
	pub const RelayNetwork: Option<NetworkId> = None;
	pub RelayChainOrigin: RuntimeOrigin = cumulus_pallet_xcm::Origin::Relay.into();
	pub UniversalLocation: InteriorMultiLocation = Parachain(ParachainInfo::parachain_id().into()).into();
}

/// Type for specifying how a `MultiLocation` can be converted into an `AccountId`. This is used
/// when determining ownership of accounts for asset transacting and when attempting to use XCM
/// `Transact` in order to determine the dispatch Origin.
pub type LocationToAccountId = (
	// The parent (Relay-chain) origin converts to the parent `AccountId`.
	ParentIsPreset<AccountId>,
	// Sibling parachain origins convert to AccountId via the `ParaId::into`.
	SiblingParachainConvertsVia<Sibling, AccountId>,
	// Straight up local `AccountId32` origins just alias directly to `AccountId`.
	AccountId32Aliases<RelayNetwork, AccountId>,
);

/// Means for transacting assets on this chain.
pub type LocalAssetTransactor = CurrencyAdapter<
	// Use this currency:
	Balances,
	// Use this currency when it is a fungible asset matching the given location or name:
	IsConcrete<RelayLocation>,
	// Do a simple punn to convert an AccountId32 MultiLocation into a native chain account ID:
	LocationToAccountId,
	// Our chain's account ID type (we can't get away without mentioning it explicitly):
	AccountId,
	// We don't track any teleports.
	(),
>;

/// This is the type we use to convert an (incoming) XCM origin into a local `Origin` instance,
/// ready for dispatching a transaction with Xcm's `Transact`. There is an `OriginKind` which can
/// biases the kind of local `Origin` it will become.
pub type XcmOriginToTransactDispatchOrigin = (
	// Sovereign account converter; this attempts to derive an `AccountId` from the origin location
	// using `LocationToAccountId` and then turn that into the usual `Signed` origin. Useful for
	// foreign chains who want to have a local sovereign account on this chain which they control.
	SovereignSignedViaLocation<LocationToAccountId, RuntimeOrigin>,
	// Native converter for Relay-chain (Parent) location; will convert to a `Relay` origin when
	// recognized.
	RelayChainAsNative<RelayChainOrigin, RuntimeOrigin>,
	// Native converter for sibling Parachains; will convert to a `SiblingPara` origin when
	// recognized.
	SiblingParachainAsNative<cumulus_pallet_xcm::Origin, RuntimeOrigin>,
	// Native signed account converter; this just converts an `AccountId32` origin into a normal
	// `RuntimeOrigin::Signed` origin of the same 32-byte value.
	SignedAccountId32AsNative<RelayNetwork, RuntimeOrigin>,
	// Xcm origins can be represented natively under the Xcm pallet's Xcm origin.
	XcmPassthrough<RuntimeOrigin>,
);

parameter_types! {
	// One XCM operation is 1_000_000_000 weight - almost certainly a conservative estimate.
	pub UnitWeightCost: Weight = Weight::from_parts(1_000_000_000, 64 * 1024);
	pub const MaxInstructions: u32 = 100;
	pub const MaxAssetsIntoHolding: u32 = 64;
}

match_types! {
	pub type ParentOrParentsExecutivePlurality: impl Contains<MultiLocation> = {
		MultiLocation { parents: 1, interior: Here } |
		MultiLocation { parents: 1, interior: X1(Plurality { id: BodyId::Executive, .. }) }
	};
}

pub type Barrier = TrailingSetTopicAsId<
	DenyThenTry<
		DenyReserveTransferToRelayChain,
		(
			TakeWeightCredit,
			WithComputedOrigin<
				(
					AllowTopLevelPaidExecutionFrom<Everything>,
					AllowExplicitUnpaidExecutionFrom<ParentOrParentsExecutivePlurality>,
					// ^^^ Parent and its exec plurality get free execution
				),
				UniversalLocation,
				ConstU32<8>,
			>,
		),
	>,
>;

use crate::{weights::pallet_nfts, BlockNumber, Nfts};
use xcm::latest::prelude::*;
use xcm_executor::{traits::AssetExchange, Assets};
struct NftXcmExchanger;
use sp_core::sr25519::Public as Sr25519Public;
// use core::str::FromStr;

impl AssetExchange for NftXcmExchanger {
	fn exchange_asset(
		origin: Option<&MultiLocation>,
		give: Assets, // Assets is struct of fungible and non_fungible btree map and btree set
		want: &MultiAssets, // Want is a Vec of MultiAsset, Multi Asset is a struct containing an asset_id and a fungibility
		maximal: bool,
	) -> Result<Assets, Assets> {
		let mut account: AccountId32 = AccountId32::new([0u8; 32]);
		if let MultiLocation {
			parents,
			interior: Junctions::X1(Junction::AccountId32 { network, id }),
		} = origin.unwrap()
		{
			account = (*id).into();
		}

		let mut asset_given = MultiAsset {
			id: AssetId::Concrete(MultiLocation {
				parents: 0,
				interior: X1(Junction::GeneralIndex(0)),
			}),
			fun: (NonFungible(Undefined)),
		}; // We only treat the first asset of each
		let mut asset_wanted = MultiAsset {
			id: AssetId::Concrete(MultiLocation {
				parents: 0,
				interior: X1(Junction::GeneralIndex(0)),
			}),
			fun: (NonFungible(Undefined)),
		};
		let mut asset_wanted_collection: u32 = 0;
		let mut asset_given_collection: u32 = 0;

		if give.non_fungible.is_empty() {
			if give.fungible.is_empty() {
				return Err(give);
			} else {
				let (asset_id, instance) = give.clone().fungible.pop_first().unwrap();
				asset_given = MultiAsset { id: asset_id, fun: Fungible(instance) }
			}
		} else {
			let (asset_id, instance) = give.clone().non_fungible.pop_first().unwrap();
			asset_given = MultiAsset { id: asset_id, fun: NonFungible(instance) };

			if let AssetId::Concrete(MultiLocation {
				parents,
				interior: Junctions::X3(para_id, pallet_id, Junction::GeneralIndex(index)),
			}) = asset_id
			{
				asset_given_collection = index.try_into().unwrap()
			};
		}

		if want.is_none() {
			return Err(give);
		} else {
			asset_wanted = want.get(0).unwrap().clone();

			if let AssetId::Concrete(MultiLocation {
				parents,
				interior: Junctions::X3(para_id, pallet_id, Junction::GeneralIndex(index)),
			}) = asset_wanted.id
			{
				asset_wanted_collection = index.try_into().unwrap()
			};
		}

		match (asset_given.fun, asset_wanted.fun) {
			(NonFungible(instance_give), NonFungible(instance_want)) => {
				// TODO
				if let (AssetInstance::Index(given_item_id), AssetInstance::Index(wanted_item_id)) =
					(instance_give, instance_want)
				{
					Nfts::claim_swap(
						RuntimeOrigin::signed(account),
						asset_given_collection,
						given_item_id.try_into().unwrap(),
						asset_wanted_collection,
						wanted_item_id.try_into().unwrap(),
						None,
					);
				}
				Ok(give)
			},
			(NonFungible(instance_give), Fungible(amount)) => {
				if let AssetInstance::Index(item_id) = instance_give {
					let item: u32 = item_id.try_into().unwrap();
					match amount {
						0u128 => {
							// reset price
							_ = Nfts::set_price(
								RuntimeOrigin::signed(account),
								asset_given_collection,
								item,
								None,
								None,
							);
						},
						_ =>
							_ = Nfts::set_price(
								RuntimeOrigin::signed(account),
								asset_given_collection,
								item,
								Some(amount),
								None,
							),
					}
				}
				return Ok(give);
			},
			(Fungible(amount), NonFungible(instance_want)) => {
				if let AssetInstance::Index(item_id) = instance_want {
					let item: u32 = item_id.try_into().unwrap();
					_ = Nfts::buy_item(
						RuntimeOrigin::signed(account),
						asset_wanted_collection,
						item,
						amount,
					)
				}
				return Ok(give);
			},

			(Fungible(_), Fungible(_)) => Err(give),
		}
	}
}

pub struct XcmConfig;
impl xcm_executor::Config for XcmConfig {
	type RuntimeCall = RuntimeCall;
	type XcmSender = XcmRouter;
	// How to withdraw and deposit an asset.
	type AssetTransactor = LocalAssetTransactor;
	type OriginConverter = XcmOriginToTransactDispatchOrigin;
	type IsReserve = NativeAsset;
	type IsTeleporter = (); // Teleporting is disabled.
	type UniversalLocation = UniversalLocation;
	type Barrier = Barrier;
	type Weigher = FixedWeightBounds<UnitWeightCost, RuntimeCall, MaxInstructions>;
	type Trader =
		UsingComponents<WeightToFee, RelayLocation, AccountId, Balances, ToAuthor<Runtime>>;
	type ResponseHandler = PolkadotXcm;
	type AssetTrap = PolkadotXcm;
	type AssetClaims = PolkadotXcm;
	type SubscriptionService = PolkadotXcm;
	type PalletInstancesInfo = AllPalletsWithSystem;
	type MaxAssetsIntoHolding = MaxAssetsIntoHolding;
	type AssetLocker = ();
	type AssetExchanger = NftXcmExchanger;
	type FeeManager = ();
	type MessageExporter = ();
	type UniversalAliases = Nothing;
	type CallDispatcher = RuntimeCall;
	type SafeCallFilter = Everything;
	type Aliasers = Nothing;
}

/// No local origins on this chain are allowed to dispatch XCM sends/executions.
pub type LocalOriginToLocation = SignedToAccountId32<RuntimeOrigin, AccountId, RelayNetwork>;

/// The means for routing XCM messages which are not for local execution into the right message
/// queues.
pub type XcmRouter = WithUniqueTopic<(
	// Two routers - use UMP to communicate with the relay chain:
	cumulus_primitives_utility::ParentAsUmp<ParachainSystem, (), ()>,
	// ..and XCMP to communicate with the sibling chains.
	XcmpQueue,
)>;

#[cfg(feature = "runtime-benchmarks")]
parameter_types! {
	pub ReachableDest: Option<MultiLocation> = Some(Parent.into());
}

impl pallet_xcm::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type SendXcmOrigin = EnsureXcmOrigin<RuntimeOrigin, LocalOriginToLocation>;
	type XcmRouter = XcmRouter;
	type ExecuteXcmOrigin = EnsureXcmOrigin<RuntimeOrigin, LocalOriginToLocation>;
	type XcmExecuteFilter = Everything;
	// ^ Disable dispatchable execute on the XCM pallet.
	// Needs to be `Everything` for local testing.
	type XcmExecutor = XcmExecutor<XcmConfig>;
	type XcmTeleportFilter = Everything;
	type XcmReserveTransferFilter = Nothing;
	type Weigher = FixedWeightBounds<UnitWeightCost, RuntimeCall, MaxInstructions>;
	type UniversalLocation = UniversalLocation;
	type RuntimeOrigin = RuntimeOrigin;
	type RuntimeCall = RuntimeCall;

	const VERSION_DISCOVERY_QUEUE_SIZE: u32 = 100;
	// ^ Override for AdvertisedXcmVersion default
	type AdvertisedXcmVersion = pallet_xcm::CurrentXcmVersion;
	type Currency = Balances;
	type CurrencyMatcher = ();
	type TrustedLockers = ();
	type SovereignAccountOf = LocationToAccountId;
	type MaxLockers = ConstU32<8>;
	type WeightInfo = pallet_xcm::TestWeightInfo;
	#[cfg(feature = "runtime-benchmarks")]
	type ReachableDest = ReachableDest;
	type AdminOrigin = EnsureRoot<AccountId>;
	type MaxRemoteLockConsumers = ConstU32<0>;
	type RemoteLockConsumerIdentifier = ();
}

impl cumulus_pallet_xcm::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type XcmExecutor = XcmExecutor<XcmConfig>;
}
