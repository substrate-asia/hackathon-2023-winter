### Test environment for XCMarketplace

### Instructions to run

Build the parachain node:

In the `substrate-parachain-template` run:

 `cargo build --release`

Then copy the binary in the `binaries` folder:

`cp target/release/parachain-template-node ../binaries/parachain-template-node-v1.0.0`

Finally replace `zombienet-linux-x64` by your local executable of [zombienet](https://github.com/paritytech/zombienet/releases) in the following command:

`zombienet-linux-x64 spawn config.toml -p native -c 1`