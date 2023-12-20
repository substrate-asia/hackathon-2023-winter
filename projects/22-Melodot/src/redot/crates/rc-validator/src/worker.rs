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

use anyhow::Result;
use futures::StreamExt;
use log::error;
use rc_validator_network::{Arc, Service as ValidatorNetworkService};
use redot_core_primitives::crypto::{DkgMessage, FrostDkg, SignMessage};
use serde::Serialize;

pub struct Worker {
	network: Arc<ValidatorNetworkService>,
	frost_dkg: FrostDkg,
}

const DKG_TOPIC: &str = "dkg_topic";
const SIGN_TOPIC: &str = "sign_topic";

impl Worker {
	pub async fn run(&mut self) -> Result<()> {
		let mut dkg_receiver = self.network.subscribe(DKG_TOPIC).await?.receiver;
		let mut sign_receiver = self.network.subscribe(SIGN_TOPIC).await?.receiver;

		loop {
			futures::select! {
				dkg_message = dkg_receiver.select_next_some() => {
					self.handle_dkg_message(dkg_message.into()).await;
				},
				sign_message = sign_receiver.select_next_some() => {
					self.handle_sign_message(sign_message.into()).await;
				},
			}
		}
	}

	async fn handle_dkg_message(&mut self, message: Vec<u8>) {
		match serde_json::from_slice::<DkgMessage>(&message) {
			Ok(message) => match message {
				DkgMessage::DkgPart1(dkg_part1_message) => {
					match self.frost_dkg.dkg_part1(dkg_part1_message) {
						Ok(msg) => {
							if let Err(e) = self.serialize_and_publish(DKG_TOPIC, &msg).await {
								error!("Failed to publish DKG Part1 message: {}", e);
							}
						},
						Err(e) => error!("Error in DKG Part1 processing: {}", e),
					}
				},
				DkgMessage::DkgPart2(dkg_part2_message) => {
					if let Err(e) = self.frost_dkg.dkg_part2(dkg_part2_message) {
						error!("Error in DKG Part2 processing: {}", e);
					}
				},
			},
			Err(e) => error!("Failed to deserialize DKG message: {}", e),
		}
	}

	async fn handle_sign_message(&mut self, message: Vec<u8>) {
		match serde_json::from_slice::<SignMessage>(&message) {
			Ok(message) => {
				match message {
					SignMessage::SignPart1(sign_part1_message) => {
						match self.frost_dkg.sign_part1(sign_part1_message.clone()) {
							Ok(msg) => {
								if let Err(e) = self.serialize_and_publish(SIGN_TOPIC, &msg).await {
									error!("Failed to publish Sign Part1 message: {}", e);
								}
							},
							Err(e) => error!("Error in Sign Part1 processing: {}", e),
						}

						let message = SignMessage::SignPart1(sign_part1_message);

						if let Err(e) = self.serialize_and_publish(SIGN_TOPIC, &message).await {
							error!("Failed to publish Sign Part1 message: {}", e);
						}
					},
					SignMessage::SignPart2(sign_part2_message) => {
						match self.frost_dkg.sign_part2(sign_part2_message.clone()) {
							Ok(signature) => {
								// Process the aggregated signature
							},
							Err(e) => error!("Error in Sign Part2 processing: {}", e),
						}
					},
				}
			},
			Err(e) => error!("Failed to deserialize SignMessage: {}", e),
		}
	}

	async fn start_dkg(&mut self) {
		match self.frost_dkg.start_dkg() {
			Ok(msg) => {
				if let Err(e) = self.serialize_and_publish(DKG_TOPIC, &msg).await {
					error!("Failed to publish DKG Part1 message: {}", e);
				}
			},
			Err(e) => error!("Error in DKG Part1 processing: {}", e),
		}
	}

	async fn start_sign(&mut self) {
		match self.frost_dkg.start_sign() {
			Ok(msg) => {
				if let Err(e) = self.serialize_and_publish(SIGN_TOPIC, &msg).await {
					error!("Failed to publish Sign Part1 message: {}", e);
				}
			},
			Err(e) => error!("Error in Sign Part1 processing: {}", e),
		}
	}

	async fn serialize_and_publish<T: Serialize>(&self, topic: &str, message: &T) -> Result<()> {
		match serde_json::to_vec(message) {
			Ok(encoded_msg) => self.network.publish(topic, encoded_msg).await.map_err(Into::into),
			Err(e) => {
				error!("Failed to serialize message: {}", e);
				Err(e.into())
			},
		}
	}
}
