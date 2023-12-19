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
use crate::{Behavior, BehaviourEvent, Command, ValidatorNetworkConfig};
use futures::{
	channel::{mpsc, oneshot},
	stream::StreamExt,
};
use libp2p::{
	identify::Event as IdentifyEvent,
	kad::{
		store::RecordStore, BootstrapOk, GetRecordOk, InboundRequest, KademliaEvent, PutRecordOk,
		QueryId, QueryResult, Record,
	},
	mdns::Event as MdnsEvent,
	multiaddr::Protocol,
	swarm::{ConnectionError, Swarm, SwarmEvent},
	Multiaddr, PeerId,
};
use log::{debug, error, info, trace, warn};
use prometheus_endpoint::{register, Counter, CounterVec, Gauge, Opts, U64};
use std::{collections::HashMap, fmt::Debug};

/// The maximum number of connection retries.
const MAX_RETRIES: u8 = 3;

const LOG_TARGET: &str = "validator-network-worker";

enum QueryResultSender {
	PutRecord(oneshot::Sender<Result<(), anyhow::Error>>),
	GetRecord(oneshot::Sender<Result<Vec<Record>, anyhow::Error>>),
	Bootstrap(oneshot::Sender<Result<(), anyhow::Error>>),
}

macro_rules! handle_send {
	($sender_variant:ident, $msg:expr, $result:expr) => {
		if let Some(QueryResultSender::$sender_variant(ch)) = $msg {
			if ch.send($result).is_err() {
				debug!("Failed to send result");
			}
		}
	};
}

/// Represents a validator network worker that manages a swarm of peers and handles incoming commands.
pub struct ValidatorNetwork {
	swarm: Swarm<Behavior>,
	command_receiver: mpsc::Receiver<Command>,
	output_senders: Vec<mpsc::Sender<BehaviourEvent>>,
	query_id_receivers: HashMap<QueryId, QueryResultSender>,
	pending_routing: HashMap<PeerId, QueryResultSender>,
	retry_counts: HashMap<PeerId, u8>,
	metrics: Option<Metrics>,
	known_addresses: HashMap<PeerId, Vec<String>>,
}

impl ValidatorNetwork {
	/// Creates a new worker with the given `swarm`, `command_receiver`, `prometheus_registry`, and
	/// `config`. The `swarm` is a `Swarm` instance of the `Behavior` type.
	/// The `command_receiver` is an `mpsc::Receiver` instance of the `Command` type.
	/// The `prometheus_registry` is an optional `prometheus_endpoint::Registry` instance.
	/// The `config` is a reference to a `ValidatorNetworkConfig` instance.
	pub fn new(
		swarm: Swarm<Behavior>,
		command_receiver: mpsc::Receiver<Command>,
		prometheus_registry: Option<prometheus_endpoint::Registry>,
		config: &ValidatorNetworkConfig,
	) -> Self {
		let mut swarm = swarm;
		let mut known_addresses = HashMap::new();

		// Add bootstrap node addresses to the swarm and known_addresses
		for addr in &config.bootstrap_nodes {
			if let Ok(multiaddr) = addr.parse::<Multiaddr>() {
				if let Some(peer_id) = multiaddr.iter().find_map(|p| {
					if let Protocol::P2p(hash) = p {
						PeerId::from_multihash(hash).ok()
					} else {
						None
					}
				}) {
					swarm.behaviour_mut().kademlia.add_address(&peer_id, multiaddr.clone());
					known_addresses.entry(peer_id).or_insert_with(Vec::new).push(addr.clone());
				} else {
					warn!("Bootstrap node address does not contain a Peer ID: {}", addr);
				}
			} else {
				warn!("Invalid multiaddr for bootstrap node: {}", addr);
			}
		}

		// Start listening on the specified address and port from config
		let listen_addr = format!("/ip4/{}/tcp/{}", config.listen_addr, config.listen_port);

		if let Err(e) = Swarm::listen_on(&mut swarm, listen_addr.parse().unwrap()) {
			error!("Error starting to listen on {}: {}", listen_addr, e);
		}

		let metrics = match prometheus_registry.as_ref().map(Metrics::register) {
			Some(Ok(metrics)) => Some(metrics),
			Some(Err(e)) => {
				debug!(target: LOG_TARGET, "Failed to register metrics: {:?}", e);
				None
			},
			None => None,
		};

		Self {
			swarm,
			command_receiver,
			output_senders: Vec::new(),
			query_id_receivers: HashMap::default(),
			pending_routing: HashMap::default(),
			retry_counts: HashMap::default(),
			metrics,
			known_addresses,
		}
	}

