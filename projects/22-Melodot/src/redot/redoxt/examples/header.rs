// Copyright 2023 ZeroDAO

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use log::{debug, error, info};
use meloxt::info_msg::*;
use meloxt::init_logger;
use meloxt::ClientBuilder;

#[tokio::main]
pub async fn main() {
	init_logger().unwrap();

	if let Err(err) = run().await {
		error!("{}", err);
	}
}

async fn run() -> Result<(), Box<dyn std::error::Error>> {
	info!("{} get header", START_EXAMPLE);

	let api = ClientBuilder::default().build().await?.api;

	let head_block = api.rpc().block(None).await?.expect("Best block always exists .qed");

	let block_num = head_block.block.header.number;

	info!("{} Current block_num: {}", SUCCESS, block_num);

	debug!("Current head block extrinsic: {:?}", head_block.block.extrinsics);
	debug!("Current head block header: {:?}", head_block.block.header);

    info!("{} : Header", ALL_SUCCESS);

	Ok(())
}
