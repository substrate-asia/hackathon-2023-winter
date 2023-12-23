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

use crate::DasClient;
use anyhow::{anyhow, Context};
use codec::Encode;
use log::{error, info};
use rc_validator::Service as ValidatorService;
use redoxt::{Client, ClientSync};
use std::time::Instant;
use tokio::sync::mpsc::Sender;
use tokio_stream::StreamExt;

// use melo_das_db::sqlite::SqliteDasDb;

pub async fn finalized_headers(
	rpc_client: Client,
	message_tx: Sender<Instant>,
	das_client: DasClient,
	service: ValidatorService,
	error_sender: Sender<anyhow::Error>,
	// database: Arc<Mutex<SqliteDasDb>>,
) {
	// let client: SamplingClient<H, SqliteDasDb, DasNetworkServiceWrapper> =
	// 	SamplingClient::new(network, database);
	let mut new_heads_sub = match rpc_client.api.blocks().subscribe_best().await {
		Ok(subscription) => {
			info!("🌐 Subscribed to finalized block headers");
			subscription
		},
		Err(e) => {
			error!("⚠️ Failed to subscribe to finalized blocks: {:?}", e);
			return;
		},
	};

	// 一个简化的计数器
	let mut nonce = 0;

	let init_key = service.rotate_key().await.unwrap();

	rpc_client.new_key(&init_key).await.unwrap();

	while let Some(message) = new_heads_sub.next().await {
		let received_at = Instant::now();
		if let Ok(block) = message {
			let header = block.header().clone();

			let block_number = header.number;

			info!("✅ Received finalized block header #{}", block_number.clone());

			if let Err(error) = message_tx.send(received_at).await.context("Send failed") {
				error!("❌ Fail to process finalized block header: {error}");
			}

			let (block_number, block_hash) = match das_client.get_latest_block() {
				Ok(Some((block_number, block_hash))) => (block_number, block_hash),
				Ok(None) => {
					info!("No new block available yet, continuing...");
					continue;
				},
				Err(e) => {
					error!("❌ Fail to get latest block: {:?}", e);
					return;
				},
			};

			let block_hash_hex = hex::encode(&block_hash);
			let is_available = match das_client.check_data_availability(&block_hash_hex) {
				Ok(Some(is_available)) => is_available,
				Ok(None) => {
					info!("No new block available yet, continuing...");
					continue;
				},
				Err(e) => {
					error!("❌ Fail to check block availability: {:?}", e);
					return;
				},
			};

			let metadata = (block_number, block_hash, is_available);
			let id = 1;

			let mut msg = metadata.encode();
			msg.extend_from_slice(&id.encode());
			msg.extend_from_slice(&nonce.encode());

			// 获取签名
			let signature = service.start_signing(&msg.clone()).await.unwrap();

			// 向链上提交签名
			let res = rpc_client.submit_metadata(&msg, 1u32, nonce.clone(), &signature).await;

			match res {
				Ok(_) => {
					info!("✅ Submit metadata success");
					nonce += 1;
				},
				Err(e) => {
					error!("❌ Submit metadata failed: {:?}", e);
					return;
				},
			}
		} else if let Err(e) = message {
			error!("❗ Error receiving finalized header message: {:?}", e);
		}
	}

	if let Err(error) =
		error_sender.send(anyhow!("Finalized blocks subscription disconnected")).await
	{
		error!("🚫 Cannot send error to error channel: {error}");
	}
}
