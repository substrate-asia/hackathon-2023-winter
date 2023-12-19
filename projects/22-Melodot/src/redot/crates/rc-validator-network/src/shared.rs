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
use anyhow::Result;
use cumulus_primitives_core::relay_chain::ValidatorId;
use futures::channel::{mpsc, oneshot};
use libp2p::{
	gossipsub::{error::SubscriptionError, Sha256Topic},
	Multiaddr, PeerId,
};
use bytes::Bytes;

#[derive(Debug)]
pub(crate) struct CreatedSubscription {
	/// Subscription ID to be used for unsubscribing.
	#[allow(dead_code)]
	pub(crate) subscription_id: usize,
	/// Receiver side of the channel with new messages.
	#[allow(dead_code)]
	pub(crate) receiver: mpsc::UnboundedReceiver<Bytes>,
}

#[derive(Debug)]
pub enum Command {
	StartListening {
		addr: Multiaddr,
		sender: oneshot::Sender<Result<()>>,
	},
	AddAddress {
		peer_id: PeerId,
		peer_addr: Multiaddr,
		sender: oneshot::Sender<Result<()>>,
	},
	Stream {
		sender: mpsc::Sender<BehaviourEvent>,
	},
	Bootstrap {
		sender: oneshot::Sender<Result<()>>,
	},
	RemoveExplicitPeer {
		peer_id: PeerId,
		sender: oneshot::Sender<Result<()>>,
	},
	NewValidators {
		validators: Vec<ValidatorId>,
	},
	RemoveValidators {
		validators: Vec<ValidatorId>,
	},
	Subscribe {
		topic: Sha256Topic,
		#[allow(private_interfaces)]
		result_sender: oneshot::Sender<Result<CreatedSubscription, SubscriptionError>>,
	},
	Publish {
		topic: Sha256Topic,
		message: Vec<u8>,
		sender: oneshot::Sender<Result<()>>,
	},
	Unsubscribe {
        topic: Sha256Topic,
        subscription_id: usize,
    },
}
