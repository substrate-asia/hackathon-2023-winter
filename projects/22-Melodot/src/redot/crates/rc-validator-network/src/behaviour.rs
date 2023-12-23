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
use derive_more::From;
use libp2p::{
	core::PeerId,
	gossipsub::{
		Gossipsub,
		GossipsubConfig,
		GossipsubEvent,
		MessageAuthenticity,
		// IdentTopic
	},
	identify::{Behaviour as Identify, Config as IdentifyConfig, Event as IdentifyEvent},
	kad::{store::MemoryStore, Kademlia, KademliaConfig, KademliaEvent},
	mdns::{tokio::Behaviour as TokioMdns, Config as MdnsConfig, Event as MdnsEvent},
	ping::{Behaviour as Ping, Event as PingEvent},
	swarm::NetworkBehaviour,
};

pub struct BehaviorConfig {
	/// Identity keypair of a node used for authenticated connections.
	pub peer_id: PeerId,
	/// The configuration for the [`Identify`] behaviour.
	pub identify: IdentifyConfig,
	/// The configuration for the [`Kademlia`] behaviour.
	pub kademlia: KademliaConfig,
	/// The configuration for the [`kad_store`] behaviour.
	pub kad_store: MemoryStore,
}

/// The [`NetworkBehaviour`] of the Validator Network.
#[derive(NetworkBehaviour)]
#[behaviour(out_event = "BehaviourEvent")]
#[behaviour(event_process = false)]
pub struct Behavior {
	/// The [`Kademlia`] behaviour.
	pub kademlia: Kademlia<MemoryStore>,
	/// The [`Identify`] behaviour.
	pub identify: Identify,
	/// The [`Ping`] behaviour.
	pub ping: Ping,
	/// The [`Mdns`] behaviour.
	pub mdns: TokioMdns,
	/// The [`Gossipsub`] behaviour.
	pub gossipsub: Gossipsub,
}

impl Behavior {
	/// Creates a new [`Behavior`] instance.
	pub fn new(config: BehaviorConfig) -> Result<Self> {
		let mdns = TokioMdns::new(MdnsConfig::default())?;

		let kademlia = Kademlia::with_config(config.peer_id, config.kad_store, config.kademlia);

		let gossipsub_config = GossipsubConfig::default();
		let gossipsub =
			Gossipsub::new(MessageAuthenticity::Author(config.peer_id), gossipsub_config)
				.expect("Correct Gossipsub configuration");

		Ok(Self {
			identify: Identify::new(config.identify),
			mdns,
			ping: Ping::default(),
			kademlia,
			gossipsub,
		})
	}
}

#[derive(Debug, From)]
pub enum BehaviourEvent {
	Identify(IdentifyEvent),
	Kademlia(KademliaEvent),
	Ping(PingEvent),
	Mdns(MdnsEvent),
	Gossipsub(GossipsubEvent),
}
