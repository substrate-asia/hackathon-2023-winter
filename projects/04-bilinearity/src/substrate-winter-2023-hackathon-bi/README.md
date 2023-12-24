# Team Bilinearity Substrate node

## About
The node contains a pallet which allows verifying ZK proofs of arbitrary RISC Zero programs. It is expected that this is used along with proofs of unit test passage via RISC Zero's cargo risc zero tool. In the future, this node's pallet will mature to include a request/reward process for running tests. 

## Building
cargo +nightly build --release

## Interacting with the node
See the example repo which creates the ZK proofs of test passage, and uploads them to the node - https://github.com/justinfrevert/example-ci-project