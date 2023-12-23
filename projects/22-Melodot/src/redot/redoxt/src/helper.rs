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

use crate::Client;

pub use primitive_types::H256;

/// Waits for two block confirmations using a client subscription.
///
/// # Arguments
///
/// - `client`: A reference to the client object.
///
/// # Returns
///
/// - `Result<(), Box<dyn std::error::Error>>`: A result indicating success or failure.
pub async fn wait_for_block(client: &Client) -> Result<(), Box<dyn std::error::Error>> {
	let mut sub = client.api.rpc().subscribe_all_block_headers().await?;
	sub.next().await;
	sub.next().await;

	Ok(())
}

/// Information messages used across the module.
pub mod info_msg {
	pub const START_EXAMPLE: &str = "🌟 Start";
	pub const ERROR: &str = "❌ Error";
	pub const SUCCESS: &str = "✅ Success";
	pub const ALL_SUCCESS: &str = "💯 All success";
	pub const HOURGLASS: &str = "⏳";
}