	/// Runs the worker asynchronously.
	/// If there are known addresses, it adds them to the Kademlia routing table and initiates a
	/// bootstrap process. The worker then enters an event loop, handling incoming swarm events and
	/// commands.
	pub async fn run(mut self) {
		if !self.known_addresses.is_empty() {
			for (peer_id, addrs) in self.known_addresses.iter() {
				for addr in addrs {
					if let Ok(multiaddr) = addr.parse() {
						self.swarm.behaviour_mut().kademlia.add_address(peer_id, multiaddr);
					}
				}
			}

			match self.swarm.behaviour_mut().kademlia.bootstrap() {
				Ok(_) => info!("Bootstrap initiated."),
				Err(e) => warn!("Bootstrap failed to start: {:?}", e),
			}
		}

		loop {
			tokio::select! {
				swarm_event = self.swarm.select_next_some() => {
					self.handle_swarm_event(swarm_event).await;
				},
				command = self.command_receiver.select_next_some() => {
					self.handle_command(command).await;
				}
			}
		}
	}

	fn handle_retry_connection(&mut self, peer_id: PeerId) {
		let should_remove = {
			let retry_count = self.retry_counts.entry(peer_id).or_insert(0);
			if *retry_count < MAX_RETRIES {
				*retry_count += 1;
				debug!("Will retry connection with peer {:?} (attempt {})", peer_id, *retry_count);
				// Optionally: Add logic to delay the next connection attempt
				false
			} else {
				debug!("Removed peer {:?} after {} failed attempts", peer_id, *retry_count);
				true
			}
		};

		if should_remove {
			self.swarm.behaviour_mut().kademlia.remove_peer(&peer_id);
			self.retry_counts.remove(&peer_id);
		}
	}

	async fn handle_swarm_event<E: Debug>(&mut self, event: SwarmEvent<BehaviourEvent, E>) {
		if let Some(metrics) = &self.metrics {
			metrics.dht_event_received.with_label_values(&["event_received"]).inc();
		}
		match event {
			SwarmEvent::Behaviour(BehaviourEvent::Kademlia(event)) =>
				self.handle_kademlia_event(event).await,
			SwarmEvent::Behaviour(BehaviourEvent::Identify(event)) =>
				self.handle_identify_event(event).await,
			SwarmEvent::NewListenAddr { address, .. } => {
				let peer_id = self.swarm.local_peer_id();
				let address_with_peer = address.with(Protocol::P2p((*peer_id).into()));
				debug!("Local node is listening on {:?}", address_with_peer);
			},
			SwarmEvent::Behaviour(BehaviourEvent::Mdns(event)) => {
				// Obtain a mutable reference to the behaviour to avoid multiple mutable borrowings
				// later on.
				let behaviour = self.swarm.behaviour_mut();

				match event {
					MdnsEvent::Discovered(peers) =>
						for (peer_id, address) in peers {
							debug!(
								"MDNS discovered peer: ID = {:?}, Address = {:?}",
								peer_id, address
							);
							behaviour.kademlia.add_address(&peer_id, address);
							// 
						},
					MdnsEvent::Expired(peers) =>
						for (peer_id, address) in peers {
							if !behaviour.mdns.has_node(&peer_id) {
								debug!(
									"MDNS expired peer: ID = {:?}, Address = {:?}",
									peer_id, address
								);
								behaviour.kademlia.remove_address(&peer_id, &address);
							}
						},
				}
			},
			SwarmEvent::ConnectionClosed { peer_id, cause, .. } => {
				debug!("Connection closed with peer {:?}", peer_id);

				if let Some(metrics) = &self.metrics {
					let label = match &cause {
						Some(ConnectionError::IO(_)) => "connection_closed_io",
						Some(ConnectionError::Handler(_)) => "connection_closed_handler",
						_ => "connection_closed_other",
					};
					metrics.dht_event_received.with_label_values(&[label]).inc();
				}

				if let Some(cause) = cause {
					match cause {
						ConnectionError::IO(_) => {
							self.handle_retry_connection(peer_id);
						},
						ConnectionError::Handler(_) => {
							self.handle_retry_connection(peer_id);
						},
						_ => {},
					}
				}
			},
			SwarmEvent::Dialing(peer_id) => debug!("Dialing {}", peer_id),
			_ => trace!("Unhandled Swarm event: {:?}", event),
		}
	}

