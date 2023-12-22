.PHONY: run-dev build-release build-default purge-dev test

run-dev:
	./target/release/redot-node --dev --rpc-external

build:
	cargo build --release

build-default:
	cargo build --release -p redot-node -p redot-runtime

build-runtime:
	cargo build --release -p redot-runtime

purge-dev:
	./target/release/redot-node purge-chain --dev

test:
	SKIP_WASM_BUILD=1 cargo test --release --all