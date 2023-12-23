.PHONY: run-dev build-release build-default purge-dev test run-light

run-dev:
	./target/release/redot-node --dev --rpc-external

run-light:
	./target/release/melodot-light
	
build:
	cargo build --release

build-default:
	cargo build --release -p redot-node -p redot-runtime

build-runtime:
	cargo build --release -p redot-runtime

build-light:
	cargo build --release -p redlight

purge-dev:
	./target/release/redot-node purge-chain --dev

test:
	SKIP_WASM_BUILD=1 cargo test --release --all