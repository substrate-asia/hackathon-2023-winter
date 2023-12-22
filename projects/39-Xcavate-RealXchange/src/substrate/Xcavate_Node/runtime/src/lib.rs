#![cfg_attr(not(feature = "std"), no_std)]
// `construct_runtime!` does a lot of recursion and requires us to increase the limit to 256.
#![recursion_limit = "256"]

// Make the WASM binary available.
#[cfg(feature = "std")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

/// Constant values used within the runtimezz
pub mod constants;
use codec::Decode;
mod voter_bags;
use constants::{currency::*, time::*};
use frame_election_provider_support::{onchain, ExtendedBalance, SequentialPhragmen, VoteWeight};
use frame_support::{
	instances::{Instance1, Instance2},
	ord_parameter_types,
	pallet_prelude::{DispatchClass, Get},
	traits::{
		tokens::nonfungibles_v2::Inspect, AsEnsureOriginWithArg, EitherOfDiverse,
		EqualPrivilegeOnly, TrackedStorageKey,
	},
	PalletId,
};
use sp_staking::currency_to_vote::U128CurrencyToVote;
//use acurast_p256_crypto::MultiSignature;
// use pallet_acurast_fulfillment_receiver::Fulfillment;

use frame_system::{
	limits::BlockWeights as SystemBlockWeights, EnsureRoot, EnsureSigned, EnsureSignedBy,
	EnsureWithSuccess,
};
use polkadot_primitives::Nonce;

use node_primitives::Moment;
use pallet_grandpa::AuthorityId as GrandpaId;
// pub type BabeId = sp_consensus_babe::AuthorityId;

use pallet_im_online::sr25519::AuthorityId as ImOnlineId;
use pallet_session::historical as pallet_session_historical;
// use pallet_asset_conversion::{NativeOrAssetId, NativeOrAssetIdConverter};
use crate::opaque::SessionKeys;
use sp_api::impl_runtime_apis;
use sp_consensus_aura::sr25519::AuthorityId as AuraId;
use sp_core::{crypto::KeyTypeId, ConstBool, OpaqueMetadata};
use sp_runtime::{
	create_runtime_str,
	curve::PiecewiseLinear,
	generic, impl_opaque_keys,
	traits::{
		AccountIdConversion, AccountIdLookup, BlakeTwo256, Block as BlockT, Convert, ConvertInto,
		IdentifyAccount, NumberFor, One, OpaqueKeys, Verify,
	},
	transaction_validity::{TransactionPriority, TransactionSource, TransactionValidity},
	ApplyExtrinsicResult, FixedU128, MultiSignature, Percent,
};
use sp_std::prelude::*;
#[cfg(feature = "std")]
use sp_version::NativeVersion;
use sp_version::RuntimeVersion;
/// Implementations of some helper traits passed into runtime modules as associated types.
pub mod impls;
use impls::CreditToBlockAuthor;

// A few exports that help ease life for downstream crates.
use frame_election_provider_support::bounds::{ElectionBounds, ElectionBoundsBuilder};
pub use frame_support::{
	construct_runtime, parameter_types,
	traits::{
		ConstU128, ConstU32, ConstU64, ConstU8, KeyOwnerProofSystem, Randomness, StorageInfo,
	},
	weights::{
		constants::{
			BlockExecutionWeight, ExtrinsicBaseWeight, RocksDbWeight, WEIGHT_REF_TIME_PER_SECOND,
		},
		IdentityFee, Weight,
	},
	StorageValue,
};
pub use frame_system::Call as SystemCall;
pub use pallet_balances::Call as BalancesCall;
use pallet_election_provider_multi_phase::SolutionAccuracyOf;
/// Import the nft pallet
use pallet_nfts::PalletFeatures;
#[cfg(any(feature = "std", test))]
pub use pallet_staking::StakerStatus;
pub use pallet_timestamp::Call as TimestampCall;
use pallet_transaction_payment::{ConstFeeMultiplier, CurrencyAdapter, Multiplier};
#[cfg(any(feature = "std", test))]
pub use sp_runtime::BuildStorage;
pub use sp_runtime::{Perbill, Permill};

/// An index to a block.
pub type BlockNumber = u32;

/// Alias to 512-bit hash when used in the context of a transaction signature on the chain.
pub type Signature = MultiSignature;

/// Some way of identifying an account on the chain. We intentionally make it equivalent
/// to the public key of our transaction signing scheme.
pub type AccountId = <<Signature as Verify>::Signer as IdentifyAccount>::AccountId;

/// Balance of an account.
pub type Balance = u128;

/// Index of a transaction in the chain.
pub type Index = u32;

/// A hash of some data used by the chain.
pub type Hash = sp_core::H256;

/// Opaque types. These are used by the CLI to instantiate machinery that don't need to know
/// the specifics of the runtime. They can then be made to be agnostic over specific formats
/// of data like extrinsics, allowing for them to continue syncing the network through upgrades
/// to even the core data structures.
pub mod opaque {
	use super::*;

	pub use sp_runtime::OpaqueExtrinsic as UncheckedExtrinsic;

	/// Opaque block header type.
	pub type Header = generic::Header<BlockNumber, BlakeTwo256>;
	/// Opaque block type.
	pub type Block = generic::Block<Header, UncheckedExtrinsic>;
	/// Opaque block identifier type.
	pub type BlockId = generic::BlockId<Block>;

	impl_opaque_keys! {
		pub struct SessionKeys {
			// pub aura: Aura,
			pub grandpa: Grandpa,
			pub aura: Aura,
			pub im_online: ImOnline,
			pub authority_discovery: AuthorityDiscovery,
		}
	}
}

/// The BABE epoch configuration at genesis.
pub const BABE_GENESIS_EPOCH_CONFIG: sp_consensus_babe::BabeEpochConfiguration =
	sp_consensus_babe::BabeEpochConfiguration {
		c: PRIMARY_PROBABILITY,
		allowed_slots: sp_consensus_babe::AllowedSlots::PrimaryAndSecondaryPlainSlots,
	};

/// Wasm binary unwrapped. If built with `SKIP_WASM_BUILD`, the function panics.
#[cfg(feature = "std")]
pub fn wasm_binary_unwrap() -> &'static [u8] {
	WASM_BINARY.expect(
		"Development wasm binary is not available. This means the client is built with \
		 `SKIP_WASM_BUILD` flag and it is only usable for production chains. Please rebuild with \
		 the flag disabled.",
	)
}

// To learn more about runtime versioning, see:
// https://docs.substrate.io/main-docs/build/upgrade#runtime-versioning
#[sp_version::runtime_version]
pub const VERSION: RuntimeVersion = RuntimeVersion {
	spec_name: create_runtime_str!("node-template"),
	impl_name: create_runtime_str!("node-template"),
	authoring_version: 1,
	// The version of the runtime specification. A full node will not attempt to use its native
	//   runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
	//   `spec_version`, and `authoring_version` are the same between Wasm and native.
	// This value is set to 100 to notify Polkadot-JS App (https://polkadot.js.org/apps) to use
	//   the compatible custom types.
	spec_version: 100,
	impl_version: 1,
	apis: RUNTIME_API_VERSIONS,
	transaction_version: 1,
	state_version: 1,
};

/// This determines the average expected block time that we are targeting.
/// Blocks will be produced at a minimum duration defined by `SLOT_DURATION`.
/// `SLOT_DURATION` is picked up by `pallet_timestamp` which is in turn picked
/// up by `pallet_aura` to implement `fn slot_duration()`.
///
/// Change this to adjust the block time.
pub const MILLISECS_PER_BLOCK: u64 = 6000;

// NOTE: Currently it is not possible to change the slot duration after the chain has started.
//       Attempting to do so will brick block production.
pub const SLOT_DURATION: u64 = MILLISECS_PER_BLOCK;

// Time is measured by number of blocks.
pub const MINUTES: BlockNumber = 60_000 / (MILLISECS_PER_BLOCK as BlockNumber);
pub const HOURS: BlockNumber = MINUTES * 60;
pub const DAYS: BlockNumber = HOURS * 24;

// We assume that ~10% of the block weight is consumed by `on_initialize` handlers.
// This is used to limit the maximal weight of a single extrinsic.

// Charge fee for stored bytes and items
pub const fn deposit(items: u32, bytes: u32) -> Balance {
	items as Balance * 100 * MILLICENTS * INIT_SUPPLY_FACTOR + (bytes as Balance) * STORAGE_BYTE_FEE
}

/// The version information used to identify this runtime when compiled natively.
#[cfg(feature = "std")]
pub fn native_version() -> NativeVersion {
	NativeVersion { runtime_version: VERSION, can_author_with: Default::default() }
}

/// We assume that ~10% of the block weight is consumed by `on_initialize` handlers.
/// This is used to limit the maximal weight of a single extrinsic.
const AVERAGE_ON_INITIALIZE_RATIO: Perbill = Perbill::from_percent(10);
/// We allow `Normal` extrinsics to fill up the block up to 75%, the rest can be used
/// by  Operational  extrinsics.
const NORMAL_DISPATCH_RATIO: Perbill = Perbill::from_percent(75);
/// We allow for 2 seconds of compute with a 6 second average block time, with maximum proof size.
const MAXIMUM_BLOCK_WEIGHT: Weight =
	Weight::from_parts(WEIGHT_REF_TIME_PER_SECOND.saturating_mul(2), u64::MAX);

parameter_types! {
	pub const BlockHashCount: BlockNumber = 2400;
	pub const Version: RuntimeVersion = VERSION;
	/// We allow for 2 seconds of compute with a 6 second average block time.
	pub BlockWeights: frame_system::limits::BlockWeights =
		frame_system::limits::BlockWeights::with_sensible_defaults(
			Weight::from_parts(2u64 * WEIGHT_REF_TIME_PER_SECOND, u64::MAX),
			NORMAL_DISPATCH_RATIO,
		);
	pub BlockLength: frame_system::limits::BlockLength = frame_system::limits::BlockLength
		::max_with_normal_ratio(5 * 1024 * 1024, NORMAL_DISPATCH_RATIO);
	pub const SS58Prefix: u8 = 42;

	pub RuntimeBlockWeights: SystemBlockWeights = SystemBlockWeights::builder()
		.base_block(BlockExecutionWeight::get())
		.for_class(DispatchClass::all(), |weights| {
			weights.base_extrinsic = ExtrinsicBaseWeight::get();
		})
		.for_class(DispatchClass::Normal, |weights| {
			weights.max_total = Some(NORMAL_DISPATCH_RATIO * MAXIMUM_BLOCK_WEIGHT);
		})
		.for_class(DispatchClass::Operational, |weights| {
			weights.max_total = Some(MAXIMUM_BLOCK_WEIGHT);
			// Operational transactions have some extra reserved space, so that they
			// are included even if block reached `MAXIMUM_BLOCK_WEIGHT`.
			weights.reserved = Some(
				MAXIMUM_BLOCK_WEIGHT - NORMAL_DISPATCH_RATIO * MAXIMUM_BLOCK_WEIGHT
			);
		})
		.avg_block_initialization(AVERAGE_ON_INITIALIZE_RATIO)
		.build_or_panic();
	pub MaxCollectivesProposalWeight: Weight = Perbill::from_percent(50) * RuntimeBlockWeights::get().max_block; // FIXME
}

