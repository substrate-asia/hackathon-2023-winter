Technical review reference
====

This is a Substrate pallet that enable interactive with EVM-compatible wallets.

It give us a chance to lure EVM chains Web3ers to try the amazing Polkadot economic or Sub-based standalone chains.

Highlights:
- Account mapping, not abstraction
  - the Substrate account is 1:1 mapping from ETH private key
  - User can export the private key and import to Polkadot.js extension to take full control of the Substrate account 
- Super lightweight, super easy to integrate to Substrate chains
  - The pallet only dependent `pallet-transaction-payment`
  - No extra RPC or RuntimeAPI
  - No need to modify the Runtime or node
- Super lightweight, super easy to integrate to frontends
  - No forked package
  - No monkey patch, no injection

## Try

### Import ETH private key to Polkadot.js

> This is optional, only do it if you want to take full control of the wallet.

- You can get wallet's private key from "Account detail" on MetaMask
- In Polkadot.js app, click "+ Account"
  - Select "Raw seed", paste the private key to `seed (hex or string)`
    - You need to add `0x` for prefix
  - Expand "Advanced creation options" and select "ECDSA (Non BTC/ETH compatible)"
  - Check "I have saved ..." and click "Next"
- You can import the saved Json to the polkadot.js extension
  - There is no way to create an ECDSA wallet directly

Here's a seed private key for test:
`0x415ac5b1b9c3742f85f2536b1eb60a03bf64a590ea896b087182f9c92f41ea12`

### Run the dev node

```
$ cargo build --release
$ target/release/node-template --dev
```

### Run the demo frontend

See [demo/README.md](../src/demo/README.md)

## Technical details

TD;LR:
- EVM-compatible chains private keys are `ECDSA` which Substrate supports it as well
- The difference is how calculate address
  - We can get the public address, and calculate ETH address and Substrate address which 1:1 mapping
- To confirm the user's identity, we can ask the wallet sign the Substrate call
  - The pallet will verify it
  - We choose EIP-712 standard signature for better visibility and security
- Because the call signed by a ETH wallet, we have to make it be an unsigned call
  - That's why `meta_call`
- For security, we simulate the signed call workflow (`SignedExtra`)
  - `frame_system::CheckNonZeroSender<Runtime>`
  - `frame_system::CheckSpecVersion<Runtime>`
  - `frame_system::CheckTxVersion<Runtime>`
  - `frame_system::CheckGenesis<Runtime>`
  - `frame_system::CheckEra<Runtime>`
  - `frame_system::CheckNonce<Runtime>`
  - `frame_system::CheckWeight<Runtime>`
  - `pallet_transaction_payment::ChargeTransactionPayment<Runtime>`

### Understand how to make meta call data

You can check [the PoC code](../src/docs/poc.ts) to understanding theory.

`deno run --allow-all docs/poc.ts`

Here's a sample to send a call for `system.remarkWithEvent("Hello")`

```
evmAccountMapping.metaCall("5DT96geTS2iLpkH8fAhYAAphNpxddKCV36s5ShVFavf1xQiF", system.remarkWithEvent("Hello"), 0, "0x37cb6ff8e296d7e476ee13a6cfababe788217519d428fcc723b482dc97cb4d1359a8d1c020fe3cebc1d06a67e61b1f0e296739cecacc640b0ba48e8a7555472e1b", None)
```

Before try this, transfer some token to `5DT96geTS2iLpkH8fAhYAAphNpxddKCV36s5ShVFavf1xQiF`

### `src` structure

- `demo`: a simple dApp demo
- `docs/poc.ts`: the PoC script to show the theory
- `frontend-sdk`: the frontend SDK
- `node`: the demo node
- `pallets/evm_account_mapping` the pallet
- `runtime`: the demo runtime
