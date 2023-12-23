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

use anyhow::{Ok, Result};
use futures::channel::mpsc;
use libp2p::{
	core::{
		muxing::StreamMuxerBox,
		transport::{self},
		upgrade::Version,
		PeerId,
	},
	dns::TokioDnsConfig,
	gossipsub::IdentTopic,
	identify::Config as IdentifyConfig,
	identity,
	identity::Keypair,
	kad::{store::MemoryStore, KademliaConfig},
	noise::NoiseAuthenticated,
	swarm::SwarmBuilder,
	tcp::{tokio::Transport as TokioTcpTransport, Config as GenTcpConfig},
	yamux::YamuxConfig,
	Transport,
};

pub(crate) use libp2p::kad::record::Key as KademliaKey;

pub use log::warn;
pub use std::sync::Arc;

use std::time::Duration;

pub use behaviour::{Behavior, BehaviorConfig, BehaviourEvent};
pub use service::{Service, ValidatorNetworkConfig};
pub use shared::Command;
pub use worker::ValidatorNetwork;

pub(crate) use discovery::AddrCache;
pub(crate) use shared::CreatedSubscription;

mod behaviour;
mod discovery;
mod service;
mod shared;
mod worker;

const SWARM_MAX_NEGOTIATING_INBOUND_STREAMS: usize = 5000;
pub const REDOT_NETWORK_VERSION: &str = "0.0.1";

/// Creates a new [`ValidatorNetwork`] instance.
/// The [`ValidatorNetwork`] instance is composed of a [`Service`] and a [`Worker`].
pub fn create(
	keypair: identity::Keypair,
	protocol_version: String,
	prometheus_registry: Option<prometheus_endpoint::Registry>,
	config: ValidatorNetworkConfig,
) -> Result<(service::Service, worker::ValidatorNetwork)> {
	let local_peer_id = PeerId::from(keypair.public());

	let protocol_version = format!("/redot-validator-network/{}", protocol_version);
	let identify = IdentifyConfig::new(protocol_version.clone(), keypair.public());

	let transport = build_transport(&keypair, true)?;

	let behaviour = Behavior::new(BehaviorConfig {
		peer_id: local_peer_id,
		identify,
		kademlia: KademliaConfig::default(),
		kad_store: MemoryStore::new(local_peer_id),
	})?;

	let mut swarm = SwarmBuilder::with_tokio_executor(transport, behaviour, local_peer_id)
		.max_negotiating_inbound_streams(SWARM_MAX_NEGOTIATING_INBOUND_STREAMS)
		.build();

	let topic = IdentTopic::new("some-topic");

	swarm
		.behaviour_mut()
		.gossipsub
		.subscribe(&topic)
		.expect("topic subscription failed");

	let (to_worker, from_service) = mpsc::channel(8);

	Ok((
		service::Service::new(to_worker),
		worker::ValidatorNetwork::new(swarm, from_service, prometheus_registry, &config),
	))
}

/// Creates a new [`ValidatorNetwork`] instance with default configuration.
pub fn default(
	config: Option<ValidatorNetworkConfig>,
	keypair: Option<identity::Keypair>,
) -> Result<(service::Service, worker::ValidatorNetwork)> {
	let keypair = match keypair {
		Some(keypair) => keypair,
		None => identity::Keypair::generate_ed25519(),
	};

	let config = match config {
		Some(config) => config,
		None => ValidatorNetworkConfig::default(),
	};

	let metric_registry = prometheus_endpoint::Registry::default();

	create(keypair, REDOT_NETWORK_VERSION.to_string(), Some(metric_registry), config)
}

fn build_transport(
	key_pair: &Keypair,
	port_reuse: bool,
) -> Result<transport::Boxed<(PeerId, StreamMuxerBox)>> {
	let noise = NoiseAuthenticated::xx(key_pair).unwrap();
	let dns_tcp = TokioDnsConfig::system(TokioTcpTransport::new(
		GenTcpConfig::new().nodelay(true).port_reuse(port_reuse),
	))?;

	Ok(dns_tcp
		.upgrade(Version::V1)
		.authenticate(noise)
		.multiplex(YamuxConfig::default())
		.timeout(Duration::from_secs(20))
		.boxed())
}