// Configure FRAME pallets to include in runtime.

impl frame_system::Config for Runtime {
	/// The basic call filter to use in dispatchable.
	type BaseCallFilter = frame_support::traits::Everything;
	/// Block & extrinsics weights: base values and limits.
	type BlockWeights = BlockWeights;
	/// The maximum length of a block (in bytes).
	type BlockLength = BlockLength;
	/// The identifier used to distinguish between accounts.
	type AccountId = AccountId;
	/// The aggregated dispatch type that is available for extrinsics.
	type RuntimeCall = RuntimeCall;
	type Nonce = Nonce;
	type Block = Block;
	/// The lookup mechanism to get account ID from whatever is passed in dispatchers.
	type Lookup = AccountIdLookup<AccountId, ()>;
	/// The type for hashing blocks and tries.
	type Hash = Hash;
	/// The hashing algorithm used.
	type Hashing = BlakeTwo256;
	/// The ubiquitous event type.
	type RuntimeEvent = RuntimeEvent;
	/// The ubiquitous origin type.
	type RuntimeOrigin = RuntimeOrigin;
	/// Maximum number of block number to block hash mappings to keep (oldest pruned first).
	type BlockHashCount = BlockHashCount;
	/// The weight of database operations that the runtime can invoke.
	type DbWeight = RocksDbWeight;
	/// Version of the runtime.
	type Version = Version;
	/// Converts a module to the index of the module in `construct_runtime!`.
	///
	/// This type is being generated by `construct_runtime!`.
	type PalletInfo = PalletInfo;
	/// What to do if a new account is created.
	type OnNewAccount = ();
	/// What to do if an account is fully reaped from the system.
	type OnKilledAccount = ();
	/// The data to be stored in an account.
	type AccountData = pallet_balances::AccountData<Balance>;
	/// Weight information for the extrinsics of this pallet.
	type SystemWeightInfo = ();
	/// This is used as an identifier of the chain. 42 is the generic substrate prefix.
	type SS58Prefix = SS58Prefix;
	/// The set code logic, just the default since we're not a parachain.
	type OnSetCode = ();
	type MaxConsumers = frame_support::traits::ConstU32<16>;
}

impl pallet_insecure_randomness_collective_flip::Config for Runtime {}

impl pallet_aura::Config for Runtime {
	type AuthorityId = AuraId;
	type DisabledValidators = ();
	type MaxAuthorities = ConstU32<32>;
	type AllowMultipleBlocksPerSlot = ConstBool<false>;
}

impl pallet_grandpa::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;

	type WeightInfo = ();
	type MaxAuthorities = ConstU32<32>;
	type MaxSetIdSessionEntries = ConstU64<0>;

	type KeyOwnerProof = sp_core::Void;
	type EquivocationReportSystem = ();
	type MaxNominators = ConstU32<0>; // FIXME
}

impl pallet_timestamp::Config for Runtime {
	/// A timestamp: milliseconds since the unix epoch.
	type Moment = u64;
	type OnTimestampSet = Aura;
	type MinimumPeriod = ConstU64<{ SLOT_DURATION / 2 }>;
	type WeightInfo = ();
}

impl pallet_authorship::Config for Runtime {
	type FindAuthor = pallet_session::FindAccountFromAuthorIndex<Self, Babe>;
	type EventHandler = (Staking, ImOnline);
}

parameter_types! {
	pub NposSolutionPriority: TransactionPriority =
		Perbill::from_percent(90) * TransactionPriority::max_value();
	pub const ImOnlineUnsignedPriority: TransactionPriority = TransactionPriority::max_value();
	pub const MaxKeys: u32 = 10_000;
	pub const MaxPeerInHeartbeats: u32 = 10_000;
}

impl pallet_im_online::Config for Runtime {
	type AuthorityId = ImOnlineId;
	type RuntimeEvent = RuntimeEvent;
	type ValidatorSet = Historical;
	type NextSessionRotation = Babe;
	type ReportUnresponsiveness = Offences;
	type UnsignedPriority = ImOnlineUnsignedPriority;
	type WeightInfo = ();
	type MaxKeys = MaxKeys;
	type MaxPeerInHeartbeats = MaxPeerInHeartbeats;
}

parameter_types! {
	pub MaxSetIdSessionEntries: u32 = BondingDuration::get() * SessionsPerEra::get();
}

/// Existential deposit.
pub const EXISTENTIAL_DEPOSIT: u128 = 500;

impl pallet_balances::Config for Runtime {
	type MaxLocks = ConstU32<50>;
	type MaxReserves = ();
	type ReserveIdentifier = [u8; 8];
	/// The type for recording an account's balance.
	type Balance = Balance;
	/// The ubiquitous event type.
	type RuntimeEvent = RuntimeEvent;
	type DustRemoval = ();
	type ExistentialDeposit = ConstU128<EXISTENTIAL_DEPOSIT>;
	type AccountStore = System;
	type WeightInfo = pallet_balances::weights::SubstrateWeight<Runtime>;
	type RuntimeHoldReason = RuntimeHoldReason;
	type FreezeIdentifier = (); // FIXME
	type MaxHolds = ConstU32<50>; // FIXME
	type MaxFreezes = ConstU32<50>; // FIXME
}

parameter_types! {
	pub FeeMultiplier: Multiplier = Multiplier::one();
}

impl pallet_transaction_payment::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type OnChargeTransaction = CurrencyAdapter<Balances, ()>;
	type OperationalFeeMultiplier = ConstU8<5>;
	type WeightToFee = IdentityFee<Balance>;
	type LengthToFee = IdentityFee<Balance>;
	type FeeMultiplierUpdate = ConstFeeMultiplier<FeeMultiplier>;
}

impl pallet_asset_tx_payment::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type Fungibles = Assets;
	type OnChargeAssetTransaction = pallet_asset_tx_payment::FungiblesAdapter<
		pallet_assets::BalanceToAssetBalance<Balances, Runtime, ConvertInto, Instance1>,
		CreditToBlockAuthor,
	>;
}

// impl pallet_asset_conversion_tx_payment::Config for Runtime {
// 	type RuntimeEvent = RuntimeEvent;
// 	type Fungibles = Assets;
// 	type OnChargeAssetTransaction =
// 		pallet_asset_conversion_tx_payment::AssetConversionAdapter<Balances, AssetConversion>;
// }

// parameter_types! {
// 	pub const AssetConversionPalletId: PalletId = PalletId(*b"py/ascon");
// 	pub AllowMultiAssetPools: bool = true;
// 	pub const PoolSetupFee: Balance = 1 * DOLLARS; // should be more or equal to the existential
// deposit 	pub const MintMinLiquidity: Balance = 100;  // 100 is good enough when the main currency
// has 10-12 decimals. 	pub const LiquidityWithdrawalFee: Permill = Permill::from_percent(0);  //
// should be non-zero if AllowMultiAssetPools is true, otherwise can be zero. }

// impl pallet_asset_conversion::Config for Runtime {
// 	type RuntimeEvent = RuntimeEvent;
// 	type Currency = Balances;
// 	type AssetBalance = <Self as pallet_balances::Config>::Balance;
// 	type HigherPrecisionBalance = sp_core::U256;
// 	type Assets = Assets;
// 	type Balance = u128;
// 	type PoolAssets = PoolAssets; // TODO:
// 	type AssetId = <Self as pallet_assets::Config<Instance1>>::AssetId;
// 	type MultiAssetId = NativeOrAssetId<u32>;
// 	type PoolAssetId = <Self as pallet_assets::Config<Instance2>>::AssetId;
// 	type PalletId = AssetConversionPalletId;
// 	type LPFee = ConstU32<3>; // means 0.3%
// 	type PoolSetupFee = PoolSetupFee;
// 	type PoolSetupFeeReceiver = AssetConversionOrigin;
// 	type LiquidityWithdrawalFee = LiquidityWithdrawalFee;
// 	type WeightInfo = pallet_asset_conversion::weights::SubstrateWeight<Runtime>;
// 	type AllowMultiAssetPools = AllowMultiAssetPools;
// 	type MaxSwapPathLength = ConstU32<4>;
// 	type MintMinLiquidity = MintMinLiquidity;
// 	type MultiAssetIdConverter = NativeOrAssetIdConverter<u32>;
// 	#[cfg(feature = "runtime-benchmarks")]
// 	type BenchmarkHelper = ();
// }

impl pallet_sudo::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type RuntimeCall = RuntimeCall;
	type WeightInfo = pallet_sudo::weights::SubstrateWeight<Runtime>; // FIXME
}

parameter_types! {
	pub const CommunityLoanPalletId: PalletId = PalletId(*b"py/loana");
	pub const MaxLoans: u32 = 1000;
	pub const VotingTime: BlockNumber = 10;
	pub const MaximumCommitteeMembers: u32 = 10;
	pub const MaxMilestones: u32 = 10;
}

