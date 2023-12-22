# EVM Account Mapping Pallet SDK

This SDK is designed to enable the use of polkadot-js for interacting with the EVM Account Mapping pallet simiper. Both polkadot-js and viem were required.

## Usage

To interact with the EVM account mapping pallet, follow these two steps:

1. Compute the substrate address for mapping.
2. Sign and send extrinsics to the EVM account mapping pallet.

### 01. Getting the Mapping Account

```typescript
import { custom, createWalletClient } from 'viem'
import { mainnet } from 'viem/chains'
import { getMappingAccount } from 'evm_account_mapping_sdk'

const walletClient = createWalletClient({ chain: mainnet, transport: custom((window as any).ethereum) })
const [address] = await walletClient.requestAddresses()
const mappingAccount = await getMappingAccount(walletClient, { address })
```

### 02. Sign and Send the extrinsics

```typescript
import { signAndSendEvm } from 'evm_account_mapping_sdk'

// Assuming you already have:
// 1. the `ApiPromise` instance
// 2. the `walletClient` instance
// 3. the `mappingAccount` object

const result = await signandsendevm(
    apiPromise.tx.balances.transferAllowDeath(mapping_address, amount),
    apiPromise,
    walletClient,
    mappingAccount
)
```

The example above demo calling `transferAllowDeatch` from the `balances` pallet, but you can also submit other extrinsics.

