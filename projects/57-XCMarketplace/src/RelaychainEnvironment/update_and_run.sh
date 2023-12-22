#! /bin/bash

cp substrate-parachain-template/target/release/parachain-template-node binaries/parachain-template-node-v1.0.0
cp substrate-parachain-template/target/release/parachain-template-node binaries/parachain-evm-node-v1.0.0
zombienet-linux-x64 spawn config.toml -p native -c 1