/// Configure the pallet-community-loan-pool in pallets/community-loan-pool.
impl pallet_community_loan_pool::Config for Runtime {
	type PalletId = CommunityLoanPalletId;
	type Currency = Balances;
	type CommitteeOrigin = EitherOfDiverse<
		EnsureRoot<AccountId>,
		pallet_collective::EnsureProportionMoreThan<AccountId, CouncilCollective, 1, 2>,
	>;
	type RuntimeEvent = RuntimeEvent;
	type ProposalBond = ProposalBond;
	type ProposalBondMinimum = ProposalBondMinimum;
	type ProposalBondMaximum = ();
	type OnSlash = ();
	type MaxOngoingLoans = MaxLoans;
	type TimeProvider = Timestamp;
	type WeightInfo = pallet_community_loan_pool::weights::SubstrateWeight<Runtime>;
	#[cfg(feature = "runtime-benchmarks")]
	type Helper = pallet_community_loan_pool::NftHelper;
	type VotingTime = VotingTime;
	type MaxCommitteeMembers = MaximumCommitteeMembers;
	type MaxMilestonesPerProject = MaxMilestones;
	type CollectionId = u32;
	type ItemId = u32;
}

parameter_types! {
	pub const MinimumRemainingAmount: Balance = DOLLARS;
	pub const MaxStaker: u32 = 5000;
	pub const RewardsDistributing: BlockNumber = 1;
}

/// Configure the pallet-xcavate-staking in pallets/xcavate-staking.
impl pallet_xcavate_staking::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type WeightInfo = pallet_xcavate_staking::weights::SubstrateWeight<Runtime>;
	type Currency = Balances;
	type MinimumRemainingAmount = MinimumRemainingAmount;
	type MaxStakers = MaxStaker;
	type TimeProvider = Timestamp;
	type RewardsDistributingTime = RewardsDistributing;
}

parameter_types! {
	pub const NftMarketplacePalletId: PalletId = PalletId(*b"py/nftxc");
	pub const MaxListedNft: u32 = 300000;
	pub const MaxNftsInCollection: u32 = 100;
}

/// Configure the pallet-xcavate-staking in pallets/xcavate-staking.
impl pallet_nft_marketplace::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type WeightInfo = pallet_nft_marketplace::weights::SubstrateWeight<Runtime>;
	type Currency = Balances;
	type PalletId = NftMarketplacePalletId;
	type MaxListedNfts = MaxListedNft;
	type MaxNftInCollection = MaxNftsInCollection;
	#[cfg(feature = "runtime-benchmarks")]
	type Helper = pallet_nft_marketplace::NftHelper;
	type CollectionId = u32;
	type ItemId = u32;
	type TreasuryId = TreasuryPalletId;
	type CommunityProjectsId = CommunityProjectPalletId;
}

parameter_types! {
	pub const CommunityProjectPalletId: PalletId = PalletId(*b"py/cmprj");
	pub const MaxNftType: u32 = 4;
	pub const MaxListedNftProject: u32 = 100000;
	pub const MaxNftsInCollectionProject: u32 = 5000;
	pub const MaxOngoingProject: u32 = 1000;
	pub const MaxNftHolders: u32 = 5000;
}

/// Configure the pallet-xcavate-staking in pallets/xcavate-staking.
impl pallet_community_projects::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type WeightInfo = pallet_community_projects::weights::SubstrateWeight<Runtime>;
	type Currency = Balances;
	type PalletId = CommunityProjectPalletId;
	type MaxNftTypes = MaxNftType;
	type MaxListedNfts = MaxListedNftProject;
	type MaxNftInCollection = MaxNftsInCollectionProject;
	#[cfg(feature = "runtime-benchmarks")]
	type Helper = pallet_community_projects::NftHelper;
	type TimeProvider = Timestamp;
	type MaxOngoingProjects = MaxOngoingProject;
	type MaxNftHolder = MaxNftHolders;
	type AssetId = u32;
	type CollectionId = u32;
	type ItemId = u32;
	type MinimumRemainingAmount = MinimumRemainingAmount;
}

parameter_types! {
	pub const MaxWhitelistUsers: u32 = 100000;
}

/// Configure the pallet-xcavate-staking in pallets/xcavate-staking.
impl pallet_whitelist::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type WeightInfo = pallet_whitelist::weights::SubstrateWeight<Runtime>;
	type WhitelistOrigin = EitherOfDiverse<
		EnsureRoot<AccountId>,
		pallet_collective::EnsureProportionMoreThan<AccountId, CouncilCollective, 1, 2>,
	>;
	type MaxUsersInWhitelist = MaxWhitelistUsers;
}

parameter_types! {
	pub Features: PalletFeatures = PalletFeatures::all_enabled();
	pub const MaxAttributesPerCall: u32 = 10;
	pub const CollectionDeposit: Balance = DOLLARS;
	pub const ItemDeposit: Balance = DOLLARS;
	pub const MetadataDepositBase: Balance = 10 * DOLLARS;
	pub const MetadataDepositPerByte: Balance = DOLLARS;
	pub const StringLimit: u32 = 5000;
	pub const KeyLimit: u32 = 32;
	pub const ValueLimit: u32 = 256;
	pub const ApprovalsLimit: u32 = 20;
	pub const ItemAttributesApprovalsLimit: u32 = 20;
	pub const MaxTips: u32 = 10;
	pub const MaxDeadlineDuration: BlockNumber = 12 * 30 * DAYS;

	pub const UserStringLimit: u32 = 5;

}

ord_parameter_types! {
	pub const CollectionCreationOrigin: AccountId = AccountIdConversion::<AccountId>::into_account_truncating(&CommunityLoanPalletId::get());
}

impl pallet_nfts::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type CollectionId = u32;
	type ItemId = u32;
	type Currency = Balances;
	type ForceOrigin = frame_system::EnsureRoot<AccountId>;
	type CollectionDeposit = CollectionDeposit;
	type ItemDeposit = ItemDeposit;
	type MetadataDepositBase = MetadataDepositBase;
	type AttributeDepositBase = MetadataDepositBase;
	type DepositPerByte = MetadataDepositPerByte;
	type StringLimit = StringLimit;
	type KeyLimit = KeyLimit;
	type ValueLimit = ValueLimit;
	type ApprovalsLimit = ApprovalsLimit;
	type ItemAttributesApprovalsLimit = ItemAttributesApprovalsLimit;
	type MaxTips = MaxTips;
	type MaxDeadlineDuration = MaxDeadlineDuration;
	type MaxAttributesPerCall = MaxAttributesPerCall;
	type Features = Features;
	type OffchainSignature = Signature;
	type OffchainPublic = <Signature as Verify>::Signer;
	type WeightInfo = pallet_nfts::weights::SubstrateWeight<Runtime>;
	#[cfg(feature = "runtime-benchmarks")]
	type Helper = ();
	type CreateOrigin = AsEnsureOriginWithArg<EnsureSignedBy<CollectionCreationOrigin, AccountId>>;
	type Locker = ();
}

impl pallet_uniques::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type CollectionId = u32;
	type ItemId = u32;
	type Currency = Balances;
	type ForceOrigin = frame_system::EnsureRoot<AccountId>;
	type CollectionDeposit = CollectionDeposit;
	type ItemDeposit = ItemDeposit;
	type MetadataDepositBase = MetadataDepositBase;
	type AttributeDepositBase = MetadataDepositBase;
	type DepositPerByte = MetadataDepositPerByte;
	type StringLimit = StringLimit;
	type KeyLimit = KeyLimit;
	type ValueLimit = ValueLimit;
	type WeightInfo = pallet_uniques::weights::SubstrateWeight<Runtime>;
	#[cfg(feature = "runtime-benchmarks")]
	type Helper = ();
	type CreateOrigin = AsEnsureOriginWithArg<EnsureSigned<AccountId>>;
	type Locker = ();
}

parameter_types! {
	pub const AssetConversionPalletId: PalletId = PalletId(*b"py/ascon");
	pub const AssetDeposit: Balance = 100 * DOLLARS;
	pub const ApprovalDeposit: Balance = DOLLARS;

}

impl pallet_assets::Config<Instance1> for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type Balance = u128;
	type AssetId = u32;
	type AssetIdParameter = codec::Compact<u32>;
	type Currency = Balances;
	type CreateOrigin = AsEnsureOriginWithArg<EnsureSigned<AccountId>>;
	type ForceOrigin = EnsureRoot<AccountId>;
	type AssetDeposit = AssetDeposit;
	type AssetAccountDeposit = ConstU128<DOLLARS>;
	type MetadataDepositBase = MetadataDepositBase;
	type MetadataDepositPerByte = MetadataDepositPerByte;
	type ApprovalDeposit = ApprovalDeposit;
	type StringLimit = StringLimit;
	type Freezer = ();
	type Extra = ();
	type CallbackHandle = ();
	type WeightInfo = pallet_assets::weights::SubstrateWeight<Runtime>;
	type RemoveItemsLimit = ConstU32<1000>;
	#[cfg(feature = "runtime-benchmarks")]
	type BenchmarkHelper = ();
}

ord_parameter_types! {
	pub const AssetConversionOrigin: AccountId = AccountIdConversion::<AccountId>::into_account_truncating(&AssetConversionPalletId::get());
}

impl pallet_assets::Config<Instance2> for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type Balance = u128;
	type AssetId = u32;
	type AssetIdParameter = codec::Compact<u32>;
	type Currency = Balances;
	type CreateOrigin = AsEnsureOriginWithArg<EnsureSignedBy<AssetConversionOrigin, AccountId>>;
	type ForceOrigin = EnsureRoot<AccountId>;
	type AssetDeposit = AssetDeposit;
	type AssetAccountDeposit = ConstU128<DOLLARS>;
	type MetadataDepositBase = MetadataDepositBase;
	type MetadataDepositPerByte = MetadataDepositPerByte;
	type ApprovalDeposit = ApprovalDeposit;
	type StringLimit = StringLimit;
	type Freezer = ();
	type Extra = ();
	type WeightInfo = pallet_assets::weights::SubstrateWeight<Runtime>;
	type RemoveItemsLimit = ConstU32<1000>;
	type CallbackHandle = ();
	#[cfg(feature = "runtime-benchmarks")]
	type BenchmarkHelper = ();
}

impl pallet_utility::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type RuntimeCall = RuntimeCall;
	type PalletsOrigin = OriginCaller;
	type WeightInfo = pallet_utility::weights::SubstrateWeight<Runtime>;
}

parameter_types! {
	// One storage item; key size is 32; value is size 4+4+16+32 bytes = 56 bytes.
	pub const DepositBase: Balance = deposit(1, 88);
	// Additional storage item size of 32 bytes.
	pub const DepositFactor: Balance = deposit(0, 32);
	// pub MaxElectingVoters: u32 = 40_000;
}