	async fn handle_kademlia_event(&mut self, event: KademliaEvent) {
		trace!("Kademlia event: {:?}", event);
		match event {
			KademliaEvent::RoutingUpdated { peer, is_new_peer, addresses, old_peer, .. } => {
				debug!(
					"Updated routing information. Affected Peer: {:?}. New Peer?: {:?}. Associated Addresses: {:?}. Previous Peer (if replaced): {:?}",
					peer, is_new_peer, addresses, old_peer
				);
				let msg = self.pending_routing.remove(&peer);
				handle_send!(Bootstrap, msg, Ok(()));
			},
			KademliaEvent::RoutablePeer { peer, address } => {
				debug!(
					"Identified a routable peer. Peer ID: {:?}. Associated Address: {:?}",
					peer, address
				);
			},
			KademliaEvent::UnroutablePeer { peer } => {
				debug!("Identified an unroutable peer. Peer ID: {:?}", peer);
			},
			KademliaEvent::PendingRoutablePeer { peer, address } => {
				debug!("Identified a peer pending to be routable. Peer ID: {:?}. Tentative Address: {:?}", peer, address);
			},
			KademliaEvent::InboundRequest { request } => {
				trace!("Received an inbound request: {:?}", request);
				if let InboundRequest::PutRecord { source, record: Some(block_ref), .. } = request {
					trace!(
						"Received an inbound PUT request. Record Key: {:?}. Request Source: {:?}",
						block_ref.key,
						source
					);
				}
			},
			KademliaEvent::OutboundQueryProgressed { id, result, .. } => match result {
				QueryResult::GetRecord(result) => {
					let msg = self.query_id_receivers.remove(&id);
					match result {
						Ok(GetRecordOk::FoundRecord(rec)) =>
							handle_send!(GetRecord, msg, Ok(vec![rec.record])),
						Ok(GetRecordOk::FinishedWithNoAdditionalRecord { .. }) =>
							handle_send!(GetRecord, msg, Err(anyhow::anyhow!("No record found."))),
						Err(err) => handle_send!(GetRecord, msg, Err(err.into())),
					}
				},
				QueryResult::PutRecord(result) => {
					let msg = self.query_id_receivers.remove(&id);
					match result {
						Ok(PutRecordOk { .. }) => handle_send!(PutRecord, msg, Ok(())),
						Err(err) => handle_send!(PutRecord, msg, Err(err.into())),
					}
				},
				QueryResult::Bootstrap(result) => match result {
					Ok(BootstrapOk { peer, num_remaining }) => {
						trace!("BootstrapOK event. PeerID: {peer:?}. Num remaining: {num_remaining:?}.");
						if num_remaining == 0 {
							let msg = self.query_id_receivers.remove(&id);
							handle_send!(Bootstrap, msg, Ok(()));
						}
					},
					Err(err) => {
						trace!("Bootstrap error event. Error: {err:?}.");
						let msg = self.query_id_receivers.remove(&id);
						handle_send!(Bootstrap, msg, Err(err.into()));
					},
				},
				_ => {},
			},
		}
	}

	async fn handle_identify_event(&mut self, event: IdentifyEvent) {
		if let IdentifyEvent::Received { peer_id, info } = event {
			debug!(
				"IdentifyEvent::Received; peer_id={:?}, protocols={:?}",
				peer_id, info.protocols
			);

			for addr in info.listen_addrs {
				self.swarm.behaviour_mut().kademlia.add_address(&peer_id, addr);
			}
		}
	}

