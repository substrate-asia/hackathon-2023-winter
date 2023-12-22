# DeQ Contracts

## Overview

This folder contains the smart contracts for the DeQ project, both AnswerNFT & QuestionNFT.

It use [Foundry](https://getfoundry.sh/) for development and testing with [Vitest](https://vitest.dev/), [Viem](https://viem.sh/) and Anvil.

Unlike other solidity projects, we use npm for dependency management and maintain `remappings.txt` by hand.

## Preparations

Require Bun 1.0.15 and forge 0.2.0.

Install dependencies:

```shell
bun install
forge install
```

Compile contracts:

```shell
forge build
```

Running Unit Tests:

```shell
bun run test
```

## Deploy

Deploy contracts:

```shell
npx tsx deploy_answer_nft.ts --rpc-url https://eth-rpc-tc9.aca-staging.network --private-key PRIVATE_KEY
npx tsx deploy_question_nft.ts --rpc-url https://eth-rpc-tc9.aca-staging.network --private-key PRIVATE_KEY
```

**NOTE**

To publish your contract on the Acala Testnet, you need to bind your Polkadot address with an EVM address using the Polkadot/Substrate Portal.

See [Acala EVM+ Documentation](https://evmdocs.acala.network/tooling/development-account#bind-accounts).

After deploying the contract, you must transfer 0.5 ACA to the contract address in order to maintain an active account.

See https://wiki.acala.network/get-started/acala-network/acala-account#existential-deposit