impl pallet_multisig::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type RuntimeCall = RuntimeCall;
	type Currency = Balances;
	type DepositBase = DepositBase;
	type DepositFactor = DepositFactor;
	type MaxSignatories = ConstU32<100>;
	type WeightInfo = pallet_multisig::weights::SubstrateWeight<Runtime>;
}

frame_election_provider_support::generate_solution_type!(
	#[compact]
	pub struct NposSolution16::<
		VoterIndex = u32,
		TargetIndex = u16,
		Accuracy = sp_runtime::PerU16,
		MaxVoters = MaxElectingVoters,
	>(16)
);

pallet_staking_reward_curve::build! {
	const REWARD_CURVE: PiecewiseLinear<'static> = curve!(
		min_inflation: 0_040_000,
		max_inflation: 0_050_000,
		// 60% of total issuance at a yearly inflation rate of 5%
		ideal_stake: 0_600_000,
		falloff: 0_050_000,
		max_piece_count: 40,
		test_precision: 0_005_000,
	);
}

parameter_types! {
	// pub MaxNominations: u32 = <NposSolution16 as frame_election_provider_support::NposSolution>::LIMIT as u32;
	// pub const SessionsPerEra: sp_staking::SessionIndex = 6;
	pub const SessionsPerEra: sp_staking::SessionIndex = 2;
	pub const BondingDuration: sp_staking::EraIndex = 24 * 28;
	pub const SlashDeferDuration: sp_staking::EraIndex = 24 * 7; // 1/4 the bonding duration.
	pub const RewardCurve: &'static PiecewiseLinear<'static> = &REWARD_CURVE;
	pub const MaxNominatorRewardedPerValidator: u32 = 256;
	pub const OffendingValidatorsThreshold: Perbill = Perbill::from_percent(17);
	pub OffchainRepeat: BlockNumber = 5;
	pub const HistoryDepth: u32 = 80;
}

pub struct StakingBenchmarkingConfig;
impl pallet_staking::BenchmarkingConfig for StakingBenchmarkingConfig {
	type MaxValidators = ConstU32<1000>;
	type MaxNominators = ConstU32<0>; // FIXME
}

impl pallet_staking::Config for Runtime {
	type Currency = Balances;
	type CurrencyBalance = Balance;
	type UnixTime = Timestamp;
	type CurrencyToVote = U128CurrencyToVote;
	type RewardRemainder = Treasury;
	type RuntimeEvent = RuntimeEvent;
	type Slash = Treasury; // send the slashed funds to the treasury.
	type Reward = (); // rewards are minted from the void
	type SessionsPerEra = SessionsPerEra;
	type BondingDuration = BondingDuration;
	type SlashDeferDuration = SlashDeferDuration;
	type SessionInterface = Self;
	type AdminOrigin = frame_system::EnsureRoot<Self::AccountId>;
	type EraPayout = pallet_staking::ConvertCurve<RewardCurve>;
	type NextNewSession = Session;
	type MaxNominatorRewardedPerValidator = MaxNominatorRewardedPerValidator;
	type OffendingValidatorsThreshold = OffendingValidatorsThreshold;
	type ElectionProvider = ElectionProviderMultiPhase;
	type GenesisElectionProvider = onchain::OnChainExecution<OnChainSeqPhragmen>;
	type VoterList = BagsList;
	type MaxUnlockingChunks = ConstU32<32>;
	type WeightInfo = pallet_staking::weights::SubstrateWeight<Runtime>;
	type BenchmarkingConfig = StakingBenchmarkingConfig;
	type TargetList = pallet_staking::UseValidatorsMap<Runtime>;
	type HistoryDepth = HistoryDepth;
	type NominationsQuota = pallet_staking::FixedNominationsQuota<16>; // FIXME
	type EventListeners = (); // FIXME
}

parameter_types! {
	pub const ProposalBond: Permill = Permill::from_percent(5);
	pub const ProposalBondMinimum: Balance = DOLLARS;
	// pub const SpendPeriod: BlockNumber = DAYS;
	pub const SpendPeriod: BlockNumber = MINUTES;
	pub const Burn: Permill = Permill::from_percent(50);
	// pub const TipCountdown: BlockNumber = DAYS;
	pub const TipCountdown: BlockNumber = MINUTES;
	pub const TipFindersFee: Percent = Percent::from_percent(20);
	pub const TipReportDepositBase: Balance = DOLLARS;
	pub const DataDepositPerByte: Balance = CENTS;
	pub const TreasuryPalletId: PalletId = PalletId(*b"py/trsry");
	pub const MaximumReasonLength: u32 = 300;
	pub const MaxApprovals: u32 = 100;
	pub const MaxBalance: Balance = Balance::max_value();
}

impl pallet_treasury::Config for Runtime {
	type PalletId = TreasuryPalletId;
	type Currency = Balances;

	type ApproveOrigin = EitherOfDiverse<
		EnsureRoot<AccountId>,
		pallet_collective::EnsureProportionAtLeast<AccountId, CouncilCollective, 3, 5>,
	>;
	type RejectOrigin = EitherOfDiverse<
		EnsureRoot<AccountId>,
		pallet_collective::EnsureProportionMoreThan<AccountId, CouncilCollective, 1, 2>,
	>;

	// type ApproveOrigin = EnsureSigned<AccountId>;
	// type RejectOrigin = EnsureSigned<AccountId>;

	type RuntimeEvent = RuntimeEvent;
	type OnSlash = ();
	type ProposalBond = ProposalBond;
	type ProposalBondMinimum = ProposalBondMinimum;
	type ProposalBondMaximum = ();
	type SpendPeriod = SpendPeriod;
	type Burn = Burn;
	type BurnDestination = ();
	type SpendFunds = Bounties;
	type WeightInfo = pallet_treasury::weights::SubstrateWeight<Runtime>;
	type MaxApprovals = MaxApprovals;
	type SpendOrigin = EnsureWithSuccess<EnsureRoot<AccountId>, AccountId, MaxBalance>;
}

parameter_types! {
	pub const CouncilMotionDuration: BlockNumber = 5 * DAYS;
	pub const CouncilMaxProposals: u32 = 100;
	pub const CouncilMaxMembers: u32 = 100;
}

type CouncilCollective = pallet_collective::Instance1;
impl pallet_collective::Config<CouncilCollective> for Runtime {
	type RuntimeOrigin = RuntimeOrigin;
	type Proposal = RuntimeCall;
	type RuntimeEvent = RuntimeEvent;
	type MotionDuration = CouncilMotionDuration;
	type MaxProposals = CouncilMaxProposals;
	type MaxMembers = CouncilMaxMembers;
	type DefaultVote = pallet_collective::PrimeDefaultVote;
	type WeightInfo = pallet_collective::weights::SubstrateWeight<Runtime>;
	type SetMembersOrigin = EnsureRoot<Self::AccountId>;
	type MaxProposalWeight = MaxCollectivesProposalWeight;
}

parameter_types! {
	pub const TechnicalMotionDuration: BlockNumber = 5 * DAYS;
	pub const TechnicalMaxProposals: u32 = 100;
	pub const TechnicalMaxMembers: u32 = 100;
}

type TechnicalCollective = pallet_collective::Instance2;
impl pallet_collective::Config<TechnicalCollective> for Runtime {
	type RuntimeOrigin = RuntimeOrigin;
	type Proposal = RuntimeCall;
	type RuntimeEvent = RuntimeEvent;
	type MotionDuration = TechnicalMotionDuration;
	type MaxProposals = TechnicalMaxProposals;
	type MaxMembers = TechnicalMaxMembers;
	type DefaultVote = pallet_collective::PrimeDefaultVote;
	type WeightInfo = pallet_collective::weights::SubstrateWeight<Runtime>;
	type SetMembersOrigin = EnsureRoot<Self::AccountId>;
	type MaxProposalWeight = MaxCollectivesProposalWeight;
}

const ALLIANCE_MOTION_DURATION_IN_BLOCKS: BlockNumber = 5 * DAYS;

parameter_types! {
	pub const AllianceMotionDuration: BlockNumber = ALLIANCE_MOTION_DURATION_IN_BLOCKS;
	pub const AllianceMaxProposals: u32 = 100;
	pub const AllianceMaxMembers: u32 = 100;
}

type AllianceCollective = pallet_collective::Instance3;
impl pallet_collective::Config<AllianceCollective> for Runtime {
	type RuntimeOrigin = RuntimeOrigin;
	type Proposal = RuntimeCall;
	type RuntimeEvent = RuntimeEvent;
	type MotionDuration = AllianceMotionDuration;
	type MaxProposals = AllianceMaxProposals;
	type MaxMembers = AllianceMaxMembers;
	type DefaultVote = pallet_collective::PrimeDefaultVote;
	type WeightInfo = pallet_collective::weights::SubstrateWeight<Runtime>;
	type SetMembersOrigin = EnsureRoot<Self::AccountId>;
	type MaxProposalWeight = MaxCollectivesProposalWeight;
}

parameter_types! {
	// pub const BountyCuratorDeposit: Permill = Permill::from_percent(50);
	pub const BountyValueMinimum: Balance = 5 * DOLLARS;
	pub const BountyDepositBase: Balance = DOLLARS;
	pub const CuratorDepositMultiplier: Permill = Permill::from_percent(50);
	pub const CuratorDepositMin: Balance = DOLLARS;
	pub const CuratorDepositMax: Balance = 100 * DOLLARS;
	pub const BountyDepositPayoutDelay: BlockNumber = DAYS;
	pub const BountyUpdatePeriod: BlockNumber = 14 * DAYS;
}

impl pallet_bounties::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type BountyDepositBase = BountyDepositBase;
	type BountyDepositPayoutDelay = BountyDepositPayoutDelay;
	type BountyUpdatePeriod = BountyUpdatePeriod;
	type CuratorDepositMultiplier = CuratorDepositMultiplier;
	type CuratorDepositMin = CuratorDepositMin;
	type CuratorDepositMax = CuratorDepositMax;
	type BountyValueMinimum = BountyValueMinimum;
	type DataDepositPerByte = DataDepositPerByte;
	type MaximumReasonLength = MaximumReasonLength;
	type WeightInfo = pallet_bounties::weights::SubstrateWeight<Runtime>;
	type ChildBountyManager = ChildBounties;
}

