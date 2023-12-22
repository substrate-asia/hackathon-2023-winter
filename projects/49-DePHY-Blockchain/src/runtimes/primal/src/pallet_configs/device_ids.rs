// This file is part of DePHY Network.

// Copyright (C) Jun Jiang.
// SPDX-License-Identifier: AGPL-3.0-only

// Dephy Blockchain is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Dephy Blockchain is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with Dephy Blockchain.  If not, see <http://www.gnu.org/licenses/>.

use crate::*;
use frame_support::{
	parameter_types,
	traits::{AsEnsureOriginWithArg, ConstU32}
};
use frame_system::{EnsureRoot, EnsureSigned};


parameter_types! {
	pub const ProductEntryDeposit: Balance = 100 * DOLLARS;
	pub const DeviceEntryDeposit: Balance = 1 * DOLLARS;
	pub const DeviceAttributesApprovalsLimit: u32 = 20;
	pub const StringLimit: u32 = 50;
	pub const MetadataDepositBase: Balance = 10 * DOLLARS;
	pub const MetadataDepositPerByte: Balance = 1 * DOLLARS;
}

impl pallet_device_ids::Config for Runtime {
	type RuntimeEvent = RuntimeEvent;
	type ProductId = u32;
	type DeviceId = u32;
	type Currency = Balances;
	type ForceOrigin = EnsureRoot<AccountId>;
	type CreateOrigin = AsEnsureOriginWithArg<EnsureSigned<AccountId>>;
	type Locker = ();
	type ProductEntryDeposit = ProductEntryDeposit;
	type DeviceEntryDeposit = DeviceEntryDeposit;
	type MetadataDepositBase = MetadataDepositBase;
	type AttributeDepositBase = MetadataDepositBase;
	type DepositPerByte = MetadataDepositPerByte;
	type StringLimit = ConstU32<256>;
	type KeyLimit = ConstU32<64>;
	type ValueLimit = ConstU32<256>;
	type DeviceAttributesApprovalsLimit = DeviceAttributesApprovalsLimit;
	type MaxAttributesPerCall = ConstU32<10>;
	type OffchainSignature = Signature;
	type OffchainPublic = <Signature as traits::Verify>::Signer;
	#[cfg(feature = "runtime-benchmarks")]
	type Helper = ();
	type WeightInfo = pallet_device_ids::weights::SubstrateWeight<Runtime>;
}