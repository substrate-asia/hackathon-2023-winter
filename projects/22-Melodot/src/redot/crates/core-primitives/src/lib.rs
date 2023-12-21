// Copyright 2023 ZeroDAO
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode, MaxEncodedLen};
pub use frost_ed25519::{Identifier, Signature as DkgSignature, VerifyingKey as DkgVerifyingKey};
pub mod crypto;
// use cumulus_primitives_core::relay_chain::ValidatorId;
use scale_info::TypeInfo;

sp_api::decl_runtime_apis! {
	pub trait GetValidatorsFromRuntime
	{
		type ValidatorId;
		
		fn validators() -> Vec<ValidatorId>;
		fn is_validator(validator_id: ValidatorId) -> bool;
		fn validator_count() -> u32;
	}
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, MaxEncodedLen, TypeInfo)]
pub enum AuthorityStatus {
	/// The authority is enabled.
	Enabled,
	/// The authority is removed.
	Block,
}

impl Default for AuthorityStatus {
	fn default() -> Self {
		AuthorityStatus::Enabled
	}
}