parameter_types! {
	pub const ChildBountyValueMinimum: Balance = DOLLARS;
	pub const EpochDuration: u64 = EPOCH_DURATION_IN_SLOTS;
	pub const ExpectedBlockTime: Moment = MILLISECS_PER_BLOCK;
	pub const ReportLongevity: u64 = BondingDuration::get() as u64 * SessionsPerEra::get() as u64 * EpochDuration::get();
	pub const MaxAuthorities: u32 = 100;
}

impl pallet_child_bounties::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type MaxActiveChildBountyCount = ConstU32<5>;
	type ChildBountyValueMinimum = ChildBountyValueMinimum;
	type WeightInfo = pallet_child_bounties::weights::SubstrateWeight<Runtime>;
}

impl pallet_session::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type Keys = SessionKeys;
	type NextSessionRotation = Babe;
	type SessionHandler = <SessionKeys as OpaqueKeys>::KeyTypeIdProviders;
	type SessionManager = pallet_session::historical::NoteHistoricalRoot<Self, Staking>;
	type ShouldEndSession = Babe;
	type ValidatorId = <Self as frame_system::Config>::AccountId;
	type ValidatorIdOf = pallet_staking::StashOf<Self>;
	type WeightInfo = pallet_session::weights::SubstrateWeight<Runtime>;
}

impl pallet_session::historical::Config for Runtime {
	type FullIdentification = pallet_staking::Exposure<AccountId, Balance>;
	type FullIdentificationOf = pallet_staking::ExposureOf<Runtime>;
}

impl pallet_babe::Config for Runtime {
	type EpochDuration = EpochDuration;
	type ExpectedBlockTime = ExpectedBlockTime;
	type EpochChangeTrigger = pallet_babe::ExternalTrigger;
	type DisabledValidators = Session;
	type WeightInfo = ();
	type MaxAuthorities = MaxAuthorities;
	type KeyOwnerProof =
		<Historical as KeyOwnerProofSystem<(KeyTypeId, pallet_babe::AuthorityId)>>::Proof;
	type EquivocationReportSystem =
		pallet_babe::EquivocationReportSystem<Self, Offences, Historical, ReportLongevity>;
	type MaxNominators = ConstU32<0>; // FIXME
}

/// The numbers configured here could always be more than the the maximum limits of staking pallet
/// to ensure election snapshot will not run out of memory. For now, we set them to smaller values
/// since the staking is bounded and the weight pipeline takes hours for this single pallet.
pub struct ElectionProviderBenchmarkConfig;
impl pallet_election_provider_multi_phase::BenchmarkingConfig for ElectionProviderBenchmarkConfig {
	const VOTERS: [u32; 2] = [1000, 2000];
	const TARGETS: [u32; 2] = [500, 1000];
	const ACTIVE_VOTERS: [u32; 2] = [500, 800];
	const DESIRED_TARGETS: [u32; 2] = [200, 400];
	const SNAPSHOT_MAXIMUM_VOTERS: u32 = 1000;
	const MINER_MAXIMUM_VOTERS: u32 = 1000;
	const MAXIMUM_TARGETS: u32 = 300;
}

/// Maximum number of iterations for balancing that will be executed in the embedded OCW
/// miner of election provider multi phase.
pub const MINER_MAX_ITERATIONS: u32 = 10;

/// A source of random balance for NposSolver, which is meant to be run by the OCW election miner.
pub struct OffchainRandomBalancing;
impl Get<Option<(usize, ExtendedBalance)>> for OffchainRandomBalancing {
	fn get() -> Option<(usize, ExtendedBalance)> {
		use sp_runtime::traits::TrailingZeroInput;
		let iters = match MINER_MAX_ITERATIONS {
			0 => 0,
			max => {
				let seed = sp_io::offchain::random_seed();
				let random = <u32>::decode(&mut TrailingZeroInput::new(&seed))
					.expect("input is padded with zeroes; qed")
					% max.saturating_add(1);
				random as usize
			},
		};

		Some((iters, 0))
	}
}

parameter_types! {
	// phase durations. 1/4 of the last session for each.
	pub const SignedPhase: u32 = EPOCH_DURATION_IN_BLOCKS / 4;
	pub const UnsignedPhase: u32 = EPOCH_DURATION_IN_BLOCKS / 4;
	pub BetterUnsignedThreshold: Perbill = Perbill::from_rational(1u32, 10_000);

	// We prioritize im-online heartbeats over election solution submission.
	pub const StakingUnsignedPriority: TransactionPriority = TransactionPriority::max_value() / 2;

	// signed config
	pub const SignedRewardBase: Balance = DOLLARS;
	pub const SignedDepositBase: Balance = DOLLARS;
	pub const SignedDepositByte: Balance = CENTS;

	// The maximum winners that can be elected by the Election pallet which is equivalent to the
	// maximum active validators the staking pallet can have.
	// pub MaxActiveValidators: u32 = 1000;
}

parameter_types! {
	pub MaxNominations: u32 = <NposSolution16 as frame_election_provider_support::NposSolution>::LIMIT as u32;
	pub MaxElectingVoters: u32 = 40_000;
	// OnChain values are lower.
	pub MaxOnChainElectingVoters: u32 = 5000;
	pub MaxOnChainElectableTargets: u16 = 1250;
	// The maximum winners that can be elected by the Election pallet which is equivalent to the
	// maximum active validators the staking pallet can have.
	pub MaxActiveValidators: u32 = 1000;

	// miner configs
	pub const MultiPhaseUnsignedPriority: TransactionPriority = StakingUnsignedPriority::get() - 1u64;
	pub MinerMaxWeight: Weight = BlockWeights::get()
		.get(DispatchClass::Normal)
		.max_extrinsic.expect("Normal extrinsics have a weight limit configured; qed")
		.saturating_sub(BlockExecutionWeight::get());
	// Solution can occupy 90% of normal block size
	pub MinerMaxLength: u32 = Perbill::from_rational(9u32, 10) *
		*BlockLength::get()
		.max
		.get(DispatchClass::Normal);

	pub ElectionBoundsMultiPhase: ElectionBounds = ElectionBoundsBuilder::default()
		.voters_count(10_000.into()).targets_count(1_500.into()).build(); // FIXME
	pub ElectionBoundsOnChain: ElectionBounds = ElectionBoundsBuilder::default()
		.voters_count(5_000.into()).targets_count(1_250.into()).build(); // FIXME
}

pub struct OnChainSeqPhragmen;
impl onchain::Config for OnChainSeqPhragmen {
	type System = Runtime;
	type Solver = SequentialPhragmen<
		AccountId,
		pallet_election_provider_multi_phase::SolutionAccuracyOf<Runtime>,
	>;
	type DataProvider = <Runtime as pallet_election_provider_multi_phase::Config>::DataProvider;
	type WeightInfo = frame_election_provider_support::weights::SubstrateWeight<Runtime>;
	type MaxWinners = <Runtime as pallet_election_provider_multi_phase::Config>::MaxWinners;
	type Bounds = ElectionBoundsOnChain;
}

pub struct SubmitMinerConfig;
impl pallet_election_provider_multi_phase::MinerConfig for SubmitMinerConfig {
	type AccountId = AccountId;
	type MaxLength = MinerMaxLength;
	type MaxWeight = MinerMaxWeight;
	type MaxVotesPerVoter = ConstU32<16>;
	type Solution = NposSolution16;
	type MaxWinners = MaxActiveValidators;

	// The unsigned submissions have to respect the weight of the submit_unsigned call, thus their
	// weight estimate function is wired to this call's weight.
	fn solution_weight(v: u32, t: u32, a: u32, d: u32) -> Weight {
		<
			<Runtime as pallet_election_provider_multi_phase::Config>::WeightInfo
			as
			pallet_election_provider_multi_phase::WeightInfo
		>::submit_unsigned(v, t, a, d)
	}
}

impl pallet_election_provider_multi_phase::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type Currency = Balances;
	type EstimateCallFee = TransactionPayment;
	type SignedPhase = SignedPhase;
	type UnsignedPhase = UnsignedPhase;
	type BetterUnsignedThreshold = BetterUnsignedThreshold;
	type BetterSignedThreshold = ();
	type MinerConfig = SubmitMinerConfig;
	type OffchainRepeat = OffchainRepeat;
	type MinerTxPriority = MultiPhaseUnsignedPriority;
	type SignedMaxSubmissions = ConstU32<10>;
	type SignedRewardBase = SignedRewardBase;
	type SignedDepositBase = SignedDepositBase;
	type SignedDepositByte = SignedDepositByte;
	type SignedMaxRefunds = ConstU32<3>;
	type SignedDepositWeight = ();
	type SignedMaxWeight = MinerMaxWeight;
	type SlashHandler = (); // burn slashes
	type RewardHandler = (); // nothing to do upon rewards
	type DataProvider = Staking;
	type Fallback = onchain::OnChainExecution<OnChainSeqPhragmen>;
	type GovernanceFallback = onchain::OnChainExecution<OnChainSeqPhragmen>;
	type Solver = SequentialPhragmen<AccountId, SolutionAccuracyOf<Self>, ()>;
	type ForceOrigin = EnsureRoot<AccountId>;
	type MaxWinners = MaxActiveValidators;
	type BenchmarkingConfig = ElectionProviderBenchmarkConfig;
	type WeightInfo = pallet_election_provider_multi_phase::weights::SubstrateWeight<Self>;
	type ElectionBounds = ElectionBoundsMultiPhase;
}

parameter_types! {
	pub const BagThresholds: &'static [u64] = &voter_bags::THRESHOLDS;
}

impl pallet_bags_list::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type ScoreProvider = Staking;
	type WeightInfo = pallet_bags_list::weights::SubstrateWeight<Runtime>;
	type BagThresholds = BagThresholds;
	type Score = VoteWeight;
}

parameter_types! {
  pub const PostUnbondPoolsWindow: u32 = 4;
  pub const NominationPoolsPalletId: PalletId = PalletId(*b"py/nopls");
  pub const MaxPointsToBalance: u8 = 10;
}

pub struct BalanceToU256;
impl Convert<Balance, sp_core::U256> for BalanceToU256 {
	fn convert(balance: Balance) -> sp_core::U256 {
		sp_core::U256::from(balance)
	}
}
pub struct U256ToBalance;
impl Convert<sp_core::U256, Balance> for U256ToBalance {
	fn convert(n: sp_core::U256) -> Balance {
		n.try_into().unwrap_or(Balance::max_value())
	}
}