	async fn handle_command(&mut self, command: Command) {
		if let Some(metrics) = &self.metrics {
			metrics.requests.inc();
			metrics.requests_pending.inc();
		}

		if let Some(metrics) = &self.metrics {
			metrics.requests.inc();
		}
		match command {
			Command::StartListening { addr, sender } => {
				let result = self.swarm.listen_on(addr.clone());
				if let Some(metrics) = &self.metrics {
					match result {
						Ok(_) => metrics
							.requests_total
							.with_label_values(&["start_listening_success"])
							.inc(),
						Err(_) => metrics
							.requests_total
							.with_label_values(&["start_listening_failure"])
							.inc(),
					}
				}
				_ = match self.swarm.listen_on(addr) {
					Ok(_) => sender.send(Ok(())),
					Err(e) => sender.send(Err(e.into())),
				}
			},

			Command::AddAddress { peer_id, peer_addr, sender } => {
				self.swarm.behaviour_mut().kademlia.add_address(&peer_id, peer_addr.clone());
				self.pending_routing.insert(peer_id, QueryResultSender::Bootstrap(sender));
			},
			Command::Stream { sender } => {
				self.output_senders.push(sender);
			},
			Command::Bootstrap { sender } => {
				if let Ok(query_id) = self.swarm.behaviour_mut().kademlia.bootstrap() {
					self.query_id_receivers.insert(query_id, QueryResultSender::Bootstrap(sender));
				} else {
					warn!("DHT is empty, unable to bootstrap.");
				}
			},
			Command::GetKadRecord { key, sender } => {
				let query_id = self.swarm.behaviour_mut().kademlia.get_record(key);
				self.query_id_receivers.insert(query_id, QueryResultSender::GetRecord(sender));
			},
			Command::PutKadRecord { record, quorum, sender } => {
				if let Some(metrics) = &self.metrics {
					metrics.publish.inc();
				}

				if let Some(metrics) = &self.metrics {
					metrics.publish.inc();
				}
				if let Ok(query_id) = self.swarm.behaviour_mut().kademlia.put_record(record, quorum)
				{
					self.query_id_receivers.insert(query_id, QueryResultSender::PutRecord(sender));
				} else {
					warn!("Failed to execute put_record.");
				}
			},
			Command::RemoveRecords { keys, sender } => {
				let kademlia_store = self.swarm.behaviour_mut().kademlia.store_mut();

				for key in keys {
					kademlia_store.remove(&key);
				}
				sender.send(Ok(())).unwrap_or_else(|_| {
					debug!("Failed to send result");
				});
			},
			Command::RemoveExplicitPeer { peer_id, sender } => {
				self.swarm.behaviour_mut().gossipsub.remove_explicit_peer(&peer_id);
				self.swarm.behaviour_mut().kademlia.remove_peer(&peer_id);
				sender.send(Ok(())).unwrap_or_else(|_| {
					debug!("Failed to remove explicit peer");
				});
			},
		}
	}
}

#[derive(Clone)]
pub(crate) struct Metrics {
	publish: Counter<U64>,
	requests: Counter<U64>,
	requests_total: CounterVec<U64>,
	requests_pending: Gauge<U64>,
	dht_event_received: CounterVec<U64>,
}

impl Metrics {
	pub(crate) fn register(
		registry: &prometheus_endpoint::Registry,
	) -> Result<Self, Box<dyn std::error::Error>> {
		Ok(Self {
			publish: register(
				Counter::new(
					"redot_validator_network_publish_total",
					"Total number of published items in the validator network",
				)?,
				registry,
			)?,
			requests: register(
				Counter::new(
					"redot_validator_network_requests_total",
					"Total number of requests in the validator network",
				)?,
				registry,
			)?,
			requests_total: register(
				CounterVec::new(
					Opts::new(
						"redot_validator_network_requests_total",
						"Total number of requests in the validator network",
					),
					&["type"],
				)?,
				registry,
			)?,
			requests_pending: register(
				Gauge::new(
					"redot_validator_network_requests_pending",
					"Number of pending requests in the validator network",
				)?,
				registry,
			)?,
			dht_event_received: register(
				CounterVec::new(
					Opts::new(
						"redot_validator_network_dht_event_received_total",
						"Total number of DHT events received in the validator network",
					),
					&["event"],
				)?,
				registry,
			)?,
		})
	}
}

