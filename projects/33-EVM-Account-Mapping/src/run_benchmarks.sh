#!/usr/bin/env sh
set -e

# The following lines ensure we run from the project root
PROJECT_ROOT=$(dirname "$(readlink -f "$0")")
cd "$PROJECT_ROOT"

echo "*** Run benchmark for pallet-evm_account_mapping ***"

./target/production/node-template benchmark pallet \
  --pallet=pallet_evm_account_mapping \
  --extrinsic="*" \
  --chain=dev \
  --steps=50 \
  --repeat=50 \
  --no-storage-info \
  --no-median-slopes \
  --no-min-squares \
  --wasm-execution=compiled \
  --heap-pages=4096 \
  --output=./pallets/evm_account_mapping/src/weights.rs \
  --template=./pallet-weight-template.hbs \
  --header ./HEADER-APACHE2