impl pallet_nomination_pools::Config for Runtime {
	type WeightInfo = ();
	type RuntimeEvent = RuntimeEvent;
	type Currency = Balances;
	type RewardCounter = FixedU128;
	type BalanceToU256 = BalanceToU256;
	type U256ToBalance = U256ToBalance;
	type Staking = Staking;
	type PostUnbondingPoolsWindow = PostUnbondPoolsWindow;
	type MaxMetadataLen = ConstU32<256>;
	type MaxUnbonding = ConstU32<8>;
	type PalletId = NominationPoolsPalletId;
	type MaxPointsToBalance = MaxPointsToBalance;
}

impl pallet_offences::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type IdentificationTuple = pallet_session::historical::IdentificationTuple<Self>;
	type OnOffenceHandler = Staking;
}

impl<C> frame_system::offchain::SendTransactionTypes<C> for Runtime
where
	RuntimeCall: From<C>,
{
	type Extrinsic = UncheckedExtrinsic;
	type OverarchingCall = RuntimeCall;
}

impl pallet_authority_discovery::Config for Runtime {
	type MaxAuthorities = MaxAuthorities;
}

parameter_types! {
	pub const LaunchPeriod: BlockNumber = MINUTES;
	pub const VotingPeriod: BlockNumber = 3 * MINUTES;
	pub const FastTrackVotingPeriod: BlockNumber = 3 * 24 * 60 * MINUTES;
	pub const MinimumDeposit: Balance = 100 * DOLLARS;
	pub const EnactmentPeriod: BlockNumber = MINUTES;
	pub const CooloffPeriod: BlockNumber = MINUTES;
	pub const MaxProposals: u32 = 100;
}

impl pallet_democracy::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type Currency = Balances;
	type EnactmentPeriod = EnactmentPeriod;
	type LaunchPeriod = LaunchPeriod;
	type VotingPeriod = VotingPeriod;
	type VoteLockingPeriod = EnactmentPeriod; // Same as EnactmentPeriod
	type MinimumDeposit = MinimumDeposit;
	/// A straight majority of the council can decide what their next motion is.
	type ExternalOrigin =
		pallet_collective::EnsureProportionAtLeast<AccountId, CouncilCollective, 1, 2>;
	/// A super-majority can have the next scheduled referendum be a straight majority-carries vote.
	type ExternalMajorityOrigin =
		pallet_collective::EnsureProportionAtLeast<AccountId, CouncilCollective, 3, 4>;
	/// A unanimous council can have the next scheduled referendum be a straight default-carries
	/// (NTB) vote.
	type ExternalDefaultOrigin =
		pallet_collective::EnsureProportionAtLeast<AccountId, CouncilCollective, 1, 1>;
	type SubmitOrigin = EnsureSigned<AccountId>;
	/// Two thirds of the technical committee can have an ExternalMajority/ExternalDefault vote
	/// be tabled immediately and with a shorter voting/enactment period.
	type FastTrackOrigin =
		pallet_collective::EnsureProportionAtLeast<AccountId, TechnicalCollective, 2, 3>;
	type InstantOrigin =
		pallet_collective::EnsureProportionAtLeast<AccountId, TechnicalCollective, 1, 1>;
	type InstantAllowed = frame_support::traits::ConstBool<true>;
	type FastTrackVotingPeriod = FastTrackVotingPeriod;
	// To cancel a proposal which has been passed, 2/3 of the council must agree to it.
	type CancellationOrigin =
		pallet_collective::EnsureProportionAtLeast<AccountId, CouncilCollective, 2, 3>;
	// To cancel a proposal before it has been passed, the technical committee must be unanimous or
	// Root must agree.
	type CancelProposalOrigin = EitherOfDiverse<
		EnsureRoot<AccountId>,
		pallet_collective::EnsureProportionAtLeast<AccountId, TechnicalCollective, 1, 1>,
	>;
	type BlacklistOrigin = EnsureRoot<AccountId>;
	// Any single technical committee member may veto a coming council proposal, however they can
	// only do it once and it lasts only for the cool-off period.
	type VetoOrigin = pallet_collective::EnsureMember<AccountId, TechnicalCollective>;
	type CooloffPeriod = CooloffPeriod;
	type Slash = Treasury;
	type Scheduler = Scheduler;
	type PalletsOrigin = OriginCaller;
	type MaxVotes = ConstU32<100>;
	type WeightInfo = pallet_democracy::weights::SubstrateWeight<Runtime>;
	type MaxProposals = MaxProposals;
	type Preimages = Preimage;
	type MaxDeposits = ConstU32<100>;
	type MaxBlacklisted = ConstU32<100>;
}

parameter_types! {
	pub MaximumSchedulerWeight: Weight = Perbill::from_percent(80) *
		RuntimeBlockWeights::get().max_block;
}

impl pallet_scheduler::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type RuntimeOrigin = RuntimeOrigin;
	type PalletsOrigin = OriginCaller;
	type RuntimeCall = RuntimeCall;
	type MaximumWeight = MaximumSchedulerWeight;
	type ScheduleOrigin = EnsureRoot<AccountId>;
	#[cfg(feature = "runtime-benchmarks")]
	type MaxScheduledPerBlock = ConstU32<512>;
	#[cfg(not(feature = "runtime-benchmarks"))]
	type MaxScheduledPerBlock = ConstU32<50>;
	type WeightInfo = pallet_scheduler::weights::SubstrateWeight<Runtime>;
	type OriginPrivilegeCmp = EqualPrivilegeOnly;
	type Preimages = Preimage;
}

parameter_types! {
	pub const PreimageMaxSize: u32 = 4096 * 1024;
	pub const PreimageBaseDeposit: Balance = DOLLARS;
	// One cent: $10,000 / MB
	pub const PreimageByteDeposit: Balance = CENTS;
}

impl pallet_preimage::Config for Runtime {
	type WeightInfo = pallet_preimage::weights::SubstrateWeight<Runtime>;
	type RuntimeEvent = RuntimeEvent;
	type Currency = Balances;
	type ManagerOrigin = EnsureRoot<AccountId>;
	type BaseDeposit = PreimageBaseDeposit;
	type ByteDeposit = PreimageByteDeposit;
}

// TODO::

// parameter_types! {
// 	pub const VoteLockingPeriod: BlockNumber = 30 * DAYS;
// }

// impl pallet_conviction_voting::Config for Runtime {
// 	type WeightInfo = pallet_conviction_voting::weights::SubstrateWeight<Self>;
// 	type RuntimeEvent = RuntimeEvent;
// 	type Currency = Balances;
// 	type VoteLockingPeriod = VoteLockingPeriod;
// 	type MaxVotes = ConstU32<512>;
// 	type MaxTurnout = frame_support::traits::TotalIssuanceOf<Balances, Self::AccountId>;
// 	type Polls = Referenda;
// }

// impl pallet_ranked_collective::Config for Runtime {
// 	type WeightInfo = pallet_ranked_collective::weights::SubstrateWeight<Self>;
// 	type RuntimeEvent = RuntimeEvent;
// 	type PromoteOrigin = EnsureRootWithSuccess<AccountId, ConstU16<65535>>;
// 	type DemoteOrigin = EnsureRootWithSuccess<AccountId, ConstU16<65535>>;
// 	type Polls = RankedPolls;
// 	type MinRankOfClass = traits::Identity;
// 	type VoteWeight = pallet_ranked_collective::Geometric;
// }

// parameter_types! {
// 	pub const AlarmInterval: BlockNumber = 1;
// 	pub const SubmissionDeposit: Balance = 100 * DOLLARS;
// 	pub const UndecidingTimeout: BlockNumber = 28 * DAYS;
// }

// pub struct TracksInfo;
// impl pallet_referenda::TracksInfo<Balance, BlockNumber> for TracksInfo {
// 	type Id = u16;
// 	type RuntimeOrigin = <RuntimeOrigin as frame_support::traits::OriginTrait>::PalletsOrigin;
// 	fn tracks() -> &'static [(Self::Id, pallet_referenda::TrackInfo<Balance, BlockNumber>)] {
// 		static DATA: [(u16, pallet_referenda::TrackInfo<Balance, BlockNumber>); 1] = [(
// 			0u16,
// 			pallet_referenda::TrackInfo {
// 				name: "root",
// 				max_deciding: 1,
// 				decision_deposit: 10,
// 				prepare_period: 4,
// 				decision_period: 4,
// 				confirm_period: 2,
// 				min_enactment_period: 4,
// 				min_approval: pallet_referenda::Curve::LinearDecreasing {
// 					length: Perbill::from_percent(100),
// 					floor: Perbill::from_percent(50),
// 					ceil: Perbill::from_percent(100),
// 				},
// 				min_support: pallet_referenda::Curve::LinearDecreasing {
// 					length: Perbill::from_percent(100),
// 					floor: Perbill::from_percent(0),
// 					ceil: Perbill::from_percent(100),
// 				},
// 			},
// 		)];
// 		&DATA[..]
// 	}
// 	fn track_for(id: &Self::RuntimeOrigin) -> Result<Self::Id, ()> {
// 		if let Ok(system_origin) = frame_system::RawOrigin::try_from(id.clone()) {
// 			match system_origin {
// 				frame_system::RawOrigin::Root => Ok(0),
// 				_ => Err(()),
// 			}
// 		} else {
// 			Err(())
// 		}
// 	}
// }

// pallet_referenda::impl_tracksinfo_get!(TracksInfo, Balance, BlockNumber);

// impl pallet_referenda::Config for Runtime {
// 	type WeightInfo = pallet_referenda::weights::SubstrateWeight<Self>;
// 	type RuntimeCall = RuntimeCall;
// 	type RuntimeEvent = RuntimeEvent;
// 	type Scheduler = Scheduler;
// 	type Currency = pallet_balances::Pallet<Self>;
// 	type SubmitOrigin = EnsureSigned<AccountId>;
// 	type CancelOrigin = EnsureRoot<AccountId>;
// 	type KillOrigin = EnsureRoot<AccountId>;
// 	type Slash = ();
// 	type Votes = pallet_conviction_voting::VotesOf<Runtime>;
// 	type Tally = pallet_conviction_voting::TallyOf<Runtime>;
// 	type SubmissionDeposit = SubmissionDeposit;
// 	type MaxQueued = ConstU32<100>;
// 	type UndecidingTimeout = UndecidingTimeout;
// 	type AlarmInterval = AlarmInterval;
// 	type Tracks = TracksInfo;
// 	type Preimages = Preimage;
// }

