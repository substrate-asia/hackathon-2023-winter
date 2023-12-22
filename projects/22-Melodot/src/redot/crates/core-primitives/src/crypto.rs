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

use crate::DkgVerifyingKey;
use anyhow::{anyhow, Context, Ok, Result};
use frost::keys::dkg::round1::{Package as Round1Package, SecretPackage as Round1Secret};
use frost::keys::dkg::round2::{Package as Round2Package, SecretPackage as Round2Secret};
use frost::round1::{SigningCommitments, SigningNonces};
use frost::round2::SignatureShare;
use frost_ed25519::{self as frost, Identifier};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Serialize, Deserialize, Clone)]
pub enum DkgMessage {
	DkgPart1(DkgPart1Message),
	DkgPart2(DkgPart2Message),
}

#[derive(Serialize, Deserialize, Clone)]
pub enum SignMessage {
	SignPart1(SignPart1Message),
	SignPart2(SignPart2Message),
}

#[derive(Serialize, Deserialize, Clone)]
pub struct DkgPart1Message {
	pub id: Identifier,
	pub part2: Round1Package,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct DkgPart2Message {
	pub id: Identifier,
	pub part2: BTreeMap<Identifier, Round2Package>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SignPart1Message {
	pub id: Identifier,
	pub part1: SigningCommitments,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SignPart2Message {
	pub id: Identifier,
	pub part2: SignatureShare,
}

pub struct DkgKeypair {
	pub key: frost::keys::KeyPackage,
	pub public: frost::keys::PublicKeyPackage,
}

pub struct FrostDkg {
	dkg_keypair: Option<DkgKeypair>,
	round2_packages: BTreeMap<Identifier, Round2Package>,
	// TODO: Add coordinator support
	#[allow(dead_code)]
	is_coordinator: bool,
	round1_secret: Option<Round1Secret>,
	round1_package: Option<Round1Package>,
	round1_packages: BTreeMap<Identifier, Round1Package>,
	round2_secret: Option<Round2Secret>,
	t: u16,
	n: u16,
	signing_commitments: BTreeMap<Identifier, SigningCommitments>,
	sign_round1_nonce: Option<SigningNonces>,
	signing_package: Option<frost::SigningPackage>,
	sign_round2_signature_shares: BTreeMap<Identifier, SignatureShare>,
	sign_message: Vec<u8>,
	id: Identifier,
}

impl FrostDkg {

	pub fn new(id: Identifier) -> Self {
		Self {
			dkg_keypair: None,
			round2_packages: BTreeMap::new(),
			is_coordinator: false,
			round1_secret: None,
			round1_package: None,
			round1_packages: BTreeMap::new(),
			round2_secret: None,
			t: 0,
			n: 0,
			signing_commitments: BTreeMap::new(),
			sign_round1_nonce: None,
			signing_package: None,
			sign_round2_signature_shares: BTreeMap::new(),
			sign_message: vec![],
			id,
		}
	}

	pub fn set_nt(&mut self, n: u16, t: u16) -> Result<()> {
		if n < t {
			return Err(anyhow!("n must be greater than t"));
		}
		self.n = n;
		self.t = t;
		Ok(())
	}

	pub fn start_sign(&mut self, msg: &[u8]) -> Result<SignMessage> {
		if let Some(dkg_keypair) = &self.dkg_keypair {
			self.sign_message = msg.to_vec();
			let (nonce, commitment) =
				frost::round1::commit(&dkg_keypair.key.signing_share(), &mut rand::rngs::OsRng);

			self.sign_round1_nonce = Some(nonce);

			self.signing_commitments.insert(self.id, commitment.clone());

			let message =
				SignMessage::SignPart1(SignPart1Message { id: self.id, part1: commitment });
			Ok(message)
		} else {
			Err(anyhow!("DKG keypair not initialized"))
		}
	}

	pub fn start_dkg(&mut self) -> Result<DkgMessage> {
		let (round1_secret, round1_package) =
			frost::keys::dkg::part1(self.id, self.n, self.t, &mut rand::rngs::OsRng)
				.context("Failed to generate DKG Part1 data")?;

		self.round1_secret = Some(round1_secret);
		self.round1_package = Some(round1_package.clone());

		Ok(DkgMessage::DkgPart1(DkgPart1Message { id: self.id, part2: round1_package }))
	}

	pub fn sign_part2(
		&mut self,
		sign_part2_message: SignPart2Message,
	) -> Result<Option<frost::Signature>> {
		self.sign_round2_signature_shares
			.insert(sign_part2_message.id, sign_part2_message.part2);

		if self.sign_round2_signature_shares.len() == self.n as usize {
			if let (Some(signing_package), Some(dkg_keypair)) =
				(&self.signing_package, &self.dkg_keypair)
			{
				let sign = frost::aggregate(
					&signing_package,
					&self.sign_round2_signature_shares,
					&dkg_keypair.public,
				)?;
				return Ok(Some(sign));
			} else {
				return Err(anyhow!("Signing package or DKG keypair not initialized"));
			}
		}
		Ok(None)
	}

	pub fn sign_part1(
		&mut self,
		sign_part1_message: SignPart1Message,
	) -> Result<Option<SignMessage>> {
		self.signing_commitments.insert(sign_part1_message.id, sign_part1_message.part1);

		if self.signing_commitments.len() == self.n as usize {
			if let Some(nonce) = self.sign_round1_nonce.clone() {
				let signing_package = frost::SigningPackage::new(
					self.signing_commitments.clone(),
					self.sign_message.as_slice(),
				);

				self.signing_package = Some(signing_package.clone());

				if let Some(dkg_keypair) = &self.dkg_keypair {
					let share = frost::round2::sign(&signing_package, &nonce, &dkg_keypair.key)
						.context("Failed to sign in SignPart1")?;

					self.sign_round2_signature_shares.insert(self.id, share);

					return Ok(Some(SignMessage::SignPart2(SignPart2Message {
						id: self.id,
						part2: share,
					})));
				} else {
					return Err(anyhow!("DKG keypair not initialized"));
				}
			} else {
				return Err(anyhow!("No nonce available for signing"));
			}
		}
		Ok(None)
	}

	pub fn dkg_part2(&mut self, dkg_part2_message: DkgPart2Message) -> Result<Option<DkgVerifyingKey>> {
		if let Some(round2_secret) = &self.round2_secret {
			let my_package = dkg_part2_message.part2.get(&self.id);

			if let Some(my_package) = my_package {
				self.round2_packages.insert(dkg_part2_message.id, my_package.clone());
			} else {
				return Err(anyhow!("Missing own package in DKG Part2 processing"));
			}

			if self.round2_packages.len() + 1 == self.n as usize {
				let (key_package, public_key_package) = frost::keys::dkg::part3(
					round2_secret,
					&self.round1_packages,
					&self.round2_packages,
				)?;

				self.dkg_keypair =
					Some(DkgKeypair { key: key_package, public: public_key_package.clone() });

				return Ok(Some(public_key_package.verifying_key().clone()));
			}

			Ok(None)
		} else {
			Err(anyhow!("Missing secrets for DKG Part2 processing"))
		}
	}

	pub fn dkg_part1(&mut self, dkg_part1_message: DkgPart1Message) -> Result<Option<DkgMessage>> {
		if dkg_part1_message.id == self.id {
			return Ok(None);
		}

		self.round1_packages.insert(dkg_part1_message.id, dkg_part1_message.part2);

		if self.round1_packages.len() + 1 == self.n as usize {
			if let Some(round1_secret) = &self.round1_secret {
				let (secret, packages) =
					frost::keys::dkg::part2(round1_secret.clone(), &self.round1_packages)
						.context("Error in DKG Part2 processing")?;

				self.round1_secret = None;

				self.round2_secret = Some(secret);

				let message =
					DkgMessage::DkgPart2(DkgPart2Message { id: self.id, part2: packages.clone() });

				return Ok(Some(message));
			} else {
				return Err(anyhow!("No Round1 secret available for DKG Part1 processing"));
			}
		}
		Ok(None)
	}
}

#[cfg(test)]
mod tests {
	use super::*;
	use std::collections::HashMap;

	// Helper function to create a FrostDkg instance
	fn create_frost_dkg(id: Identifier, t: u16, n: u16) -> FrostDkg {
		FrostDkg {
			dkg_keypair: None,
			round2_packages: BTreeMap::new(),
			is_coordinator: false,
			round1_secret: None,
			round1_package: None,
			round1_packages: BTreeMap::new(),
			round2_secret: None,
			t,
			n,
			signing_commitments: BTreeMap::new(),
			sign_round1_nonce: None,
			signing_package: None,
			sign_round2_signature_shares: BTreeMap::new(),
			sign_message: vec![],
			id,
		}
	}

	#[test]
	fn full_dkg_and_signing_process() -> Result<()> {
		const T: u16 = 2;
		const N: u16 = 3;
		let ids = generate_identifiers(N);

		// Initialize FrostDkg instances for each participant
		let mut participants: HashMap<Identifier, FrostDkg> =
			ids.iter().map(|&id| (id, create_frost_dkg(id, T, N))).collect();

		// Step 1: Run DKG Part 1
		let mut dkg_part1_messages = Vec::new();
		for id in ids.iter() {
			let dkg_message = participants.get_mut(id).unwrap().start_dkg()?;
			dkg_part1_messages.push((id, dkg_message));
		}

		let mut dkg_part2_messages = Vec::new();
		for (id, dkg_message) in &dkg_part1_messages {
			if let DkgMessage::DkgPart1(msg) = dkg_message {
				for &other_id in ids.iter() {
					if **id != other_id {
						if let Some(dkg_part2_message) =
							participants.get_mut(&other_id).unwrap().dkg_part1(msg.clone()).unwrap()
						{
							dkg_part2_messages.push((other_id, dkg_part2_message))
						}
					}
				}
			}
		}

		// 检查 round2_secret 是否为 Some
		for id in ids.iter() {
			let participant = participants.get_mut(id).unwrap();
			assert!(participant.round2_secret.is_some());
		}

		// 向其他用户发送 round2_package
		for (id, dkg_part2_message) in &dkg_part2_messages {
			if let DkgMessage::DkgPart2(msg) = dkg_part2_message {
				for &other_id in ids.iter() {
					if *id != other_id {
						participants.get_mut(&other_id).unwrap().dkg_part2(msg.clone()).unwrap();
					}
				}
			}
		}

		// 检查 dkg_keypair 是否为 Some
		for id in ids.iter() {
			let participant = participants.get_mut(id).unwrap();
			assert!(participant.dkg_keypair.is_some());
		}

		// Step 3: Start signing process
		let sign_message = b"Test message".to_vec();
		let mut messages_to_send = Vec::new();
		for participant in participants.values_mut() {
			let sign_msg = participant.start_sign(sign_message.as_slice()).unwrap();

			if let SignMessage::SignPart1(msg) = sign_msg {
				messages_to_send.push((participant.id, msg));
			}
		}

		let mut to_send = Vec::new();
		for (id, msg) in messages_to_send {
			for other_id in ids.iter() {
				if id != *other_id {
					if let Some(msg) =
						participants.get_mut(&other_id).unwrap().sign_part1(msg.clone())?
					{
						if let SignMessage::SignPart2(m) = msg {
							to_send.push((other_id, m));
						}
					}
				}
			}
		}

		// 检查 sign_round1_nonce 是否为 Some
		let mut sing_vec = Vec::new();
		for (id, msg) in to_send {
			for other_id in ids.iter() {
				if id != other_id {
					if let Some(sign) =
						participants.get_mut(&other_id).unwrap().sign_part2(msg.clone())?
					{
						sing_vec.push(sign);
					}
				}
			}
		}

		assert!(sing_vec.len() == ids.len());

		let public_key_package =
			participants.get(&ids[0]).unwrap().dkg_keypair.as_ref().unwrap().public.clone();

		// 实际上我们不需要验证，因为 Frost 已经验证过了
		for sign in sing_vec {
			let res = public_key_package.verifying_key().verify(sign_message.as_slice(), &sign);
			assert!(res.is_ok());
		}

		Ok(())
	}

	// Helper function to generate identifiers
	fn generate_identifiers(n: u16) -> Vec<Identifier> {
		(0..n).map(|id| Identifier::derive(&id.to_le_bytes()).unwrap()).collect()
	}
}
