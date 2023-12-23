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

use cli::parse_args;
use codec::Decode;
use cumulus_primitives_core::relay_chain::ValidatorId;
use log::{error, info};
use redoxt::ClientBuilder;
use std::sync::Arc;
use subxt_signer::sr25519::{
	dev::{self},
	Keypair,
};
use tokio::sync::mpsc;

mod cli;
mod das_rpc;
mod logger;
mod looper;

pub(crate) use das_rpc::DasClient;

pub async fn run(config: &cli::Config) -> anyhow::Result<()> {
	logger::init_logger().unwrap();

	info!("🚀 Redot Light Client starting up");

	let (network_service, network_worker) =
		rc_validator_network::default(Some(config.network_config.clone()), None)?;

	let keypair = Keypair::from(dev::alice());
	let public_key = keypair.public_key();
	let validator_id = ValidatorId::decode(&mut public_key.as_ref()).unwrap();

	let (service, mut client) =
		rc_validator::new_validator_network_service(validator_id, Arc::new(network_service))?;

	let rpc_url = config.rpc_url.clone();

	// let database = Arc::new(Mutex::new(SqliteDasDb::default()));

	let rpc_client = match ClientBuilder::default().set_url(&rpc_url).build().await {
		Ok(client) => client,
		Err(e) => {
			error!("❌ Failed to build RPC client: {:?}", e);
			return Err(e);
		},
	};

	let das_client = DasClient::new("http://example.com/rpc".to_string());

	tokio::spawn(network_worker.run());
	tokio::spawn(async move {
		let _ = client.run().await;
	});
	let (message_tx, _message_rx) = mpsc::channel(100);
	let (error_tx, mut error_rx) = mpsc::channel(10);

	tokio::spawn(looper::finalized_headers(rpc_client, message_tx, das_client, service, error_tx));

	while let Some(error) = error_rx.recv().await {
		error!("⚠️ Error in finalized headers stream: {:?}", error);
	}

	Ok(())
}

pub fn main() {
	let config = parse_args();

	tokio::runtime::Builder::new_multi_thread()
		.worker_threads(4)
		.enable_all()
		.build()
		.expect("Failed to build runtime")
		.block_on(run(&config))
		.unwrap_or_else(|e| error!("Fatal error: {}", e));
}