// impl pallet_referenda::Config<pallet_referenda::Instance2> for Runtime {
// 	type WeightInfo = pallet_referenda::weights::SubstrateWeight<Self>;
// 	type RuntimeCall = RuntimeCall;
// 	type RuntimeEvent = RuntimeEvent;
// 	type Scheduler = Scheduler;
// 	type Currency = pallet_balances::Pallet<Self>;
// 	type SubmitOrigin = EnsureSigned<AccountId>;
// 	type CancelOrigin = EnsureRoot<AccountId>;
// 	type KillOrigin = EnsureRoot<AccountId>;
// 	type Slash = ();
// 	type Votes = pallet_ranked_collective::Votes;
// 	type Tally = pallet_ranked_collective::TallyOf<Runtime>;
// 	type SubmissionDeposit = SubmissionDeposit;
// 	type MaxQueued = ConstU32<100>;
// 	type UndecidingTimeout = UndecidingTimeout;
// 	type AlarmInterval = AlarmInterval;
// 	type Tracks = TracksInfo;
// 	type Preimages = Preimage;
// }

// TODO:

/* pub struct OnAcurastFulfillment;
impl pallet_acurast_fulfillment_receiver::traits::OnFulfillment<Runtime> for OnAcurastFulfillment {
	fn on_fulfillment(
		_from: <Runtime as frame_system::Config>::AccountId,
		_fulfillment: Fulfillment,
	) -> DispatchResultWithInfo<PostDispatchInfo> {
		Ok(PostDispatchInfo { actual_weight: None, pays_fee: Pays::No })
	}
} */

/* impl pallet_acurast_fulfillment_receiver::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type OnFulfillment = OnAcurastFulfillment;
	type WeightInfo = ();
} */

// Create the runtime by composing the FRAME pallets that were previously configured.
construct_runtime!(
	pub struct Runtime
	{
		System: frame_system,
		Timestamp: pallet_timestamp,
		Aura: pallet_aura,
		Grandpa: pallet_grandpa,
		Balances: pallet_balances,
		TransactionPayment: pallet_transaction_payment,
		Sudo: pallet_sudo,
		CommunityLoanPool: pallet_community_loan_pool,
		XcavateStaking: pallet_xcavate_staking,
		NftMarketplace: pallet_nft_marketplace,
		CommunityProject: pallet_community_projects,
		Whitelist: pallet_whitelist,
		Nfts: pallet_nfts,
		Uniques: pallet_uniques, //10
		RandomnessCollectiveFlip: pallet_insecure_randomness_collective_flip,
		Assets: pallet_assets::<Instance1>,
		PoolAssets: pallet_assets::<Instance2>,
		Utility: pallet_utility,
		Multisig: pallet_multisig,
		Authorship: pallet_authorship::{Pallet, Storage},
		Treasury: pallet_treasury,
//		Treasury: pallet_treasury::{Pallet, Call, Storage, Config, Event<T>},
		Bounties: pallet_bounties::{Pallet, Call, Storage, Event<T>},
		ChildBounties: pallet_child_bounties::{Pallet, Call, Storage, Event<T>},
		Session: pallet_session::{Pallet, Call, Storage, Event, Config<T>},
		Babe: pallet_babe,
//		Babe: pallet_babe::{Pallet, Call, Storage, Config, ValidateUnsigned},
		Historical: pallet_session_historical::{Pallet},
		Staking: pallet_staking::{Pallet, Call, Config<T>, Storage, Event<T>},
		ElectionProviderMultiPhase: pallet_election_provider_multi_phase::{Pallet, Call, Storage, Event<T>, ValidateUnsigned},
		BagsList: pallet_bags_list::{Pallet, Call, Storage, Event<T>},
		NominationPools: pallet_nomination_pools::{Pallet, Call, Storage, Event<T>},
		Offences: pallet_offences::{Pallet, Storage, Event},
		ImOnline: pallet_im_online::{Pallet, Call, Storage, Event<T>, ValidateUnsigned, Config<T>},
		Council: pallet_collective::<Instance1>,
		TechnicalCommittee: pallet_collective::<Instance2>,
		AllianceMotion: pallet_collective::<Instance3>,
		AuthorityDiscovery: pallet_authority_discovery,
		AssetTxPayment: pallet_asset_tx_payment,
		Scheduler: pallet_scheduler,
		Preimage: pallet_preimage,
		Democracy: pallet_democracy,

		// TODO:
		// Referenda: pallet_referenda,
		// RankedPolls: pallet_referenda::<Instance2>,
		// ConvictionVoting: pallet_conviction_voting,
		// RankedCollective: pallet_ranked_collective,
		// TODO::
		// AssetConversionTxPayment: pallet_asset_conversion_tx_payment,
		// AssetConversion: pallet_asset_conversion,

		// Acurast
		//AcurastReceiver: pallet_acurast_fulfillment_receiver::{Pallet, Call, Storage, Event<T>} = 40,

	}
);

/// The address format for describing accounts.
pub type Address = sp_runtime::MultiAddress<AccountId, ()>;
/// Block header type as expected by this runtime.
pub type Header = generic::Header<BlockNumber, BlakeTwo256>;
/// Block type as expected by this runtime.
pub type Block = generic::Block<Header, UncheckedExtrinsic>;
/// The SignedExtension to the basic transaction logic.
pub type SignedExtra = (
	frame_system::CheckNonZeroSender<Runtime>,
	frame_system::CheckSpecVersion<Runtime>,
	frame_system::CheckTxVersion<Runtime>,
	frame_system::CheckGenesis<Runtime>,
	frame_system::CheckEra<Runtime>,
	frame_system::CheckNonce<Runtime>,
	frame_system::CheckWeight<Runtime>,
	// pallet_transaction_payment::ChargeTransactionPayment<Runtime>,
	pallet_asset_tx_payment::ChargeAssetTxPayment<Runtime>,
);

/// Unchecked extrinsic type as expected by this runtime.
pub type UncheckedExtrinsic =
	generic::UncheckedExtrinsic<Address, RuntimeCall, Signature, SignedExtra>;
/// The payload being signed in transactions.
pub type SignedPayload = generic::SignedPayload<RuntimeCall, SignedExtra>;
/// Executive: handles dispatch to the various modules.
pub type Executive = frame_executive::Executive<
	Runtime,
	Block,
	frame_system::ChainContext<Runtime>,
	Runtime,
	AllPalletsWithSystem,
>;

#[cfg(feature = "runtime-benchmarks")]
#[macro_use]
extern crate frame_benchmarking;

#[cfg(feature = "runtime-benchmarks")]
mod benches {
	define_benchmarks!(
		[frame_benchmarking, BaselineBench::<Runtime>]
		[frame_system, SystemBench::<Runtime>]
		[pallet_balances, Balances]
		[pallet_timestamp, Timestamp]
		[pallet_community_loan_pool, CommunityLoanPool]
		[pallet_xcavate_staking, XcavateStaking]
		[pallet_nft_marketplace, NftMarketplace]
		[pallet_community_projects, CommunityProject]
		[pallet_whitelist, Whitelist]
		[pallet_nfts, Nfts]
		[pallet_uniques, Uniques]
		[pallet_assets, Assets]
		[pallet_utility, Utility]
		[pallet_multisig, Multisig]
	);
}

