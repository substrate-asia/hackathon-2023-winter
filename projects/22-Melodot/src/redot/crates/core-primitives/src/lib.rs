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

use codec::{Decode, Encode, MaxEncodedLen, EncodeLike};
pub use frost_ed25519::{Identifier, Signature as DkgSignature, VerifyingKey as DkgVerifyingKey, SigningKey};
pub mod crypto;
use scale_info::{build::Fields, Path, Type, TypeInfo};

#[derive(Clone, PartialEq, Eq, Debug)]
pub struct WrapVerifyingKey(pub DkgVerifyingKey);

impl MaxEncodedLen for WrapVerifyingKey {
    fn max_encoded_len() -> usize {
        32
    }
}

impl TypeInfo for WrapVerifyingKey {
    type Identity = Self;

    fn type_info() -> Type {
        Type::builder()
            .path(Path::new("DkgVerifyingKey", module_path!()))
            .composite(Fields::unit())
    }
}

impl Encode for WrapVerifyingKey {
    fn encode_to<T: codec::Output + ?Sized>(&self, dest: &mut T) {
        let serialized = self.0.serialize();
        dest.write(&serialized);
    }
}

impl Decode for WrapVerifyingKey {
    fn decode<I: codec::Input>(input: &mut I) -> Result<Self, codec::Error> {
        let bytes: Vec<u8> = Vec::decode(input)?;
        let fixed_bytes: [u8; 32] = bytes
            .try_into()
            .map_err(|_| codec::Error::from("Length mismatch when decoding VerifyingKey"))?;
        
			DkgVerifyingKey::deserialize(fixed_bytes)
            .map(WrapVerifyingKey) // Wrap the VerifyingKey in DkgVerifyingKey
            .map_err(|_| codec::Error::from("Error decoding DkgVerifyingKey"))
    }
}

impl EncodeLike for WrapVerifyingKey {}

sp_api::decl_runtime_apis! {
	pub trait GetValidatorsFromRuntime<ValidatorId>
	where
		ValidatorId: codec::Codec + PartialEq + Eq + Clone + Ord + PartialOrd + TypeInfo,
	{
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
