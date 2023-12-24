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
use cumulus_primitives_core::relay_chain::ValidatorId;
use futures::channel::mpsc;
use rc_validator_network::Service as ValidatorNetworkService;
use std::sync::Arc;

pub(crate) use redot_core_primitives::{DkgSignature, DkgVerifyingKey, Identifier};
pub(crate) use shared::Command;

mod service;
mod shared;
mod worker;

pub use service::Service;
pub use worker::Worker;

/// Creates a new validator network service and a worker to handle requests.
pub fn new_validator_network_service(
	validator_id: ValidatorId,
	netwok: Arc<ValidatorNetworkService>,
) -> Result<(Service, Worker)> {
	let (to_worker, from_service) = mpsc::channel(8);
	let service = Service::new(to_worker.clone());
	let worker = Worker::new(netwok, validator_id, from_service)?;
	Ok((service, worker))
}
