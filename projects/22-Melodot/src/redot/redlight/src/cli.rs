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

use clap::{ArgAction, Parser};
use rc_validator_network::ValidatorNetworkConfig;
use std::net::SocketAddr;

pub const DEFAULT_RPC_LISTEN_ADDR: &str = "127.0.0.1:4177";

const DEV_RPC_URL: &str = "ws://127.0.0.1:9944";
const TEST_RPC_URL: &str = "wss://dev.melodot.io:9944";

const DEFAULT_RPC_URL: &str = "ws://127.0.0.1:9944";

/// Command line interface configuration
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub struct Cli {
	/// Listening address for the RPC service
	#[clap(short = 'a', long, env)]
	rpc_listen_addr: Option<SocketAddr>,

	/// Remote RPC URL for receiving messages
	#[clap(short = 'r', long, env = "RPC_REMOTE_URL")]
	rpc_remote_url: Option<String>,

	/// Remote RPC URL for receiving messages
	#[clap(short = 'd', long, env = "DAS_NET_LISTEN_PORT")]
	das_net_listen_port: Option<u16>,

	/// Activate development configuration
	#[clap(long, action = ArgAction::SetTrue)]
	dev_mode: bool,

	/// Activate test configuration
	#[clap(long, action = ArgAction::SetTrue)]
	test_mode: bool,
}

/// Application configuration
pub struct Config {
	pub rpc_listen_addr: SocketAddr,
	pub rpc_url: String,
	pub network_config: ValidatorNetworkConfig,
}

impl Config {
	pub fn from_cli_args(cli: Cli) -> Self {
		let rpc_listen_addr = cli.rpc_listen_addr.unwrap_or_else(|| {
			DEFAULT_RPC_LISTEN_ADDR.parse().expect("Invalid DEFAULT SocketAddr")
		});

		let mut das_network_config = ValidatorNetworkConfig::default();
		let mut rpc_url = DEFAULT_RPC_URL.to_string();

		if cli.dev_mode {
			rpc_url = DEV_RPC_URL.to_string();
			das_network_config.listen_port = 4418;
		} else if cli.test_mode {
			rpc_url = TEST_RPC_URL.to_string();
		}

		if let Some(rpc_remote_url) = cli.rpc_remote_url {
			rpc_url = rpc_remote_url.to_string();
		}

        print!("poot: {}", das_network_config.listen_port);

		Config { rpc_listen_addr, rpc_url, network_config: das_network_config }
	}
}

pub fn parse_args() -> Config {
	let cli = Cli::parse();
	Config::from_cli_args(cli)
}
