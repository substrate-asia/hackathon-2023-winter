# Xcavate Node

Xcavate node is built with Substrate as a solo Blockchain. To run the Xcavate node just follow the steps below.

## Getting Started

Depending on your operating system and Rust version, there might be additional packages required to compile this template.
Check the [Install](https://docs.substrate.io/install/) instructions for your platform for the most common dependencies.

### Build

Use the following command to build the node without launching it:

```sh
cargo build --release
```

### Embedded Docs

After you build the project, you can use the following command to explore its parameters and subcommands:

```sh
./target/release/node-template -h
```

## Run

### Single-Node Development Chain

The following command starts a single-node development chain that doesn't persist state:

```sh
./target/release/node-template --dev
```

To purge the development chain's state, run the following command:

```sh
./target/release/node-template purge-chain --dev
```

To start the development chain with detailed logging, run the following command:

```sh
RUST_BACKTRACE=1 ./target/release/node-template -ldebug --dev
```

Development chains:

- Maintain state in a `tmp` folder while the node is running.
- Use the **Alice** and **Bob** accounts as default validator authorities.
- Use the **Alice** account as the default `sudo` account.
- Are preconfigured with a genesis state (`/node/src/chain_spec.rs`) that includes several prefunded development accounts.


To persist chain state between runs, specify a base path by running a command similar to the following:

```sh
// Create a folder to use as the db base path
$ mkdir my-chain-state

// Use of that folder to store the chain state
$ ./target/release/node-template --dev --base-path ./my-chain-state/

// Check the folder structure created inside the base path after running the chain
$ ls ./my-chain-state
chains
$ ls ./my-chain-state/chains/
dev
$ ls ./my-chain-state/chains/dev
db keystore network
```

### Connect with Polkadot-JS Apps Front-End

After you start the Xcavate node locally, you can connect it with Polkadot-JS Apps front-end to interact with the chain. [Click here](https://polkadotjs-apps.web.app/#/accounts) to use the Polkadot-JS Apps.

### Run Tests

Before running tests, comment out all multiplications by 1000000000000 in the custom pallets (i.e. \* 000000000000 *\). For simplicity just comment out the zeros and multiply by 1. This is due to the fact that our chain has 12 decimals and for testing these decimals can not be used.

```sh
cd pallets/community-loan-pool/src/
```
Open lib.rs file and go to line 804.

```rust
(sending_amount as u128 * 1/* 000000000000 */)
```
repeat this with all multiplications by 1000000000000 in this file and repeat this process for communit-projects pallet, nft-marketplace pallet and xcavate-staking pallet.

Run the following command for the rust unit tests in the Xcavate node.

```sh
cargo test
```