impl_runtime_apis! {
	impl pallet_nfts_runtime_api::NftsApi<Block, AccountId, u32, u32> for Runtime {
		fn owner(collection: u32, item: u32) -> Option<AccountId> {
			<Nfts as Inspect<AccountId>>::owner(&collection, &item)
		}

		fn collection_owner(collection: u32) -> Option<AccountId> {
			<Nfts as Inspect<AccountId>>::collection_owner(&collection)
		}

		fn attribute(
			collection: u32,
			item: u32,
			key: Vec<u8>,
		) -> Option<Vec<u8>> {
			<Nfts as Inspect<AccountId>>::attribute(&collection, &item, &key)
		}

		fn custom_attribute(
			account: AccountId,
			collection: u32,
			item: u32,
			key: Vec<u8>,
		) -> Option<Vec<u8>> {
			<Nfts as Inspect<AccountId>>::custom_attribute(
				&account,
				&collection,
				&item,
				&key,
			)
		}

		fn system_attribute(
			collection: u32,
			item: u32,
			key: Vec<u8>,
		) -> Option<Vec<u8>> {
			<Nfts as Inspect<AccountId>>::system_attribute(&collection, &item, &key)
		}

		fn collection_attribute(collection: u32, key: Vec<u8>) -> Option<Vec<u8>> {
			<Nfts as Inspect<AccountId>>::collection_attribute(&collection, &key)
		}
	}

	impl sp_api::Core<Block> for Runtime {
		fn version() -> RuntimeVersion {
			VERSION
		}

		fn execute_block(block: Block) {
			Executive::execute_block(block);
		}

		fn initialize_block(header: &<Block as BlockT>::Header) {
			Executive::initialize_block(header)
		}
	}

	impl sp_api::Metadata<Block> for Runtime {
		fn metadata() -> OpaqueMetadata {
			OpaqueMetadata::new(Runtime::metadata().into())
		}
		fn metadata_at_version(version: u32) -> Option<OpaqueMetadata> {
			Runtime::metadata_at_version(version)
		}

		fn metadata_versions() -> sp_std::vec::Vec<u32> {
			Runtime::metadata_versions()
		}
	}

	impl sp_block_builder::BlockBuilder<Block> for Runtime {
		fn apply_extrinsic(extrinsic: <Block as BlockT>::Extrinsic) -> ApplyExtrinsicResult {
			Executive::apply_extrinsic(extrinsic)
		}

		fn finalize_block() -> <Block as BlockT>::Header {
			Executive::finalize_block()
		}

		fn inherent_extrinsics(data: sp_inherents::InherentData) -> Vec<<Block as BlockT>::Extrinsic> {
			data.create_extrinsics()
		}

		fn check_inherents(
			block: Block,
			data: sp_inherents::InherentData,
		) -> sp_inherents::CheckInherentsResult {
			data.check_extrinsics(&block)
		}
	}

	impl sp_transaction_pool::runtime_api::TaggedTransactionQueue<Block> for Runtime {
		fn validate_transaction(
			source: TransactionSource,
			tx: <Block as BlockT>::Extrinsic,
			block_hash: <Block as BlockT>::Hash,
		) -> TransactionValidity {
			Executive::validate_transaction(source, tx, block_hash)
		}
	}

	impl sp_offchain::OffchainWorkerApi<Block> for Runtime {
		fn offchain_worker(header: &<Block as BlockT>::Header) {
			Executive::offchain_worker(header)
		}
	}

	impl sp_consensus_aura::AuraApi<Block, AuraId> for Runtime {
		fn slot_duration() -> sp_consensus_aura::SlotDuration {
			sp_consensus_aura::SlotDuration::from_millis(Aura::slot_duration())
		}

		fn authorities() -> Vec<AuraId> {
			Aura::authorities().into_inner()
		}
	}

	// impl sp_consensus_babe::BabeApi<Block> for Runtime {
	// 	fn configuration() -> sp_consensus_babe::BabeConfiguration {
	// 		// The choice of `c` parameter (where `1 - c` represents the
	// 		// probability of a slot being empty), is done in accordance to the
	// 		// slot duration and expected target block time, for safely
	// 		// resisting network delays of maximum two seconds.
	// 		// <https://research.web3.foundation/en/latest/polkadot/BABE/Babe/#6-practical-results>
	// 		sp_consensus_babe::BabeConfiguration {
	// 			slot_duration: Babe::slot_duration(),
	// 			epoch_length: EpochDuration::get(),
	// 			c: BABE_GENESIS_EPOCH_CONFIG.c,
	// 			authorities: Babe::authorities().to_vec(),
	// 			randomness: Babe::randomness(),
	// 			allowed_slots: BABE_GENESIS_EPOCH_CONFIG.allowed_slots,
	// 		}
	// 	}

	// 	fn current_epoch_start() -> sp_consensus_babe::Slot {
	// 		Babe::current_epoch_start()
	// 	}

	// 	fn current_epoch() -> sp_consensus_babe::Epoch {
	// 		Babe::current_epoch()
	// 	}

	// 	fn next_epoch() -> sp_consensus_babe::Epoch {
	// 		Babe::next_epoch()
	// 	}

	// 	fn generate_key_ownership_proof(
	// 		_slot: sp_consensus_babe::Slot,
	// 		authority_id: sp_consensus_babe::AuthorityId,
	// 	) -> Option<sp_consensus_babe::OpaqueKeyOwnershipProof> {
	// 		use codec::Encode;

	// 		Historical::prove((sp_consensus_babe::KEY_TYPE, authority_id))
	// 			.map(|p| p.encode())
	// 			.map(sp_consensus_babe::OpaqueKeyOwnershipProof::new)
	// 	}

	// 	fn submit_report_equivocation_unsigned_extrinsic(
	// 		equivocation_proof: sp_consensus_babe::EquivocationProof<<Block as BlockT>::Header>,
	// 		key_owner_proof: sp_consensus_babe::OpaqueKeyOwnershipProof,
	// 	) -> Option<()> {
	// 		let key_owner_proof = key_owner_proof.decode()?;

	// 		Babe::submit_unsigned_equivocation_report(
	// 			equivocation_proof,
	// 			key_owner_proof,
	// 		)
	// 	}
	// }

	impl sp_session::SessionKeys<Block> for Runtime {
		fn generate_session_keys(seed: Option<Vec<u8>>) -> Vec<u8> {
			opaque::SessionKeys::generate(seed)
		}

		fn decode_session_keys(
			encoded: Vec<u8>,
		) -> Option<Vec<(Vec<u8>, KeyTypeId)>> {
			opaque::SessionKeys::decode_into_raw_public_keys(&encoded)
		}
	}

	impl sp_consensus_grandpa::GrandpaApi<Block> for Runtime {
		fn grandpa_authorities() -> sp_consensus_grandpa::AuthorityList {
			Grandpa::grandpa_authorities()
		}

		fn current_set_id() -> sp_consensus_grandpa::SetId {
			Grandpa::current_set_id()
		}

		fn submit_report_equivocation_unsigned_extrinsic(
			_equivocation_proof: sp_consensus_grandpa::EquivocationProof<
				<Block as BlockT>::Hash,
				NumberFor<Block>,
			>,
			_key_owner_proof: sp_consensus_grandpa::OpaqueKeyOwnershipProof,
		) -> Option<()> {
			None
		}

		fn generate_key_ownership_proof(
			_set_id: sp_consensus_grandpa::SetId,
			_authority_id: GrandpaId,
		) -> Option<sp_consensus_grandpa::OpaqueKeyOwnershipProof> {
			// NOTE: this is the only implementation possible since we've
			// defined our key owner proof type as a bottom type (i.e. a type
			// with no values).
			None
		}
	}

	impl frame_system_rpc_runtime_api::AccountNonceApi<Block, AccountId, Index> for Runtime {
		fn account_nonce(account: AccountId) -> Index {
			System::account_nonce(account)
		}
	}

	impl pallet_transaction_payment_rpc_runtime_api::TransactionPaymentApi<Block, Balance> for Runtime {
		fn query_info(
			uxt: <Block as BlockT>::Extrinsic,
			len: u32,
		) -> pallet_transaction_payment_rpc_runtime_api::RuntimeDispatchInfo<Balance> {
			TransactionPayment::query_info(uxt, len)
		}
		fn query_fee_details(
			uxt: <Block as BlockT>::Extrinsic,
			len: u32,
		) -> pallet_transaction_payment::FeeDetails<Balance> {
			TransactionPayment::query_fee_details(uxt, len)
		}
		fn query_weight_to_fee(weight: Weight) -> Balance {
			TransactionPayment::weight_to_fee(weight)
		}
		fn query_length_to_fee(length: u32) -> Balance {
			TransactionPayment::length_to_fee(length)
		}
	}

	impl pallet_transaction_payment_rpc_runtime_api::TransactionPaymentCallApi<Block, Balance, RuntimeCall>
		for Runtime
	{
		fn query_call_info(
			call: RuntimeCall,
			len: u32,
		) -> pallet_transaction_payment::RuntimeDispatchInfo<Balance> {
			TransactionPayment::query_call_info(call, len)
		}
		fn query_call_fee_details(
			call: RuntimeCall,
			len: u32,
		) -> pallet_transaction_payment::FeeDetails<Balance> {
			TransactionPayment::query_call_fee_details(call, len)
		}
		fn query_weight_to_fee(weight: Weight) -> Balance {
			TransactionPayment::weight_to_fee(weight)
		}
		fn query_length_to_fee(length: u32) -> Balance {
			TransactionPayment::length_to_fee(length)
		}
	}

	#[cfg(feature = "runtime-benchmarks")]
	impl frame_benchmarking::Benchmark<Block> for Runtime {
		fn benchmark_metadata(extra: bool) -> (
			Vec<frame_benchmarking::BenchmarkList>,
			Vec<frame_support::traits::StorageInfo>,
		) {
			use frame_benchmarking::{baseline, Benchmarking, BenchmarkList};
			use frame_support::traits::StorageInfoTrait;
			use frame_system_benchmarking::Pallet as SystemBench;
			use baseline::Pallet as BaselineBench;

			let mut list = Vec::<BenchmarkList>::new();
			list_benchmarks!(list, extra);

			let storage_info = AllPalletsWithSystem::storage_info();

			(list, storage_info)
		}

		fn dispatch_benchmark(
			config: frame_benchmarking::BenchmarkConfig
		) -> Result<Vec<frame_benchmarking::BenchmarkBatch>, sp_runtime::RuntimeString> {
			use frame_benchmarking::{baseline, Benchmarking, BenchmarkBatch};

			use frame_system_benchmarking::Pallet as SystemBench;
			use baseline::Pallet as BaselineBench;

			impl frame_system_benchmarking::Config for Runtime {}
			impl baseline::Config for Runtime {}

			use frame_support::traits::WhitelistedStorageKeys;
			let whitelist: Vec<TrackedStorageKey> = AllPalletsWithSystem::whitelisted_storage_keys();

			let mut batches = Vec::<BenchmarkBatch>::new();
			let params = (&config, &whitelist);
			add_benchmarks!(params, batches);

			Ok(batches)
		}
	}

	#[cfg(feature = "try-runtime")]
	impl frame_try_runtime::TryRuntime<Block> for Runtime {
		fn on_runtime_upgrade(checks: frame_try_runtime::UpgradeCheckSelect) -> (Weight, Weight) {
			// NOTE: intentional unwrap: we don't want to propagate the error backwards, and want to
			// have a backtrace here. If any of the pre/post migration checks fail, we shall stop
			// right here and right now.
			let weight = Executive::try_runtime_upgrade(checks).unwrap();
			(weight, BlockWeights::get().max_block)
		}

		fn execute_block(
			block: Block,
			state_root_check: bool,
			signature_check: bool,
			select: frame_try_runtime::TryStateSelect
		) -> Weight {
			// NOTE: intentional unwrap: we don't want to propagate the error backwards, and want to
			// have a backtrace here.
			Executive::try_execute_block(block, state_root_check, signature_check, select).expect("execute-block failed")
		}
	}
}

#[cfg(test)]
mod tests {
	use super::*;
	use frame_support::traits::WhitelistedStorageKeys;
	use sp_core::hexdisplay::HexDisplay;
	use std::collections::HashSet;

	#[test]
	fn check_whitelist() {
		let whitelist: HashSet<String> = AllPalletsWithSystem::whitelisted_storage_keys()
			.iter()
			.map(|e| HexDisplay::from(&e.key).to_string())
			.collect();

		// Block Number
		assert!(
			whitelist.contains("26aa394eea5630e07c48ae0c9558cef702a5c1b19ab7a04f536c519aca4983ac")
		);
		// Total Issuance
		assert!(
			whitelist.contains("c2261276cc9d1f8598ea4b6a74b15c2f57c875e4cff74148e4628f264b974c80")
		);
		// Execution Phase
		assert!(
			whitelist.contains("26aa394eea5630e07c48ae0c9558cef7ff553b5a9862a516939d82b3d3d8661a")
		);
		// Event Count
		assert!(
			whitelist.contains("26aa394eea5630e07c48ae0c9558cef70a98fdbe9ce6c55837576c60c7af3850")
		);
		// System Events
		assert!(
			whitelist.contains("26aa394eea5630e07c48ae0c9558cef780d41e5e16056765bc8461851072c9d7")
		);
	}
}
