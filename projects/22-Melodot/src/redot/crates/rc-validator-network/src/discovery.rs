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

//! 验证人发现机制
use crate::KademliaKey;
use anyhow::{anyhow, Result};
use codec::{Decode, Encode};
use cumulus_primitives_core::relay_chain::ValidatorId;
use libp2p::{multiaddr::Protocol, multihash::MultihashDigest, Multiaddr, PeerId};
use sp_authority_discovery::{AuthorityId, AuthorityPair, AuthoritySignature};
use sp_core::crypto::{key_types, ByteArray, Pair};
use sp_keystore::Keystore;
use std::collections::{HashMap, HashSet};

#[derive(Clone, Debug, PartialEq, Eq, Encode, Decode)]
pub struct SignedValidatorRecord {
	pub record: Vec<Vec<u8>>,
	pub validator_id: ValidatorId,
	pub auth_signature: Vec<u8>,
}

impl SignedValidatorRecord {
	pub fn key(validator_id: &ValidatorId) -> KademliaKey {
		KademliaKey::new(&libp2p::multihash::Code::Sha2_256.digest(validator_id.as_ref()).digest())
	}

	pub fn verify_signature(&self) -> bool {
		let signature = AuthoritySignature::decode(&mut self.auth_signature.as_slice())
			.expect("Decode signature failed");
		let public_key = AuthorityId::from_slice(self.validator_id.as_slice())
			.expect("Decode public key failed");

		let message = self.record.iter().flat_map(|v| v.iter()).cloned().collect::<Vec<u8>>();

		AuthorityPair::verify(&signature, &message, &public_key)
	}

	pub fn sign_record(
		key_store: &dyn Keystore,
		serialized_record: Vec<Vec<u8>>,
	) -> Result<Vec<(Self, Vec<u8>)>> {
		let keys = key_store.sr25519_public_keys(key_types::AUTHORITY_DISCOVERY);

		let mut signed_records = Vec::new();

		for key in keys {
			let message =
				serialized_record.iter().flat_map(|v| v.iter()).cloned().collect::<Vec<u8>>();

			let auth_signature = key_store
				.sr25519_sign(key_types::AUTHORITY_DISCOVERY, &key, &message)
				.map_err(|e| anyhow!(e).context(format!("Error signing with key: {:?}", key)))?
				.ok_or_else(|| anyhow!("Could not find key in keystore. Key: {:?}", key))?;

			let auth_signature = auth_signature.encode();

			let signed_record = SignedValidatorRecord {
				record: serialized_record.clone(),
				validator_id: key.clone().into(),
				auth_signature,
			};

			signed_records.push((signed_record, Self::key(&key.into()).as_ref().into()))
		}

		Ok(signed_records)
	}
}

#[derive(Clone, Debug)]
pub struct AddrCache {
	authority_id_to_addresses: HashMap<ValidatorId, HashSet<Multiaddr>>,
	peer_id_to_authority_ids: HashMap<PeerId, HashSet<ValidatorId>>,
}

impl AddrCache {
	pub fn new() -> Self {
		AddrCache {
			authority_id_to_addresses: HashMap::new(),
			peer_id_to_authority_ids: HashMap::new(),
		}
	}

	pub fn add_validator(&mut self, validator_id: ValidatorId, addresses: Vec<Multiaddr>) {
		let addresses_set = addresses.into_iter().collect::<HashSet<_>>();

		let new_peer_ids = addresses_to_peer_ids(&addresses_set);

		let old_peer_ids = self
			.authority_id_to_addresses
			.get(&validator_id)
			.map(|addresses| addresses_to_peer_ids(addresses))
			.unwrap_or_default();

		self.authority_id_to_addresses.insert(validator_id.clone(), addresses_set);

		for peer_id in new_peer_ids {
			if !old_peer_ids.contains(&peer_id) {
				self.peer_id_to_authority_ids
					.entry(peer_id)
					.or_default()
					.insert(validator_id.clone());
			}
		}
	}

	pub fn validator_addresses(&self, validator_id: &ValidatorId) -> Option<HashSet<PeerId>> {
		match self.authority_id_to_addresses.get(validator_id) {
			Some(addresses) => Some(addresses_to_peer_ids(addresses)),
			None => None,
		}
	}
}

fn peer_id_from_multiaddr(addr: &Multiaddr) -> Option<PeerId> {
	addr.iter().last().and_then(|protocol| {
		if let Protocol::P2p(multihash) = protocol {
			PeerId::from_multihash(multihash).ok()
		} else {
			None
		}
	})
}

fn addresses_to_peer_ids(addresses: &HashSet<Multiaddr>) -> HashSet<PeerId> {
	addresses.iter().filter_map(peer_id_from_multiaddr).collect::<HashSet<_>>()
}
