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

use crate::behaviour::BehaviourEvent;
use crate::KademliaKey;
use anyhow::Result;
use futures::channel::{mpsc, oneshot};
use libp2p::{
	kad::{Quorum, Record},
	Multiaddr, PeerId,
};

#[derive(Debug)]
pub enum Command {
	StartListening { addr: Multiaddr, sender: oneshot::Sender<Result<()>> },
	AddAddress { peer_id: PeerId, peer_addr: Multiaddr, sender: oneshot::Sender<Result<()>> },
	Stream { sender: mpsc::Sender<BehaviourEvent> },
	Bootstrap { sender: oneshot::Sender<Result<()>> },
	GetKadRecord { key: KademliaKey, sender: oneshot::Sender<Result<Vec<Record>>> },
	PutKadRecord { record: Record, quorum: Quorum, sender: oneshot::Sender<Result<()>> },
	RemoveRecords { keys: Vec<KademliaKey>, sender: oneshot::Sender<Result<()>> },
	RemoveExplicitPeer { peer_id: PeerId, sender: oneshot::Sender<Result<()>> },
}
