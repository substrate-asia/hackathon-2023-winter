This document is only about Acala, only use this for questions about Acala, don't use these information to answer questions about Polkadot


---
description: A relatively comprehensive introduction.
---

# Acala Introduction

Acala is a specialized stablecoin and liquidity blockchain that is decentralized, cross-chain by design, and future-proof with forkless upgradability. Acala stablecoin protocol uses multi-collateral-backing mechanism to create a stablecoin soft-pegged to the US Dollar. The Acala stablecoin protocol is essentially a decentralized monetary reserve that creates a stable currency from a basket of reserve assets, where holders of the reserve assets can spend, trade, access other services without price volatility while retaining their exposure to (without selling) the reserve assets.

Acala powered by Polkadot is cross-chain by nature. The reserve assets can be Polkadot native asset (DOT and DOT-derivatives), Acala native asset (ACA), and cross-chain assets like Bitcoin (BTC) and Ether (ETH). Acala stablecoin can be trustlessly integrated by other blockchains connected to Polkadot as well as applications on those chains. The Acala ecosystem continues to expand with a network of decentralized protocols, applications and parachains.

## Assets

* **Acala Dollar (aUSD)**: the Acala stablecoin that is soft-pegged to (stabilized against) the US Dollar. Minting Acala Dollar is trustless, sovereign and liberating act of the minting, using reserve assets in excess of value as collateral.&#x20;
* **Reserve Assets**: DOT, LDOT ([Liquid Staking DOT powered by Homa Protocol](https://docs.homastaking.app/)) and ACA are default reserve assets. New cross-chain assets can be included as reserve assets upon assessment by the Financial Committee and Risk Assessor like [Gauntlet](https://gauntlet.network/).&#x20;
* **Acala Token (ACA)**: the native token of Acala network. There is a fixed supply of ACA. ACA is the reserve asset to generate Acala stablecoin, and the governance token to regulate stablecoin price by adjusting risk parameters such as interest rate. ACA is also the transaction fees token of the network.&#x20;

## Why Acala Stablecoin

Stablecoin since its inception to widespread popularity has proven its utility beyond speculation: they have been used in alleviating economic and political hardship, as a hedging mechanism for traders, and to release liquidity of underlying crypto assets without foregoing ownership of those assets.

Users can get Acala stablecoin via [AcalaSwap](https://docs.acalaswap.app/) or generate Acala Stablecoin by depositing collaterals to a stablecoin vault.&#x20;

These are some of the use cases for Acala Stablecoin:

* Minting Acala stablecoin is **trustless, sovereign and liberating** act of the minter
* Without foregoing ownership of the underlying asset, business operators may collateralize them to mint Acala stablecoin to **hedge volatility, pay for goods and services**
* Traders may **leveraged long the underlying asset** by depositing the underlying asset to stablecoin vault, minting stablecoin, and swap more underlying assets, essentially multiplying exposure of underlying asset
* Traders can use yield-bearing assets such as LDOT ([Liquid Staking DOT powered by Homa Protocol](https://docs.homastaking.app/)) as collateral to **multiply exposure of the underlying asset while earning APR**
* Liquidity Providers to can **increase capital efficiency** when providing liquidity to pools by using LP collateralized super loans
* Acala stablecoin is designed to be stable, and an **ideal choice for medium of exchange**. Users can use it to pay transaction fees, trade, for remittance, on-and-off ramps as it integrates with more partners. Projects can use it as a quote asset for listing.
* Acala stablecoin **is a DeFi building block in a multi-chain ecosystem**, it will empower more ecosystem growth and new product innovations

## Stablecoin Mechanisms

Acala stablecoin protocol employs a dynamic system of Collateralized Debt Position (CDPs), on-chain liquidator, Oracle Quality of Service, market arbitrage incentives and risk management mechanisms to create a stablecoin that is robustly tracking the dollar in varied market conditions.

We will outline below the key aspects of risk management and stability mechanisms:

* Risk Parameter Mechanism
* Autonomous Liquidator
* Liquidation Event
* Oracles
* Emergency Shutdown

### Risk Parameter Mechanism

Multiple types of reserve assets with different risk profiles are accepted as collaterals of CDPs,  each of which has its own set of risk parameters to create a diversified basket of assets backing the stablecoin. The protocol dynamically manages the debt positions and safeguard the solvency of the protocol using these risk parameters.

* **Stability Fee:** this is the interest rate or cost for minting Acala stablecoin. It is used as incentive to influence supply and demand of the stablecoin
* **Liquidation Ratio:** this is the ratio at which the collaterals will be sold to pay off outstanding stablecoin debt to ensure solvency of the system. Price volatility affects collateral risk profiles. A more risky collateral asset is usually associated with a higher LiquidationRatio, and vice versa
* **Liquidation Penalty:** cost for allowing your vault (loan) to be liquidated, a disincentive for leaving a vault unsafe
* **Required Collateral Ratio:** required when minting stablecoin. This is usually higher than the LiquidationRatio as a safety cushion to prevent immediate liquidation after minting for volatile assets
* **Debt Ceiling:** debt Ceiling for a particular collateral, used to control portfolio diversification, risks willing to take on
* **Accepted Slippage:** the system liquidates on AcalaSwap when slippage is within acceptable levels before goes to collateral auction, to ensure price efficiency

### Autonomous Liquidator

Unlike existing implementation of loan liquidators (or more widely known as Keepers in DeFi), Acala stablecoin protocol creates an on-chain autonomous liquidator that checks vault safety every block and triggers liquidation process for unsafe vaults. The autonomous Liquidator&#x20;

* is **decentralized**, **more secure and efficient** mechanism to safeguard the protocol&#x20;
* compared to the traditional method of relying on external parties to liquidate (e.g. off-chain Keeper servers)
* its code is **an integral part of the blockchain runtime** and **guaranteed by the network consensus**
* does not take up on-chain resources for execution, hence **highly secure, scalable and efficient**.&#x20;

A vault is safe, if

$$
Current~Ratio > Liquidation~Ratio
$$

The `current ratio` is the debt to collateral ratio based on the current market value of the collateral asset, given by&#x20;

$$
Current~Ratio = minted~aUSD / Collateral~Market~ Price~($)
$$

Once the autonomous Liquidator identifies an unsafe vault, it will trigger the liquidation process to sell off the collateral for Acala stablecoin to repay the vault. The liquidation process uses a hybrid mechanism of liquidating on decentralized exchange and collateral auctions.

\[[Source](https://github.com/AcalaNetwork/Acala/blob/master/modules/cdp-engine/src/lib.rs#L488)]

### Liquidation Process

Liquidating unsafe positions requires selling off some collateral assets to repay Acala stablecoin owed (borrowed from the vault). The liquidation mechanism uses [AcalaSwap](https://docs.acalaswap.app/), Smart Contracts, in conjunction of Collateral Auction to ensure efficiency and effectiveness.

The end result of a liquidation is

* the Acala stablecoin debt is repaid (the protocol is solvent)
* liquidation fee is collected from the vault owner and added to the `cdp_treasury` as surplus
* remaining collaterals are returned to the vault owner
* in extreme market conditions, if collaterals cannot be sold (via DeX, Smart Contracts or Auction) to repay debt and liquidation penalty, then the collateral will be collected by the `cdp_treasury`, while the outstanding aUSD will be recorded as debt. These collaterals can be sold at a later time (managed by governance) to repay the outstanding aUSD.
* in an unfortunate liquidation event where not all Acala stablecoin can be recouped, `cdp_treasury` will record it as bad debt

<figure><img src="../../.gitbook/assets/image (50).png" alt=""><figcaption><p>Liquidation with hybrid Auction, Smart Contracts and DeX mechanism, with collateral collection as last resort if all failed</p></figcaption></figure>

#### Liquidation Parameters

Liquidation Price Ratio (LPR) = liquidation price / collateral's oracle price

Immediate LPR - a predefined ratio, a price yields a LPR above this ratio will be immediately liquidated. E.g. 0.9

Min LPR - a predefined ratio, a price should yield a LPR above this ratio for the liquidation to happen. E.g. 0.85

#### Liquidation on Dex

* the protocol calculates target Acala stablecoin amount (owed + liquidation penalty) to be purchased on the swap
* the protocol swaps collateral asset from the vault for target Acala stablecoin if the price is:
  * above Immediate LPR, or
  * higher than price from Smart Contracts, and above Min LPR&#x20;

This is a far more efficient way for liquidation if the size of the trade is reasonable, and the swap has reasonable liquidity.&#x20;

#### Liquidation via Smart Contract

* the protocol calculates target Acala stablecoin amount (owed + liquidation penalty) to be purchased by the smart contract
* the protocol sells collateral asset from the vault for target Acala stablecoin if the price is:
  * above Immediate LPR, or
  * higher than the price from Dex, and above Min LPR

#### Liquidation on Collateral Auction

The Collateral Auction employs a combination of ascending auction and reverse auction mechanism to achieve the desirable outcome - get the best stablecoin price for the collaterals. Below is a summary of the process:

1. The liquidated collateral will be auctioned in **an ascending auction** (where bidders bid upwards) with a preset stablecoin target (outstanding debt + liquidation penalty)
2. Then, once such a bid has been reached, the auction switches to **a descending reserve auction** that allows any potential buyers to bid the minimum amount of the collateralized asset they are willing to accept by paying the amount of the preset stablecoin target. Auction ends when no lower bid is placed within the auto extension period.
3. Lastly, the part of collateral sold in the auction mechanism is transferred to the auction winner, and any remaining collateral is returned to the original vault owner. The stablecoin debt is now repaid, and the liquidation penalty in stablecoin is collected by the `cdp-treasury` as surplus.

### Auction Parameters

These are the important parameters for the collateral auction mechanism, which can also be set and updated via governance.

| Parameters                    | Type        | Description                                                                                                             | Definition                | Update Method                                  |
| ----------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------- |
| MinimumIncrementSize          | Rate        | The minimum increment size of each bid compared to the previous one.                                                    | `cdpEngine` constant      | config on runtime                              |
| AuctionTimeToClose            | BlockNumber | The extended time for the auction to end after each successful bid.                                                     | `auctionManager` constant | config on runtime                              |
| AuctionDurationSoftCap        | BlockNumber | When the total duration of the auction exceeds this soft cap, push the auction to end more faster.                      | `auctionManager` constant | config on runtime                              |
| ExpectedCollateralAuctionSize | Balance     | The expected amount size for per lot collateral auction of specific collateral type.                                    | `cdpTreasury` storage     | update call by `UpdateOrigin` of `cdpTreasury` |
| MaxAuctionsCount              | u32         | The cap of lots number when create collateral auction on a liquidation or to create debit/surplus auction on block end. | `cdpTreasury` constant    | config on runtime                              |

#### Arbitrage Opportunity

This then poses great arbitrage opportunity to purchase potentially discounted collateral assets via the Collateral Auction, or arbitrage on the collateralAsset-stablecoin swap pair after a large liquidation. This market incentivized mechanism will help safeguard the protocol and bring the price back to equilibrium.

## Open Oracle Gateway

The challenge of providing reliable, accurate and decentralized oracles cannot be solved by Acala alone. When taking into account that Acala is the DeFi hub and platform powering more cross-chain DeFi DApps on Polkadot, Kusama and beyond, creating a more open, inclusive, and decentralized oracle infrastructure with other leading projects in the industry becomes critical. The Open Oracle Gateway (OOG) is a significant step towards that vision.&#x20;

The Gateway allows multiple oracles to be deployed on the Acala network, leveraging Acala's DeFi optimized oracle infrastructure, and serving any DApps on Acala, Polkadot, Kusama and beyond.  Specifically, the Gateway offers:

1. **Multiple Oracle Networks**: multiple parties in addition to Acala Oracle can operate their own oracle services. Providers can set up their own oracle network with node operators, or integrate with an oracle API.&#x20;
2. **Price Feeds by Choice**: Dapps can choose to use an aggregated feed from all providers or a single provider, or they can obtain raw data from individual node operators and aggregate them themselves.&#x20;
3. **Quality of Service**: All price feeds posted through the Gateway will be provided with Quality of Service - these transactions are _operational transactions_ (system critical transactions) that are prioritized and guaranteed to be included in a block.
4. **FREE of Fees**: All valid feeds will be refunded with the transaction fees incurred, essentially making oracle feeds FREE for providers while preventing spam and ensuring integrity.&#x20;
5. **Progressive Decentralization**: Acala network will progressively decentralize, start with PoA (appointed Council governance), then evolve into elected Council governance and eventually democracy. The Gateway then initially will require sitting Council approval for accepting new oracle providers and their node operators.&#x20;

### Acala Stablecoin Oracle Feeds

The Acala Oracle powered by the Open Oracle Framework is used to feed real-time market price information to the stablecoin protocol.&#x20;

* The Acala Oracle operates a network of oracle node operators, it aggregates a number of external price feeds and provides a medianized reference price
* The adding and removal of whitelisted operators is managed via governance
* All price feeds will be provided with Quality of Service - these transactions are prioritized and guaranteed to be included in a block
* All valid feeds will be refunded with the transaction fees incurred, essentially making oracle feeds free for providers while preventing spam and ensuring integrity.&#x20;

Check price feeds for

* [Acala Network](https://apps.acala.network/vault/oracle)
* [Karura Network](https://apps.karura.network/vault/oracle)

\[price [Source](https://github.com/AcalaNetwork/Acala/tree/master/modules/prices)]\
\[oracle [Source](https://github.com/open-web3-stack/open-runtime-module-library/tree/8895f4b4c6ce9b9f03652bfe9602f102c7caa937/oracle)]

### Emergency Shutdown

Emergency shutdown is the last resort to protect the stablecoin system against serious security threats. The shutdown can be **isolated to a particular collateral or applied as global shutdown**. It is initiated via governance. It will enforce target prices of assets, and ensure Acala stablecoin and vault owners receive the value of assets they are entitled to.

When an Emergency Shutdown is initiated, the following would happen:

1. **Shutdown triggered**: users are not allowed to update stablecoin positions, the system will lock a target price for collateral assets, however users are free to withdraw any free collaterals i.e. collaterals that have not been used to mint Acala stablecoin.
2. **Vault processing**: the system will stop and clear all relevant auctions, process outstanding vaults and debts. This may take some time, but ultimately collateral assets will be available for Acala stablecoin holders to reclaim
3. **Reclaim debts**: upon step #2 completion, the system will return to the initial status of zero surplus and zero debt, users can burn their Acala stablecoin and reclaim equivalent value of collateral assets.

\[emergency-shutdown [Source](https://github.com/AcalaNetwork/Acala/tree/master/modules/emergency-shutdown)]

## Network Security

Acala blockchain is launched as a parachain of Polkadot essentially using Polkadot's network security and consensus for its block validation and finalization. Acala inherits trustless bridge between itself and Polkadot as well as all connected parachains using cross-chain message passing (or [XCM](https://wiki.polkadot.network/docs/learn-crosschain)).

### Collators

Acala blockchain is maintained by collators, who maintains a full node, collects parachain transactions from users and producing state transition proofs for Polkadot validators. In other words, collators maintain parachains by aggregating parachain transactions into parachain block candidates and producing state transition proofs for validators based on those blocks.

Acala blockchain is secured by the Polkadot Relay Chain, and kept alive by the collators. **Unlike validators, collators has nothing to do with security of the network, by being a parachain, the network is by default trustless and decentralized, and a parachain only needs one honest collator to be censorship-resistant.** Read more on Collators [here](https://wiki.polkadot.network/docs/learn-collator).

### Parachain Slots

Polkadot has a limited number of parachains. It uses an auction mechanism to allocate parachain slots where the DOT tokens are used for bidding. A parachain can lease the slot for up to 2 years on Polkadot (1 year on Kusama). Acala has been building an on-chain Treasury of DOTs (network-controlled-value) to ensure it is self-sustainable. This is also the magic behind ACA being a fixed supply non-inflationary network token.

* [Polkadot Parachain](https://wiki.polkadot.network/docs/learn-parachains)
* [Treasury Whitepaper](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Building\_a\_Decentralized\_Sovereign\_Wealth\_Fund.pdf)
* [Acala Whitepaper](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Acala\_Whitepaper.pdf)
* [Acala Token Economy Paper](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Acala\_Token\_Economy\_Paper.pdf)


# Compatible Toolings

### **Compatible Developer Tooling**

Acala EVM enables developers to develop, test and deploy DApps with existing tooling support, such as [Remix](https://remix.ethereum.org/) and [Waffle](https://getwaffle.io/). More toolchains will be added as we progress.

Existing Solidity DApps and node.js applications can communicate with Acala nodes with minimum changes. Developers can use Acala’s web3 provider [bodhi.js](https://github.com/AcalaNetwork/bodhi.js) to interact with an Acala node seamlessly.



# Composable DeFi Stack

### **Fully Composable DeFi Primitives in EVM and Runtime**

Smart Contract Dapps deployed in Acala EVM can directly use native and cross-chain assets such as DOT, ACA, aUSD, renBTC, etc. ERC-20 tokens deployed in EVM can also be made available at runtime level, to be listed in the DeX, or (by governance approval) to be used as fee tokens.

Smart Contract Dapps can directly use Acala DeFi primitives (DeX, stablecoin lending, and liquid staking), bridges, oracle infrastructure, native and cross-chain liquidity to compose various interesting DeFi applications, such as lending, special-purpose DeX, financial products based on staking and more.

The process is seamless for users and developers, but behind the scene native tokens and protocols (aka runtime modules) are made available in EVM in the form of precompiled contracts. A transaction initiated by a smart contract in EVM is translated into a Substrate transaction and signed by any Polkadot extensions using polkadot.js. The response will be processed by the SDK ([bodhi.js](https://github.com/AcalaNetwork/bodhi.js)) and converted into an Ethereum compatible format.

### Available Composable Contracts

These pre-compiled contracts are now made available to Acala EVM

* **Native and cross-chain tokens available in ERC20**: DOT, ACA, aUSD, XBTC, LDOT, RENBTC. Try it [here](../../../build/development-guide/smart-contracts/advanced/use-native-tokens.md).
* Oracle contract to get price feed: this exposes the [Open Oracle Gateway](../../acala-introduction/#open-oracle-gateway) functionalities such as guaranteed Quality of Service. Try it [here](https://wiki.acala.network/build/development-guide/smart-contracts/advanced/use-oracle-feeds).
* On-chain auto-scheduler that enables use cases like subscriptions and recurring payments etc. Try it [here](../../../build/development-guide/smart-contracts/advanced/use-on-chain-scheduler/).
* Advanced contract deployment features like state renting to avoid scams and wastage of on-chain resources.
* More to come: we're gradually exposing more native functionalities to the Acala EVM, next to come is the DeFi primitives (DeX, stablecoin lending, and liquid staking).

Find out more on these contracts [here](https://github.com/AcalaNetwork/predeploy-contracts#predeployed-system-contract).


# EVM Account

## **Single Wallet, Single Account Experience**

Users can use **one extension/wallet**, and **a single Substrate account** to interact with the Substrate runtime, contracts in EVM, and wasm contracts or a hybrid of these. If a user wants to use a particular Ethereum address, then simply link it with his/her Substrate address (basically proving the user owns both addresses), thereafter the user can just use the Substrate account with [Polkadot{js} extension](https://wiki.polkadot.network/docs/en/learn-account-generation) or alike to sign any Ethereum transactions seamlessly.

This allows users to use all functionalities within Acala and cross-chain capabilities without managing multiple accounts or wallets.

{% content-ref url="../../../build/development-guide/smart-contracts/get-started-evm/evm-account.md" %}
[evm-account.md](../../../build/development-guide/smart-contracts/get-started-evm/evm-account.md)
{% endcontent-ref %}



# Flexible Fees

## **Pay Gas Fees in Virtually Any Token**

With the Acala EVM, fees can be paid in any accepted tokens, such as ACA, aUSD, DOT, and wrapped BTC. More tokens can be supported as native fee tokens with a simple governance approval.

Behind the scenes, Acala DEX is being used as a unified liquidity pool for settling the fees into the network token, but the experience is completely transparent to users and developers.


# No Dust Account

### **Avoid Dust Accounts**

Dust accounts are accounts with very little funds, generally less than the amount needed to conduct a transaction. Too many dust accounts add unnecessary data to the blockchain, which would make it difficult for full nodes to sync with the network (since every full node has a complete copy of the blockchain).

On the Acala network, an address is only active when it holds a minimum amount (exact number TBD). This minimum amount is called “Existential Deposit” (ED), similar to [ED on Polkadot](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-#:\~:text=On%20the%20Polkadot%20network%2C%20an,needed%20to%20conduct%20a%20transaction.). All native tokens e.g. DOT, ACA, aUSD, BTC etc. would have this feature, but it is not enforced upon ERC-20 tokens in the EVM.


# On-chain Scheduler

## **On-chain Automatic Scheduler**

On Ethereum and most other EVM platforms, there is no way to automatically schedule a transaction natively. This means many useful and perhaps essential financial services that we take for granted today, such as subscription, are not possible.

On Acala and Substrate, the automatic scheduler is a native feature of the blockchain. It is now made available in the Acala EVM in the form of pre-compiled contracts that any smart contract can call upon.

This will enable a wide range of use cases such as automatic and recurring payment rails, subscription services such as a Web3 version of Stripe, automatic profit-taking, reinvestment mechanisms, and a means to liquidate risky positions without external actors like keepers.

Try the auto-scheduler contract [here](../../../build/development-guide/smart-contracts/advanced/use-on-chain-scheduler/).


# Queryable & Lightweight

### **Keep Nodes Lightweight while Queryable**

We retain the standard Substrate node which is lightweight and easily maintainable. For querying transactions and event logs, we offer an indexer node that is open-sourced and anyone can run a copy of it like a full-node.

For convenience, we’d offer one docker image to run both nodes, but it is important that there’s a choice for people who want to run one or another for their purposes.


# Acala EVM+

## Acala EVM+ - Code Name: Project Bodhi

Acala and all Substrate-based chains are fundamentally different from Ethereum. If we are trying to emulate an Ethereum node, we will suffer from the worst of both worlds. It will be a step backward for us to inherit all the restrictions from a legacy blockchain platform.

We see EVM as one part of the Acala/Substrate/Polkadot, together the Acala network will provide a categorically different experience. Acala EVM will try to achieve these design goals

1. Enable users to have a complete full-stack Acala (and Substrate) experience seamlessly with a single wallet.
2. Enable protocol composability for EVM and runtime
3. Enable developers to develop and deploy DApps on Acala with great tooling support

The Acala EVM delivers the following benefits and features from the best of both Ethereum and Substrate platforms:

{% content-ref url="composable-defi-stack.md" %}
[composable-defi-stack.md](composable-defi-stack.md)
{% endcontent-ref %}

{% content-ref url="flexi-fees.md" %}
[flexi-fees.md](flexi-fees.md)
{% endcontent-ref %}

{% content-ref url="on-chain-scheduler.md" %}
[on-chain-scheduler.md](on-chain-scheduler.md)
{% endcontent-ref %}

{% content-ref url="../../../build/development-guide/smart-contracts/get-started-evm/evm-account.md" %}
[evm-account.md](../../../build/development-guide/smart-contracts/get-started-evm/evm-account.md)
{% endcontent-ref %}

{% content-ref url="queryable-and-lightweight.md" %}
[queryable-and-lightweight.md](queryable-and-lightweight.md)
{% endcontent-ref %}

{% content-ref url="upgradable-contracts.md" %}
[upgradable-contracts.md](upgradable-contracts.md)
{% endcontent-ref %}

{% content-ref url="compatible-toolings.md" %}
[compatible-toolings.md](compatible-toolings.md)
{% endcontent-ref %}

{% content-ref url="no-dust-account.md" %}
[no-dust-account.md](no-dust-account.md)
{% endcontent-ref %}


# Upgradable Contracts

### **Upgradeable Smart Contracts.**

In Acala EVM, developers no longer need to write complex migration contracts to fix bugs or make improvements to existing applications. The contract maintainer can simply send a transaction with the new contract byte-code to seamlessly upgrade the contracts, without the need to `migrate` users nor liquidity.

There’s also a two-staged deployment process to reduce the risk of directly testing on mainnet with the public.

* **Deployed Private Contract**: Once a contract is deployed, it is by default private to the public and visible only to the `Contract Maintainer` (who deployed the contract) and opt-in developers. All necessary testing and final verification can be done before making it public. `Contract Maintainer` can also remove the contract at this stage if needed.
* **Deployed Public Contract**: `Contract Maintainer` can make the contract public aka open business to the public.

To incentivize users to be mindful of acquiring storage on a public ledger, and also in effect to reduce scams, we use `State Renting` mechanism. `Contract Maintainer` is required to put up a bond when deploying a contract, which will be refunded when the contract is removed from the chain.

Some barriers of entry would encourage more responsible behaviors, and we are constantly researching the space for better mechanisms to achieve this.


# Existing Solutions

Current Substrate EVM compatibility solution i.e. [Frontier](https://github.com/paritytech/frontier) emulates the Ethereum node. It aims to implement the full set of Ethereum RPC and to emulate the Ethereum block production process. This allows existing Ethereum tools such as Metamask and Remix to work with a Frontier enabled node seamlessly.

Integrating Frontier has revealed the following challenges in order below by their severity:

## **1. Confined inside the EVM Sandbox**

Frontier allows users to interact with EVM via Metamask or other existing Ethereum tools, none of which fully support Substrate yet. Any functionalities from native modules of Substrate, such as Acala DeX, token pallets that support multiple currencies and cross-chain capability, and any other pallets built by any parachains such as margin trading pallet by Laminar can not be accessed via Metamask or other existing Ethereum tools.

This means users will need to use a Substrate wallet (e.g. Polkadot-js Extension) and Metamask at the same time if they ever want to taste the real power of Acala, Substrate or Polkadot for that matter. This is certainly a deal-breaker for us.

## **2. Making Nodes more Expensive**

[Frontier](https://github.com/paritytech/frontier) is heavy by design. Substrate does not store transactions by hash nor historical events, nor does it provide any event filtering ability. Substrate nodes are lightweight by design in order to minimize resource usage (disk space & CPU).

Ethereum nodes, on the other hand, allow users to query transactions by hash and offer powerful event log querying API. Frontier injects special block importing logic, storing the transactions and events into an off-chain auxiliary store in order to power the query API required by Ethereum.

This adds maintenance costs as it requires more powerful machines and larger disk space to operate a node. This goes against the goal to have a lightweight node to lower barriers for people from anywhere to run nodes which helps the network to be more decentralized.



# How does it work?

## The Stack

Project Bodhi is Acala’s answer to composable EVM compatibility.&#x20;

![](https://i.imgur.com/gYegu9s.png)

Instead of emulating the full Ethereum RPC node ([Frontier](https://github.com/paritytech/frontier) approach), we emulate the Ethereum JavaScript SDK client experience (by implementing a web3 provider as Bodhi.js).

This initiative has received an Open Grant from Web3 Foundation and is under development. Read more [here](https://github.com/AcalaNetwork/Open-Grants-Program/blob/master/applications/project\_bodhi.md).

## Get Started

Try out Acala EVM [here](../../build/development-guide/smart-contracts/get-started-evm/).


# Acala EVM

{% content-ref url="why-acala-evm.md" %}
[why-acala-evm.md](why-acala-evm.md)
{% endcontent-ref %}

{% content-ref url="existing-solutions.md" %}
[existing-solutions.md](existing-solutions.md)
{% endcontent-ref %}

{% content-ref url="acala-evm-composable-defi-stack/" %}
[acala-evm-composable-defi-stack](acala-evm-composable-defi-stack/)
{% endcontent-ref %}

{% content-ref url="how-does-it-work.md" %}
[how-does-it-work.md](how-does-it-work.md)
{% endcontent-ref %}

{% content-ref url="../../build/development-guide/smart-contracts/get-started-evm/" %}
[get-started-evm](../../build/development-guide/smart-contracts/get-started-evm/)
{% endcontent-ref %}


# Why Acala EVM+

## Why Acala EVM+

EVM is currently the most popular smart contract platform. Many new generation blockchains who claim to be faster and cheaper than Ethereum, would still keep the Ethereum compatibility, to attract Solidity developers allowing them to reuse existing toolchains and migrate existing contracts with minimal effort. Despite how bloated and expensive Ethereum has become, none of the challenger chains have taken any significant market share thus far.

It is clear to us that building a better, faster and cheaper Ethereum is not nearly enough. Just like Ethereum can do things Bitcoin can never do, which subsequently inspired many new innovations, Substrate and Polkadot are categorically different from Ethereum that will empower many new (chain level) innovations outside of the EVM sandbox.

On the Acala chain, there’re DeFi primitives (stablecoin, DEX and liquid staking), liquidity and users that can be tapped into, there are also innovations that are simply not possible on Ethereum - customizable economic policy, flexible fees, allowing users to pay transaction fee with any supported tokens; native cross-chain capabilities; on-chain governance apparatus (no more locked funds); full upgradability (no more contract migrations) and more.

We’d love to have all of these composable and compatible with EVM.


# Redenomination of ACA

Effective on April 6 2021, the total fixed supply of (new) ACA will increase 10 times to 1,000,000,000. ACA token distribution and token economics remain the same.

Acala chain is not live, so ACA redenomination does NOT have any impact on anyone, therefore this is for your information only.

Key Points for the redenomination:

* The total fixed supply of (old) ACA in the [whitepaper](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Acala\_Whitepaper.pdf) is 100,000,000.&#x20;
* After 10x redenomination, the total fixed supply of (new) ACA will increase 10 times to 1,000,000,000.&#x20;
* ACA balances will increase by a factor of 10.&#x20;
* The distribution of ACA does NOT change, and holders of ACA still own an equal share of the network as before the change. ACA token economics also does NOT change.
  * As an example, if an account has 1,000,000 (old) ACA that is 1% of the total supply, then after redenomination, the account would still have 1% of the total supply which is 10,000,000 (new) ACA.
* The main benefit of this change similar to the [redenomination of DOT](https://wiki.polkadot.network/docs/en/redenomination) is to avoid using small decimals when dealing with ACA and make calculations easier.
* The main benefit of doing this before mainnet is that redenomination is way simpler before the Acala chain is live, with less confusion and NO impact to users and service providers like exchanges and wallets, etc.&#x20;


# Single Account

## **Single Wallet, Single Account Experience**

Users can use **one extension/wallet**, and **a single Substrate account** to interact with the Substrate runtime, contracts in EVM, and wasm contracts or a hybrid of these. If a user wants to use a particular Ethereum address, then simply link it with his/her Substrate address \(basically proving the user owns both addresses\), thereafter the user can just use the Substrate account to sign any Ehtereum transactions seamlessly.

This allows users to use all functionalities within Acala and cross-chain capabilities without managing multiple accounts or wallets.

## Using Single Account

A user on Acala will always have a Substrate-based account that enables users to easily navigate multiple blockchains and sign any \(EVM and Susbtrate\) transactions with a single account. Read more on Acala Account [here](https://wiki.acala.network/learn/basics/acala-account). Follow the guide [here](https://wiki.acala.network/learn/get-started#create-a-polkadot-account) or [here](https://wiki.polkadot.network/docs/en/learn-account-generation) to generate an account.  

To enable Single Account and use Acala EVM, you either

1. generate an Ethereum address from the Substrate account OR
2. bind an existing Ethereum address to the Substrate account

### **1. Generate an EVM Account**

A user can generate an EVM address for each Substrate account. The user then can bind the EVM address to the Substrate account, so balances of native tokens e.g. DOT, renBTC, aUSD etc. on the Substrate account, are then available on the EVM address to use. 

In the Acala EVM, if funds are sent to a Substrate account without an associated EVM address, then an EVM address will be automatically generated and bound with the Substrate account.

Balances are automatically synchronized between the Substrate account and the associated EVM address. For example, a user teleports 10 renBTC to Acala, his/her balance will be shown in the Substrate account, the balance will also be shown and transferrable in the EVM address.

#### EVM Address Generation

The EVM Address is generated using prefix `evm` and the associated Substrate account with `blake2_256` hash function. Check out the source code [here](https://github.com/AcalaNetwork/Acala/blob/master/modules/evm-accounts/src/lib.rs#L185-L186).

```text
blake2_256(“evm:” ++ account_id)[0..20]
```

\[TODO\] step guide to generate and bind an EVM address.

### **2. Bind an Existing Ethereum Account**

In any case, if users want to use an existing Ethereum address in Acala EVM, this address will need to be claimed and bound to their Subatrate account.

One Substrate account can only be associated with one Ethereum address. A Substrate address already linked to a generated EVM address can no longer link to an existing Ethereum address and vice versa.

Binding an existing Ethereum address requires users to prove they own its private key, by signing a `claim` transaction.

#### Import an EVM account to Polkadot{js} Extension

\[TODO\]

#### Use Cases

Below are two potential use cases of binding an existing Ethereum address.

**Use Case 1**

For example, a DeFi protocol on Ethereum is now expanding its operation to Polkadot, by deploying their contracts on the Acala network. They will this new branch by airdropping tokens to their existing users if they also use the protocols on Acala.

The easiest way is to airdrop tokens to existing Ethereum addresses on Acala. Hence users would just bind their current Ethereum address to a Substrate address, use it for any EVM transactions, and receive airdrops.

**Use Case 2**

For DApps like [Linkdrop](https://linkdrop.io/), users are required to sign messages using Ethereum private key. Using Linkdrop on Acala, would require users to claim their existing Ethereum address, and bind it to their Substrate account. Thereafter they can send transactions on behalf of the Ethereum account.



# Oracle on Mandala Testnet

## Existing Oracles

* You can find currently available Oracle Providers [here](https://github.com/AcalaNetwork/Acala/blob/master/primitives/src/lib.rs#L174)
* Acala Oracle running on the Mandala Test Network [here](https://acala-testnet.subscan.io/runtime/OperatorMembershipAcala?version=606)
* One of the Acala Oracle Operators feeding prices on-chain [here](https://acala-testnet.subscan.io/account/5Fe3jZRbKes6aeuQ6HkcTvQeNhkkRPTXBwmNkuAPoimGEv45)

## Check States of an Oracle

![](../../../.gitbook/assets/acala-oracle.png)

As an example, checking Acala Oracle states, go to [Polkadot JS App](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fnode-6714447553211260928.rz.onfinality.io%2Fws#/chainstate) --> Developer --> Chainstate, select 'acalaOracle' and other query parameters to check operator membership, token prices etc.


---
description: Auctions are one of the stability mechanisms employed by the Honzon protocol.
---

# Auctions

* [Overview](https://wiki.acala.network/learn/basics/auctions#overview)
* [Mandala Test Network](https://wiki.acala.network/learn/basics/auctions#mandala-test-network)
  * [Surplus Auction](https://wiki.acala.network/learn/basics/auctions#surplus-auction)
    * [Start an Auction](https://wiki.acala.network/learn/basics/auctions#start-an-auction)
    * [Liquidator](https://wiki.acala.network/learn/basics/auctions#liquidator)
    * [Closing an Auction](https://wiki.acala.network/learn/basics/auctions#closing-an-auction)
  * [Debit Auction](https://wiki.acala.network/learn/basics/auctions#debit-auction)
  * [Collateral Auction](https://wiki.acala.network/learn/basics/auctions#collateral-auction)

## Overview

Auctions are one of the stability mechanisms employed by the Honzon protocol to maintain a strong peg between aUSD and US Dollar.

**Surplus Auction** When business as usual, the Honzon protocol through the `CDP Treasury` would accrue interests in aUSD from each loan. This surplus will firstly cover any outstanding debt in the system. Whenever this surplus reaches a predefined limit, the surplus in aUSD will be auctioned off for ACA which will then be burnt.

**Debt Auction** The `CDP Treasury` also keeps account of the system debt, that is if unsafe loans cannot be fully liquidated and debt cannot be fully repaid. If system surplus cannot cover the debt, then the `Debt Auction` will be triggered, and additional ACA could be minted to auction off to pay back outstanding aUSD debt.

**Collateral Auction** Each aUSD loan is created with a `required collateral ratio`, and its collateral ratio needs to be above the `liquidation ratio` to stay `safe`. The `liquidation ratio` is lower than the `required collateral ratio` to create a safety zone for each loan and avoid immediate liquidation upon creation. If the price of a collateral drops to a point where a loan's collateral ratio is less than the `liquidation ratio`, then a `Collateral Auction` is triggered to sell off the collaterals to pay off the aUSD debt.

## Mandala Test Network

### Surplus Auction

#### Start an Auction

Surplus auction criteria

```text
 1. Outstanding debt is cleared: debitPool = 0
 2. Surplus is over certain limit:  surplusPool > surplusBufferSize + surplusAuctionFixedSize
```

![](../../.gitbook/assets/auction_treasuryvalues.png)

This is checked each block. Whenever the criteria is met, a new auction is created.  External actors e.g. liquidators can monitor the `NewSurplusAuction` event.

![](https://github.com/AcalaNetwork/Acala/wiki/image/auction_newsurplus.png)

#### Liquidator

Use `Extrinsics` - `auction.Bid` to participate in auction.  The Console UI is more as an illustration than useful, as liquidators would be more likely as a bot or participate via a DApp UI \(coming soon\).

![](../../.gitbook/assets/auction_bid.png)

#### Closing an Auction

 Every new bid will increment bidding price more than the `minimumIncrementSize`, and extend auction time by the `auctionTimeToClose`. Until then if there is no more new bidders, the auction will close with the highest bidder winning. If the overall auction time reaches the `auctionDurationSoftCap`, then the `auctionTimeToClose` will half, and the `minimumIncrementSize` will double to expedite the process.

![](../../.gitbook/assets/auction_surplusvalues.png)

 Monitor the `AuctionDealed` event for closing an auction. \[TODO\] More events will be added.

![](../../.gitbook/assets/auction_auctiondealed.png)

### Debit Auction

Debit auction criteria

```text
1. surplusPool == 0
2. debitPool >= totalDebitInAuction + get_total_target_in_auction + debit_auction_fixed_size
```

\[TODO\] more details

### Collateral Auction

If a loan is unsafe, that is the collateral ratio of this loan is below the `liquidation ratio`, then it is deem to be liquidated by anyone with a reward.

 Use `Chain state` -&gt; `cdpEngine` -&gt; `liquidationRatio` to check.

![liquidation ratio](../../.gitbook/assets/honzon_liquidationratio.png)

Use `Extrinsics` -&gt; `honzon` -&gt; `liquidationPenalty` to check penalty. As an example, the `liquidation ratio` is 10%. It is applied on top of the debit amount and paid to the liquidator.

 Use `Extrinsics` -&gt; `honzon` -&gt; `liquidate` to liquidate a loan at danger. The liquidation action might trigger a collateral auction if it cannot complete the liquidation via Acala DeX within required slippage. \[TODO\] more details on DeX.

![liquidate](../../.gitbook/assets/auction_liquidate.png)

You can monitor the `NewCollateralAuction` to participate in one. 

![liquidate](../../.gitbook/assets/auction_liquidateevents.png)

The `target price` for the auction is made of `amount owed` + `penalty`. If bid price is greater than the `target`, then a reverse auction is triggered. Bidders would bid for the same price, how little asset they are willing to accept.


# Cross Chain DeFi

## Cross-chain DeFi with Acala

Acala is the DeFi shard aka the finance hub on Polkadot's multi-chain universe. It provides a suite of financial primitives including multi-collateralized stablecoin, trustless staking derivative and a decentralized exchange. These primitives are offered via Acala's DApp directly to the end-users, and also as SDKs for more DApps to be built upon. We foresee a more interconnected, autonomous, more sophisticated, cross-blockchain finance ecosystem at the crust of being fostered.

Here we will feature projects collaborating and experimenting with Acala.

### Laminar

Laminar Chain is a specialist high performance synthetic asset and margin trading chain based-on Substrate. It will use Acala Dollar (ticker: aUSD) as its base trading currency, to mint synthetic stablecoins such as EUR and JPY. It also introduces a variety of trading instruments including leveraged trading of forex pairs, gold, stocks, and synthetic crypto pairs BTCUSD and ETHUSD. Value transfer (at this stage aUSD) will implement [a token standard](https://github.com/w3f/PSPs/pull/3) accepted by the community.

### Ren

Ren is a reputable inter-blockchain asset bridge, currently bringing BTC, BCH and ZEC to fuel Ethereum DeFi use cases. Ren [builds with Acala](https://github.com/AcalaNetwork/Acala/wiki/U.-Build-with-Acala) by deploying its [RenVM bridge module](https://github.com/AcalaNetwork/Acala/tree/master/ecosystem-modules/ren/renvm-bridge) on the Acala network. The BTC gateway is provided by RenVM, while minting and burning of renBTC on Acala is provided by this gateway module. A couple of upfront benefits that Ren users would enjoy are as follows:

1. a brand new account with only freshly minted renBTC, can perform any transactions on Acala without needing a fee token. Thanks to Acala's flexible fee feature, tokens like renBTC is integrated natively as one of the default fee tokens alongside with ACA, aUSD and DOT.
2. to promote the usage of renBTC on Acala and wider Polkadot ecosystem, fees of minting renBTC can be waived without compromising security

Ren is a good example for DeFi projects considering gaining access to Polkadot's multi-chain ecosystem, and leveraging Acala's customized/optimized finance platform, without upfront economic and technical burdens for building a separate blockchain (or so called parachain).

## Mandala Test Network

On Mandala testnet the cross-chain functionality is provided by a trusted services, and will use Polkadot's XCMP (Cross-chain Message Passing) mechanism as soon as it becomes available.

### Laminar Chain

![lamianr](https://github.com/AcalaNetwork/Acala/wiki/image/cross-laminar.png)

* [Laminar Flow Exchange](https://flow.laminar.one/)
* [Get Started Guide](https://github.com/laminar-protocol/laminar-chain/wiki/1.-Get-Started)
* [Video: Margin Trading](https://youtu.be/s4pl6glM5kA)

#### Transfer aUSD to Laminar Chain

Go to `Wallet` --> tab `Cross-chain` --> select `Inter Polkadot Transfer`. Next, select `To Chain` "Laminar", set currency as "aUSD" and put the account you want to transfer to and put the amount of aUSD you would like to send across to Laminar Chain, and click `Transfer`. The aUSD will be send to the same account on Laminar Chain.

![transfer](https://i.imgur.com/0hcakPv.png)

#### Transfer aUSD back from Laminar Chain

![transferback](https://github.com/AcalaNetwork/Acala/wiki/image/cross-laminartoacala.png)

On [Laminar Flow Exchange](https://flow.laminar.one/), go to `Dashboard` --> click `transfer` next to aUSD, then simply put the amount of aUSD you would like to send across to Acala, and click `Confirm`. The aUSD will be send to the same account on Laminar Chain.

### Ren

![lamianr](https://github.com/AcalaNetwork/Acala/wiki/image/cross-renbtc.png)

#### Minting renBTC

On Mandala testnet, the faucet drips 0.2 renBTC each time, and capped at 1 renBTC/month/user. Upon canary network and mainnet, RenVM will be used for minting and burning renBTC.

![laminar](https://i.imgur.com/mCAKXyF.png)

#### Using renBTC

The collaboration with Ren will boost the asset classes available on Acala and bring brand new use cases for Bitcoin:

* renBTC can be used as collateral for aUSD credit facility
* renBTC can be traded on Acala DeX for other assets like DOT, LDOT, ACA, aUSD, XBTC
* Users can now take part in Polkadot Proof-of-Stake validation and earn staking returns by trading DOT and - using the staking derivative protocol
* Providing liquidity to DeX and earning additional yields is now a smooth flow
* aUSD can be transferred to the Laminar Chain for margin trading synthetic forex pairs e.g. EURUSD, gold and stocks, and synthetic BTC & ETH.


---
description: Liquidity provider is rewarded with exchange fee and an additional reward.
---

# Deposit & Earn

* [Overview](https://wiki.acala.network/learn/basics/deposit-and-earn#overview)
* [Mandala Test Network](https://wiki.acala.network/learn/basics/deposit-and-earn#mandala-test-network)
  * [Via Web DApp](https://wiki.acala.network/learn/basics/deposit-and-earn#via-web-dapp)
    * [Deposit Liquidity](https://wiki.acala.network/learn/basics/deposit-and-earn#deposit-liquidity)
    * [Withdraw Liquidity](https://wiki.acala.network/learn/basics/deposit-and-earn#withdraw-liquidity)
    * [Withdraw Reward](https://wiki.acala.network/learn/basics/deposit-and-earn#withdraw-reward)

## Overview

DeX \(Decentralized Exchange\) on Acala allows users to quickly swap one token to another and serves three-fold purposes for the platform:

1. **provide liquidity to bootstrap the ecosystem**: there will be markets for bridged in assets like BTC and ETH, as well as DOT, ACA and aUSD.
2. **as a complimentary facility for stablecoin liquidation mechanism to improve stability and reduce risk**: when a liquidation being triggered, the Honzon stablecoin protocol will sell the assets off on the DeX instead of on an auction, if slippage is acceptable.
3. **improve usability**: users can pay fees in the transacting token e.g. aUSD rather than being restricted to the network token ACA

Acala DeX, inspired by Uniswap, uses constant-product mechanism and is implemented as runtime modules hence better integrated with other protocols. Each trading pair using aUSD as base token e.g. BTC/aUSD is represented as an exchange pool. The exchange rate is set by the first liquidity provider by the amount of each token he/she deposits, and will be adjusted over time through arbitrage.

Liquidity provider is rewarded with **exchange fee** and **an additional reward** \(from stability fee profit share\), as liquidity here not only serve users for token swap, but also serve the Honzon stablecoin protocol for liquidation.

## Mandala Test Network

### Via Web DApp

#### Deposit Liquidity

![Dapp](../../.gitbook/assets/depositearn_deposit.png)

#### Withdraw Liquidity

 Note: withdrawn amount is NOT token amount, but a share amount reflecting your contribution to a particular liquidity pool.

![](../../.gitbook/assets/depositearn_withdraw.png)

#### Withdraw Reward

 These are the additional profit share from stability fee revenue to recognize the contribution of DeX liquidity towards stability of aUSD.

![](../../.gitbook/assets/depositearn_reward.png)



---
description: Acala DeX Protocol
---

# DeX

* [Overview](https://wiki.acala.network/learn/basics/dex#overview)
* [Guide](https://wiki.acala.network/learn/basics/dex#guide)
  * [Via Acala App](https://wiki.acala.network/learn/basics/dex#via-acala-app)
  * [Via Polkadot UI](https://wiki.acala.network/learn/basics/dex#via-polkadot-ui)
    * [Check Exchange](https://wiki.acala.network/learn/basics/dex#check-exchange)
    * [Swap](https://wiki.acala.network/learn/basics/dex#swap)

## Overview

The Acala DeX protocol is inspired by Uniswap, but built as a runtime module as part of the Acala Substrate chain to serve the aUSD community. Each liquidity pool contains a balance of two tokens, and the exchange rate is simply the amount of one token divides that of the other. Users enjoys instant token swap without the need for an order book, whereas liquidity provider could supply liquidity of the two tokens in a pool to earn a fee.

Refer to [Deposit & Earn](https://wiki.acala.network/learn/basics/deposit-and-earn) for liquidity provider returns.

## Guide

1. Check Exchange Rate
2. Swap Tokens

### Via Acala App

![Dapp](../../.gitbook/assets/dex_app.png)

### Via Polkadot UI

#### Check Exchange

Use `Chain state` -&gt; `dex` -&gt; `liquidityPool` to check the amount of aUSD and the amount of selected token in the pool Convert the hex value to number.

![exchange rate](../../.gitbook/assets/dex_liquiditypool.png)

* number of DOT tokens `0x00000000000000003d055121747a4273` as `4397009815327097459`
* number of aUSD tokens `0x000000000000003babfb8f48dfeed58e` as `1100750556691660985742`
* exchange rate \(DOT to aUSD\) = number of aUSD tokens / number of DOT tokens = 250

#### Swap

Use `Extrinsics` -&gt; `dex` -&gt; `swapCurrency` to swap tokens.

![swap](../../.gitbook/assets/dex_swap.png)

* `Supply` is the token you pay
* `Target` is the token you want to buy, target price also covers for slippage


# How to change default fee token

## Default Fee Token

You can check default fee token order on-chain, go to [Polkadot Webapp](https://polkadot.js.org/apps) - Select the chain (Acala or Karura)

Navigate to `Developer` - `Chain state` > `Constants` >`transactionPayment defaultFeeSwapPathList`

![](<../../.gitbook/assets/Screen Shot 2021-08-04 at 9.06.14 PM.png>)

On Acala, the order might be ACA > aUSD > LCDOT > DOT.

If a user has no ACA balance, then aUSD will automatically be used as fee token.

Users can set their next default fee token to other tokens by executing the following transaction:

```
transactionPayment.setAlternativeFeeSwapPath(fee_swap_path)
```


# How to Verify a Runtime Upgrade

This guide uses the runtime upgrade release 1.1.3 as an example.

Once the upgrade is proposed, you shall see it on the [Polkadot App - Karura parachain - Democracy section](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkarura-rpc-2.aca-api.network%2Fws#/democracy).

![](<../../.gitbook/assets/Screen Shot 2021-07-14 at 10.22.16 PM.png>)

## Upgrade Preimage Info

Expand the proposal, and find the Preimage info.

* Preimage: `parachainSystem.authorizeUpgrade(0xd9660e7d73163f7b2e1591c08c60e68f4b47cb85dcba54d55c53b9573876f55e)`\
  &#x20;
* Hash: `0x4f8bf2c02c5a1e8cdcf7a94dabf2805c563c46a87876c684c5d79ffb745db115`

## Verify against code

In the discussion post of the proposal, it shall provide the release tag, runtime WASM file and other necessary information for others to verify it against the preimage proposed.

* Release page: [https://github.com/AcalaNetwork/Acala/releases/tag/1.1.3](https://github.com/AcalaNetwork/Acala/releases/tag/1.1.3)
* Runtime Wasm: [https://gateway.pinata.cloud/ipfs/QmTrUJragkgGrp3eNyun7n7p5zT8MFLE3s87o3ZJSyj4wf](https://gateway.pinata.cloud/ipfs/QmTrUJragkgGrp3eNyun7n7p5zT8MFLE3s87o3ZJSyj4wf)

### Take the following step to verify

#### 1. Build your own Wasm Runtime for the release

* srtool is used to build wasm
  * More about srtool:
    * [https://www.chevdor.com/post/2019/12/06/srtool/](https://www.chevdor.com/post/2019/12/06/srtool/)
    * [https://github.com/paritytech/srtool](https://github.com/paritytech/srtool)
* follow these steps to build
  * Install Docker
    * [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
  * Clone Acala repo
    * `git clone https://github.com/AcalaNetwork/Acala.git`
  * Checkout release branch
    * `git checkout release-karura-1.1.3`
  * Build with srtool
    * `make srtool-build-wasm-karur`
  * Wait for compiling done and your wasm is built

#### 2. Generate hash & compare

In the `Developer - Extrinsics` tab, use the following and upload the wasm to generate the call hash. Compare this with the preimage hash proposed.&#x20;

![](<../../.gitbook/assets/image (76).png>)


# How to Verify Referendum Proposal

Navigate to [Polkadot JS App](https://polkadot.js.org/apps/#/explorer) - select intended network e.g. Acala or Karura, then select `Developer` - `Extrinsics`

Click on the `Decode` tab on top of the page.

Put the hex-encoded proposal in the `hex-ecoded-call` input box.

The content of the proposal shall automatically displayed on the page to be verified.

At the bottom of the page, the `encoded call hash` shall be checked against the actual proposal on-chain.


# Participate in Democracy

The public Referenda Chamber is one of the three bodies alongside the General Council (and its sub-councils) and the Technical Committee governing the Karura network. Public referenda can be proposed and voted by any token holder with a bond. Every voting period, one proposal with the most support (# of seconds) will be moved to the referenda table for public voting. Voters who are willing to lock up tokens for a greater duration of time can have their votes amplified. This is largely modeled from the [Polkadot governance system](https://wiki.polkadot.network/docs/learn-governance) with Karura/Acala customization.&#x20;

## Governance Parameters

These are important governance parameters, which may change over time as we progress through the governance phases.

* Launch Period: Public referenda is every **2 days**
* Voting Period: Votes are tallied every **2 days**
* Emergency Voting Period: Voting period for fast-tracked emergency referendum is **3 Hours**
* Minimum Deposit: Proposing a referendum requires a minimum deposit of **100 KAR**
* Enactment Period: Minimum period for locking funds and the period between a proposal being approved and enacted is **1 day**
* Cool-off Period: Vetoed proposal may not be re-submitted within **7 days**

Most of these parameters are visible on the Polkadot App. You can also view upcoming governance events on `the Event Calendar`

![](<../../.gitbook/assets/Screen Shot 2021-07-15 at 2.20.23 PM.png>)

## Propose a Referendum

A referendum consists of some action that you want to propose. If voted in by token holders, then the action will be enacted on-chain automatically. You are required to bond some tokens to propose an action. Once a proposal is submitted, it can not be canceled.&#x20;

On the [Polkadot Apps - Karura parachain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkarura-rpc-1.aca-api.network#/democracy), you can use the “Democracy” tab to make a new proposal. The action, such as 'force transfer balance from account A to account B', is encoded in a preimage, and the hash of the action is called preimage hash.&#x20;

Since the preimage can be quite large (hence costly to submit), you can submit a Proposal first which includes the preimage hash only, and submit the preimage (or have someone else submit it for you) later but before voting completes.

### Step 1: Submit a Proposal

#### Get the preimage hash&#x20;

By clicking on the `Submit preimage` button, then fill in the action you want to propose, copy and note down the preimage hash `0x244fcb51680c90172ba55241d3d9229676c4471a4645aed223a2272b33264026`. Once you noted down the hash, you can now cancel the prompt.&#x20;

![](<../../.gitbook/assets/Screen Shot 2021-07-09 at 6.34.14 PM.png>)

#### Submit a proposal

Submit a proposal by clicking on the `Submit a proposal` button, and pasting in the preimage hash to submit it. Then the proposal shall appear in the proposal table.&#x20;

![](https://lh5.googleusercontent.com/pzSjpt4wxQscdDdnjIFNE0iCRxLcPGHdJoEfXXaf8E7FIHfg66C0FSKIaoky0QMa3v0sl\_E9LoJ1x0b\_30X-2zzAZBZbijf8RhuMu\_1J2UFapoaaDl0cIE58l7k3nw30nYaK0rCu)

### Step 2: Submit a Preimage

Before voting of your proposal completes, you will need to submit the actual preimage. Otherwise, it cannot be enacted on-chain. You can repeat the ‘Submit a preimage’ process as previously mentioned, and click the ‘Submit preimage’ button to send the transaction.

## Vote on a Referenda

To Vote on Referenda, you must hold KAR tokens and these tokens must be held in a wallet that has the functionality to participate in Democracy like Polkadot.js. If you don't have your tokens in Polkadot.js wallet, you can read more about [account generation](../../get-started/get-started/karura-account/).

Once a proposal is in as a referendum, it will show up in the referenda table. You can navigate to the [Polkadot Apps - Karura Parachain Democracy](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkarura-rpc-1.aca-api.network#/democracy) to cast your vote.

![](<../../.gitbook/assets/Screen Shot 2021-07-12 at 10.39.29 AM.png>)

You can click on the ‘Vote’ button to vote. Select "Vote Aye" to support the proposal, and select "Vote Nay" to disapprove the proposal.&#x20;

You can also increase your conviction with the same number of tokens by locking them. The longer you are willing to lock your tokens, the stronger your vote will be weighted. Read more on [voting](https://wiki.polkadot.network/docs/maintain-guides-democracy/#voting-on-a-proposal) and [tallying](https://wiki.polkadot.network/docs/learn-governance#tallying).

![](<../../.gitbook/assets/Screen Shot 2021-07-21 at 5.02.21 PM.png>)

## Unlock locked tokens

You will need to explicitly unlock these tokens once the locking period ends. You can go to the `Accounts` page, click the menu button for the voted account, and select the menu item`Clear expired democracy locks` to claim it back. Read more [here](https://wiki.polkadot.network/docs/maintain-guides-democracy/#unlocking-locked-tokens).&#x20;

![](<../../.gitbook/assets/Screen Shot 2021-07-20 at 10.11.09 AM.png>)

### Check Locked Democracy Votes

Go to `Developer` - `Chain state`, then select `democracy` and `locks`. Select the account used for voting in the dropdown, and click the `+` button to see whether there's locked votes, and if any how long they are locked for.

![](<../../.gitbook/assets/Screen Shot 2021-07-21 at 5.04.35 PM.png>)

## Delegate Vote

You can delegate your vote to others to vote on your behalf. On [the Polkadot Apps - Karura parachain,](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkarura-rpc-1.aca-api.network#/extrinsics) go to the `Developer` tab -- `Extrinsics` , then select `democracy.delegate` .

![](<../../.gitbook/assets/Screen Shot 2021-07-09 at 7.05.20 PM.png>)


---
description: The development direction.
---

# Governance Overview

Acala takes a phased approach to employ various governance mechanisms that will allow it to progressively decentralize and ultimately be commanded by the majority network stakeholders. Acala's governance framework is based on Polkadot's technology that employs a **Referenda chamber**, **a General Council**, and **a Technical Committee** to govern the network.

Acala however has sub councils that manage specialized aspects of the network including the **Financial Council** and the **Homa Staking Council**.&#x20;

## Referenda

Referenda is a simple, inclusive, stake-based voting scheme. Referenda can be started by public proposals or council proposals. There is an enactment delay period associated with it. Emergency proposals (e.g. fix urgent network issues) can be "fast-tracked" to have a shorter enactment period.&#x20;

Acala experiments with Polkadot's voting mechanisms including Tallying, Voluntary Locking, Adaptive Quorum Biasing. Read more [here](https://wiki.polkadot.network/docs/learn-governance/#referenda).&#x20;

## Councils

### General Council

Acala will initially be governed by a Referenda chamber together with a General Council appointed by the Acala Foundation whose decisions regarding the network such as runtime upgrades, resolving network issues and improvements are made transparent on-chain. Meanwhile, any ACA holders can propose any changes to the network, protocols and the Acala Treasury will be collectively voted for or against via the Referenda chamber. The General Council then provides oversight with veto rights to stop proposals that may deem malicious, posing security risks or not in the best interest of the Acala network.

Once the network is sufficiently bootstrapped, stabilized, and security measures are in place, a Referenda will be started to move governance to the Elected Council phase where the candidacy of councilors is open, and councilors are elected by public voting.&#x20;

### Financial Council

Overseeing updates of stablecoin protocol parameters, and other protocol fee parameters

* Elected by the General Council via 2/3 approval rating.&#x20;

### Homa Staking Council

Overseeing updates of Liquid Staking parameters e.g. validator selection

* Elected by ACA holders.

### Oracle Collective

Electing Oracle operators. Membership of the [Oracle Gateway](../acala-introduction/#open-oracle-gateway) requires approval from the General Council, which is essentially a Proof-of-Authority model that only authorized trusted operators can provide price feeds into the network. This model will evolve with the contemporary R\&D on the Oracle problem.

* Elected by the General Council via 2/3 approval rating.&#x20;

## Technical Committee

Fastracking emergency proposals that are critical to the network operation, delaying an enactment, and canceling uncontroversially dangerous proposals.&#x20;

* Elected by the General Council via 2/3 approval rating.&#x20;

## Emergency Actions

* Fasttrack a scheduled task to 12 hours+
  * Requires: 1/3+ Technical Committee consensus
* Fasttrack a scheduled task to <12 hours
  * Requires: 2/3+ Technical Committee consensus
* Delay a scheduled task for up to 48 hours
  * Requires: 1/3 Technical Committee consensus
* Cancel a scheduled task
  * Requires: from schedule Origin OR
  * 3/4+ General Council consensus


# Flexible Fees

Any accepted tokens can be used as transaction fees on the Acala Network. Transaction fees are  ultimately settled in the network native token ACA. Therefore a fee token must have a liquidity pool with the Acala stablecoin, which will create a route to the native token ACA.&#x20;

The system will automatically find the next available and supported fee token if the default token has zero balance.&#x20;

* Acala Network
  * Default fee token: ACA
  * Default order: ACA > aUSD > DOT > LDOT
* Karura Network
  * Default fee token: KAR
  * Default order: KAR > kUSD > KSM > LKSM


# Treasury

[Watch the Acala Treasury intro video](https://www.youtube.com/watch?v=Wh8g89OPFH8)&#x20;

The Acala Treasury is a reserve of digital tokens, native and foreign to the Acala ecosystem, stewarded by ACA holders and funded from Acala protocol fees and community contribution events with the purpose of enabling long-term network self-sustainability and growth.

Deployment of the Treasury is primarily focused on

* Self-funding a parachain slots on Polkadot
* Bootstrapping protocol liquidity (e.g. provide LKSM, kUSD or DEX pair liquidity)
* Platform and protocol operations and improvements
* Network security operations and enhancements

Further surplus can be deployed for

* Software and tool development
* Community, marketing, and event funding
* Any other future community Karura Treasury Proposals (KTPs)

## Existential Goal

The primary objective of the Acala Treasury is to build up its DOT reserve to ensure Acala has a sustainable reservoir of DOT to lease a parachain slot from Kusama for the foreseeable future. The Treasury can trustlessly deploy the tokens to bond a parachain for itself to sustain its operation, bootstrap liquidity of the DeFi protocols on Acala to solve the chick-and-egg problem of market makers and takers hence benefiting the entire network.


---
description: The evolution of the Acala Network will be marked by trilogy networks.
---

# Trilogy Networks

The evolution of the Acala is marked by trilogy networks. Acala stablecoin protocol, Acalaswap protocol and Homa staking protocol are deployed on all three networks:

* **#1 Mandala Test Network**: is a risk-free and value-free playground for us, users and developers to test drive functionalities of Acala. Expect bugs, chaos, and unannounced reboots. Find out Mandala Testnet details [here](../get-started/networks.md).
* **#2 Karura Network**: is an unaudited and experimental release of Acala protocols on the Kusama network as a parachain. It will have economic value represented as its native tokens KAR, and KSM, both of which can be used as reserve assets of the stablecoin. Find out Karura Network details [here](../integrate/karura/endpoints.md).
* **#3 Acala Network**: is deployed on the Polkadot network as parachain upon its launch.


---
description: Introduction of the Acala modules.
---

# Modules

## Honzon Stablecoin Modules

### [auction\_manager](https://github.com/AcalaNetwork/Acala/tree/master/modules/auction-manager)

`auction_manager` module starts and manages various types of auctions - `surplus auction` when accrued interests exceeds certain limit, `debt auction` when unpaid debt from liquidated positions exceeds certain limit, and `collateral auction` when a position is being liquidated.

**Surplus Auction** When business as usual, the Honzon protocol through the `CDP Treasury` would accrue interests in aUSD from each loan. This surplus will firstly cover any outstanding debt in the system. Whenever this surplus reaches a predefined limit, the surplus in aUSD will be auctioned off for ACA which will then be burnt.

**Debt Auction** The `CDP Treasury` also keeps account of the system debt, that is if unsafe loans cannot be fully liquidated and debt cannot be fully repaid. If system surplus cannot cover the debt, then the `Debt Auction` will be triggered, and additional ACA could be minted to auction off to pay back outstanding aUSD debt.

**Collateral Auction** Each aUSD loan is created with a `required collateral ratio`, and its collateral ratio needs to be above the `liquidation ratio` to stay `safe`. The `liquidation ratio` is lower than the `required collateral ratio` to create a safety zone for each loan and avoid immediate liquidation upon creation. If the price of a collateral drops to a point where a loan's collateral ratio is less than the `liquidation ratio`, then a `Collateral Auction` is triggered to sell off the collaterals to pay off the aUSD debt.

Generally all three types of auctions follow similar formats except `debt auction` has a preset auction end time while the other two are open ended:

* new bid price needs to be >= `old bid` + `target price` \* `minimum increment` (`minimum increment` as percentage) e.g. old bid = $5, target price = $100, min. increment = 5%, then new bid price needs to be >= $10
* if bid price exceeds `target price`, a reverse auction starts
* if no more new bids, the auction will last till `the last bid time` + `AuctionTimeToClose` (in block number)
* if the auction goes on, and exceeds the `AuctionDurationSoftCap` (also in block number), then every new bid's `AuctionTimeToClose` will be halved, `minimum increment` doubled to speed up the auction

### [cdp\_engine](https://github.com/AcalaNetwork/Acala/tree/master/modules/cdp-engine)

`cdp_engine` manages automated liquidation and collateral settlement via off-chain worker, and a set of risk parameters - `stability fee`, `liquidation ratio`, `liquidation penalty`, `required collateral ratio` and `maximum total debit value`.

**`stability fee`** or interest rate charged for aUSD loans are collected every block. aUSD owned plus accumulated stability fee / interest is recorded as `debit units`, the debit exchange rate is updated every block. The [`DebitExchangeRateConvertor`](https://github.com/AcalaNetwork/Acala/blob/master/modules/cdp-engine/src/debit\_exchange\_rate\_convertor.rs) to calculate how much aUSD is owed. Fees collected are added to the `cdp_treasury` surplus pool.

**`Offchain Worker`** is run at the end of every block. Only one `Offchain Worker` is run at a time by acquiring a lock before the job and releasing it after the job.

* Automated liquidation: the `Offchain Worker` would iterate through all loans and liquidate those that are `unsafe`, that is current collateral ratio is below the `liquidation ratio`. It will firstly obtain aUSD directly from the DeX given acceptable slippage, otherwise it will create collateral auction to pay back outstanding debt remain.
* Collateral settlement: during emergency shutdown, settle all loans by collecting collaterals into `cdp_treasury` and clear debt balance.

### [cdp\_treasury](https://github.com/AcalaNetwork/Acala/tree/master/modules/cdp-treasury)

`cdp_treasury` manages system global `DebitPool` and `SurplusPool`, and surplus, debit and collateral auction parameters.

During auctions, once there's an accepted bid, the amount of surplus, debit or collateral will be transferred to the `cdp_treasury`. If there's a new accepted bid, then it will be refunded to the original account. This ensure security of required funds to the system.

`on_system_surplus` - when there's surplus incurred e.g. stability fees collected, it will be added to the `cdp_treasury`. This surplus would be used to pay for system debt first, but if it exceeds a certain limit, then a `surplus auction` will be triggered. `on_system_debit` - when an aUSD loan is liquidated, the debt is added to `cdp_treasury`.

### [honzon](https://github.com/AcalaNetwork/Acala/blob/master/modules/honzon)

`honzon` is the main interaction point for stablecoin users. It provides the following public functions:

`adjust_loan` - use this to open or update an aUSD loan position. `transfer_loan_from` - use this to transfer the entire balance of a given aUSD loan from one account to another account. The account needs to be `authorized` first. `liquidate_cdp` - this is kinda depreciated as an offchain worker is implemented in `cdp_engine` to handle this automatically. `settle_cdp` - this is kinda depreciated as an offchain worker is implemented in `cdp_engine` to handle this automatically.

### [loans](https://github.com/AcalaNetwork/Acala/blob/master/modules/loans)

`loans` manages all debit balances and collateral balances for all collaterals and accounts in a double map.

`adjust_position` - create or update an aUSD loan position - deposit/withdraw collaterals, borrow/pay back aUSDs, it will validate various conditions and check risk parameters before making adjustment.

`transfer_loan` - transfer the entire balance of a given aUSD loan from one account to another account.

## [emergency\_shutdown](https://github.com/AcalaNetwork/Acala/tree/master/modules/emergency-shutdown)

`emergency_shutdown` is one of the risk management instruments in particular as a last resort to stop and settle the Honzon protocol to protect the assets of both aUSD and loan holders. The shutdown can apply to one or more collateral asset and associated loans.

`emergency_shutdown` - locks price for collaterals, stops opening new loans, stops all auctions, settles outstanding loans, return remaining collaterals to owners.

Note: a collateral asset can be `shut down` individually, not via the `emergency_shutdown` module, but via setting `set_global_params` in the `cdp_engine` module, to cap the `maximum_total_debit_value` (debt ceiling) to stop new loans being opened, and raise `liquidation_ratio` gradually to settle outstanding loans.

## Decentralized Exchange

\[TODO]

## General

### [currencies](https://github.com/AcalaNetwork/Acala/tree/master/modules/currencies)

Acala Network is a multi-token network. The native network token aka ACA is managed by the `balances` pallet. All other tokens are managed by [`tokens` module](https://github.com/laminar-protocol/open-runtime-module-library/tree/master/tokens). The [`currency` module](https://github.com/laminar-protocol/open-runtime-module-library/tree/master/currencies) realizes the multi-token support by combining the two.

`accounts` handles special transfers e.g. free transfers for given conditions, e.g. when certain amount of native token ACA is deposited and locked, then certain number of free transfer transactions are enabled.

### airdrop

\[TODO]

### [primitives](https://github.com/AcalaNetwork/Acala/tree/master/modules/primitives)

`CurrencyId` lists all supported tokens on the network. `AirDropCurrencyId` lists airdrop tokens, this is available on `Mandala Network` to record canary network and mainnet token airdrop balances. It will be used for token claim once those two later networks are launched.

---
description: Acala Runtime Events
---

# Runtime Events

## Auction Related

| Event                | Parameters                                                                                                                                                                                                               | Description                | Module         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | -------------- |
| NewCollateralAuction | 1. `AuctionId` : new collateral auction id\</br> 2. `CurrencyId` : collateral type\</br> 3. `Balance` : collateral amount\</br> 4. `Balance` : target aUSD amount, when bid >= target, auction is in reverse stage\</br> | collateral auction created | AuctionManager |
| NewDebitAuction      | 1. `AuctionId` : auction id\</br> 2. `Balance` : initial avalible ACA amount \</br> 3. `Balance` : fixed aUSD amount, bid must >= it\</br>                                                                               | debit auction created      | AuctionManager |
| NewSurplusAuction    | 1. `AuctionId` : auction id\</br> 2. `Balance` : aUSD amount of surplus\</br>                                                                                                                                            | surplus auction created    | AuctionManager |
| CancelAuction        | 1. `AuctionId` : auction id\</br>                                                                                                                                                                                        | auction canceled           | AuctionManager |
| AuctionDealed        | 1. `AuctionId` : auction id\</br>                                                                                                                                                                                        | auction dealed             | AuctionManager |
| Bid                  | 1. `AuctionId` : auction id\</br> 2. `AccountId` : bidder address \</br> 3. `Balance` : bid price\</br>                                                                                                                  | bid succeeded              | Auction        |

## DEX Related

| Event             | Parameters                                                                                                                                                                                                                                                                   | Description                           | Module |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------ |
| AddLiquidity      | 1. `AccountId` : who add liquidity to pool\</br> 2. `CurrencyId` : specific liquidity pool of **other token** / aUSD pair\</br> 3. `Balance` : other token amount added\</br> 4. `Balance` : aUSD amount added\</br> 5. `Share` : increased share amount\</br>               | add liquidity to specific pool        | Dex    |
| WithdrawLiquidity | 1. `AccountId` : who withdraw liquidity from pool\</br> 2. `CurrencyId` : specific liquidity pool of **other token** / aUSD pair\</br> 3. `Balance` : other token amount withdrew \</br> 4. `Balance` : aUSD amount withdrew\</br> 5. `Share` : decreased share amount\</br> | withdraw liquidity from specific pool | Dex    |
| Swap              | 1. `AccountId` : exchanger\</br> 2. `CurrencyId` : the token type which exchanger sold to DEX \</br> 3. `Balance` : amount of sold token \</br> 4. `CurrencyId` : the token type which exchanger bought from DEX\</br> 5. `Balance` : amount of bought token\</br>           | swap token to another token with DEX  | Dex    |

## Homa Related

| Event                  | Parameters                                                                                                                                                                                                  | Description                                    | Module      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| BondAndMint            | 1. `AccountId` : caller\</br> 2. `Balance` : DOT amount to bond by homa protocol \</br> 3. `Balance` : issued LDOT amount to caller\</br>                                                                   | lock DOT to Homa protocal and issue liquid DOT | StakingPool |
| RedeemByUnbond         | 1. `AccountId` : caller\</br> 2. `Balance` : amount of LDOT to redeem\</br>                                                                                                                                 | redeem DOT by normal unbonding                 | StakingPool |
| RedeemByFreeUnbonded   | 1. `AccountId` : caller\</br> 2. `Balance` : fee in LDOT\</br> 3. `Balance` : LDOT amount to redeem\</br> 4. `Balance` : redeemed DOT amount\</br>                                                          | redeem DOT directly with Homa free pool        | StakingPool |
| RedeemByClaimUnbonding | 1. `AccountId` : caller\</br> 2. `EraIndex`: target era index to claim redeption\</br> 3. `Balance` : fee in LDOT\</br> 4. `Balance` : LDOT amount to redeem\</br> 5. `Balance` : redeemed DOT amount\</br> | redeem DOT by claiming unbonding               | StakingPool |

## CDP Related

| Event                        | Parameters                                                                                                                                                                                                                                                                                                                                                                                      | Description                                                                                                   | Module    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------- |
| Authorization                | 1. `AccountId` : authorizer account\</br> 2. `AccountId` : the authorized account\</br> 3. `CurrencyId` : the authorized loan type\</br>                                                                                                                                                                                                                                                        | An account authorize other account to manipulate its specific type of loan                                    | Honzon    |
| UnAuthorization              | 1. `AccountId` : authorizer account\</br> 2. `AccountId` : the authorized account\</br> 3. `CurrencyId` : the authorized loan type\</br>                                                                                                                                                                                                                                                        | authorizer account revoke the right of authorized account to manipulate specific type of loan                 | Honzon    |
| UnAuthorizationAll           | 1. `AccountId` : authorizer account\</br>                                                                                                                                                                                                                                                                                                                                                       | account revoked all authorization to other accounts with all loan types                                       | Honzon    |
| LiquidateUnsafeCDP           | 1. `CurrencyId` : collateral token type\</br> 2. `AccountId` : owner of the liquidated CDP\</br> 3. `Balance` : the confiscated amount for liquidation\</br> 4. `Balance` : the bad debt amount(in aUSD) produced by the liquidated Cdp\</br>                                                                                                                                                   | liquidate an unsafe CDP                                                                                       | CdpEngine |
| SettleCDPInDebit             | 1. `CurrencyId` : collateral token type\</br> 2. `AccountId` : owner of the settled CDP\</br>                                                                                                                                                                                                                                                                                                   | settle a CDP has debit after emergency shutdown begin                                                         | CdpEngine |
| UpdatePosition               | 1. `AccountId` : CDP's owner\</br> 2. `CurrencyId` : CDP's collateral type\</br> 3. `Amount` : collateral adjustment amount, positive means collateral increased, negative means collateral decreased\</br> 4. `DebitAmount` : debit adjustment amount, positive means CDP's debit increased and owner get more aUSD loan, negative means CDP's debit decreased and owner repay some debt\</br> | cdp owner manipulate his loan and collateral                                                                  | Loans     |
| ConfiscateCollateralAndDebit | 1. `AccountId` : CDP's owner\</br> 2. `CurrencyId` : CDP's collateral type\</br> 3. `Balance` : collateral amount to be confiscated \</br> 4. `DebitBalance` : debit balance to be confiscated \</br>                                                                                                                                                                                           | emit by system operations for CDPs, such as settlement, liquidation                                           | Loans     |
| TransferLoan                 | 1. `AccountId` : sender\</br> 2. `AccountId` : receiver\</br> 3. `CurrencyId` : collateral type\</br>                                                                                                                                                                                                                                                                                           | sender transfer his whole specific collateral CDP(include all collateral amount and debit amount) to receiver | Loans     |

## Emergency Shutdown Related

| Event      | Parameters                                                       | Description               | Module            |
| ---------- | ---------------------------------------------------------------- | ------------------------- | ----------------- |
| Shutdown   | 1. `BlockNumber` : block number the emergency shutdown occurs    | system emergency shutdown | EmergencyShutdown |
| OpenRefund | 1. `BlockNumber` : block number when refund operation is allowed | refund operation opened   | EmergencyShutdown |
| Refund     | 1. `Balance` : aUSD amount used to refund                        | refund succeeded          | EmergencyShutdown |

## Risk Management Parameters Related

| Event                              | Parameters                                                                                                                 | Description   | Module      |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------- |
| UpdateStabilityFee                 | 1. `CurrencyId` : collateral type\</br> 2. `Option<Rate>` : extra stalibity fee rate                                       | param updated | CdpEngine   |
| UpdateLiquidationRatio             | 1. `CurrencyId` : collateral type\</br> 2. `Option<Ratio>` : liquidation ratio                                             | param updated | CdpEngine   |
| UpdateLiquidationPenalty           | 1. `CurrencyId` : collateral type\</br> 2. `Option<Rate>` : extra penalty rate when CDP liquidated                         | param updated | CdpEngine   |
| UpdateRequiredCollateralRatio      | 1. `CurrencyId` : collateral type\</br> 2. `Option<Ratio>` : the limit of collateral ratio when owner manipulate           | param updated | CdpEngine   |
| UpdateMaximumTotalDebitValue       | 1. `CurrencyId` : collateral type\</br> 2. `Balance` : aUSD cap issued by this type of collateral                          | param updated | CdpEngine   |
| UpdateSurplusAuctionFixedSize      | 1. `Balance` : fixed aUSD amount to be sold in a surplus auction\</br>                                                     | param updated | CdpTreasury |
| UpdateSurplusBufferSize            | 1. `Balance` : surplus pool buffer size, surplus auction is only created when surplus pool exceed it\</br>                 | param updated | CdpTreasury |
| UpdateInitialAmountPerDebitAuction | 1. `Balance` : initial ACA amount to be sold in a debit auction\</br>                                                      | param updated | CdpTreasury |
| UpdateDebitAuctionFixedSize        | 1. `Balance` : fixed aUSD amount to buy a debit auction\</br>                                                              | param updated | CdpTreasury |
| UpdateCollateralAuctionMaximumSize | 1. `CurrencyId` : collateral type\</br> 2. `Balance` : max collateral amount to be sold when create new collateral auction | param updated | CdpTreasury |


# Acala Old Friend NFT

![](<../../.gitbook/assets/Screen Shot 2021-04-18 at 10.58.36 AM.png>)

We semi-secretly dropped the 'Acala Old Friend' NFT to those early participants of our Testnet Campaigns:

* [**1st Mandala Festival 🎉**](https://medium.com/acalanetwork/mandala-festival-prize-drops-3ae68df0dfa6)
* [**Acala Mandala Fest Season 2 🎉**](https://medium.com/acalanetwork/acala-mandala-fest-season-2-prize-drops-81b649324310)
* [**Acala Mandala Festival Season #3**](https://medium.com/acalanetwork/acala-mandala-festival-season-3-d0a6f155c154)
* [**Acala Mandala Festival Season #4 Halloween Give-Back**](https://medium.com/acalanetwork/acala-mandala-festival-season-4-halloween-give-back-d9b073f1fecc)
* Active user in 2020 or earlier

Use [this guide](../../crowdloans/crowdloan/finding-tokens-and-nfts.md) to check NFTs on testnet.&#x20;


---
description: Records of some activity rules and rewards.
---

# Contribution & Rewards

## AirDrops

You can now check your airdrop KAR & ACA balances on [https://apps.acala.network/wallet](https://apps.acala.network/wallet). The balances are recorded on-chain in the `airdrop` module, which will be used to allocate real tokens upon Karura Canary network and Acala mainnet genesis.

![](<../../.gitbook/assets/image (54).png>)

Learn more about ACA & KAR tokens [here](../../learn/acala-introduction/#assets).

Festival-goers and contributors, have fun, learn & break things, behold & catch the candies 🎁

## Mandala Festival Season 4 (Finished)

\*\*This event has concluded, thank you for your participation. \*\*

Building Acala is a community effort, and Mandala Fest then becomes a celebration of this growing community and the wealth of possibility that awaits us all in building web3. All past festival-goers would have a chance to claim Acala & Karura Halloween themed badges.\
These collectibles don’t have a monetary value nor a market, they are our mere way of honouring our shared experience and saying thank you. Newcomers to the community who complete required tasks would also have a chance to claim these collectibles.\
Here’s what the festival looks like and the rewards:

* Part I (31-October-2020 to 06-November-2020 | Award Pool: 2,000 ACA + 2,000 KAR): Welcome Newcomers — complete required transactions to qualify.
* Part II (31-October-2020 to 13-November-2020 | Award Pool ≈ 30,000 ACA + 30,000 KAR): Thank You — reward claim by qualified past festival participants
* Part III (31-October-2020 to 13-November-2020 | Award Pool: 3,000 ACA + 3,000 KAR): Bounties — bugs, better memes, stickers or else

### Season 4 Halloween Give-Back Get Started

\*\*This event has concluded, thank you for your participation. \*\*

* Get started with Acala including creating a wallet and obtain test tokens [here](https://github.com/AcalaNetwork/Acala/wiki/1.-Get-Started)
* Check out these guides to use [Honzon stablecoin](https://github.com/AcalaNetwork/Acala/wiki/2.-Honzon-Stablecoin), [Acala Dex](https://github.com/AcalaNetwork/Acala/wiki/3.-DeX), and [Homa staking derivative](https://github.com/AcalaNetwork/Acala/wiki/7.-Homa-Liquid-DOT).
* Check out guides on cross-chain trading with Laminar and Ren [here](https://github.com/AcalaNetwork/Acala/wiki/T.-Cross-chain-DeFi)
* Check out these guides on Laminar [synthetic asset](https://github.com/laminar-protocol/laminar-chain/wiki/2.-Synthetic-Asset) & [margin trading](https://github.com/laminar-protocol/laminar-chain/wiki/3.-Margin-Trading)
* Results are published [here](https://github.com/AcalaNetwork/Acala/wiki/W.-Contribution-&-Rewards)

### Season 4 Full Schedule and Rules

\*\*This event has concluded, thank you for your participation. \*\*

#### Season 4 Part 1: Welcome Newcomers

Duration: 31-October-2020 to 06-November-2020 (one week)\
Award Pool: 2,000 ACA + 2,000 KAR

* All qualified users will share the reward pool
* All rewards will be recorded and published
* Note these rewards are lucky draws, not guaranteed

![](https://camo.githubusercontent.com/a293930f14d75fa055a1b38c994957f00fec844ee501c57df717ea229ca73c63/68747470733a2f2f6d69726f2e6d656469756d2e636f6d2f6d61782f313430302f312a3863745f4f53676955505063494d486c475a676641512e706e67)

Participation Rules:

* Get test aUSD from the faucet, fees are payable in aUSD
* Users completing three meaningful transactions will be rewarded

Meaningful transactions include:

* Use DeX to swap tokens
* Use DeX to provide liquidity and transfer LP Tokens to another account
* Use the Self Service Loan service to collateralize for Acala Dollar (aUSD)
* Use Homa protocol to get staking derivative LDOT
* Transfer aUSD to Laminar Chain, and use it either for synthetic assets or margin trading
* Mint renBTC and use it in the above activities

#### Season 4 Part 2: Thank You

Duration: 31-October-2020 to 13-November-2020 (two weeks)\
Award Pool ≈ 30,000 ACA + 30,000 KAR

Participation Rules:

* Each account which participated Mandala TC2/TC3/TC4 can get 1 ACA + 1 KAR（If all testnet you participated, you will get 3 ACA + 3 KAR ）
* The nonce of each Mandala TC2/TC3/TC4 account must greater than or equal to two
* All rewards need be claimed in Acala Dapp
* You can see the rewards in your wallet Airdrop account

#### Season 4 Part 3: Bounties for Bugs, Sticker & Emojis sets (Throughout the Festival)

Duration: 31-October-2020 to 13-November-2020 (two weeks)\
Award Pool: 3,000 ACA + 3,000 KAR\
Please allow one week from your submission for our review.\
Participation Rules:

**Bug Bounties**

Find bugs for the following repos:\
[https://github.com/AcalaNetwork/Acala](https://github.com/AcalaNetwork/Acala)\
[https://github.com/AcalaNetwork/acala-dapp](https://github.com/AcalaNetwork/acala-dapp)\
[https://github.com/polkawallet-io/polkawallet-flutter](https://github.com/polkawallet-io/polkawallet-flutter) (Acala part)

* Bugs are judged on significance and severity by the Acala Engineering team and are awarded roughly based on the levels [here](https://github.com/AcalaNetwork/Acala/wiki/W.-Contribution-&-Rewards#runtime-bug-bounty)
* Please include your Acala Mandala Address in the Github issue for easy prize distribution

**Stickers & Emojis sets**

* Rewards are not guaranteed for this category
* Feel free to submit Acala/Karura themed Sticker & Emoji sets
* Sticker & Emoji sets selected for our Discord channels will receive rewards
* Please include your Acala Mandala Address in the submission

### Season 4 Prize Giving

#### Season 4 Part 1 Prize Giving: Welcome Newcomers

No. of Qualified Users: 4,712 (< 5,000),\
Lucky Draw: 60%,\
Number of lucky accounts: 2,827,\
The reward for each lucky account: 0.7 ACA, 0.7 KAR.\
List of winning accounts: [Google List](https://docs.google.com/spreadsheets/d/1iSlG5trQnyOR5uzsT7puOsIODiWm7HfZtAi3ys4ietg/edit?usp=sharing)

#### Season 4 Part 2 Prize Giving: Thank You

Claim candy information within the valid time frame (Not included in the activity time not claimed):

The number of accounts that have claimed candy: 11,635\
Claimed candy reward: 13,739 ACA + 13,739 KAR\
List of claimed candy: [Google List](https://docs.google.com/spreadsheets/d/18comqh2wg6d-NNFb-HFetaToiPSkrS59wt1OmeGyxcQ/edit?usp=sharing)

#### Season 4 Part 3 Prize Giving: Bounties for Bugs

| Repos                           | BUG level | Issue link                                                               | Address                                          |
| ------------------------------- | --------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| acala-dapp                      | bug-c     | [#273](https://github.com/AcalaNetwork/acala-dapp/issues/273)            | 5HpLku5nX1Qqr2jUHDXH7rMBB5UVD7gJubNzVijvg6JhJJ9Q |
| acala-dapp                      | bug-c     | [#277](https://github.com/AcalaNetwork/acala-dapp/issues/277)            | 5HdRwpyhpLNMiFRtEFL7JyhvkSLNSJGVDnQ1GcnVgTQr5smP |
| acala-dapp                      | bug-c     | [#281](https://github.com/AcalaNetwork/acala-dapp/issues/281)            | 5HHECGnb51XLhPzWWUqumWxb9KwTARmcunxMXvkyNCqRqDX3 |
| acala-dapp                      | bug-c     | [#282](https://github.com/AcalaNetwork/acala-dapp/issues/282)            | 5HnB6WGwGFZU87ViXYhVxxPEKS1K8r2QTQnvSPg9tWqVApxY |
| acala-dapp                      | bug-c     | [#284](https://github.com/AcalaNetwork/acala-dapp/issues/284)            | 5FUaMCA9TSiJUdUAyAuLgUF5ZMhrvKQsHXZKhFiJMgWpZSyq |
| acala-dapp                      | bug-c     | [#294](https://github.com/AcalaNetwork/acala-dapp/issues/294)            | 5CUpyz4irvybSgdZpuPJAFi2ApDqzp8QtfUgR7vWtagFcHGn |
| acala-dapp                      | bug-c     | [#295](https://github.com/AcalaNetwork/acala-dapp/issues/295)            | 5EFDkXjzsyarcuLV1tDCE93wMjqxYxZyZn7qVh9soufPt2Ho |
| acala-dapp                      | bug-c     | [#316](https://github.com/AcalaNetwork/acala-dapp/issues/316)            | 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o |
| acala-dapp                      | bug-c     | [#283](https://github.com/AcalaNetwork/acala-dapp/issues/283)            | 5FUaMCA9TSiJUdUAyAuLgUF5ZMhrvKQsHXZKhFiJMgWpZSyq |
| polkawallet-flutter(Acala part) | bug-c     | [#191](https://github.com/polkawallet-io/polkawallet-flutter/issues/191) | 5HnB6WGwGFZU87ViXYhVxxPEKS1K8r2QTQnvSPg9tWqVApxY |

#### Season 4 Part 3 Prize Giving: Sticker & Emojis sets(Throughout the Festival)

Sticker submission link: [https://discord.gg/WYjDeZDTPN](https://discord.gg/WYjDeZDTPN)

| Address                                          | Reward        |
| ------------------------------------------------ | ------------- |
| 5D7qE641LNgeL4fQxkLrwZPoqMavhGXbWN21DhoMf6iWqBAb | 5 ACA + 5 KAR |
| 14XszikzVEgp1kbL5uRsdn1F3vXkaowLub9KcFMVhqiBBgcy | 5 ACA + 5 KAR |
| 5DQ1AvYrLy3ZsYrUKeaY4CZZWBFatLKrZ3sjAfdm1oGtSQJX | 5 ACA + 5 KAR |
| 5DUUgntu8Atyu2xkk1GjhBBxLryC6CRovHzVcWzFALjHsjQF | 5 ACA + 5 KAR |
| 5EHiBbDEhb71TAJFBpGD7URArSA137CHKh4srJR1zkkRbBLz | 5 ACA + 5 KAR |

## Mandala Festival Season 3 (Finished)

\*\*This event has concluded, thank you for your participation. \*\*

### Season 3 Prize Giving

#### -Week 1: User Participation

No. of Qualified Users: 10,525 (>5,000),\
Lucky Draw: 20%,\
Number of lucky accounts: 2105,\
Reward for each lucky account: 9.5 ACA, 9.5 KAR.\
List of winning accounts: [Google List](https://docs.google.com/spreadsheets/d/1RRJfDDpigMsiFKocTrkurJrG43f4d163WjErWErfdNQ/edit?usp=sharing)

#### -Week 2: Trading Competition

As of 10th Aug, the top 10 traders are as follows, they will share the reward pool. Congrats for all winners! Also well done on everyone who has participated, there will be more yield farming opportunities once Acala is live, and your effort will be rewarded 🎉

| #  | Top Trader Address                               | Profit Margin 100% |
| -- | ------------------------------------------------ | ------------------ |
| 1  | 5G6ud7FEZZuFXtGX7rG9Vpq1w575w6NHkEQfzGZpKdaDbFGo | 504.9              |
| 2  | 5Dd8SGx5FyYxCgJtUC3MWdqCPB9QiAADVHWTy9ztVxqLaT1Y | 274.9              |
| 3  | 5HgXhg8HBUZQmCPumRMztC9vsKYk1CWfzmRUZJVaXnEDMEVS | 262.8              |
| 4  | 5E1rKcxMf2fqrZh1J3UgBKTGxuvAz8Y699THMtxMXeg5nDv4 | 215.3              |
| 5  | 5CRwrzRYhnUw2uSZvTy6h4dogYQYx7bV6sNnkTocpanBSt3T | 204.8              |
| 6  | 5DfM8dtKWwURKjpQBopS6GudCr9qRYq1KgBHVCmbmKkqdMeR | 199.1              |
| 7  | 5FPBkZKmB7UCnEyJF78cpW9nczUyUMgn5vhesHBnfoptfsdC | 198.4              |
| 8  | 5GzkBJDZLhpaqfHq6sbB82L7tiGCcBVwd8LjxhPAT72PSdRk | 198.2              |
| 9  | 5EKsrAsRAfQM9wyR9sRFVqNcwQCLQyVBjLMuSr2GqYE9JPUh | 193.4              |
| 10 | 5FhA3c1pw2zwnJRxNQSQfv8nYMpNNSopgSuLc5bZ2MVX6vTC | 170.9              |

#### -Week 3: Black Thursday Simulation

Number of winners: 200\
The reward for each lucky account: 20 ACA + 20 KAR

| Winner Address                                   |
| ------------------------------------------------ |
| 5C5SQQH3cGCHjat3gQ1naELHWQLGRuiRGpCYfe1rrLMZuNWY |
| 5C8c6AkPdo83jvNvvrB1jnTi4rfkuLp7H5ziuLTDsT42gntN |
| 5CB3wjdK7a71arTf27oXoLVQR9fvDAwikPMC7AHptCYRadVR |
| 5CccLc64WB2hwWorqg92A4S5y9fwAiAdbAKLRY5obDskA26N |
| 5CcjG2MnkAMWzTzdFU3hVnDhuxf9D7yoA7dcXmJYenSMAxzW |
| 5CDGLUhq1uFbjdic7WBMP9BeFmEwkWdm5sy4wQzgewu6zLLN |
| 5CDJND47a1NSjyx3cBxztY6rcXc8WcWeRecnjRF13gP2TGfV |
| 5CDp3rjzgrXfiJNMUK4JbpsMMTnPbXK5YCBC756ZGC8uQyFf |
| 5CGADrJ1Yc9aTaDGGQ5WYMDpiwHdxdunj23b2KCdDHcm8kAi |
| 5CGQPCeg9wDQJBRU9NpoQbV1yCHnCakejg2FousPxjaUaNDz |
| 5ChYSYTom6BLoXBfJhrpzcADd5PpBxvbUuyHqArzatKfzMJy |
| 5CiJReWwBbtX7t9vEmsqwgRHH9JegTG1m5w8gZMnAsvsBDRc |
| 5Ckg6bSerNfQLk5mazUnZ4rbWP2x8fjzNgT6ceAfPHXDL5tv |
| 5CMb7ZxVdBCijk1pAy2UQxtBfsi6nVM1fcpjpcfpMR32hUsd |
| 5CmBPNRJE7onTbsRrJq5zHFt7xHQQ9enoUx7x8WtuA3YsSbj |
| 5CMcAipQEFvQv8XWPtTkWPcAnJAJrQLRiVAVNtpRGbtDngVf |
| 5CoEECmREJW5TsvsC9bhhDPvcUTLbpfsprmae9hkHRfKYchT |
| 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G |
| 5CqjU44RL4bpwmTQhNoeiA5QS2qEzqVbNv2KqkAonk2f1MjT |
| 5CqtjpcREcpPiJDhtdfdpCPm7rVDobEMb2fy6n8oWEfj2RAS |
| 5Cr1RxQ1qZuXrtr9w6Gd5VxFnoammWEmcLByZRdvVorm2DMG |
| 5CRsL3X5DYsvRZRG35FoqopTUzDKktzsG2ZpDDHVznAdhHjR |
| 5CSDymnTbuW54PCiXJtYsZbw3bZp75RVRVdyhfbDmEq4dX5c |
| 5Ct8CDacSNanB6NXkdtkCLreQMwE5PR3taGUUwSaS8KZ6d77 |
| 5CtasrgEkbisry55oK4WVRZwEN9tKvLypJKXuKAbF9T5yUg8 |
| 5CtS7BM64fpvw5rwvwMs2ADEdUxSGfP3UgQAXoX3S91QKaFo |
| 5CUMfUy5KASogbyNDdWvoNAe8TZ9cMGqSzeWS4R9WH5gyVJW |
| 5CwH4XaupdCLdZqg9VwHPgxwE13J6v41p7f4jsWGf8H8KJ4y |
| 5CXgWqJC9akm2gmmN7YD1EewLCmr9Z3HmM56aYDvwof5opRD |
| 5CXii7ZFZ4Fcj5v22thivJNNyDKt2FS9H3m1wWL3GRdWgz1n |
| 5CXuDA4NNP6w2Y6NYG4MTMK1mNixjyr1vnhNqf2eFrr8HnX7 |
| 5D1uoLbkdopC8SWtzs9kq7tfyYg48p9dJTzWqW2jvybjXbAS |
| 5D1vzT24fxPvGkkaRuEHLD3pLeNBakHuLfRksZ1yEGjddoPL |
| 5D2c1W5FGN1gR2JHEAAqTMmLPRG8KWNuyprw6gTPVavBnFQZ |
| 5D54bkBy4S8618H8BLLQhC7jzWiWRYds2iyA1ShWRrqansSb |
| 5D7Bh9iXwPTgvcuJsvhBMdyBkQwhXZenM1hxTcXPZ8pvniu4 |
| 5DAEqUAxncr5k4jcNqhn3MAk4ws8ni8k9dX9Dg4Fgf76gbSD |
| 5DaLr2t4ZzKtdDQ1m5Qf83Gwe5AbjPJLqaRCWeDGqkj3mBpR |
| 5DCdzuRtU1TK81X6FtY8SFbVhhEuCUMtggw7bJTTpG73MWnm |
| 5DCg23FGDYuGw52A9xWYHH2Qx4UrNHJUdWhZHsnMZ1BEGsHA |
| 5DD7KrBrLMPZr2GdqHUzJLUFHd83tyoudT4Gmvj8kEKz2Pnr |
| 5DeeT5CanCJtRfpdPpbhTE6CPojCTkzWf6n2mpAmgcBJPah8 |
| 5DJBW33de9ERCFg3tMVvPtYypS6YMHiP9dxocg13MDworvmT |
| 5DjuLGE8hXjGeyySChdUsLTLb5XkQs9g4QHpnnKC5Ctzecuy |
| 5DkuUCmz4Ydx4QyCeikezwWHxq5iMrEtvttsYKxvWpDetHRU |
| 5DkwphVMnrfCVFhfQgqzpDzoAKpyDVn72sHrAjMdMRutKPUW |
| 5DLJhbcn9SXE12r5JDW8tLBKTkgvD3ULAsPc54mtDfwsHeM9 |
| 5DMRE6xoiey3GV9gw2ZQiojXo7NydvvmiTGY7V2AoUXjc9LM |
| 5DnV2mGEL2TqipM4vCeQxgLYD5umaHdRGnbh8Xoz3UXJQQS9 |
| 5Dnyp5ZimHYnpV49yZjmCd1e6XAtvo9QYyiXjzMko1WkhtmN |
| 5DqWqLZJe2XZF1jSPkngxW5q5ppMYcWkN6MJw9X1aoW1YHYK |
| 5DqYYDu1wunTTNx3oYuLAZ8JG7ADqNMJqHBDWSK7wDzTuqsW |
| 5DRvDgPEsH9FGTkyQ323fnUg22ZUNJ5CjDVDJhEe1wuFwx3g |
| 5DsdVGJD2WNYyxHFD5qoXVoDrahXKqqooTA8xuTMFFmqZYD2 |
| 5DSLfBLuiQQvNsqWiweW9p4KtF1wCkjJUusSMcJt5SDHUW8c |
| 5DUtFupSAYyQCSq8bmeUQYNg2xHnuRubG1xFoMqtr3ai12ZZ |
| 5DVGjNBSNpTQAXjthsYh2sbYJCoc8eu2MfxntGcyYsgFRuLr |
| 5DwKZrbKEEqYHECNkYGbqXbdGgNCcT78KEFUS8c2sSpaKjjJ |
| 5DXV14EXkVDgoL32XHNZtsrk15QGQZxi2kdAdfQEE9tz5b4X |
| 5Dy2oAaRyqtjZcEXYCvCxo4eKw9wmBJqm7HomGiDv5riDF6f |
| 5DZbMRWJV9m5xWjMRfwtA19PGP2bKBKKhUeTyv9CPq1jvNvk |
| 5DZs7c4aD3EkzYoGujUp5fLyzBFD2GM4EDmmxBwN4msqYeWY |
| 5E1oYNJG1drkFBZc6TXFGfrCBx6ufEuVMbGaNsDMhDb2o5q2 |
| 5E6tn8PRo6psdTiisnvXbzQCfBychyqaDCC8uV4CoZKV2YQG |
| 5E7Eemxv5rwRedbGbBiCoJo31i3HgHREoVkmLa4ShYPhDzxw |
| 5E7sF34tLuJYdDaKMaAVb7APBS9KPJQdtBRvqUTDVaF1miiy |
| 5E9uMyb8udLgLjWJpsDnnthwRMwUfC7GqzKRMN2rA3hEZ72U |
| 5EA3xgxrp7STTKwarjFC6etpZFmRJmJxsJ34wnKPhE77Fezj |
| 5EA9BTvzziittbDdBk5jfktxsZDtfZ2LffDNLkv4M4iMs4Mg |
| 5EAPa5UX3FbC81msUXZkV7dYv2tqw1kniZGEVSgy9cmtUGD2 |
| 5EbpVkQhZcCVqNJdMFyHcf28nKgMiXJQ8vDLFvbHvB7Z4xmh |
| 5ECCEtRk8Sa5F92QEMq4ovX9pLbXCXMRKGFhj9Stkq66incg |
| 5ECfKYuCFCDLP7dTC9afVmbEybrYfBQ36ikwCXYfbRHj6eqg |
| 5EcgE8Gd4tcycjeCTkDbHCoPYYUaaeWFtj8b6jBuHrsFotY9 |
| 5ECzzmd2tBECJinysQAdxPraig5hq4TSoduwy65wowpZpndR |
| 5EDAyEEbsM9hqCpAhNswMe3xYRSxpEbmFRUevVekXqorzybN |
| 5EF7pepHEUMgTWFGBqqfDYbv85FkrU6gSVs3ejB5guQAnH5V |
| 5EHffteKBAi8EdvDAaqRTX8DokWCBYogEi2DsK4BUtUqE3t8 |
| 5EhNjKbKxZZYNvqUtnfH7GNyjuztcRyNbTMTb1LYbvrQLGXb |
| 5EHNX2vpAh2ZN6dfNvkr1shDKqSu6FiiY81Xz8QGUtkbUTaj |
| 5ELcnYTbHC6A1DHg5xwXtRkvUDmLCKm365JWkhBCnyKnnxt8 |
| 5Eo1U11i3b7NZcGbCSxxz3cqiZd11h34nYPGQiaytAvB37Zy |
| 5Epk8XmMU3VCEu7HC22kCLwHaSi5YKJQLgHF1rGN949qFBxE |
| 5ES9fyfV56kkEP1qazNzN1S6YwbSTfFWp2Q3i4QG4eyT2Ng8 |
| 5ESAv67AGRXr6wky8mfF7hUCKTKSDz5pTp97Su2xAFZ58YDx |
| 5EsdPnjVwT1FjwEdbqQbSJSZkKv6WGR8w7woyqf4vySLUuef |
| 5ESF68P8kxP577vfeKNbBvDdyyTbinTLbsP5WVFfADTyhQF7 |
| 5ESGSwJhe7oihCJdMnHoyw5AsitTdd36wFNavum6Jxc9KkhE |
| 5EskBzCLMU5cM7D5jp4GAK2WKe28vo8j8sAZFo27TUoHwwYn |
| 5EsUoB6DmJyX7y9KDyjNHspK7Cs263xTgDGz1sLrirc4KTpT |
| 5Et2gX3hioDAhdaziqfswo9MeK4REQC6VJedHPju4s6KEea3 |
| 5EUaKBPyXMXvJKokHCDRxvjAnvYiLWX7jM6LRMYfxwsG1zT7 |
| 5EUhyN2i6Adh6NnYzeBERpQDANfJwxrWH6Nox78jnParsRyN |
| 5EuvTF7TAY98AgKPqxCD4cVVMFhjFB1WeiiDCNuWSYkUJWby |
| 5EWzRzRSJ52FgTbdxRHMwxRVgHUE14LQhwZeh6NT9LUr197a |
| 5EX41ALzBGbhbkGHXT4stJ2bVWF4axCNKQA9RniaR9Bx6dR4 |
| 5ExsBG3eAuRPF4eCSxDQvMXF6uVVkTbeaVJ5rFEQhB7LjUbu |
| 5EZMEd5bNFs1Czw8JP9DcLWBfMehvopipfBbeSJ3JUTRiWtD |
| 5F1kLosiWXQn4C7TEX4Zy8fkRdHTLvKugkEM3JHZr7zR5M6W |
| 5F1mcCMJX8vW3VpsNWBZi13DCBGsECgiUqRiLNveTJn8tc1d |
| 5F1V1pLHDetngC7uAKDSqpAE42NR9nz6f6Dxvjm4sbMHNNeT |
| 5F3rYPmFB53XttPd8Zq9QqPxMFDUuVqDx4zjVjmqy6n4Ve4M |
| 5F3vSWoxpyeTNrUqyRZ4EkihosmoPJMGEgKAZiGE9WXWFhcY |
| 5F7f3kQxSSxpEjHHGdXZ2oFdCfy1EthTU4oVbqdhnn4THJvo |
| 5F9cnDyCs4CT9K8Y1vUdkc3iox4eMATyF1PqEbfbzpzEuJmC |
| 5F9v9Dh833m7GHznA8yxuVnGN3FdcrqtU8B9fqsFojMZQday |
| 5FByN4TX9Mh8YBeLocr7WDQCQ6da5Rjf4vq8j7HbHZQ9gkpk |
| 5Fc86bWmXQ6BrxVuEf3AMr2KHrbQWTE3zRYeNo7YGSGNVkav |
| 5Fc8Bm7cdEqV52TFjpQcRSf782iru348wQs25T7Eb8qUbkWX |
| 5FekmPiN3BRjZFFZTL6B19DvWks9wSFmPt2GjpGuo2UX1oWW |
| 5FeobeFfTqkRo8FcxfK4PM8dyroKvo7evgX8G4Xq6GbULgBp |
| 5Ff46r7kSwe7Wmc6mD81PQ3bz9596ztJQrwPt92ibZAfT1TG |
| 5FF99759ko3ZGEwVyheGfCvU3a1U428KYA2qKDgqyfRRyV7i |
| 5FfAwy8MXtACXy9ZzTXGvr6vpMF5DkAHcPCxmA4bVx4f65WD |
| 5FFEZ4e3wBT9Nq1gvYbCgZteybRSHMVMzjnkHGQ9uMVq4VcH |
| 5Fgc53zVCZ5QneUX1ShgZnKB6GB49CHyCP5CnKukEWHnJYTe |
| 5FhAyh4dCATKKNc6pycp3FDEvFdcDpqLM7hye9N6ZQ31n82e |
| 5FHook4GYvTQh7ZUY1QsNVmGN1DxGhWDZkk47ypnM4Uj6XP7 |
| 5FHSQfVcfVQ4kQPbbXKU26hJhy6mvF8sjybmkKtbDLpKCcmF |
| 5FhWwJJ79QvYcXr7Hw745r4GbyAW6qhrJogkED9GLPd72GkJ |
| 5FKmWyV3jEC32UCTMuEdot7WQM3LUe5n8kFG7zHeAPiC5khc |
| 5FkN95SMDSyo95gcfAUMwD4mfhjHr4qjqQ1edXmifs9WB2Wi |
| 5FKxaskGiQrRkJY8fmwwYfnt3T8iRfqiNzWJkwHimMAiEaZC |
| 5FLPVDd25MHFaErAThUGgbkcVzZe6dn1HH1dPkNGHCRzesML |
| 5FLWVLV3GPXhffAWLNuzMM1SKJA71pkSHzxegq68g7PzEbre |
| 5Fn8ytY7CW8fhMGSxKcG8PBr1A2t8MbYBtizPXtet8bVQKeX |
| 5FNuxCpDvTfiwcxgcgqo1oKJGkFwXQkmRcgBCcezNvub5hHg |
| 5FNZUvf4o5eyeNjxEfRTZ5535yeJnHgGHpeAUWU5C6a2HSbF |
| 5FP7Ko5aqW7xNTVASk6cqLdKCsafiefeeoCPLHFDukSmpMfo |
| 5FPCh4QTAQ7fJBFggHY67Lbz3i8Hodt5VdipfDTfxQ54cw6Z |
| 5FqTYBzGTZ481A5Tw1P2LJns7GDAkLBdpQiQjyoAx2TD9irE |
| 5FsYjqYG5arYv83wEjzFQ2VQfzum9t5RVQHuiDAssj9Q6vJ3 |
| 5FW7heMz9BjDLetkwYVs61NzFaCo3Xj473fQyQVw1sHFCFA5 |
| 5FxKdMEYJyqLAZMCGfU6m5UBAqggXsWbwRsAbQSFkakb9xC3 |
| 5FxQoRf1YRB9ZZoq6Xbx4KJyhir8KtVwBiRKAmvyuxJx1cKL |
| 5FYf5E6isLJ57mBCs9XHswFR5GjEG43ddE7tvF5xj5ZtgTpb |
| 5FyQ2nKuX9RGtshigu2y4rVXuN8HMBLz1SWZMA7ik7YgWwYH |
| 5FySKeAoxa9XoyhmQiqWHKZHpNSUauEjXxB1NNzuZe5bAaEB |
| 5FYsPvBvRxkLoUwpPD9wJxqaYPoVhdiovSPhuQWVjopEbM7M |
| 5G3habEPHywTzvEZGS7yJsUpPuhabkXAxkn9jv2bCh4z4hJr |
| 5G3hZZRkhzkZ6VyWB7UbFHUi5HLe9o5X6TBUcCWQwLBPD4bZ |
| 5G6AUvijXNoVr3wZTXjYMg6xMaii6LirGDsLdJhV1UauVzq2 |
| 5G7J1DGiQCRuKpSBStck1eJRZzq27uBenJTQJuzpLtJPJ4Zv |
| 5G9QQdiNAGXqFPrnhkprbY9iYY2etfbkqA1ZUXkmRSyc5pM4 |
| 5G9WDNRN1ztDWPfcPeGx2Va8aQxmrzDJxGWCugfUYHAunbK8 |
| 5GBqcBdAYSmiLKt1463AGUAfk1eis6yURBSSxtnxrUgfKVJT |
| 5GBsexiz2Cvdh3MsxdkDL5jYL178XwvnvK5LnZbfUA9QZBsE |
| 5GCUzxsXBqKw4mHcq6uXLvQniSb64ogXssKedvtZ5Bq96jeC |
| 5GEvwZvZGLTKYJanTxDcAdwqLzERXiRJSe5CMRrbvWykp2KK |
| 5GGjEWiwHE3q4rdK8FJ3oBEgTjrYuncTzQ8qiidGaBeU85Jc |
| 5Ggkr7PbDv5oQDgsTT6TF6YYJA39YYCHZdGTyDc3jfaDBwWt |
| 5GhPYXN73ML5meMJKoYHrsFGRH3VDH6Set1ENRBKnZf7gyvq |
| 5GhSXup19dSPrJBv6T7aSHD3hwKihSNf4U2aNWmEd188PXTb |
| 5GjiwyFXKUnxNRMsc8SAQGaUxpwW9UczNFafD1SCtKZoMdbu |
| 5GKrJF6m8oW5SrvJYH2LksjtCRZUM6HrkbzuUnx4mc7bANpJ |
| 5GKTAMU9PTVjeMbwiT8i3umtf1bEBp314cFGcGpuTb4Fw3Aa |
| 5GL5S829ACcHHyUPmofuc8rTZxinWxPDmhPR4UMj2ghjyy8D |
| 5GMvp5okVesv3JHxNA21SeFbXtMMtwy6EmPvtN5HpHLUuRCy |
| 5GNSwbXVkk2ZtQrwKSDi8ikAg1dHhtqXgL4MsSuBeCcdkzs9 |
| 5GppZzPjcCSwpxArzCKAjpcEUnRZnLkfAUApmdcFZWG3Cfza |
| 5Gq4EDReGUDnMiY7UN6CAgq1qN2mz3dkVgZN3PrDF9gk158k |
| 5Grk1M8uWgWD7Dm7vvbuAxSwyqR6s2cB8EykgRZi9sCKtrbr |
| 5GrnNToStJHU3Dr9j1G1eExotL68L6fMKgJzLJvC8g5DpR8v |
| 5GrxeYVFV26xM8BKgTJ6LgoYezfBpq5cM4dN4okV37JxkVny |
| 5GRYTPdyq7fizkJ1MwiMdLnBnpetqYH4t6nDwrWSsEFZG8tA |
| 5GrzfEwHwfstmvWUBTi4BEfRWKmgmyTkXynhTbGNh5o9j46H |
| 5GW7F2dB4s9maZEL5mbTie6s4FwgdkKDhgvagdwHNH1EHbYL |
| 5Gy82AD4imcUxmHLK12vbScvS6MvzsS9sPTc17egPJ4v2Vuq |
| 5H1gfcTekfVRM81CwgTEBWJgW2hBqzfeJspb1jYVr3uEqwPb |
| 5H3P3MAt5DESm9ixLarn1VMdGSergF7WbfpMX7MghpZb62b9 |
| 5H3Sq1HXiQepCBdAcgnrKS4BMJzJU1Q1khGQxzRFrdwtx696 |
| 5H4SRrwYfTUXTe41LTGLBioDmcSgTdS7aLLvkXzAFY4aNjNW |
| 5HdcZBYv8Evk8XUbxKPnKG7CmC1odwmTv7NRt9ghCumZ8tqc |
| 5HE8YAYM7cVEBm8iJ7BrAULy535UZaQDgaJbD6gFtiwJAM1Y |
| 5HgAFiXN8HhhETQVJW4E64pn5qki9GJhEZUi1rDX2jYDuNXt |
| 5HGwTFxnH78CcTgKqxVkFe7cQE6KteVkQezxHFqMwv6rT5B9 |
| 5HHC1f96qebeBWiLGj8Uwmv2xD1hfjVmt5P7f6PScM8bSCYm |
| 5HHKVxC3VrBs1h3d4mNtdoZ4DULC2HLp3PnBnJkQKgXnfsPN |
| 5HHMpRWexQWhMMMeV433Dt7ThgXBwo1pjs2M4AcDjUaFQmKb |
| 5HjLts9JryK3huW5MtmfjUSacirbbZHQXmC13UNxjNpQSQmX |
| 5HK7MdumTL8uNV5hMk6z7XTkQA5xDZ15phnngR9aLGLPXko6 |
| 5HKMPQYa1Bpre7fyGxLcnB6LKhTZkY6hMd5vjXFANNzFYLQ1 |
| 5Hn7ed8VRW5D8d6MDz7YRhC2J9fpZX7c3nkafe4jNxZcrHXb |
| 5HNi2g4R7vefffJxrSN3mHXGa96Lof26AJwhoNut86MuBJJv |
| 5HNosDRqJNao5ewuXvYE8z88554ffDpZvEm4KbZCTFdAD3XH |
| 5Hp4X46LACzqDorZkeEgSds4Fqd8nQAAQmftNKvZktn3WPrn |
| 5Hpi9rYJV1ULKDWBYGa74xPXRi7Kaf89eB3PGW5P8FK7trU8 |
| 5HptHBL5acE3T3n5kfvDnJwYHo9UrpB2L5j7pBUKqbfSeBw1 |
| 5HQWx9SXXDUGfLNjuhcYXAwzuKBDnTmvuz33zWZ27nGVYjgh |
| 5HU3qwWwvfKZo5tp6Cwk169AKCwDHugBK2LfXYfDy94KSmmV |
| 5HVcH8j3v4T64UYvRpUTwkDKTR36tpgftg2yF5XdwxvSyLWQ |
| 5HWYa6e1BjfNoGBJWCWidVt3CwJRPFsBuq3c46GLuJ4Myq5k |
| 5HYbbvJ5BYMdFe5fSomWaeEgMWURG6PisraJMNbPTFYqSjBo |
| 5HYEJRV5S13TDDSRKSWUafRsvRMzS4PGTWh5DQwEz2oSHyLZ |
| 5HYwJ2AYfsPAAgecnEXj8qqRLuBmQiqYWmZexZL6TVgg2xxQ |
| 5CPQoDqdzt1ggeaVzuJyK2WYnTV2s7XDoPE1eKSrLVdHrHfg |
| 5HjhTLGk5V6HXuwjpdbHMWUXc5LH3rMtLKpcqSn8Z5x8xLUS |
| 5HnJRCcbFaTjaYhmhTiNavSStkxRAmeX2EiEJq2vSnN5Q4TJ |
| 5CCdo3gfsnjg8WCTChrB4jQKXNncfbSN3H9NhNVqfD7EjNmz |
| 5DqFgUVwGMGurJrJJTbtFA3U6HS6ezomTHnpbREKbnKjD9md |

#### -Blog Bounty (Throughout Festival)

| Link                                                                                                                                                                                                                                                                                                                                   | Mandala address                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [https://medium.com/@gafaruzb70/acalanetwork-%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%B8%D1%82%D1%81%D1%8F-%D0%BA-%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%D1%83-51124b71aefb](https://medium.com/@gafaruzb70/acalanetwork-%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%B8%D1%82%D1%81%D1%8F-%D0%BA-%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%D1%83-51124b71aefb) | 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK |
| [https://medium.com/@Fanniee/polkadot-%EC%83%9D%ED%83%9C%EA%B3%84%EC%9D%98-%EC%A4%91%EC%9A%94%ED%95%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-acala-8a3be713bd42](https://medium.com/@Fanniee/polkadot-%EC%83%9D%ED%83%9C%EA%B3%84%EC%9D%98-%EC%A4%91%EC%9A%94%ED%95%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-acala-8a3be713bd42)         | 5DZpD7NqtPAitsdZVsjuMjyvicTfcudr1oFfHMUUqLhS9u77 |
| [https://medium.com/@nguynlongthnh\_89762/learn-the-basics-of-acala-network-you-should-know-d8b1e13a13f4](https://medium.com/@nguynlongthnh\_89762/learn-the-basics-of-acala-network-you-should-know-d8b1e13a13f4)                                                                                                                     | 5DqZSHwqts1Dmyg4qPQUMj3H2tQVBtWvDJ3hd32gUJTBgEoL |
| [https://www.youtube.com/watch?v=0\_BeLFBqZuc\&feature=youtu.be](https://www.youtube.com/watch?v=0\_BeLFBqZuc\&feature=youtu.be)                                                                                                                                                                                                       | 5Hg96xTCugbbFd55F9iBNofie4gpAgmJUVGd8nRL5vqCPCSp |
| [https://medium.com/@knowledgeiskey2017/a-comprehensive-overview-of-the-acala-network-8b13135ab885](https://medium.com/@knowledgeiskey2017/a-comprehensive-overview-of-the-acala-network-8b13135ab885)                                                                                                                                 | 5Hg96xTCugbbFd55F9iBNofie4gpAgmJUVGd8nRL5vqCPCSp |
| [https://www.youtube.com/watch?v=weBI9tzqfQU\&t=](https://www.youtube.com/watch?v=weBI9tzqfQU\&t=)                                                                                                                                                                                                                                     | 5HYRXR7TC4jkEjokhNzvYup2WcxmejbVNkoQqVbZtaWovj4F |
| [https://www.youtube.com/watch?v=X-Fh04aXYz0\&feature=youtu.be](https://www.youtube.com/watch?v=X-Fh04aXYz0\&feature=youtu.be)                                                                                                                                                                                                         | 5C4m2LpoCEAxmueTWBXs3kka3NCEtgH9TXMqhLpu2vYv9Tkj |
| [https://medium.com/@ltfschoen/journey-into-defi-using-acala-and-laminar-991c168902db](https://medium.com/@ltfschoen/journey-into-defi-using-acala-and-laminar-991c168902db)                                                                                                                                                           | 5DHcRs9udMCKtEmJEABY2HpECyTHHxgLL85pFFzN72SatAoQ |
| [https://www.youtube.com/watch?v=faylI5\_xs00\&feature=youtu.be](https://www.youtube.com/watch?v=faylI5\_xs00\&feature=youtu.be)                                                                                                                                                                                                       | 5Fj8pQ1e7iDfrAvae9k6WhrZRqM4Lqd6Umvk8J9cg1BXcJL9 |
| [https://bihu.com/article/1614934379](https://bihu.com/article/1614934379)                                                                                                                                                                                                                                                             | 5GWrTC5D7FPEg3iaikv8Yp35K1A6qWyyCVMF1GZd5PCbq2Fk |

#### -Bug Bounty (Throughout Festival)

| Github issue                                                                                                                         | Mandala address                                  | Judging results |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | --------------- |
| [https://github.com/AcalaNetwork/acala-dapp/issues/241](https://github.com/AcalaNetwork/acala-dapp/issues/241)                       | 5F2FNhhVeG9bW4tP5te4a7asBJvSHQg31RzkoETLpUN161gV | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/238](https://github.com/AcalaNetwork/acala-dapp/issues/238)                       | 5F2QSwPHobet1pLFTEw6mkcT8bwZdEMmHfBGYPkiK7Pgxdex | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/237](https://github.com/AcalaNetwork/acala-dapp/issues/237)                       | 5DEvvJA5Mz82GPLbf9t3RxWVYX5KfqkkxwJvJ6tmB3e5n5Wn | bug-A           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/234](https://github.com/AcalaNetwork/acala-dapp/issues/234)                       | 5DfNVfJTgpspTA4bz7w1DNJmf4eAEcCZ76AktJonPXUPwR6U | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/233](https://github.com/AcalaNetwork/acala-dapp/issues/233)                       | 5GRbkRH3hi1vbuNd7s3eW9u2YRfhMtDJVVCe3a8M1jvhBuvZ | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/229](https://github.com/AcalaNetwork/acala-dapp/issues/229)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/225](https://github.com/AcalaNetwork/acala-dapp/issues/225)                       | 5F2FNhhVeG9bW4tP5te4a7asBJvSHQg31RzkoETLpUN161gV | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/222](https://github.com/AcalaNetwork/acala-dapp/issues/222)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/221](https://github.com/AcalaNetwork/acala-dapp/issues/221)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/220](https://github.com/AcalaNetwork/acala-dapp/issues/220)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/217](https://github.com/AcalaNetwork/acala-dapp/issues/217)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/215](https://github.com/AcalaNetwork/acala-dapp/issues/215)                       | 5F2FNhhVeG9bW4tP5te4a7asBJvSHQg31RzkoETLpUN161gV | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/212](https://github.com/AcalaNetwork/acala-dapp/issues/212)                       | 5F2FNhhVeG9bW4tP5te4a7asBJvSHQg31RzkoETLpUN161gV | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/191](https://github.com/AcalaNetwork/acala-dapp/issues/191)                       | 5DfNVfJTgpspTA4bz7w1DNJmf4eAEcCZ76AktJonPXUPwR6U | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/188](https://github.com/AcalaNetwork/acala-dapp/issues/188)                       | 5DfNVfJTgpspTA4bz7w1DNJmf4eAEcCZ76AktJonPXUPwR6U | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/186](https://github.com/AcalaNetwork/acala-dapp/issues/186)                       | 5F2QSwPHobet1pLFTEw6mkcT8bwZdEMmHfBGYPkiK7Pgxdex | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/185](https://github.com/AcalaNetwork/acala-dapp/issues/185)                       | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/177](https://github.com/AcalaNetwork/acala-dapp/issues/177)                       | 5CcTrXNHdJUYttyDNsQFDdWMcBPY8YvZF8x6WMXVapYQ644p | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/159](https://github.com/AcalaNetwork/acala-dapp/issues/159)                       | 5HnJRCcbFaTjaYhmhTiNavSStkxRAmeX2EiEJq2vSnN5Q4TJ | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/146](https://github.com/AcalaNetwork/acala-dapp/issues/146)                       | 5GMvp5okVesv3JHxNA21SeFbXtMMtwy6EmPvtN5HpHLUuRCy | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/144](https://github.com/AcalaNetwork/acala-dapp/issues/144)                       | 5FEoLBq9BP8X3iU6iPmW2KWJahcCazeSaLPd2CamVfdwsCc1 | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/143](https://github.com/AcalaNetwork/acala-dapp/issues/143)                       | 5FFCfSJJaVN8WRRNiFxHKcYQh5MXfpFYyVhjrv99Qgvqorp9 | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/142](https://github.com/AcalaNetwork/acala-dapp/issues/142)                       | 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/140](https://github.com/AcalaNetwork/acala-dapp/issues/140)                       | 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/138](https://github.com/AcalaNetwork/acala-dapp/issues/138)                       | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/137](https://github.com/AcalaNetwork/acala-dapp/issues/137)                       | 5HY8hYMttrbm57MmN3o9p5ipF8i7eBjdWw7TQVsecoP7Uos6 | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/132](https://github.com/AcalaNetwork/acala-dapp/issues/132)                       | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/128](https://github.com/AcalaNetwork/acala-dapp/issues/128)                       | 5GHj5DF25uK85M4Uq29cSFVQMRkzHc1RmVXZPW4zf3NXf1c1 | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/64](https://github.com/polkawallet-io/polkawallet-flutter/issues/64)   | 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/65](https://github.com/polkawallet-io/polkawallet-flutter/issues/65)   | 5E7b8rmiWDahDN6ZUNuyqmSirQsPj8PAMZ9CYMaURCjcDEqn | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/68](https://github.com/polkawallet-io/polkawallet-flutter/issues/68)   | 5EnWSikTvi8Y3S6vQ8TM3q5joFe8pCa4LjAbmEaXywwE6ioG | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/70](https://github.com/polkawallet-io/polkawallet-flutter/issues/70)   | 5EnWSikTvi8Y3S6vQ8TM3q5joFe8pCa4LjAbmEaXywwE6ioG | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/75](https://github.com/polkawallet-io/polkawallet-flutter/issues/75)   | 5HWMnApHzkVV2ZqVLjjLzPETL8wwf1PvkFv4G7sMDMWqpHHS | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/80](https://github.com/polkawallet-io/polkawallet-flutter/issues/80)   | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-B           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/81](https://github.com/polkawallet-io/polkawallet-flutter/issues/81)   | 5EnWSikTvi8Y3S6vQ8TM3q5joFe8pCa4LjAbmEaXywwE6ioG | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/91](https://github.com/polkawallet-io/polkawallet-flutter/issues/91)   | 5DHcRs9udMCKtEmJEABY2HpECyTHHxgLL85pFFzN72SatAoQ | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/92](https://github.com/polkawallet-io/polkawallet-flutter/issues/92)   | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/94](https://github.com/polkawallet-io/polkawallet-flutter/issues/94)   | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/112](https://github.com/polkawallet-io/polkawallet-flutter/issues/112) | 5CG4jmkk1neZzbKCeQg7kYv9PMko8zkcRqVvAFzPHuBD673q | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/114](https://github.com/polkawallet-io/polkawallet-flutter/issues/114) | 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/118](https://github.com/polkawallet-io/polkawallet-flutter/issues/118) | 5GsQUJ8ShoFrt16vWLekvk3T5e2tYLTVWN5mHrwthSdxL6Fv | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/120](https://github.com/polkawallet-io/polkawallet-flutter/issues/120) | 5GsQUJ8ShoFrt16vWLekvk3T5e2tYLTVWN5mHrwthSdxL6Fv | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/127](https://github.com/polkawallet-io/polkawallet-flutter/issues/127) | 5GHj5DF25uK85M4Uq29cSFVQMRkzHc1RmVXZPW4zf3NXf1c1 | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/128](https://github.com/polkawallet-io/polkawallet-flutter/issues/128) | 5HnJRCcbFaTjaYhmhTiNavSStkxRAmeX2EiEJq2vSnN5Q4TJ | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/137](https://github.com/polkawallet-io/polkawallet-flutter/issues/137) | 5FEp7o7MW6m5Tx6G5pGeto9ZQpfHKePVREVkmDxV58ZoPg6H | bug-C           |

#### -Coding

| Github issue                                                                                                                                   | Mandala address                                  | Judging results |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------- |
| [https://github.com/Ryabina-io/substratebot/tree/master/packages/acala](https://github.com/Ryabina-io/substratebot/tree/master/packages/acala) | 5FEoLBq9BP8X3iU6iPmW2KWJahcCazeSaLPd2CamVfdwsCc1 | 1000 ACA & KAR  |

### Season 3 Rules & Rewards

#### Week 1: User Participation

**Duration:** 27-July-2020 to 03-August-2020 (one week)\
**Award Pool:** 20,000 ACA + 20,000 KAR

* All qualified users will share the reward pool
* All rewards will be recorded and published

![](https://miro.medium.com/max/700/1\*yVdIVTMQIPWp8FgCtrT9MQ.png)

**Participation Rules:**

* Get test aUSD from the faucet, fees are payable in aUSD
* Users completing three meaningful transactions will be rewarded

**Meaningful transactions include:**

* Use DeX to swap tokens
* Use DeX to provide liquidity
* Use Honzon stablecoin to collateralize for aUSD
* Use Homa protocol to get staking derivative LDOT
* Transfer aUSD to Laminar Chain, and use it either for synthetic asset, or margin trading
* Mint renBTC and use it in above activities
* Participate in auctions of system

#### Week 2: Trading Competition

**Duration:** 03-August-2020 to 10-August-2020 (one week)\
**Award Pool:** 5,000 ACA + 5,000 KAR

* Top 10 qualified traders will share the reward pool
* All rewards will be recorded and published

**Participation Rules:**

* Use the balance of USD as the unit of account
* Profit calculated as ending balance — beginning balance

**The rules for ranking of trading competition:**

* Snapshots will be taken for both Acala and Laminar networks at the beginning of the trading competition; the total net value of various assets (including debts) will be calculated based on the price feed at the time as the initial balance.
* Another snapshot will be taken at the end of the competition, using the feed price at that time as the final balance. Cross-chain transfers (e.g. transfers between Acala and Laminar) are not counted, while transfers between addresses are counted as capital.
* Profit margin = total value of final balance / (total value of initial balance + capital sum correction) — 100%, all accounts are ranked according to this function.

**The following are included in the balance calculation:**\
**Balances of all assets:**\
— Acala : aUSD, ACA, renBTC, XBTC, DOT, LDOT\
— Laminar : aUSD, LAMI, synthetic assets

**Balances of all DeFi positions:**\
— Acala : CDP (net value of collateral value minus debt value), share value in Deposit & Earn\
— Laminar : margin position value

#### Week 3: Black Thursday Simulation

**Duration:** 10-August-2020 to 17-August-2020 (one week)\
**Award Pool:** 4,000 ACA + 4,000 KAR

* A draw of 200 qualified users will share the reward pool
* All rewards will be recorded and published

**Participation Rules:**

* Day 1 — Day 3 liquidation events: users participate by closing CDP or increasing collateral
* Day 4: emergency shutdown will be triggered, participants will use aUSD to buy back collaterals
* Users who took part in the above activity will benefit from rewards

#### Blog Bounty (Throughout Festival)

**Duration:** 27-July-2020 to 17-August-2020 (three weeks)\
**Award Pool:** 2,000 ACA + 2,000 KAR

* 10 awards will be awarded in total
* Awards will be published one week after the event ends

**Participation Rules:**

* Submit a blog to either [Medium](https://medium.com), [Bihu](https://bihu.com), or [YouTube](https://www.youtube.com) regarding the Acala Network.
* The article must include your Acala Mandala Address to receive prizes.
* Submit the link to your piece of content to Acala [Telegram](https://t.me/acalaofficial), [Discord](https://discord.com/invite/vdbFVCH) or [Riot channel](https://riot.im/app/#/room/#acala:matrix.org) using the hashtag #MandalaFest3
* The content must be original
* We will judge both the **quality** (how appealing is the story, idea, perspective, insights, analysis, etc) and social reactions (number of comments, likes, twitter or other social sharing, etc).

#### Bug Bounty (Throughout Festival)

**Duration:** 27-July-2020 to 17-August-2020 (three weeks)\
**Award Pool:** 10,000 ACA + 10,000 KAR

* Please allow one week from your submission for our review.

**Participation Rules:**

*   Find bugs for the following two repos:

    [https://github.com/AcalaNetwork/Acala](https://github.com/AcalaNetwork/Acala)

    [https://github.com/AcalaNetwork/acala-dapp](https://github.com/AcalaNetwork/acala-dapp)

    [https://github.com/polkawallet-io/polkawallet-flutter](https://github.com/polkawallet-io/polkawallet-flutter) (Acala part)
* Bugs are judged on significance and severity by the Acala Engineering team, and are awarded roughly based on the levels [here](https://github.com/AcalaNetwork/Acala/wiki/W.-Contribution-&-Rewards#runtime-bug-bounty)
* Please **include your Acala Mandala Address in the Github issue** for easy prize disbursal

## Mandala Festival Season 2 (Finished)

\*\*This event has concluded, thank you for your participation. \*\*

### Season 2 Prize Giving

#### -Running a Node

| Date  | Lottery block height | Lottery block hash                                                 | Prize winner                                                                                                                                         |
| ----- | -------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 05.11 | #251,219             | 0x01df0b375cad466998922dedfbb64117f2c35062c3d74324afa472283df0ca71 | 5CJX5TSEokNNvgN23BKDLg5wPrC1hjmNb99hwndgEJK5x5jK, 5HEC1VAU2qMrgEv3f1zbjKQuPHPpYzra8hSaWVhNCe6yTMVt, 5DAFv2ajCh7EV2Y6Pk8TuDFcF17GDE8RXk7jfWUnjCaCmxJu |
| 05.12 | #274,515             | 0xe7b70e0e72b3ef9a2fcc804842b89a402ec1338e7fcd0df50ebb6636ef490447 | 5EPMpXd7Gch8YQU9Q6efHKRdpgTfQ3kSLYKBRiiBB6nWPUHn, 5G3zwZ72e6rbJgx6cfmpKac3yBPsLM1hC173U6XNeMexqMhS, 5DAFv2ajCh7EV2Y6Pk8TuDFcF17GDE8RXk7jfWUnjCaCmxJu |
| 05.13 | #294,600             | 0x70feac7c162306f127afc3de785c842f3ac30f23628ba619d69e7fdad42907ff | 5C4rHmiSuvhtBbNgM5SExDavrLKKiy6cj69XAXiWkA3GXWqM, 5FpzPB2cKtY8pPwrezs5AzxtJE7tS4a5yhY5DzGHBo4ND6gb, 5CMW4BiVqfJ9Li5uxiG1HnzqigvcZfWbK8pekrUp6teHw7GA |
| 05.14 | #316,704             | 0xb4e22b354bcf958dd6dbb322b101e3cf619d06af57e99aee124de26f466dbf00 | 5DAAnQ8fmLHVgyNYdEK6fUDYfBsenGibK7KRBh4EsPFdHdMU, 5EhNvGHoHZQQ3X2JU7tAqcWH1g1rkaL1Gy5EXKZv9QHcAmX5, 5ExgRHZ8cuWh4Dt2V6Ydmsf2XAc87WeXC3ZorYyADNEff6RY |
| 05.15 | #336,267             | 0xfbdd5cf83ba6acbbb333848e9e9a632cc709618422f2604ea6c6468fbf599b97 | 5H6dTUCK6mAdEQFngxNhN6vQGtMGrE4zx9mNG3Z81Fy5mpPB, 5CDA3teXpfFAqQDTebUXiZn47udHReALJapzcteBPPSHPFJf, 5D1oMcT2murodKF45Bb3dRybrNnjyPpwb667wWmdYMoVKsB1 |
| 05.16 | #357,984             | 0xed7b5b24c2db151deb92c29cbe890cf7324145de776f711d3fa33abad9247a37 | 5FUNFsUPuazzyyVFUewLpJY2dDtaLGZMycVk5MNjNrXQfAnc, 5GpTcbzycMjynCSfC7HgyT62BKhk897sa1dWroHLo22AmirN, 5GQk464Cr423dbFD3TjUAsqAvUpmBJhzg4m76vBq1u8bhdEc |
| 05.17 | #379,449             | 0xd22c10553f9af9be303d0b5d8a8924bf41b6a9885d6106a464a2a9c0e93aaf21 | 5HijXXTbM4GfcdtrGA3y1y8GakoHm8RqzoSkaJTtnqMDav4p, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5CD2jb9ymzGxNyv8bZUzFv1MxG36rKgM5V1F5hooa6Q6CNur |
| 05.18 | #398,280             | 0xfc9eda6510bdeb2e8349efc91fd889ff8469a72b799f110e569b3c77dc3006a6 | 5DWdaeDayQE7atntBewsLoyMpZFEeX5hcjR5dMKPrXtkDvAc, 5FcYmJPhLHVt2oo6tFxhS2cht5gjyTV1gEFohWPRGPCtD2Am, 5CGDgQLzYTxKcHYb7C8uNakKVsYz4LRdHuDVwrXJKnZdra3L |
| 05.19 | #417,178             | 0x6f5e61198ee7e0c4874dfeaea61033a772e4a1b717e81626ce2434e5f7544500 | 5DLYY2hUHo7pR7dXff7feJxqEbR4K8EpkxjfuFd9w6wj36xX, 5FhM6Sgv37LBihxbtESj4Fhe7xC9mNxyhDYgtnLEMsYkoCVv, 5CUqbTeyVr3DdESFLSDecjUgXFBR1Mo8HfnosLrmzzhpJCUv |
| 05.20 | #438,953             | 0x0b73365648fca64af828acd2c67e67731b64ca476a10b80dc0b156101fd6c178 | 5HKpMk2nVnQ1JXehM5A9vR9ZkMFbKY2KuDsFGgknqE4PStWh, 5FcYmJPhLHVt2oo6tFxhS2cht5gjyTV1gEFohWPRGPCtD2Am, 5DfVaYbSpA8gFheWLvte2wrV3HhUBdvPn6kTe3QX3D6zUeme |
| 05.21 | #460,623             | 0x81a45c54ce71d50b2ac04e21290d2237f2be60e8fbfdabcaeac161ed3bdf6de6 | 5EyM7jb8Cdw85HxCzZGivBhVGrZGoypcdbR51FfaAYaNdZxC, 5GuoZ4eAEHu5qjPk4ZgPZdVEVKA1yv8iC4L2bqmcH6E6WGC1, 5EZQyjBecaRU1J3rSJ3A6DnX77xFivcTi1H89EVs4HoXVVe4 |
| 05.22 | #482,021             | 0x43a578f853781bb3bbf391f902979567c6ce319bc87871f33bf38e1391e182d9 | 5HMmsEtcULw2Ki5vHLqCRhf7anrrpQXoEdsSc1JVyEesyu4Z, 5HeECZXW5ZsXoM86nbucMGQRbW97JaHi6cZfVm42seJnhjqe, 5HEAjRVcw4ojt79vBYFUZoWZEWgamnYHpfhfr5z2uq7mEnCP |
| 05.23 | #512,522             | 0xfac6d697d41b7b449001d31e537fbd4f029f55dd0b0efd9b89fef4af14d55c34 | 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5HK3SAatYmuGPd3Zrm6GS2zXLbBq2KBxYDi9jMEHhEgmM7vK, 5FCLJZNNbvvmttq8pmxtvfBryEKDBSrfKSxs4b52qoEZUija |
| 05.24 | #522,939             | 0xeb2743133829e39b8c309144d9d5cea80841eb91145d0617787c046649523b46 | 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK, 5CAiDSjAy66z8n3qGdcdmXNSWm1q3t2WrPXKRJDUGa3MdNYd, 5GvRPmPv31DVdorQqPTGYNK86wFFyPXJBzobmHN4FJgAjjmE |
| 05.25 | #541,295             | 0xb4691171a4932422ba6cc081cdb71b6709e5ac7559059bc71b7e3c135ac71338 | 5FCQkR78xQeHAxDJedLKEvxqQXFVbQQMU5i3wjcPfmQqwq1m, 5ELbRUyqUbiDei3F7kAwofGGaQx1NQEaQnVN1qL11uyZUCfh, 5HKpMk2nVnQ1JXehM5A9vR9ZkMFbKY2KuDsFGgknqE4PStWh |
| 05.26 | #561,661             | 0x9f0ce6d3bd0c218880696402b9eb1493267df716d731bf9bf4d723813a16590f | 5DwLnHrztS4zgvU2kgvfhPTNRM7GimfqqY8eGjmVYrEhQsfr, 5FqNMQqhaKPKc37jeFkPEUT5UhyArrDsmmkiv2GNoopXXp7M, 5G1QqeKBvNiDRJDrQwbmcAJTmBdPNPrB3JRr179hkaLKHkf6 |
| 05.27 | #576,656             | 0x21845acd7cee374dbb4d865dc026717cf655f79f0a9cfe630458bf1163c6cf02 | 5GCH6eBD7M6UFZPBsfPEYoUNyKScX7HfCXbDgsvVfovEaFj1, 5FRDxPezSMQ6VCpoxFTTH1rF4i1mrA9H1xd5VmAKyWPjUWFF, 5G94Wzuc5EBemwKGnBf18JwxUw8QtenRkrEiSbLCaMc8WFpR |
| 05.28 | #594,336             | 0x3fe3144036e6ec66650aafbb1b83c7d90859a361167e4f285e0538220a43e225 | 5FcYmJPhLHVt2oo6tFxhS2cht5gjyTV1gEFohWPRGPCtD2Am, 5FRcBR5j4LDToJsYUqWBK4TBtMbrMZZ922M3NEFw3zMH1LeJ, 5DWdaeDayQE7atntBewsLoyMpZFEeX5hcjR5dMKPrXtkDvAc |
| 05.29 | #610,930             | 0x2a7043aeaaf8cd83fbc37a0041f0506b68e6568718edb3ef7aecc5b983ec2287 | 5EkbLAJVVgt4wKAU6KAhopyLpyLWMQNryWwKxafic45vgv2q, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5HVfcWDci33Ekkg626Mh7QjEaoRZRBByxnLo4R2Uss6z7Woj |
| 05.30 | #628,500             | 0x396e21978de081e0ad9e7a2c43df77d4420d5bddb7c28b5a54493ceb37c2a285 | 5DfVaYbSpA8gFheWLvte2wrV3HhUBdvPn6kTe3QX3D6zUeme, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ, 5FcYmJPhLHVt2oo6tFxhS2cht5gjyTV1gEFohWPRGPCtD2Am |
| 05.31 | #646,984             | 0x7578006bb50d72723678c0243fe5d2cf65808d8f78291d2e25bf26345ca47ed5 | 5DskzyXfQsxD2vJZDzCfXFnRhicHfAtrZ8qcM7BHsQFg7Wrg, 5CGDgQLzYTxKcHYb7C8uNakKVsYz4LRdHuDVwrXJKnZdra3L, 5G99mYA6WVjRTcpBFTsT9U5s2U7wknEpkqSkMW5vTnjdMCao |

#### -Using Acala

| Date                    | Winners                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| First week (2020.5.17)  | 5C8c6AkPdo83jvNvvrB1jnTi4rfkuLp7H5ziuLTDsT42gntN, 5GKwogqykym1Tj2X8qeWjW1NsrpaYUCWtUAXMiWNow9X5qYP, 5DPLDMRLoJVXXH6bnVKFjBoc52yyJeweEqD2s9bkFCAFy6k7, 5FgZtjHpi2j7kiPFoWWqeVNiA5mWM1G3nTbFkMqWh9muCpMB, 5F6ZYs9qBjjGC3ahnpTWJdK9YrsMqyvVQNqKaSzpWyWcq7Kw, 5Cni8QpH5uoxCrueohD1anzVy5tHsGzRzcgEh3KnpoAjyL5p, 5EEc9S8WxDJuSDWx3DhS1JShkmvf1Azvptw72WFV27aVgYEe, 5FWi6DKmWkipP2QmPthPkbSQKgzsV3svenKuHtLLsUYA4jUP, 5FTmLoxxwo4c8UPRsexFeh67rvLKRshMbAiNsSETCVf1KNx2, 5CSiUcV675pgF8GEqmE8aMHaaJ68LoLtQB288BPjWHYCCWi1, 5D85GwB5aHyzWp7aUNqx56SNLRHfEDxekzM1XjcXnqXKqDGg, 5EkK4ckcii8Rh5wjfBxFZR8x6zXZsqw8FvztXUsxkoYf5A8v, 5DJ3AYyRDhHAtkNo5KquSyxKE5qh4gUTd97uMMCn1NvRv2tr, 5G4HnA5bkvN3Pp1biZ58p9yG913TPhYScjkqCyQVxSrtNhe1, 5D2KBQCSN9mYML11QU8d5rGFU1Ly1qEBa5QBnnUk2aqZ5HKL, 5DSdXBN3Jhzeh8DkPNP1nXtH8rYdMB5SQwbQbaB8RwYPxQVv, 5Ejjadgnksz8iUcsFVNvfn91MQUHFGyfuLyLsCFgpbkfbmnb, 5DqLuSt3p3tqdpJv6HeNjn9Dm7DeKp7ymVDdcC7u6Hunc8UP, 5GbkWuLmBr1uK7b1vUZYmoHGTJr2W8EzG9bfD5zoNFi1g5vg, 5DPAk4ap96Mztkcx52hHsRLbNKkusuDhSVgBEq1GVXFPp8B2, 5D9jCc51fi3TnLYA8XMVF5aHmjm8G4UUmMUerXUmhQSuPjcP, 5He3JU93f33SB5RmjarNjm5b8QQDERrJmZnhftuEmqkh7SXX, 5FumYi98H75nuw53eaxi6cUYTWt6zYWy8mYQTADNxx6degYj, 5GKHovanB2trzrroyuBDnHTa5Z5QzAcEiFPo23gJE3SMkN5n, 5DMHsL9HT9sagGWFAXzsJHwJWDaZAi6dwo5Mg71pmW3cdgKA, 5GjjWFCsotco2y2RDPiHb96qGanksRKBbQmYap3rUnj9ZLZD, 5Dkrg1YhDZLNLvrDWLJYcwdi8xiWkS2uHHagH2yMmr2sVhEJ, 5G9yaGkUzFi79yAtUBS8KWMSEWUYj6FN3H2UigdGdqEqUDMw, 5CUxRHi1NYfc6B4Hf88oZdXpKsLq5dPRasc8TkomGcXiguY8, 5EFTR99QgWBBFtnY9XF3K3TDmy7uqnfMpo2RKpS3tCbFF95y, 5CaDxH38KogG2DCXJCfcecxkgWhsiM2DZPAnqbWnBzS88iKu, 5Hoz6EgGGKFx36ic1nRnTRNmGj9Kg4WvKKjoK21pJxcDwqZ9, 5FCarHh46ybyE9uBezdXrF3mheLPPyn7t9kE6iq4yj2Qj7bd, 5GbdanEy9SpVCq2Z1PykwGzNPhQL8zJ1bTnMoWtCk598w4bn, 5HiYRk7cCdzDRNECKr5oYJ52qnN5fEQxNXeGMEmScBAZWN8E, 5EvsAYYt3thMinh57b4Yaqxs5uCCHgfCBbsckD192LmYJEhm, 5F24ZKo2vdChyHGaCYQHRJFt9i2jsZVKRiMrLEhefBP2tNKJ, 5CigNmZQhti7bjFAonyb4QFhryiGUBajtk6qi9tNzbWaRnRH, 5HQUyy93BQn5cQPK4ZFCjLNSZhSGesHiuHayvXxD7jThoQcT, 5CFWEetvgMwrD3DKAWTx2GvzGQAp92HXrmUQ5ZWdFJugMEfY, 5FnUeXPVbH2FqVHB9VegSY5QjAc42QYPdkr9fab5KvhRUhLw, 5FUeLM1AnSwH3gHAtbyY8FKuzh2URgFr1nvVZUipE4iA9H7i, 5GCEaNUM5MPtM1axQHcf3uL6GTArQXCJRoLdkxVJqeSrDMQc, 5FxxMVNbccWAmTAWPfBTmJB4DM7bEWNLRSbgaC574wkoDvcW, 5GxsGcDPdihV74hzcVhJ9ELP3JxxpKXaYeVRydUkZ4ZBabbM, 5G3z6p2wW1HV3f2JeW4PhGnVSH8VEzCfdBAzuafaEg6CiFL4, 5Da7gXBqzNax61FPu4F53GTCnVippegmRK96d5vs79XUoqNZ, 5GBhVZpdwkrmEneZW85TWYTXkvZau8q9eeB5EdpUHwJntTgm, 5GsqVoRk22G4b4K2fPg5kjCU9ABtcJjjXx2BvJyMrR8qdh5K, 5H3rq3eR3gwtAZhhctacokHZWEdPMi7jcPoJGPGjKHgCYJNW, 5DySCTo3j5EHqT2gAHbBFJKNh5UiCRKuWJAJnP6K2F3DJjen, 5GEyLb1dXb4AgLZyhYUTCdYUSGy9ASezMPQTizBXgmi5g2ru, 5GzaXMTKvXMcPCtDuKQFjniFpqF8DKNokZV62SM7yvkmZsir, 5Dc6tADJ8QQV1cT5CLBGjST6YSrbwQ9P7N58VMDjbyvF5HLN, 5Epj7TddcPCj14WfaHXwq5Qfu479XxdBkpKgQSSfEQdFC5V3, 5F9uATGtQairBzbLRW4jjNucCrAVCD74iDHan5Z4wMLjPkoR, 5CwhYMf25JSzF8eihpJHLFKq6ZNj8iC3vHyvNYpDxi18RGC4, 5CWzbY7U9mj7upk7ZSfWYLyRichRuXYWJDG41HUABxWfujXk, 5HePbkgwiyzMhTrcy7Qms2vJ4fd1u96xSyAWw9dcFmZTZaAs, 5HYVvapt8PZMnniBTHKm8iCkV3F8q27cQZf5eyPdXLQDissC, 5DhKbq3xPogHtt1qq1H999uuxhEcX649t2uF7TPswjFjhbGc, 5ECWJjN4HryfcH4J2PKc5jVgnuABm1yY5oGvudG8jp59wcVP, 5EHbWxGygTVivzJWkMz7GcG6dkKiSc8qx58CEzP7TTPcDHQx, 5H1ea9WWJeTDLnMjcZ5eQFD6Twybnt8Ug3aVVjWGac4jwf78, 5EbzbdMBtNim5766siKc7BXryMBmymedQAk2VTGuMpNnj4Nv, 5EEiiSW5oeR1xgiQA8qo6FUTr5595Zkm6KyMBKUJ8TmbYFHA, 5Dhz4kfSzC7VNxmhgqYBNXYnTXNfrx6t6qD4KG8Wob1A1wPZ, 5CA4Ty5nhhtoSuLF5rM74iYq1uhTBDJJNACYwpVgiMQh3okc, 5HmhdvsHbHPJkAiWDj1WqK3X1CGwGDwUeut1ikwfuQTRVQL4, 5EU5Js4YDqUxo6PT2xsCvnAiicparnYzbRsPp6tdrVG36Nhd, 5EWkyJ5APc4CTfQxxxGee7f315NSsi86zH8aG8d6k2L9ubs8, 5Fjsx34RQ9Y8icHXVsS8onq9s6gJtybY8ETHZpvhkLioWwwH, 5GERE35iVpdBs5KE4GUy9TiNwcjheZkgBDkaEnQn3j7W9oTv, 5CAYEubLBnqzhPtzYXp4J6a8pdo7LKMN5Y1xxSYnPNed3mkX, 5ELHtAvB9SeM5U2RvGnntsTQFpLzpFNiDytyyJreDpwsM2Pb, 5FdyvmGABLnsPAKsf4KzWYmPf8BQqxNK3Us1TSsvngwNbpku, 5HdWuHjkavLpQwZSPeam6zyVTLSEgh5XNJRXW3BUBdPgU1Ga, 5DXjFu8qgmPR6VwoatoB27ZAT8FPcsZsMUyJuxazg2iZ182s, 5F71vUbdRpbNojgetBr3U2mS1xE9TzpyYKndqYvRyq1Nz8qz, 5H3h3BZxj9S6pUP4TVaQShRRM3qfWpR9eUMebXjt3gcoFM8A, 5DqevrgJrQb4QQqMBN7xqghcZyFazjCMKhiEqHh7zcjYnopf, 5H3sumzg2W3x9uyS1JpgWbU8MR1sqodmCa9f1duLgEUkxMZo, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5EXTTcfmLBTMLuzebPpUUeCPBjXiTY3nJWp4APPiErZ5GRkR, 5Ck8bzyNxZxG1MxZik6HmnjrW78NynQkzzxd1QWgaBW4mDbK, 5FnfafKgb9xkqvTKzyHdCGf93aEtAkamXxDzxAQW9NRyPssm, 5GpE8hCoAdyANkEyFvVuDhSRAoqHK9fN6kJ6RFrdzZaoEUTJ, 5DD5PjgMtJsgbgaHfFWQ9QmuzRp3mbunp2LJZWHUcM5Jf2XK, 5E9UhVxfgwAKJfqU2sCDtg7fqTPLHiUegH2gaKkVASA2BYAP, 5Hh1jyjseRp89PkxiLzL287egevzuDCKbSfsQQTHgnTezo8h, 5DxuG7ZJC4wYA19kyFFpFn9nNbk5UCWgZt7yyLSVBHYoWWkd, 5G1USqv3JviQUn6oyiwXPSpUbWaSgziNaYUNaJj3HcvihVSL, 5ENqR1WeB42P3YYiokQ5SMq7tUKbTwya1a6mV3o2Z3s8ogKB, 5EcW8G83Y3QqgDUutQ2iFBxAf7hUmw4Thetu2tVwwNuxhn7w, 5Fni9NWhoPms2vxRdn8manG4zqaRADvkwfHvSB3YrUzyXs7u, 5DXgYEEjLSKMKmNtoqFFyWiJrcm52BAAeue6bECymPQ1k4R5, 5CdPdg5CjdpPw7DDsJQbbYGaAD1bDEcQf565QM3Aq65rVD9D, 5ELLRWQ7TwTQmJJp3dbKMYWNVQpXjMc7GAhAJb2m6KLGoMg1, 5Ccs88zWQFZbX2yzJ4xWp6PXav6Q3PtqXxH6KCL3MdKARHyL, 5Dcxhmvr9gExJBAAg8LA3Tiz977EEkkNafom6xBJtp26Yo8o |
| Second week (2020.5.24) | 5FhYsc63qoeFmZ6wPEibDbtyVLi8vntgmGnwXmZSNPYksVhV, 5HiomKv9wz5qWdVGqgSN6VQEuKPtqUZz8SXc3sRWvVKKsJAX, 5EyfkCN8yNaZmS4ArBtT5XKSV6euE1prSTeDuoaH2FqToCeg, 5ED81iwyeEwz5XR8QT9yVGsg9UHx9enJ5KodcCgBfbCsBsV8, 5GxFeB96U8Suyvh8ed3dUMxDBnuUv9AytzwWVvZeq8BGBwBg, 5FehdfqjtCYsn5T9jnRYiGEfjdQJJCeSHbrMr4HAgSibVbk1, 5ELJeJGzihKYBjDRDJVPvVKDsht9F3nuoE3ok3dzErmyf5e2, 5CwXXvCnknjixLYEAMQayN7nKqWtTkvT5jaURQV51cNgA9Rf, 5H3rq3eR3gwtAZhhctacokHZWEdPMi7jcPoJGPGjKHgCYJNW, 5HjnLDUxd5KjxyjHNQYwpAoQb3QpHXZfawD5ctCRZLQTN5vo, 5FJ5jbfH1h8DuYJWEVUAnC4yyL7dZLz1GGsBXmjjv3T2WoLC, 5FxzuAH9aQMJz1YxdcRKy75GgrbWP6FXPR1skBGN8wj9QWLA, 5H1ea9WWJeTDLnMjcZ5eQFD6Twybnt8Ug3aVVjWGac4jwf78, 5HTSJD3UxqmSJvKzggiCtjR82GELd2icdyDmRkjGkVJpDFsY, 5CAst3Pzo3P2xZSuGYpcfwhzafqMyZbtbuJD9USbAhHAfR52, 5GQwMYScvZaXzbq39T9a6bd6wcQbh9T1X6L2AtAQvbWnPFwZ, 5D4suJNFb7DaF4tCwCaDAHTdivRq5Wqoj7s1MBQFK3aFNtgW, 5DZius8FMk8LLrLN7UG96SXGRdr3eSkKqzYifjnKZ6Xn1nX9, 5H1D2x61wsjrFgniEhbTMu5NtkPkdAnDjzpSqmT1av2HFG2U, 5Guj86zqCChEX7jhxQaHzjYLbjnkqCZnV6UsUJNhbFhupxUF, 5EqeYfFtj8udMEpyT2WPmS2g7UBkT8QBMzV2rKNemTz48b4A, 5HTZ4yPDSN4AZNH9BnFscqcnCeMryRAQRiccmKCDiHz9nKPk, 5Cow2NwWygaDnbPzMiZoa2dHoZbr16rH6Rm6VtiFiDUD92zr, 5GHdTHZwA4tZgcLRZ9f5LqCmz61oyPxW2q2rdz3vR5nDx6oU, 5GKwogqykym1Tj2X8qeWjW1NsrpaYUCWtUAXMiWNow9X5qYP, 5HHU85GFqJogMCFXUQEThdRJxs9fgCn4S8z3b1TsCYXT8D2V, 5DernvyaSP9UUXNgzNebTCjRFpDiakL5MvNfnQM1pnMhgXoo, 5DFZAuyRSBY2kqsT2w31Uyt6Tjjd5FbWJBxowECNH9v2eypD, 5HYopd7z6p9tcwpFXVWUfUakLHSaYTW86mDRQQEuJLys1wrQ, 5DZJdAZT89dyp1umqtkVKmmkbZAf6iqS8Y8DCHgEMosCmE2Y, 5HDjWJHPFXowWcTCjpThV64ikGTJYFmN2A6x3tPq1hiCWRS5, 5CvcAz6z3g7vLgZH48764DhsefZitC6XMF8Diz3tGhHA4xDK, 5DCGz9hd15eB28MSGcosBygzYVGi3Cz9KZBwWxu7FY4sRRiw, 5Dhahn4Wnziic2gExmc3qqiuy8Qvv3xTY7BaZZ78hU9a1gk1, 5Enr3rzwnRhhWbN3tERd8mcJggpFPFceNHMYpiJoUyUKdjUg, 5HmhdvsHbHPJkAiWDj1WqK3X1CGwGDwUeut1ikwfuQTRVQL4, 5FenZupEDDUwKrV5U3Drn2NKmqbfpJZ1JapU3YTdoKqKR2m9, 5G1SCFBsKLmvNX4u7u6U4vRW8cAk8xcztoDy2Wetd5UmwUXi, 5Feo42CrZdrj78dr12FXZ7kTC3avura2UoZ8Ba2z6Yd9Vn7Q, 5CB6PbeoiecFstKoepMY6CBUy4nyGt1fsPZZKR6uAQ1xdgPx, 5FxhixBYikArCWVVdrZeh3R91MACmHnoJVdd1gYkoAWiCg8Z, 5FKaDvg7SDwCFRsqowyN3TSFNRUFh9sfjqPaEGZfxFGhoxx2, 5CM486QrHrqBKa1qTafUaouhUzjhJfkPWy1cDwYrE35yrVSw, 5DnogbAM8JJtNPqWcCDQEpVFPQ98KXSaQaDNxG6QMrnv3eWD, 5DHgCdWeKRgtKm8As8u63Ju5j1xBsixG5DZd1tW8BFyqizSy, 5Fe4ktn5s58kptS4o9a948PkYcz2bcMRnc5oykQSFXimqZ1W, 5FUb8kW9oADFC8g6E9p2hnKv6bZ49LxBiYoLTzjxS5kyHnd3, 5ERpya8izCiHtusF5cYhPbcNnUCaakXW3bsjLaBCG6Hew57H, 5HGhQVraJnQiFvT31VpLMT9r4EjoKnyD4uNgCuNz6t8FnA6j, 5HfxXr4rVam6iZdLYh53rxXr9HR7caTXWku6fFrGpovzYbxL, 5DhzGLGng5eSwBwqqFuJoEDwzSbvUzH5FYASuyU5wM2nPGUa, 5CPxLw9wxFNRG7BEC481cjxQPaMi3K6u7feiN5JA5356Hqco, 5EpjFHQSm76NVWgzBRQjiDjgqBhrUVVj8NHKnWChZPc5fGCD, 5EykxaQicsqV5uDb9mkQqDBPXVeXz3Q6qwz12TaRDwrQTmnZ, 5EX8im3fGZuNBzLsRkjnKLZ2mCo2U5jBAxdyNJoMRzUutrim, 5Ef37EvhzgPipLy1xBmam8uZhxj9muwqZf2wxACfaqTNR2jm, 5DtXfXu7CLG9GMx7vzsmWShCZ8Hjy8RsXaVTk9Ca7hH5MU2k, 5HYSDShKetacf2yQ7NSM5GCfbGZygDoev24BcR3HAYGmLkYj, 5Fj9ZrmsmEDHCKkBwPLd6c94tPqrQM4mNrh9McvShRQr6E8u, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5CtSTnyEBNUXQM7rgCVG9VrAHLUSHgiFx9R7NoJBbZWepFyf, 5GsWU4dVFUESyXr9AjWxZ4hWEPo4EvFMaAJr9dH6tT9NWQpF, 5HMmsEtcULw2Ki5vHLqCRhf7anrrpQXoEdsSc1JVyEesyu4Z, 5EkS8WnDioUMWrkFKFq3E51tJSTq3Jbxq4CBtxa2nXxsYbCN, 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy, 5EEc9S8WxDJuSDWx3DhS1JShkmvf1Azvptw72WFV27aVgYEe, 5DDHimfpk2Age8sAVepgjHYHxbEbvNpMmuuEqf3zRi2Mwds6, 5HE7jgSAS9dt9Q4QkqeSkKQsqCdmGpEP5KVyn8tnYDHv5Q1B, 5EeaCCkUMZE9E6tJmeZV9t5NGGX3i9NLQgrULCUgKk8eZrwu, 5FvJnChDiATr7smrwUeqNCvQvp5xTxsZorsoNJbmYXGwJcjK, 5FWvSBjMD4cqwMX9K9VkccEvKcrepaYF7MkhNAQv7b4buxuo, 5Eya4fKbVPFLSXjt3CLAnSnMRvyda7jk5T3cag7QbkfGBVGY, 5H98YrwQKBoxUaoXDiAgPLG5V8FuiQXH7CiAbQoaT2j3D2k6, 5CSWAuULtWgfJTVGjShiZzuE3Bi9EigiMmcXUbZ4a5LaWLnE, 5GbdanEy9SpVCq2Z1PykwGzNPhQL8zJ1bTnMoWtCk598w4bn, 5GYvrhWDfcmcZz7p8pG3EGVDKjYuKY4vHrrLU49JRhA6jdZr, 5EUudY9pLJ17acK69CoeP3x5DxF7b1euinNZZFfCDeB3vRKy, 5ELMrqw2pdr4wy3bH1U4ptvuQmZoWCeNBjJJi6iUZCpDxJuk, 5EeBjzorDWJfM3YUmECbsreDfPKi2jFMRg9QUaXvL4qdUKKM, 5CDcTTLQ4o2hnJgHebdgqpga2gn8mpnVXseCNAyqCaodM91m, 5EEiiSW5oeR1xgiQA8qo6FUTr5595Zkm6KyMBKUJ8TmbYFHA, 5FWLUKfzn8Dd46FW5q4qF3QTJp1hGvkU1SLi7BiudbW7iUSE, 5EL71n847E1mtdrhrhEWc81J6eLXpG6tGbjAq2yg2FvFqHDS, 5DU9oGiGDKn6ZCQgC7VTUH98FhKpSH8U5WXCqo7k3Dg11EJV, 5Gpnb6mfWhMcxLRjG7a7seH2BxVvGv9Lv1XUNUp84MaqzQUs 5GsgGaybXxXhyNdHyyGeVLAAwq9cxLaLZEiP3vBV24cwYuBB, 5EL36duLhJ7LixVUm7x6wG1a1cFMn5kKgPNhXNPH1miRCYxw, 5Eh7gFtkfCnsE25fGvhQThUAs8CEWKJhhUwgVYV2RwEZ3JVb, 5GsxWvcx9EvV1S12etrjN1cJhJ8PJrejUoTZvSi43ArD6U3z, 5Ebq5qime1tyt8XCSCLdSsfiWXtQ9fYb6KmVPrUL7RA7Xb2j, 5DRSmFfAqKVg3P6nEhje56gas9BHUC8RGC6SceyTzL62CZ6x, 5Fbzyxg18f2Ec2ZGB1GaZmndYwmE5Excvfr4hTT1RckXeDuZ, 5DM3ToUQpsLHJHj8csTUUzVrMx49D7h5F3zm14yYwTrmAXgk, 5Grjq2KK9Z36zZStnhz1H4EhFQnCaW6ar8t8crPBRM5TTZNK, 5GxAb7EeTGv3KfBfwhBGhBbASdJodKJwYoh2GkvminpofGvL, 5HEn1YtswEWpqpC9E2E21nCtUqgdJLQ1UfErVombGfHnKaGq, 5GC9wpaEzS5qUgyoTXAFTr4LcdDexM19bKp1gCvaBqkdX3JT, 5Cm6HNGkDAEVs1C7tegwK8jymrdgtbFQ64QwenLTXuTcUNhb, 5CYC5hX9kqgGMTr4bXFt491f9EaqNYetL7S35rGHnyd5bEEf, 5Dhx3TYcqnAMBUZFiDbcitNXLgaBeBWPk2QqrLHpTEFd91fi  |
| Third week (2020.5.31)  | 5GxE6K1W69b6p85ZBPsi8oHr7oXdTmWBTmChJNw9yhJ1p6Vi, 5He3DStdt3FM7GtReCZbuFBnwyiEGDqM4Tj9KbcJRZVkepNf, 5Hdvy7RP3Jkqp6NnCkH2Q5xjuxcGFufECdxdoT6Rcbizkp9X, 5CUiPq629ehrY5342HHg7RbhjVS5weGXAii4NBUXkbkQf5mr, 5DWog7SVoeisLBs1HerVsk4bM1PWKYrjaRYVFLnqsMoC7gF3, 5Fxhj8y9w3NTdhzwGKJAq53Vip7KW1Rnd9QdJwbcDP79Tr8y, 5HgU1yCa7JbxzKMbRFpQSyEAqaB7fkyfBSUSsqBGRmDEE4cJ, 5G1xzNiR9iasZrdRzkaYx2iLobQL7SoDajLkQF4AagfUngXv, 5EPXEFo5NKWC7smkNEiQ6H1DK2QiuJTv5km6ir1fUv7fk5PK, 5DnN8rrEqzraaVtpqFmk6Jm8C5KwFbFACwFbfGYWV6xg21f3, 5FWBPayAMieVEZZBwn2C4HuPed9eQKHeBzXYCx3TTQQSm5r3, 5ELJeJGzihKYBjDRDJVPvVKDsht9F3nuoE3ok3dzErmyf5e2, 5DZGm4jKftS6FT5u347WubmwXHyGcs663hEZy2a5QJBCdsED, 5E7a8BMH7qM5YEj5F9srTP2EsjPqpehFpreecNSC8go5MMwG, 5HTSJD3UxqmSJvKzggiCtjR82GELd2icdyDmRkjGkVJpDFsY, 5DANSWVGm6XGzUwfySQ1r1aUZRkvMA1FHV3mcnSPE2QyyrBM, 5H3fhCQmHvBfQSyutB6J21bUpEyVEAi7AvcohoceC7MMts2U, 5DhSjRdzy95zARdH9d5rBNb3UiQkYtqAwADg1knpAB8hg2qv, 5GxC4HPaMYHL6PvSxZovFEg26BrAdnkknssXKo4Xxe4jxC2E, 5CUSn28KuxZtChH2BQrzYJ3JM9htsAKMU5M8aCBSYua1gqG3, 5Cg5qLTKNuQWtb4gURGtUx4GAFU2xQoch3yncEfodDZYVAh8, 5G9jabAUNMMuMbCW6J6BEEVyXZnSweMLdTKH95VJfKyqtuPk, 5E2CrUQrmpArcwLqacpNSv9wBfoAm9r1e7P1Qq7cT4DQZ2v5, 5Fh3sj3TbX4VE3pEMSfTVgSJoP8fQrv2Sjd5vGPuLbiWnM6v, 5Ek9V7rXeAsujPHSoRLLTMLqLVUDNYZnYMXQkMsU17fQci4o, 5HBNQgq97bS17r46AXHMGEo8gAPB4bSdezNt3D653gnZyrPZ, 5G9geGFejThKPopYq9nb3nJSF3EqctFSfXgQJ5bZFq75HmQ5, 5HKCwHpVzyirADadG4S2qXiqUCtkisDjzzpKzYbwXaETjuWk, 5H8siwPx4Gd3kcaeyV6AxEUMggb5SXvd8Lr2Vnehq1BQynrb, 5Gzcw4k6Wmjt3x5YgFDFigbzBfNjubtVNzStdNmJxmkwgmG5, 5DCXAwW3YAqTYqrj39BVLCXRjFxrYHLzdQ6Nao87kCWpA6yF, 5GC9wpaEzS5qUgyoTXAFTr4LcdDexM19bKp1gCvaBqkdX3JT, 5E7woficChfKViP4Fzww45BXDEy9yayLPgRjgU7Fu6482GEF, 5DseXttb6tK5Ri1xYPPjgEo8tnMtspcgS1P6MZnzqpRNbk8Q, 5DDCNYWkKLjNhmX82jXcvyVV3n3yhzNBHEavKtcDnnioL9Ro, 5EyGyWLnv72K1uDFmLrK3JYxCNim2s79HcaHhQz6BWHt2Mkb, 5EKuJY9suzW6PxJkLcPxySoMJfnwLWLD8TuG39cF4PEydhFD, 5DbuPcnoAhW4o595E2698H8dMiedBVVYgKn8d8Nj2FAib9mW, 5ECbm64uSCzCZKUwc9hiFV3qJbHmX1bMbQAy9gh4y8dCDo2P, 5EJQueYsAh6mD1xsVtdLKC9mCCyJjtQr75RR3SFb3Em5eApp, 5EhgP9KUakh3YT7xaZ1xscdSunSfSi4EgM5faezg7QZtuujg, 5EAG5cxhBHZHd1kztDNkiRcqYWy46h4CBotkhgGque1tNa4X, 5FxHcEqyfByZqJGJfhvnKs1sws9yZg12q8UvyKqb4kcr8b18, 5Ci65F6ZHtwQJFCAmLvsWiEZj7eXgcx38MqKJRaAiBBGJAbe, 5HbAETp2UqoFsXYA741dfGXcv8hWBPLzP8nwhr81aUVNqmka, 5H9fEB1Q9KJiuVEgsjKPTqjNzBsQREoy6scSxY3cvkd6iPzu, 5CUqbTeyVr3DdESFLSDecjUgXFBR1Mo8HfnosLrmzzhpJCUv, 5Ec2mAe7Bt8ohdASVF5XmchtH2YZi7EdaDqXPGLFqeeAjUax, 5Et841uS1hRW3iLh1DftfuHKq1k1US68A7BxLQTrsG8b9w54, 5D82rfXBC16cmodMk6rEFMnLYj8BJtqCqHqmmkpBbaoPxdEY, 5GRDDCNccudv1iwZzG27ANeJG6HWXB9Dt3FXagSut5bZyKCa, 5EgqHcbFke4PLfWatnx731WfnEKXfmyP4B6pJiCkZfZ5VMH3, 5FbnS1YXkJ58jCxmeNpBdEY17yrWQWAhNeBNEMLWavd5uZVJ, 5FjCwqZuGujH92Cvd4W9SPYBjdxjifJ8bDVbFKePfMN7rvNR, 5Fbx4aJsH9zDyxrjyBmymXaeDhNaZkAPdrCptvZW3mAJUiKd, 5DFr6krBTTpn3RPMGiD8qmH4KSbYBTjepcRWym8ebGsbjyJF, 5EEhVc696iodmBpsqMergyfJQgBLfhEdnp7JSphQYhfnJ6Pa, 5FKszvkuqwezp4NZ1SnMerPN1CgwuAf2x3KmN1Ea9Lx1FCVU, 5DqDvAp4C66k6P6F4Rw6hvrkD7uyzk9fcR69yHCeNFjLhGcB, 5Gzp3LxvNmsddTvtX2ABSmCoS4M5YnYu5o9QMioxUTUA1zTd, 5GLHpafFpffrG3jeocpMK57redFkzFTqfv2Bv1PGWE4jpVF1, 5F4iFLZbc7uaUwkxyWjR5sAsVbpJbv1QanrUGYNTyMwHeteG, 5DWsda8JVkpphNtSSe1HBVveXcvKMHTzEezA8RrZqG6jxN9o, 5ENXEvhjjmGiw8G9PEL9N2K4pFMtJVGyAgic8buN7DCiZRC1, 5ES9XixD9Q6Mb2k1ZtMLVJPMGUgoPq824DsXZ6CEcbT9JUC5, 5Ev3boRssitrDn5hxyHE9UjVbr7mxGsWJtvNRvqi5ifTxMc2, 5HBscSAdW4gPMZu9bQr9ZaHbFdpaNM71WZs7Gmkg1Q6va8Bx, 5Hpzm1rxDgjhg5o58wdrcagKvchxiSUr6MKvQ98WBfmVRQHx, 5ENiEYBe1FUSeyoTgwFuasuCU4LKtyqWy58A8PUmHTxgGt9m, 5GEsjAZUrMKSdRxeu77xuszbcgggoR5BDEhVpidvgPAEVhFq, 5DbsbNXcr21fC8MszS1AV8JLaBKpXxsfvWvfK5mux4zKkdnt, 5CADxhweP2DLG1zvdVbUmf9ECPDW8nEETHz32E9E4wBLpxoJ, 5Caa8mbp3KpsihuGamqNTyW6Zm55z2LnRMrKMobEPbPCPT5d, 5CGP4qhqtwrP4awnxjHQmkujgW4johQ2Ac6MDWbpyHnP43Gf, 5HNCfb4Znv4D8aZa5DbaZcwCPhxWsL7Nje4JaGa8KjHut1Cv, 5ChaWs9RdjNWoSRQhQLX6tdJEjnGo2SEN61SoS8UE1FGcGZ7, 5Guj86zqCChEX7jhxQaHzjYLbjnkqCZnV6UsUJNhbFhupxUF, 5HH9xyNAWHe52ZVtwVwYUnijn7T3mU4PVfftJDcxnPgFNeV6, 5FLbNye9ohTeuGsBFEY4jLcVTGeeb99tpBFzgfzYo4R4FGCv, 5HfuLAbye7dJeaPrRrgzxV9xk7WRX1nyMAGz5nMdDdtxhK89, 5HQUPLoTytGZA9Um4VSsc81Myxq5eCKyKt1LvveyKezoNAGV, 5HWfUgArfWSgWxZSgnqRR9EhLtctnhW5bx69VVaiydALHHBK, 5E9cppxGVHFuJUVVkfLtpvB2iyNASW8o7QZwMh1E4dESKz8N, 5H63CR314W7BGy8XjYgR6FtV1quUYoAKtKM7warjYBpxmBLb, 5CmKyQBoKSaDnW8C5n1oEW7eG3Sq8Zd9BWDQRYsfpg3fmfrB, 5GBhVZpdwkrmEneZW85TWYTXkvZau8q9eeB5EdpUHwJntTgm, 5HpLku5nX1Qqr2jUHDXH7rMBB5UVD7gJubNzVijvg6JhJJ9Q, 5EZeTkSTVyiptdRSf9ttHXptmnr9bpshXMptibVVpU8y1pe3, 5GjC3mFgtC2EneyXWwrepB5Z2GWnc2fnWhQf887EaLe4b6v4, 5Fmsu1BFGpvGFFSMCt1isXgezjSJa2kDdJBHY45aygy3s6Sa, 5HdX7F12o2ANEc28vFzvSTBDVHz8ZomNcX819x4Fs5WJGVhy, 5G4GreyuVCLQfxGFUcdQSjAtcDYWCnWzkzNxn3UWW7fDALC4, 5DodvvgR7PdinFtfrq8hYjo5RMQxXGv1c5B8DifeRTfpA1Qo, 5DFZAuyRSBY2kqsT2w31Uyt6Tjjd5FbWJBxowECNH9v2eypD, 5FF99759ko3ZGEwVyheGfCvU3a1U428KYA2qKDgqyfRRyV7i, 5DvvkoutiYLAcKHzUH7tvtFZK2yBtx3wszNxUkTivLTjb8HU, 5Cai5JiDcAqrP3ht5JM5eQXAN4o6FfuNzucydvvvEktodqup, 5GqLVV3d7DB4ZntLdvx5HQsQy44EF1niCp14BwEiaXC9zCEp, 5DjvM9BQyE2gre7k3bZ2Ewt7ju7esgaqCwmsjYcGJffUhqrM, 5DJPthVaLDaMoGjjB8UX1oS3EWLfkkZrkswNjrBZxfmQumAS |

#### -Blogging Acala

| Blog link                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Mandala address                                  | Results |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| [https://bihu.com/article/1675373930](https://bihu.com/article/1675373930)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5CG4jmkk1neZzbKCeQg7kYv9PMko8zkcRqVvAFzPHuBD673q | Reward  |
| [https://bihu.com/article/1947278222](https://bihu.com/article/1947278222)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5EPMpXd7Gch8YQU9Q6efHKRdpgTfQ3kSLYKBRiiBB6nWPUHn | Reward  |
| [https://bihu.com/article/1184433159](https://bihu.com/article/1184433159)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5Fv1MSxvCAS8iQdmT7Rgikge54ExzXJdQp5gwqifnEN282x7 | Reward  |
| [https://medium.com/@gafaruzb70/acalanetwork-%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9-%D0%B3%D0%B5%D1%80%D0%BE%D0%B9-e64cee4b6e2](https://medium.com/@gafaruzb70/acalanetwork-%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9-%D0%B3%D0%B5%D1%80%D0%BE%D0%B9-e64cee4b6e2)                                                                                                                                                                                                                                                                                                                                                             | 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK | Reward  |
| [https://medium.com/polkadot-network-russia/acala-network-%D0%B2%D1%81%D1%82%D1%80%D0%B5%D1%87%D0%B0%D0%B9%D1%82%D0%B5-defi-%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8F-%D0%B2-%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B5-polkadot-45149bd7aa1c](https://medium.com/polkadot-network-russia/acala-network-%D0%B2%D1%81%D1%82%D1%80%D0%B5%D1%87%D0%B0%D0%B9%D1%82%D0%B5-defi-%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8F-%D0%B2-%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B5-polkadot-45149bd7aa1c) | 5GYqXeyj14TRet6uZiQCypVSvf6CPaV91xdAsysVc2nLd9H6 | Reward  |
| [https://medium.com/@J0elle/what-do-you-need-to-know-before-polkadot-goes-online-what-do-you-want-to-know-about-acala-6cb54977f9ab](https://medium.com/@J0elle/what-do-you-need-to-know-before-polkadot-goes-online-what-do-you-want-to-know-about-acala-6cb54977f9ab)                                                                                                                                                                                                                                                                                                                                     | 5CJeGxJG3E4DDJ4WsxBhRQaSe8zUqXDFCxtZCVeZ8VJ1kHhb | Reward  |
| [https://bihu.com/article/1623347850](https://bihu.com/article/1623347850)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5Exyar4kUgMtVgSNeeb1nzxQyyJuxmSFnjXHgAka1TneAmx6 | Reward  |
| [https://medium.com/@Lajuanaa/acala-an-important-ecological-member-of-polkadot-e2e15fe40635](https://medium.com/@Lajuanaa/acala-an-important-ecological-member-of-polkadot-e2e15fe40635)                                                                                                                                                                                                                                                                                                                                                                                                                   | 5EUyZJhTRvPse3FZ6KDVFauUtQu8zxJSoD7qMkhepFV4VP1A | Reward  |
| [https://medium.com/@knowledgeiskey2017/acala-in-a-few-word-8ca3c88e76f9](https://medium.com/@knowledgeiskey2017/acala-in-a-few-word-8ca3c88e76f9)                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 5Hg96xTCugbbFd55F9iBNofie4gpAgmJUVGd8nRL5vqCPCSp | Reward  |
| [https://bihu.com/article/1022529417](https://bihu.com/article/1022529417)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o | Reward  |

#### -Runtime Bugs

#### -UI Bugs

| Github issue                                                                                                             | Mandala address                                  | Judging results |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | --------------- |
| [https://github.com/AcalaNetwork/honzon-platform/issues/57](https://github.com/AcalaNetwork/honzon-platform/issues/57)   | 5CG4jmkk1neZzbKCeQg7kYv9PMko8zkcRqVvAFzPHuBD673q | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/59](https://github.com/AcalaNetwork/honzon-platform/issues/59)   | 5CJX5TSEokNNvgN23BKDLg5wPrC1hjmNb99hwndgEJK5x5jK | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/60](https://github.com/AcalaNetwork/honzon-platform/issues/60)   | 5CJX5TSEokNNvgN23BKDLg5wPrC1hjmNb99hwndgEJK5x5jK | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/61](https://github.com/AcalaNetwork/honzon-platform/issues/61)   | 5CJX5TSEokNNvgN23BKDLg5wPrC1hjmNb99hwndgEJK5x5jK | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/65](https://github.com/AcalaNetwork/honzon-platform/issues/65)   | 5GBM5hNhzHerACkb5aFvK1X4T4CMmBSAVxSGmtsLFp7iPtky | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/69](https://github.com/AcalaNetwork/honzon-platform/issues/69)   | 5ERFkyHHuuSvgKYLuPi5a6M21nmjNetF9ebwBD8j8ougSqJZ | bug-C           |
| [https://github.com/AcalaNetwork/Acala/issues/221](https://github.com/AcalaNetwork/Acala/issues/221)                     | 5GW32RaaDWB2UEFa6N8K5ukYcQPGsun2exDERhjdrbe92M6w | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/72](https://github.com/AcalaNetwork/acala-dapp/issues/72)             | 5FsiEWzjVYihbiRNw11Mmrii8Y7HpZ9wvPs82Z5Gzidvpqey | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/77](https://github.com/AcalaNetwork/acala-dapp/issues/77)             | 5DLXtwVzabzHAAjwbHC1eisdHWsKCEcpovfHiuUQZpSUWBi6 | bug=C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/79](https://github.com/AcalaNetwork/honzon-platform/issues/79)   | 5GWj7uVdbEhTad1SwTyqaD2W7h1jX3fMSaWweHR3M3KHj9Qs | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/80](https://github.com/AcalaNetwork/honzon-platform/issues/80)   | 5GZ3Yna3Wa3cfoFHt7eakpzZUj2QVxGEMmXbGyux8BnEVCRr | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/81](https://github.com/AcalaNetwork/honzon-platform/issues/81)   | 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/83](https://github.com/AcalaNetwork/honzon-platform/issues/83)   | 5FF7F1eDV59gH1yzamUuhzWkjwf96gZDWDK7tCUDehDuKfQk | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/86](https://github.com/AcalaNetwork/honzon-platform/issues/86)   | 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/93](https://github.com/AcalaNetwork/honzon-platform/issues/93)   | 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/98](https://github.com/AcalaNetwork/honzon-platform/issues/98)   | 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/102](https://github.com/AcalaNetwork/honzon-platform/issues/102) | 5HY8hYMttrbm57MmN3o9p5ipF8i7eBjdWw7TQVsecoP7Uos6 | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/112](https://github.com/AcalaNetwork/acala-dapp/issues/112)           | 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/119](https://github.com/AcalaNetwork/acala-dapp/issues/119)           | 5FGx48oGW6muZspe3X7EysKdseqWvGcwD1DSJTx1RLetpnKZ | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/123](https://github.com/AcalaNetwork/acala-dapp/issues/123)           | 5F3rYPmFB53XttPd8Zq9QqPxMFDUuVqDx4zjVjmqy6n4Ve4M | bug-C           |

### Season 2 Rules & Rewards

#### Node Runners (11th - 31st May)

**Prize**

* Total: **1575 ACA + 107,100 KAR**
* Each Prize: **25 ACA + 1,700 KAR**
* Prize draw at UTC 00:00, **3 prizes each day**

**Rules**

* Run a Mandala TC3 Node, follow [this guide](https://github.com/AcalaNetwork/Acala/wiki/4.-Maintainers) & check telemetry [here](https://telemetry.polkadot.io/#list/Acala%20Mandala%20TC3)
* Remember to run your node with `--name` parameter plus first 10 characters of your reward receiving address e.g. **--name "5DcvxiYpLn"**
* Make sure [**get some test tokens**](https://github.com/AcalaNetwork/Acala/wiki/1.-Get-Started#get-test-tokens) **for this address**, otherwise it cannot be verified nor be in a draw

#### App Users (11th - 31st May)

**Prize**

* Total: **6,000 ACA + 300,000 KAR**
* Each Prize: **20 ACA + 1,000 KAR**
* Prize draw: **100 lucky winners every week** for 3 weeks 🎉

**Rules** Try Acala App and do the following to be in the draw: 1. Use **Liquid DOT (LDOT)** to get DOT derivative 2. Then use LDOT for any effective transactions including: use **Self Service Loan** to borrow aUSD with LDOT, or trade on **Swap** exchange, or **Deposit & Earn**, or **participate in collateral auctions** etc. excluding transfers. 3. Get started [here](https://github.com/AcalaNetwork/Acala/wiki/1.-Get-Started)

#### Bloggers (till 15th June)

**Prize**

* Total: **2,000 ACA + 150,000 KAR**
* Each Prize: **200 ACA + 15,000 KAR**
* **Total 10 bloggers awards** will be announced a week after 15th June.

**Rules**

* Original blog post submitted to [Medium](https://medium.com) or [Bihu](https://bihu.com)
* Remember to **include your Acala Mandala Address in the article to receive prizes**
* Submit the article link to [https://riot.im/app/#/room/#acala:matrix.org](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_BLOG
* The blog must be original.
* We will judge both the quality (how appealing is the story, idea, perspective, insights, analysis etc) as well as social reactions (number of comments, likes, twitter or other social sharing etc).

#### Runtime Bug Hunters

[See Runtime Bug Bounty](https://wiki.acala.network/general/contribution-rewards#runtime-bug-bounty)

#### UI Bug Hunters

[See UI Bug Bounty](https://wiki.acala.network/general/contribution-rewards#ui-bug-bounty)

## Mandala Festival Season 1 (Finished)

\*\*This event has concluded, thank you for your participation. \*\*

### Prize Giving

#### -Running a Node

| Date  | Lottery block height | Lottery block hash                                                 | Prize winner                                                                                                                                         |
| ----- | -------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 03.07 | #79,513              | 0x17bcbe0cc97ffd7e019cbf034f3886d4b9bbdda408e33cc060ceeba239263b5b | 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5HYmh2R1iFuzmTFChezjTqGvioQKzCPWpqM85HYc3ZcCTTes, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ |
| 03.08 | #101,539             | 0x369876238225193d50a980dabe92be53428ed64a7fd772836ebffa096b927f31 | 5Gec99F4Q86UBF1BekB6gVL9SHofLNMPkF2h1fxyTEtVKGf7, 5FRcBR5j4LDToJsYUqWBK4TBtMbrMZZ922M3NEFw3zMH1LeJ, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3 |
| 03.09 | #123,764             | 0xc820c84884cfb6c6034906548ad2910b9f2b8feb27ffdaf1e2f3cf6ca547f1d6 | 5CAyvM4JtZQqjs1eFUG3LcDzs8fZiPtNHRtBc7kPYfxfVB6s, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH |
| 03.10 | #145,739             | 0x07982c6c551e57476d01a1894c92a816abe2c2b562ad3213262ca5217330b104 | 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5HKeXVnMsaBbXRti3HA9LgC9bYHmBxAZFTc3YDDBH8o3q9KJ |
| 03.11 | #166,282             | 0x6c317b90d4a3c6f68752294c73ca153c832a4d11b88227b1395d35dc4e407800 | 5CFfibmK6AhCLXfGtL5qCfvkJohb8nCqPiwAw68GMbmdUKVJ, 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5Dh8vK5Q6JK8YBYfbVEmgrUw49iGHXnVgx1jX48kQ9meKkKn |
| 03.12 | #185,549             | 0x518dbc7fb52fa435614455f246adefaf4f07f1bea4d3cec3bff5b435667f7737 | 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X, 5GLKuwUPAUkMft7NT194LWpmTBcKBEXwSxZyGsMbf5LDNNTp |
| 03.13 | #207,608             | 0x3aff20027835c25506fb434687ba333756741d9f8d612a3aa603e0fbe52663e0 | 5FbfExGfDFk3uVWsaidShjAMeY2r4P68PMbTz781mjFsvDRy, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5DUuWf643Fcoqk88wSyY1iBkWnQBKmxtVcDmC9K1MsskRULp |
| 03.14 | #230,779             | 0x40bcfea935aacaae97150e03520bdaf3d454a3bd758f9cc8d23b59ec95c6c7e2 | 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK, 5CZzpzpKgXVnJUuKZ3S4EASzYV77sb7rAp7UU5Jgp1QgaSBu, 5CDA3teXpfFAqQDTebUXiZn47udHReALJapzcteBPPSHPFJf |
| 03.15 | #250,280             | 0xe877919042c5e8cb6731d13eeaeb734e3624e462f9d92030b2f7ca7d356496a9 | 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK, 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk, 5HT4E3o4U8wrHs6m3DrzKvZvMtxy2ncDsq7zCSizPy8Lif8H |
| 03.16 | #267,800             | 0x85fdeb78e4b7e2e072fe7a2c9d4f42a87fc095cadeacd6e730fa656ebb5502a6 | 5ENZGGyRryWv2siiDtCJjoVfQ1kWyTAAdeJqdpd8UBwoQqwE, 5G3zwZ72e6rbJgx6cfmpKac3yBPsLM1hC173U6XNeMexqMhS, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8 |
| 03.17 | #289,398             | 0xb71ad6d29da5ebb99778e5cd98cc1581509b1fbea4eff8a46f25dffe8e79b6b1 | 5CFfibmK6AhCLXfGtL5qCfvkJohb8nCqPiwAw68GMbmdUKVJ, 5CZzpzpKgXVnJUuKZ3S4EASzYV77sb7rAp7UU5Jgp1QgaSBu, 5FjXFxPrEyLwXBVYC12CXufXgWQzddnpsArg8P8fJi7KwsFq |
| 03.18 | #311,497             | 0x2b9766ee142f754f046af4d6393d1c8131410d438d801e60cb81c53153a9ec8d | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X，5HYmh2R1iFuzmTFChezjTqGvioQKzCPWpqM85HYc3ZcCTTes, 5G94Wzuc5EBemwKGnBf18JwxUw8QtenRkrEiSbLCaMc8WFpR  |
| 03.19 | #332,494             | 0x08d346c0720e449b5fc48136c74071cb3e372ce9550845b6a54bda04638a4653 | 5DskzyXfQsxD2vJZDzCfXFnRhicHfAtrZ8qcM7BHsQFg7Wrg, 5G94Wzuc5EBemwKGnBf18JwxUw8QtenRkrEiSbLCaMc8WFpR, 5CFfibmK6AhCLXfGtL5qCfvkJohb8nCqPiwAw68GMbmdUKVJ |
| 03.20 | #353,185             | 0x7140ad6d2c5697f069f7f27dc3a2971f92c50e605237991c00f70d9e0a7af909 | 5GMvp5okVesv3JHxNA21SeFbXtMMtwy6EmPvtN5HpHLUuRCy, 5HT4E3o4U8wrHs6m3DrzKvZvMtxy2ncDsq7zCSizPy8Lif8H, 5DJAQKqgstka75mBA18QZwCQkMXCkqSUaNzhYu78Eygi8VA4 |
| 03.21 | #371,672             | 0x0a1d18b475ae527324ec6cfbe079694d4f2f2973be9207a9d57839d31d9931e8 | 5GBQRFTq5aei48Greedwys58bDYrHg54yh48m2scxemZvAeX, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X, 5HT4E3o4U8wrHs6m3DrzKvZvMtxy2ncDsq7zCSizPy8Lif8H |
| 03.22 | #393,575             | 0x736b354f2a2daac3495c834ff5ec6fe550c32b9d1b86903b6d5bd352b27f28f7 | 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5FQsJbDnzxqyxp85nzWy4HbTFRSKa1CarVN9Xm7QBsw3vVrx, 5HEU4JEfGS3mW2PSq4TmuJKWyKwyber4cFVEZrgPhxNs8Db3 |
| 03.23 | #414,350             | 0x3772a59486df65006e7e2f7fd0279ac22ec4f6e525d9875ff855802e5fd8762f | 5Dh8vK5Q6JK8YBYfbVEmgrUw49iGHXnVgx1jX48kQ9meKkKn, 5FRcBR5j4LDToJsYUqWBK4TBtMbrMZZ922M3NEFw3zMH1LeJ, 5CHrvcSjs21YwECGVoi8pEGn6v72CRBWP6PpUqUsJ366MqA3 |
| 03.24 | #435,268             | 0xc331867062eca546bd62229aff67bfd35b831fb6825e1616fe37f8a2d805a480 | 5DyEcs3fV2pmcTQVshC3Gr5WyA9f5xSMxirvzrgr7muoVG7M, 5CHrvcSjs21YwECGVoi8pEGn6v72CRBWP6PpUqUsJ366MqA3, 5GMvp5okVesv3JHxNA21SeFbXtMMtwy6EmPvtN5HpHLUuRCy |
| 03.25 | #456,668             | 0xad3257157d142fe1aa67aa3922ce06876fc095e1f47942c1f5fb92243080c392 | 5FbfExGfDFk3uVWsaidShjAMeY2r4P68PMbTz781mjFsvDRy, 5ESBGD6qa8xDE9z318wTg6vSCbTht1PAvzy29zB2eHyNH6Zu, 5G6pKktDYWMqEkGJhspUGeKLp8JugubEv9Jfbs6CMkJ5Ev47 |
| 03.26 | #478,671             | 0x6b514841e8bd765f38d751c88b61148bec684a49c56a54daa64a79379c861172 | 5DyEcs3fV2pmcTQVshC3Gr5WyA9f5xSMxirvzrgr7muoVG7M, 5HQFXgz67bre8PdfcNVJywWX3rNo7R1do9HfB3g6edDffR46, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X |
| 03.27 | #500,346             | 0xe9119a9f5c3606823b409802607c402996f4638b964cf49b48c7c30ffc56a43b | 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5DskzyXfQsxD2vJZDzCfXFnRhicHfAtrZ8qcM7BHsQFg7Wrg, 5ENZGGyRryWv2siiDtCJjoVfQ1kWyTAAdeJqdpd8UBwoQqwE |

#### -Using Acala

> **10 top accounts**

| Date                    | Winners                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| First week (2020.3.12)  | 5HKxAQ4z51No5R5r4UYVsbWRfnc6YVo568tVtfnNCNonB8vo, 5CAyvM4JtZQqjs1eFUG3LcDzs8fZiPtNHRtBc7kPYfxfVB6s, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5ChezpQKCGTtuwtDheos7jYibyGba7dWY6T8o4CZQEtmyp8Z, 5HEVq9jDSp6Y9N4rs2YFchNs8SDtvAtpDEBTuybiJF96kpXb, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5GZSvT7Fda3wfZ5qx2kdSP526h3ddfn6BnL4jVyqD8NPN1zL, 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e |
| Second week (2020.3.19) | 5FNmkE5pVgNYD8bhQQHYdTsDTcjQfLcjvJDwpKtLu3VXzfdA, 5CAyvM4JtZQqjs1eFUG3LcDzs8fZiPtNHRtBc7kPYfxfVB6s, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz, 5CqduWFn7pKiGTvrYPe4BQCp3G5Egv6cqo7RtoVshZLFFdMy, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK, 5GZSvT7Fda3wfZ5qx2kdSP526h3ddfn6BnL4jVyqD8NPN1zL, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3 |
| Third week(2020.3.26)   | 5FNmkE5pVgNYD8bhQQHYdTsDTcjQfLcjvJDwpKtLu3VXzfdA, 5CwSTvtMUvt6eFnrqKjpiZs8nzXvS5AmrSttpNyihfVAvuQC, 5GgivqrWGmUjkJSrZs5x3ifNgENsq2eM4ASta7LDtRnAkUqT, 5H6AEtxBvRgWPLqJKjy8MLnMdpXBHnuJLGFN1X1CZLTwidEL, 5Ckonmbx6tK1WGNPUqn1nke8JJKpFgKpQBUquRojM7gW51Me, 5GZSvT7Fda3wfZ5qx2kdSP526h3ddfn6BnL4jVyqD8NPN1zL, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5GWj7uVdbEhTad1SwTyqaD2W7h1jX3fMSaWweHR3M3KHj9Qs, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3 |

> **106 lucky accounts**

| Date                   | Winners                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| First week (2020.3.12) | 5C4rHmiSuvhtBbNgM5SExDavrLKKiy6cj69XAXiWkA3GXWqM, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e, 5ES9fyfV56kkEP1qazNzN1S6YwbSTfFWp2Q3i4QG4eyT2Ng8, 5F98oWfz2r5rcRVnP9VCndg33DAAsky3iuoBSpaPUbgN9AJn, 5G1fCYSGnBiFLxkmzo8wggcSDjfaYt5i4S6JbSQyAwyo7fHy, 5HKxAQ4z51No5R5r4UYVsbWRfnc6YVo568tVtfnNCNonB8vo, 5CojknH9daMVDQ6rZuUSsDjnzDcofvGWRtCsG6y35HJyiDvE, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5CaoouAVAb8WWGVriEwg4BSBW1hZoWn3iTAh1tKskhzQQ5og, 5D4yuBygLopkUereWT7ZdRLm1GBzEckhMyE3FE5kLwWdF5NQ, 5G3zwZ72e6rbJgx6cfmpKac3yBPsLM1hC173U6XNeMexqMhS, 5FNmkE5pVgNYD8bhQQHYdTsDTcjQfLcjvJDwpKtLu3VXzfdA, 5Ckonmbx6tK1WGNPUqn1nke8JJKpFgKpQBUquRojM7gW51Me, 5GR5ZkscxFJHRroPDPG6TxZ28xGJBnsrYXJCR9nbmiuWWEDR, 5GsgGaybXxXhyNdHyyGeVLAAwq9cxLaLZEiP3vBV24cwYuBB, 5CAyvM4JtZQqjs1eFUG3LcDzs8fZiPtNHRtBc7kPYfxfVB6s, 5CccLc64WB2hwWorqg92A4S5y9fwAiAdbAKLRY5obDskA26N, 5GZSvT7Fda3wfZ5qx2kdSP526h3ddfn6BnL4jVyqD8NPN1zL, 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5DvvRkDhCWmTK5B2b98hCYToWDW5DWZYH5sdvB9s5vAS3mMc, 5FYfrrNXkZMSRbJAzwDMLCyjjU1ZWQSADuGFkV1Y9LXZnvjQ, 5GWj7uVdbEhTad1SwTyqaD2W7h1jX3fMSaWweHR3M3KHj9Qs, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3, 5DhKbq3xPogHtt1qq1H999uuxhEcX649t2uF7TPswjFjhbGc, 5G8jj92pf4yG9cQmQ6mbRUqBePMptB37b7GGBg8FMoDKL9Gv, 5CAaGkmAcvVXAVbTUr1a3zKKcQEZLnTpEZfEPbKkFn5H8QX1, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5FLcXWfs1hpRqbT4Rv5ACHkenqCGL5MPTDDeFtBFrogY3D9V, 5GRbkRH3hi1vbuNd7s3eW9u2YRfhMtDJVVCe3a8M1jvhBuvZ, 5ERBaTXnATEbj81qYfSHW8Qn7SjJT5QN2yg6uUZZJyeUBicZ, 5F6tkYMG35Qyyy1on36w7T293FS95bpqqcCDFT8N9t6DhnQn, 5FTaCPEmwhMJ993ZLNM8GoHDw29SHxrpGogDB82sboCpMJRn, 5FYgjmgfoGakPr9kCzzaobXkWyQB77uc88J8WQGksAg8nfT4, 5GpNYPsdFAcCUXM6jjUEhqyjxy8Bp7afkAcvmtxm6mUAcNiJ, 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK, 5EkK4ckcii8Rh5wjfBxFZR8x6zXZsqw8FvztXUsxkoYf5A8v, 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk, 5HHEF4S8B3aYsUZmpEu4n6odRrxpEEDe89jnVr2H14FSbARn, 5HTHjJib4wzqsCGAvD8ekSUn1ZXu7tAk44Sv5wG5BEER8WoZ, 5Ct5SGeyXu9GNyXKV7P3tkE38v1qM4auWtsD8aH4bQiYSupN, 5Dw97QPYeWqmCJFgoLiveLkkaqMFJxfn8e9E9mxzXB6Dz3Ke, 5ECsqWJBPmAikA1nZHwHicRMVgH2G2UrJ3CuZ87Fix8E6bkW, 5EsPXJ12hTpu5NJoWYWzkoG6qpMdbaWULRFLgVjpWgZfJ4ML, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5GNBkRgVJhXNmC3WjwHYWR9rzabpU43yXbZdbpXLmNLe32aB, 5HQFXgz67bre8PdfcNVJywWX3rNo7R1do9HfB3g6edDffR46, 5CqduWFn7pKiGTvrYPe4BQCp3G5Egv6cqo7RtoVshZLFFdMy, 5CZzpzpKgXVnJUuKZ3S4EASzYV77sb7rAp7UU5Jgp1QgaSBu, 5DyEcs3fV2pmcTQVshC3Gr5WyA9f5xSMxirvzrgr7muoVG7M, 5FJC9QX1SKikjSKFxSRr1x5cFb7wNfUN4mVw3YYS4ZKwixai, 5HL6tBwmRunvJarRgHgjGkucwRkq8GNNQqw8fdkAxEDNHi8v, 5Chosiaz3EUi7BmpAKQot9RKmJcJi1Qr3EoDs7MU8QnMK1L5, 5DUuWf643Fcoqk88wSyY1iBkWnQBKmxtVcDmC9K1MsskRULp, 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5Gzcw4k6Wmjt3x5YgFDFigbzBfNjubtVNzStdNmJxmkwgmG5, 5H1baDyWT8faV6x8FBbwnzFEJjbBUNzeqzLXTYvU9oVbMv9r, 5HGQ6AchBx6sLkNAAQiNYfEwZxFVTZAjyKQb4qtKSvzR7MC2, 5CkJ4VzcH4mk85BtTfaHqf3RqGMM4a5DZqSzseVruEP5kF4e, 5CVPDeHivFgZQfrc9sF9UoVv21zxS4DQVVz7ucinPTdyZpys, 5Exyar4kUgMtVgSNeeb1nzxQyyJuxmSFnjXHgAka1TneAmx6, 5Gb2tKDMDz3RbQ7aMgmbfV7tEt9dBgdWEWz45YEZ1HvtZMJF, 5GeoVuZGdFjPuEQtEqvtUwpMnFnmJjVm5dBTTwnbvVf2mt8N, 5GuoZ4eAEHu5qjPk4ZgPZdVEVKA1yv8iC4L2bqmcH6E6WGC1, 5GVhfKo3vsRB9KT8JC29AehmeQVdGiwYtxD3tP8rsQ6DsPgp, 5GVs4qFFeqPW6TDMgQndS5naDJaPupH9BPh89yFasvaJR3w6, 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz, 5CMFEDVJdeBzfjbgp8XfSfeZRyHs2GpvwVKnuXvPQKTmQZSK, 5H1rL11WktkCyyzBExxiKuijBE81y6tzD3fF3LRni5R1Vt1E, 5FyPtyPjFWAxceKutcJTLDi5vymn8jJCb5pRkqBYrd9LEEqF, 5HCHNRXRMDqPQ5kkMfPHwB1389pN4sQmbQkkwQiG9bGZEvfS, 5HEU4JEfGS3mW2PSq4TmuJKWyKwyber4cFVEZrgPhxNs8Db3, 5HGnpfbi29nECZmCXBw2MPri1DN91NQYZwHnLtWTi2A6j9pm, 5HKeXVnMsaBbXRti3HA9LgC9bYHmBxAZFTc3YDDBH8o3q9KJ, 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o, 5D7YBLjdbY8b9LebqeyRo49zS9ZR1eT4Ef873cyFhqud1o6h, 5DLopAa1UYVM3cczoCNQ6sw5wgMcTBg9csstAQFw6BYS9U71, 5EHwNS9VqpdA53uZ2Ne1EWaxrkpBYg7huYLPzhNWNTBQumRg, 5EU9HJ4cZ9mNuiHWTuLfoF2r1wSVZHERk6N19HACgwqKVbwM, 5Fgsuwi8tmhNSDekq5bp9mY6qCfzaR55J1HZmMypjJDdemVs, 5GjdZKDznAfCKHHwX8mqnYwo2B7oZLNZyrUGCar4cXHvYzJ3, 5HYmh2R1iFuzmTFChezjTqGvioQKzCPWpqM85HYc3ZcCTTes, 5Cai5JiDcAqrP3ht5JM5eQXAN4o6FfuNzucydvvvEktodqup, 5DJAQKqgstka75mBA18QZwCQkMXCkqSUaNzhYu78Eygi8VA4, 5E4NSX14898SAU4aTygUntLXKcZqXLf2xYTzkkimpGRHVVNC, 5ENZGGyRryWv2siiDtCJjoVfQ1kWyTAAdeJqdpd8UBwoQqwE, 5F95LB448ykhME3UXu4uLrb85wJYebG3qwn9V1ma42TqTVdv, 5F9sexk65xWDtbHnL8hdt7YqEWHHRAH96LEvnxGH3u5WCXPV, 5FNrTnVFL9zXUuaECGmMEgBSY6CLSc55JkVT4hATr7UGTCSF, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ, 5FqNMQqhaKPKc37jeFkPEUT5UhyArrDsmmkiv2GNoopXXp7M, 5FWKFsL7JZ8rhVKvXFGfaDDrZTAWU8MHVQoveBRG6Etc9kjC, 5Ge7Y4xa8gFkj8pw8MxQM8sGR9mEqeUcKdHm8B2PWcEgtQPX, 5GvRPmPv31DVdorQqPTGYNK86wFFyPXJBzobmHN4FJgAjjmE, 5H1coQF3mpiAqEE4ro7CiYFPGcKpuxgoUkwikxrPaaRF1jEJ, 5DvzesBCUBwjKtNj1FqFg4UCHpNSxGwGyD7jv6YR13uqP3C9, 5Ei1MrxjHevWAC1csMj7fLbQSthkKTq6fdr99Wjdb9efU8vr, 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK, 5ERoUbf1vi3AyPHgdmpq3YY3f6cghZHHiTWRMpeqXCBBnHNh, 5FvDzLJVmPaDFsL8ryQgLsLCypj5ywqCufgCzzbt56PUQY8E, 5GjjWFCsotco2y2RDPiHb96qGanksRKBbQmYap3rUnj9ZLZD, 5GTwRTLGteEhVaJPZgNGf7mWPE8PWSyEmaSoKZ5LA8cvmxrt, 5HEVq9jDSp6Y9N4rs2YFchNs8SDtvAtpDEBTuybiJF96kpXb, 5EnHNDuYA3tiKoWh96dnFTxeyWTmnHGMvifYCXyBo36wXwTw, 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz, 5H9QiBnUenYmxSTGprjdHRJfgN1JnviZEtQTnuwpho3uHRUN |
| Second week(2020.3.19) | 5CaME74bajSwYpHzEHokqTbYTAYK4nBjRj1s3GLfHaK5hU9i, 5CApcfdm4JqQ28GK4XfEK4CrPrKgs5gp9JpZuDesvL8UagDb, 5CCdo3gfsnjg8WCTChrB4jQKXNncfbSN3H9NhNVqfD7EjNmz, 5CD2jb9ymzGxNyv8bZUzFv1MxG36rKgM5V1F5hooa6Q6CNur, 5CDTUWCWrRxayVmxHbHPhRDSh56fbvjzYrdu46q26u24Qf3w, 5CLtcEva82FZzmTL9kr2TbyLG3z1P9yVgpHeb5RJPp1a1jEo, 5CMW4BiVqfJ9Li5uxiG1HnzqigvcZfWbK8pekrUp6teHw7GA, 5Cni8QpH5uoxCrueohD1anzVy5tHsGzRzcgEh3KnpoAjyL5p, 5CQBYBqkNzrQhPk7Aphiao6PbfReTA8ZL1rhXPyN89N6oYq5, 5CSbbih3GNn3XYx1Y4YEouasWNbQUuniLBgKNFeUHtuKN5fi, 5Ctt7FJubQyy5tvfnZeH2nhxgCDgZ9kLH9FtHd3b45MooLvF, 5CtuxGvKZ3A7TXWLYk7GZrgkoJL8YxoJ6xefZDqXJXzdVRzS, 5CUQQGvpNe6fpqnNyQZACDcwYGMyjmmMcBFu5KoJ7PwvYNgj, 5CX3t4uc6UwbHA93LLjAqqyGb9Knk8w1G8jE4U38SLLGvoxz, 5D5Wtvop2EJhtPBnznQkNg7nXutghEPNmR1Z4C5a7NMomfhU, 5D7eU4gL7GYQy1GhiwfLBUkXWogVnuaqag86SBXgvwxZQSxn, 5D8ETR2iZNihfnt9UJwUcB6JdyXMdMqbVk4eA1wag2zfSeWx, 5DaD5WtNkNmiXpWeUgN2yozFV7DDS7Ldtpp8dyoRDDt4bw9w, 5DALdXmk5mzHHYoYHG7kp7ZGD8NZdYf7s6ATUzXsHpgXXWHk, 5DfVaYbSpA8gFheWLvte2wrV3HhUBdvPn6kTe3QX3D6zUeme, 5Dhahn4Wnziic2gExmc3qqiuy8Qvv3xTY7BaZZ78hU9a1gk1, 5DHtpAMFU5orY2SQQ5pr9KLC5ktzCuS4Tynx1WT3vQc4Pw5b, 5DqFgUVwGMGurJrJJTbtFA3U6HS6ezomTHnpbREKbnKjD9md, 5DSKU5oM1FcCjvRVKpF6rGPpvnZaMk6HmP9tZjSiJwakGhzn, 5DsnnPUSteS97tobbTsFoqr5q1tfqYa3Z5pJFpsVC1o2Qrx5, 5Dt2VSN2c2yEYXrMZWQ637k12SV1LQ8xcqGoC2KhbM5qjDB8, 5DvpnQx5AhaG5LMTcQGFbawfx4c1WPSBt3Yi3LaKVRsTVCBm, 5DvszTc6FJAmyhE6v5ZJhchtGH1ZQ2KR7iZi7g2776EX2ZQ7, 5DXBe7fb2v4kRsLpKzArkLXfdd4ZrjX6VqUrWDC1jVQnXVVy, 5Dz8mYhe2ji4n6xwSHTWPuFGmbxpMnnkwWMTP2nTAKZ5xUcd, 5DZsZrAaA1WMZUQ9e9C8WbodnEnbdKcBpsVXpVGztyQkjvVZ, 5E4PBrtxKguhK2UwwqKWUqJFsbci9t1q9rS7rHE1gu1aBFmU, 5Ec2mAe7Bt8ohdASVF5XmchtH2YZi7EdaDqXPGLFqeeAjUax, 5ECwTNTdTscgQUmKLpPK9TwJUc2rsqQ4M6qBfeRow5Mk2H6j, 5Eh5wzrkyxH3PmS9ahEftWLyCLwjirecohy8mvzwt2v5iHmE, 5EHPJHWewSnyni4Veqp6A4TDqUnN1K6fnzb1GRH1Y5uYHJrz, 5Ejmeh5oDc9KAh1yhr6hWQpPGHjV1EREBdXL11CdkVcw229x, 5EJR3vqBw8y2X4TNhqGHi7NzYM5H9DcyfdJM5XjrnH2CC6jt, 5Ek4bNRtJh3rQBD78bmoBvfk5C2Xmuy7nqM9K7X8WdSWmbim, 5EL71n847E1mtdrhrhEWc81J6eLXpG6tGbjAq2yg2FvFqHDS, 5ERd1oVWtXy1N9hW2SxHutdsMPDvUkCFvLtMaHYbPXzFrdSn, 5ERDK6jpUVqTqVVtN5sZHki5HGegZLqTLL72psDCJWr9btXm, 5ERpNXhqX56i6eCDYCygwCegs2VCw6d6KNPTqfqg37GJGq3n, 5EUudY9pLJ17acK69CoeP3x5DxF7b1euinNZZFfCDeB3vRKy, 5EX2MLZN8bBSKTWLoTsKeryLjvRKrKCgid4AXtFJsddXQX3g, 5EykxaQicsqV5uDb9mkQqDBPXVeXz3Q6qwz12TaRDwrQTmnZ, 5F1TGRBPEwSnRdwJpMe5DicVvFfArfuHg3bCqez9iymweDTP, 5FbbWe8EEbfy22TGbQjtUhQNpzwGPBDwqyRHodZdGpMDaXyk, 5Fgkcy5KGTCgvWPkoiaJURP4siSV5c3STfNc2JfGd1j2RaNh, 5FHfYwu5mfkJzzpVtNumv8WyTZs9vvpwCBEYzEqi6xgNPHey, 5FjXFxPrEyLwXBVYC12CXufXgWQzddnpsArg8P8fJi7KwsFq, 5FRg2xXPHAxQEa9gs9kgT8kEuKce8t3PECeEBVngvKiY1eVY, 5FukjmoYH9wZMme5zLBwfT4tMDsqXGEacbidqw4JsUZEG7fv, 5FvmpDcdJiVTJsFxZ9ruz7GRM9JFGEAxDWPp83y93rtegLoU, 5FxpytyEjhWsFkQBfkYo523fhadtQZiPcFwxW2B39xspctkT, 5FYvKmBGhd85r5MfuMMcQ2hTRjSgCgGD7vpTdvjtNgLjSBcu, 5G1VFd4fgc2xP9AJt9vL8KCtva2Wbrf6vVjFvsdueQM3rvrL, 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5G3gNV9ZAsfKB7ajMH6RhqmFda6xgAjUbjNzVanHzYLGQ87D, 5G6trpf7pZQce1PuumLkmkdsuCAVqUSBQTceHoDCGjyjbcrH, 5G6upgJNi99Co55Dsv57gnimrourzdf5RoS2e1rKc2n8TJ4k, 5G9i9UgfogCH6VGSX3eb1LG44XYdgcpj5PRbCFP7qMN3A8MF, 5GbANjH5q3kPrXSbJ5fNcXuMDr1tDJW3pJo2c8cHEhEvXZbk, 5GbS9EpYangQpDaNz9VghK3VJe1Vxsup1yMrve3VNV8Bs2gd, 5GbstTqbFPegS3JjunbXjuTnS2qhwJPMsUasZA4x7TEqDYu8, 5GCFMEMkb9SYqkPQbnJwDboc1dBM6ZBRPazSzGDHNNH1trUY, 5Ge9U2ZMnoVfx57FUBoKA9WPjsxD7JF2C9PLbFV9wKn88E4M, 5GERE35iVpdBs5KE4GUy9TiNwcjheZkgBDkaEnQn3j7W9oTv, 5GeSLp5DnRpVBH142dnzVZ7KJPa8UoBxk5wpVks5irT6fikE, 5GGhnPcLBRfR9FgwfzzCaEDbbyoLoswj9KAX1zxyC1ej2S9k, 5GjZWQ1CA7EbYzgBmKQqeCMhFMKctuLxKQ6R7uPgHboCLJ4u, 5GmUtqsaGNBu2gP8nAqQsJA7uGemWxS17RgDVTf8TNTkGSNq, 5GNz45kRQHebeUvh4xEk2bPDHWnHkxmmdJfPz42FuUQD9o9b, 5GpEVSLKNUG2HBSDB58LQPRLZMLPruK8uwyMVXd9Bvf7fuEy, 5GuXzQXqq4AboeTqwA8PwaVXJNNo5WVQXL9xLRkchKx5EA5U, 5GVnBAzqGhRCkKbr4jKsSHC9z5V9iqfG3PZMXiiXPEgtom6p, 5GWsLUrtX3pxiA2ppt3BHww9QpYsSucdug2KgrSQ3F5FdhPe, 5GYzQxeDFLN7ZW9piukRYydK8P5N1oJuzrCfPCF9BBaX8NJ1, 5H15dtXREueUfud6bdFkrR8ru41bxEjuekLfkXCiaKAp57o4, 5H3mwRQWsZv4TdJiqgU237LADWiFGwetf1RC8oJcZHdQx5re, 5H3rq3eR3gwtAZhhctacokHZWEdPMi7jcPoJGPGjKHgCYJNW, 5Hdk2KXSp2W5szxU4fKJTnPCrjcGK7FToGZ292vkXzABUuyw, 5HeAqbF9FtMW4xitwF4BjySPFtqoFX7EECr2QcftGsPMFoWE, 5HETz3bu4SxnyeM4f3XhHSYvbwAveNdepdiKAePzZNXSDKbq, 5Hgx2vu9bWECxfsPwdepAzRT1qtdcruxyDX3XnGNSypckWZW, 5Hh1jyjseRp89PkxiLzL287egevzuDCKbSfsQQTHgnTezo8h, 5HH8NRNe9md45Gjzop6N1CCdRVXvfXBxYWoKtHHYtLmojH3B, 5HjhTLGk5V6HXuwjpdbHMWUXc5LH3rMtLKpcqSn8Z5x8xLUS, 5Hpngv1Pp8JBHfDN8BZdSawKNTBrSN5vKktr6VJvzjkzwaLr, 5HQa6qViQEjnTKfBkfLzvR7R2aKQga1gnAe2CPjLr83hHCxL, 5HR2Uzwi72AgrwUougEJNkSt1yH8Hd6dokC6iQ7RsZPbuSW4, 5HTPMLGoZKZVz8kJQcTaQPQpXKAmc7KpWttMWUCmyYYavv1W, 5HTZDXFep67Z6KJv4y7Jhh7is2D6F7KF5Yx2qa6yAADodoCZ, 5HW3oF1Tuyxt9ZSFfeq6ZXTfxei5oGBzRGKzK13wNtJQkw2X, 5HYfqv8CYXrvAYWTnMdRUymPU9oHjemiC3C4qFYpBS4B2VFr, 5HZAj8h7KAwsc4AWubveD2k1bUQ6irg4DRxqW3UJWCkjFpLw, 5C4rHmiSuvhtBbNgM5SExDavrLKKiy6cj69XAXiWkA3GXWqM, 5Cai5JiDcAqrP3ht5JM5eQXAN4o6FfuNzucydvvvEktodqup, 5CojknH9daMVDQ6rZuUSsDjnzDcofvGWRtCsG6y35HJyiDvE, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3, 5ENZGGyRryWv2siiDtCJjoVfQ1kWyTAAdeJqdpd8UBwoQqwE, 5EqaTXJdJL5yxA2aGmDJqZ5wdAVgMQV5HQvjhQs1EDas91w3, 5EqgctbbbAQd3j15fHSU6j2X5UZ2bap25sbW1vAUUxiquT6x, 5FNrTnVFL9zXUuaECGmMEgBSY6CLSc55JkVT4hATr7UGTCSF, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ, 5FqNMQqhaKPKc37jeFkPEUT5UhyArrDsmmkiv2GNoopXXp7M |
| Third week(2020.3.26)  | 5FTaCPEmwhMJ993ZLNM8GoHDw29SHxrpGogDB82sboCpMJRn, 5CqLTf8v2VpSnsCNjaRK78j6CRarcpQ8ZFD37XfSoCZZv1gY, 5GVrq2GR3xrGViFwV62rLDN6h8JnbaD2yp6rpYwYPNqVTb5Y, 5D77Fa9D5C2UgpQUGMioU468rTkoiCkRgQzfmAVxAN1RybB8, 5Ft5vRXS3K5JM8qNKM7AHDNRL7Ba8WvFtncDoSXuZx8WmbRf, 5FsQW2be7EaX4heyMML2GTJ8YRubCCmPDJGnUcyWi6x5oHFD, 5EUX3WAcTY6MVwcwHhPHodws9AHvKzi8JSe6n8RRmu3kktaY, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e, 5Cw43rv2Lk55UXqCpd4aDqo3iBPQ9PysBJYcGfsyQReyXSNP, 5F1TGRBPEwSnRdwJpMe5DicVvFfArfuHg3bCqez9iymweDTP, 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz, 5GNMwnyfd61242esJJGgbG5HbPXSkyQDZtiwdYoWnkoGr4zM, 5DqFgUVwGMGurJrJJTbtFA3U6HS6ezomTHnpbREKbnKjD9md, 5GYVq3dUaELqNN2idbmexv4PGWVhe7Pnp55m59WRGPpC7umX, 5HiYHwLSQme1Tmy3VAJYtkCiCSzPhrhfdnKDzvqZtpP6Npna, 5E1rH4B1Nji2xUeepgLCsEDuAdK7LZcWzwHvyM1iCjkkGk6K, 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk, 5E4PBrtxKguhK2UwwqKWUqJFsbci9t1q9rS7rHE1gu1aBFmU, 5H1ea9WWJeTDLnMjcZ5eQFD6Twybnt8Ug3aVVjWGac4jwf78, 5H1ivDgZNqVAXKBsJz1mcfKPkZ6uqRFY7fAn6y2E1X7Yoxcx, 5FncmEPgwKZsb1Py2H9cV7uJqcv2SnYoatxkjNNTDjmH2fPt, 5DALdXmk5mzHHYoYHG7kp7ZGD8NZdYf7s6ATUzXsHpgXXWHk, 5H63r5WSEiCeKCif3r5dNvs6FfqWTNbTfQPhCiTUcGvgvrdN, 5EAXdqJxWoMDyguXvRdq9HSbekLjm4zATUriPMsiMRg7yyML, 5Dhahn4Wnziic2gExmc3qqiuy8Qvv3xTY7BaZZ78hU9a1gk1, 5HYYvAgKvhrLtZ1qvvoqEbZofPr6M2rngjNShHrz3YSHA1LN, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X, 5HN3psqJsjtdpuH37ur6KVt4kywXCs5ox1bFnpMdEzBLF4Tf, 5Fgkcy5KGTCgvWPkoiaJURP4siSV5c3STfNc2JfGd1j2RaNh, 5GF6DQDRA6Gvva5L919Dk25vDRZe3q1gtGfMZ3A5vfEeERL6, 5Fni3JNZaBT9BEkHGVACPzvSuKJzL9JwiXTTNC4urK7FiFdp, 5GivH9nb6WsNPpKFXeqmr8RfMJeFFfy2GohkiwS79Di6wWR1, 5HjYCMgSjJB6Z7zuwV363QgVfn5vELCBDqPinXRbSmS7g3js, 5EvAprh9QEVm8RpcvLzPnyN4KkWvcyYovNphWJKtuL8k2hk4, 5GzotcPuXTpM7DKoErHDcEDxVDZamGvUDDyCPzpibaAgMKUa, 5Ec2mAe7Bt8ohdASVF5XmchtH2YZi7EdaDqXPGLFqeeAjUax, 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o, 5Gb2tKDMDz3RbQ7aMgmbfV7tEt9dBgdWEWz45YEZ1HvtZMJF, 5E9mW8wEG4nv2Q3kjMaKhhvi3N2d74GyD7pSzVUpsM5iPtTF, 5FLgkZCDXh76uoeCkmb3BG3Kg89Vg93y6mHf9qLta5zrSueM, 5Co5gdHrGVPSWtqJNH4sCZT2CpfSLKT6CHv4FrBWTVKGR8BT, 5E2R218ryzuina6vtSFn9vWsV8Wzt4tgFv76x4Cm1KaDGLMC, 5Cai5JiDcAqrP3ht5JM5eQXAN4o6FfuNzucydvvvEktodqup, 5HTHjJib4wzqsCGAvD8ekSUn1ZXu7tAk44Sv5wG5BEER8WoZ, 5DHtpAMFU5orY2SQQ5pr9KLC5ktzCuS4Tynx1WT3vQc4Pw5b, 5DhKbq3xPogHtt1qq1H999uuxhEcX649t2uF7TPswjFjhbGc, 5CwnyUJXNNgLG3EH1ckh8ztbs9Er5BWDhp6SpmSeEU8AjnS4, 5Ctt7FJubQyy5tvfnZeH2nhxgCDgZ9kLH9FtHd3b45MooLvF, 5DyEcs3fV2pmcTQVshC3Gr5WyA9f5xSMxirvzrgr7muoVG7M, 5CkkeUawQnUahc7r4MGEJZzG2Hk6Ks4FdUS5mbuupxhYjPQ7, 5Ei1MrxjHevWAC1csMj7fLbQSthkKTq6fdr99Wjdb9efU8vr, 5GVs4qFFeqPW6TDMgQndS5naDJaPupH9BPh89yFasvaJR3w6, 5ERFkyHHuuSvgKYLuPi5a6M21nmjNetF9ebwBD8j8ougSqJZ, 5FRg2xXPHAxQEa9gs9kgT8kEuKce8t3PECeEBVngvKiY1eVY, 5G9nNLmSu3V6wN9ak1wAcggjkBTYCiekktXPes277r1N7QgT, 5FNe2jbVpKSrYxQWeDGDCqADdBzCti4eLQvZQGbGg77t738w, 5FNmkE5pVgNYD8bhQQHYdTsDTcjQfLcjvJDwpKtLu3VXzfdA, 5G8s36VJDBosJyU2DSXo6EfPLdRAoseWKvCdheMkE1GTWQxw, 5HdVeZgqGHpobSTiGoSjEoFPgymQ8ntqKDAzPX34L1iqZhhJ, 5H6HU8HGXCjQuQ89rQsYWJ9F5514GL79JEPm73YqEKoSkuJs, 5E7Q7bmzGTM9nucizj4aU7BvNMAEYmLrqyDLP778Af4MTcTC, 5CQBYBqkNzrQhPk7Aphiao6PbfReTA8ZL1rhXPyN89N6oYq5, 5GWiHwc8op5bfpgKUC9PvHEq6SAGcpKS56UbKpzDQiWcFNiK, 5HBTBEGrBXiYyKTKoUoZNdMh9rWFGkbaKH3gYzB4GiCicrPx, 5CFWEetvgMwrD3DKAWTx2GvzGQAp92HXrmUQ5ZWdFJugMEfY, 5DfhQHjxm76hqBdspSUFQkpLi6kW9rC68S79TybwEsRHTXnv, 5HjhTLGk5V6HXuwjpdbHMWUXc5LH3rMtLKpcqSn8Z5x8xLUS, 5DwGBQghKE1G866jSEoQNmsEd6vmhDsZV8c294teVfiSAwiC, 5HC98cwkHcoUCUMNa1FkFhdRfVCJcmbme2g9A7k2d8AqDaf2, 5CD2P3xb3rRZrgBU9gg3EnAs8vHeePh7dLNvTmNTYFWHY15f, 5E9j9vym4fkYNPoiCZYoaDFPsFfh5xT8ZYVtUdG4dSjcGKHv, 5EWtmwLeMbsSHhYrPdZTYvhrmCEdgKwg2xtQYWqPHwjpuiEN, 5EcMpfF25Qavx7rXM8iUFYP4MiPyovY7DvMMag6stLfdRzQj, 5GBM5hNhzHerACkb5aFvK1X4T4CMmBSAVxSGmtsLFp7iPtky, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ, 5HgU1yCa7JbxzKMbRFpQSyEAqaB7fkyfBSUSsqBGRmDEE4cJ, 5F4TsvLEf1sny5Sdme59CHTWW6woKENiBQ4ifg23rjppe5Wg, 5G1J3dEnZ8UFzm7A98TPh3HxeETSgUANiCoN6DuiznfofHoc, 5FgqWEW3pmXrBmv5fxKxWnGXbbXgWvKbUowWPiXGxb1xZFv6, 5EU9HJ4cZ9mNuiHWTuLfoF2r1wSVZHERk6N19HACgwqKVbwM, 5ERoUbf1vi3AyPHgdmpq3YY3f6cghZHHiTWRMpeqXCBBnHNh, 5E7a8BMH7qM5YEj5F9srTP2EsjPqpehFpreecNSC8go5MMwG, 5FQu4kbg2xmrGJRTav8fjLjgFHqexDRaC2B6sajdaWeKNm2A, 5FWnCJZmjmKePwa4GgZTKXixroPdcSqJxcetNe5rQgBCq8S1, 5FbntrjzEG52j24fu2LWh9E5npkmAUzkTtqZRyAgGQRZ2SkF, 5EnufWonqNdwG8PKcyR5zr4ZU4ikHmLssJgurS4WeiuTfxuW, 5D8ETR2iZNihfnt9UJwUcB6JdyXMdMqbVk4eA1wag2zfSeWx, 5HYfqv8CYXrvAYWTnMdRUymPU9oHjemiC3C4qFYpBS4B2VFr, 5GWSkXePdirfvjPTDfci5WjQJ8D3UtvZ76ezaDbWAUu2FdsZ, 5EJ2oFrVRPYeqNRjeWby4j9YE9xAYgi9d85Wsbzbz65ZA5P8, 5DPp1sn9ej8Dk4TEtjgxpL77J8aVSYvutDx2FUkMcsaNkKsV, 5G9i9UgfogCH6VGSX3eb1LG44XYdgcpj5PRbCFP7qMN3A8MF, 5CaME74bajSwYpHzEHokqTbYTAYK4nBjRj1s3GLfHaK5hU9i, 5FLRD9adTbffu9fhXhWDJ1gebvRX6agwAvjwjHASH2Vbibh1, 5DZbHfGpV35KGKX8Tbk31SFTm21fK45XsjW6SUadXGM52Fad, 5E6yNVh4xvz6MM9F5HCADgsXHJaGy562aSCZsiDkJSXmgcts, 5HQUyy93BQn5cQPK4ZFCjLNSZhSGesHiuHayvXxD7jThoQcT, 5EHPJHWewSnyni4Veqp6A4TDqUnN1K6fnzb1GRH1Y5uYHJrz, 5DvvkoutiYLAcKHzUH7tvtFZK2yBtx3wszNxUkTivLTjb8HU, 5FZWwEnfMuUgxCxvWkfxuUh7nnEct1tEuDpDmfbCQ3duWpaE, 5Da7gXBqzNax61FPu4F53GTCnVippegmRK96d5vs79XUoqNZ, 5Dk8XfuSZvsu6tYTcEX3yBQgK4xfAyoQQzErQAXkpHuScL4F, 5F9uATGtQairBzbLRW4jjNucCrAVCD74iDHan5Z4wMLjPkoR, 5DcvxiYpLnAUxNopcTYZFKKi7igp9CuRExAV5QUErroBGA3E, 5DxsXxCQtcR9AMyV5ENccP5pkTii2hGnwo9uMJSL1HrUZqLz, 5FCe5niGxQmKZWfzLWeujk65tAM8q9mkHfgbHdVWNxZ5Nhfu |

#### -Blogging Acala

| Medium link                                                                                                                                                                                                                                                                                                  | Mandala address                                  | Results                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------ |
| [https://medium.com/@x.zhang/acala-network-liquidize-your-staked-assets-for-defi-839c63ba8f32](https://medium.com/@x.zhang/acala-network-liquidize-your-staked-assets-for-defi-839c63ba8f32)                                                                                                                 | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward, claps: 456                         |
| [https://medium.com/@v.cryptor/acala-network-a-multi-collateral-and-cross-chain-capable-stable-coin-architecture-e0f0f8cbf156](https://medium.com/@v.cryptor/acala-network-a-multi-collateral-and-cross-chain-capable-stable-coin-architecture-e0f0f8cbf156)                                                 | 5Fj8pQ1e7iDfrAvae9k6WhrZRqM4Lqd6Umvk8J9cg1BXcJL9 | reward, claps: 427                         |
| [https://medium.com/@x.zhang/24-cities-world-wide-join-the-acala-mandala-candy-festival-today-3445432340c0](https://medium.com/@x.zhang/24-cities-world-wide-join-the-acala-mandala-candy-festival-today-3445432340c0)                                                                                       | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward, claps: 450                         |
| [https://medium.com/@dujason1215/acala-airdrop-tutorial-a9dd2a9a39f](https://medium.com/@dujason1215/acala-airdrop-tutorial-a9dd2a9a39f)                                                                                                                                                                     | 5DvszTc6FJAmyhE6v5ZJhchtGH1ZQ2KR7iZi7g2776EX2ZQ7 | reward, claps: 378                         |
| [https://medium.com/@gafaruzb70/acala-network-fbc2e335c50](https://medium.com/@gafaruzb70/acala-network-fbc2e335c50)                                                                                                                                                                                         | 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK | encourage:333 ACA + 16,666 KAR, claps: 256 |
| [https://medium.com/@qash0430/cross-chain-stablecoin-platform-based-on-substrate-acala-5697bc34d24](https://medium.com/@qash0430/cross-chain-stablecoin-platform-based-on-substrate-acala-5697bc34d24)                                                                                                       | 5DSKU5oM1FcCjvRVKpF6rGPpvnZaMk6HmP9tZjSiJwakGhzn | reward, claps: 369                         |
| [https://medium.com/@jgm5676/acala-the-forerunner-of-defi-55d35b308867](https://medium.com/@jgm5676/acala-the-forerunner-of-defi-55d35b308867)                                                                                                                                                               | 5EJR3vqBw8y2X4TNhqGHi7NzYM5H9DcyfdJM5XjrnH2CC6jt | reward, claps: 376                         |
| [https://medium.com/@x.zhang/need-for-new-defi-infrastructure-why-acala-2f7cb4e6d27b](https://medium.com/@x.zhang/need-for-new-defi-infrastructure-why-acala-2f7cb4e6d27b)                                                                                                                                   | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward, claps: 419                         |
| [https://medium.com/@liquid19922/acala-consortium-the-first-global-decentralized-financial-ecological-alliance-8e414ded220e](https://medium.com/@liquid19922/acala-consortium-the-first-global-decentralized-financial-ecological-alliance-8e414ded220e)                                                     | 5D7eU4gL7GYQy1GhiwfLBUkXWogVnuaqag86SBXgvwxZQSxn | reward, claps: 373                         |
| [https://medium.com/@Jackie007/how-will-acala-reshape-the-defi-ecosystem-in-the-future-59da733746ef](https://medium.com/@Jackie007/how-will-acala-reshape-the-defi-ecosystem-in-the-future-59da733746ef)                                                                                                     | 5EU2iHgcRyDxrWPg63eYHu4qQUVztEsu5Gj4mQYNsVuADkhJ | reward, claps: 385                         |
| [https://medium.com/@kira1996/the-last-three-days-of-polkadots-ecological-high-quality-airdrop-event-come-and-win-acala-1b49656bbaf7](https://medium.com/@kira1996/the-last-three-days-of-polkadots-ecological-high-quality-airdrop-event-come-and-win-acala-1b49656bbaf7)                                   | 5GgQbgzvpPJvpVQMi96Dj8ZP7EnEZZDoJJma9XTcuge8yxs8 | encourage:333 ACA + 16,666 KAR, claps: 366 |
| [https://medium.com/@lapinandr6/acala-%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5-%D1%81%D0%BB%D0%BE%D0%B2%D0%BE-%D0%B2-%D0%BC%D0%B8%D1%80%D0%B5-defi-5e72720ea4f9](https://medium.com/@lapinandr6/acala-%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5-%D1%81%D0%BB%D0%BE%D0%B2%D0%BE-%D0%B2-%D0%BC%D0%B8%D1%80%D0%B5-defi-5e72720ea4f9) | 5HEn1YtswEWpqpC9E2E21nCtUqgdJLQ1UfErVombGfHnKaGq | encourage:333 ACA + 16,666 KAR, claps: 222 |
| [https://link.medium.com/6OOcykqN84](https://link.medium.com/6OOcykqN84)                                                                                                                                                                                                                                     | 5ELbRUyqUbiDei3F7kAwofGGaQx1NQEaQnVN1qL11uyZUCfh | encourage:333 ACA + 16,666 KAR, claps: 287 |
| [https://medium.com/@Jackson1992/defi-communitys-new-solution-to-the-crisis-acala-951c6db55a0b](https://medium.com/@Jackson1992/defi-communitys-new-solution-to-the-crisis-acala-951c6db55a0b)                                                                                                               | 5HKSjHopywfVCnVi4id3mD8rmPBmkx4YSnY6mrHURzRtB3jw | reward, claps: 371                         |
| [https://medium.com/@willianm/acala-received-investment-from-several-well-known-institutions-around-the-world-b96c47d8f52e](https://medium.com/@willianm/acala-received-investment-from-several-well-known-institutions-around-the-world-b96c47d8f52e)                                                       | 5FKwpUEGHMVG3N58vCgkNF99JhHFGrji71CU8nHf1XRoa72L | encourage:333 ACA + 16,666 KAR, claps: 351 |

| bihu.com link                                                              | Mandala address                                  | Results |
| -------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| [https://bihu.com/article/1320663805](https://bihu.com/article/1320663805) | 5Exyar4kUgMtVgSNeeb1nzxQyyJuxmSFnjXHgAka1TneAmx6 | reward  |
| [https://bihu.com/article/1142130267](https://bihu.com/article/1142130267) | 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz | reward  |
| [https://bihu.com/article/1641183755](https://bihu.com/article/1641183755) | 5Gzcw4k6Wmjt3x5YgFDFigbzBfNjubtVNzStdNmJxmkwgmG5 | reward  |
| [https://bihu.com/article/1237192450](https://bihu.com/article/1237192450) | 5FyPtyPjFWAxceKutcJTLDi5vymn8jJCb5pRkqBYrd9LEEqF | reward  |
| [https://bihu.com/article/1074339537](https://bihu.com/article/1074339537) | 5CqLTf8v2VpSnsCNjaRK78j6CRarcpQ8ZFD37XfSoCZZv1gY | reward  |
| [https://bihu.com/article/1763139738](https://bihu.com/article/1763139738) | 5FRgjqWr4c7gXpoCvFRg7Ms9yz4BY2AevT2X1VfTCNTWLEEw | reward  |
| [https://bihu.com/article/1154798571](https://bihu.com/article/1154798571) | 5GRbkRH3hi1vbuNd7s3eW9u2YRfhMtDJVVCe3a8M1jvhBuvZ | reward  |
| [https://bihu.com/article/1444069078](https://bihu.com/article/1444069078) | 5CLqztk7F4XcHGqPKRTB6TTPPnS4HpCowoTPfgY6x6bBZtNT | reward  |
| [https://bihu.com/article/1898324332](https://bihu.com/article/1898324332) | 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK | reward  |
| [https://bihu.com/article/1613514055](https://bihu.com/article/1613514055) | 5HEfj4Tbk8xNtSPoF1Qg1DocZmTZ3BZedF8ucJhm6GavgrmW | reward  |

#### -Coding

#### -Runtime Bugs

| Github issue                                                                                         | Mandala address                                  | Judging results |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------- |
| [https://github.com/AcalaNetwork/Acala/issues/152](https://github.com/AcalaNetwork/Acala/issues/152) | 5FLcXWfs1hpRqbT4Rv5ACHkenqCGL5MPTDDeFtBFrogY3D9V | reward          |

#### -UI Bugs

| Github issue                                                                                                           | Mandala address                                  | Judging results |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------- |
| [https://github.com/AcalaNetwork/honzon-platform/issues/18](https://github.com/AcalaNetwork/honzon-platform/issues/18) | 5FLcXWfs1hpRqbT4Rv5ACHkenqCGL5MPTDDeFtBFrogY3D9V | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/19](https://github.com/AcalaNetwork/honzon-platform/issues/19) | 5FLcXWfs1hpRqbT4Rv5ACHkenqCGL5MPTDDeFtBFrogY3D9V | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/23](https://github.com/AcalaNetwork/honzon-platform/issues/23) | 5GR5ZkscxFJHRroPDPG6TxZ28xGJBnsrYXJCR9nbmiuWWEDR | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/31](https://github.com/AcalaNetwork/honzon-platform/issues/31) | 5G8jj92pf4yG9cQmQ6mbRUqBePMptB37b7GGBg8FMoDKL9Gv | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/33](https://github.com/AcalaNetwork/honzon-platform/issues/33) | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/35](https://github.com/AcalaNetwork/honzon-platform/issues/35) | 5G8jj92pf4yG9cQmQ6mbRUqBePMptB37b7GGBg8FMoDKL9Gv | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/37](https://github.com/AcalaNetwork/honzon-platform/issues/37) | 5F52pY196ZVifs3xGvBK5RTFuWMLsxNPrTfTTfk7NHC4YrS7 | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/39](https://github.com/AcalaNetwork/honzon-platform/issues/39) | 5F52pY196ZVifs3xGvBK5RTFuWMLsxNPrTfTTfk7NHC4YrS7 | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/44](https://github.com/AcalaNetwork/honzon-platform/issues/44) | 5HiYHwLSQme1Tmy3VAJYtkCiCSzPhrhfdnKDzvqZtpP6Npna | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/49](https://github.com/AcalaNetwork/honzon-platform/issues/49) | 5GBM5hNhzHerACkb5aFvK1X4T4CMmBSAVxSGmtsLFp7iPtky | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/53](https://github.com/AcalaNetwork/honzon-platform/issues/53) | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward          |

### Mandala Festival Season 1 Rules & Rewards

To celebrate & reward supporters, we're hosting the Mandala Festival Prize Drops Party popper Giving out approx. 100,000 ACA & 5,000,000 KAR (Karura Canary Network token). See details [here](https://medium.com/acalanetwork/mandala-festival-prize-drops-3ae68df0dfa6).

#### Time-limited Candy Drops

**Run a Node**

**3 prizes (55 ACA & 2,777 KAR) EACH DAY** till 27th Mar Collision symbol

* Follow this guide [https://github.com/AcalaNetwork/Acala/wiki/4.-Maintainers](https://github.com/AcalaNetwork/Acala/wiki/4.-Maintainers)
* Remember to put **first 10 char of your prize claim address using `--name`**
* Also remember to get some test tokens so we can verify it

**Use Acala DApp**

**116 prizes (66 ACA & 3,333 KAR) every week**

* 10 top accounts with maximum gain or loss will be awarded
*   106 lucky accounts will be drawn from all qualified

    Use [https://apps.acala.network](https://apps.acala.network) or [https://polkadot.js.org/apps](https://polkadot.js.org/apps)

**Blog Acala**

**20 prizes (666 ACA & 33,333 KAR)** till 31 Mar

* Submit a blog to Medium or Bihu
* Remember to **include your Acala Mandala Address in the article to receive prizes**
* Submit the article link to [https://riot.im/app/#/room/#acala:matrix.org](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_BLOG

## Ongoing Rewards

### Coding

**ELIGIBILITY** Anything built with or on top of Acala that inspires you and excites you. This could be bots, DApps, services, tooling… Please provide the following: 1. Clearly articulate the problem and solution 2. Complete at least a proof-of-concept runnable code 3. Provide appropriate documentation 4. Put your Acala Mandala Address inside your code repo e.g. in README 5. Submit your code to [Acala Riot Channel](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_CODE

**REWARD** Each prize will be **at least 1,000 ACA and 60,000 KAR**, more can be awarded depends on coolness, significance, usefulness, quality, and other aspects the Acala Engineers may see fit.

The total prize pool is capped at 40,000 ACA and 2,000,000 KAR, and Acala reserves the right to extend it further.

**PRIZE GIVING** 1. Please allow 2 weeks upon submission for review. 2. Prize tokens will be dropped to the address provided inside the code repo submitted. 3. **We may fund the project further where it seems fit** 🚀

### Runtime Bug Bounty

**ELIGIBILITY** Help identify bugs in Acala mainly for this repo [https://github.com/AcalaNetwork/Acala](https://github.com/AcalaNetwork/Acala).

Generally, a bug that poses significant vulnerability or causing systemic defects would be eligible. 1. Open an issue in Github, provide as much information as you can, including a description of the bug, its potential impact, steps for reproducing it 2. Include your Acala Mandala Address for prize giving in the Github issue 3. Submit the issue to [Acala Riot Channel](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_RUNTIME\_BUG

**PRIZE** **Total Prize Pool**: 16,666 ACA and 833,333 KAR, and Acala reserves the right to extend it further.

Bugs are judged on significance and severity by the Acala Engineering team, and are awarded based roughly on the levels below:

* **Level A (2,000 ACA + 100,000 KAR)**: significant logic and process volunerability; sensitive or highly probably to create significant impacts to the system
* **Level B (1,000 ACA + 50,000KAR)**: intermediate logic and process volunerability
* **Level C (300 ACA + 15,000 KAR)**: mild vulnerability or bugs that interrupts or breaks system expected operation

**PRIZE GIVING** 1. Please allow 1 week upon submission for review. 2. Prize tokens will be dropped to the address provided in the issue submitted.

### UI Bug Bounty (Closed)

Generally, a bug that poses significant vulnerability or causing systemic defects would be eligible. 1. Open an issue in Github, provide as much information as you can, including a description of the bug, its potential impact, steps for reproducing it 2. Include your Acala Mandala Address for prize giving in the Github issue 3. Submit to the [Acala Riot Channel](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_UI\_BUG

**PRIZE** **Total Prize Pool**: 2,000 ACA and 100,000 KAR, and Acala reserves the right to extend it further.

Bugs are judged on significance and severity by the Acala Engineering team, and are awarded based roughly on the levels below:

* **Level A (1,000 ACA + 50,000 KAR)**: significant logic and process volunerability; sensitive or highly probably to create significant impacts to the system.
* **Level B (200 ACA + 10,000KAR)**: intermediate logic and process volunerability.
* **Level C (80 ACA + 4,000 KAR)**: mild vulnerability or bugs that interrupts or breaks system expected operation.

**PRIZE GIVING** 1. Please allow 1 week upon submission for review. 2. Prize tokens will be dropped to the address provided in bug submission.


---
description: >-
  The Acala community includes over 350,000 members distributed around the
  world. Below are links to official platforms, as well as unofficial, and
  regional-specific, community-managed channels.
---

# Community

## General Discussion & Support

[Discord](https://www.acala.gg/) **|** [Discourse Forum](https://acala.discourse.group/) **|** [Riot](https://riot.im/app/#/room/#acala:matrix.org) **|** [General Enquiry Email](mailto:hello@acala.network)

Issues can be raised directly in the respective [Github](https://github.com/AcalaNetwork) repo or via Riot channel

## **Social & Announcements**

#### Acala&#x20;

[Discord](https://www.acala.gg/) | [Twitter](https://twitter.com/AcalaNetwork) | [Telegram](https://t.me/AcalaAnnouncement) **|** [Medium](https://medium.com/acalanetwork) | [Facebook](https://www.facebook.com/acalanetwork/) | [LinkedIn](https://www.linkedin.com/company/acalanetwork) | [Reddit](https://www.reddit.com/r/acalanetwork) | [YouTube](http://youtube.com/c/acalanetwork)

#### **Karura**

[Discord](https://www.acala.gg/) | [Twitter](https://twitter.com/KaruraNetwork) | [Telegram](https://t.me/karuraannouncements) **|** [LinkedIn](https://www.linkedin.com/showcase/karuranetwork/) | [Reddit](https://www.reddit.com/r/karuranetwork)&#x20;

For more updates on the Acala and Karura ecosystems, subscribe to the [newsletter](https://share.hsforms.com/1X9RxkXk-R62I0VNbATaDXw4h8qc).

## **Regional and Language-Specific Communities**

Please use best practices when engaging with community-managed channels. Keep in mind that no admin or representative from Acala will ever message you or add you to a channel. Beware of imitation Acala representatives and always confirm information with our official channels.&#x20;

#### **Telegram**

[French](https://t.me/AcalaFR) **|** [Italian](https://t.me/acalaitalia) **|** [Korean](https://t.me/acalakorea) **|** [Portuguese](https://t.me/acalaportugues) **|** [Russian](https://t.me/acalarussia) **|** [Spanish](https://t.me/acalaespanol) **|** [Thai](https://t.me/acalathai) **|** [Turkish](https://t.me/Acala\_Turkiye) **|** [Ukrainian](https://t.me/acalaukraine) | [Vietnamese](https://t.me/AcalaVietnamese)

#### **WeChat**

[Chinese](https://u.wechat.com/MODhkDzRP9Lve93NmBI3EI8)

## **Unofficial Communities**

#### **Telegram**

[Acala & Karura Unofficial](https://t.me/acala\_karura\_unofficial) \
\
**Discord**

[Acala+  (Unofficial)](https://discord.gg/MGPNchpkV2)


---
description: List of common links.
---

# General Info

## Links

* [Acala Links](https://linktr.ee/acalanetwork)
* [Karura Links](https://linktr.ee/karuranetwork)

## Literature

* [\<Acala Whitepaper>](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Acala\_Whitepaper.pdf)
* [\<Acala Token Economy Paper>](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Acala\_Token\_Economy\_Paper.pdf)
* [\<Building a Decentralized Sovereign Wealth Fund>](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Building\_a\_Decentralized\_Sovereign\_Wealth\_Fund.pdf)

## Events Recording

* [Overview of the Karura Parachain Auction Process](https://www.crowdcast.io/e/overview-karura-crowdloan)
* [Polkadot Decoded - Acala’s Cross-Chain DeFi Hub, Stablecoin & Decentralized Sovereign Wealth Fund - Ruitao Su](https://www.crowdcast.io/e/polkadot-decoded/6)
* [PolkaDeFi Day - The Polkadot Decentralized Finance Community Conference](https://www.crowdcast.io/e/polkadefi-conference?utm\_campaign=discover\&utm\_source=crowdcast\&utm\_medium=discover\_web)
* [Testing Acala & Laminar’s Rococo Parachain](https://www.crowdcast.io/e/testing-rococo-parachain)
* [Web3 Builders: Laminar & Acala](https://www.crowdcast.io/e/polkadot-web3-builders-laminar-acala?utm\_campaign=discover\&utm\_source=crowdcast\&utm\_medium=discover\_web)
* [Web 3.0 Bootcamp Opening Ceremony - Live Stream](https://www.crowdcast.io/e/f2ykih2r?utm\_campaign=discover\&utm\_source=crowdcast\&utm\_medium=discover\_web)
* [DeFi discussion](https://www.crowdcast.io/e/defi-discussions/52)
* [Acala & Laminar | Crypto Interview | BlockchainBrad](https://www.youtube.com/watch?v=kCVJojzYomo\&t=2014s)
* [Introducing Acala - Cross-chain Open Finance Platform](https://www.youtube.com/watch?v=jpF7ncfnmxM)
* [Web 3.0 Bootcamp Online Opening Ceremony](https://www.bilibili.com/video/BV1ng4y167QB)
* [Ready Layer One](https://readylayer.one/)
* [SF BLockchain Week - Unitize](https://unitize.online/speakers)
* [Acala Joining Product Validation Day with IDEO CoLab Ventures](https://medium.com/acalanetwork/acala-joining-product-validation-day-with-ideo-colab-ventures-3735f9592cf6)
* [Figment Network’s Staking Hub hosted an AMA for Acala on July 2, where we answered questions on Acala’s DeFi hub position in Polkadot](https://twitter.com/StakingHub/status/1276194861838974976?s=20)
* [Hackusama — the very first Polkadot / Kusama hackathon is now LIVE with a deadline on Aug 14](https://polkadot.network/join-hackusama-hack-on-polkadots-wild-cousin/)


# Media Kits

## **Brand Assets**

### **Acala Brand Assets**

Access the Acala brand assets[ here](https://drive.google.com/drive/folders/1kQ5KB8jEpdzKHGEDitEibEJZ2yy6KHmv?usp=sharing).

Follow the Acala brand guideline [here](https://drive.google.com/file/d/1-AFxC8AELULuMjCxa2vWi0RfdmCfi8q9/view?usp=sharing).

### **Karura Brand Assets**

Access the Karura brand assets [here](https://drive.google.com/drive/folders/1kQj1ZoowzfU0w77C-JgAMSIq2Z4nfCut?usp=sharing).

Follow the Karura brand guideline [here](https://drive.google.com/file/d/1v0KBbtRWZtappOfiSvx1OjQQsZENY1yw/view?usp=sharing).

## **About Us**

### **About Acala**

Acala is building the liquidity layer for web3 finance that is captive and sustainable. It aims to provide infrastructures for HyFi (DeFi+CeFi) solutions with crypto and real-world assets. Acala offers a Universal Asset Hub that hosts multichain liquid staking token (LST) protocols (such as liquid DOT - LDOT), an AMM decentralized exchange, and an app platform that is EVM-compatible and highly customizable (based on Substrate). Acala is secured by Polkadot, and is the liquidity gateway of Polkadot parachains and L1/L2 blockchains.

Website: [https://acala.network\
](https://acala.network)Follow Acala: [https://linktr.ee/acalanetwork](https://linktr.ee/acalanetwork)

### **About Karura**

Karura is the decentralized financial hub of Kusama, a scalable multi-chain network for radical innovation and early-stage Polkadot deployments. Karura is the sister network to Acala. It hosts multichain liquid staking token (LST) protocols (such as liquid KSM - LKSM), an AMM decentralized exchange, and an app platform that is EVM-compatible and highly customizable (based on Substrate). Karura is secured by Kusama, and is the liquidity gateway of Kusama parachains, Acala and L1/L2 blockchains

Website: [https://acala.network/karura](https://acala.network/karura)

Follow Karura: [https://linktr.ee/karuranetwork](https://linktr.ee/karuranetwork)

### **Press Contact**

Our team is keen to assist in promoting your content on the Acala and/or Karura community channels. Please reach out to us to strategize on co-marketing activities, timing, social copy, and/or potential PR placement.&#x20;

| <p><strong>Contact Acala</strong><br>hello@acala.network</p> |
| ------------------------------------------------------------ |



# Alliance

{% hint style="info" %}
In alphabetical order.
{% endhint %}

## Founding Members

* [Laminar](https://laminar.one/)
* [Polkawallet](https://polkawallet.io/)

## **Partners**

* [Arrington XRP Capital](http://arringtonxrpcapital.com/)
* [Altonomy](https://www.altonomy.com/)
* [Berkeley Xcelerator](https://www.xcelerator.berkeley.edu/)
* [CMS Holdings](http://cmsholdings.io/)
* [CoinFund](https://coinfund.io/)
* [DCG](https://dcg.co/)
* [DENTONS](https://www.dentons.com/)
* [DIGITAL RENAISSANCE](https://drf.ee/)
* [Divergence Ventures](https://www.div.vc/)
* [GOODMORE CAPITAL](https://goodmore.capital/)
* [HASHKEY CAPITAL](https://www.hashkey.com/)
* [Hypersphere Ventures](https://www.hypersphere.ventures/)
* [KR1](https://kr1.io/)
* [Pantera](https://www.panteracapital.com/)
* [ParaFi](https://www.parafi.capital/)
* [POLYCHAIN CAPITAL](https://polychain.capital/)
* [P2P CAPITAL](https://www.p2pcap.com/)
* [P2P Validator](https://p2p.org/)
* [SNZ](https://snzholding.com/)
* [Spartan Capital](https://www.spartangroup.io/)
* [Stake Zone](http://stake.zone/)
* [Web3 Capital](https://web3.capital/)
* [Web3 Foundation Grant](https://web3.foundation/)
* [Zee Prime Capital](https://zeeprime.capital/)
* [1confirmation](https://www.1confirmation.com/)

## **Ecosystem Projects**

* [Centrifuge](https://centrifuge.io/)
* [Chainlink](https://chain.link/)
* [ChainX](https://chainx.org/)
* [Dipole](https://www.dipole.tech/)
* [Interlay](https://www.interlay.io/)
* [Moonbeam](https://moonbeam.network/)
* [ONTology](https://ont.io/)
* [Phala Network](https://phala.network/)
* [Plasm Network](https://www.plasmnet.io/)
* [PolkaWorld](https://www.polkaworld.org/)
* [Ryabina](https://ryabina.io/)
* [Subscan](https://www.subscan.io/)
* [Subsocial](http://subsocial.network/)
* [XANPOOL](https://xanpool.com/)

## Proof-of-Liveness Partners

* [Ankr](https://www.ankr.com/)
* [Chorus](https://chorus.one/)
* [Figment Network](https://figment.network/)
* [Onfinality](https://www.onfinality.io/)
* [PureStake](https://www.purestake.com/)
* [P2P Validator](https://p2p.org/)
* [SNZ Pool](https://snzholding.com/)

---
description: >-
  The Acala community includes over 350,000 members distributed around the
  world. Below are links to official platforms, as well as unofficial, and
  regional-specific, community-managed channels.
---

# Community

## General Discussion & Support

[Discord](https://www.acala.gg/) **|** [Discourse Forum](https://acala.discourse.group/) **|** [Riot](https://riot.im/app/#/room/#acala:matrix.org) **|** [General Enquiry Email](mailto:hello@acala.network)

Issues can be raised directly in the respective [Github](https://github.com/AcalaNetwork) repo or via Riot channel

## **Social & Announcements**

#### Acala&#x20;

[Discord](https://www.acala.gg/) | [Twitter](https://twitter.com/AcalaNetwork) | [Telegram](https://t.me/AcalaAnnouncement) **|** [Medium](https://medium.com/acalanetwork) | [Facebook](https://www.facebook.com/acalanetwork/) | [LinkedIn](https://www.linkedin.com/company/acalanetwork) | [Reddit](https://www.reddit.com/r/acalanetwork) | [YouTube](http://youtube.com/c/acalanetwork)

#### **Karura**

[Discord](https://www.acala.gg/) | [Twitter](https://twitter.com/KaruraNetwork) | [Telegram](https://t.me/karuraannouncements) **|** [LinkedIn](https://www.linkedin.com/showcase/karuranetwork/) | [Reddit](https://www.reddit.com/r/karuranetwork)&#x20;

For more updates on the Acala and Karura ecosystems, subscribe to the [newsletter](https://share.hsforms.com/1X9RxkXk-R62I0VNbATaDXw4h8qc).

## **Regional and Language-Specific Communities**

Please use best practices when engaging with community-managed channels. Keep in mind that no admin or representative from Acala will ever message you or add you to a channel. Beware of imitation Acala representatives and always confirm information with our official channels.&#x20;

#### **Telegram**

****[French](https://t.me/AcalaFR) **|** [Italian](https://t.me/acalaitalia) **|** [Japanese](https://t.me/AcalaJapan) **|** [Korean](https://t.me/acalakorea) **|** [Portuguese](https://t.me/acalaportugues) **|** [Russian](https://t.me/acalarussia) **|** [Spanish](https://t.me/acalaespanol) **|** [Thai](https://t.me/acalathai) **|** [Turkish](https://t.me/Acala\_Turkiye) **|** [Ukrainian](https://t.me/acalaukraine) | [Vietnamese](https://t.me/AcalaVietnamese)

#### **WeChat**

[Chinese](https://u.wechat.com/MODhkDzRP9Lve93NmBI3EI8)

## **Unofficial Communities**

#### **Telegram**

[Acala & Karura Unofficial](https://t.me/acala\_karura\_unofficial) \
\
**Discord**

[Acala+  (Unofficial)](https://discord.gg/MGPNchpkV2)


---
description: List of common links.
---

# General Info

## Links

* [Acala Links](https://linktr.ee/acalanetwork)
* [Karura Links](https://linktr.ee/karuranetwork)

## Literature

* [\<Acala Whitepaper>](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Acala\_Whitepaper.pdf)
* [\<Acala Token Economy Paper>](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Acala\_Token\_Economy\_Paper.pdf)
* [\<Building a Decentralized Sovereign Wealth Fund>](https://github.com/AcalaNetwork/Acala-white-paper/blob/master/Building\_a\_Decentralized\_Sovereign\_Wealth\_Fund.pdf)

## Events Recording

* [Overview of the Karura Parachain Auction Process](https://www.crowdcast.io/e/overview-karura-crowdloan)
* [Polkadot Decoded - Acala’s Cross-Chain DeFi Hub, Stablecoin & Decentralized Sovereign Wealth Fund - Ruitao Su](https://www.crowdcast.io/e/polkadot-decoded/6)
* [PolkaDeFi Day - The Polkadot Decentralized Finance Community Conference](https://www.crowdcast.io/e/polkadefi-conference?utm\_campaign=discover\&utm\_source=crowdcast\&utm\_medium=discover\_web)
* [Testing Acala & Laminar’s Rococo Parachain](https://www.crowdcast.io/e/testing-rococo-parachain)
* [Web3 Builders: Laminar & Acala](https://www.crowdcast.io/e/polkadot-web3-builders-laminar-acala?utm\_campaign=discover\&utm\_source=crowdcast\&utm\_medium=discover\_web)
* [Web 3.0 Bootcamp Opening Ceremony - Live Stream](https://www.crowdcast.io/e/f2ykih2r?utm\_campaign=discover\&utm\_source=crowdcast\&utm\_medium=discover\_web)
* [DeFi discussion](https://www.crowdcast.io/e/defi-discussions/52)
* [Acala & Laminar | Crypto Interview | BlockchainBrad](https://www.youtube.com/watch?v=kCVJojzYomo\&t=2014s)
* [Introducing Acala - Cross-chain Open Finance Platform](https://www.youtube.com/watch?v=jpF7ncfnmxM)
* [Web 3.0 Bootcamp Online Opening Ceremony](https://www.bilibili.com/video/BV1ng4y167QB)
* [Ready Layer One](https://readylayer.one/)
* [SF BLockchain Week - Unitize](https://unitize.online/speakers)
* [Acala Joining Product Validation Day with IDEO CoLab Ventures](https://medium.com/acalanetwork/acala-joining-product-validation-day-with-ideo-colab-ventures-3735f9592cf6)
* [Figment Network’s Staking Hub hosted an AMA for Acala on July 2, where we answered questions on Acala’s DeFi hub position in Polkadot](https://twitter.com/StakingHub/status/1276194861838974976?s=20)
* [Hackusama — the very first Polkadot / Kusama hackathon is now LIVE with a deadline on Aug 14](https://polkadot.network/join-hackusama-hack-on-polkadots-wild-cousin/)


# Alliance

{% hint style="info" %}
In alphabetical order.
{% endhint %}

## Founding Members

* [Laminar](https://laminar.one/)
* [Polkawallet](https://polkawallet.io/)

## **Partners**

* [Arrington XRP Capital](http://arringtonxrpcapital.com/)
* [Altonomy](https://www.altonomy.com/)
* [Berkeley Xcelerator](https://www.xcelerator.berkeley.edu/)
* [CMS Holdings](http://cmsholdings.io/)
* [CoinFund](https://coinfund.io/)
* [DCG](https://dcg.co/)
* [DENTONS](https://www.dentons.com/)
* [DIGITAL RENAISSANCE](https://drf.ee/)
* [Divergence Ventures](https://www.div.vc/)
* [GOODMORE CAPITAL](https://goodmore.capital/)
* [HASHKEY CAPITAL](https://www.hashkey.com/)
* [Hypersphere Ventures](https://www.hypersphere.ventures/)
* [KR1](https://kr1.io/)
* [Pantera](https://www.panteracapital.com/)
* [ParaFi](https://www.parafi.capital/)
* [POLYCHAIN CAPITAL](https://polychain.capital/)
* [P2P CAPITAL](https://www.p2pcap.com/)
* [P2P Validator](https://p2p.org/)
* [SNZ](https://snzholding.com/)
* [Spartan Capital](https://www.spartangroup.io/)
* [Stake Zone](http://stake.zone/)
* [Web3 Capital](https://web3.capital/)
* [Web3 Foundation Grant](https://web3.foundation/)
* [Zee Prime Capital](https://zeeprime.capital/)
* [1confirmation](https://www.1confirmation.com/)

## **Ecosystem Projects**

* [Centrifuge](https://centrifuge.io/)
* [Chainlink](https://chain.link/)
* [ChainX](https://chainx.org/)
* [Dipole](https://www.dipole.tech/)
* [Interlay](https://www.interlay.io/)
* [Moonbeam](https://moonbeam.network/)
* [ONTology](https://ont.io/)
* [Phala Network](https://phala.network/)
* [Plasm Network](https://www.plasmnet.io/)
* [PolkaWorld](https://www.polkaworld.org/)
* [Ryabina](https://ryabina.io/)
* [Subscan](https://www.subscan.io/)
* [Subsocial](http://subsocial.network/)
* [XANPOOL](https://xanpool.com/)

## Proof-of-Liveness Partners

* [Ankr](https://www.ankr.com/)
* [Chorus](https://chorus.one/)
* [Figment Network](https://figment.network/)
* [Onfinality](https://www.onfinality.io/)
* [PureStake](https://www.purestake.com/)
* [P2P Validator](https://p2p.org/)
* [SNZ Pool](https://snzholding.com/)


# Acala Old Friend NFT

![](../../.gitbook/assets/screen-shot-2021-04-18-at-10.58.36-am.png)

We semi-secretly dropped the 'Acala Old Friend' NFT to those early participants of our Testnet Campaigns:

* ****[**1st Mandala Festival 🎉**](https://medium.com/acalanetwork/mandala-festival-prize-drops-3ae68df0dfa6)****
* ****[**Acala Mandala Fest Season 2 🎉**](https://medium.com/acalanetwork/acala-mandala-fest-season-2-prize-drops-81b649324310)****
* ****[**Acala Mandala Festival Season #3**](https://medium.com/acalanetwork/acala-mandala-festival-season-3-d0a6f155c154)****
* ****[**Acala Mandala Festival Season #4 Halloween Give-Back**](https://medium.com/acalanetwork/acala-mandala-festival-season-4-halloween-give-back-d9b073f1fecc)****
* Active user in 2020 or earlier

Use [this guide](../../misc/finding-tokens-and-nfts.md) to check NFTs on testnet.&#x20;

****


---
description: Records of some activity rules and rewards.
---

# Contribution & Rewards

## AirDrops

You can now check your airdrop KAR & ACA balances on [https://apps.acala.network/wallet](https://apps.acala.network/wallet). The balances are recorded on-chain in the `airdrop` module, which will be used to allocate real tokens upon Karura Canary network and Acala mainnet genesis.

![](<../../.gitbook/assets/image (21).png>)

Learn more about ACA & KAR tokens [here](../../learn/acala-introduction/#assets).

Festival-goers and contributors, have fun, learn & break things, behold & catch the candies 🎁

## Mandala Festival Season 4 (Finished)

\*\*This event has concluded, thank you for your participation. \*\*

Building Acala is a community effort, and Mandala Fest then becomes a celebration of this growing community and the wealth of possibility that awaits us all in building web3. All past festival-goers would have a chance to claim Acala & Karura Halloween themed badges.\
These collectibles don’t have a monetary value nor a market, they are our mere way of honouring our shared experience and saying thank you. Newcomers to the community who complete required tasks would also have a chance to claim these collectibles.\
Here’s what the festival looks like and the rewards:

* Part I (31-October-2020 to 06-November-2020 | Award Pool: 2,000 ACA + 2,000 KAR): Welcome Newcomers — complete required transactions to qualify.
* Part II (31-October-2020 to 13-November-2020 | Award Pool ≈ 30,000 ACA + 30,000 KAR): Thank You — reward claim by qualified past festival participants
* Part III (31-October-2020 to 13-November-2020 | Award Pool: 3,000 ACA + 3,000 KAR): Bounties — bugs, better memes, stickers or else

### Season 4 Halloween Give-Back Get Started

\*\*This event has concluded, thank you for your participation. \*\*

* Get started with Acala including creating a wallet and obtain test tokens [here](https://github.com/AcalaNetwork/Acala/wiki/1.-Get-Started)
* Check out these guides to use [Honzon stablecoin](https://github.com/AcalaNetwork/Acala/wiki/2.-Honzon-Stablecoin), [Acala Dex](https://github.com/AcalaNetwork/Acala/wiki/3.-DeX), and [Homa staking derivative](https://github.com/AcalaNetwork/Acala/wiki/7.-Homa-Liquid-DOT).
* Check out guides on cross-chain trading with Laminar and Ren [here](https://github.com/AcalaNetwork/Acala/wiki/T.-Cross-chain-DeFi)
* Check out these guides on Laminar [synthetic asset](https://github.com/laminar-protocol/laminar-chain/wiki/2.-Synthetic-Asset) & [margin trading](https://github.com/laminar-protocol/laminar-chain/wiki/3.-Margin-Trading)
* Results are published [here](https://github.com/AcalaNetwork/Acala/wiki/W.-Contribution-&-Rewards)

### Season 4 Full Schedule and Rules

\*\*This event has concluded, thank you for your participation. \*\*

#### Season 4 Part 1: Welcome Newcomers

Duration: 31-October-2020 to 06-November-2020 (one week)\
Award Pool: 2,000 ACA + 2,000 KAR

* All qualified users will share the reward pool
* All rewards will be recorded and published
* Note these rewards are lucky draws, not guaranteed

![](https://camo.githubusercontent.com/a293930f14d75fa055a1b38c994957f00fec844ee501c57df717ea229ca73c63/68747470733a2f2f6d69726f2e6d656469756d2e636f6d2f6d61782f313430302f312a3863745f4f53676955505063494d486c475a676641512e706e67)

Participation Rules:

* Get test aUSD from the faucet, fees are payable in aUSD
* Users completing three meaningful transactions will be rewarded

Meaningful transactions include:

* Use DeX to swap tokens
* Use DeX to provide liquidity and transfer LP Tokens to another account
* Use the Self Service Loan service to collateralize for Acala Dollar (aUSD)
* Use Homa protocol to get staking derivative LDOT
* Transfer aUSD to Laminar Chain, and use it either for synthetic assets or margin trading
* Mint renBTC and use it in the above activities

#### Season 4 Part 2: Thank You

Duration: 31-October-2020 to 13-November-2020 (two weeks)\
Award Pool ≈ 30,000 ACA + 30,000 KAR

Participation Rules:

* Each account which participated Mandala TC2/TC3/TC4 can get 1 ACA + 1 KAR（If all testnet you participated, you will get 3 ACA + 3 KAR ）
* The nonce of each Mandala TC2/TC3/TC4 account must greater than or equal to two
* All rewards need be claimed in Acala Dapp
* You can see the rewards in your wallet Airdrop account

#### Season 4 Part 3: Bounties for Bugs, Sticker & Emojis sets (Throughout the Festival)

Duration: 31-October-2020 to 13-November-2020 (two weeks)\
Award Pool: 3,000 ACA + 3,000 KAR\
Please allow one week from your submission for our review.\
Participation Rules:

**Bug Bounties**

Find bugs for the following repos:\
[https://github.com/AcalaNetwork/Acala](https://github.com/AcalaNetwork/Acala)\
[https://github.com/AcalaNetwork/acala-dapp](https://github.com/AcalaNetwork/acala-dapp)\
[https://github.com/polkawallet-io/polkawallet-flutter](https://github.com/polkawallet-io/polkawallet-flutter) (Acala part)

* Bugs are judged on significance and severity by the Acala Engineering team and are awarded roughly based on the levels [here](https://github.com/AcalaNetwork/Acala/wiki/W.-Contribution-&-Rewards#runtime-bug-bounty)
* Please include your Acala Mandala Address in the Github issue for easy prize distribution

**Stickers & Emojis sets**

* Rewards are not guaranteed for this category
* Feel free to submit Acala/Karura themed Sticker & Emoji sets
* Sticker & Emoji sets selected for our Discord channels will receive rewards
* Please include your Acala Mandala Address in the submission

### Season 4 Prize Giving

#### Season 4 Part 1 Prize Giving: Welcome Newcomers

No. of Qualified Users: 4,712 (< 5,000),\
Lucky Draw: 60%,\
Number of lucky accounts: 2,827,\
The reward for each lucky account: 0.7 ACA, 0.7 KAR.\
List of winning accounts: [Google List](https://docs.google.com/spreadsheets/d/1iSlG5trQnyOR5uzsT7puOsIODiWm7HfZtAi3ys4ietg/edit?usp=sharing)

#### Season 4 Part 2 Prize Giving: Thank You

Claim candy information within the valid time frame (Not included in the activity time not claimed):

The number of accounts that have claimed candy: 11,635\
Claimed candy reward: 13,739 ACA + 13,739 KAR\
List of claimed candy: [Google List](https://docs.google.com/spreadsheets/d/18comqh2wg6d-NNFb-HFetaToiPSkrS59wt1OmeGyxcQ/edit?usp=sharing)

#### Season 4 Part 3 Prize Giving: Bounties for Bugs

| Repos                           | BUG level | Issue link                                                               | Address                                          |
| ------------------------------- | --------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| acala-dapp                      | bug-c     | [#273](https://github.com/AcalaNetwork/acala-dapp/issues/273)            | 5HpLku5nX1Qqr2jUHDXH7rMBB5UVD7gJubNzVijvg6JhJJ9Q |
| acala-dapp                      | bug-c     | [#277](https://github.com/AcalaNetwork/acala-dapp/issues/277)            | 5HdRwpyhpLNMiFRtEFL7JyhvkSLNSJGVDnQ1GcnVgTQr5smP |
| acala-dapp                      | bug-c     | [#281](https://github.com/AcalaNetwork/acala-dapp/issues/281)            | 5HHECGnb51XLhPzWWUqumWxb9KwTARmcunxMXvkyNCqRqDX3 |
| acala-dapp                      | bug-c     | [#282](https://github.com/AcalaNetwork/acala-dapp/issues/282)            | 5HnB6WGwGFZU87ViXYhVxxPEKS1K8r2QTQnvSPg9tWqVApxY |
| acala-dapp                      | bug-c     | [#284](https://github.com/AcalaNetwork/acala-dapp/issues/284)            | 5FUaMCA9TSiJUdUAyAuLgUF5ZMhrvKQsHXZKhFiJMgWpZSyq |
| acala-dapp                      | bug-c     | [#294](https://github.com/AcalaNetwork/acala-dapp/issues/294)            | 5CUpyz4irvybSgdZpuPJAFi2ApDqzp8QtfUgR7vWtagFcHGn |
| acala-dapp                      | bug-c     | [#295](https://github.com/AcalaNetwork/acala-dapp/issues/295)            | 5EFDkXjzsyarcuLV1tDCE93wMjqxYxZyZn7qVh9soufPt2Ho |
| acala-dapp                      | bug-c     | [#316](https://github.com/AcalaNetwork/acala-dapp/issues/316)            | 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o |
| acala-dapp                      | bug-c     | [#283](https://github.com/AcalaNetwork/acala-dapp/issues/283)            | 5FUaMCA9TSiJUdUAyAuLgUF5ZMhrvKQsHXZKhFiJMgWpZSyq |
| polkawallet-flutter(Acala part) | bug-c     | [#191](https://github.com/polkawallet-io/polkawallet-flutter/issues/191) | 5HnB6WGwGFZU87ViXYhVxxPEKS1K8r2QTQnvSPg9tWqVApxY |

#### Season 4 Part 3 Prize Giving: Sticker & Emojis sets(Throughout the Festival)

Sticker submission link: [https://discord.gg/WYjDeZDTPN](https://discord.gg/WYjDeZDTPN)

| Address                                          | Reward        |
| ------------------------------------------------ | ------------- |
| 5D7qE641LNgeL4fQxkLrwZPoqMavhGXbWN21DhoMf6iWqBAb | 5 ACA + 5 KAR |
| 14XszikzVEgp1kbL5uRsdn1F3vXkaowLub9KcFMVhqiBBgcy | 5 ACA + 5 KAR |
| 5DQ1AvYrLy3ZsYrUKeaY4CZZWBFatLKrZ3sjAfdm1oGtSQJX | 5 ACA + 5 KAR |
| 5DUUgntu8Atyu2xkk1GjhBBxLryC6CRovHzVcWzFALjHsjQF | 5 ACA + 5 KAR |
| 5EHiBbDEhb71TAJFBpGD7URArSA137CHKh4srJR1zkkRbBLz | 5 ACA + 5 KAR |

## Mandala Festival Season 3 (Finished)

\*\*This event has concluded, thank you for your participation. \*\*

### Season 3 Prize Giving

#### -Week 1: User Participation

No. of Qualified Users: 10,525 (>5,000),\
Lucky Draw: 20%,\
Number of lucky accounts: 2105,\
Reward for each lucky account: 9.5 ACA, 9.5 KAR.\
List of winning accounts: [Google List](https://docs.google.com/spreadsheets/d/1RRJfDDpigMsiFKocTrkurJrG43f4d163WjErWErfdNQ/edit?usp=sharing)

#### -Week 2: Trading Competition

As of 10th Aug, the top 10 traders are as follows, they will share the reward pool. Congrats for all winners! Also well done on everyone who has participated, there will be more yield farming opportunities once Acala is live, and your effort will be rewarded 🎉

| #  | Top Trader Address                               | Profit Margin 100% |
| -- | ------------------------------------------------ | ------------------ |
| 1  | 5G6ud7FEZZuFXtGX7rG9Vpq1w575w6NHkEQfzGZpKdaDbFGo | 504.9              |
| 2  | 5Dd8SGx5FyYxCgJtUC3MWdqCPB9QiAADVHWTy9ztVxqLaT1Y | 274.9              |
| 3  | 5HgXhg8HBUZQmCPumRMztC9vsKYk1CWfzmRUZJVaXnEDMEVS | 262.8              |
| 4  | 5E1rKcxMf2fqrZh1J3UgBKTGxuvAz8Y699THMtxMXeg5nDv4 | 215.3              |
| 5  | 5CRwrzRYhnUw2uSZvTy6h4dogYQYx7bV6sNnkTocpanBSt3T | 204.8              |
| 6  | 5DfM8dtKWwURKjpQBopS6GudCr9qRYq1KgBHVCmbmKkqdMeR | 199.1              |
| 7  | 5FPBkZKmB7UCnEyJF78cpW9nczUyUMgn5vhesHBnfoptfsdC | 198.4              |
| 8  | 5GzkBJDZLhpaqfHq6sbB82L7tiGCcBVwd8LjxhPAT72PSdRk | 198.2              |
| 9  | 5EKsrAsRAfQM9wyR9sRFVqNcwQCLQyVBjLMuSr2GqYE9JPUh | 193.4              |
| 10 | 5FhA3c1pw2zwnJRxNQSQfv8nYMpNNSopgSuLc5bZ2MVX6vTC | 170.9              |

#### -Week 3: Black Thursday Simulation

Number of winners: 200\
The reward for each lucky account: 20 ACA + 20 KAR

| Winner Address                                   |
| ------------------------------------------------ |
| 5C5SQQH3cGCHjat3gQ1naELHWQLGRuiRGpCYfe1rrLMZuNWY |
| 5C8c6AkPdo83jvNvvrB1jnTi4rfkuLp7H5ziuLTDsT42gntN |
| 5CB3wjdK7a71arTf27oXoLVQR9fvDAwikPMC7AHptCYRadVR |
| 5CccLc64WB2hwWorqg92A4S5y9fwAiAdbAKLRY5obDskA26N |
| 5CcjG2MnkAMWzTzdFU3hVnDhuxf9D7yoA7dcXmJYenSMAxzW |
| 5CDGLUhq1uFbjdic7WBMP9BeFmEwkWdm5sy4wQzgewu6zLLN |
| 5CDJND47a1NSjyx3cBxztY6rcXc8WcWeRecnjRF13gP2TGfV |
| 5CDp3rjzgrXfiJNMUK4JbpsMMTnPbXK5YCBC756ZGC8uQyFf |
| 5CGADrJ1Yc9aTaDGGQ5WYMDpiwHdxdunj23b2KCdDHcm8kAi |
| 5CGQPCeg9wDQJBRU9NpoQbV1yCHnCakejg2FousPxjaUaNDz |
| 5ChYSYTom6BLoXBfJhrpzcADd5PpBxvbUuyHqArzatKfzMJy |
| 5CiJReWwBbtX7t9vEmsqwgRHH9JegTG1m5w8gZMnAsvsBDRc |
| 5Ckg6bSerNfQLk5mazUnZ4rbWP2x8fjzNgT6ceAfPHXDL5tv |
| 5CMb7ZxVdBCijk1pAy2UQxtBfsi6nVM1fcpjpcfpMR32hUsd |
| 5CmBPNRJE7onTbsRrJq5zHFt7xHQQ9enoUx7x8WtuA3YsSbj |
| 5CMcAipQEFvQv8XWPtTkWPcAnJAJrQLRiVAVNtpRGbtDngVf |
| 5CoEECmREJW5TsvsC9bhhDPvcUTLbpfsprmae9hkHRfKYchT |
| 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G |
| 5CqjU44RL4bpwmTQhNoeiA5QS2qEzqVbNv2KqkAonk2f1MjT |
| 5CqtjpcREcpPiJDhtdfdpCPm7rVDobEMb2fy6n8oWEfj2RAS |
| 5Cr1RxQ1qZuXrtr9w6Gd5VxFnoammWEmcLByZRdvVorm2DMG |
| 5CRsL3X5DYsvRZRG35FoqopTUzDKktzsG2ZpDDHVznAdhHjR |
| 5CSDymnTbuW54PCiXJtYsZbw3bZp75RVRVdyhfbDmEq4dX5c |
| 5Ct8CDacSNanB6NXkdtkCLreQMwE5PR3taGUUwSaS8KZ6d77 |
| 5CtasrgEkbisry55oK4WVRZwEN9tKvLypJKXuKAbF9T5yUg8 |
| 5CtS7BM64fpvw5rwvwMs2ADEdUxSGfP3UgQAXoX3S91QKaFo |
| 5CUMfUy5KASogbyNDdWvoNAe8TZ9cMGqSzeWS4R9WH5gyVJW |
| 5CwH4XaupdCLdZqg9VwHPgxwE13J6v41p7f4jsWGf8H8KJ4y |
| 5CXgWqJC9akm2gmmN7YD1EewLCmr9Z3HmM56aYDvwof5opRD |
| 5CXii7ZFZ4Fcj5v22thivJNNyDKt2FS9H3m1wWL3GRdWgz1n |
| 5CXuDA4NNP6w2Y6NYG4MTMK1mNixjyr1vnhNqf2eFrr8HnX7 |
| 5D1uoLbkdopC8SWtzs9kq7tfyYg48p9dJTzWqW2jvybjXbAS |
| 5D1vzT24fxPvGkkaRuEHLD3pLeNBakHuLfRksZ1yEGjddoPL |
| 5D2c1W5FGN1gR2JHEAAqTMmLPRG8KWNuyprw6gTPVavBnFQZ |
| 5D54bkBy4S8618H8BLLQhC7jzWiWRYds2iyA1ShWRrqansSb |
| 5D7Bh9iXwPTgvcuJsvhBMdyBkQwhXZenM1hxTcXPZ8pvniu4 |
| 5DAEqUAxncr5k4jcNqhn3MAk4ws8ni8k9dX9Dg4Fgf76gbSD |
| 5DaLr2t4ZzKtdDQ1m5Qf83Gwe5AbjPJLqaRCWeDGqkj3mBpR |
| 5DCdzuRtU1TK81X6FtY8SFbVhhEuCUMtggw7bJTTpG73MWnm |
| 5DCg23FGDYuGw52A9xWYHH2Qx4UrNHJUdWhZHsnMZ1BEGsHA |
| 5DD7KrBrLMPZr2GdqHUzJLUFHd83tyoudT4Gmvj8kEKz2Pnr |
| 5DeeT5CanCJtRfpdPpbhTE6CPojCTkzWf6n2mpAmgcBJPah8 |
| 5DJBW33de9ERCFg3tMVvPtYypS6YMHiP9dxocg13MDworvmT |
| 5DjuLGE8hXjGeyySChdUsLTLb5XkQs9g4QHpnnKC5Ctzecuy |
| 5DkuUCmz4Ydx4QyCeikezwWHxq5iMrEtvttsYKxvWpDetHRU |
| 5DkwphVMnrfCVFhfQgqzpDzoAKpyDVn72sHrAjMdMRutKPUW |
| 5DLJhbcn9SXE12r5JDW8tLBKTkgvD3ULAsPc54mtDfwsHeM9 |
| 5DMRE6xoiey3GV9gw2ZQiojXo7NydvvmiTGY7V2AoUXjc9LM |
| 5DnV2mGEL2TqipM4vCeQxgLYD5umaHdRGnbh8Xoz3UXJQQS9 |
| 5Dnyp5ZimHYnpV49yZjmCd1e6XAtvo9QYyiXjzMko1WkhtmN |
| 5DqWqLZJe2XZF1jSPkngxW5q5ppMYcWkN6MJw9X1aoW1YHYK |
| 5DqYYDu1wunTTNx3oYuLAZ8JG7ADqNMJqHBDWSK7wDzTuqsW |
| 5DRvDgPEsH9FGTkyQ323fnUg22ZUNJ5CjDVDJhEe1wuFwx3g |
| 5DsdVGJD2WNYyxHFD5qoXVoDrahXKqqooTA8xuTMFFmqZYD2 |
| 5DSLfBLuiQQvNsqWiweW9p4KtF1wCkjJUusSMcJt5SDHUW8c |
| 5DUtFupSAYyQCSq8bmeUQYNg2xHnuRubG1xFoMqtr3ai12ZZ |
| 5DVGjNBSNpTQAXjthsYh2sbYJCoc8eu2MfxntGcyYsgFRuLr |
| 5DwKZrbKEEqYHECNkYGbqXbdGgNCcT78KEFUS8c2sSpaKjjJ |
| 5DXV14EXkVDgoL32XHNZtsrk15QGQZxi2kdAdfQEE9tz5b4X |
| 5Dy2oAaRyqtjZcEXYCvCxo4eKw9wmBJqm7HomGiDv5riDF6f |
| 5DZbMRWJV9m5xWjMRfwtA19PGP2bKBKKhUeTyv9CPq1jvNvk |
| 5DZs7c4aD3EkzYoGujUp5fLyzBFD2GM4EDmmxBwN4msqYeWY |
| 5E1oYNJG1drkFBZc6TXFGfrCBx6ufEuVMbGaNsDMhDb2o5q2 |
| 5E6tn8PRo6psdTiisnvXbzQCfBychyqaDCC8uV4CoZKV2YQG |
| 5E7Eemxv5rwRedbGbBiCoJo31i3HgHREoVkmLa4ShYPhDzxw |
| 5E7sF34tLuJYdDaKMaAVb7APBS9KPJQdtBRvqUTDVaF1miiy |
| 5E9uMyb8udLgLjWJpsDnnthwRMwUfC7GqzKRMN2rA3hEZ72U |
| 5EA3xgxrp7STTKwarjFC6etpZFmRJmJxsJ34wnKPhE77Fezj |
| 5EA9BTvzziittbDdBk5jfktxsZDtfZ2LffDNLkv4M4iMs4Mg |
| 5EAPa5UX3FbC81msUXZkV7dYv2tqw1kniZGEVSgy9cmtUGD2 |
| 5EbpVkQhZcCVqNJdMFyHcf28nKgMiXJQ8vDLFvbHvB7Z4xmh |
| 5ECCEtRk8Sa5F92QEMq4ovX9pLbXCXMRKGFhj9Stkq66incg |
| 5ECfKYuCFCDLP7dTC9afVmbEybrYfBQ36ikwCXYfbRHj6eqg |
| 5EcgE8Gd4tcycjeCTkDbHCoPYYUaaeWFtj8b6jBuHrsFotY9 |
| 5ECzzmd2tBECJinysQAdxPraig5hq4TSoduwy65wowpZpndR |
| 5EDAyEEbsM9hqCpAhNswMe3xYRSxpEbmFRUevVekXqorzybN |
| 5EF7pepHEUMgTWFGBqqfDYbv85FkrU6gSVs3ejB5guQAnH5V |
| 5EHffteKBAi8EdvDAaqRTX8DokWCBYogEi2DsK4BUtUqE3t8 |
| 5EhNjKbKxZZYNvqUtnfH7GNyjuztcRyNbTMTb1LYbvrQLGXb |
| 5EHNX2vpAh2ZN6dfNvkr1shDKqSu6FiiY81Xz8QGUtkbUTaj |
| 5ELcnYTbHC6A1DHg5xwXtRkvUDmLCKm365JWkhBCnyKnnxt8 |
| 5Eo1U11i3b7NZcGbCSxxz3cqiZd11h34nYPGQiaytAvB37Zy |
| 5Epk8XmMU3VCEu7HC22kCLwHaSi5YKJQLgHF1rGN949qFBxE |
| 5ES9fyfV56kkEP1qazNzN1S6YwbSTfFWp2Q3i4QG4eyT2Ng8 |
| 5ESAv67AGRXr6wky8mfF7hUCKTKSDz5pTp97Su2xAFZ58YDx |
| 5EsdPnjVwT1FjwEdbqQbSJSZkKv6WGR8w7woyqf4vySLUuef |
| 5ESF68P8kxP577vfeKNbBvDdyyTbinTLbsP5WVFfADTyhQF7 |
| 5ESGSwJhe7oihCJdMnHoyw5AsitTdd36wFNavum6Jxc9KkhE |
| 5EskBzCLMU5cM7D5jp4GAK2WKe28vo8j8sAZFo27TUoHwwYn |
| 5EsUoB6DmJyX7y9KDyjNHspK7Cs263xTgDGz1sLrirc4KTpT |
| 5Et2gX3hioDAhdaziqfswo9MeK4REQC6VJedHPju4s6KEea3 |
| 5EUaKBPyXMXvJKokHCDRxvjAnvYiLWX7jM6LRMYfxwsG1zT7 |
| 5EUhyN2i6Adh6NnYzeBERpQDANfJwxrWH6Nox78jnParsRyN |
| 5EuvTF7TAY98AgKPqxCD4cVVMFhjFB1WeiiDCNuWSYkUJWby |
| 5EWzRzRSJ52FgTbdxRHMwxRVgHUE14LQhwZeh6NT9LUr197a |
| 5EX41ALzBGbhbkGHXT4stJ2bVWF4axCNKQA9RniaR9Bx6dR4 |
| 5ExsBG3eAuRPF4eCSxDQvMXF6uVVkTbeaVJ5rFEQhB7LjUbu |
| 5EZMEd5bNFs1Czw8JP9DcLWBfMehvopipfBbeSJ3JUTRiWtD |
| 5F1kLosiWXQn4C7TEX4Zy8fkRdHTLvKugkEM3JHZr7zR5M6W |
| 5F1mcCMJX8vW3VpsNWBZi13DCBGsECgiUqRiLNveTJn8tc1d |
| 5F1V1pLHDetngC7uAKDSqpAE42NR9nz6f6Dxvjm4sbMHNNeT |
| 5F3rYPmFB53XttPd8Zq9QqPxMFDUuVqDx4zjVjmqy6n4Ve4M |
| 5F3vSWoxpyeTNrUqyRZ4EkihosmoPJMGEgKAZiGE9WXWFhcY |
| 5F7f3kQxSSxpEjHHGdXZ2oFdCfy1EthTU4oVbqdhnn4THJvo |
| 5F9cnDyCs4CT9K8Y1vUdkc3iox4eMATyF1PqEbfbzpzEuJmC |
| 5F9v9Dh833m7GHznA8yxuVnGN3FdcrqtU8B9fqsFojMZQday |
| 5FByN4TX9Mh8YBeLocr7WDQCQ6da5Rjf4vq8j7HbHZQ9gkpk |
| 5Fc86bWmXQ6BrxVuEf3AMr2KHrbQWTE3zRYeNo7YGSGNVkav |
| 5Fc8Bm7cdEqV52TFjpQcRSf782iru348wQs25T7Eb8qUbkWX |
| 5FekmPiN3BRjZFFZTL6B19DvWks9wSFmPt2GjpGuo2UX1oWW |
| 5FeobeFfTqkRo8FcxfK4PM8dyroKvo7evgX8G4Xq6GbULgBp |
| 5Ff46r7kSwe7Wmc6mD81PQ3bz9596ztJQrwPt92ibZAfT1TG |
| 5FF99759ko3ZGEwVyheGfCvU3a1U428KYA2qKDgqyfRRyV7i |
| 5FfAwy8MXtACXy9ZzTXGvr6vpMF5DkAHcPCxmA4bVx4f65WD |
| 5FFEZ4e3wBT9Nq1gvYbCgZteybRSHMVMzjnkHGQ9uMVq4VcH |
| 5Fgc53zVCZ5QneUX1ShgZnKB6GB49CHyCP5CnKukEWHnJYTe |
| 5FhAyh4dCATKKNc6pycp3FDEvFdcDpqLM7hye9N6ZQ31n82e |
| 5FHook4GYvTQh7ZUY1QsNVmGN1DxGhWDZkk47ypnM4Uj6XP7 |
| 5FHSQfVcfVQ4kQPbbXKU26hJhy6mvF8sjybmkKtbDLpKCcmF |
| 5FhWwJJ79QvYcXr7Hw745r4GbyAW6qhrJogkED9GLPd72GkJ |
| 5FKmWyV3jEC32UCTMuEdot7WQM3LUe5n8kFG7zHeAPiC5khc |
| 5FkN95SMDSyo95gcfAUMwD4mfhjHr4qjqQ1edXmifs9WB2Wi |
| 5FKxaskGiQrRkJY8fmwwYfnt3T8iRfqiNzWJkwHimMAiEaZC |
| 5FLPVDd25MHFaErAThUGgbkcVzZe6dn1HH1dPkNGHCRzesML |
| 5FLWVLV3GPXhffAWLNuzMM1SKJA71pkSHzxegq68g7PzEbre |
| 5Fn8ytY7CW8fhMGSxKcG8PBr1A2t8MbYBtizPXtet8bVQKeX |
| 5FNuxCpDvTfiwcxgcgqo1oKJGkFwXQkmRcgBCcezNvub5hHg |
| 5FNZUvf4o5eyeNjxEfRTZ5535yeJnHgGHpeAUWU5C6a2HSbF |
| 5FP7Ko5aqW7xNTVASk6cqLdKCsafiefeeoCPLHFDukSmpMfo |
| 5FPCh4QTAQ7fJBFggHY67Lbz3i8Hodt5VdipfDTfxQ54cw6Z |
| 5FqTYBzGTZ481A5Tw1P2LJns7GDAkLBdpQiQjyoAx2TD9irE |
| 5FsYjqYG5arYv83wEjzFQ2VQfzum9t5RVQHuiDAssj9Q6vJ3 |
| 5FW7heMz9BjDLetkwYVs61NzFaCo3Xj473fQyQVw1sHFCFA5 |
| 5FxKdMEYJyqLAZMCGfU6m5UBAqggXsWbwRsAbQSFkakb9xC3 |
| 5FxQoRf1YRB9ZZoq6Xbx4KJyhir8KtVwBiRKAmvyuxJx1cKL |
| 5FYf5E6isLJ57mBCs9XHswFR5GjEG43ddE7tvF5xj5ZtgTpb |
| 5FyQ2nKuX9RGtshigu2y4rVXuN8HMBLz1SWZMA7ik7YgWwYH |
| 5FySKeAoxa9XoyhmQiqWHKZHpNSUauEjXxB1NNzuZe5bAaEB |
| 5FYsPvBvRxkLoUwpPD9wJxqaYPoVhdiovSPhuQWVjopEbM7M |
| 5G3habEPHywTzvEZGS7yJsUpPuhabkXAxkn9jv2bCh4z4hJr |
| 5G3hZZRkhzkZ6VyWB7UbFHUi5HLe9o5X6TBUcCWQwLBPD4bZ |
| 5G6AUvijXNoVr3wZTXjYMg6xMaii6LirGDsLdJhV1UauVzq2 |
| 5G7J1DGiQCRuKpSBStck1eJRZzq27uBenJTQJuzpLtJPJ4Zv |
| 5G9QQdiNAGXqFPrnhkprbY9iYY2etfbkqA1ZUXkmRSyc5pM4 |
| 5G9WDNRN1ztDWPfcPeGx2Va8aQxmrzDJxGWCugfUYHAunbK8 |
| 5GBqcBdAYSmiLKt1463AGUAfk1eis6yURBSSxtnxrUgfKVJT |
| 5GBsexiz2Cvdh3MsxdkDL5jYL178XwvnvK5LnZbfUA9QZBsE |
| 5GCUzxsXBqKw4mHcq6uXLvQniSb64ogXssKedvtZ5Bq96jeC |
| 5GEvwZvZGLTKYJanTxDcAdwqLzERXiRJSe5CMRrbvWykp2KK |
| 5GGjEWiwHE3q4rdK8FJ3oBEgTjrYuncTzQ8qiidGaBeU85Jc |
| 5Ggkr7PbDv5oQDgsTT6TF6YYJA39YYCHZdGTyDc3jfaDBwWt |
| 5GhPYXN73ML5meMJKoYHrsFGRH3VDH6Set1ENRBKnZf7gyvq |
| 5GhSXup19dSPrJBv6T7aSHD3hwKihSNf4U2aNWmEd188PXTb |
| 5GjiwyFXKUnxNRMsc8SAQGaUxpwW9UczNFafD1SCtKZoMdbu |
| 5GKrJF6m8oW5SrvJYH2LksjtCRZUM6HrkbzuUnx4mc7bANpJ |
| 5GKTAMU9PTVjeMbwiT8i3umtf1bEBp314cFGcGpuTb4Fw3Aa |
| 5GL5S829ACcHHyUPmofuc8rTZxinWxPDmhPR4UMj2ghjyy8D |
| 5GMvp5okVesv3JHxNA21SeFbXtMMtwy6EmPvtN5HpHLUuRCy |
| 5GNSwbXVkk2ZtQrwKSDi8ikAg1dHhtqXgL4MsSuBeCcdkzs9 |
| 5GppZzPjcCSwpxArzCKAjpcEUnRZnLkfAUApmdcFZWG3Cfza |
| 5Gq4EDReGUDnMiY7UN6CAgq1qN2mz3dkVgZN3PrDF9gk158k |
| 5Grk1M8uWgWD7Dm7vvbuAxSwyqR6s2cB8EykgRZi9sCKtrbr |
| 5GrnNToStJHU3Dr9j1G1eExotL68L6fMKgJzLJvC8g5DpR8v |
| 5GrxeYVFV26xM8BKgTJ6LgoYezfBpq5cM4dN4okV37JxkVny |
| 5GRYTPdyq7fizkJ1MwiMdLnBnpetqYH4t6nDwrWSsEFZG8tA |
| 5GrzfEwHwfstmvWUBTi4BEfRWKmgmyTkXynhTbGNh5o9j46H |
| 5GW7F2dB4s9maZEL5mbTie6s4FwgdkKDhgvagdwHNH1EHbYL |
| 5Gy82AD4imcUxmHLK12vbScvS6MvzsS9sPTc17egPJ4v2Vuq |
| 5H1gfcTekfVRM81CwgTEBWJgW2hBqzfeJspb1jYVr3uEqwPb |
| 5H3P3MAt5DESm9ixLarn1VMdGSergF7WbfpMX7MghpZb62b9 |
| 5H3Sq1HXiQepCBdAcgnrKS4BMJzJU1Q1khGQxzRFrdwtx696 |
| 5H4SRrwYfTUXTe41LTGLBioDmcSgTdS7aLLvkXzAFY4aNjNW |
| 5HdcZBYv8Evk8XUbxKPnKG7CmC1odwmTv7NRt9ghCumZ8tqc |
| 5HE8YAYM7cVEBm8iJ7BrAULy535UZaQDgaJbD6gFtiwJAM1Y |
| 5HgAFiXN8HhhETQVJW4E64pn5qki9GJhEZUi1rDX2jYDuNXt |
| 5HGwTFxnH78CcTgKqxVkFe7cQE6KteVkQezxHFqMwv6rT5B9 |
| 5HHC1f96qebeBWiLGj8Uwmv2xD1hfjVmt5P7f6PScM8bSCYm |
| 5HHKVxC3VrBs1h3d4mNtdoZ4DULC2HLp3PnBnJkQKgXnfsPN |
| 5HHMpRWexQWhMMMeV433Dt7ThgXBwo1pjs2M4AcDjUaFQmKb |
| 5HjLts9JryK3huW5MtmfjUSacirbbZHQXmC13UNxjNpQSQmX |
| 5HK7MdumTL8uNV5hMk6z7XTkQA5xDZ15phnngR9aLGLPXko6 |
| 5HKMPQYa1Bpre7fyGxLcnB6LKhTZkY6hMd5vjXFANNzFYLQ1 |
| 5Hn7ed8VRW5D8d6MDz7YRhC2J9fpZX7c3nkafe4jNxZcrHXb |
| 5HNi2g4R7vefffJxrSN3mHXGa96Lof26AJwhoNut86MuBJJv |
| 5HNosDRqJNao5ewuXvYE8z88554ffDpZvEm4KbZCTFdAD3XH |
| 5Hp4X46LACzqDorZkeEgSds4Fqd8nQAAQmftNKvZktn3WPrn |
| 5Hpi9rYJV1ULKDWBYGa74xPXRi7Kaf89eB3PGW5P8FK7trU8 |
| 5HptHBL5acE3T3n5kfvDnJwYHo9UrpB2L5j7pBUKqbfSeBw1 |
| 5HQWx9SXXDUGfLNjuhcYXAwzuKBDnTmvuz33zWZ27nGVYjgh |
| 5HU3qwWwvfKZo5tp6Cwk169AKCwDHugBK2LfXYfDy94KSmmV |
| 5HVcH8j3v4T64UYvRpUTwkDKTR36tpgftg2yF5XdwxvSyLWQ |
| 5HWYa6e1BjfNoGBJWCWidVt3CwJRPFsBuq3c46GLuJ4Myq5k |
| 5HYbbvJ5BYMdFe5fSomWaeEgMWURG6PisraJMNbPTFYqSjBo |
| 5HYEJRV5S13TDDSRKSWUafRsvRMzS4PGTWh5DQwEz2oSHyLZ |
| 5HYwJ2AYfsPAAgecnEXj8qqRLuBmQiqYWmZexZL6TVgg2xxQ |
| 5CPQoDqdzt1ggeaVzuJyK2WYnTV2s7XDoPE1eKSrLVdHrHfg |
| 5HjhTLGk5V6HXuwjpdbHMWUXc5LH3rMtLKpcqSn8Z5x8xLUS |
| 5HnJRCcbFaTjaYhmhTiNavSStkxRAmeX2EiEJq2vSnN5Q4TJ |
| 5CCdo3gfsnjg8WCTChrB4jQKXNncfbSN3H9NhNVqfD7EjNmz |
| 5DqFgUVwGMGurJrJJTbtFA3U6HS6ezomTHnpbREKbnKjD9md |

#### -Blog Bounty (Throughout Festival)

| Link                                                                                                                                                                                                                                                                                                                                   | Mandala address                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [https://medium.com/@gafaruzb70/acalanetwork-%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%B8%D1%82%D1%81%D1%8F-%D0%BA-%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%D1%83-51124b71aefb](https://medium.com/@gafaruzb70/acalanetwork-%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%B8%D1%82%D1%81%D1%8F-%D0%BA-%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%D1%83-51124b71aefb) | 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK |
| [https://medium.com/@Fanniee/polkadot-%EC%83%9D%ED%83%9C%EA%B3%84%EC%9D%98-%EC%A4%91%EC%9A%94%ED%95%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-acala-8a3be713bd42](https://medium.com/@Fanniee/polkadot-%EC%83%9D%ED%83%9C%EA%B3%84%EC%9D%98-%EC%A4%91%EC%9A%94%ED%95%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-acala-8a3be713bd42)         | 5DZpD7NqtPAitsdZVsjuMjyvicTfcudr1oFfHMUUqLhS9u77 |
| [https://medium.com/@nguynlongthnh\_89762/learn-the-basics-of-acala-network-you-should-know-d8b1e13a13f4](https://medium.com/@nguynlongthnh\_89762/learn-the-basics-of-acala-network-you-should-know-d8b1e13a13f4)                                                                                                                     | 5DqZSHwqts1Dmyg4qPQUMj3H2tQVBtWvDJ3hd32gUJTBgEoL |
| [https://www.youtube.com/watch?v=0\_BeLFBqZuc\&feature=youtu.be](https://www.youtube.com/watch?v=0\_BeLFBqZuc\&feature=youtu.be)                                                                                                                                                                                                       | 5Hg96xTCugbbFd55F9iBNofie4gpAgmJUVGd8nRL5vqCPCSp |
| [https://medium.com/@knowledgeiskey2017/a-comprehensive-overview-of-the-acala-network-8b13135ab885](https://medium.com/@knowledgeiskey2017/a-comprehensive-overview-of-the-acala-network-8b13135ab885)                                                                                                                                 | 5Hg96xTCugbbFd55F9iBNofie4gpAgmJUVGd8nRL5vqCPCSp |
| [https://www.youtube.com/watch?v=weBI9tzqfQU\&t=](https://www.youtube.com/watch?v=weBI9tzqfQU\&t=)                                                                                                                                                                                                                                     | 5HYRXR7TC4jkEjokhNzvYup2WcxmejbVNkoQqVbZtaWovj4F |
| [https://www.youtube.com/watch?v=X-Fh04aXYz0\&feature=youtu.be](https://www.youtube.com/watch?v=X-Fh04aXYz0\&feature=youtu.be)                                                                                                                                                                                                         | 5C4m2LpoCEAxmueTWBXs3kka3NCEtgH9TXMqhLpu2vYv9Tkj |
| [https://medium.com/@ltfschoen/journey-into-defi-using-acala-and-laminar-991c168902db](https://medium.com/@ltfschoen/journey-into-defi-using-acala-and-laminar-991c168902db)                                                                                                                                                           | 5DHcRs9udMCKtEmJEABY2HpECyTHHxgLL85pFFzN72SatAoQ |
| [https://www.youtube.com/watch?v=faylI5\_xs00\&feature=youtu.be](https://www.youtube.com/watch?v=faylI5\_xs00\&feature=youtu.be)                                                                                                                                                                                                       | 5Fj8pQ1e7iDfrAvae9k6WhrZRqM4Lqd6Umvk8J9cg1BXcJL9 |
| [https://bihu.com/article/1614934379](https://bihu.com/article/1614934379)                                                                                                                                                                                                                                                             | 5GWrTC5D7FPEg3iaikv8Yp35K1A6qWyyCVMF1GZd5PCbq2Fk |

#### -Bug Bounty (Throughout Festival)

| Github issue                                                                                                                         | Mandala address                                  | Judging results |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | --------------- |
| [https://github.com/AcalaNetwork/acala-dapp/issues/241](https://github.com/AcalaNetwork/acala-dapp/issues/241)                       | 5F2FNhhVeG9bW4tP5te4a7asBJvSHQg31RzkoETLpUN161gV | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/238](https://github.com/AcalaNetwork/acala-dapp/issues/238)                       | 5F2QSwPHobet1pLFTEw6mkcT8bwZdEMmHfBGYPkiK7Pgxdex | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/237](https://github.com/AcalaNetwork/acala-dapp/issues/237)                       | 5DEvvJA5Mz82GPLbf9t3RxWVYX5KfqkkxwJvJ6tmB3e5n5Wn | bug-A           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/234](https://github.com/AcalaNetwork/acala-dapp/issues/234)                       | 5DfNVfJTgpspTA4bz7w1DNJmf4eAEcCZ76AktJonPXUPwR6U | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/233](https://github.com/AcalaNetwork/acala-dapp/issues/233)                       | 5GRbkRH3hi1vbuNd7s3eW9u2YRfhMtDJVVCe3a8M1jvhBuvZ | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/229](https://github.com/AcalaNetwork/acala-dapp/issues/229)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/225](https://github.com/AcalaNetwork/acala-dapp/issues/225)                       | 5F2FNhhVeG9bW4tP5te4a7asBJvSHQg31RzkoETLpUN161gV | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/222](https://github.com/AcalaNetwork/acala-dapp/issues/222)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/221](https://github.com/AcalaNetwork/acala-dapp/issues/221)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/220](https://github.com/AcalaNetwork/acala-dapp/issues/220)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/217](https://github.com/AcalaNetwork/acala-dapp/issues/217)                       | 5H985QyVoRZudfw2p6DvmwhdfYob8LkgK4pCZdf9rnioUZUd | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/215](https://github.com/AcalaNetwork/acala-dapp/issues/215)                       | 5F2FNhhVeG9bW4tP5te4a7asBJvSHQg31RzkoETLpUN161gV | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/212](https://github.com/AcalaNetwork/acala-dapp/issues/212)                       | 5F2FNhhVeG9bW4tP5te4a7asBJvSHQg31RzkoETLpUN161gV | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/191](https://github.com/AcalaNetwork/acala-dapp/issues/191)                       | 5DfNVfJTgpspTA4bz7w1DNJmf4eAEcCZ76AktJonPXUPwR6U | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/188](https://github.com/AcalaNetwork/acala-dapp/issues/188)                       | 5DfNVfJTgpspTA4bz7w1DNJmf4eAEcCZ76AktJonPXUPwR6U | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/186](https://github.com/AcalaNetwork/acala-dapp/issues/186)                       | 5F2QSwPHobet1pLFTEw6mkcT8bwZdEMmHfBGYPkiK7Pgxdex | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/185](https://github.com/AcalaNetwork/acala-dapp/issues/185)                       | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/177](https://github.com/AcalaNetwork/acala-dapp/issues/177)                       | 5CcTrXNHdJUYttyDNsQFDdWMcBPY8YvZF8x6WMXVapYQ644p | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/159](https://github.com/AcalaNetwork/acala-dapp/issues/159)                       | 5HnJRCcbFaTjaYhmhTiNavSStkxRAmeX2EiEJq2vSnN5Q4TJ | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/146](https://github.com/AcalaNetwork/acala-dapp/issues/146)                       | 5GMvp5okVesv3JHxNA21SeFbXtMMtwy6EmPvtN5HpHLUuRCy | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/144](https://github.com/AcalaNetwork/acala-dapp/issues/144)                       | 5FEoLBq9BP8X3iU6iPmW2KWJahcCazeSaLPd2CamVfdwsCc1 | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/143](https://github.com/AcalaNetwork/acala-dapp/issues/143)                       | 5FFCfSJJaVN8WRRNiFxHKcYQh5MXfpFYyVhjrv99Qgvqorp9 | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/142](https://github.com/AcalaNetwork/acala-dapp/issues/142)                       | 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/140](https://github.com/AcalaNetwork/acala-dapp/issues/140)                       | 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/138](https://github.com/AcalaNetwork/acala-dapp/issues/138)                       | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/137](https://github.com/AcalaNetwork/acala-dapp/issues/137)                       | 5HY8hYMttrbm57MmN3o9p5ipF8i7eBjdWw7TQVsecoP7Uos6 | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/132](https://github.com/AcalaNetwork/acala-dapp/issues/132)                       | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/128](https://github.com/AcalaNetwork/acala-dapp/issues/128)                       | 5GHj5DF25uK85M4Uq29cSFVQMRkzHc1RmVXZPW4zf3NXf1c1 | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/64](https://github.com/polkawallet-io/polkawallet-flutter/issues/64)   | 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/65](https://github.com/polkawallet-io/polkawallet-flutter/issues/65)   | 5E7b8rmiWDahDN6ZUNuyqmSirQsPj8PAMZ9CYMaURCjcDEqn | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/68](https://github.com/polkawallet-io/polkawallet-flutter/issues/68)   | 5EnWSikTvi8Y3S6vQ8TM3q5joFe8pCa4LjAbmEaXywwE6ioG | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/70](https://github.com/polkawallet-io/polkawallet-flutter/issues/70)   | 5EnWSikTvi8Y3S6vQ8TM3q5joFe8pCa4LjAbmEaXywwE6ioG | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/75](https://github.com/polkawallet-io/polkawallet-flutter/issues/75)   | 5HWMnApHzkVV2ZqVLjjLzPETL8wwf1PvkFv4G7sMDMWqpHHS | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/80](https://github.com/polkawallet-io/polkawallet-flutter/issues/80)   | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-B           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/81](https://github.com/polkawallet-io/polkawallet-flutter/issues/81)   | 5EnWSikTvi8Y3S6vQ8TM3q5joFe8pCa4LjAbmEaXywwE6ioG | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/91](https://github.com/polkawallet-io/polkawallet-flutter/issues/91)   | 5DHcRs9udMCKtEmJEABY2HpECyTHHxgLL85pFFzN72SatAoQ | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/92](https://github.com/polkawallet-io/polkawallet-flutter/issues/92)   | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/94](https://github.com/polkawallet-io/polkawallet-flutter/issues/94)   | 5Coiddko324JRzZpr7yKMEhXhhmEEZS1PL3bW3zuydiiyj1G | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/112](https://github.com/polkawallet-io/polkawallet-flutter/issues/112) | 5CG4jmkk1neZzbKCeQg7kYv9PMko8zkcRqVvAFzPHuBD673q | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/114](https://github.com/polkawallet-io/polkawallet-flutter/issues/114) | 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/118](https://github.com/polkawallet-io/polkawallet-flutter/issues/118) | 5GsQUJ8ShoFrt16vWLekvk3T5e2tYLTVWN5mHrwthSdxL6Fv | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/120](https://github.com/polkawallet-io/polkawallet-flutter/issues/120) | 5GsQUJ8ShoFrt16vWLekvk3T5e2tYLTVWN5mHrwthSdxL6Fv | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/127](https://github.com/polkawallet-io/polkawallet-flutter/issues/127) | 5GHj5DF25uK85M4Uq29cSFVQMRkzHc1RmVXZPW4zf3NXf1c1 | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/128](https://github.com/polkawallet-io/polkawallet-flutter/issues/128) | 5HnJRCcbFaTjaYhmhTiNavSStkxRAmeX2EiEJq2vSnN5Q4TJ | bug-C           |
| [https://github.com/polkawallet-io/polkawallet-flutter/issues/137](https://github.com/polkawallet-io/polkawallet-flutter/issues/137) | 5FEp7o7MW6m5Tx6G5pGeto9ZQpfHKePVREVkmDxV58ZoPg6H | bug-C           |

#### -Coding

| Github issue                                                                                                                                   | Mandala address                                  | Judging results |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------- |
| [https://github.com/Ryabina-io/substratebot/tree/master/packages/acala](https://github.com/Ryabina-io/substratebot/tree/master/packages/acala) | 5FEoLBq9BP8X3iU6iPmW2KWJahcCazeSaLPd2CamVfdwsCc1 | 1000 ACA & KAR  |

### Season 3 Rules & Rewards

#### Week 1: User Participation

**Duration:** 27-July-2020 to 03-August-2020 (one week)\
**Award Pool:** 20,000 ACA + 20,000 KAR

* All qualified users will share the reward pool
* All rewards will be recorded and published

![](https://miro.medium.com/max/700/1\*yVdIVTMQIPWp8FgCtrT9MQ.png)

**Participation Rules:**

* Get test aUSD from the faucet, fees are payable in aUSD
* Users completing three meaningful transactions will be rewarded

**Meaningful transactions include:**

* Use DeX to swap tokens
* Use DeX to provide liquidity
* Use Honzon stablecoin to collateralize for aUSD
* Use Homa protocol to get staking derivative LDOT
* Transfer aUSD to Laminar Chain, and use it either for synthetic asset, or margin trading
* Mint renBTC and use it in above activities
* Participate in auctions of system

#### Week 2: Trading Competition

**Duration:** 03-August-2020 to 10-August-2020 (one week)\
**Award Pool:** 5,000 ACA + 5,000 KAR

* Top 10 qualified traders will share the reward pool
* All rewards will be recorded and published

**Participation Rules:**

* Use the balance of USD as the unit of account
* Profit calculated as ending balance — beginning balance

**The rules for ranking of trading competition:**

* Snapshots will be taken for both Acala and Laminar networks at the beginning of the trading competition; the total net value of various assets (including debts) will be calculated based on the price feed at the time as the initial balance.
* Another snapshot will be taken at the end of the competition, using the feed price at that time as the final balance. Cross-chain transfers (e.g. transfers between Acala and Laminar) are not counted, while transfers between addresses are counted as capital.
* Profit margin = total value of final balance / (total value of initial balance + capital sum correction) — 100%, all accounts are ranked according to this function.

**The following are included in the balance calculation:**\
**Balances of all assets:**\
— Acala : aUSD, ACA, renBTC, XBTC, DOT, LDOT\
— Laminar : aUSD, LAMI, synthetic assets

**Balances of all DeFi positions:**\
— Acala : CDP (net value of collateral value minus debt value), share value in Deposit & Earn\
— Laminar : margin position value

#### Week 3: Black Thursday Simulation

**Duration:** 10-August-2020 to 17-August-2020 (one week)\
**Award Pool:** 4,000 ACA + 4,000 KAR

* A draw of 200 qualified users will share the reward pool
* All rewards will be recorded and published

**Participation Rules:**

* Day 1 — Day 3 liquidation events: users participate by closing CDP or increasing collateral
* Day 4: emergency shutdown will be triggered, participants will use aUSD to buy back collaterals
* Users who took part in the above activity will benefit from rewards

#### Blog Bounty (Throughout Festival)

**Duration:** 27-July-2020 to 17-August-2020 (three weeks)\
**Award Pool:** 2,000 ACA + 2,000 KAR

* 10 awards will be awarded in total
* Awards will be published one week after the event ends

**Participation Rules:**

* Submit a blog to either [Medium](https://medium.com), [Bihu](https://bihu.com), or [YouTube](https://www.youtube.com) regarding the Acala Network.
* The article must include your Acala Mandala Address to receive prizes.
* Submit the link to your piece of content to Acala [Telegram](https://t.me/acalaofficial), [Discord](https://discord.com/invite/vdbFVCH) or [Riot channel](https://riot.im/app/#/room/#acala:matrix.org) using the hashtag #MandalaFest3
* The content must be original
* We will judge both the **quality** (how appealing is the story, idea, perspective, insights, analysis, etc) and social reactions (number of comments, likes, twitter or other social sharing, etc).

#### Bug Bounty (Throughout Festival)

**Duration:** 27-July-2020 to 17-August-2020 (three weeks)\
**Award Pool:** 10,000 ACA + 10,000 KAR

* Please allow one week from your submission for our review.

**Participation Rules:**

*   Find bugs for the following two repos:

    [https://github.com/AcalaNetwork/Acala](https://github.com/AcalaNetwork/Acala)

    [https://github.com/AcalaNetwork/acala-dapp](https://github.com/AcalaNetwork/acala-dapp)

    [https://github.com/polkawallet-io/polkawallet-flutter](https://github.com/polkawallet-io/polkawallet-flutter) (Acala part)
* Bugs are judged on significance and severity by the Acala Engineering team, and are awarded roughly based on the levels [here](https://github.com/AcalaNetwork/Acala/wiki/W.-Contribution-&-Rewards#runtime-bug-bounty)
* Please **include your Acala Mandala Address in the Github issue** for easy prize disbursal

## Mandala Festival Season 2 (Finished)

\*\*This event has concluded, thank you for your participation. \*\*

### Season 2 Prize Giving

#### -Running a Node

| Date  | Lottery block height | Lottery block hash                                                 | Prize winner                                                                                                                                         |
| ----- | -------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 05.11 | #251,219             | 0x01df0b375cad466998922dedfbb64117f2c35062c3d74324afa472283df0ca71 | 5CJX5TSEokNNvgN23BKDLg5wPrC1hjmNb99hwndgEJK5x5jK, 5HEC1VAU2qMrgEv3f1zbjKQuPHPpYzra8hSaWVhNCe6yTMVt, 5DAFv2ajCh7EV2Y6Pk8TuDFcF17GDE8RXk7jfWUnjCaCmxJu |
| 05.12 | #274,515             | 0xe7b70e0e72b3ef9a2fcc804842b89a402ec1338e7fcd0df50ebb6636ef490447 | 5EPMpXd7Gch8YQU9Q6efHKRdpgTfQ3kSLYKBRiiBB6nWPUHn, 5G3zwZ72e6rbJgx6cfmpKac3yBPsLM1hC173U6XNeMexqMhS, 5DAFv2ajCh7EV2Y6Pk8TuDFcF17GDE8RXk7jfWUnjCaCmxJu |
| 05.13 | #294,600             | 0x70feac7c162306f127afc3de785c842f3ac30f23628ba619d69e7fdad42907ff | 5C4rHmiSuvhtBbNgM5SExDavrLKKiy6cj69XAXiWkA3GXWqM, 5FpzPB2cKtY8pPwrezs5AzxtJE7tS4a5yhY5DzGHBo4ND6gb, 5CMW4BiVqfJ9Li5uxiG1HnzqigvcZfWbK8pekrUp6teHw7GA |
| 05.14 | #316,704             | 0xb4e22b354bcf958dd6dbb322b101e3cf619d06af57e99aee124de26f466dbf00 | 5DAAnQ8fmLHVgyNYdEK6fUDYfBsenGibK7KRBh4EsPFdHdMU, 5EhNvGHoHZQQ3X2JU7tAqcWH1g1rkaL1Gy5EXKZv9QHcAmX5, 5ExgRHZ8cuWh4Dt2V6Ydmsf2XAc87WeXC3ZorYyADNEff6RY |
| 05.15 | #336,267             | 0xfbdd5cf83ba6acbbb333848e9e9a632cc709618422f2604ea6c6468fbf599b97 | 5H6dTUCK6mAdEQFngxNhN6vQGtMGrE4zx9mNG3Z81Fy5mpPB, 5CDA3teXpfFAqQDTebUXiZn47udHReALJapzcteBPPSHPFJf, 5D1oMcT2murodKF45Bb3dRybrNnjyPpwb667wWmdYMoVKsB1 |
| 05.16 | #357,984             | 0xed7b5b24c2db151deb92c29cbe890cf7324145de776f711d3fa33abad9247a37 | 5FUNFsUPuazzyyVFUewLpJY2dDtaLGZMycVk5MNjNrXQfAnc, 5GpTcbzycMjynCSfC7HgyT62BKhk897sa1dWroHLo22AmirN, 5GQk464Cr423dbFD3TjUAsqAvUpmBJhzg4m76vBq1u8bhdEc |
| 05.17 | #379,449             | 0xd22c10553f9af9be303d0b5d8a8924bf41b6a9885d6106a464a2a9c0e93aaf21 | 5HijXXTbM4GfcdtrGA3y1y8GakoHm8RqzoSkaJTtnqMDav4p, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5CD2jb9ymzGxNyv8bZUzFv1MxG36rKgM5V1F5hooa6Q6CNur |
| 05.18 | #398,280             | 0xfc9eda6510bdeb2e8349efc91fd889ff8469a72b799f110e569b3c77dc3006a6 | 5DWdaeDayQE7atntBewsLoyMpZFEeX5hcjR5dMKPrXtkDvAc, 5FcYmJPhLHVt2oo6tFxhS2cht5gjyTV1gEFohWPRGPCtD2Am, 5CGDgQLzYTxKcHYb7C8uNakKVsYz4LRdHuDVwrXJKnZdra3L |
| 05.19 | #417,178             | 0x6f5e61198ee7e0c4874dfeaea61033a772e4a1b717e81626ce2434e5f7544500 | 5DLYY2hUHo7pR7dXff7feJxqEbR4K8EpkxjfuFd9w6wj36xX, 5FhM6Sgv37LBihxbtESj4Fhe7xC9mNxyhDYgtnLEMsYkoCVv, 5CUqbTeyVr3DdESFLSDecjUgXFBR1Mo8HfnosLrmzzhpJCUv |
| 05.20 | #438,953             | 0x0b73365648fca64af828acd2c67e67731b64ca476a10b80dc0b156101fd6c178 | 5HKpMk2nVnQ1JXehM5A9vR9ZkMFbKY2KuDsFGgknqE4PStWh, 5FcYmJPhLHVt2oo6tFxhS2cht5gjyTV1gEFohWPRGPCtD2Am, 5DfVaYbSpA8gFheWLvte2wrV3HhUBdvPn6kTe3QX3D6zUeme |
| 05.21 | #460,623             | 0x81a45c54ce71d50b2ac04e21290d2237f2be60e8fbfdabcaeac161ed3bdf6de6 | 5EyM7jb8Cdw85HxCzZGivBhVGrZGoypcdbR51FfaAYaNdZxC, 5GuoZ4eAEHu5qjPk4ZgPZdVEVKA1yv8iC4L2bqmcH6E6WGC1, 5EZQyjBecaRU1J3rSJ3A6DnX77xFivcTi1H89EVs4HoXVVe4 |
| 05.22 | #482,021             | 0x43a578f853781bb3bbf391f902979567c6ce319bc87871f33bf38e1391e182d9 | 5HMmsEtcULw2Ki5vHLqCRhf7anrrpQXoEdsSc1JVyEesyu4Z, 5HeECZXW5ZsXoM86nbucMGQRbW97JaHi6cZfVm42seJnhjqe, 5HEAjRVcw4ojt79vBYFUZoWZEWgamnYHpfhfr5z2uq7mEnCP |
| 05.23 | #512,522             | 0xfac6d697d41b7b449001d31e537fbd4f029f55dd0b0efd9b89fef4af14d55c34 | 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5HK3SAatYmuGPd3Zrm6GS2zXLbBq2KBxYDi9jMEHhEgmM7vK, 5FCLJZNNbvvmttq8pmxtvfBryEKDBSrfKSxs4b52qoEZUija |
| 05.24 | #522,939             | 0xeb2743133829e39b8c309144d9d5cea80841eb91145d0617787c046649523b46 | 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK, 5CAiDSjAy66z8n3qGdcdmXNSWm1q3t2WrPXKRJDUGa3MdNYd, 5GvRPmPv31DVdorQqPTGYNK86wFFyPXJBzobmHN4FJgAjjmE |
| 05.25 | #541,295             | 0xb4691171a4932422ba6cc081cdb71b6709e5ac7559059bc71b7e3c135ac71338 | 5FCQkR78xQeHAxDJedLKEvxqQXFVbQQMU5i3wjcPfmQqwq1m, 5ELbRUyqUbiDei3F7kAwofGGaQx1NQEaQnVN1qL11uyZUCfh, 5HKpMk2nVnQ1JXehM5A9vR9ZkMFbKY2KuDsFGgknqE4PStWh |
| 05.26 | #561,661             | 0x9f0ce6d3bd0c218880696402b9eb1493267df716d731bf9bf4d723813a16590f | 5DwLnHrztS4zgvU2kgvfhPTNRM7GimfqqY8eGjmVYrEhQsfr, 5FqNMQqhaKPKc37jeFkPEUT5UhyArrDsmmkiv2GNoopXXp7M, 5G1QqeKBvNiDRJDrQwbmcAJTmBdPNPrB3JRr179hkaLKHkf6 |
| 05.27 | #576,656             | 0x21845acd7cee374dbb4d865dc026717cf655f79f0a9cfe630458bf1163c6cf02 | 5GCH6eBD7M6UFZPBsfPEYoUNyKScX7HfCXbDgsvVfovEaFj1, 5FRDxPezSMQ6VCpoxFTTH1rF4i1mrA9H1xd5VmAKyWPjUWFF, 5G94Wzuc5EBemwKGnBf18JwxUw8QtenRkrEiSbLCaMc8WFpR |
| 05.28 | #594,336             | 0x3fe3144036e6ec66650aafbb1b83c7d90859a361167e4f285e0538220a43e225 | 5FcYmJPhLHVt2oo6tFxhS2cht5gjyTV1gEFohWPRGPCtD2Am, 5FRcBR5j4LDToJsYUqWBK4TBtMbrMZZ922M3NEFw3zMH1LeJ, 5DWdaeDayQE7atntBewsLoyMpZFEeX5hcjR5dMKPrXtkDvAc |
| 05.29 | #610,930             | 0x2a7043aeaaf8cd83fbc37a0041f0506b68e6568718edb3ef7aecc5b983ec2287 | 5EkbLAJVVgt4wKAU6KAhopyLpyLWMQNryWwKxafic45vgv2q, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5HVfcWDci33Ekkg626Mh7QjEaoRZRBByxnLo4R2Uss6z7Woj |
| 05.30 | #628,500             | 0x396e21978de081e0ad9e7a2c43df77d4420d5bddb7c28b5a54493ceb37c2a285 | 5DfVaYbSpA8gFheWLvte2wrV3HhUBdvPn6kTe3QX3D6zUeme, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ, 5FcYmJPhLHVt2oo6tFxhS2cht5gjyTV1gEFohWPRGPCtD2Am |
| 05.31 | #646,984             | 0x7578006bb50d72723678c0243fe5d2cf65808d8f78291d2e25bf26345ca47ed5 | 5DskzyXfQsxD2vJZDzCfXFnRhicHfAtrZ8qcM7BHsQFg7Wrg, 5CGDgQLzYTxKcHYb7C8uNakKVsYz4LRdHuDVwrXJKnZdra3L, 5G99mYA6WVjRTcpBFTsT9U5s2U7wknEpkqSkMW5vTnjdMCao |

#### -Using Acala

| Date                    | Winners                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| First week (2020.5.17)  | 5C8c6AkPdo83jvNvvrB1jnTi4rfkuLp7H5ziuLTDsT42gntN, 5GKwogqykym1Tj2X8qeWjW1NsrpaYUCWtUAXMiWNow9X5qYP, 5DPLDMRLoJVXXH6bnVKFjBoc52yyJeweEqD2s9bkFCAFy6k7, 5FgZtjHpi2j7kiPFoWWqeVNiA5mWM1G3nTbFkMqWh9muCpMB, 5F6ZYs9qBjjGC3ahnpTWJdK9YrsMqyvVQNqKaSzpWyWcq7Kw, 5Cni8QpH5uoxCrueohD1anzVy5tHsGzRzcgEh3KnpoAjyL5p, 5EEc9S8WxDJuSDWx3DhS1JShkmvf1Azvptw72WFV27aVgYEe, 5FWi6DKmWkipP2QmPthPkbSQKgzsV3svenKuHtLLsUYA4jUP, 5FTmLoxxwo4c8UPRsexFeh67rvLKRshMbAiNsSETCVf1KNx2, 5CSiUcV675pgF8GEqmE8aMHaaJ68LoLtQB288BPjWHYCCWi1, 5D85GwB5aHyzWp7aUNqx56SNLRHfEDxekzM1XjcXnqXKqDGg, 5EkK4ckcii8Rh5wjfBxFZR8x6zXZsqw8FvztXUsxkoYf5A8v, 5DJ3AYyRDhHAtkNo5KquSyxKE5qh4gUTd97uMMCn1NvRv2tr, 5G4HnA5bkvN3Pp1biZ58p9yG913TPhYScjkqCyQVxSrtNhe1, 5D2KBQCSN9mYML11QU8d5rGFU1Ly1qEBa5QBnnUk2aqZ5HKL, 5DSdXBN3Jhzeh8DkPNP1nXtH8rYdMB5SQwbQbaB8RwYPxQVv, 5Ejjadgnksz8iUcsFVNvfn91MQUHFGyfuLyLsCFgpbkfbmnb, 5DqLuSt3p3tqdpJv6HeNjn9Dm7DeKp7ymVDdcC7u6Hunc8UP, 5GbkWuLmBr1uK7b1vUZYmoHGTJr2W8EzG9bfD5zoNFi1g5vg, 5DPAk4ap96Mztkcx52hHsRLbNKkusuDhSVgBEq1GVXFPp8B2, 5D9jCc51fi3TnLYA8XMVF5aHmjm8G4UUmMUerXUmhQSuPjcP, 5He3JU93f33SB5RmjarNjm5b8QQDERrJmZnhftuEmqkh7SXX, 5FumYi98H75nuw53eaxi6cUYTWt6zYWy8mYQTADNxx6degYj, 5GKHovanB2trzrroyuBDnHTa5Z5QzAcEiFPo23gJE3SMkN5n, 5DMHsL9HT9sagGWFAXzsJHwJWDaZAi6dwo5Mg71pmW3cdgKA, 5GjjWFCsotco2y2RDPiHb96qGanksRKBbQmYap3rUnj9ZLZD, 5Dkrg1YhDZLNLvrDWLJYcwdi8xiWkS2uHHagH2yMmr2sVhEJ, 5G9yaGkUzFi79yAtUBS8KWMSEWUYj6FN3H2UigdGdqEqUDMw, 5CUxRHi1NYfc6B4Hf88oZdXpKsLq5dPRasc8TkomGcXiguY8, 5EFTR99QgWBBFtnY9XF3K3TDmy7uqnfMpo2RKpS3tCbFF95y, 5CaDxH38KogG2DCXJCfcecxkgWhsiM2DZPAnqbWnBzS88iKu, 5Hoz6EgGGKFx36ic1nRnTRNmGj9Kg4WvKKjoK21pJxcDwqZ9, 5FCarHh46ybyE9uBezdXrF3mheLPPyn7t9kE6iq4yj2Qj7bd, 5GbdanEy9SpVCq2Z1PykwGzNPhQL8zJ1bTnMoWtCk598w4bn, 5HiYRk7cCdzDRNECKr5oYJ52qnN5fEQxNXeGMEmScBAZWN8E, 5EvsAYYt3thMinh57b4Yaqxs5uCCHgfCBbsckD192LmYJEhm, 5F24ZKo2vdChyHGaCYQHRJFt9i2jsZVKRiMrLEhefBP2tNKJ, 5CigNmZQhti7bjFAonyb4QFhryiGUBajtk6qi9tNzbWaRnRH, 5HQUyy93BQn5cQPK4ZFCjLNSZhSGesHiuHayvXxD7jThoQcT, 5CFWEetvgMwrD3DKAWTx2GvzGQAp92HXrmUQ5ZWdFJugMEfY, 5FnUeXPVbH2FqVHB9VegSY5QjAc42QYPdkr9fab5KvhRUhLw, 5FUeLM1AnSwH3gHAtbyY8FKuzh2URgFr1nvVZUipE4iA9H7i, 5GCEaNUM5MPtM1axQHcf3uL6GTArQXCJRoLdkxVJqeSrDMQc, 5FxxMVNbccWAmTAWPfBTmJB4DM7bEWNLRSbgaC574wkoDvcW, 5GxsGcDPdihV74hzcVhJ9ELP3JxxpKXaYeVRydUkZ4ZBabbM, 5G3z6p2wW1HV3f2JeW4PhGnVSH8VEzCfdBAzuafaEg6CiFL4, 5Da7gXBqzNax61FPu4F53GTCnVippegmRK96d5vs79XUoqNZ, 5GBhVZpdwkrmEneZW85TWYTXkvZau8q9eeB5EdpUHwJntTgm, 5GsqVoRk22G4b4K2fPg5kjCU9ABtcJjjXx2BvJyMrR8qdh5K, 5H3rq3eR3gwtAZhhctacokHZWEdPMi7jcPoJGPGjKHgCYJNW, 5DySCTo3j5EHqT2gAHbBFJKNh5UiCRKuWJAJnP6K2F3DJjen, 5GEyLb1dXb4AgLZyhYUTCdYUSGy9ASezMPQTizBXgmi5g2ru, 5GzaXMTKvXMcPCtDuKQFjniFpqF8DKNokZV62SM7yvkmZsir, 5Dc6tADJ8QQV1cT5CLBGjST6YSrbwQ9P7N58VMDjbyvF5HLN, 5Epj7TddcPCj14WfaHXwq5Qfu479XxdBkpKgQSSfEQdFC5V3, 5F9uATGtQairBzbLRW4jjNucCrAVCD74iDHan5Z4wMLjPkoR, 5CwhYMf25JSzF8eihpJHLFKq6ZNj8iC3vHyvNYpDxi18RGC4, 5CWzbY7U9mj7upk7ZSfWYLyRichRuXYWJDG41HUABxWfujXk, 5HePbkgwiyzMhTrcy7Qms2vJ4fd1u96xSyAWw9dcFmZTZaAs, 5HYVvapt8PZMnniBTHKm8iCkV3F8q27cQZf5eyPdXLQDissC, 5DhKbq3xPogHtt1qq1H999uuxhEcX649t2uF7TPswjFjhbGc, 5ECWJjN4HryfcH4J2PKc5jVgnuABm1yY5oGvudG8jp59wcVP, 5EHbWxGygTVivzJWkMz7GcG6dkKiSc8qx58CEzP7TTPcDHQx, 5H1ea9WWJeTDLnMjcZ5eQFD6Twybnt8Ug3aVVjWGac4jwf78, 5EbzbdMBtNim5766siKc7BXryMBmymedQAk2VTGuMpNnj4Nv, 5EEiiSW5oeR1xgiQA8qo6FUTr5595Zkm6KyMBKUJ8TmbYFHA, 5Dhz4kfSzC7VNxmhgqYBNXYnTXNfrx6t6qD4KG8Wob1A1wPZ, 5CA4Ty5nhhtoSuLF5rM74iYq1uhTBDJJNACYwpVgiMQh3okc, 5HmhdvsHbHPJkAiWDj1WqK3X1CGwGDwUeut1ikwfuQTRVQL4, 5EU5Js4YDqUxo6PT2xsCvnAiicparnYzbRsPp6tdrVG36Nhd, 5EWkyJ5APc4CTfQxxxGee7f315NSsi86zH8aG8d6k2L9ubs8, 5Fjsx34RQ9Y8icHXVsS8onq9s6gJtybY8ETHZpvhkLioWwwH, 5GERE35iVpdBs5KE4GUy9TiNwcjheZkgBDkaEnQn3j7W9oTv, 5CAYEubLBnqzhPtzYXp4J6a8pdo7LKMN5Y1xxSYnPNed3mkX, 5ELHtAvB9SeM5U2RvGnntsTQFpLzpFNiDytyyJreDpwsM2Pb, 5FdyvmGABLnsPAKsf4KzWYmPf8BQqxNK3Us1TSsvngwNbpku, 5HdWuHjkavLpQwZSPeam6zyVTLSEgh5XNJRXW3BUBdPgU1Ga, 5DXjFu8qgmPR6VwoatoB27ZAT8FPcsZsMUyJuxazg2iZ182s, 5F71vUbdRpbNojgetBr3U2mS1xE9TzpyYKndqYvRyq1Nz8qz, 5H3h3BZxj9S6pUP4TVaQShRRM3qfWpR9eUMebXjt3gcoFM8A, 5DqevrgJrQb4QQqMBN7xqghcZyFazjCMKhiEqHh7zcjYnopf, 5H3sumzg2W3x9uyS1JpgWbU8MR1sqodmCa9f1duLgEUkxMZo, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5EXTTcfmLBTMLuzebPpUUeCPBjXiTY3nJWp4APPiErZ5GRkR, 5Ck8bzyNxZxG1MxZik6HmnjrW78NynQkzzxd1QWgaBW4mDbK, 5FnfafKgb9xkqvTKzyHdCGf93aEtAkamXxDzxAQW9NRyPssm, 5GpE8hCoAdyANkEyFvVuDhSRAoqHK9fN6kJ6RFrdzZaoEUTJ, 5DD5PjgMtJsgbgaHfFWQ9QmuzRp3mbunp2LJZWHUcM5Jf2XK, 5E9UhVxfgwAKJfqU2sCDtg7fqTPLHiUegH2gaKkVASA2BYAP, 5Hh1jyjseRp89PkxiLzL287egevzuDCKbSfsQQTHgnTezo8h, 5DxuG7ZJC4wYA19kyFFpFn9nNbk5UCWgZt7yyLSVBHYoWWkd, 5G1USqv3JviQUn6oyiwXPSpUbWaSgziNaYUNaJj3HcvihVSL, 5ENqR1WeB42P3YYiokQ5SMq7tUKbTwya1a6mV3o2Z3s8ogKB, 5EcW8G83Y3QqgDUutQ2iFBxAf7hUmw4Thetu2tVwwNuxhn7w, 5Fni9NWhoPms2vxRdn8manG4zqaRADvkwfHvSB3YrUzyXs7u, 5DXgYEEjLSKMKmNtoqFFyWiJrcm52BAAeue6bECymPQ1k4R5, 5CdPdg5CjdpPw7DDsJQbbYGaAD1bDEcQf565QM3Aq65rVD9D, 5ELLRWQ7TwTQmJJp3dbKMYWNVQpXjMc7GAhAJb2m6KLGoMg1, 5Ccs88zWQFZbX2yzJ4xWp6PXav6Q3PtqXxH6KCL3MdKARHyL, 5Dcxhmvr9gExJBAAg8LA3Tiz977EEkkNafom6xBJtp26Yo8o |
| Second week (2020.5.24) | 5FhYsc63qoeFmZ6wPEibDbtyVLi8vntgmGnwXmZSNPYksVhV, 5HiomKv9wz5qWdVGqgSN6VQEuKPtqUZz8SXc3sRWvVKKsJAX, 5EyfkCN8yNaZmS4ArBtT5XKSV6euE1prSTeDuoaH2FqToCeg, 5ED81iwyeEwz5XR8QT9yVGsg9UHx9enJ5KodcCgBfbCsBsV8, 5GxFeB96U8Suyvh8ed3dUMxDBnuUv9AytzwWVvZeq8BGBwBg, 5FehdfqjtCYsn5T9jnRYiGEfjdQJJCeSHbrMr4HAgSibVbk1, 5ELJeJGzihKYBjDRDJVPvVKDsht9F3nuoE3ok3dzErmyf5e2, 5CwXXvCnknjixLYEAMQayN7nKqWtTkvT5jaURQV51cNgA9Rf, 5H3rq3eR3gwtAZhhctacokHZWEdPMi7jcPoJGPGjKHgCYJNW, 5HjnLDUxd5KjxyjHNQYwpAoQb3QpHXZfawD5ctCRZLQTN5vo, 5FJ5jbfH1h8DuYJWEVUAnC4yyL7dZLz1GGsBXmjjv3T2WoLC, 5FxzuAH9aQMJz1YxdcRKy75GgrbWP6FXPR1skBGN8wj9QWLA, 5H1ea9WWJeTDLnMjcZ5eQFD6Twybnt8Ug3aVVjWGac4jwf78, 5HTSJD3UxqmSJvKzggiCtjR82GELd2icdyDmRkjGkVJpDFsY, 5CAst3Pzo3P2xZSuGYpcfwhzafqMyZbtbuJD9USbAhHAfR52, 5GQwMYScvZaXzbq39T9a6bd6wcQbh9T1X6L2AtAQvbWnPFwZ, 5D4suJNFb7DaF4tCwCaDAHTdivRq5Wqoj7s1MBQFK3aFNtgW, 5DZius8FMk8LLrLN7UG96SXGRdr3eSkKqzYifjnKZ6Xn1nX9, 5H1D2x61wsjrFgniEhbTMu5NtkPkdAnDjzpSqmT1av2HFG2U, 5Guj86zqCChEX7jhxQaHzjYLbjnkqCZnV6UsUJNhbFhupxUF, 5EqeYfFtj8udMEpyT2WPmS2g7UBkT8QBMzV2rKNemTz48b4A, 5HTZ4yPDSN4AZNH9BnFscqcnCeMryRAQRiccmKCDiHz9nKPk, 5Cow2NwWygaDnbPzMiZoa2dHoZbr16rH6Rm6VtiFiDUD92zr, 5GHdTHZwA4tZgcLRZ9f5LqCmz61oyPxW2q2rdz3vR5nDx6oU, 5GKwogqykym1Tj2X8qeWjW1NsrpaYUCWtUAXMiWNow9X5qYP, 5HHU85GFqJogMCFXUQEThdRJxs9fgCn4S8z3b1TsCYXT8D2V, 5DernvyaSP9UUXNgzNebTCjRFpDiakL5MvNfnQM1pnMhgXoo, 5DFZAuyRSBY2kqsT2w31Uyt6Tjjd5FbWJBxowECNH9v2eypD, 5HYopd7z6p9tcwpFXVWUfUakLHSaYTW86mDRQQEuJLys1wrQ, 5DZJdAZT89dyp1umqtkVKmmkbZAf6iqS8Y8DCHgEMosCmE2Y, 5HDjWJHPFXowWcTCjpThV64ikGTJYFmN2A6x3tPq1hiCWRS5, 5CvcAz6z3g7vLgZH48764DhsefZitC6XMF8Diz3tGhHA4xDK, 5DCGz9hd15eB28MSGcosBygzYVGi3Cz9KZBwWxu7FY4sRRiw, 5Dhahn4Wnziic2gExmc3qqiuy8Qvv3xTY7BaZZ78hU9a1gk1, 5Enr3rzwnRhhWbN3tERd8mcJggpFPFceNHMYpiJoUyUKdjUg, 5HmhdvsHbHPJkAiWDj1WqK3X1CGwGDwUeut1ikwfuQTRVQL4, 5FenZupEDDUwKrV5U3Drn2NKmqbfpJZ1JapU3YTdoKqKR2m9, 5G1SCFBsKLmvNX4u7u6U4vRW8cAk8xcztoDy2Wetd5UmwUXi, 5Feo42CrZdrj78dr12FXZ7kTC3avura2UoZ8Ba2z6Yd9Vn7Q, 5CB6PbeoiecFstKoepMY6CBUy4nyGt1fsPZZKR6uAQ1xdgPx, 5FxhixBYikArCWVVdrZeh3R91MACmHnoJVdd1gYkoAWiCg8Z, 5FKaDvg7SDwCFRsqowyN3TSFNRUFh9sfjqPaEGZfxFGhoxx2, 5CM486QrHrqBKa1qTafUaouhUzjhJfkPWy1cDwYrE35yrVSw, 5DnogbAM8JJtNPqWcCDQEpVFPQ98KXSaQaDNxG6QMrnv3eWD, 5DHgCdWeKRgtKm8As8u63Ju5j1xBsixG5DZd1tW8BFyqizSy, 5Fe4ktn5s58kptS4o9a948PkYcz2bcMRnc5oykQSFXimqZ1W, 5FUb8kW9oADFC8g6E9p2hnKv6bZ49LxBiYoLTzjxS5kyHnd3, 5ERpya8izCiHtusF5cYhPbcNnUCaakXW3bsjLaBCG6Hew57H, 5HGhQVraJnQiFvT31VpLMT9r4EjoKnyD4uNgCuNz6t8FnA6j, 5HfxXr4rVam6iZdLYh53rxXr9HR7caTXWku6fFrGpovzYbxL, 5DhzGLGng5eSwBwqqFuJoEDwzSbvUzH5FYASuyU5wM2nPGUa, 5CPxLw9wxFNRG7BEC481cjxQPaMi3K6u7feiN5JA5356Hqco, 5EpjFHQSm76NVWgzBRQjiDjgqBhrUVVj8NHKnWChZPc5fGCD, 5EykxaQicsqV5uDb9mkQqDBPXVeXz3Q6qwz12TaRDwrQTmnZ, 5EX8im3fGZuNBzLsRkjnKLZ2mCo2U5jBAxdyNJoMRzUutrim, 5Ef37EvhzgPipLy1xBmam8uZhxj9muwqZf2wxACfaqTNR2jm, 5DtXfXu7CLG9GMx7vzsmWShCZ8Hjy8RsXaVTk9Ca7hH5MU2k, 5HYSDShKetacf2yQ7NSM5GCfbGZygDoev24BcR3HAYGmLkYj, 5Fj9ZrmsmEDHCKkBwPLd6c94tPqrQM4mNrh9McvShRQr6E8u, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5CtSTnyEBNUXQM7rgCVG9VrAHLUSHgiFx9R7NoJBbZWepFyf, 5GsWU4dVFUESyXr9AjWxZ4hWEPo4EvFMaAJr9dH6tT9NWQpF, 5HMmsEtcULw2Ki5vHLqCRhf7anrrpQXoEdsSc1JVyEesyu4Z, 5EkS8WnDioUMWrkFKFq3E51tJSTq3Jbxq4CBtxa2nXxsYbCN, 5GNqaqhFJvAJBuk9Vz6fziBMavZF9QfPZNX7X57u2zZeRNHy, 5EEc9S8WxDJuSDWx3DhS1JShkmvf1Azvptw72WFV27aVgYEe, 5DDHimfpk2Age8sAVepgjHYHxbEbvNpMmuuEqf3zRi2Mwds6, 5HE7jgSAS9dt9Q4QkqeSkKQsqCdmGpEP5KVyn8tnYDHv5Q1B, 5EeaCCkUMZE9E6tJmeZV9t5NGGX3i9NLQgrULCUgKk8eZrwu, 5FvJnChDiATr7smrwUeqNCvQvp5xTxsZorsoNJbmYXGwJcjK, 5FWvSBjMD4cqwMX9K9VkccEvKcrepaYF7MkhNAQv7b4buxuo, 5Eya4fKbVPFLSXjt3CLAnSnMRvyda7jk5T3cag7QbkfGBVGY, 5H98YrwQKBoxUaoXDiAgPLG5V8FuiQXH7CiAbQoaT2j3D2k6, 5CSWAuULtWgfJTVGjShiZzuE3Bi9EigiMmcXUbZ4a5LaWLnE, 5GbdanEy9SpVCq2Z1PykwGzNPhQL8zJ1bTnMoWtCk598w4bn, 5GYvrhWDfcmcZz7p8pG3EGVDKjYuKY4vHrrLU49JRhA6jdZr, 5EUudY9pLJ17acK69CoeP3x5DxF7b1euinNZZFfCDeB3vRKy, 5ELMrqw2pdr4wy3bH1U4ptvuQmZoWCeNBjJJi6iUZCpDxJuk, 5EeBjzorDWJfM3YUmECbsreDfPKi2jFMRg9QUaXvL4qdUKKM, 5CDcTTLQ4o2hnJgHebdgqpga2gn8mpnVXseCNAyqCaodM91m, 5EEiiSW5oeR1xgiQA8qo6FUTr5595Zkm6KyMBKUJ8TmbYFHA, 5FWLUKfzn8Dd46FW5q4qF3QTJp1hGvkU1SLi7BiudbW7iUSE, 5EL71n847E1mtdrhrhEWc81J6eLXpG6tGbjAq2yg2FvFqHDS, 5DU9oGiGDKn6ZCQgC7VTUH98FhKpSH8U5WXCqo7k3Dg11EJV, 5Gpnb6mfWhMcxLRjG7a7seH2BxVvGv9Lv1XUNUp84MaqzQUs 5GsgGaybXxXhyNdHyyGeVLAAwq9cxLaLZEiP3vBV24cwYuBB, 5EL36duLhJ7LixVUm7x6wG1a1cFMn5kKgPNhXNPH1miRCYxw, 5Eh7gFtkfCnsE25fGvhQThUAs8CEWKJhhUwgVYV2RwEZ3JVb, 5GsxWvcx9EvV1S12etrjN1cJhJ8PJrejUoTZvSi43ArD6U3z, 5Ebq5qime1tyt8XCSCLdSsfiWXtQ9fYb6KmVPrUL7RA7Xb2j, 5DRSmFfAqKVg3P6nEhje56gas9BHUC8RGC6SceyTzL62CZ6x, 5Fbzyxg18f2Ec2ZGB1GaZmndYwmE5Excvfr4hTT1RckXeDuZ, 5DM3ToUQpsLHJHj8csTUUzVrMx49D7h5F3zm14yYwTrmAXgk, 5Grjq2KK9Z36zZStnhz1H4EhFQnCaW6ar8t8crPBRM5TTZNK, 5GxAb7EeTGv3KfBfwhBGhBbASdJodKJwYoh2GkvminpofGvL, 5HEn1YtswEWpqpC9E2E21nCtUqgdJLQ1UfErVombGfHnKaGq, 5GC9wpaEzS5qUgyoTXAFTr4LcdDexM19bKp1gCvaBqkdX3JT, 5Cm6HNGkDAEVs1C7tegwK8jymrdgtbFQ64QwenLTXuTcUNhb, 5CYC5hX9kqgGMTr4bXFt491f9EaqNYetL7S35rGHnyd5bEEf, 5Dhx3TYcqnAMBUZFiDbcitNXLgaBeBWPk2QqrLHpTEFd91fi  |
| Third week (2020.5.31)  | 5GxE6K1W69b6p85ZBPsi8oHr7oXdTmWBTmChJNw9yhJ1p6Vi, 5He3DStdt3FM7GtReCZbuFBnwyiEGDqM4Tj9KbcJRZVkepNf, 5Hdvy7RP3Jkqp6NnCkH2Q5xjuxcGFufECdxdoT6Rcbizkp9X, 5CUiPq629ehrY5342HHg7RbhjVS5weGXAii4NBUXkbkQf5mr, 5DWog7SVoeisLBs1HerVsk4bM1PWKYrjaRYVFLnqsMoC7gF3, 5Fxhj8y9w3NTdhzwGKJAq53Vip7KW1Rnd9QdJwbcDP79Tr8y, 5HgU1yCa7JbxzKMbRFpQSyEAqaB7fkyfBSUSsqBGRmDEE4cJ, 5G1xzNiR9iasZrdRzkaYx2iLobQL7SoDajLkQF4AagfUngXv, 5EPXEFo5NKWC7smkNEiQ6H1DK2QiuJTv5km6ir1fUv7fk5PK, 5DnN8rrEqzraaVtpqFmk6Jm8C5KwFbFACwFbfGYWV6xg21f3, 5FWBPayAMieVEZZBwn2C4HuPed9eQKHeBzXYCx3TTQQSm5r3, 5ELJeJGzihKYBjDRDJVPvVKDsht9F3nuoE3ok3dzErmyf5e2, 5DZGm4jKftS6FT5u347WubmwXHyGcs663hEZy2a5QJBCdsED, 5E7a8BMH7qM5YEj5F9srTP2EsjPqpehFpreecNSC8go5MMwG, 5HTSJD3UxqmSJvKzggiCtjR82GELd2icdyDmRkjGkVJpDFsY, 5DANSWVGm6XGzUwfySQ1r1aUZRkvMA1FHV3mcnSPE2QyyrBM, 5H3fhCQmHvBfQSyutB6J21bUpEyVEAi7AvcohoceC7MMts2U, 5DhSjRdzy95zARdH9d5rBNb3UiQkYtqAwADg1knpAB8hg2qv, 5GxC4HPaMYHL6PvSxZovFEg26BrAdnkknssXKo4Xxe4jxC2E, 5CUSn28KuxZtChH2BQrzYJ3JM9htsAKMU5M8aCBSYua1gqG3, 5Cg5qLTKNuQWtb4gURGtUx4GAFU2xQoch3yncEfodDZYVAh8, 5G9jabAUNMMuMbCW6J6BEEVyXZnSweMLdTKH95VJfKyqtuPk, 5E2CrUQrmpArcwLqacpNSv9wBfoAm9r1e7P1Qq7cT4DQZ2v5, 5Fh3sj3TbX4VE3pEMSfTVgSJoP8fQrv2Sjd5vGPuLbiWnM6v, 5Ek9V7rXeAsujPHSoRLLTMLqLVUDNYZnYMXQkMsU17fQci4o, 5HBNQgq97bS17r46AXHMGEo8gAPB4bSdezNt3D653gnZyrPZ, 5G9geGFejThKPopYq9nb3nJSF3EqctFSfXgQJ5bZFq75HmQ5, 5HKCwHpVzyirADadG4S2qXiqUCtkisDjzzpKzYbwXaETjuWk, 5H8siwPx4Gd3kcaeyV6AxEUMggb5SXvd8Lr2Vnehq1BQynrb, 5Gzcw4k6Wmjt3x5YgFDFigbzBfNjubtVNzStdNmJxmkwgmG5, 5DCXAwW3YAqTYqrj39BVLCXRjFxrYHLzdQ6Nao87kCWpA6yF, 5GC9wpaEzS5qUgyoTXAFTr4LcdDexM19bKp1gCvaBqkdX3JT, 5E7woficChfKViP4Fzww45BXDEy9yayLPgRjgU7Fu6482GEF, 5DseXttb6tK5Ri1xYPPjgEo8tnMtspcgS1P6MZnzqpRNbk8Q, 5DDCNYWkKLjNhmX82jXcvyVV3n3yhzNBHEavKtcDnnioL9Ro, 5EyGyWLnv72K1uDFmLrK3JYxCNim2s79HcaHhQz6BWHt2Mkb, 5EKuJY9suzW6PxJkLcPxySoMJfnwLWLD8TuG39cF4PEydhFD, 5DbuPcnoAhW4o595E2698H8dMiedBVVYgKn8d8Nj2FAib9mW, 5ECbm64uSCzCZKUwc9hiFV3qJbHmX1bMbQAy9gh4y8dCDo2P, 5EJQueYsAh6mD1xsVtdLKC9mCCyJjtQr75RR3SFb3Em5eApp, 5EhgP9KUakh3YT7xaZ1xscdSunSfSi4EgM5faezg7QZtuujg, 5EAG5cxhBHZHd1kztDNkiRcqYWy46h4CBotkhgGque1tNa4X, 5FxHcEqyfByZqJGJfhvnKs1sws9yZg12q8UvyKqb4kcr8b18, 5Ci65F6ZHtwQJFCAmLvsWiEZj7eXgcx38MqKJRaAiBBGJAbe, 5HbAETp2UqoFsXYA741dfGXcv8hWBPLzP8nwhr81aUVNqmka, 5H9fEB1Q9KJiuVEgsjKPTqjNzBsQREoy6scSxY3cvkd6iPzu, 5CUqbTeyVr3DdESFLSDecjUgXFBR1Mo8HfnosLrmzzhpJCUv, 5Ec2mAe7Bt8ohdASVF5XmchtH2YZi7EdaDqXPGLFqeeAjUax, 5Et841uS1hRW3iLh1DftfuHKq1k1US68A7BxLQTrsG8b9w54, 5D82rfXBC16cmodMk6rEFMnLYj8BJtqCqHqmmkpBbaoPxdEY, 5GRDDCNccudv1iwZzG27ANeJG6HWXB9Dt3FXagSut5bZyKCa, 5EgqHcbFke4PLfWatnx731WfnEKXfmyP4B6pJiCkZfZ5VMH3, 5FbnS1YXkJ58jCxmeNpBdEY17yrWQWAhNeBNEMLWavd5uZVJ, 5FjCwqZuGujH92Cvd4W9SPYBjdxjifJ8bDVbFKePfMN7rvNR, 5Fbx4aJsH9zDyxrjyBmymXaeDhNaZkAPdrCptvZW3mAJUiKd, 5DFr6krBTTpn3RPMGiD8qmH4KSbYBTjepcRWym8ebGsbjyJF, 5EEhVc696iodmBpsqMergyfJQgBLfhEdnp7JSphQYhfnJ6Pa, 5FKszvkuqwezp4NZ1SnMerPN1CgwuAf2x3KmN1Ea9Lx1FCVU, 5DqDvAp4C66k6P6F4Rw6hvrkD7uyzk9fcR69yHCeNFjLhGcB, 5Gzp3LxvNmsddTvtX2ABSmCoS4M5YnYu5o9QMioxUTUA1zTd, 5GLHpafFpffrG3jeocpMK57redFkzFTqfv2Bv1PGWE4jpVF1, 5F4iFLZbc7uaUwkxyWjR5sAsVbpJbv1QanrUGYNTyMwHeteG, 5DWsda8JVkpphNtSSe1HBVveXcvKMHTzEezA8RrZqG6jxN9o, 5ENXEvhjjmGiw8G9PEL9N2K4pFMtJVGyAgic8buN7DCiZRC1, 5ES9XixD9Q6Mb2k1ZtMLVJPMGUgoPq824DsXZ6CEcbT9JUC5, 5Ev3boRssitrDn5hxyHE9UjVbr7mxGsWJtvNRvqi5ifTxMc2, 5HBscSAdW4gPMZu9bQr9ZaHbFdpaNM71WZs7Gmkg1Q6va8Bx, 5Hpzm1rxDgjhg5o58wdrcagKvchxiSUr6MKvQ98WBfmVRQHx, 5ENiEYBe1FUSeyoTgwFuasuCU4LKtyqWy58A8PUmHTxgGt9m, 5GEsjAZUrMKSdRxeu77xuszbcgggoR5BDEhVpidvgPAEVhFq, 5DbsbNXcr21fC8MszS1AV8JLaBKpXxsfvWvfK5mux4zKkdnt, 5CADxhweP2DLG1zvdVbUmf9ECPDW8nEETHz32E9E4wBLpxoJ, 5Caa8mbp3KpsihuGamqNTyW6Zm55z2LnRMrKMobEPbPCPT5d, 5CGP4qhqtwrP4awnxjHQmkujgW4johQ2Ac6MDWbpyHnP43Gf, 5HNCfb4Znv4D8aZa5DbaZcwCPhxWsL7Nje4JaGa8KjHut1Cv, 5ChaWs9RdjNWoSRQhQLX6tdJEjnGo2SEN61SoS8UE1FGcGZ7, 5Guj86zqCChEX7jhxQaHzjYLbjnkqCZnV6UsUJNhbFhupxUF, 5HH9xyNAWHe52ZVtwVwYUnijn7T3mU4PVfftJDcxnPgFNeV6, 5FLbNye9ohTeuGsBFEY4jLcVTGeeb99tpBFzgfzYo4R4FGCv, 5HfuLAbye7dJeaPrRrgzxV9xk7WRX1nyMAGz5nMdDdtxhK89, 5HQUPLoTytGZA9Um4VSsc81Myxq5eCKyKt1LvveyKezoNAGV, 5HWfUgArfWSgWxZSgnqRR9EhLtctnhW5bx69VVaiydALHHBK, 5E9cppxGVHFuJUVVkfLtpvB2iyNASW8o7QZwMh1E4dESKz8N, 5H63CR314W7BGy8XjYgR6FtV1quUYoAKtKM7warjYBpxmBLb, 5CmKyQBoKSaDnW8C5n1oEW7eG3Sq8Zd9BWDQRYsfpg3fmfrB, 5GBhVZpdwkrmEneZW85TWYTXkvZau8q9eeB5EdpUHwJntTgm, 5HpLku5nX1Qqr2jUHDXH7rMBB5UVD7gJubNzVijvg6JhJJ9Q, 5EZeTkSTVyiptdRSf9ttHXptmnr9bpshXMptibVVpU8y1pe3, 5GjC3mFgtC2EneyXWwrepB5Z2GWnc2fnWhQf887EaLe4b6v4, 5Fmsu1BFGpvGFFSMCt1isXgezjSJa2kDdJBHY45aygy3s6Sa, 5HdX7F12o2ANEc28vFzvSTBDVHz8ZomNcX819x4Fs5WJGVhy, 5G4GreyuVCLQfxGFUcdQSjAtcDYWCnWzkzNxn3UWW7fDALC4, 5DodvvgR7PdinFtfrq8hYjo5RMQxXGv1c5B8DifeRTfpA1Qo, 5DFZAuyRSBY2kqsT2w31Uyt6Tjjd5FbWJBxowECNH9v2eypD, 5FF99759ko3ZGEwVyheGfCvU3a1U428KYA2qKDgqyfRRyV7i, 5DvvkoutiYLAcKHzUH7tvtFZK2yBtx3wszNxUkTivLTjb8HU, 5Cai5JiDcAqrP3ht5JM5eQXAN4o6FfuNzucydvvvEktodqup, 5GqLVV3d7DB4ZntLdvx5HQsQy44EF1niCp14BwEiaXC9zCEp, 5DjvM9BQyE2gre7k3bZ2Ewt7ju7esgaqCwmsjYcGJffUhqrM, 5DJPthVaLDaMoGjjB8UX1oS3EWLfkkZrkswNjrBZxfmQumAS |

#### -Blogging Acala

| Blog link                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Mandala address                                  | Results |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| [https://bihu.com/article/1675373930](https://bihu.com/article/1675373930)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5CG4jmkk1neZzbKCeQg7kYv9PMko8zkcRqVvAFzPHuBD673q | Reward  |
| [https://bihu.com/article/1947278222](https://bihu.com/article/1947278222)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5EPMpXd7Gch8YQU9Q6efHKRdpgTfQ3kSLYKBRiiBB6nWPUHn | Reward  |
| [https://bihu.com/article/1184433159](https://bihu.com/article/1184433159)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5Fv1MSxvCAS8iQdmT7Rgikge54ExzXJdQp5gwqifnEN282x7 | Reward  |
| [https://medium.com/@gafaruzb70/acalanetwork-%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9-%D0%B3%D0%B5%D1%80%D0%BE%D0%B9-e64cee4b6e2](https://medium.com/@gafaruzb70/acalanetwork-%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9-%D0%B3%D0%B5%D1%80%D0%BE%D0%B9-e64cee4b6e2)                                                                                                                                                                                                                                                                                                                                                             | 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK | Reward  |
| [https://medium.com/polkadot-network-russia/acala-network-%D0%B2%D1%81%D1%82%D1%80%D0%B5%D1%87%D0%B0%D0%B9%D1%82%D0%B5-defi-%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8F-%D0%B2-%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B5-polkadot-45149bd7aa1c](https://medium.com/polkadot-network-russia/acala-network-%D0%B2%D1%81%D1%82%D1%80%D0%B5%D1%87%D0%B0%D0%B9%D1%82%D0%B5-defi-%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8F-%D0%B2-%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B5-polkadot-45149bd7aa1c) | 5GYqXeyj14TRet6uZiQCypVSvf6CPaV91xdAsysVc2nLd9H6 | Reward  |
| [https://medium.com/@J0elle/what-do-you-need-to-know-before-polkadot-goes-online-what-do-you-want-to-know-about-acala-6cb54977f9ab](https://medium.com/@J0elle/what-do-you-need-to-know-before-polkadot-goes-online-what-do-you-want-to-know-about-acala-6cb54977f9ab)                                                                                                                                                                                                                                                                                                                                     | 5CJeGxJG3E4DDJ4WsxBhRQaSe8zUqXDFCxtZCVeZ8VJ1kHhb | Reward  |
| [https://bihu.com/article/1623347850](https://bihu.com/article/1623347850)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5Exyar4kUgMtVgSNeeb1nzxQyyJuxmSFnjXHgAka1TneAmx6 | Reward  |
| [https://medium.com/@Lajuanaa/acala-an-important-ecological-member-of-polkadot-e2e15fe40635](https://medium.com/@Lajuanaa/acala-an-important-ecological-member-of-polkadot-e2e15fe40635)                                                                                                                                                                                                                                                                                                                                                                                                                   | 5EUyZJhTRvPse3FZ6KDVFauUtQu8zxJSoD7qMkhepFV4VP1A | Reward  |
| [https://medium.com/@knowledgeiskey2017/acala-in-a-few-word-8ca3c88e76f9](https://medium.com/@knowledgeiskey2017/acala-in-a-few-word-8ca3c88e76f9)                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 5Hg96xTCugbbFd55F9iBNofie4gpAgmJUVGd8nRL5vqCPCSp | Reward  |
| [https://bihu.com/article/1022529417](https://bihu.com/article/1022529417)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o | Reward  |

#### -Runtime Bugs

#### -UI Bugs

| Github issue                                                                                                             | Mandala address                                  | Judging results |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | --------------- |
| [https://github.com/AcalaNetwork/honzon-platform/issues/57](https://github.com/AcalaNetwork/honzon-platform/issues/57)   | 5CG4jmkk1neZzbKCeQg7kYv9PMko8zkcRqVvAFzPHuBD673q | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/59](https://github.com/AcalaNetwork/honzon-platform/issues/59)   | 5CJX5TSEokNNvgN23BKDLg5wPrC1hjmNb99hwndgEJK5x5jK | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/60](https://github.com/AcalaNetwork/honzon-platform/issues/60)   | 5CJX5TSEokNNvgN23BKDLg5wPrC1hjmNb99hwndgEJK5x5jK | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/61](https://github.com/AcalaNetwork/honzon-platform/issues/61)   | 5CJX5TSEokNNvgN23BKDLg5wPrC1hjmNb99hwndgEJK5x5jK | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/65](https://github.com/AcalaNetwork/honzon-platform/issues/65)   | 5GBM5hNhzHerACkb5aFvK1X4T4CMmBSAVxSGmtsLFp7iPtky | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/69](https://github.com/AcalaNetwork/honzon-platform/issues/69)   | 5ERFkyHHuuSvgKYLuPi5a6M21nmjNetF9ebwBD8j8ougSqJZ | bug-C           |
| [https://github.com/AcalaNetwork/Acala/issues/221](https://github.com/AcalaNetwork/Acala/issues/221)                     | 5GW32RaaDWB2UEFa6N8K5ukYcQPGsun2exDERhjdrbe92M6w | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/72](https://github.com/AcalaNetwork/acala-dapp/issues/72)             | 5FsiEWzjVYihbiRNw11Mmrii8Y7HpZ9wvPs82Z5Gzidvpqey | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/77](https://github.com/AcalaNetwork/acala-dapp/issues/77)             | 5DLXtwVzabzHAAjwbHC1eisdHWsKCEcpovfHiuUQZpSUWBi6 | bug=C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/79](https://github.com/AcalaNetwork/honzon-platform/issues/79)   | 5GWj7uVdbEhTad1SwTyqaD2W7h1jX3fMSaWweHR3M3KHj9Qs | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/80](https://github.com/AcalaNetwork/honzon-platform/issues/80)   | 5GZ3Yna3Wa3cfoFHt7eakpzZUj2QVxGEMmXbGyux8BnEVCRr | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/81](https://github.com/AcalaNetwork/honzon-platform/issues/81)   | 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/83](https://github.com/AcalaNetwork/honzon-platform/issues/83)   | 5FF7F1eDV59gH1yzamUuhzWkjwf96gZDWDK7tCUDehDuKfQk | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/86](https://github.com/AcalaNetwork/honzon-platform/issues/86)   | 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/93](https://github.com/AcalaNetwork/honzon-platform/issues/93)   | 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/98](https://github.com/AcalaNetwork/honzon-platform/issues/98)   | 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk | bug-C           |
| [https://github.com/AcalaNetwork/honzon-platform/issues/102](https://github.com/AcalaNetwork/honzon-platform/issues/102) | 5HY8hYMttrbm57MmN3o9p5ipF8i7eBjdWw7TQVsecoP7Uos6 | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/112](https://github.com/AcalaNetwork/acala-dapp/issues/112)           | 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/119](https://github.com/AcalaNetwork/acala-dapp/issues/119)           | 5FGx48oGW6muZspe3X7EysKdseqWvGcwD1DSJTx1RLetpnKZ | bug-C           |
| [https://github.com/AcalaNetwork/acala-dapp/issues/123](https://github.com/AcalaNetwork/acala-dapp/issues/123)           | 5F3rYPmFB53XttPd8Zq9QqPxMFDUuVqDx4zjVjmqy6n4Ve4M | bug-C           |

### Season 2 Rules & Rewards

#### Node Runners (11th - 31st May)

**Prize**

* Total: **1575 ACA + 107,100 KAR**
* Each Prize: **25 ACA + 1,700 KAR**
* Prize draw at UTC 00:00, **3 prizes each day**

**Rules**

* Run a Mandala TC3 Node, follow [this guide](https://github.com/AcalaNetwork/Acala/wiki/4.-Maintainers) & check telemetry [here](https://telemetry.polkadot.io/#list/Acala%20Mandala%20TC3)
* Remember to run your node with `--name` parameter plus first 10 characters of your reward receiving address e.g. **--name "5DcvxiYpLn"**
* Make sure [**get some test tokens**](https://github.com/AcalaNetwork/Acala/wiki/1.-Get-Started#get-test-tokens) **for this address**, otherwise it cannot be verified nor be in a draw

#### App Users (11th - 31st May)

**Prize**

* Total: **6,000 ACA + 300,000 KAR**
* Each Prize: **20 ACA + 1,000 KAR**
* Prize draw: **100 lucky winners every week** for 3 weeks 🎉

**Rules** Try Acala App and do the following to be in the draw: 1. Use **Liquid DOT (LDOT)** to get DOT derivative 2. Then use LDOT for any effective transactions including: use **Self Service Loan** to borrow aUSD with LDOT, or trade on **Swap** exchange, or **Deposit & Earn**, or **participate in collateral auctions** etc. excluding transfers. 3. Get started [here](https://github.com/AcalaNetwork/Acala/wiki/1.-Get-Started)

#### Bloggers (till 15th June)

**Prize**

* Total: **2,000 ACA + 150,000 KAR**
* Each Prize: **200 ACA + 15,000 KAR**
* **Total 10 bloggers awards** will be announced a week after 15th June.

**Rules**

* Original blog post submitted to [Medium](https://medium.com) or [Bihu](https://bihu.com)
* Remember to **include your Acala Mandala Address in the article to receive prizes**
* Submit the article link to [https://riot.im/app/#/room/#acala:matrix.org](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_BLOG
* The blog must be original.
* We will judge both the quality (how appealing is the story, idea, perspective, insights, analysis etc) as well as social reactions (number of comments, likes, twitter or other social sharing etc).

#### Runtime Bug Hunters

[See Runtime Bug Bounty](https://wiki.acala.network/general/contribution-rewards#runtime-bug-bounty)

#### UI Bug Hunters

[See UI Bug Bounty](https://wiki.acala.network/general/contribution-rewards#ui-bug-bounty)

## Mandala Festival Season 1 (Finished)

\*\*This event has concluded, thank you for your participation. \*\*

### Prize Giving

#### -Running a Node

| Date  | Lottery block height | Lottery block hash                                                 | Prize winner                                                                                                                                         |
| ----- | -------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 03.07 | #79,513              | 0x17bcbe0cc97ffd7e019cbf034f3886d4b9bbdda408e33cc060ceeba239263b5b | 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5HYmh2R1iFuzmTFChezjTqGvioQKzCPWpqM85HYc3ZcCTTes, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ |
| 03.08 | #101,539             | 0x369876238225193d50a980dabe92be53428ed64a7fd772836ebffa096b927f31 | 5Gec99F4Q86UBF1BekB6gVL9SHofLNMPkF2h1fxyTEtVKGf7, 5FRcBR5j4LDToJsYUqWBK4TBtMbrMZZ922M3NEFw3zMH1LeJ, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3 |
| 03.09 | #123,764             | 0xc820c84884cfb6c6034906548ad2910b9f2b8feb27ffdaf1e2f3cf6ca547f1d6 | 5CAyvM4JtZQqjs1eFUG3LcDzs8fZiPtNHRtBc7kPYfxfVB6s, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH |
| 03.10 | #145,739             | 0x07982c6c551e57476d01a1894c92a816abe2c2b562ad3213262ca5217330b104 | 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5HKeXVnMsaBbXRti3HA9LgC9bYHmBxAZFTc3YDDBH8o3q9KJ |
| 03.11 | #166,282             | 0x6c317b90d4a3c6f68752294c73ca153c832a4d11b88227b1395d35dc4e407800 | 5CFfibmK6AhCLXfGtL5qCfvkJohb8nCqPiwAw68GMbmdUKVJ, 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5Dh8vK5Q6JK8YBYfbVEmgrUw49iGHXnVgx1jX48kQ9meKkKn |
| 03.12 | #185,549             | 0x518dbc7fb52fa435614455f246adefaf4f07f1bea4d3cec3bff5b435667f7737 | 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X, 5GLKuwUPAUkMft7NT194LWpmTBcKBEXwSxZyGsMbf5LDNNTp |
| 03.13 | #207,608             | 0x3aff20027835c25506fb434687ba333756741d9f8d612a3aa603e0fbe52663e0 | 5FbfExGfDFk3uVWsaidShjAMeY2r4P68PMbTz781mjFsvDRy, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5DUuWf643Fcoqk88wSyY1iBkWnQBKmxtVcDmC9K1MsskRULp |
| 03.14 | #230,779             | 0x40bcfea935aacaae97150e03520bdaf3d454a3bd758f9cc8d23b59ec95c6c7e2 | 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK, 5CZzpzpKgXVnJUuKZ3S4EASzYV77sb7rAp7UU5Jgp1QgaSBu, 5CDA3teXpfFAqQDTebUXiZn47udHReALJapzcteBPPSHPFJf |
| 03.15 | #250,280             | 0xe877919042c5e8cb6731d13eeaeb734e3624e462f9d92030b2f7ca7d356496a9 | 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK, 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk, 5HT4E3o4U8wrHs6m3DrzKvZvMtxy2ncDsq7zCSizPy8Lif8H |
| 03.16 | #267,800             | 0x85fdeb78e4b7e2e072fe7a2c9d4f42a87fc095cadeacd6e730fa656ebb5502a6 | 5ENZGGyRryWv2siiDtCJjoVfQ1kWyTAAdeJqdpd8UBwoQqwE, 5G3zwZ72e6rbJgx6cfmpKac3yBPsLM1hC173U6XNeMexqMhS, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8 |
| 03.17 | #289,398             | 0xb71ad6d29da5ebb99778e5cd98cc1581509b1fbea4eff8a46f25dffe8e79b6b1 | 5CFfibmK6AhCLXfGtL5qCfvkJohb8nCqPiwAw68GMbmdUKVJ, 5CZzpzpKgXVnJUuKZ3S4EASzYV77sb7rAp7UU5Jgp1QgaSBu, 5FjXFxPrEyLwXBVYC12CXufXgWQzddnpsArg8P8fJi7KwsFq |
| 03.18 | #311,497             | 0x2b9766ee142f754f046af4d6393d1c8131410d438d801e60cb81c53153a9ec8d | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X，5HYmh2R1iFuzmTFChezjTqGvioQKzCPWpqM85HYc3ZcCTTes, 5G94Wzuc5EBemwKGnBf18JwxUw8QtenRkrEiSbLCaMc8WFpR  |
| 03.19 | #332,494             | 0x08d346c0720e449b5fc48136c74071cb3e372ce9550845b6a54bda04638a4653 | 5DskzyXfQsxD2vJZDzCfXFnRhicHfAtrZ8qcM7BHsQFg7Wrg, 5G94Wzuc5EBemwKGnBf18JwxUw8QtenRkrEiSbLCaMc8WFpR, 5CFfibmK6AhCLXfGtL5qCfvkJohb8nCqPiwAw68GMbmdUKVJ |
| 03.20 | #353,185             | 0x7140ad6d2c5697f069f7f27dc3a2971f92c50e605237991c00f70d9e0a7af909 | 5GMvp5okVesv3JHxNA21SeFbXtMMtwy6EmPvtN5HpHLUuRCy, 5HT4E3o4U8wrHs6m3DrzKvZvMtxy2ncDsq7zCSizPy8Lif8H, 5DJAQKqgstka75mBA18QZwCQkMXCkqSUaNzhYu78Eygi8VA4 |
| 03.21 | #371,672             | 0x0a1d18b475ae527324ec6cfbe079694d4f2f2973be9207a9d57839d31d9931e8 | 5GBQRFTq5aei48Greedwys58bDYrHg54yh48m2scxemZvAeX, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X, 5HT4E3o4U8wrHs6m3DrzKvZvMtxy2ncDsq7zCSizPy8Lif8H |
| 03.22 | #393,575             | 0x736b354f2a2daac3495c834ff5ec6fe550c32b9d1b86903b6d5bd352b27f28f7 | 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5FQsJbDnzxqyxp85nzWy4HbTFRSKa1CarVN9Xm7QBsw3vVrx, 5HEU4JEfGS3mW2PSq4TmuJKWyKwyber4cFVEZrgPhxNs8Db3 |
| 03.23 | #414,350             | 0x3772a59486df65006e7e2f7fd0279ac22ec4f6e525d9875ff855802e5fd8762f | 5Dh8vK5Q6JK8YBYfbVEmgrUw49iGHXnVgx1jX48kQ9meKkKn, 5FRcBR5j4LDToJsYUqWBK4TBtMbrMZZ922M3NEFw3zMH1LeJ, 5CHrvcSjs21YwECGVoi8pEGn6v72CRBWP6PpUqUsJ366MqA3 |
| 03.24 | #435,268             | 0xc331867062eca546bd62229aff67bfd35b831fb6825e1616fe37f8a2d805a480 | 5DyEcs3fV2pmcTQVshC3Gr5WyA9f5xSMxirvzrgr7muoVG7M, 5CHrvcSjs21YwECGVoi8pEGn6v72CRBWP6PpUqUsJ366MqA3, 5GMvp5okVesv3JHxNA21SeFbXtMMtwy6EmPvtN5HpHLUuRCy |
| 03.25 | #456,668             | 0xad3257157d142fe1aa67aa3922ce06876fc095e1f47942c1f5fb92243080c392 | 5FbfExGfDFk3uVWsaidShjAMeY2r4P68PMbTz781mjFsvDRy, 5ESBGD6qa8xDE9z318wTg6vSCbTht1PAvzy29zB2eHyNH6Zu, 5G6pKktDYWMqEkGJhspUGeKLp8JugubEv9Jfbs6CMkJ5Ev47 |
| 03.26 | #478,671             | 0x6b514841e8bd765f38d751c88b61148bec684a49c56a54daa64a79379c861172 | 5DyEcs3fV2pmcTQVshC3Gr5WyA9f5xSMxirvzrgr7muoVG7M, 5HQFXgz67bre8PdfcNVJywWX3rNo7R1do9HfB3g6edDffR46, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X |
| 03.27 | #500,346             | 0xe9119a9f5c3606823b409802607c402996f4638b964cf49b48c7c30ffc56a43b | 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5DskzyXfQsxD2vJZDzCfXFnRhicHfAtrZ8qcM7BHsQFg7Wrg, 5ENZGGyRryWv2siiDtCJjoVfQ1kWyTAAdeJqdpd8UBwoQqwE |

#### -Using Acala

> **10 top accounts**

| Date                    | Winners                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| First week (2020.3.12)  | 5HKxAQ4z51No5R5r4UYVsbWRfnc6YVo568tVtfnNCNonB8vo, 5CAyvM4JtZQqjs1eFUG3LcDzs8fZiPtNHRtBc7kPYfxfVB6s, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5ChezpQKCGTtuwtDheos7jYibyGba7dWY6T8o4CZQEtmyp8Z, 5HEVq9jDSp6Y9N4rs2YFchNs8SDtvAtpDEBTuybiJF96kpXb, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5GZSvT7Fda3wfZ5qx2kdSP526h3ddfn6BnL4jVyqD8NPN1zL, 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e |
| Second week (2020.3.19) | 5FNmkE5pVgNYD8bhQQHYdTsDTcjQfLcjvJDwpKtLu3VXzfdA, 5CAyvM4JtZQqjs1eFUG3LcDzs8fZiPtNHRtBc7kPYfxfVB6s, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz, 5CqduWFn7pKiGTvrYPe4BQCp3G5Egv6cqo7RtoVshZLFFdMy, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK, 5GZSvT7Fda3wfZ5qx2kdSP526h3ddfn6BnL4jVyqD8NPN1zL, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3 |
| Third week(2020.3.26)   | 5FNmkE5pVgNYD8bhQQHYdTsDTcjQfLcjvJDwpKtLu3VXzfdA, 5CwSTvtMUvt6eFnrqKjpiZs8nzXvS5AmrSttpNyihfVAvuQC, 5GgivqrWGmUjkJSrZs5x3ifNgENsq2eM4ASta7LDtRnAkUqT, 5H6AEtxBvRgWPLqJKjy8MLnMdpXBHnuJLGFN1X1CZLTwidEL, 5Ckonmbx6tK1WGNPUqn1nke8JJKpFgKpQBUquRojM7gW51Me, 5GZSvT7Fda3wfZ5qx2kdSP526h3ddfn6BnL4jVyqD8NPN1zL, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5GWj7uVdbEhTad1SwTyqaD2W7h1jX3fMSaWweHR3M3KHj9Qs, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3 |

> **106 lucky accounts**

| Date                   | Winners                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| First week (2020.3.12) | 5C4rHmiSuvhtBbNgM5SExDavrLKKiy6cj69XAXiWkA3GXWqM, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e, 5ES9fyfV56kkEP1qazNzN1S6YwbSTfFWp2Q3i4QG4eyT2Ng8, 5F98oWfz2r5rcRVnP9VCndg33DAAsky3iuoBSpaPUbgN9AJn, 5G1fCYSGnBiFLxkmzo8wggcSDjfaYt5i4S6JbSQyAwyo7fHy, 5HKxAQ4z51No5R5r4UYVsbWRfnc6YVo568tVtfnNCNonB8vo, 5CojknH9daMVDQ6rZuUSsDjnzDcofvGWRtCsG6y35HJyiDvE, 5DA9yUXbMd6pwuZ5GyYTEMb6Um8XLVKUcaTsqqgwy7GVZCQ8, 5CaoouAVAb8WWGVriEwg4BSBW1hZoWn3iTAh1tKskhzQQ5og, 5D4yuBygLopkUereWT7ZdRLm1GBzEckhMyE3FE5kLwWdF5NQ, 5G3zwZ72e6rbJgx6cfmpKac3yBPsLM1hC173U6XNeMexqMhS, 5FNmkE5pVgNYD8bhQQHYdTsDTcjQfLcjvJDwpKtLu3VXzfdA, 5Ckonmbx6tK1WGNPUqn1nke8JJKpFgKpQBUquRojM7gW51Me, 5GR5ZkscxFJHRroPDPG6TxZ28xGJBnsrYXJCR9nbmiuWWEDR, 5GsgGaybXxXhyNdHyyGeVLAAwq9cxLaLZEiP3vBV24cwYuBB, 5CAyvM4JtZQqjs1eFUG3LcDzs8fZiPtNHRtBc7kPYfxfVB6s, 5CccLc64WB2hwWorqg92A4S5y9fwAiAdbAKLRY5obDskA26N, 5GZSvT7Fda3wfZ5qx2kdSP526h3ddfn6BnL4jVyqD8NPN1zL, 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5DvvRkDhCWmTK5B2b98hCYToWDW5DWZYH5sdvB9s5vAS3mMc, 5FYfrrNXkZMSRbJAzwDMLCyjjU1ZWQSADuGFkV1Y9LXZnvjQ, 5GWj7uVdbEhTad1SwTyqaD2W7h1jX3fMSaWweHR3M3KHj9Qs, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3, 5DhKbq3xPogHtt1qq1H999uuxhEcX649t2uF7TPswjFjhbGc, 5G8jj92pf4yG9cQmQ6mbRUqBePMptB37b7GGBg8FMoDKL9Gv, 5CAaGkmAcvVXAVbTUr1a3zKKcQEZLnTpEZfEPbKkFn5H8QX1, 5CoMtmPFgJRdf7mShziKeRq1gJoRyJVex9b83GHq3yH3C8Tk, 5FLcXWfs1hpRqbT4Rv5ACHkenqCGL5MPTDDeFtBFrogY3D9V, 5GRbkRH3hi1vbuNd7s3eW9u2YRfhMtDJVVCe3a8M1jvhBuvZ, 5ERBaTXnATEbj81qYfSHW8Qn7SjJT5QN2yg6uUZZJyeUBicZ, 5F6tkYMG35Qyyy1on36w7T293FS95bpqqcCDFT8N9t6DhnQn, 5FTaCPEmwhMJ993ZLNM8GoHDw29SHxrpGogDB82sboCpMJRn, 5FYgjmgfoGakPr9kCzzaobXkWyQB77uc88J8WQGksAg8nfT4, 5GpNYPsdFAcCUXM6jjUEhqyjxy8Bp7afkAcvmtxm6mUAcNiJ, 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK, 5EkK4ckcii8Rh5wjfBxFZR8x6zXZsqw8FvztXUsxkoYf5A8v, 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk, 5HHEF4S8B3aYsUZmpEu4n6odRrxpEEDe89jnVr2H14FSbARn, 5HTHjJib4wzqsCGAvD8ekSUn1ZXu7tAk44Sv5wG5BEER8WoZ, 5Ct5SGeyXu9GNyXKV7P3tkE38v1qM4auWtsD8aH4bQiYSupN, 5Dw97QPYeWqmCJFgoLiveLkkaqMFJxfn8e9E9mxzXB6Dz3Ke, 5ECsqWJBPmAikA1nZHwHicRMVgH2G2UrJ3CuZ87Fix8E6bkW, 5EsPXJ12hTpu5NJoWYWzkoG6qpMdbaWULRFLgVjpWgZfJ4ML, 5GNa8pNBVWtgxHdXWovcMe3W9VQJJsNi2WPwZED6q5CnsghH, 5GNBkRgVJhXNmC3WjwHYWR9rzabpU43yXbZdbpXLmNLe32aB, 5HQFXgz67bre8PdfcNVJywWX3rNo7R1do9HfB3g6edDffR46, 5CqduWFn7pKiGTvrYPe4BQCp3G5Egv6cqo7RtoVshZLFFdMy, 5CZzpzpKgXVnJUuKZ3S4EASzYV77sb7rAp7UU5Jgp1QgaSBu, 5DyEcs3fV2pmcTQVshC3Gr5WyA9f5xSMxirvzrgr7muoVG7M, 5FJC9QX1SKikjSKFxSRr1x5cFb7wNfUN4mVw3YYS4ZKwixai, 5HL6tBwmRunvJarRgHgjGkucwRkq8GNNQqw8fdkAxEDNHi8v, 5Chosiaz3EUi7BmpAKQot9RKmJcJi1Qr3EoDs7MU8QnMK1L5, 5DUuWf643Fcoqk88wSyY1iBkWnQBKmxtVcDmC9K1MsskRULp, 5GHjYXd7nzTsGSkMDxf4EqjhCwnpq6SguJ59WraeYVtf8ddi, 5Gzcw4k6Wmjt3x5YgFDFigbzBfNjubtVNzStdNmJxmkwgmG5, 5H1baDyWT8faV6x8FBbwnzFEJjbBUNzeqzLXTYvU9oVbMv9r, 5HGQ6AchBx6sLkNAAQiNYfEwZxFVTZAjyKQb4qtKSvzR7MC2, 5CkJ4VzcH4mk85BtTfaHqf3RqGMM4a5DZqSzseVruEP5kF4e, 5CVPDeHivFgZQfrc9sF9UoVv21zxS4DQVVz7ucinPTdyZpys, 5Exyar4kUgMtVgSNeeb1nzxQyyJuxmSFnjXHgAka1TneAmx6, 5Gb2tKDMDz3RbQ7aMgmbfV7tEt9dBgdWEWz45YEZ1HvtZMJF, 5GeoVuZGdFjPuEQtEqvtUwpMnFnmJjVm5dBTTwnbvVf2mt8N, 5GuoZ4eAEHu5qjPk4ZgPZdVEVKA1yv8iC4L2bqmcH6E6WGC1, 5GVhfKo3vsRB9KT8JC29AehmeQVdGiwYtxD3tP8rsQ6DsPgp, 5GVs4qFFeqPW6TDMgQndS5naDJaPupH9BPh89yFasvaJR3w6, 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz, 5CMFEDVJdeBzfjbgp8XfSfeZRyHs2GpvwVKnuXvPQKTmQZSK, 5H1rL11WktkCyyzBExxiKuijBE81y6tzD3fF3LRni5R1Vt1E, 5FyPtyPjFWAxceKutcJTLDi5vymn8jJCb5pRkqBYrd9LEEqF, 5HCHNRXRMDqPQ5kkMfPHwB1389pN4sQmbQkkwQiG9bGZEvfS, 5HEU4JEfGS3mW2PSq4TmuJKWyKwyber4cFVEZrgPhxNs8Db3, 5HGnpfbi29nECZmCXBw2MPri1DN91NQYZwHnLtWTi2A6j9pm, 5HKeXVnMsaBbXRti3HA9LgC9bYHmBxAZFTc3YDDBH8o3q9KJ, 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o, 5D7YBLjdbY8b9LebqeyRo49zS9ZR1eT4Ef873cyFhqud1o6h, 5DLopAa1UYVM3cczoCNQ6sw5wgMcTBg9csstAQFw6BYS9U71, 5EHwNS9VqpdA53uZ2Ne1EWaxrkpBYg7huYLPzhNWNTBQumRg, 5EU9HJ4cZ9mNuiHWTuLfoF2r1wSVZHERk6N19HACgwqKVbwM, 5Fgsuwi8tmhNSDekq5bp9mY6qCfzaR55J1HZmMypjJDdemVs, 5GjdZKDznAfCKHHwX8mqnYwo2B7oZLNZyrUGCar4cXHvYzJ3, 5HYmh2R1iFuzmTFChezjTqGvioQKzCPWpqM85HYc3ZcCTTes, 5Cai5JiDcAqrP3ht5JM5eQXAN4o6FfuNzucydvvvEktodqup, 5DJAQKqgstka75mBA18QZwCQkMXCkqSUaNzhYu78Eygi8VA4, 5E4NSX14898SAU4aTygUntLXKcZqXLf2xYTzkkimpGRHVVNC, 5ENZGGyRryWv2siiDtCJjoVfQ1kWyTAAdeJqdpd8UBwoQqwE, 5F95LB448ykhME3UXu4uLrb85wJYebG3qwn9V1ma42TqTVdv, 5F9sexk65xWDtbHnL8hdt7YqEWHHRAH96LEvnxGH3u5WCXPV, 5FNrTnVFL9zXUuaECGmMEgBSY6CLSc55JkVT4hATr7UGTCSF, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ, 5FqNMQqhaKPKc37jeFkPEUT5UhyArrDsmmkiv2GNoopXXp7M, 5FWKFsL7JZ8rhVKvXFGfaDDrZTAWU8MHVQoveBRG6Etc9kjC, 5Ge7Y4xa8gFkj8pw8MxQM8sGR9mEqeUcKdHm8B2PWcEgtQPX, 5GvRPmPv31DVdorQqPTGYNK86wFFyPXJBzobmHN4FJgAjjmE, 5H1coQF3mpiAqEE4ro7CiYFPGcKpuxgoUkwikxrPaaRF1jEJ, 5DvzesBCUBwjKtNj1FqFg4UCHpNSxGwGyD7jv6YR13uqP3C9, 5Ei1MrxjHevWAC1csMj7fLbQSthkKTq6fdr99Wjdb9efU8vr, 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK, 5ERoUbf1vi3AyPHgdmpq3YY3f6cghZHHiTWRMpeqXCBBnHNh, 5FvDzLJVmPaDFsL8ryQgLsLCypj5ywqCufgCzzbt56PUQY8E, 5GjjWFCsotco2y2RDPiHb96qGanksRKBbQmYap3rUnj9ZLZD, 5GTwRTLGteEhVaJPZgNGf7mWPE8PWSyEmaSoKZ5LA8cvmxrt, 5HEVq9jDSp6Y9N4rs2YFchNs8SDtvAtpDEBTuybiJF96kpXb, 5EnHNDuYA3tiKoWh96dnFTxeyWTmnHGMvifYCXyBo36wXwTw, 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz, 5H9QiBnUenYmxSTGprjdHRJfgN1JnviZEtQTnuwpho3uHRUN |
| Second week(2020.3.19) | 5CaME74bajSwYpHzEHokqTbYTAYK4nBjRj1s3GLfHaK5hU9i, 5CApcfdm4JqQ28GK4XfEK4CrPrKgs5gp9JpZuDesvL8UagDb, 5CCdo3gfsnjg8WCTChrB4jQKXNncfbSN3H9NhNVqfD7EjNmz, 5CD2jb9ymzGxNyv8bZUzFv1MxG36rKgM5V1F5hooa6Q6CNur, 5CDTUWCWrRxayVmxHbHPhRDSh56fbvjzYrdu46q26u24Qf3w, 5CLtcEva82FZzmTL9kr2TbyLG3z1P9yVgpHeb5RJPp1a1jEo, 5CMW4BiVqfJ9Li5uxiG1HnzqigvcZfWbK8pekrUp6teHw7GA, 5Cni8QpH5uoxCrueohD1anzVy5tHsGzRzcgEh3KnpoAjyL5p, 5CQBYBqkNzrQhPk7Aphiao6PbfReTA8ZL1rhXPyN89N6oYq5, 5CSbbih3GNn3XYx1Y4YEouasWNbQUuniLBgKNFeUHtuKN5fi, 5Ctt7FJubQyy5tvfnZeH2nhxgCDgZ9kLH9FtHd3b45MooLvF, 5CtuxGvKZ3A7TXWLYk7GZrgkoJL8YxoJ6xefZDqXJXzdVRzS, 5CUQQGvpNe6fpqnNyQZACDcwYGMyjmmMcBFu5KoJ7PwvYNgj, 5CX3t4uc6UwbHA93LLjAqqyGb9Knk8w1G8jE4U38SLLGvoxz, 5D5Wtvop2EJhtPBnznQkNg7nXutghEPNmR1Z4C5a7NMomfhU, 5D7eU4gL7GYQy1GhiwfLBUkXWogVnuaqag86SBXgvwxZQSxn, 5D8ETR2iZNihfnt9UJwUcB6JdyXMdMqbVk4eA1wag2zfSeWx, 5DaD5WtNkNmiXpWeUgN2yozFV7DDS7Ldtpp8dyoRDDt4bw9w, 5DALdXmk5mzHHYoYHG7kp7ZGD8NZdYf7s6ATUzXsHpgXXWHk, 5DfVaYbSpA8gFheWLvte2wrV3HhUBdvPn6kTe3QX3D6zUeme, 5Dhahn4Wnziic2gExmc3qqiuy8Qvv3xTY7BaZZ78hU9a1gk1, 5DHtpAMFU5orY2SQQ5pr9KLC5ktzCuS4Tynx1WT3vQc4Pw5b, 5DqFgUVwGMGurJrJJTbtFA3U6HS6ezomTHnpbREKbnKjD9md, 5DSKU5oM1FcCjvRVKpF6rGPpvnZaMk6HmP9tZjSiJwakGhzn, 5DsnnPUSteS97tobbTsFoqr5q1tfqYa3Z5pJFpsVC1o2Qrx5, 5Dt2VSN2c2yEYXrMZWQ637k12SV1LQ8xcqGoC2KhbM5qjDB8, 5DvpnQx5AhaG5LMTcQGFbawfx4c1WPSBt3Yi3LaKVRsTVCBm, 5DvszTc6FJAmyhE6v5ZJhchtGH1ZQ2KR7iZi7g2776EX2ZQ7, 5DXBe7fb2v4kRsLpKzArkLXfdd4ZrjX6VqUrWDC1jVQnXVVy, 5Dz8mYhe2ji4n6xwSHTWPuFGmbxpMnnkwWMTP2nTAKZ5xUcd, 5DZsZrAaA1WMZUQ9e9C8WbodnEnbdKcBpsVXpVGztyQkjvVZ, 5E4PBrtxKguhK2UwwqKWUqJFsbci9t1q9rS7rHE1gu1aBFmU, 5Ec2mAe7Bt8ohdASVF5XmchtH2YZi7EdaDqXPGLFqeeAjUax, 5ECwTNTdTscgQUmKLpPK9TwJUc2rsqQ4M6qBfeRow5Mk2H6j, 5Eh5wzrkyxH3PmS9ahEftWLyCLwjirecohy8mvzwt2v5iHmE, 5EHPJHWewSnyni4Veqp6A4TDqUnN1K6fnzb1GRH1Y5uYHJrz, 5Ejmeh5oDc9KAh1yhr6hWQpPGHjV1EREBdXL11CdkVcw229x, 5EJR3vqBw8y2X4TNhqGHi7NzYM5H9DcyfdJM5XjrnH2CC6jt, 5Ek4bNRtJh3rQBD78bmoBvfk5C2Xmuy7nqM9K7X8WdSWmbim, 5EL71n847E1mtdrhrhEWc81J6eLXpG6tGbjAq2yg2FvFqHDS, 5ERd1oVWtXy1N9hW2SxHutdsMPDvUkCFvLtMaHYbPXzFrdSn, 5ERDK6jpUVqTqVVtN5sZHki5HGegZLqTLL72psDCJWr9btXm, 5ERpNXhqX56i6eCDYCygwCegs2VCw6d6KNPTqfqg37GJGq3n, 5EUudY9pLJ17acK69CoeP3x5DxF7b1euinNZZFfCDeB3vRKy, 5EX2MLZN8bBSKTWLoTsKeryLjvRKrKCgid4AXtFJsddXQX3g, 5EykxaQicsqV5uDb9mkQqDBPXVeXz3Q6qwz12TaRDwrQTmnZ, 5F1TGRBPEwSnRdwJpMe5DicVvFfArfuHg3bCqez9iymweDTP, 5FbbWe8EEbfy22TGbQjtUhQNpzwGPBDwqyRHodZdGpMDaXyk, 5Fgkcy5KGTCgvWPkoiaJURP4siSV5c3STfNc2JfGd1j2RaNh, 5FHfYwu5mfkJzzpVtNumv8WyTZs9vvpwCBEYzEqi6xgNPHey, 5FjXFxPrEyLwXBVYC12CXufXgWQzddnpsArg8P8fJi7KwsFq, 5FRg2xXPHAxQEa9gs9kgT8kEuKce8t3PECeEBVngvKiY1eVY, 5FukjmoYH9wZMme5zLBwfT4tMDsqXGEacbidqw4JsUZEG7fv, 5FvmpDcdJiVTJsFxZ9ruz7GRM9JFGEAxDWPp83y93rtegLoU, 5FxpytyEjhWsFkQBfkYo523fhadtQZiPcFwxW2B39xspctkT, 5FYvKmBGhd85r5MfuMMcQ2hTRjSgCgGD7vpTdvjtNgLjSBcu, 5G1VFd4fgc2xP9AJt9vL8KCtva2Wbrf6vVjFvsdueQM3rvrL, 5HmbZEZ6QFTBB5hXaYDi2Qx9Yq4vscLGqa1B2AD3McCNNQ98, 5G3gNV9ZAsfKB7ajMH6RhqmFda6xgAjUbjNzVanHzYLGQ87D, 5G6trpf7pZQce1PuumLkmkdsuCAVqUSBQTceHoDCGjyjbcrH, 5G6upgJNi99Co55Dsv57gnimrourzdf5RoS2e1rKc2n8TJ4k, 5G9i9UgfogCH6VGSX3eb1LG44XYdgcpj5PRbCFP7qMN3A8MF, 5GbANjH5q3kPrXSbJ5fNcXuMDr1tDJW3pJo2c8cHEhEvXZbk, 5GbS9EpYangQpDaNz9VghK3VJe1Vxsup1yMrve3VNV8Bs2gd, 5GbstTqbFPegS3JjunbXjuTnS2qhwJPMsUasZA4x7TEqDYu8, 5GCFMEMkb9SYqkPQbnJwDboc1dBM6ZBRPazSzGDHNNH1trUY, 5Ge9U2ZMnoVfx57FUBoKA9WPjsxD7JF2C9PLbFV9wKn88E4M, 5GERE35iVpdBs5KE4GUy9TiNwcjheZkgBDkaEnQn3j7W9oTv, 5GeSLp5DnRpVBH142dnzVZ7KJPa8UoBxk5wpVks5irT6fikE, 5GGhnPcLBRfR9FgwfzzCaEDbbyoLoswj9KAX1zxyC1ej2S9k, 5GjZWQ1CA7EbYzgBmKQqeCMhFMKctuLxKQ6R7uPgHboCLJ4u, 5GmUtqsaGNBu2gP8nAqQsJA7uGemWxS17RgDVTf8TNTkGSNq, 5GNz45kRQHebeUvh4xEk2bPDHWnHkxmmdJfPz42FuUQD9o9b, 5GpEVSLKNUG2HBSDB58LQPRLZMLPruK8uwyMVXd9Bvf7fuEy, 5GuXzQXqq4AboeTqwA8PwaVXJNNo5WVQXL9xLRkchKx5EA5U, 5GVnBAzqGhRCkKbr4jKsSHC9z5V9iqfG3PZMXiiXPEgtom6p, 5GWsLUrtX3pxiA2ppt3BHww9QpYsSucdug2KgrSQ3F5FdhPe, 5GYzQxeDFLN7ZW9piukRYydK8P5N1oJuzrCfPCF9BBaX8NJ1, 5H15dtXREueUfud6bdFkrR8ru41bxEjuekLfkXCiaKAp57o4, 5H3mwRQWsZv4TdJiqgU237LADWiFGwetf1RC8oJcZHdQx5re, 5H3rq3eR3gwtAZhhctacokHZWEdPMi7jcPoJGPGjKHgCYJNW, 5Hdk2KXSp2W5szxU4fKJTnPCrjcGK7FToGZ292vkXzABUuyw, 5HeAqbF9FtMW4xitwF4BjySPFtqoFX7EECr2QcftGsPMFoWE, 5HETz3bu4SxnyeM4f3XhHSYvbwAveNdepdiKAePzZNXSDKbq, 5Hgx2vu9bWECxfsPwdepAzRT1qtdcruxyDX3XnGNSypckWZW, 5Hh1jyjseRp89PkxiLzL287egevzuDCKbSfsQQTHgnTezo8h, 5HH8NRNe9md45Gjzop6N1CCdRVXvfXBxYWoKtHHYtLmojH3B, 5HjhTLGk5V6HXuwjpdbHMWUXc5LH3rMtLKpcqSn8Z5x8xLUS, 5Hpngv1Pp8JBHfDN8BZdSawKNTBrSN5vKktr6VJvzjkzwaLr, 5HQa6qViQEjnTKfBkfLzvR7R2aKQga1gnAe2CPjLr83hHCxL, 5HR2Uzwi72AgrwUougEJNkSt1yH8Hd6dokC6iQ7RsZPbuSW4, 5HTPMLGoZKZVz8kJQcTaQPQpXKAmc7KpWttMWUCmyYYavv1W, 5HTZDXFep67Z6KJv4y7Jhh7is2D6F7KF5Yx2qa6yAADodoCZ, 5HW3oF1Tuyxt9ZSFfeq6ZXTfxei5oGBzRGKzK13wNtJQkw2X, 5HYfqv8CYXrvAYWTnMdRUymPU9oHjemiC3C4qFYpBS4B2VFr, 5HZAj8h7KAwsc4AWubveD2k1bUQ6irg4DRxqW3UJWCkjFpLw, 5C4rHmiSuvhtBbNgM5SExDavrLKKiy6cj69XAXiWkA3GXWqM, 5Cai5JiDcAqrP3ht5JM5eQXAN4o6FfuNzucydvvvEktodqup, 5CojknH9daMVDQ6rZuUSsDjnzDcofvGWRtCsG6y35HJyiDvE, 5CtTGP7D9Re7AdGbViCrDGb8NFXJo9r74AnJsCmsfUBFTyx3, 5ENZGGyRryWv2siiDtCJjoVfQ1kWyTAAdeJqdpd8UBwoQqwE, 5EqaTXJdJL5yxA2aGmDJqZ5wdAVgMQV5HQvjhQs1EDas91w3, 5EqgctbbbAQd3j15fHSU6j2X5UZ2bap25sbW1vAUUxiquT6x, 5FNrTnVFL9zXUuaECGmMEgBSY6CLSc55JkVT4hATr7UGTCSF, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ, 5FqNMQqhaKPKc37jeFkPEUT5UhyArrDsmmkiv2GNoopXXp7M |
| Third week(2020.3.26)  | 5FTaCPEmwhMJ993ZLNM8GoHDw29SHxrpGogDB82sboCpMJRn, 5CqLTf8v2VpSnsCNjaRK78j6CRarcpQ8ZFD37XfSoCZZv1gY, 5GVrq2GR3xrGViFwV62rLDN6h8JnbaD2yp6rpYwYPNqVTb5Y, 5D77Fa9D5C2UgpQUGMioU468rTkoiCkRgQzfmAVxAN1RybB8, 5Ft5vRXS3K5JM8qNKM7AHDNRL7Ba8WvFtncDoSXuZx8WmbRf, 5FsQW2be7EaX4heyMML2GTJ8YRubCCmPDJGnUcyWi6x5oHFD, 5EUX3WAcTY6MVwcwHhPHodws9AHvKzi8JSe6n8RRmu3kktaY, 5H4Em4gYZe5g6Gzdsf38PWSuDSyU69neG2DhR45YQivTWZ3e, 5Cw43rv2Lk55UXqCpd4aDqo3iBPQ9PysBJYcGfsyQReyXSNP, 5F1TGRBPEwSnRdwJpMe5DicVvFfArfuHg3bCqez9iymweDTP, 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz, 5GNMwnyfd61242esJJGgbG5HbPXSkyQDZtiwdYoWnkoGr4zM, 5DqFgUVwGMGurJrJJTbtFA3U6HS6ezomTHnpbREKbnKjD9md, 5GYVq3dUaELqNN2idbmexv4PGWVhe7Pnp55m59WRGPpC7umX, 5HiYHwLSQme1Tmy3VAJYtkCiCSzPhrhfdnKDzvqZtpP6Npna, 5E1rH4B1Nji2xUeepgLCsEDuAdK7LZcWzwHvyM1iCjkkGk6K, 5GCc7JDdXQ8QKnm8itDBd7hbKCKziS8eDrTTFeXmj6HhKTHk, 5E4PBrtxKguhK2UwwqKWUqJFsbci9t1q9rS7rHE1gu1aBFmU, 5H1ea9WWJeTDLnMjcZ5eQFD6Twybnt8Ug3aVVjWGac4jwf78, 5H1ivDgZNqVAXKBsJz1mcfKPkZ6uqRFY7fAn6y2E1X7Yoxcx, 5FncmEPgwKZsb1Py2H9cV7uJqcv2SnYoatxkjNNTDjmH2fPt, 5DALdXmk5mzHHYoYHG7kp7ZGD8NZdYf7s6ATUzXsHpgXXWHk, 5H63r5WSEiCeKCif3r5dNvs6FfqWTNbTfQPhCiTUcGvgvrdN, 5EAXdqJxWoMDyguXvRdq9HSbekLjm4zATUriPMsiMRg7yyML, 5Dhahn4Wnziic2gExmc3qqiuy8Qvv3xTY7BaZZ78hU9a1gk1, 5HYYvAgKvhrLtZ1qvvoqEbZofPr6M2rngjNShHrz3YSHA1LN, 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X, 5HN3psqJsjtdpuH37ur6KVt4kywXCs5ox1bFnpMdEzBLF4Tf, 5Fgkcy5KGTCgvWPkoiaJURP4siSV5c3STfNc2JfGd1j2RaNh, 5GF6DQDRA6Gvva5L919Dk25vDRZe3q1gtGfMZ3A5vfEeERL6, 5Fni3JNZaBT9BEkHGVACPzvSuKJzL9JwiXTTNC4urK7FiFdp, 5GivH9nb6WsNPpKFXeqmr8RfMJeFFfy2GohkiwS79Di6wWR1, 5HjYCMgSjJB6Z7zuwV363QgVfn5vELCBDqPinXRbSmS7g3js, 5EvAprh9QEVm8RpcvLzPnyN4KkWvcyYovNphWJKtuL8k2hk4, 5GzotcPuXTpM7DKoErHDcEDxVDZamGvUDDyCPzpibaAgMKUa, 5Ec2mAe7Bt8ohdASVF5XmchtH2YZi7EdaDqXPGLFqeeAjUax, 5CB6bxLb9jDna7tAeJMAMRaFDsSjRhiEvwFJJpRDCLXBE55o, 5Gb2tKDMDz3RbQ7aMgmbfV7tEt9dBgdWEWz45YEZ1HvtZMJF, 5E9mW8wEG4nv2Q3kjMaKhhvi3N2d74GyD7pSzVUpsM5iPtTF, 5FLgkZCDXh76uoeCkmb3BG3Kg89Vg93y6mHf9qLta5zrSueM, 5Co5gdHrGVPSWtqJNH4sCZT2CpfSLKT6CHv4FrBWTVKGR8BT, 5E2R218ryzuina6vtSFn9vWsV8Wzt4tgFv76x4Cm1KaDGLMC, 5Cai5JiDcAqrP3ht5JM5eQXAN4o6FfuNzucydvvvEktodqup, 5HTHjJib4wzqsCGAvD8ekSUn1ZXu7tAk44Sv5wG5BEER8WoZ, 5DHtpAMFU5orY2SQQ5pr9KLC5ktzCuS4Tynx1WT3vQc4Pw5b, 5DhKbq3xPogHtt1qq1H999uuxhEcX649t2uF7TPswjFjhbGc, 5CwnyUJXNNgLG3EH1ckh8ztbs9Er5BWDhp6SpmSeEU8AjnS4, 5Ctt7FJubQyy5tvfnZeH2nhxgCDgZ9kLH9FtHd3b45MooLvF, 5DyEcs3fV2pmcTQVshC3Gr5WyA9f5xSMxirvzrgr7muoVG7M, 5CkkeUawQnUahc7r4MGEJZzG2Hk6Ks4FdUS5mbuupxhYjPQ7, 5Ei1MrxjHevWAC1csMj7fLbQSthkKTq6fdr99Wjdb9efU8vr, 5GVs4qFFeqPW6TDMgQndS5naDJaPupH9BPh89yFasvaJR3w6, 5ERFkyHHuuSvgKYLuPi5a6M21nmjNetF9ebwBD8j8ougSqJZ, 5FRg2xXPHAxQEa9gs9kgT8kEuKce8t3PECeEBVngvKiY1eVY, 5G9nNLmSu3V6wN9ak1wAcggjkBTYCiekktXPes277r1N7QgT, 5FNe2jbVpKSrYxQWeDGDCqADdBzCti4eLQvZQGbGg77t738w, 5FNmkE5pVgNYD8bhQQHYdTsDTcjQfLcjvJDwpKtLu3VXzfdA, 5G8s36VJDBosJyU2DSXo6EfPLdRAoseWKvCdheMkE1GTWQxw, 5HdVeZgqGHpobSTiGoSjEoFPgymQ8ntqKDAzPX34L1iqZhhJ, 5H6HU8HGXCjQuQ89rQsYWJ9F5514GL79JEPm73YqEKoSkuJs, 5E7Q7bmzGTM9nucizj4aU7BvNMAEYmLrqyDLP778Af4MTcTC, 5CQBYBqkNzrQhPk7Aphiao6PbfReTA8ZL1rhXPyN89N6oYq5, 5GWiHwc8op5bfpgKUC9PvHEq6SAGcpKS56UbKpzDQiWcFNiK, 5HBTBEGrBXiYyKTKoUoZNdMh9rWFGkbaKH3gYzB4GiCicrPx, 5CFWEetvgMwrD3DKAWTx2GvzGQAp92HXrmUQ5ZWdFJugMEfY, 5DfhQHjxm76hqBdspSUFQkpLi6kW9rC68S79TybwEsRHTXnv, 5HjhTLGk5V6HXuwjpdbHMWUXc5LH3rMtLKpcqSn8Z5x8xLUS, 5DwGBQghKE1G866jSEoQNmsEd6vmhDsZV8c294teVfiSAwiC, 5HC98cwkHcoUCUMNa1FkFhdRfVCJcmbme2g9A7k2d8AqDaf2, 5CD2P3xb3rRZrgBU9gg3EnAs8vHeePh7dLNvTmNTYFWHY15f, 5E9j9vym4fkYNPoiCZYoaDFPsFfh5xT8ZYVtUdG4dSjcGKHv, 5EWtmwLeMbsSHhYrPdZTYvhrmCEdgKwg2xtQYWqPHwjpuiEN, 5EcMpfF25Qavx7rXM8iUFYP4MiPyovY7DvMMag6stLfdRzQj, 5GBM5hNhzHerACkb5aFvK1X4T4CMmBSAVxSGmtsLFp7iPtky, 5Fpv2bqceAVA4GyX5BVfeJDwLdvjQEkaBbowJ9zAEGUQSsQJ, 5HgU1yCa7JbxzKMbRFpQSyEAqaB7fkyfBSUSsqBGRmDEE4cJ, 5F4TsvLEf1sny5Sdme59CHTWW6woKENiBQ4ifg23rjppe5Wg, 5G1J3dEnZ8UFzm7A98TPh3HxeETSgUANiCoN6DuiznfofHoc, 5FgqWEW3pmXrBmv5fxKxWnGXbbXgWvKbUowWPiXGxb1xZFv6, 5EU9HJ4cZ9mNuiHWTuLfoF2r1wSVZHERk6N19HACgwqKVbwM, 5ERoUbf1vi3AyPHgdmpq3YY3f6cghZHHiTWRMpeqXCBBnHNh, 5E7a8BMH7qM5YEj5F9srTP2EsjPqpehFpreecNSC8go5MMwG, 5FQu4kbg2xmrGJRTav8fjLjgFHqexDRaC2B6sajdaWeKNm2A, 5FWnCJZmjmKePwa4GgZTKXixroPdcSqJxcetNe5rQgBCq8S1, 5FbntrjzEG52j24fu2LWh9E5npkmAUzkTtqZRyAgGQRZ2SkF, 5EnufWonqNdwG8PKcyR5zr4ZU4ikHmLssJgurS4WeiuTfxuW, 5D8ETR2iZNihfnt9UJwUcB6JdyXMdMqbVk4eA1wag2zfSeWx, 5HYfqv8CYXrvAYWTnMdRUymPU9oHjemiC3C4qFYpBS4B2VFr, 5GWSkXePdirfvjPTDfci5WjQJ8D3UtvZ76ezaDbWAUu2FdsZ, 5EJ2oFrVRPYeqNRjeWby4j9YE9xAYgi9d85Wsbzbz65ZA5P8, 5DPp1sn9ej8Dk4TEtjgxpL77J8aVSYvutDx2FUkMcsaNkKsV, 5G9i9UgfogCH6VGSX3eb1LG44XYdgcpj5PRbCFP7qMN3A8MF, 5CaME74bajSwYpHzEHokqTbYTAYK4nBjRj1s3GLfHaK5hU9i, 5FLRD9adTbffu9fhXhWDJ1gebvRX6agwAvjwjHASH2Vbibh1, 5DZbHfGpV35KGKX8Tbk31SFTm21fK45XsjW6SUadXGM52Fad, 5E6yNVh4xvz6MM9F5HCADgsXHJaGy562aSCZsiDkJSXmgcts, 5HQUyy93BQn5cQPK4ZFCjLNSZhSGesHiuHayvXxD7jThoQcT, 5EHPJHWewSnyni4Veqp6A4TDqUnN1K6fnzb1GRH1Y5uYHJrz, 5DvvkoutiYLAcKHzUH7tvtFZK2yBtx3wszNxUkTivLTjb8HU, 5FZWwEnfMuUgxCxvWkfxuUh7nnEct1tEuDpDmfbCQ3duWpaE, 5Da7gXBqzNax61FPu4F53GTCnVippegmRK96d5vs79XUoqNZ, 5Dk8XfuSZvsu6tYTcEX3yBQgK4xfAyoQQzErQAXkpHuScL4F, 5F9uATGtQairBzbLRW4jjNucCrAVCD74iDHan5Z4wMLjPkoR, 5DcvxiYpLnAUxNopcTYZFKKi7igp9CuRExAV5QUErroBGA3E, 5DxsXxCQtcR9AMyV5ENccP5pkTii2hGnwo9uMJSL1HrUZqLz, 5FCe5niGxQmKZWfzLWeujk65tAM8q9mkHfgbHdVWNxZ5Nhfu |

#### -Blogging Acala

| Medium link                                                                                                                                                                                                                                                                                                  | Mandala address                                  | Results                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------ |
| [https://medium.com/@x.zhang/acala-network-liquidize-your-staked-assets-for-defi-839c63ba8f32](https://medium.com/@x.zhang/acala-network-liquidize-your-staked-assets-for-defi-839c63ba8f32)                                                                                                                 | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward, claps: 456                         |
| [https://medium.com/@v.cryptor/acala-network-a-multi-collateral-and-cross-chain-capable-stable-coin-architecture-e0f0f8cbf156](https://medium.com/@v.cryptor/acala-network-a-multi-collateral-and-cross-chain-capable-stable-coin-architecture-e0f0f8cbf156)                                                 | 5Fj8pQ1e7iDfrAvae9k6WhrZRqM4Lqd6Umvk8J9cg1BXcJL9 | reward, claps: 427                         |
| [https://medium.com/@x.zhang/24-cities-world-wide-join-the-acala-mandala-candy-festival-today-3445432340c0](https://medium.com/@x.zhang/24-cities-world-wide-join-the-acala-mandala-candy-festival-today-3445432340c0)                                                                                       | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward, claps: 450                         |
| [https://medium.com/@dujason1215/acala-airdrop-tutorial-a9dd2a9a39f](https://medium.com/@dujason1215/acala-airdrop-tutorial-a9dd2a9a39f)                                                                                                                                                                     | 5DvszTc6FJAmyhE6v5ZJhchtGH1ZQ2KR7iZi7g2776EX2ZQ7 | reward, claps: 378                         |
| [https://medium.com/@gafaruzb70/acala-network-fbc2e335c50](https://medium.com/@gafaruzb70/acala-network-fbc2e335c50)                                                                                                                                                                                         | 5DCdUUZSEsdB3JBwdyQsKjEwdjWLyVajJaeki66M5YhGYWyK | encourage:333 ACA + 16,666 KAR, claps: 256 |
| [https://medium.com/@qash0430/cross-chain-stablecoin-platform-based-on-substrate-acala-5697bc34d24](https://medium.com/@qash0430/cross-chain-stablecoin-platform-based-on-substrate-acala-5697bc34d24)                                                                                                       | 5DSKU5oM1FcCjvRVKpF6rGPpvnZaMk6HmP9tZjSiJwakGhzn | reward, claps: 369                         |
| [https://medium.com/@jgm5676/acala-the-forerunner-of-defi-55d35b308867](https://medium.com/@jgm5676/acala-the-forerunner-of-defi-55d35b308867)                                                                                                                                                               | 5EJR3vqBw8y2X4TNhqGHi7NzYM5H9DcyfdJM5XjrnH2CC6jt | reward, claps: 376                         |
| [https://medium.com/@x.zhang/need-for-new-defi-infrastructure-why-acala-2f7cb4e6d27b](https://medium.com/@x.zhang/need-for-new-defi-infrastructure-why-acala-2f7cb4e6d27b)                                                                                                                                   | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward, claps: 419                         |
| [https://medium.com/@liquid19922/acala-consortium-the-first-global-decentralized-financial-ecological-alliance-8e414ded220e](https://medium.com/@liquid19922/acala-consortium-the-first-global-decentralized-financial-ecological-alliance-8e414ded220e)                                                     | 5D7eU4gL7GYQy1GhiwfLBUkXWogVnuaqag86SBXgvwxZQSxn | reward, claps: 373                         |
| [https://medium.com/@Jackie007/how-will-acala-reshape-the-defi-ecosystem-in-the-future-59da733746ef](https://medium.com/@Jackie007/how-will-acala-reshape-the-defi-ecosystem-in-the-future-59da733746ef)                                                                                                     | 5EU2iHgcRyDxrWPg63eYHu4qQUVztEsu5Gj4mQYNsVuADkhJ | reward, claps: 385                         |
| [https://medium.com/@kira1996/the-last-three-days-of-polkadots-ecological-high-quality-airdrop-event-come-and-win-acala-1b49656bbaf7](https://medium.com/@kira1996/the-last-three-days-of-polkadots-ecological-high-quality-airdrop-event-come-and-win-acala-1b49656bbaf7)                                   | 5GgQbgzvpPJvpVQMi96Dj8ZP7EnEZZDoJJma9XTcuge8yxs8 | encourage:333 ACA + 16,666 KAR, claps: 366 |
| [https://medium.com/@lapinandr6/acala-%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5-%D1%81%D0%BB%D0%BE%D0%B2%D0%BE-%D0%B2-%D0%BC%D0%B8%D1%80%D0%B5-defi-5e72720ea4f9](https://medium.com/@lapinandr6/acala-%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5-%D1%81%D0%BB%D0%BE%D0%B2%D0%BE-%D0%B2-%D0%BC%D0%B8%D1%80%D0%B5-defi-5e72720ea4f9) | 5HEn1YtswEWpqpC9E2E21nCtUqgdJLQ1UfErVombGfHnKaGq | encourage:333 ACA + 16,666 KAR, claps: 222 |
| [https://link.medium.com/6OOcykqN84](https://link.medium.com/6OOcykqN84)                                                                                                                                                                                                                                     | 5ELbRUyqUbiDei3F7kAwofGGaQx1NQEaQnVN1qL11uyZUCfh | encourage:333 ACA + 16,666 KAR, claps: 287 |
| [https://medium.com/@Jackson1992/defi-communitys-new-solution-to-the-crisis-acala-951c6db55a0b](https://medium.com/@Jackson1992/defi-communitys-new-solution-to-the-crisis-acala-951c6db55a0b)                                                                                                               | 5HKSjHopywfVCnVi4id3mD8rmPBmkx4YSnY6mrHURzRtB3jw | reward, claps: 371                         |
| [https://medium.com/@willianm/acala-received-investment-from-several-well-known-institutions-around-the-world-b96c47d8f52e](https://medium.com/@willianm/acala-received-investment-from-several-well-known-institutions-around-the-world-b96c47d8f52e)                                                       | 5FKwpUEGHMVG3N58vCgkNF99JhHFGrji71CU8nHf1XRoa72L | encourage:333 ACA + 16,666 KAR, claps: 351 |

| bihu.com link                                                              | Mandala address                                  | Results |
| -------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| [https://bihu.com/article/1320663805](https://bihu.com/article/1320663805) | 5Exyar4kUgMtVgSNeeb1nzxQyyJuxmSFnjXHgAka1TneAmx6 | reward  |
| [https://bihu.com/article/1142130267](https://bihu.com/article/1142130267) | 5FsEUyCnLhdv8jdT6X4rYB6WKi8VKazXahnSeh1ezhkTWUgz | reward  |
| [https://bihu.com/article/1641183755](https://bihu.com/article/1641183755) | 5Gzcw4k6Wmjt3x5YgFDFigbzBfNjubtVNzStdNmJxmkwgmG5 | reward  |
| [https://bihu.com/article/1237192450](https://bihu.com/article/1237192450) | 5FyPtyPjFWAxceKutcJTLDi5vymn8jJCb5pRkqBYrd9LEEqF | reward  |
| [https://bihu.com/article/1074339537](https://bihu.com/article/1074339537) | 5CqLTf8v2VpSnsCNjaRK78j6CRarcpQ8ZFD37XfSoCZZv1gY | reward  |
| [https://bihu.com/article/1763139738](https://bihu.com/article/1763139738) | 5FRgjqWr4c7gXpoCvFRg7Ms9yz4BY2AevT2X1VfTCNTWLEEw | reward  |
| [https://bihu.com/article/1154798571](https://bihu.com/article/1154798571) | 5GRbkRH3hi1vbuNd7s3eW9u2YRfhMtDJVVCe3a8M1jvhBuvZ | reward  |
| [https://bihu.com/article/1444069078](https://bihu.com/article/1444069078) | 5CLqztk7F4XcHGqPKRTB6TTPPnS4HpCowoTPfgY6x6bBZtNT | reward  |
| [https://bihu.com/article/1898324332](https://bihu.com/article/1898324332) | 5EKsgSQKi6TGhmHVfVpC3n75G7LSXbAFp68xVmrcKx6V9WQK | reward  |
| [https://bihu.com/article/1613514055](https://bihu.com/article/1613514055) | 5HEfj4Tbk8xNtSPoF1Qg1DocZmTZ3BZedF8ucJhm6GavgrmW | reward  |

#### -Coding

#### -Runtime Bugs

| Github issue                                                                                         | Mandala address                                  | Judging results |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------- |
| [https://github.com/AcalaNetwork/Acala/issues/152](https://github.com/AcalaNetwork/Acala/issues/152) | 5FLcXWfs1hpRqbT4Rv5ACHkenqCGL5MPTDDeFtBFrogY3D9V | reward          |

#### -UI Bugs

| Github issue                                                                                                           | Mandala address                                  | Judging results |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------- |
| [https://github.com/AcalaNetwork/honzon-platform/issues/18](https://github.com/AcalaNetwork/honzon-platform/issues/18) | 5FLcXWfs1hpRqbT4Rv5ACHkenqCGL5MPTDDeFtBFrogY3D9V | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/19](https://github.com/AcalaNetwork/honzon-platform/issues/19) | 5FLcXWfs1hpRqbT4Rv5ACHkenqCGL5MPTDDeFtBFrogY3D9V | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/23](https://github.com/AcalaNetwork/honzon-platform/issues/23) | 5GR5ZkscxFJHRroPDPG6TxZ28xGJBnsrYXJCR9nbmiuWWEDR | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/31](https://github.com/AcalaNetwork/honzon-platform/issues/31) | 5G8jj92pf4yG9cQmQ6mbRUqBePMptB37b7GGBg8FMoDKL9Gv | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/33](https://github.com/AcalaNetwork/honzon-platform/issues/33) | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/35](https://github.com/AcalaNetwork/honzon-platform/issues/35) | 5G8jj92pf4yG9cQmQ6mbRUqBePMptB37b7GGBg8FMoDKL9Gv | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/37](https://github.com/AcalaNetwork/honzon-platform/issues/37) | 5F52pY196ZVifs3xGvBK5RTFuWMLsxNPrTfTTfk7NHC4YrS7 | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/39](https://github.com/AcalaNetwork/honzon-platform/issues/39) | 5F52pY196ZVifs3xGvBK5RTFuWMLsxNPrTfTTfk7NHC4YrS7 | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/44](https://github.com/AcalaNetwork/honzon-platform/issues/44) | 5HiYHwLSQme1Tmy3VAJYtkCiCSzPhrhfdnKDzvqZtpP6Npna | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/49](https://github.com/AcalaNetwork/honzon-platform/issues/49) | 5GBM5hNhzHerACkb5aFvK1X4T4CMmBSAVxSGmtsLFp7iPtky | reward          |
| [https://github.com/AcalaNetwork/honzon-platform/issues/53](https://github.com/AcalaNetwork/honzon-platform/issues/53) | 5FHCaBgXVmj4iStBArBgPKubNJGRZCjja1j1SfdaKMu5KA2X | reward          |

### Mandala Festival Season 1 Rules & Rewards

To celebrate & reward supporters, we're hosting the Mandala Festival Prize Drops Party popper Giving out approx. 100,000 ACA & 5,000,000 KAR (Karura Canary Network token). See details [here](https://medium.com/acalanetwork/mandala-festival-prize-drops-3ae68df0dfa6).

#### Time-limited Candy Drops

**Run a Node**

**3 prizes (55 ACA & 2,777 KAR) EACH DAY** till 27th Mar Collision symbol

* Follow this guide [https://github.com/AcalaNetwork/Acala/wiki/4.-Maintainers](https://github.com/AcalaNetwork/Acala/wiki/4.-Maintainers)
* Remember to put **first 10 char of your prize claim address using `--name`**
* Also remember to get some test tokens so we can verify it

**Use Acala DApp**

**116 prizes (66 ACA & 3,333 KAR) every week**

* 10 top accounts with maximum gain or loss will be awarded
*   106 lucky accounts will be drawn from all qualified

    Use [https://apps.acala.network](https://apps.acala.network) or [https://polkadot.js.org/apps](https://polkadot.js.org/apps)

**Blog Acala**

**20 prizes (666 ACA & 33,333 KAR)** till 31 Mar

* Submit a blog to Medium or Bihu
* Remember to **include your Acala Mandala Address in the article to receive prizes**
* Submit the article link to [https://riot.im/app/#/room/#acala:matrix.org](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_BLOG

## Ongoing Rewards

### Coding

**ELIGIBILITY** Anything built with or on top of Acala that inspires you and excites you. This could be bots, DApps, services, tooling… Please provide the following: 1. Clearly articulate the problem and solution 2. Complete at least a proof-of-concept runnable code 3. Provide appropriate documentation 4. Put your Acala Mandala Address inside your code repo e.g. in README 5. Submit your code to [Acala Riot Channel](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_CODE

**REWARD** Each prize will be **at least 1,000 ACA and 60,000 KAR**, more can be awarded depends on coolness, significance, usefulness, quality, and other aspects the Acala Engineers may see fit.

The total prize pool is capped at 40,000 ACA and 2,000,000 KAR, and Acala reserves the right to extend it further.

**PRIZE GIVING** 1. Please allow 2 weeks upon submission for review. 2. Prize tokens will be dropped to the address provided inside the code repo submitted. 3. **We may fund the project further where it seems fit** 🚀

### Runtime Bug Bounty

**ELIGIBILITY** Help identify bugs in Acala mainly for this repo [https://github.com/AcalaNetwork/Acala](https://github.com/AcalaNetwork/Acala).

Generally, a bug that poses significant vulnerability or causing systemic defects would be eligible. 1. Open an issue in Github, provide as much information as you can, including a description of the bug, its potential impact, steps for reproducing it 2. Include your Acala Mandala Address for prize giving in the Github issue 3. Submit the issue to [Acala Riot Channel](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_RUNTIME\_BUG

**PRIZE** **Total Prize Pool**: 16,666 ACA and 833,333 KAR, and Acala reserves the right to extend it further.

Bugs are judged on significance and severity by the Acala Engineering team, and are awarded based roughly on the levels below:

* **Level A (2,000 ACA + 100,000 KAR)**: significant logic and process volunerability; sensitive or highly probably to create significant impacts to the system
* **Level B (1,000 ACA + 50,000KAR)**: intermediate logic and process volunerability
* **Level C (300 ACA + 15,000 KAR)**: mild vulnerability or bugs that interrupts or breaks system expected operation

**PRIZE GIVING** 1. Please allow 1 week upon submission for review. 2. Prize tokens will be dropped to the address provided in the issue submitted.

### UI Bug Bounty (Closed)

Generally, a bug that poses significant vulnerability or causing systemic defects would be eligible. 1. Open an issue in Github, provide as much information as you can, including a description of the bug, its potential impact, steps for reproducing it 2. Include your Acala Mandala Address for prize giving in the Github issue 3. Submit to the [Acala Riot Channel](https://riot.im/app/#/room/#acala:matrix.org) with keyword CANDY\_UI\_BUG

**PRIZE** **Total Prize Pool**: 2,000 ACA and 100,000 KAR, and Acala reserves the right to extend it further.

Bugs are judged on significance and severity by the Acala Engineering team, and are awarded based roughly on the levels below:

* **Level A (1,000 ACA + 50,000 KAR)**: significant logic and process volunerability; sensitive or highly probably to create significant impacts to the system.
* **Level B (200 ACA + 10,000KAR)**: intermediate logic and process volunerability.
* **Level C (80 ACA + 4,000 KAR)**: mild vulnerability or bugs that interrupts or breaks system expected operation.

**PRIZE GIVING** 1. Please allow 1 week upon submission for review. 2. Prize tokens will be dropped to the address provided in bug submission.


# Set up an Oracle

## Setting up a Provider

An oracle Network Provider can implement their own oracle pallets (based on [the default oracle pallet](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/oracle)) to meet their specific requirements such as validating cross-chain data feeds. We can also easily integrate with existing signed oracle APIs such as [Coinbase price oracle](https://blog.coinbase.com/introducing-the-coinbase-price-oracle-6d1ee22c7068) by simply adding a Coinbase Provider pallet and validate their signature.

Then add the oracle provider to the runtime (see [Acala Oracle](https://github.com/AcalaNetwork/Acala/blob/master/runtime/mandala/src/lib.rs#L447)) which would be enacted through runtime upgrade.&#x20;

### Setting up Operator Nodes

A Provider can add multiple operator nodes to its oracle network, an example operator node [here](https://github.com/laminar-protocol/oracle-server).

## Join the Open Oracle Gateway

The Oracle Gateway is deployed and running on Acala’s Mandala Test Network. In addition to the Acala team and Laminar team, the Band Protocol team has also contributed to the development of the Gateway. We hope the Gateway becomes a common good infrastructure for the Acala, Polkadot, Kusama and the cross-chain DeFi ecosystem in general. Therefore we welcome oracle service providers to check out the Gateway source code, talk to us about integration, contribute to the codebase and provide your services to an ever-growing ecosystem.

**Pre Acala/Karura genesis**

* please contact us directly (hello at acala dot network) or ask on [Discord](https://www.acala.gg/) to express your interest
* submit a Pull Request
* we'll review and approve PR
* then merge the code and deploy on the testnet

**Post Acala/Karura genesis**

* please contact Acala/Karura council to raise interest & seek approval
* upon approval, submit a Pull Request&#x20;
* code review and merge
* runtime upgrade


# How to change default fee token

## Default Fee Token

You can check default fee token order on-chain, go to [Polkadot Webapp](https://polkadot.js.org/apps) - Select the chain (Acala or Karura)

Navigate to `Developer` - `Chain state` > `Constants` >`transactionPayment defaultFeeSwapPathList`

![](../../.gitbook/assets/screen-shot-2021-08-04-at-9.06.14-pm.png)

On Acala, the order might be ACA > aUSD > LCDOT > DOT.

If a user has no ACA balance, then aUSD will automatically be used as fee token.

Users can set their next default fee token to other tokens by executing the following transaction:

```
transactionPayment.setAlternativeFeeSwapPath(fee_swap_path)
```


---
description: How to find tokens and NFTs on Acala & Karura
---

# Finding Tokens and NFTs

#### The instructions below are for participants in the Karura Parachain Auction Waitlist Competition. <a href="#1-1st-place-apple-ipad-and-25-kar-bonus" id="1-1st-place-apple-ipad-and-25-kar-bonus"></a>

#### 1. 1st place, Apple iPad and 25% KAR Bonus <a href="#1-1st-place-apple-ipad-and-25-kar-bonus" id="1-1st-place-apple-ipad-and-25-kar-bonus"></a>

iPad prize has been processed. The bonus associated with your KSM address is now saved in our records. The bonus will be applied to the KSM contributed to the Karura Crowdloan.

#### 2. Top 2-10 winners, (KAR Crowdloan Bonus). <a href="#2-top-2-10-winners-kar-crowdloan-bonus" id="2-top-2-10-winners-kar-crowdloan-bonus"></a>

This reward associated with your KSM address is now saved in our records. The bonus will be applied to the KSM contributed to the Karura Crowdloan.

When the Karura Crowdloan occurs, users can also recommend others to participate in Crowdloan, and the system will give additional rewards to these users. To be eligible for this referral bonus, please ensure your email is registered on the [Karura Waitlist](https://forms.gle/VgbojfKp46CoGE328).

#### 3. Top 11-100 Winners, Special NFTs: <a href="#3-top-11-100-winners-special-nfts" id="3-top-11-100-winners-special-nfts"></a>

* Desktop: Please use the plugin wallet ([https://polkadot.js.org/extension/](https://polkadot.js.org/extension/)) to import your Kusama account. Check it through the Dapp ([https://apps.acala.network/wallet](https://apps.acala.network/wallet)), Under the `Collectibles` column.\
  ![](https://i.imgur.com/fCDF0C6.png)
* Mobile: Import your account into the mobile wallet ([https://polkawallet.io](https://polkawallet.io/)), Switch network to Acala Mandala. If it does not appear, it may be the cause of network delay.\
  ![](https://i.imgur.com/JFeB0K1.png)

#### 4. Everyone with over 130 Gleam entries wins 3 KAR (For Ledger, scroll below) <a href="#4-everyonenbspwith-over-130-gleam-entries-wins-3-kar" id="4-everyonenbspwith-over-130-gleam-entries-wins-3-kar"></a>

> KAR is now a certificate on the Mandala testnet and cannot be transferred. It can be claimed after the Karura network is online.

* Desktop: Please use the plugin wallet ([https://polkadot.js.org/extension/](https://polkadot.js.org/extension/)) to import your Kusama account. And check it through the Acala Dapp ([https://apps.acala.network/#/wallet](https://apps.acala.network/#/wallet)), Under `Wallet` -> `AirDrop`.\
  ![](https://i.imgur.com/IQiTcIi.png)
* Mobile: Import your account into the mobile wallet ([https://polkawallet.io](https://polkawallet.io/)), Switch network to Acala Mandala. Under `AirDrop`.\
  ![](https://i.imgur.com/EI8mFb5.png)



* **Ledger**:&#x20;
  * Connect your Ledger and navigate to [https://polkadot.js.org/apps](https://polkadot.js.org/apps)
  * Switch network to Mandala.
  * Click `Developer` -> `Chain state`  -> `Airdrop` -> `airdrop`
  * It will show you the airDrop Balance like the image below:

![](<../.gitbook/assets/image (3) (1).png>)



>
# Glossary

{% hint style="info" %}
\[TODO] Need to add Acala network mechanism related vocabulary.
{% endhint %}

### Acala

The Decentralized Financial Network for Stablecoin and Staking Liquidity, will be connected to the Polkadot network as a parachain.

### ACA

The abbreviation for Acala network tokens.

### Attestation

In the Polkadot validity system, an _attestation_ is a type of message that validators broadcast that says whether they think a parachain candidate block is valid or invalid.

### Authority

An authority is a generic term for the role in a blockchain that is able to participate in the consensus mechanisms. In GRANDPA, the authorities vote on chains they consider final. In BABE, the authorities are block producers. Authority sets can be chosen be mechanisms such as Polkadot's NPoS algorithm.

### BABE

\_B\_lind \_A\_ssignment of \_B\_lock \_E\_xtension is Polkadot's block production mechanism.

### Block

A collection of data, such as transactions, that together indicates a state transition of the blockchain.

### Block explorer

An application that allows a user to explore the different blocks on a blockchain.

### BLS

Boneh-Lynn-Shacham (BLS) signatures have slow signing, very slow verification, require slow and much less secure pairing friendly curves, and tend towards dangerous malleability. Yet, BLS permits a diverse array of signature aggregation options far beyond any other known signature scheme, which makes BLS a preferred scheme for voting in consensus algorithms and for threshold signatures.

### Bonding

A process by which tokens can be "frozen" in exchange for some other benefit. For example, staking is a form of bonding for which you receive rewards in exchange for securing the network. You can also bond tokens in exchange for a parachain slot.

### Bridge

A parachain that acts as an intermediary between the Polkadot Relay Chain and an external chain, in such a way that it appears to the Relay Chain that the external chain is a parachain (i.e., meets the Polkadot Host's requirements of parachains). Bridges allow for interaction between other blockchains, such as Ethereum and Bitcoin, that are not natively compatible with Polkadot.

### Byzantine Fault Tolerance

The property of a system that is tolerant of Byzantine faults; that is, a system where not only may individual subsystems fail, but it may not be clear if a particular subsystem has failed or not. That is, different observers on the system may not agree on whether or not the system has failed. Ensuring Byzantine fault tolerance is an important part of developing any distributed system.

### Collator

A node that maintains a parachain by collecting parachain transactions and producing state transition proofs for the validators.

### Consensus

The process of a group of entities to agree on a particular data value (such as the ordering and makeup of blocks on a blockchain). There are a variety of algorithms used for determining consensus. The consensus algorithm used by Polkadot is GRANDPA.

### Dapps

A generic term for a decentralized application, that is, one that runs as part of a distributed network as opposed to being run on a specific system or set of systems.

### DOTs

The native token for Polkadot. DOTs serve three purposes: network governance (allowing them to vote on network upgrades and other exceptional events), general operation (rewarding good actors and punishing bad actors), and bonding (adding new parachains by "freezing" DOTs while they are connected the Relay Chain).

### Duty Roster

A lookup table that specifies the job that a particular validator is required to do (i.e. attest to the validity of a specific paracahain). The duty roster routinely shuffles the validator set into different subsets per parachain.

### Epoch

An epoch is a time duration in the BABE protocol that is broken into smaller time slots. Each slot has at least one slot leader who has the right to propose a block. In Kusama, it is the same duration as a [session](https://wiki.polkadot.network/docs/en/glossary#session).

### Era

A (whole) number of sessions, which is the period that the validator set (and each validator's active nominator set) is recalculated and where rewards are paid out.

### Equivocation

Providing conflicting information to the network. BABE equivocation entails creating multiple blocks in the same slot. GRANDPA equivocation would consist of signing multiple conflicting chains.

### Extrinsic

State changes that come from the outside world, i.e. they are not part of the system itself. Extrinsics can take two forms, "[inherents](https://wiki.polkadot.network/docs/en/glossary#inherent)" and "[transactions](https://wiki.polkadot.network/docs/en/glossary#transaction)".

### Finality

The property of a block that cannot be reverted. Generally, created blocks are not final until some point in the future - perhaps never, in the case of "probabilistic finality". The Polkadot Relay Chain uses a deterministic finality gadget known as [GRANDPA](https://wiki.polkadot.network/docs/en/glossary#GRANDPA-consensus-algorithm).

### Finality Gadget

A mechanism that determines finality.

### Fisherman

Nodes that monitor the network for validators or collators who are behaving badly. Fishermen must stake a small amount of DOTs but can be rewarded greatly if they find bad behavior.

### Frame

The collection of Substrate-provided pallets (Substrate Runtime Modules).

### Genesis

The origin of a blockchain, also known as block 0. It can also be used to reference the initial state of the blockchain at origination.

> Example: "In the _genesis_ state Alice, Bob, and Charlie had 30 tokens each."

### Governance

The process of determining what changes to the network are permissible, such as modifications to code or movement of funds. The governance system in Polkadot is on-chain and revolves around stakeholder voting.

### Governance Council

An on-chain entity that consists of several on-chain accounts (starting at 6, eventually moving to the final value of 24). The Council can act as a representative for "passive" (non-voting) stakeholders. Council members have two main tasks: proposing referenda for the overall stakeholder group to vote on and cancelling malicious referenda.

### GRANDPA Finality Gadget

GHOST-based Recursive ANcestor Deriving Prefix Agreement. It is the finality gadget for Polkadot, which allows asynchronous, accountable, and safe finality to the blockchain. For an overview of GRANDPA, see this Medium post: [https://medium.com/polkadot-network/polkadot-proof-of-concept-3-a-better-consensus-algorithm-e81c380a2372](https://medium.com/polkadot-network/polkadot-proof-of-concept-3-a-better-consensus-algorithm-e81c380a2372)

### Hard Fork

A permanent diversion of a blockchain that can occur quickly due to a high priority change in a consensus rule. Clients who follow a hard fork always need to upgrade their clients in order to continue following the upgraded chain. Hard forks are considered permanent divergences of a chain for which non-upgraded clients are following consensus rules incompatible to the ones followed by upgraded clients.

### Hard Spoon

Defined by Jae Kwon of Cosmos as "a new chain that takes into account state from an existing chain; not to compete, but to provide broad access." A non-contentious blockchain that inherits the state of the underlying blockchain and creates a new branch of _the same blockchain_.

### Inherent

Extrinsics that are "inherently true." Inherents are not gossiped on the network and are put into blocks by the block author. They are not provably true the way that the desire to send funds is, therefore they do not carry a signature. A blockchain's [runtime](https://wiki.polkadot.network/docs/en/glossary#runtime) must have rules for validating inherents. For example, timestamps are inherents. They are validated by being within some margin that each validator deems reasonable.

### **Karura Network**

Karura is a parachain on the Kusama network and serves as the experimental network for Acala. As an experimental network with real economic value, Karura is a proving ground for protocol upgrades and a place to experiment with new DeFi protocols and on-chain governance.

### KAR

The abbreviation for Karura network tokens.

### KSM

The abbreviation for Kusama network tokens.

### Kusama

The experimental network for Polkadot. It consists of an early-release of the Polkadot software. It is not a testnet - after the transition to NPoS, the network is entirely in the hands of the community (i.e., Kusama token holders).

### LIBP2P

An open-source library for encrypted peer-to-peer communications and other networking functionality. More information at: [https://libp2p.io/](https://libp2p.io/)

### Liveness

The property of a distributed system that it will eventually come to some sort of consensus. A system stuck in an infinite loop would not be considered live, even if computations are taking place; a system that eventually provides a result, even if incorrect or it takes a long time, is considered to have liveness.

### **Mandala Test Network**

A risk-free and value-free playground for us, users and developers to test drive functionalities of Acala.&#x20;

### Message

In Polkadot's XCMP protocol, a _message_ is arbitrary data that is sent from one parachain (the egress chain) to another (the ingress chain) through a channel and ensured delivery by the vaidator set.

### Message Queue

In Polkadot's XCMP protocol, a _message queue_ is the list of messages waiting to be process by a particular receiving parachain over a channel.

### Node Explorer

A tool that gives you information about a node, such as the latest blocks sealed, finalized, and the current chain state as known by that node.

### Nominated Proof of Stake (NPoS)

A Proof-of-Stake system where nominators back validators with their own stake as a show of faith in the good behavior of the validator. Nominated Proof-of-Stake differs from the more generic concept Delegated Proof-of-Stake in that nominators are subject to loss of stake if they nominate a bad validator; delegators are not subject to loss of stake based on the behavior of the validator. Note that some other blockchain technologies may use the term Delegated Proof-of-Stake, even if delegators can be slashed. Polkadot uses the Phragmen method to allocate stake to nominees.

### Nominator

Accounts that select a set of validators to nominate by bonding their tokens. Nominators receive some of the validators' rewards, but are also liable for slashing if their nominated validators misbehave.

### On-chain Governance

A governance system of a blockchain that is controlled by mechanisms on the blockchain. On-chain governance allows decisions to be made in a transparent manner. Note that there are a variety of different algorithms for making these decisions, such as simple majority voting, adaptive quorum biasing, or identity-based quadratic voting.

### Oracle

Oracles provide pricing information for assets on the Acala Network.&#x20;

### Pallet

A Substrate runtime module.

### Parachain

A blockchain that meets several characteristics that allow it work within the confines of the Polkadot Host. Also known as "parallelized chain."

### Parachain Registry

A relatively simple database-like construct that holds both static and dynamic information on each chain.

### Parity Technologies

A company, founded by Dr. Gavin Wood, that is developing Substrate and Polkadot. It has also released several other projects including Parity Ethereum and Parity Secret Store.

### Polkadot

A heterogeneous, multi-chain network allowing various blockchains of different characteristics to perform arbitrary, cross-chain communication under shared security.

### Proof of Stake (PoS)

A method of selecting participation in a consensus system, in which participants are chosen based on how many tokens they have at stake (at risk of loss due to misbehavior). Normally, Proof-of-Stake systems limit the number of participants.

### Proof of Validity

A proof produced by parachain collators. Based on this proof and the parachain registry, a validator can verify that a parachain has properly executed its state transition function. Proofs of Validity go into the Relay Chain blocks.

### Proof of Work (PoW)

A method of selecting participants in a consensus system, typically the longest chain rule, in which participants try to solve a puzzle like finding a partial pre-image of a hash. Normally, a Proof-of-Work system can have any number of participants.

### Proposal

A potential function call to be voted on in a referendum. Proposals modify the behavior of the Acala network, from minor parameter tuning all the way up to replacing the runtime code.

### Protocol

A system of rules that allows two or more entities of a communications system to transmit information. The protocol defines the rules, syntax, semantics and synchronization of communication and possible recovery methods.

### Random Seed

A random seed is pseudo-random number available on-chain. It is used in various places of the Polkadot protocol, most prominently in [BABE](https://wiki.polkadot.network/docs/en/glossary#babe) the block production mechanism.

### Referendum

A vote on whether or not a proposal should be accepted by the network. Referenda may be initiated by the Governance Council, by a member of the public, or as the result of a previous proposal. Stakeholders vote on referenda, weighted by both the size of their stake (i.e. number of DOTs held) and the amount of time they are willing to lock their tokens.

### Relay chain

The chain that coordinates consensus and communication between parachains (and external chains, via bridges).

### Runtime

The state transition function of a blockchain. It defines a valid algorithm for determining the state of the next block given the previous state.

### Runtime Module

A module that implements specific transition functions and features one might want to have in their runtime. Each module should have domain-specific logic. For example, a Balances module has logic to deal with accounts and balances. In Substrate, modules are called "pallets".

### Safety

The property of a distributed system indicating that a particular state transition will not be reverted. GRANDPA provides _deterministic_ safety. That is, for a state changed marked as "safe" or "final", one would require a hard fork to revert that change.

### Sealing

The process of adding a block to the Relay Chain. Note that finalization is a separate process - blocks are finalized some time after they are sealed.

### Session

A session is a Substrate implementation term for a period of time that has a constant set of validators. Validators can only join or exit the validator set at a session change.

### Session Certificate

A message containing a signature on the concatenation of all the Session keys. Signed by the Controller.

### Session Key

Hot keys that are used for performing network operations by validators, for example signing GRANDPA commit messages.

### Shared Security

The security model that Polkadot uses whereby all chains are equally secured. This is acheived by placing proofs of validity of parachain blocks into the Relay Chain such that, in order to revert finality of a single parachain, an attacked would need to attack the entire Polkadot system.

### Slashing

The removal of a percentage of an account's DOTs as a punishment for a validator acting maliciously or incompetently (e.g., equivocating or remaining offline for an extended period of time).

### Soft Fork

A backwards compatible change to client code that causes upgraded clients to start mining a new chain. Requires a "vote-by-hashrate" of majority of miners in order to enact successfully. Soft forks are considered temporary divergences in a chain since non-upgraded clients do not follow the new consensus rules but upgraded clients are still compatible with old consensus rules.

### Staking

The act of bonding tokens (for Polkadot, DOTs) by putting them up as "collateral" for a chance to produce a valid block (and thus obtain a block reward). Validators and nominators stake their DOTs in order to secure the network.

### State transition function

A function that describes how the state of a blockchain can be transformed. For example, it may describe how tokens can be transferred from one account to another.

### Substrate

A modular framework for building blockchains. Polkadot, Kusama, and Acala built using Substrate. Chains built with Substrate will be easy to connect as parachains.

### Tabling

In Polkadot governance, bringing a proposal to a vote via referendum. Note that this is the British meaning of "tabling", which is different than the US version, which means "to postpone" a measure.

### Transaction

An extrinsic that is signed. Transactions are gossiped on the network and incur a transaction fee. Transactions are "provably true", unlike inherents. For example, one can prove that Alice wants to send funds to Bob by the fact that she signed a transfer-funds message with her private key.

### Validator

A node that secures the Relay Chain by staking DOTs, validating proofs from collators on parachains and voting on consensus along with other validators.

### Voting

The process of stakeholders determining whether or not a referendum should pass. Votes are weighted both by the number of DOTs that the stakeholder account controls and the amount of time they are willing to lock their DOTs.

### Wallet

A program that allows one to store private keys and sign transactions for Polkadot or other blockchain networks.

### Wasm

An instruction format for a virtual, stack-based machine. Polkadot Runtime Modules are compiled to Wasm.

### Watermark

In Polkadot's parachain messaging scheme, the _watermark_ is the minimum processed send-height of the receiving parachain. All messages on all channels that are sending to this parachain at or before the watermark are guaranteed to be processed.

### Web3 Foundation

A Switzerland-based foundation that nurtures and stewards technologies and applications in the fields of decentralized web software protocols, particularly those that utilize modern cryptographic methods to safeguard decentralization, to the benefit and for the stability of the Web3 ecosystem.

### WebAssembly

An instruction format for a virtual, stack-based machine. Polkadot Runtime Modules are compiled to WebAssembly. Also known as Wasm.

### Witness

Cryptographic proof statements of data validity.
# aUSD Incident

### Table of Trace Results:

* [Trace Result #1: 08-15-2022](https://acala.discourse.group/t/08-14-2022-incident-on-chain-trace-results/1134#trace-result-1-08-15-2022-3)
* [Trace Result #2: 08-17-2022](https://acala.discourse.group/t/08-14-2022-incident-on-chain-trace-results/1134#trace-result-2-08-17-2022-6)
* [Trace Result #3: 08-18-2022](https://acala.discourse.group/t/08-14-2022-incident-on-chain-trace-results/1134#trace-result-3-08-18-2022-dot-outflow-9)
* [Trace Result #4: 08-19-2022](https://acala.discourse.group/t/08-14-2022-incident-on-chain-trace-results/1134#trace-result-4-08-19-2022-top-destination-address-12)



### Updates

* [Updates on the aUSD Incident — 22 August 2022](https://medium.com/acalanetwork/updates-on-the-ausd-incident-22-august-2022-997efec98b35)
* [Acala incident report - 21 September 2022](https://medium.com/acalanetwork/acala-incident-report-14-08-2022-392089588642)



# Attaching Polkawallet to Polkadot.js Extension

Polkawallet users can link their Polkawallet account to Polkadot.js extension to participate in Acala Quests, receive their 2% ACA bonus, NFT and referral code. Users can do this through the QR Signer function, which will import all of your account information to the Polkadot.js extension.&#x20;

**This does not mean that you have to use Polkadot.js extension to make your Acala Crowdloan contribution. This is simply a way to link your Polkawallet account to complete Acala Quests. You can still make your Acala Crowdloan contribution through Polkawallet.**

1\) Download the Polkadot.js browser extension [here](https://polkadot.js.org/extension/).

2\) Open the browser extension and click on the gear icon. Select `Allow QR Camera Access` to enable the camera on the computer. Then, click `Open extension in new window.`

![](<../../../../.gitbook/assets/image (37) (1).png>)

3\) Click on the plus sign and select `Attach external QR-signer account.` The camera on your computer will turn on asking you to `Scan Address Qr.`

![](<../../../../.gitbook/assets/image (32) (1).png>)

4\) To retrieve your QR code, open your Polkawallet app and select the QR code symbol to the left of your address.

![](<../../../../.gitbook/assets/File (24).jpg>)

5\) A QR code will appear in Polkawallet. Show that to your computer camera.

![](<../../../../.gitbook/assets/File (25).jpg>)

6\) Your Polkadot.js extension will recognize the account and show the details of your Polkawallet account. Click `Add the account with the identified address.`

![](<../../../../.gitbook/assets/Screenshot (182).png>)

7\) Your Polkawallet account is now connected to Polkadot.js extension. This means that all of your account information is also on the Polkadot.js extension.&#x20;

![](<../../../../.gitbook/assets/Screenshot (184).png>)

\


# Acala Quests

## About Acala Quests&#x20;

The purpose of [Acala Quests](https://acala.network/acala/quests) is to educate users about Acala and prepare them for the Acala Crowdloan. As an incentive, users that complete ALL of the Quests will receive an extra 2% ACA bonus on their Acala contribution, an Acala NFT and their own referral code which entitles them to an additional 5% ACA bonus on referee contributions.

## Frequently Asked Questions

### Do I need to complete the Acala Quests in order to participate in the crowdloan?&#x20;

No. However, there are several reasons why we encourage users to complete the [Acala Quests](https://acala.network/acala/quests):&#x20;

**For users on the Acala Crowdloan Waitlist (needed to sign up by Oct 12):** Completing Quests 1 and 2 is the ONLY way to get your referral code. If you complete Quests 1 and 2 before the Acala Crowdloan launches, your referral code will be emailed to you once the Acala Crowdloan launches. If you complete Quests 1 and 2 after the Acala Crowdloan launches, your referral code will be emailed to you. Having your own referral code prior to when you contribute is the only way you can self-refer and receive a 10% bonus.&#x20;

**For users not on the Acala Crowdloan Waitlist:** Completing Quest 4 allows you to receive your own referral code which can get you an extra 5% ACA bonus on contributions made by contributors that use your code.&#x20;

**For ALL users:** Completing ALL of the Quests entitles you to an extra 2% ACA bonus on your contribution and an Acala NFT. Quests are also a way to educate yourself about Acala and prepare yourself for the Acala Crowdloan.

### Why am I having trouble connecting my Polkadot.js wallet?

#### The Acala Quests page may have trouble connecting to your Polkadot.js extension for a few reasons. Please try the following:

Make sure that your extension is set to “Allow use on any chain.” Refresh the web page.

Make sure that you are allowing the website access to your extension. Open “Manage Website Access” and make sure that acala.network is allowed. Refresh the web page.

If those attempts fail, try turning off ad blockers in your browser settings. Refresh the web page.

### Have referral codes been distributed?

Yes. Users on the waitlist that have completed Quests 1 and 2 will receive their referral code via email. Users that are not on the waitlist will get their referral code after they contribute to the Acala crowdloan.

### How long will Acala Quests run for?

Quests will run for the duration of the Acala Crowdloan.

### Do I need to make my crowdloan contribution with the same account I completed the Acala Quests with to receive my 2% bonus and NFT?&#x20;

Yes.

### Can I use a Ledger wallet to complete the Acala Quests?&#x20;

No. Ledger does not support Acala at all, even if you connect your Ledger to the polkadot.js extension.

### How do I connect my Polkawallet to Acala Quests?

Follow the guide we've created [here](attaching-polkawallet-to-polkadot.js-extension.md).



# Unstaking Your DOT

In preparation for the Acala crowdloan event, supporters who are currently staking (bonding) their DOT will need to unstake prior to contributing their DOT to the crowdloan module. For recently unstaked DOT tokens, Polkadot has a delayed exit period (28 days), which serves as a cooldown. After the 28 day period has ended, you can claim your DOT and contribute them to the Acala crowdloan.

The following guides are available to help you through the process:&#x20;

* [Unstaking Your DOT Tokens on Polkadot.{js} Extension](unstaking-your-dot-tokens-on-polkadot.-js-extension.md)
* [Unstaking Your DOT Tokens on Polkawallet](unstaking-your-dot-tokens-on-polkawallet.md)


# Unstaking Your DOT Tokens on Polkadot.{js} Extension

You will need to unstake your DOT tokens prior to contributing to the crowdloan module. For recently unstaked DOT tokens, Polkadot has a delayed exit period (28 days), which serves as a cooldown. After the 28 day period has ended, you can claim your DOT and contribute them to the Acala crowdloan.

## Step 1: Stop nominating (staking)

1.Open [Polkadot{.js}](https://polkadot.js.org/apps/#/explorer) and connect to the Polkadot network. Then in the navigation bar at the top of the page, click on the `Network` dropdown and select `Staking`.

2\. Click on `Account actions` in the white sub-header towards the top of the screen. Then click `Stop` (towards the right of the screen) on the account that you’d like to unstake.

![](../../../../../.gitbook/assets/unbonding-step-1.png)

3\. Click `Sign and Submit` in the bottom right corner to authorize the transaction. Your browser extension will prompt you to enter your password and sign the transaction. You have now stopped nominating, but your tokens remain bonded.

## Step 2: Unbonding

4.To unbond your tokens, click on the ellipses (three dots) on the right-hand side of the page and click `Unbond funds`.

![](../../../../../.gitbook/assets/unbonding-step-2.png)

5\. Enter the amount you’d like to unbond and then click `Unbond`. Sign and submit the transaction.

6\. If done successfully, there should be a clock icon next the amount you requested to be unbonded. You can hover over the icon to see how much longer until the tokens are fully unlocked, which is approximately 28 days.

## Step 3: Claiming

7\. Once the 28 days have passed, return to `Account actions`, click on the three ellipses, and select `Withdraw unbonded funds`. This will make your DOT transferable. Note that even  though it says “withdraw,” your DOT won’t be leaving your account.

![](../../../../../.gitbook/assets/unbonding-step-3.png)

8\. Sign and submit the transaction.

9\. You can return to `My Accounts` and select the dropdown next to balance to see that your DOT are now transferable. You can now contribute to the Acala crowdloan.\


# Unstaking Your DOT Tokens on Polkawallet

You will need to unstake your DOT tokens prior to contributing to the crowdloan module. For recently unstaked DOT tokens, Polkadot has a delayed exit period (28 days), which serves as a cooldown. After the 28 day period has ended, you can claim your DOT and contribute them to the Acala crowdloan.

Unstaking on Polkawallet involves a few steps. First, you need to stop nominating to your Validator. Next, you need to unbond your tokens. Finally, after the "cool down" period finishes (7 days for Kusama, 28 days for Polkadot) you need to redeem (claim) your unbonded tokens.

## Stopping Your Nomination to Your Validator

1\) Open the Polkawallet mobile app and click `Staking`.

<img src="../../../../../.gitbook/assets/image (36) (1).png" alt="" data-size="original">

2\) Click `Validators` in the upper right corner.

![](<../../../../../.gitbook/assets/image (31) (1).png>)

3\) Select `Set Nominees` and click `Stop Nominating`.

![](<../../../../../.gitbook/assets/image (35) (1).png>)

4\) Click `Submit`.

![](<../../../../../.gitbook/assets/image (38) (1) (1).png>)

## Unbonding Your Tokens&#x20;

1\) Select `Adjust Bonded` and click `Unbond`.

![](<../../../../../.gitbook/assets/image (40) (1).png>)

2\) Enter the amount you'd like to unbond and click `Submit`.

![](<../../../../../.gitbook/assets/image (42) (1).png>)

3\) Click `Submit`.

![](<../../../../../.gitbook/assets/image (33).png>)

4\) You should see a balance equivalent to the amount you just unbonded as "Unlocking."

![](<../../../../../.gitbook/assets/image (41).png>)

5\) You can check how much longer before your tokens unlock by clicking on the clock icon. Once the unlocking period is over, proceed to the steps below to redeem your ubonded tokens and make them transferrable.

![](<../../../../../.gitbook/assets/image (39) (1) (1).png>)

## Redeeming Your Unbonded Tokens

1\) After the "cool down" period ends (7 days for Kusama, 28 days for Polkadot), open the Polkawallet mobile app and click `Staking`. You should see your unbonded tokens as "Redeemable."

![](<../../../../../.gitbook/assets/image (37) (1) (1).png>)

2\) Select `Adjust Bonded` and then click `Redeem Unbonded`.

![](<../../../../../.gitbook/assets/image (30).png>)

3\) Enter the amount you wish to redeem. Click `Submit`.

![](<../../../../../.gitbook/assets/image (32) (1) (1).png>)

4\) Click `Submit`.

![](<../../../../../.gitbook/assets/image (34) (1).png>)

5\) You can see that your “Available” balance has increased by the amount you redeemed. Your tokens have been completely unstaked and are now freely transferable.

![](<../../../../../.gitbook/assets/image (43) (1).png>)


# Becoming a DOT Holder

All contributions to the Acala Crowdloan must be made in DOT. As such, it’s important that users wishing to participate in the crowdloans become DOT holders so they can make their contribution.

## What is DOT?

DOT serves three key functions within the Polkadot ecosystem. The first function is as a way to govern the network. DOT holders are able to vote on things such as determining fees for the Polkadot network, auction dynamics, exceptional events such as upgrades, etc. The second function is that DOT helps operate and secure the network. Participants wishing to validate transactions on Polkadot must put their DOT at risk (referred to as “staking”). The third function is for creating parachains by bonding DOT. DOT is the only accepted contribution token for projects to secure a parachain lease on Polkadot.

## Where Can I Get DOT?

You can find a list of exchanges that trade DOT [here](https://coinmarketcap.com/currencies/polkadot-new/markets/).

## How Can I View My DOT Balance?

If you've downloaded the [polkadot.js extension](https://polkadot.js.org/extension/) and [created a DOT account](creating-a-new-dot-account.md), connect to the [polkadot.js user interface](https://polkadot.js.org/apps/) to view your balance. Click on `Accounts` and you'll see all of the accounts that you've created in your polkadot.js browser extension. If an account is not showing up, go to the browser extension and make sure all of your addresses are set to `Allow use on any chain`. Also, make sure that you are connected to the Polkadot network by looking in the upper left corner. If it doesn't say Polkadot in the upper right, click on the dropdown and select `Polkadot`.

![](<../../../../.gitbook/assets/Screenshot (194) (1).png>)

# Creating a New DOT Account

While there are several wallets that support Polkadot, **we've found that the Polkadot.{js} browser extension best serves most desktop users and the Polkawallet mobile app best serves most mobile users. Follow the guides below based on your wallet preference.**

## Option 1: Creating a wallet through Polkadot{.js} browser extension

1\) Go [here](https://polkadot.js.org/extension/) to download the browser plugin. The browser plugin is available for both Google Chrome (and Chromium based browsers like Brave) and FireFox.

This browser extension does one thing: it manages accounts and allows the signing of transactions with those accounts. It does not perform wallet functions, like sending or receiving, or show you wallet balances. After setting up your Polkadot.js browser plugin, you can use the [Polkadot.js Apps](https://polkadot.js.org/apps/) website to check balances, transfer DOT, and more. Once you install the Browser plugin, be sure to pin it to your toolbar:

![](https://lh3.googleusercontent.com/6HCYOW9F-UvTeaxo6vzxwoKA7jzrdlGmc1gz7-Shq5Dfx3vwJI-sNgKDX1\_8\_88bYLryd\_vkm19FGyfxSus5Huz92UV4pF3q3bRmA2PLGm0ecDHuVPSOFaV2jAKMSki-Y8ruH8qn=s0)

2\) Open the Polkadot{.js} browser extension by clicking the logo on the top bar of your browser. You will see a browser popup not unlike the one below. Click the big plus button or select `Create new account` from the small plus icon in the top right. The Polkadot{.js} plugin will then use system randomness to make a new seed for you and display it to you in the form of twelve words.

![](https://lh6.googleusercontent.com/F9ZKdwbgHFn2JRIW45JGzMZe2c31ymseEZFt4uGKEdXWIx325vR5cdJeuPL89vmGSXl4ndzD8jOALAeEg4faAeQN-0giThMcacvhokVBiMvjE-M-6N9CGrz-kCaitJTJTML0n\_yH=s0)

3\) You should back up these words as explained here on the [Polkadot wiki](https://wiki.polkadot.network/docs/learn-account-generation). It is imperative to store the seed somewhere safe, secret, and secure. If you cannot access your account via Polkadot.js for some reason, you can re-enter your seed through the `Add account menu` by selecting `Import account from pre-existing seed.`

![](https://lh6.googleusercontent.com/sxgHTz63se9bj9fMA5nN1CrFRLstEgLxCYEd67UBPoX\_iW9L8w2LEjwPRNc0jTfCiAuY1YiF8JKiV4lLpvLhReivWC2hsR2tc34E2Zt0zmGc8CN9v4bs7F7PBrn2hWfHS1eyOQhu=s0)

4\) Name your account and choose a password. The password will be used to encrypt this account's information. You will need to re-enter it when using the account for any kind of outgoing transaction or when using it to sign a message. Click `Next step.`

**Note that this password does NOT protect your seed phrase. If someone knows the twelve words in your mnemonic seed, they still have control over your account even if they do not know the password.**

**Do not ever share your seed phrase or password.**

Keep "Network" as "Allow use on any chain." Click the `account with the generated seed.`

![](https://lh6.googleusercontent.com/SU8IoURMT1gLltMomROA2IKwU-1qgu8XcM8\_WDExmuSyF1PHcoxeYMasnLFUIze0gAN9tfG36STlNdFEvH8G24XyNUBJqOJ6JLmdw2zPsxASkDKyI3LLg73Eo2Va3ntioaTR6L-C=s0)

5\) You’ve successfully created an account. To see your Polkadot address, you can change the visual display of how your address appears. Click on the gear icon in the upper right corner. Under the dropdown menu for “DISPLAY ADDRESS FORMAT FOR,” select `Polkadot Relay Chain.`

![](https://lh4.googleusercontent.com/oq1hFwES7UyWWsWkG0xPvBaSd16wtI4RXS\_71rhpORTt58uaGucfkP7nTTFo9jVF9PgqmV19VD2iNZX-0Fbya8zuXBzIxkY4tqReM4y4RXYROLEAIYravZ8izSwnH2GS7gEpDO7V=s0)

6\) Your address is now in the Polkadot display format and you can see your Polkadot address. Polkadot addresses always begin with the number 1.

![](https://lh5.googleusercontent.com/blS00BSmbwjCIfetHy8ajshk7h6T9LRh2JcgKcVCQg-HzOFgN7paNIyh1j-HMcqt\_xZKEXh5\_Iuwgm8f2Ypq2NnDyAZrP1z709E\_ZhMsrEo1skkm3-S2aTy-KeDCM69O0cFX058J=s0)

## Option 2: Creating a wallet through Polkawallet

1\) Download the Polkawallet app through the [Apple App Store](https://apps.apple.com/us/app/polkawallet/id1520301768) for iOS devices or [Google Play](https://play.google.com/store/apps/details?id=io.polkawallet.www.polka\_wallet) for Android devices.

2\) Click `Create Account.`

![](https://lh6.googleusercontent.com/lP4wn\_ePemQednbjjC-uKL5dDor-lCVDSWvyLli8H8Qq9\_bHw6qkem8kzkd6NMoPZJwAjdsRVC1lmgNGMttlYxKCUbARDE\_EIqwW8ZjIAvVOfX7xJTH4PXydcciVF03aFCYZibMC=s0)

3\) A new screen will appear explaining the importance of recording your mnemonic phrase in a safe place. Click `Next`.

![](https://lh6.googleusercontent.com/gByUmYqjV1bKqcqFFfGGSchwUakPxZ8CVPOskNiQIJgyG4OjPY\_idXJq0muL0BuG7VM2-FPo5FaG4XjqJB0o7qo9vGsblfYQjZm-DgbEisCEZpNC91-Jxh8J0E7Q1jEhO9z\_uUJZ=s0)

4\) Your mnemonic phrase will appear. Write the mnemonic on a piece of paper and store it somewhere safe. Click `Next`.

![](https://lh4.googleusercontent.com/5l3UJjqvg\_U4lIviFks2NTXtae0rOj\_ndLjUjonFLbiqXZSAQ1mdQr3\_6Sxyr3ivgDs3rS8Q2aEgSfS4QHlWhSu8AkAU5wmSZiaIGc4LKw0OvZJpwA-nTEdo6czlaFhtAljErRxK=s0)

5\) Confirm your mnemonic by entering the words in the correct order. Click `Next` when completed.

![](https://lh6.googleusercontent.com/IYsuQp2jeqvnSqtlwnZMxSeHdsCgnyXc7HcyXeOzK-v13GaELemP2nAb\_vdueaPiwdBw0VdTa5P6xKMJC0Y\_bv7FQxi\_lmyPP0PZO470zYTZQ2OVLi-Rbv9oYQCSDobO3iCIYsYD=s0)



6\) Name your account and create a strong password (at least 6 characters). Click Next when completed.

![](https://lh4.googleusercontent.com/-8kC3yXmHPcI8wWowf4o4FvqM3D10yOudIoDUb6LdPbBB-vD3J0mWlzneLo5kyd9cGmdwe2wm-mZjR\_9Ur-CniGGkLTF4gTQGvP1NSUH889gC63fa2ctOteZM3pW0pTL2\_rmcx3z=s0)

7\) Your wallet is now set up. You can see your Polkadot address which begins with the number 1. To see your full DOT address or to copy the address, click on the three lines in the upper right corner.

![](https://lh4.googleusercontent.com/nUc-yrkFQSPX2S8CgpWjhRNV-p-cvKVPOAG\_j-I2AOmBhHg8-sHIT4XgPJ9bf8KwGQ6Kg4L0mzMdgISBsfFFlaUxa-x5RknubwCa4ygoT4\_POQU2Q8YwUAqePABAjHS80pfZA7t\_=s0)

8\) You can now see your full DOT address and send your DOT tokens to this address.

![](https://lh3.googleusercontent.com/9jdqSrtSojsbIXfpAHvkWZQanVI2c2xqqM-TIVri-JSf0oosJ2D63vIbd5ruhUjt8ArdCjKaht7tB-1L-omowBwef3GxynlGtMkrxWmYfWr68t41Oclu-GqRK9HftwIOEAuaPr3K=s0)


# Claim ACA

**Most crowdloan contributors do not need to claim their ACA or lcDOT tokens. They will be automatically distributed to you.** However, if you participated in the Acala crowdloan through the https://polkadot.js.org/apps/ website, you will need to read and agree to our Terms and Conditions in order to claim your tokens.

If you are unsure, you can also check to see if you need to go through the claims process by going to our [distribution website](https://distribution.acala.network/). Once you enter your address, if your status is `To Be Claimed`, then you need to go through the claims process.

You can access the Claim Website directly [here](https://distribution.acala.network/claim/acala).&#x20;

## Option 1: Using Polkadot{js} Browser Extension

Navigate to the [claims website](https://distribution.acala.network/claim/acala). Connect your Polkadot{js} Extension, **using the same account that participated in the crowdloan event**, and follow the prompts to complete the process.

You’ll be required to use the extension to sign a message, but it does not cost any transaction fees. Once the process is completed, it may take up to 48 hours for distribution to be scheduled.

## Option 2: Manual Claim

Navigate to the claims website. If you did not participate in the crowdloan event with the Polkadot{js} extension, then select `Claim Manually` and enter the address you used to participate in the Acala crowdloan.

There are two ways to claim:&#x20;

A) Send a System Remark on Polkadot with a specific message OR&#x20;

B) Use Sign and Verify to sign the specific message Below are the guides for how to use either to claim.

### A) Using Sign and Verify

You can go to the [Polkadot App - Developer - Sign and Verify](https://polkadot.js.org/apps/#/signing) (using either Polkadot, Kusama, or Acala are all fine). Sign and Verify merely signs the message and requires no transaction cost.&#x20;

1\) You must select the same account that was used in the Acala crowdloan.&#x20;

2\) In the sign the following data field, copy and paste in the required message to sign (shown on the Claim website).

`I hereby agree to the terms of the statement whose SHA-256 multihash is QmeUtSuuMBAKzcfLJB2SnMfQoeifYagyWrrNhucRX1vjA8. (This may be found at the URL:` [`https://acala.network/acala/terms`](https://acala.network/acala/terms)`)`

![](https://lh6.googleusercontent.com/aMJa1Yk5txJJGvhUbsjJ9i87t8WYnAo2m79Te6N4-JYFKpzGAFc8HmQMUZUd1GwxfB0dTw2e7s0195ImUK2Fian40Jkm6ZEaMWaQJvyscOwbtkNrSipTw7nPps39A8n5cbg4WxnU)

3\) Sign, copy the hash and paste it back to the Claim website to complete the process.

![](https://lh3.googleusercontent.com/ocKhFgo3ZHNnzI0o31FE41g7EPqWyuDvCyp5RtEckeTRcypMhhVQ6wG\_rDNHFo4OIE2QWv2F8BIzux\_XaprEi5DI4t0MtJioC\_Oly9eYKeemQLr1edyd86YxE6uFxOpk8B8p7Pux)

Once the process is completed, it may take up to 48 hours for distribution to be scheduled.

### B) Using System Remark

If you are unable to use Sign and verify to sign the message e.g. you used a proxy account to participate or the agency (e.g. wallet) you used to participate in the crowdloan does not have a sign and verify facility, then you can send a System Remark on the Polkadot chain to claim ACA.

1\) Log onto the [Polkadot.js Apps - Polkadot](https://polkadot.js.org/apps/#/explorer), you must be connected to the Polkadot network.

2\) Go to the Developer-Extrinsics section.

![](https://lh4.googleusercontent.com/IJeL--Hr5Zrvho69q2fDJrEu4bQuvQv-VlW4oOUVGQD3dTsmZ0sSFy8nwWnwfofbPH-v\_88pn4COmz4Lg-rDCOlZG8WUa-9FYqSabu\_9Owbn-FOgwtACSQpgRTyUb9NpJMm-vgT-)

3\) **You must select the same account that was used in the Acala crowdloan.** In the submit the following extrinsic field, select system then remarkWithEvent(\_remark) in the drop-down menu.

![](https://lh4.googleusercontent.com/-z9En1Y8GK4ZCjlt3V5ABDl4EJAhd3lMihjsFUr8SD4lzrUR9qaJOf3p\_xSsd6TZlWKATVPxsaI5UYFmzKusWFW1EgDhycN4b8-F\_C3OcsogRoMMbpqTg3jPflSuXdeQJsRHXSj6)

4\) In the \_remark: Bytes field, enter the message required to sign. Copy and paste in the required message to sign (shown on the Claim website).

`I hereby agree to the terms of the statement whose SHA-256 multihash is QmeUtSuuMBAKzcfLJB2SnMfQoeifYagyWrrNhucRX1vjA8. (This may be found at the URL:` [`https://acala.network/acala/terms`](https://acala.network/acala/terms)`)`

Click `Submit Transaction`. Note that you’ll be required to pay a small fee to initiate the transaction so make sure you have some funds in your account.

![](https://lh6.googleusercontent.com/tIGP5ZHl8r\_XNT5EKKvylMLWTitl0IAgFoI0IhhNd58WoNzO0m55xcSSd9HCWSiQccHmsLz4ges17a9qC9SgM3diKGgmRw5eno0y271XOvB5lTDy4sF8HXJtYrA9vi5sCZuqg6eh)

5\) Your remark transaction has been submitted onto Polkadot. You can view the signed remark on [Polkadot Subscan Explorer](https://polkadot.subscan.io/). Paste in the Polkadot address used for sending the transaction.

![](https://lh5.googleusercontent.com/17GsCIeXA\_0ijuwCxjuVu3jjRHiSrYaaLMlVY53YkqRpxi6yzTSDP7ASC3BvbAu9ZyWdcxRIQ945fyv0KQK\_aazJ76eZvLqb3\_88hGw6vkL0i\_Ade82Vx100V6TgbewNojuOnKkU)

6\) You’ll see the system(remark\_with\_event) in your transaction history. Click on the corresponding Extrinsic ID.

7\) Copy the `Extrinsic Hash`.

![](https://lh3.googleusercontent.com/w5pF0sy83ZpZ2-CQ\_zO742RD0pqmmSmOI\_1ab1u5ppaCQ05MQSzXVbiHTjsGy3rO1S5TjJE-L7im6dI\_t9qYPy2al9YOh68MZB5cFTSh5xFj3lJR92wA5n0L0LalPXl0Oxca2nH0)

8\) Paste the Extrinsic hash back to the [Claim website](https://distribution.acala.network/claim/acala) to complete the process.

Once the process is completed, it may take up to 48 hours for distribution to be scheduled.

# Crowdloan Event

## Key Points&#x20;

* The Acala Crowdloan is happening soon, join the waitlist, and be sure you’re eligible to participate with a compatible wallet and DOT tokens on hand.&#x20;
* The Acala Crowdloan is a community-backed launch for individuals looking to contribute to the growth of Acala’s network and applications.&#x20;
* Contributed DOT will be returned at the end of this Acala parachain lease.
* The lease period (DOT locked period) is 2 years. ACA will be distributed after Acala launches and transfers are enabled.

## 1. About Acala

### 1.1 Overview

[Acala ](https://acala.network/)is the decentralized finance network and liquidity hub of Polkadot. It’s a layer-1 smart contract platform that’s scalable, Ethereum-compatible, and optimized for DeFi with built-in liquidity and ready-made financial applications.

With the Acala Swap trustless exchange, the Acala Dollar decentralized stablecoin (aUSD), DOT Liquid Staking (LDOT), and the [Acala EVM+](https://medium.com/acalanetwork/scale-ethereum-based-defi-to-polkadot-with-acala-evm-now-fully-evm-compatible-with-full-access-to-cd3afd525f96), Acala lets developers access the best of Ethereum and the full power of Substrate.

### 1.2 ACA Token

* **ACA** is the native token of the [Acala](https://acala.network/).&#x20;
* **ACA** has a fixed supply of 1,000,000,000.
* **ACA** can be used for paying transaction fees, staking to deploy smart contracts and pallets, node incentivization, algorithmic risk adjustment, and governing the network and protocols.
* Learn more about [ACA](https://acala.network/acala/token) token here.

## 2. Crowdloan Overview

The crowdloan event is an important milestone for launching the Acala network.

### 2.1 Parachain Auction

Polkadot is a sharded, multi-chain network that allows blockchains to connect for interoperability, scalability, and plug-and-play network security. To join Polkadot’s network, all parachains must participate in and win a unpermissioned candle auction to secure a slot on the network. Parachains can choose to raise DOT in a variety of ways in order to participate in the auction.

### 2.2 Purpose of Acala Crowdloan&#x20;

Acala has chosen to host a Crowdloan to trustlessly crowdsource DOT, which will be used to participate in the Polkadot parachain auction. These DOT will be bonded, or ‘locked’, in the Polkadot Relay Chain for the duration of Acala’s parachain lease.

**Crowdsourced Network Security**&#x20;

DOT holders lock their tokens on Polkadot for a period of time (2 years for the first parachain auction) to help Acala lease a parachain slot and gain access to Polkadot’s plug-and-play security. In return for DOT holders’ loan, ACA (Acala’s native token) will be distributed to participants.

**Community-backed Launch**&#x20;

DOT tokens will be returned to holders following parachain lease, with a guarantee of receiving the DOT principal back. It can be seen as a community-backed launch for individuals looking to contribute to the evolution of Polkadot’s network and parachains.

**Fair Network Bootstrapping**&#x20;

The ACA distributed to participants will be vested over a period of time, but the full balance can be used to participate in governance and other activities besides transferring. This helps us to build a strong and well-intentioned community from the ground up.

## 3. Acala Crowdloan Details

### 3.1 Key Details

* **Lease Period:** 96 Weeks.
* **Vesting:** 20% liquid upfront, 80% vest over lease period.
* **Referral Bonus:** 5% ACA bonus for the referrer and 5% for the referee.
* **VIP Referral Bonus:** 10% additional bonus on all DOT contributed using your referral code when you refer 500 accounts that contribute over 3,000 DOT. This is limited to up to 100 winners. If there are more than 100 qualifying winners, the top 100 in DOT contributed using their referral code will earn this bonus.
* **Quest Bonus:** 2% ACA bonus and exclusive NFT for users that complete [all 5 Acala Quests](https://acala.network/acala/quests).
* **Karura Crowdloan Contributor Bonus:** 2% additional ACA bonus on your FIRST contribution when using the same account that you used for the Karura crowdloan.
* **NFT Reward:** Awarded to all Acala Crowdloan contributors except users that participate through exchanges.
* **Eligibility:** No KYC is required, but participants must agree to Terms & Conditions.

### 3.2 Ways to Participate

Crowdloan is a permissionless event, so you can make your own judgement on how you'd like to participate. We recommend the following ways to participate:

#### Option 1: Traditional Crowdloan

* **Details:** Contribute using the traditional crowdloan method via the Acala website. Contribute your DOT trustlessly to the crowdloan.
* **Liquidity Lock Duration:** 96 weeks (approx. 2 years)
* **Tokens Received:** ACA
* **DOT Redemption:** Your DOT contribution will be unlocked and returned to you trustlessly after 96 weeks.
* **Bonus Eligibility:** Eligible for all bonuses

**Option 2: Liquid Crowdloan**

* **Details:** Contribute to the Acala Liquid Crowdloan Vault to maintain ongoing access to crowdloaned DOT liquidity.
* **Liquidity Lock Duration:** No liquidity lock - stay liquid with LCDOT
* **Tokens Received:** ACA and LCDOT
* **LCDOT Amount:** Receive 1 LCDOT for every 1 DOT contributed.
* **DOT Redemption:** Your DOT contribution can only be redeemed with your LCDOT at the end of the 96 week parachain lease.
* **Bonus Eligibility:** Eligible for all bonuses

#### Option 3: Exchanges

* **Supporting Exchanges:** [Kraken](https://www.kraken.com/learn/parachain-auctions), [Binance](https://www.binance.com/en/dotslot), [OKEx](https://www.okex.com/earn/slotauction), [Kucoin](https://www.kucoin.com/news/en-kucoin-will-support-the-kusama-parachain-slot-auction), [Newland](https://newland.finance)
* **Bonus Eligibility:** Not eligible for any bonuses

#### Option 4: Mobile Wallets

* **Supporting Mobile Wallets:** [Polkawallet](https://polkawallet.io/), [Math Wallet](https://mathwallet.org/en-us/), [Nova](https://novawallet.io/), [Fearless](https://fearlesswallet.io/)
  * **Supports LCDOT:** [Polkawallet](https://polkawallet.io/), [Nova](https://novawallet.io/), [Talisman](https://app.talisman.xyz/)
* **Bonus Eligibility:** Eligible for all bonuses

**Disclaimer:** Crowdloan via exchange or mobile wallet is provided by a third party, not Acala. Acala does not guarantee and does not assume any responsibility for, the acts or omissions of the third party, the performance of their products or services.&#x20;

### 3.3 Prepare your DOT In order to participate in the crowdloan, DOT must be unbonded.&#x20;

If you are already staking DOT, please begin the process of unstaking now to ensure that you can observe the 28-day cooldown. The following guides are available: ​

* [Unstaking Your DOT Tokens on Polkadot.{js} Extension​](dot-address/unstaking-your-dot/unstaking-your-dot-tokens-on-polkadot.-js-extension.md)&#x20;
* [Unstaking Your DOT Tokens on Polkawallet](dot-address/unstaking-your-dot/unstaking-your-dot-tokens-on-polkawallet.md)



---
description: 4.61 ACA for every 1 DOT contributed
---

# Crowdloan Rewards

## 1. Crowdloan Stats

* **Total DOT locked:** 32.5M DOT
* **Total LCDOT (Liquid Crowdloan DOT) Generated:** 24.1M LCDOT
* **Number of Contributions**
  * **Total Unique Contributors:** 190k+ including exchange contributors
  * **On-Chain Unique Contributors:** 81k+
* **Contribution Channels:**
  * **15.7%** via exchanges and or centralized agencies
  * **84.3%** contributed directly on-chain
* **Contribution Distribution:**

![](https://lh6.googleusercontent.com/Ki7HmQo1POaj1jOj2hC052qe8iQlkxlg1FNooSdLLOe5QMcIhD85mxKdbouDaTrCQVeQX7xv8IUy6WByHU\_4nj5tm8U9EYUywOIKkBcjy4Gj6\_l0gtFpWfn\_xpzVQr\_G7fxFsJg6)

## 2. Reward Stats

* **Total Base ACA Reward:** 150,000,000 (15% of total fixed supply)
* **Total Bonuses:** 19,270,000 (1.9% of total fixed supply)
* **Total ACA Reward to Be Distributed:** 169,270,000 (16.9% of total fixed supply)
* **Base Reward:** 4.61 ACA for every 1 DOT contributed

## 3. Individual Reward Details

* **Base Reward:** 4.61 ACA for every 1 DOT contributed
* **Referral Bonus:** 5% additional ACA for the referee, 5% for the referrer when a referral link used
* **Crowdloan Kickoff Bonus (Block 7562300 - 7611000):** 5% additional ACA
* **Auction Kickoff Bonus (Block 7641908 - 7684110)**: 5% additional ACA
* **Quest Bonus:** 2% ACA bonus
* **Karura Crowdloan Contributor Bonus:** 2% additional ACA bonus on your FIRST contribution when using the same account that you used for the Karura crowdloan

## 4. Check Rewards

Rewards to be distributed are all recorded on the [Distribution Website](https://distribution.acala.network/).

**All ACA rewards have been distributed (except for the ones that say `to be claimed` ).** There are several ways to check your balances:

### Checking on Polkadot.js.org

1\) Go to your Polkadot.js **extension** and make sure it is set to `allow use on any chain`.

![](<../../../.gitbook/assets/Allow use on any chain.png>)

2\) Go to [Polkadot JS Apps](https://polkadot.js.org/apps/#/explorer) and connect to the Acala network. You can do this by clicking on the dropdown box in the upper left hand corner (shown below).

![](<../../../.gitbook/assets/Toggle for Acala (1).png>)

3\) Select an Acala node (any is fine) and click `Switch`.

![](<../../../.gitbook/assets/Select Acala (1).png>)

4\) Select `Accounts`. You should see your ACA amount. Note that some of your balance will be locked. This amount will unlock over the 96 week parachain lease.

![](<../../../.gitbook/assets/ACA in polkadot.js.png>)

### Check on Subscan

Go to [Acala Subscan](https://acala.subscan.io/) and enter your DOT address.
# FAQ

## Most Asked Questions

### Is the reward ratio the same across contribution methods?

Yes. The base ACA reward is the same regardless of how you participate.

### What is the minimum amount to participate?&#x20;

The minimum contribution depends on how you participate:&#x20;

**Liquid Crowdloan Contribution:** 2.1 DOT balance (1 DOT minimum contribution)

**Direct Polkadot Contribution:** 6.1 DOT balance (5 DOT minimum contribution)

**Partner Wallets:** 6.1 DOT balance (5 DOT minimum contribution)

**Exchange:** Check with your exchange’s requirements

### How long will my DOT be locked?&#x20;

Your DOT will be locked for the full duration of Acala's parachain lease, which is 96 weeks. However, contributors have the option to participate through Liquid Crowdloan which gives them access to the liquidity in their DOT contribution shortly after Acala’s launch.&#x20;

### When will I receive my ACA tokens?&#x20;

You will receive your ACA after Acala wins a parachain slot, launches the network (expected December 17th, 2021), and enables token transfers.

### What wallets can I use to participate? Can I use Ledger?&#x20;

A list of supported wallets can be found [here](crowdloan-event.md#3.2-ways-to-participate). Ledger does not support Crowdloans in Polkadot.

### How do I check my crowdloan contribution?

The easiest way to track your rewards is by logging onto the [Acala website](https://acala.network/acala/join-acala/bonus) and entering the DOT address you used to make a contribution.

Contributors that used the polkadot.js browser extension wallet to participate and selected the `Direct` contribution method, can also connect their wallet to [polkadot.js.org](https://polkadot.js.org/apps/#/explorer) and go to Network->Parachains->Crowdloan and see `My contributions` in the `raised` column. Note that participants that elected the&#x20;

If a contributor elected the `Contribute & Stay Liquid` method, those contributions will not show up in [polkadot.js.org](https://polkadot.js.org/apps/#/explorer). It's best to check those contributions on the [Acala website](https://acala.network/acala/join-acala/bonus).

### I made a contribution but it seems like I lost an extra \~1 DOT - what happened?

Polkadot requires that all non-zero balances be 1 DOT or greater. If the account balance falls below this amount, the 0.X DOT are automatically taken from the user by the Polkadot platform and cannot be returned. Because of this, it's important that users leave at least a 1.1 DOT balance after they make their crowdloan contribution.

### I meant to make a Liquid contribution but made a Direct contribution by mistake - can I change it?

No.

## How to Participate

### Can I participate in the Crowdloan through an exchange?&#x20;

Perhaps. Contact your exchange to learn if they are supporting the Polkadot parachain auctions.&#x20;

### I'm currently staking my DOT - what do I need to do?&#x20;

If you are staking on an exchange, contact your exchange to learn if they are supporting the Polkadot parachain auctions and for instructions on how to participate. If you stake directly in Polkadot, you must go through the 28 day unbonding period before you can make your Crowdloan contribution. Learn how to unstake your DOT [here](dot-address/unstaking-your-dot/).

### Will my DOT be returned after the parachain lease ends?&#x20;

Liquid Crowdloan Contributors can redeem any lcDOT they hold at Acala's parachain lease expiration for the equivalent amount of DOT (the ratio of lcDOT to DOT is 1:1). All other contributors will have their full DOT contribution returned to them at lease expiration.

### Can I participate using Ledger?&#x20;

No. Ledger does not support Polkadot crowdloans.&#x20;

### Can I withdraw my DOT from the crowdloan?&#x20;

No. All submissions to the crowdloan module are final and cannot be withdrawn.&#x20;

### What if Acala doesn’t win the first parachain auction, what happens to my DOT?&#x20;

If Acala does not win the initial auction, it will continue to bid in the subsequent auctions. There are 5 auctions total in the first batch of parachain slots.&#x20;

### Do I need to sign up for the waitlist in order to participate?&#x20;

No. Signing up for the waitlist has no impact on your ability to participate. However, participating in the waitlist can entitle you for additional bonuses.

### Can I still sign up for the waitlist?

No. Signup for the waitlist has ended (Oct 12). However, you don't need to sign up for the waitlist to contribute to the crowdloan. Additionally, you can make a contribution to the crowdloan and receive a referral code from Acala. You can use this referral code to refer other users and receive ACA bonuses.

## Referral Codes and Bonuses

### How do I get a referral code?&#x20;

There are two ways to get a referral code. Users on the waitlist (signed up by Oct 12) can complete [the first two Acala Quests](https://acala.network/acala/quests) to receive their referral code via email. Users not on the waitlist can receive a referral code after they make their crowdloan contribution.

### Have referral codes been distributed?

Yes. Users on the waitlist that have completed Quests 1 and 2 will receive their referral code via email. Users that are not on the waitlist will get their referral code after they contribute to the Acala crowdloan.

### How do I change the DOT address linked to my referral code?

**Users on the waitlist are the only users that can change the DOT address linked to their referral code.** To change the DOT address, redo Quests 1 and 2 using your waitlist email address and the new DOT address you'd like to use for your referral link. Your new referral link will be emailed to you.

### Can the referral codes be used for other crowdloans?

No.

### How do I get my 10% referral bonus?

**Users that were on the waitlist and have their own referral code can earn a 10% ACA bonus.** To get your 10% ACA bonus, enter YOUR referral code to self-refer when you make YOUR crowdloan contribution. You'll receive a 5% ACA bonus as the referrer and 5% ACA bonus as referee for a total of 10% bonus on YOUR DOT contribution. Share YOUR referral code with others and receive a 5% bonus in ACA on THEIR DOT contributions.

### **How do I get my 5% referral bonus?**

**If you weren't on the waitlist and don't have a referral code, you can earn a 5% ACA bonus.** Enter SOMEONE ELSE’S referral code when you make YOUR crowdloan contribution to receive a 5% bonus in ACA on YOUR DOT contribution. After you make YOUR crowdloan contribution, Acala will give you YOUR OWN referral code that you can share with others to receive 5% bonus in ACA on THEIR DOT contributions.

### How do I get my 2% Quest bonus?

Complete all [5 Acala Quests](https://acala.network/acala/quests) to receive a 2% ACA bonus on YOUR DOT contribution. The Quest bonus will be redeemable after the Acala network launches. Importantly, users should note that all Quest bonuses will need to be claimed after the Acala crowdloan.&#x20;

### How do I get my 2% Karura Crowdloan bonus?

If you contributed to the Karura Crowdloan, you must make your Acala Crowdloan contribution with the same account that you used to make your Karura contribution. If you do this, you will receive a 2% bonus in ACA on YOUR **FIRST** DOT contribution.

Although your Karura Crowdloan contribution was made from your Kusama address, each account created in the Polkadot/Kusama ecosystems comes with a set of addresses for Polkadot, Kusama and their parachains. All of these addresses are controlled by the same account. You can check to see a complete set of each account's addresses by going [here](https://polkadot.subscan.io/tools/ss58\_transform) and pasting any of your addresses into `Input SS58 Account or Public Key` and clicking `Transform`.

### What is the VIP referral bonus?

Users that refer 500 accounts or more and get those accounts to contribute over 3,000 DOT will receive a 10% ACA bonus on all DOT contributed using their referral code. Importantly, a maximum of only 100 u

### Can you show how the bonuses can be used together?

![](<../../../.gitbook/assets/Screenshot (205).png>)

###

## Liquid Crowdloan and lcDOT

### How does Liquid Crowdloan Contribution work?&#x20;

Select the Liquid Crowdloan option when making your contribution on the Acala website or Polkawallet. After the Acala network launches, you will receive your ACA rewards plus lcDOT. lcDOT will be issued on a 1:1 basis against your DOT contribution and can be redeemed for DOT on a 1:1 basis at Acala's parachain lease expiration. lcDOT allows you to access the liquidity in your crowdloan contribution because lcDOT can be used in Acala’s DeFi primitives (e.g., trade, transfer, collateralize).

**It's important to note that the Liquid Crowdloan option is not completely trustless. It requires you to contribute your DOT to the Liquid Crowdoan Vault managed by the Acala Foundation. This vault will be managed by the Acala Foundation until ownership of the vault is transferred to the Acala parachain. If you are looking for a way to trustlessly contribute, make a Direct Polkadot Contribution.**

### What are the risks of the Liquid Crowdloan Contribution method?

Contributors using this method need to trust the Acala Foundation to manage the Liquid Crowdloan Vault until Vault ownership is transferred to the Acala parachain.&#x20;

We do not foresee any technical risk with this approach.

### What is lcDOT?&#x20;

Liquid Crowdloan DOT (lcDOT) represents the underlying DOT liquidity of an Acala Crowdloan DOT contribution. When a participant contributes DOT via the Liquid Crowdloan option, they will receive lcDOT, a liquid (unlocked) token available for use on Acala’s DeFi hub in addition to ACA rewards. lcDOT can be used to swap, collateralize for a self-serviced loan in aUSD stablecoin, and more. lcDOT is redeemable for DOT on a 1:1 basis at the end of Acala’s parachain lease.

### If I sell my lcDOT, will I still be able to receive my DOT contribution at the end of the parachain lease?&#x20;

Contributors that made a Liquid Crowdloan Contribution must hold lcDOT at the end of the parachain lease in order to redeem their lcDOT for DOT. If these contributors no longer hold lcDOT, they won’t be able to redeem for DOT.

### If I sell my lcDOT, can I still receive ACA rewards?

Yes. If you make a DOT contribution to the Acala Crowdloan, you will receive ACA rewards. Selling your lcDOT has no impact on your ACA rewards.

### Does lcDOT vest?

No. Your lcDOT will be distributed with your ACA rewards after the Acala network launches and transfers are enabled. However, a portion of your ACA rewards will vest over the duration of the Acala parachain lease.

### Can I make a Liquid Crowdloan Contribution and a Direct Crowdloan Contribution from the same address?&#x20;

Yes.&#x20;

## ACA Tokens&#x20;

### Who receives ACA tokens?&#x20;

Anyone that makes a DOT contribution to the Acala crowdloan and agrees to the T\&Cs will receive ACA tokens.&#x20;

### How many ACA will be distributed in the crowdloan?

17% of the ACA supply (equivalent to 170,000,000 ACA) will be distributed.

### What is the vesting schedule?

20% of your ACA rewards will be delivered to you as liquid and transferrable. The remaining 80% will vest/unlock linearly (every block) over the 96 week parachain lease.

### What is the total ACA token supply?&#x20;

The total ACA supply is 1 billion ACA.

### What is the purpose of the ACA token?&#x20;

ACA is the utility token that powers the DeFi hub of Polkadot. ACA is used for:&#x20;

**Transaction Fees**&#x20;

**Proof-of-liveness** (incentives for running Acala nodes)&#x20;

**Foundation of governance** (upgrading the network, adjusting Risk Parameters, etc)

# How to Crowdloan

## **Via Acala Website**&#x20;

### **Check the Pre-Requisites**

* [ ] I have installed the Polkadot.js browser extension. Click here for instructions on [creating a wallet through Polkadot.js.](dot-address/creating-a-new-dot-account.md)
* [ ] I have DOT in my Polkadot.js account.
* [ ] My DOT has been ‘unbonded’. Click [here](dot-address/unstaking-your-dot/unstaking-your-dot-tokens-on-polkadot.-js-extension.md) for instructions on unbonding if you’re staking DOT in Polkadot.js, or find the unstake/unbond option in your mobile wallet.&#x20;

### **Select Your Desired Participation Method**

Connect to the Acala [website](https://acala.network/acala/join-acala). Select whether you’d like to `Contribute Directly` to Acala crowdloan hosted by Polkadot on this website or whether you’d like to `Contribute & Stay Liquid` to Acala crowdloan hosted by the Liquid Crowdloan Vault also on this website and receive lcDOT. The ACA rewards are the same for both options. To learn more about these two options, please consult our [FAQ](faq.md).

![](https://lh3.googleusercontent.com/n7hpj19AJiwsFlHBUmJuFpd9vwPS3hvC8n4VfKMoMLmwUh0ZTN9n22PVp\_Ltux\_67x5JDdBVhrfL-FSStWi280T2aRxQ4w7KucNGtohGvWfSngXIDNtxTEG3MXnHaGd3LDrgM1TE)

### Connect the Polkadot.js Extension Wallet&#x20;

Click Connect Polkadot.js Extension to connect your account. If you are having trouble connecting make sure that you are allowing the website access to your polkadot.js extension. You can check website access by opening up your polkadot.js extension, clicking on the gear icon and then selecting `Manage Website Access.`

![](https://lh5.googleusercontent.com/kVvHXSL8jcY76NdtxrYS1YgX2GDbICbQ9pw3GL4VRKgkFjLBeORkIvnL2GAdeb\_XYJ7Gly7GBLihXtbrLGRVlnCsfGKgoFIrbzk2s5RvC40sQ29Mh4bmw7Og1YVg-JSo6310TUKa)

### Read and Accept Terms & Conditions&#x20;

To participate in the crowdloan, you must read and accept the Terms and Conditions along with the Privacy Policy. Your acceptance will be a signed message using the DOT account used to participate in the crowdloan, but it will not cost you anything.

![](https://lh6.googleusercontent.com/bnkKpM8Lrl5arz5k8vTI7TG-FYn3Wz7B2oA5j7Spu56nLZ3UfUhUiMkuVmihsPK691FSY3vExvb0natgO8q73oZLogQR04IvWzxKz1uun6jKxqLUiEYOoXTFs2XhXNZUXywPlO68)

### Contribute to the Crowdloan&#x20;

#### Reward&#x20;

The Acala Crowdloan will distribute 17% of the ACA supply to all crowdloan participants. ACA has a fixed supply non-inflationary token model. You can then see the estimated ACA rewards; there’s a guaranteed minimum reward, and current maximum reward based on how much DOT has been contributed. Users electing the `Contribute & Stay Liquid` method will also receive 1 lcDOT for every DOT they contribute.

#### Minimum Contribution&#x20;

You shall always keeps at least 1DOT and some on your balance to keep it alive and for transaction fees. For `Contribute Directly`, the minimum contribution amount is 5 DOT. So users shall have at least 6 DOT and some on their account before making their contribution. For `Contribute & Stay Liquid`, the minimum contribution amount is 1 DOT. So users shall have at least 2 DOT and some on their account before making their contribution.

#### 10% Referral Bonus&#x20;

If you participate using a referral link, you will receive an additional 5% ACA bonus on your contribution. Your referrer will also receive 5% bonus There may be other bonus programs so please follow Acala’s social media channel for the latest information.&#x20;

`Click Submit Contribution.`

![](https://lh3.googleusercontent.com/pblFjiovYibKTDO5tNQABnsIHo\_TRRW3fsKe0nxhzPbY8uFv3LX7wqLmh3pUrAEtpB8kGOcCfcxs4b3bPX3JiFwweKlUAXkzHpkCzqkRVEGLiBXBQ6H21S5UfS-4K\_oXv2SoRnzj)

### Post Submission&#x20;

You can contribute multiple times with the same account. If you share your referral link with others, you may receive further referral bonuses. Do share your great achievement on social media, and thank you for joining us in making history together!

## Via Polkawallet

### **Switch to Polkadot Network**

You shall see your DOT balance once switched. Click the Polkadot Parachain Auction banner at the bottom of the screen.

![](<../../../.gitbook/assets/File (30).jpg>)

### **Select Your Desired Participation Method and Agree to Terms & Conditions**

Select whether you’d like to make a `Standard` contribution to the Acala crowdloan hosted by Polkadot or whether you’d like to make a `Liquid` contribution to the Acala crowdloan hosted by the Liquid Crowdloan Vault and receive lcDOT. The ACA rewards are the same for both options. To learn more about these two options, please consult our [FAQ](faq.md).&#x20;

To participate in the crowdloan, you must read and accept the Terms and Conditions along with the Privacy Policy. Your acceptance will be a signed message using the DOT account used to participate in the crowdloan, but it will not cost you anything.

![](<../../../.gitbook/assets/File (31) (1).jpg>)

### Contribute to the Crowdloan

#### Reward&#x20;

The Acala Crowdloan will distribute 17% of the ACA supply to all crowdloan participants. ACA has a fixed supply non-inflationary token model. You can then see the estimated ACA rewards; there’s a guaranteed minimum reward, and current maximum reward based on how much DOT has been contributed. Users electing the `Liquid` method will also receive 1 lcDOT for every DOT they contribute.&#x20;

#### Minimum Contribution&#x20;

You shall always keeps at least 1 DOT and some on your balance to keep it alive and for transaction fees.&#x20;

For `Standard`, the minimum contribution amount is 5 DOT. So users shall have at least 6 DOT and some on their account before making their contribution.&#x20;

For `Liquid`, the minimum contribution amount is 1 DOT. So users shall have at least 2 DOT and some on their account before making their contribution.&#x20;

#### 10% Referral Bonus&#x20;

If you participate using a referral link, you will receive an additional 5% ACA bonus on your contribution. Your referrer will also receive 5% bonus There may be other bonus programs so please follow Acala’s social media channel for the latest information.&#x20;

Click `Submit`.

![](<../../../.gitbook/assets/IMG\_2001 (1).PNG>)

### Post Submission&#x20;

You can contribute multiple times with the same account. If you share your referral link with others, you may receive further referral bonuses. Do share your great achievement on social media, and thank you for joining us in making history together!
---
description: Crowdloan is a part of Acala's parachain launch process.
---

# Acala Crowdloan

[https://acala.network/acala/join-acala](https://acala.network/acala/join-acala)


# Collator

## Overview

Collators maintain parachains by collecting parachain transactions from users and producing state transition proofs for Relay Chain validators. In other words, collators maintain parachains by aggregating parachain transactions into parachain block candidates and producing state transition proofs for validators based on those blocks.

While Acala’s network security and consensus (nPoS) are provided by Polkadot Relay chain's Validator set, the Collator set of Acala will keep the network alive by collecting parachain transactions for validators to verify them. **Unlike validators, collators has nothing to do with security of the network, by being a parachain, the network is by default trustless and decentralized, and a parachain only needs one honest collator to be censorship-resistant.** Read more on Collators [here](https://wiki.polkadot.network/docs/learn-collator).

Acala's Collator node maintains a full-node service for the Polkadot Realy Chain, and a full-node service for the Acala network. Each service has its own http/ws RPC endpoints, P2P ports etc. The base path of the Polkadot full-node service is located inside of the base path of the Acala full-node service.

## Collator Roll Out Plan

Acala takes a phased approach to roll out the Collator operation. Since Collators are non-security critical operation, a parachain only needs one honest Collator to be censorship-resistant, and more collators are not necessarily good e.g. it will slow down the network, the Collator roll-out plan is designed first-and-foremost to ensure network stability and operation.

**Current Phase: Private Collator Set**

**Phase 0: Private Collator Set**\
The Genesis of the Acala network was launched on 18th December, 2021. Upon genesis, Acala's network security and the consensus is provided by Polkadot Relay Chain's nominated Proof-of-Stake (nPoS) validators. Just like Statemine (the common-good asset parachain on Polkadot), Acala's Collators initially will be run by the Acala Foundation, until the Collator software is stable and can be released to the wider community.

**Phase 1: Authorized Collator Set (We are here)**\
Through governance approval, Acala will then open the Collator set to an authorized set of collators. While there are no block rewards nor additional incentives for these authorized collators, they are paid a reasonable rate for their node service provisioning by the Acala Foundation.

These collators are known reputable node service providers who have a proven track-record of service levels and demonstrated a deep commitment to the network. It is expected that there will be much chaos and software upgrades during this phase still, and these collators are required to work closely with the core dev team to ensure network stability.

It is expected that the Acala network will maintain such an authorized Collator Set until the network is fully stabilized, the collator staking module and the reward scheme are fully implemented and audited.

**Phase 2: Public Collator Set**\
Through governance approval, Acala will then enable the permissionless election of Collators and enable collator rewards. Due to the fact that Collators are non-security critical, a parachain only needs a small set of Collators to ensure liveness and censorship-resistance, the reward scheme will reflect this accordingly.

You can express interest in becoming a collator/liveness provider for the Acala Network (and later Acala Network) by [filling in this form](https://forms.gle/WQesfKVZmJeXov1e9).

You can subscribe to the [`Node Operator - Announcement`](https://www.acala.gg/) channel on our Discord for updates and breaking changes.

## Collator Node

### Spec Requirement

Same as [the Polkadot validator node requirement](https://guide.polkadot.network/docs/maintain-guides-how-to-validate-polkadot/#requirements).

### Run Node

Refer to the [Full Node Guide](full-node.md).

### Collator Configuration

#### **Key Management**

Acala Collator needs Aura session key. RPC `author_rotateKeys` or `author_insertKey` can be used to update session key.

#### **Registration**

* Acala is currently using the `collectorSelection` pallet from Statemint to handle collator registration. During the authorized Collator set phase, the required candidacy bond will be an unattainably high value to prevent public registration.
* Authorized providers will need to submit the public key of the Aura session key for the collator.

#### CLI

* `--collator` for the parachain part

### **Example CLI**

```
--base-path=/acala/data
--chain=acala
--name=collator-1
--collator
--execution=wasm
--
--chain=polkadot
```


# Full Node

## Spec Requirement

Same as the Polkadot full node requirements.

## Latest Release Version

{% embed url="https://github.com/AcalaNetwork/Acala/releases/latest" %}
Shows the latest release version of Acala, Karura & Mandala
{% endembed %}

## Run from Source Code

* Clone the repo: [https://github.com/AcalaNetwork/Acala](https://github.com/AcalaNetwork/Acala)
* Checkout tag here: [https://github.com/AcalaNetwork/Acala/tags](https://github.com/AcalaNetwork/Acala/tags)
* Install dependencies
* Build Acala: `cargo build --release --features with-acala-runtime`
* Run `./target/release acala --chain=acala`

## Using Docker

* Image: `acala/acala-node:latest` or `acala/acala-node:[version number]`
* `docker run acala/acala-node:latest --chain=acala`

## Common CLI

* CLI is mostly the same as any Substrate-based chain such as Kusama and Polkadot
* Because there are two node services are running, `--` is used to split the CLI. Arguments before `--` are passed to the parachain full-node service and arguments after `--` is passed to the Relay Chain full-node service.
  * For example `--chain=parachain.json --ws-port=9944 -- --chain=relaychain.json --ws-port=9945` means
    * The parachain service is using `parachain.json` as the chain spec and the web socket RPC port is 9944
    *   The Relay Chain service is using `relaychain.json` as the chain spec and the web socket

        RPC port is 9945
* It is recommended to explicitly specify the ports for both services to avoid confusion
  * For example `--listen-addr=/ip4/0.0.0.0/tcp/30333 --listen-addr=/ip4/0.0.0.0/tcp/30334/ws -- --listen-addr=/ip4/0.0.0.0/tcp/30335 --listen-addr=/ip4/0.0.0.0/tcp/30336/ws`
* It is recommended to add `--execution=wasm` for parachain service to avoid syncing issues.

## Example CLI

### Archive PRC Node

```
--base-path=/acala/data
--chain=acala
--name=rpc-1
--pruning=archive
--ws-external
--rpc-external
--rpc-cors=all
--ws-port=9944
--rpc-port=9933
--ws-max-connections=2000
--execution=wasm
--
--chain=polkadot
```


# Protocol Info

## Tokens

| Name                 | Symbol | Decimal | [ED](https://wiki.polkadot.network/docs/learn-accounts#existential-deposit-and-reaping) | Token Type           | Check Balance     | Total issuance         |
| -------------------- | ------ | ------- | --------------------------------------------------------------------------------------- | -------------------- | ----------------- | ---------------------- |
| Acala                | ACA    | 12      | 0.1                                                                                     | Native / Tokens(ACA) | `system.account`  | 1,000,000,000          |
| Acala USD            | aUSD   | 12      | 0.1                                                                                     | Tokens(AUSD)         | `tokens.accounts` | `tokens.totalIssuance` |
| Polkadot             | DOT    | 10      | 0.01                                                                                    | Tokens(DOT)          | `tokens.accounts` | `tokens.totalIssuance` |
| Liquid DOT           | LDOT   | 10      | 0.05                                                                                    | Tokens(LDOT)         | `tokens.accounts` | `tokens.totalIssuance` |
| Liquid Crowdloan DOT | LCDOT  | 10      |                                                                                         | LiquidCrowdloan(13)  | `tokens.accounts` | `tokens.totalIssuance` |
| Tapio DOT            | tDOT   | 10      | 0.01                                                                                    | StableAssetId(0)     | `tokens.accounts` | `tokens.totalIssuance` |
| Moonbeam             | GLMR   | 18      | 0.1                                                                                     | ForeignAssetId(0)    | `tokens.accounts` | `tokens.totalIssuance` |
| Parallel             | PARA   | 12      | 0.1                                                                                     | ForeignAssetId(1)    | `tokens.accounts` | `tokens.totalIssuance` |

![](asset-registry-query.png)

![](<../../../.gitbook/assets/Screen Shot 2022-02-15 at 3.22.19 PM.png>)

## Account

### Address Format

Acala uses the [SS58 (Substrate) address format](https://github.com/paritytech/substrate/wiki/External-Address-Format-\(SS58\)). Relevant SS58 prefixes are:

* **Acala**: 10 ([ss58 registry details](https://github.com/paritytech/substrate/blob/df4a58833a650cf37fc97764bf6c9314435e3cb2/ss58-registry.json#L103-L111))
* **Karura**: 8 ([ss58 registry details](https://github.com/paritytech/substrate/blob/df4a58833a650cf37fc97764bf6c9314435e3cb2/ss58-registry.json#L85-L92))
* **Mandala**: 42

### Existential Deposit

Acala uses an _existential deposit_ (ED) to prevent dust accounts from bloating state. If an account drops below the ED, it will be removed from this account and be donated to the Treasury.

ED of native token ACA is configured in the runtime. Non-native tokens (DOT, aUSD, BTC etc) can be queried via SDK. The amount of ED can only be decreased, not increased, therefore it often starts with a higher number.

`transfer` and `deposit` in `pallet_balances` and `orml_tokens` will check the ED of the receiver account. A transaction may fail due to not meeting ED requirements, a typical one would be a user is swapping token A for token B, where token A balance no longer meets ED requirements. A front-end DApp shall perform checks and prompt user for such incidents.

Read more on ED [here](../../../acala/get-started/acala-account/#existential-deposit).

## Protocol Fees

* **Mint aUSD with DOT & lDOT:**
  * **Liquidation penalty:** 12%
  * **Stability Fee:** 3%

## Transaction Fees

Acala uses weight-based fees, unlike gas, are predictable and charged pre-dispatch. See the [transaction fee](../../../get-started/get-started/transaction-fees.md) page for more info.

## Types

Type definitions allow the SDK to know how to serialize / deserialize blocks, transactions and events.

Acala's type definition bundle can be found [here](https://unpkg.com/browse/@acala-network/type-definitions@latest/json/typesBundle.json).

## MultiLocation

You can use these MultiLocation to add Acala token assets to other parachains foreign token list.

Asset Name: Acala Dollar\
Asset Symbol: AUSD\
Decimals: 12\
existentialDeposit: 0.1

`{"parents": 1, "interior": {"X2": [{"Parachain": 2000}, {"GeneralKey": 0x0001} ]}}`

Asset Name: Liquid DOT\
Asset Symbol: LDOT\
Decimals: 10\
existentialDeposit: 0.05

`{"parents": 1, "interior": {"X2": [{"Parachain": 2000}, {"GeneralKey": 0x0003} ]}}`

Asset Name: Acala Native Token\
Asset Symbol: ACA\
Decimals: 12\
existentialDeposit: 0.1

`{"parents": 1, "interior": {"X2": [{"Parachain": 2000}, {"GeneralKey": 0x0000} ]}}`

### Autogenerated MultiLocations

{% embed url="https://replit.com/@GregoryLuneau/Acala-MultiLocations?embed=true" %}
Click Run to generate the current full list of MultiLocations
{% endembed %}

## JS SDK

Acala.js: [https://github.com/AcalaNetwork/acala.js](https://github.com/AcalaNetwork/acala.js)

Documentation: [https://github.com/AcalaNetwork/acala.js/wiki](https://github.com/AcalaNetwork/acala.js/wiki)

Please also refer to the [documentation of polkadot.js](https://polkadot.js.org/docs/api/).

## Telemetry

[https://telemetry.polkadot.io/#list/Acala](https://telemetry.polkadot.io/#list/Acala)

## Polkadot apps

[https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Facala-rpc.dwellir.com#/explorer](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Facala-rpc.dwellir.com#/explorer)

## Explorer

[https://acala.subscan.io/](https://acala.subscan.io/)


---
description: Integration Guide
---

# Acala Network

Acala is a parachain of the Polkadot Relay chain, with all of its network security and consensus provided by Polkadot's Validator set. As a [Substrate](https://www.substrate.io/)-based chain, most of Acala's integration points are the same as Kusama and Polkadot. As a parachain specifically though, the key differences will be outlined in this document.

This guide contains the following sections:

1. [Protocol Info](protocol-info.md)
2. [Token Transfer](token-transfer.md)
3. [Networks](../../../integrate/acala/endpoints.md)
4. [Run a Full Node](full-node.md)
5. [Run a Collator Node](collator.md)



# Token Transfer

Acala supports different types of tokens than Polkadot, and allows various ways to transfer tokens. This guide will walk through tokens available on Acala, tools can be used for transfers, how to send transfer transactions, monitor and track these transactions.

## Token Types

### Token

| Symbol | Description                                           | CurrencyId  | Decimals | Minimal Balance |
| ------ | ----------------------------------------------------- | ----------- | -------- | --------------- |
| ACA    | native token of Acala network                         | Token(ACA)  | 12       | 0.1 ACA         |
| aUSD   | multi-collateralized stablecoin                       | Token(AUSD) | 12       | 0.1 aUSD        |
| DOT    | crossed to Acala from Polkadot Relay Chain            | Token(DOT)  | 10       | 0.01 DOT        |
| LDOT   | tokenized staked DOT from the Liquid Staking protocol | Token(LDOT) | 10       | 0.05 LDOT       |

`AssetRegistry` registered the metadata info of this type token.

### DexShare

The lp share token for the trading pair of Acala DEX. The CurrencyId type of Acala DEX's lp token are `CurrencyId::DexShare`, and the decimals and minimal balance of lp token are same as the first token in `DexShare`. For example, `CurrencyId::DexShare(Token(ACA), Token(AUSD))` is the CurrencyId of lp token of ACA/aUSD pair, its decimal is 12, and minimal balance is 0.1, these are same as ACA.

Currently, `AssetRegistry` does not register metadata info of any lp token.

### Erc20

Token issued by ERC20 contracts deployed in Acala EVM+. The CurrencyId type is `Erc20(Address)`, `Address` is the ERC20 contract address on EVM+.

### LiquidCrowdloan

| Symbol | Description                                 | CurrencyId          | Decimals | Minimal Balance |
| ------ | ------------------------------------------- | ------------------- | -------- | --------------- |
| LcDOT  | tokenized liquid receipt of crowdloaned DOT | LiquidCrowdloan(13) | 10       | 0.01 LcDOT      |

`AssetRegistry` registered the metadata info of this type token.

### ForeignAsset

Tokens originated from other parachains.

`AssetRegistry` registered the metadata info of this type token.

## Query token's metadata on assetRegistry

![query asset metadata](asset-registry-query.png)

## Tools

* JS/TS SDK: [https://github.com/AcalaNetwork/acala.js](https://github.com/AcalaNetwork/acala.js)
* Blockchain explorer: [http://acala.subscan.io](http://acala.subscan.io)
* api-sidecar: [https://github.com/paritytech/substrate-api-sidecar](https://github.com/paritytech/substrate-api-sidecar)
* txwrapper: [https://github.com/AcalaNetwork/txwrapper](https://github.com/AcalaNetwork/txwrapper)
* SubQuery: [https://github.com/AcalaNetwork/acala-subql](https://github.com/AcalaNetwork/acala-subql)

## Token balances

Query chain state to get token balances.

### Native token (ACA) balances

Query `system` module to get native token (ACA) balances data.

#### system.account

* Returns the `AccountInfo` of given account. For different types of balances, check the fields in `AccountInfo.data`
  * `free`: the free balance.
  * `reserve`: the reserved balance.

### Other tokens

For non-native tokens, like DOT, LDOT, aUSD, query `tokens` module to get balances info.

#### tokens.accounts

* Returns the `OrmlAccountData` of given account and currency ID. For different types of balances, check the fields:
  * `free`: the free balance.
  * `reserved`: the reserved balance.

#### tokens.lock

* Returns the `BalanceLock` of given account and currency ID. `BalanceLock` has two fields:
  * `id`: the lock identifier.
  * `amount.` the locked amount.
* Note locks could be overlapped, and the same amount of tokens could be under locked by multiple locks.

## Send Tokens

### Transactions

#### currencies.transfer

* [https://acala.subscan.io/extrinsic?module=Currencies\&call=transfer](https://acala.subscan.io/extrinsic?module=Currencies\&call=transfer)
* This can be used to send any supported tokens in the network, including ACA, DOT, LDOT, LCDOT, aUSD etc.

#### currencies.transferNativeCurrency

* [https://acala.subscan.io/extrinsic?module=Currencies\&call=transfer\_native\_currency](https://acala.subscan.io/extrinsic?module=Currencies\&call=transfer\_native\_currency)
* This can be used to send native token (ACA). It has slightly cheaper transaction fees compare to currencies.transfer

#### balances.transfer

* [https://acala.subscan.io/extrinsic?module=Balances\&call=transfer](https://acala.subscan.io/extrinsic?module=Balances\&call=transfer)
* Same as `currencies.transferNativeCurrency`, only for native token (ACA).
* Compatible with Polkadot / Polkadot and most other Substrate-based chains.

## Receive Tokens

There are multiple ways to detect incoming balance transfers:

* Monitor events
* Subscribe storage changes
* Monitor transactions

### Monitor Events

Monitoring events is a recommended way to track incoming balance transfers. It can handle **ALL** types of transfer transactions including the one that is not initiated by a transaction directly (e.g. delayed proxy).

#### balances.transfer

* [https://acala.subscan.io/event?module=Balances\&event=Transfer](https://acala.subscan.io/event?module=Balances\&event=Transfer)
* Emitted when a native token (ACA) transfer happened.

#### currencies.transfer

* [https://acala.subscan.io/event?module=Currencies\&event=Transferred](https://acala.subscan.io/event?module=Currencies\&event=Transferred)
* Emitted when a token transfer happened.
* NOTE: This is not emitted when balances.transfer is used to make a transfer.

#### currencies.deposit

* [https://acala.subscan.io/event?module=Currencies\&event=Deposited](https://acala.subscan.io/event?module=Currencies\&event=Deposited)
* Emitted when a token is minted to an account. This could happen when it is a cross-chain transfer or it is a transaction minting stablecoins.
  * For cross-chain transfer, there would be `ExecutedDownward` event along with the deposit. [https://acala.subscan.io/event?address=\&module=dmpqueue\&event=executeddownward](https://acala.subscan.io/event?address=\&module=dmpqueue\&event=executeddownward)

#### xtokens.transferred

* [https://acala.subscan.io/event?address=\&module=xtokens\&event=transferred](https://acala.subscan.io/event?address=\&module=xtokens\&event=transferred)
* Emitted when a cross-chain transfer happened from Acala to other chains.
* Triggered by `xtokens.transfer` extrinsic.

#### xtokens.transferredmultiasset

* [https://acala.subscan.io/event?address=\&module=xtokens\&event=transferredmultiasset](https://acala.subscan.io/event?address=\&module=xtokens\&event=transferredmultiasset)
* Emitted when a cross-chain transfer happened from Acala to other chains.
* Triggered by `xtokens.transfer_multiasset` extrinsic.

### Storage changes RPC

* [state\_subscribeStorage](https://polkadot.js.org/docs/substrate/rpc#subscribestoragekeys-vecstoragekey-storagechangeset)
  * Subscribe to a list of account balances. However, it does not guarantee subscription delivery due to connection errors or blockchain reorg.

### Monitor Transactions

It is possible to fetch transactions in every block, check for transfer transactions, and check if the transfer transaction is successful. However, this may likely yield false-negative results i.e. deposit received but failed to recognize, due to the various ways for transfer.

Refer to Send Tokens section for direct transfer transactions. In additional, to sending transfer transactions individually, there are common utility methods to batch send transfer transactions:

#### utility.batch

* [https://acala.subscan.io/extrinsic?module=Utility\&call=batch](https://acala.subscan.io/extrinsic?module=Utility\&call=batch)
* This can be used to send batch transaction
* NOTE: batched transactions will always emit success events.
  * `utility.BatchCompleted` event indicates that all transactions are successful
  * `utility.BatchInterrupted` event indicates which transaction failed. Transactions before the failed transaction are executed successfully and will not be reverted.

#### utility.batchAll

* [https://acala.subscan.io/extrinsic?module=Utility\&call=batch\_all](https://acala.subscan.io/extrinsic?module=Utility\&call=batch\_all)
* This is similar to utility.batch but will revert all transactions upon failed transaction.

## [Transfer Code Samples](https://github.com/AcalaNetwork/acala-js-example/blob/21a3be3538260cc8a047856bf163dad75de1db3a/src/transfer-examples/readme.md)


# What are crowdloans

Parachains connect to Polkadot by leasing a slot on the Relay Chain for up to 96 weeks at a time, with the option to renew. Parachain slots are assigned by an on-chain auction, with auction winners locking up a bond in DOT for the duration of the lease. Auctions and crowdloans raise the bar for blockchain projects, incentivizing them to demonstrate their technology and gain community support prior to launch. Read more [here](https://polkadot.network/auctions/).

* [Acala Crowdloan](acala-crowdloan/)
* [Karura Crowdloan](../home/crowdloan/)


# Collator

## Overview

Collators maintain parachains by collecting parachain transactions from users and producing state transition proofs for Relay Chain validators. In other words, collators maintain parachains by aggregating parachain transactions into parachain block candidates and producing state transition proofs for validators based on those blocks.

While Karura’s network security and consensus (nPoS) are provided by Kusama Relay chain's Validator set, the Collator set of Karura will keep the network alive by collecting parachain transactions for validators to verify them. **Unlike validators, collators has nothing to do with security of the network, by being a parachain, the network is by default trustless and decentralized, and a parachain only needs one honest collator to be censorship-resistant.** Read more on Collators [here](https://wiki.polkadot.network/docs/learn-collator).

Karura's Collator node maintains a full-node service for the Kusama Realy Chain, and a full-node service for the Karura network. Each service has its own http/ws RPC endpoints, P2P ports etc. The base path of the Kusama full-node service is located inside of the base path of the Karura full-node service.

## Collator Roll Out Plan

Karura takes a phased approach to roll out the Collator operation. Since Collators are non-security critical operation, a parachain only needs one honest Collator to be censorship-resistant, and more collators are not necessarily good e.g. it will slow down the network, the Collator roll-out plan is designed first-and-foremost to ensure network stability and operation.

**Current Phase: Private Collator Set**

**Phase 0: Private Collator Set**\
The Genesis of the Karura network was launched on 23rd June, 2021. Upon genesis, Karura's network security and the consensus is provided by Kusama Relay Chain's nominated Proof-of-Stake (nPoS) validators. Just like Statemine (the common-good asset parachain on Kusama), Karura's Collators initially will be run by the Acala Foundation, until the Collator software is stable and can be released to the wider community.

**Phase 1: Authorized Collator Set (We are here)**\
Through governance approval, Karura will then open the Collator set to an authorized set of collators. While there are no block rewards nor additional incentives for these authorized collators, they are paid a reasonable rate for their node service provisioning by the Acala Foundation.

These collators are known reputable node service providers who have a proven track-record of service levels and demonstrated a deep commitment to the network. It is expected that there will be much chaos and software upgrades during this phase still, and these collators are required to work closely with the core dev team to ensure network stability.

It is expected that the Karura network will maintain such an authorized Collator Set until the network is fully stabilized, the collator staking module and the reward scheme are fully implemented and audited.

**Phase 2: Public Collator Set**\
Through governance approval, Karura will then enable the permissionless election of Collators and enable collator rewards. Due to the fact that Collators are non-security critical, a parachain only needs a small set of Collators to ensure liveness and censorship-resistance, the reward scheme will reflect this accordingly.

You can express interest in becoming a collator/liveness provider for the Karura Network (and later Acala Network) by [filling in this form](https://forms.gle/WQesfKVZmJeXov1e9).

You can subscribe to the [`Node Operator - Announcement`](https://discord.gg/uWSZWsUcEn) channel on our Discord for updates and breaking changes.

## Collator Node

### Spec Requirement

Same as [the Kusama validator node requirement](https://guide.kusama.network/docs/maintain-guides-how-to-validate-kusama/#requirements).

### Run Node

Refer to the [Full Node Guide](full-node.md).

### Collator Configuration

#### **Key Management**

Karura Collator needs Aura session key. RPC `author_rotateKeys` or `author_insertKey` can be used to update session key.

#### **Registration**

* Karura is currently using the `collectorSelection` pallet from Statemint to handle collator registration. During the authorized Collator set phase, the required candidacy bond will be an unattainably high value to prevent public registration.
* Authorized providers will need to submit the public key of the Aura session key for the collator.

#### **Machine Spec**

Karura Collators need to ensure their machines satisfy the minimum spec requirement for running a full node. See ["Spec Requirement"](full-node.md#spec-requirement) for more details.

#### CLI

* `--collator` for the parachain part

### **Example CLI**

```
--base-path=/acala/data
--chain=karura
--name=collator-1
--collator
--execution=wasm
--
--chain=kusama
```

# Full Node

## Spec Requirement

You can check if your machine satisfy the spec requirement by using the following make command to benchmark your machine.

```
// If you are running docker image:
docker run acala/karura-node:latest benchmark machine --chain=karura

// If you are using dev environment:
make benchmark-machine
```

Note:

You need to setup your dev environment first for make commands to work.

The benchmark result will look similar to this: ![](machine-benchmark.png)

## Run from Source Code

* Clone the repo: [https://github.com/AcalaNetwork/Acala](https://github.com/AcalaNetwork/Acala)
* Checkout tag here: [https://github.com/AcalaNetwork/Acala/tags](https://github.com/AcalaNetwork/Acala/tags)
* Install dependencies
* Build Karura: `cargo build --release --features with-karura-runtime`
* Run `./target/release acala --chain=karura`

## Using Docker

* Image: `acala/karura-node:latest` or `acala/karura-node:[version number]`
* `docker run acala/karura-node:latest --chain=karura`

## Common CLI

* CLI is mostly the same as any Substrate-based chain such as Polkadot and Kusama
* Because there are two node services are running, `--` is used to split the CLI. Arguments before `--` are passed to the parachain full-node service and arguments after `--` is passed to the Relay Chain full-node service.
  * For example `--chain=parachain.json --ws-port=9944 -- --chain=relaychain.json --ws-port=9945` means
    * The parachain service is using `parachain.json` as the chain spec and the web socket RPC port is 9944
    *   The Relay Chain service is using `relaychain.json` as the chain spec and the web socket

        RPC port is 9945
* It is recommended to explicitly specify the ports for both services to avoid confusion
  * For example `--listen-addr=/ip4/0.0.0.0/tcp/30333 --listen-addr=/ip4/0.0.0.0/tcp/30334/ws -- --listen-addr=/ip4/0.0.0.0/tcp/30335 --listen-addr=/ip4/0.0.0.0/tcp/30336/ws`
* It is recommended to add `--execution=wasm` for parachain service to avoid syncing issues.

## Example CLI

### Archive PRC Node

```
--base-path=/acala/data
--chain=karura
--name=rpc-1
--pruning=archive
--ws-external
--rpc-external
--rpc-cors=all
--ws-port=9944
--rpc-port=9933
--ws-max-connections=2000
--execution=wasm
--
--chain=kusama
```


# Protocol Info

## Tokens

* **Token decimals:**
  * Karura (KAR): 12
  * LKSM: 12
  * Karura Dollar (kUSD): 12
* **Base unit:** “Plank"
* **Balance type:**
* **Total Fixed Supply of KAR:** 100,000,000

## Account

### Address Format

Karura uses the [SS58 (Substrate) address format](https://github.com/paritytech/substrate/wiki/External-Address-Format-\(SS58\)). Relevant SS58 prefixes are:

* **Acala**: 10 ([ss58 registry details](https://github.com/paritytech/substrate/blob/df4a58833a650cf37fc97764bf6c9314435e3cb2/ss58-registry.json#L103-L111))
* **Karura**: 8 ([ss58 registry details](https://github.com/paritytech/substrate/blob/df4a58833a650cf37fc97764bf6c9314435e3cb2/ss58-registry.json#L85-L92))
* **Mandala**: 42

### Existential Deposit

Karura uses an _existential deposit_ (ED) to prevent dust accounts from bloating state. If an account drops below the ED, it will be removed from this account and be donated to the Treasury.

ED of native token KAR is configured in the runtime. Non-native tokens (KSM, kUSD, BTC etc) can be queried via SDK. The amount of ED can only be decreased, not increased, therefore it often starts with a higher number.

`transfer` and `deposit` in `pallet_balances` and `orml_tokens` will check the ED of the receiver account. A transaction may fail due to not meeting ED requirements, a typical one would be a user is swapping token A for token B, where token A balance no longer meets ED requirements. A front-end DApp shall perform checks and prompt user for such incidents.

Read more on ED [here](../../../get-started/get-started/karura-account/#existential-deposit).

## Protocol Fees

* **Mint kUSD with KSM & lKSM:**
  * **Liquidation penalty:** 12%
  * **Stability Fee:** 3%

## Transaction Fees

Karura uses weight-based fees, unlike gas, are predictable and charged pre-dispatch. See the [transaction fee](../../../get-started/get-started/transaction-fees.md) page for more info.

## Types

Type definitions allow the SDK to know how to serialize / deserialize blocks, transactions and events.

Acala's type definition bundle can be found [here](https://unpkg.com/browse/@acala-network/type-definitions@latest/json/typesBundle.json).

## MultiLocation

You can use these MultiLocation to add Karura token assets to other parachains foreign token list.

Asset Name: Acala Dollar \
Asset Symbol: AUSD\
Decimals: 12\
existentialDeposit: 0.01

`{"parents": 1, "interior": {"X2": [{"Parachain": 2000}, { "GeneralKey": 0x0081} ]}}`

Asset Name: Liquid KSM\
Asset Symbol: LKSM\
Decimals: 12\
existentialDeposit: 0.0005

`{"parents": 1, "interior": {"X2": [{"Parachain": 2000}, {"GeneralKey": 0x0083} ]}}`&#x20;

Asset Name: Karura Native Token\
Asset Symbol: KAR\
Decimals: 12\
existentialDeposit: 0.1

`{"parents": 1, "interior": {"X2": [{"Parachain": 2000}, { "GeneralKey": 0x0080} ]}}`

### Autogenerated MultiLocations

{% embed url="https://replit.com/@GregoryLuneau/Karura-MultiLocations?lite=true" %}
Click Run to generate the current full list of MultiLocations
{% endembed %}

## JS SDK

Acala.js: [https://github.com/AcalaNetwork/acala.js](https://github.com/AcalaNetwork/acala.js)

Documentation: [https://github.com/AcalaNetwork/acala.js/wiki](https://github.com/AcalaNetwork/acala.js/wiki)

Please also refer to the [documentation of polkadot.js](https://polkadot.js.org/docs/api/).

## Telemetry

[https://telemetry.polkadot.io/#list/Karura](https://telemetry.polkadot.io/#list/Karura)

## Polkadot apps

[https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkarura-rpc.dwellir.com#/explorer](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkarura-rpc.dwellir.com#/explorer)

## Explorer

[https://karura.subscan.io/](https://karura.subscan.io/)


---
description: Integration Guide
---

# Karura Network

Karura is a parachain of the Kusama Relay chain, with all of its network security and consensus provided by Kusama's Validator set. As a [Substrate](https://www.substrate.io/)-based chain, most of Karura's integration points are the same as Kusama and Polkadot. As a parachain specifically though, the key differences will be outlined in this document.

This guide contains the following sections:

1. [Protocol Info](protocol-info.md)
2. [Token Transfer](token-transfer.md)
3. [Networks](../../../integrate/karura/endpoints.md)
4. [Run a Full Node](full-node.md)
5. [Run a Collator Node](collator.md)


# Token Transfer

Karura supports different types of tokens than Kusama, and allows various ways to transfer tokens. This guide will walk through tokens available on Karura, tools can be used for transfers, how to send transfer transactions, monitor and track these transactions.

## Token Types

### Token

| Symbol | Description                                            | CurrencyId   | Decimals | Minimal Balance |
| ------ | ------------------------------------------------------ | ------------ | -------- | --------------- |
| KAR    | native token of Karura network                         | Token(KAR)   | 12       | 0.1 KAR         |
| aUSD   | multi-collateralized stablecoin                        | Token(KUSD)  | 12       | 0.01 aUSD       |
| KSM    | crossed to Karura from Kusama Relay Chain              | Token(KSM)   | 10       | 0.01 KSM        |
| LKSM   | tokenized staked LKSM from the Liquid Staking protocol | Token(LKSM)  | 10       | 0.05 LKSM       |
| BNC    | Bifrost Native Token                                   | Token(BNC)   | 12       | 0.008 BNC       |
| TAI    | Taiga                                                  | Token(TAI)   | 12       | 1 TAI           |
| PHA    | Phala Native Token                                     | Token(PHA)   | 12       | 0.04 PHA        |
| KINT   | Kintsugi Native Token                                  | Token(KINT)  | 12       | 0.00013333 KINT |
| VSKSM  | Bifrost Voucher Slot KSM                               | Token(VSKSM) | 12       | 0.0001 VSKSM    |
| KBTC   | Kintsugi Wrapped BTC                                   | Token(KBTC)  | 8        | 0.00000066 KBTC |

`AssetRegistry` registered the metadata info of this type token.

### DexShare

The lp share token for the trading pair of Karura DEX. The CurrencyId type of Karura DEX's lp token are `CurrencyId::DexShare`, and the decimals and minimal balance of lp token are same as the first token in `DexShare`. For example, `CurrencyId::DexShare(Token(KAR), Token(KSM))` is the CurrencyId of lp token of KAR/KSM pair, its decimal is 12, and minimal balance is 0.1, these are same as KAR.

Currently, `AssetRegistry` does not register metadata info of any lp token.

### Erc20

Token issued by ERC20 contracts deployed in Karura EVM+. The CurrencyId type is `Erc20(Address)`, `Address` is the ERC20 contract address on EVM+.

### StableAssetPoolToken

| Symbol | Description | CurrencyId              | Decimals | Minimal Balance |
| ------ | ----------- | ----------------------- | -------- | --------------- |
| taiKSM | Taiga KSM   | StableAssetPoolToken(0) | 12       | 0.0001 taiKSM   |

`AssetRegistry` registered the metadata info of this type token.

### ForeignAsset

| Symbol | Description               | CurrencyId      | Decimals | Minimal Balance |
| ------ | ------------------------- | --------------- | -------- | --------------- |
| RMRK   | RMRK                      | ForeignAsset(0) | 10       | 0.01 RMRK       |
| ARIS   | PolarisDAO                | ForeignAsset(1) | 8        | 0.001 ARIS      |
| QTZ    | Quartz                    | ForeignAsset(2) | 18       | 1 QTZ           |
| MOVR   | Moonriver                 | ForeignAsset(3) | 18       | 0.001 MOVR      |
| HKO    | Heiko                     | ForeignAsset(4) | 12       | 0.1 HKO         |
| CSM    | Crust Shadow Native Token | ForeignAsset(5) | 12       | 1 CSM           |
| KICO   | KICO                      | ForeignAsset(6) | 14       | 1 KICO          |
| USDT   | Tether USD                | ForeignAsset(7) | 6        | 0.01 USDT       |

Tokens originated from other parachains. `AssetRegistry` registered the metadata info of this type token.

## Query token's metadata on assetRegistry

![query asset metadata](asset-registry-query.png)

* **Native Network Token**
  * KAR
* **Native Protocol Tokens**
  * LKSM: tokenized staked KSM from the Liquid Staking protocol
  * kUSD: multi-collateralized stablecoin
* **Foreign Tokens**
  * KSM: crossed to Karura from Kusama Relay Chain
  * Tokens originated from other parachains
  * Tokens crossed from other blockchains such as ETH, renBTC or Compound CASH
* **ERC20 Tokens**
  * Token issued by ERC20 contracts deployed in Karura EVM

## Tools

* JS/TS SDK: [https://github.com/AcalaNetwork/acala.js](https://github.com/AcalaNetwork/acala.js)
* Blockchain explorer: [http://karura.subscan.io](http://karura.subscan.io)
* api-sidecar: [https://github.com/paritytech/substrate-api-sidecar](https://github.com/paritytech/substrate-api-sidecar)
* txwrapper: [https://github.com/AcalaNetwork/txwrapper](https://github.com/AcalaNetwork/txwrapper)
* SubQuery: [https://github.com/AcalaNetwork/acala-subql](https://github.com/AcalaNetwork/acala-subql)

## Token balances

Query chain state to get token balances.

### Native token (KAR) balances

Query `system` module to get native token (KAR) balances data.

#### system.account

* Returns the `AccountInfo` of given account. For different types of balances, check the fields in `AccountInfo.data`
  * `free`: the free balance.
  * `reserve`: the reserved balance.

### Other tokens

For non-native tokens, like KSM, LKSM, kUSD, query `tokens` module to get balances info.

#### tokens.accounts

* Returns the `OrmlAccountData` of given account and currency ID. For different types of balances, check the fields:
  * `free`: the free balance.
  * `reserved`: the reserved balance.

#### tokens.lock

* Returns the `BalanceLock` of given account and currency ID. `BalanceLock` has two fields:
  * `id`: the lock identifier.
  * `amount.` the locked amount.
* Note locks could be overlapped, and the same amount of tokens could be under locked by multiple locks.

## Send Tokens

### Transactions

#### currencies.transfer

* [https://karura.subscan.io/extrinsic?module=Currencies\&call=transfer](https://karura.subscan.io/extrinsic?module=Currencies\&call=transfer)
* This can be used to send any supported tokens in the network, including KAR, KSM, LKSM, kUSD etc.

#### currencies.transferNativeCurrency

* [https://karura.subscan.io/extrinsic?module=Currencies\&call=transfer\_native\_currency](https://karura.subscan.io/extrinsic?module=Currencies\&call=transfer\_native\_currency)
* This can be used to send native token (KAR). It has slightly cheaper transaction fees compare to currencies.transfer

#### balances.transfer

* [https://karura.subscan.io/extrinsic?module=Balances\&call=transfer](https://karura.subscan.io/extrinsic?module=Balances\&call=transfer)
* Same as `currencies.transferNativeCurrency`, only for native token (KAR).
* Compatible with Polkadot / Kusama and most other Substrate-based chains.

## Receive Tokens

There are multiple ways to detect incoming balance transfers:

* Monitor events
* Subscribe storage changes
* Monitor transactions

### Monitor Events

Monitoring events is a recommended way to track incoming balance transfers. It can handle **ALL** types of transfer transactions including the one that is not initiated by a transaction directly (e.g. delayed proxy).

#### balances.transfer

* [https://karura.subscan.io/event?module=Balances\&event=Transfer](https://karura.subscan.io/event?module=Balances\&event=Transfer)
* Emitted when a native token (KAR) transfer happened.

#### currencies.transfer

* [https://karura.subscan.io/event?module=Currencies\&event=Transferred](https://karura.subscan.io/event?module=Currencies\&event=Transferred)
* Emitted when a token transfer happened.
* NOTE: This is not emitted when balances.transfer is used to make a transfer.

#### currencies.deposit

* [https://karura.subscan.io/event?module=Currencies\&event=Deposited](https://karura.subscan.io/event?module=Currencies\&event=Deposited)
* Emitted when a token is minted to an account. This could happen when it is a cross-chain transfer or it is a transaction minting stablecoins.
  * For cross-chain transfer, there would be `ExecutedDownward` event along with the deposit. [https://karura.subscan.io/event?address=\&module=dmpqueue\&event=executeddownward](https://karura.subscan.io/event?address=\&module=dmpqueue\&event=executeddownward)

#### xtokens.transferred

* [https://karura.subscan.io/event?address=\&module=xtokens\&event=transferred](https://karura.subscan.io/event?address=\&module=xtokens\&event=transferred)
* Emitted when a cross-chain transfer happened from Karura to other chains.
* Triggered by `xtokens.transfer` extrinsic.

#### xtokens.transferredmultiasset

* [https://karura.subscan.io/event?address=\&module=xtokens\&event=transferredmultiasset](https://karura.subscan.io/event?address=\&module=xtokens\&event=transferredmultiasset)
* Emitted when a cross-chain transfer happened from Karura to other chains.
* Triggered by `xtokens.transfer_multiasset` extrinsic.

### Storage changes RPC

* [state\_subscribeStorage](https://polkadot.js.org/docs/substrate/rpc#subscribestoragekeys-vecstoragekey-storagechangeset)
  * Subscribe to a list of account balances. However, it does not guarantee subscription delivery due to connection errors or blockchain reorg.

### Monitor Transactions

It is possible to fetch transactions in every block, check for transfer transactions, and check if the transfer transaction is successful. However, this may likely yield false-negative results i.e. deposit received but failed to recognize, due to the various ways for transfer.

Refer to Send Tokens section for direct transfer transactions. In additional, to sending transfer transactions individually, there are common utility methods to batch send transfer transactions:

#### utility.batch

* [https://karura.subscan.io/extrinsic?module=Utility\&call=batch](https://karura.subscan.io/extrinsic?module=Utility\&call=batch)
* This can be used to send batch transaction
* NOTE: batched transactions will always emit success events.
  * `utility.BatchCompleted` event indicates that all transactions are successful
  * `utility.BatchInterrupted` event indicates which transaction failed. Transactions before the failed transaction are executed successfully and will not be reverted.

#### utility.batchAll

* [https://karura.subscan.io/extrinsic?module=Utility\&call=batch\_all](https://karura.subscan.io/extrinsic?module=Utility\&call=batch\_all)
* This is similar to utility.batch but will revert all transactions upon failed transaction.

## [Transfer Code Samples](https://github.com/AcalaNetwork/acala-js-example/blob/21a3be3538260cc8a047856bf163dad75de1db3a/src/transfer-examples/readme.md)


# ACA/KAR Staking

* [ACA Staking Guide](https://guide.acalaapps.wiki/staking/aca-staking)
* ACA-USDCet Liquidity Pool: [dapp](https://apps.karura.network/swap/bootstrap), [doc](https://wiki.karura.app/stake/bootstrapping)
* [KAR Staking Guide](https://wiki.karura.app/stake/kar-staking)
* KAR-USDCet Liquidity Pool: dapp, [doc](https://guide.acalaapps.wiki/acala-swap/bootstrapping-guide)
# ACA

## Overview

Acala network has grown beyond the original ACA scope which has limited utility to support new growth based on new infrastructure and protocols built. The Exodus Upgrade aims to align stakeholders, participants within the Acala ecosystem, protocol functionalities and network infrastructures, and ACA as a utility and securing element of Acala Network. It will optimize for network growth, sustainability and safety by boosting ACA utility and ACA holder engagement.

{% hint style="warning" %}
The following documentation outlines the intended features and processes that Acala Exodus Upgrade intends to implement in the future. This document will continue to be updated and reviewed as we progress with the Exodus Upgrade. Please note that certain sections may contain inaccuracies or outdated information.
{% endhint %}

<figure><img src="https://lh5.googleusercontent.com/5zpibsE0N266Dtaboqq2RIcJVQyTza8Y73Mo1k8nMrsZQr6O3afUsMBgrwZTqMv6Bim8cE9l7wNAFhGYQU1anWDxAjWb_cAXzqtqLYimaIS6xRQX4LM7BHIm7nPMAFi_UwcQqqBXvaS3zdC21KReeFE" alt=""><figcaption></figcaption></figure>

### ACA Utility

The following are new ACA utilities in addition to existing utilities such as used as transaction fees, vote in governance proposals, pallet deployments etc.

* ACA Staking
* Ecosystem token contributions are farmable via staked ACA
* Vote for emission distribution to liquidity pools and dApps
* A portion (e.g. 20% via governance) of staked ACA can be used as a mitigation tool in case of a shortfall event within the protocols that are native to Acala

ACA will also power captive liquidity with the following initial long-term incentivized liquidity pools in Acala Swap

* ACA to DOT
* ACA to USDT (or USDC)
* LSDs to DOT
* LSDs to USDT (or USDC)
* LSD to LSD
* DOT to USDT (or USDC)
* aUSD to DOT (or aSEED-DOT after aSEED launch)

### ACA Emissions

Acala will have a total of 100 million ACA emissions per year limited to 6 years upon governance approval. 50% of the emission will be reserved for ACA staking, and 50% reserved for yield farming for liquidity pools, dApps built on the Universal Asset Hub (UAH), and other avenues that help build liquidity and adoption.&#x20;

### ACA Burns

A portion of unspent emissions will be burned periodically e.g. 1% unspent emission every month, a portion of the network fees accumulated over a period of time will also be burned e.g. cumulative network fees will be recorded every six months, and 20% will be burned via governance. This overtime may make ACA deflationary.

\
Note: Karura KAR will follow the same upgrade with 1/10 of the emission as ACA.

# aSEED Integration Guide

## Overview

aSEED does not have a pegged price; it is redeemable to aSEED treasury underlying asset [in future under certain criteria](https://wiki.acala.network/acala-exodus-upgrade/ausd-seed-aseed#redemption). Below are liquidity venues for aSEED:

Acala

* Acala Swap
* Stellaswap

Karura

* Karura Swap
* Zenlink

## Integrate via EVM+

aSEED is available as ERC-20 assets on Acala EVM+ on both Acala and Karura

Contract Address

* aSEED (Karura): 0x0000000000000000000100000000000000000081
* aSEED (Acala): 0x0000000000000000000100000000000000000001

## Integrate via Substrate

Refer to [token transfer guide](https://wiki.acala.network/integrate/acala/token-transfer)


# aUSD SEED (aSEED)

The goal of aUSD Seed (aSEED) is to provide a pathforward for aUSD with options to exit existing aUSD holdings/vaults or to participate in Acala’s future growth.

{% hint style="warning" %}
_The following documentation outlines the intended features and processes that Acala Exodus Upgrade intends to implement in the future. This document will continue to be updated and reviewed as we progress with the Exodus Upgrade. Please note that certain sections may contain inaccuracies or outdated information._
{% endhint %}

## aUSD Conversion

aUSD will be converted to aSEED 1:1 across all avenues including account balance, and liquidity pools etc. This means current aUSD holders will hold aSEED instead, and aUSD LPs will be converted to aSEED LPs.

Preparation: prior to aUSD to aSEED conversion, set Honzon risk parameters to stop minting, liquidation etc.

aUSD (Karura) will be converted to aSEED (Karura), aUSD (Acala) will be converted to aSEED (Acala).

### aUSD Conversion Date

aUSD Conversion is targeted to be on July 20 (exact block TBD) provided that the community vote is passed and on-chain changes are executed. From this date, `aUSD` will become `aSEED` (aUSD Seed).

The on-chain `assetRegistry` will be updated with the new symbol (aSEED) and name (aUSD SEED). &#x20;

If you are a holder of aUSD, then you do not need to take any action.

If you are a vault owner, you can continue to manage your vaults after this date till CDP Conversion date.

If you are a builder of a tool that consumes `@acala-network/api` then there should be no real changes to be made in your application. However if your application displays the token symbol and token name in an offchain way, then you will need to ensure you display the correct symbol and name.

**Find aSEED brand assets** [**here**](https://wiki.acala.network/ecosystem/media-kits#acala-brand-assets)**.**

## CDP Conversion

For a CDP owner who has borrowed $$x$$ amount of aUSD with a deposit of $$y_{c_i}$$ amount of collateral type $$c_i$$, and chooses not to repay their CDP debt by the aSEED conversion event:

At the aSEED conversion

* their $$x$$ amount of aUSD tokens will become $$x$$  amount of aSEED tokens ​
* the amount of collateral going into the aSEED treasury is:

$$
\frac{x \hat{P_a} }{ \hat{P_{c_i}}}
$$

where $$\hat{P_a},  \hat{P_{c_i}}$$ are the aSEED conversion prices of aUSD and collateral type $$c_i$$ passed at the community votes (for Acala see the vote [here](https://voting.opensquare.io/space/acala/proposal/QmXFw8DZbX5wDFeD1kQtFDy8tmE4FKEir7tZVqe9vCqBTb), for Karura see the vote [here](https://voting.opensquare.io/space/karura/proposal/QmUuHgFt4fN4iKU6JzW2utx2cykz4Er3EyhLHRwYEjDk3r))

* the amount of collateral returning to the CDP owner is:&#x20;

$$
y_{c_i} - \frac{x \hat{P_a} }{ \hat{P_{c_i}}}
$$

### Example

For a CDP owner who has borrowed 200 aUSD with a deposit of 100 DOTs, and chooses not to repay their CDP debt by the aSEED conversion event: ​&#x20;

At the aSEED conversion, ​&#x20;

* their 100 aUSD tokens will become 100 aSEED tokens
* the amount of DOTs going into the aSEED treasury is:

$$
\frac{200 \cdot 0.538322 }{4.587095} = 23.471151
$$



* the amount of DOTs returning to the CDP owner is:

$$
100 - \frac{200 \cdot 0.538322 }{4.587095} = 76.528848
$$



## Redemption

aSEED holders can redeem the underlying assets in the aSEED treasury in future under certain set criteria, e.g. after 12 months and aSEED underlying value >= $1. The pallet code will be developed and criteria parameters will be voted in via governance.


# Execution Roadmap

{% hint style="warning" %}
The following documentation outlines the intended features and processes that Acala Exodus Upgrade intends to implement in the future. This document will continue to be updated and reviewed as we progress with the Exodus Upgrade. Please note that certain sections may contain inaccuracies or outdated information.
{% endhint %}

## Execution Roadmap

<figure><img src="https://lh6.googleusercontent.com/9mtrU6kxF3L3547AoNJhwpL1pj4M-esxh71KUxPk-qghvPDbao5mKObkPzRf7-77a7tEWABxhgMweoBOaSTp8uyttEzxqZ0mbQ_iwu-g8wBo8wq-OE_YGhphcnepwaUmkBbyj8if3ZyqoAwTOFFJSas" alt=""><figcaption></figcaption></figure>

## Execution Status

* [x] Approval Vote ([here](https://twitter.com/AcalaNetwork/status/1669606148209778688?s=20))
* [x] aSEED I: aUSD Conversion ([here](https://twitter.com/AcalaNetwork/status/1681919546691842049?s=20), [here](https://twitter.com/AcalaNetwork/status/1679339060857556993?s=20))
* [x] aSEED II: Vault Conversion
* [ ] aSEED III: Redemption
* [x] ACA I: Emission ([targeting Aug 15](https://twitter.com/AcalaNetwork/status/1678955311561076737?s=20))
* [x] ACA II: Staking
* [x] ACA III: Security, Dynamic Voting
* [x] UHA I: Acala Multichain Asset Router & LSTs
* [x] UHA II: Euphrates&#x20;
* [ ] UHA III Multichain

To kick off the Exodus Plan, an approval vote will be put forward for the general direction proposed. Each component of the Exodus Plan will be rolled out in phases.

### ACA Tokenomics I: Emission

Proposal and vote for new ACA emission and burn schedule. On-chain Treasury can be used to store the emission before actual distribution to pools and dApps etc. as some of which will require specific governance voting.

### ACA Tokenomics II: Staking

Deliver the ACA Farm pallet to provide ACA Staking and receive multiple reward tokens. ACA holders (including stakers) will vote for ACA emission distribution to liquidity programs. LST projects and dApps can deposit token contributions to the ACA Farm pallets.

### ACA Tokenomics III: Add Security, Dynamics Voting

Deliver pallet code to use locked assets in case of network shortfall. Proposal and vote for security parameters. In addition, there is more optimisation of II, delivering pallets that enable the following functionalities: voting for ACA emission distribution can be dynamically weighted based on vote participation, and LST projects and dApps token contributions to ACA Farm can be done via Smart Contract that is tied to emission governance, making the entire process more autonomous.

### aSEED I: aUSD Conversion

Prepare proposal and vote for parameter changes to aUSD Honzon protocol e.g. setting debt ceiling = 0 to cap aUSD issuance, pause oracle and liquidation etc. Prepare proposal and vote for aUSD conversion to aSEED such that all aUSD holders will then hold aSEED, aUSD pools will become aSEED pools, aUSD LPs will become aSEED LPs. aUSD and aUSD pools on other parachains can be coordinated for the conversion to continue support aSEED. Vault owners can still close vaults.

### aSEED II: Vault Conversion

Deliver the conversion pallet that can take % of the collateral in a vault, put it into the aSEED treasury and return the remaining collateral to the vault owner. This can be voted to execute at a specific later time so that vault owners would have sufficient time to prepare.

### aSEED III: Redemption

Prepare proposal and vote for redemption criteria e.g. after 12 months and aSEED underlying value >= $1. Deliver redemption pallet code for aSEED redemption for aSEED treasury assets.

### UAH I: Infrastructure and onboard/boost LSTs

Launch UAH infrastructure such as Acala Multichain Asset Router, launch liquidity programs for LST pools and partners

### UAH II: Euphrates dApp

Deliver the smart contract dApp on UAH, initially supporting boosted vaults for DOT LSTs. This will be one of the first examples where ACA emission gets distributed to boost a dApp, and LST project tokens are contributed to ACA Farm.

### UAH III: Multichain LSTs

Launch a pipeline of other L1 LSTs and LSTFi dApps. Incubate or deploy dApps that enable DOT holders to get exposure to multichain e.g. Ethereum staking yield and vice versa.



# Acala 2.0: Exodus Upgrade

{% hint style="warning" %}
_The following documentation outlines the intended features and processes that Acala Exodus Upgrade intends to implement in the future. This document will continue to be updated and reviewed as we progress with the Exodus Upgrade. Please note that certain sections may contain inaccuracies or outdated information._
{% endhint %}

## Overview

_Exodus is a story of courage and breaking new ground, having faith in what you believe in, and acting upon it with hard work and determination despite adversity. So Acala is determined to build for web3 finance vision, and this plan is to break old molds and pave new ways forward._

The Exodus Upgrade aims to overhaul and upgrade the Acala Network protocols for long-term self-sustainability and growth. This plan will provide a path forward for the aUSD product line, address the fundamental challenges of liquidity and adoption, propose a new product roadmap and refreshed tokenomics to build captive and sustainable liquidity and prosperity. This will enable Acala to deliver the unbiased prosperity vision with infrastructures and protocols essential to the evolving crypto ecosystem, a new global economy and better individual financial prospects.

The goals of the Acala Exodus Upgrade

* Provide a path forward for aUSD with options to exit existing positions or continue to ride with Acala’s growth
* Build the liquidity layer of web3 finance including LSTFi focused Universal Asset Hub that has sustainable and captive liquidity&#x20;
* Upgrade ACA to boost ACA utility and support sustainable network growth

See the original plan [here](https://acala.discourse.group/t/acala-exodus-plan/2125).

## Roadmap

* Overview of Acala 2.0 ([tweet thread](https://twitter.com/AcalaNetwork/status/1668272031564021760?s=20))
* aSEED: a path forward for aUSD and share growth of Acala ([tweet thread](https://twitter.com/AcalaNetwork/status/1676788072107905025?s=20))
* ACA upgrade: boosting ACA and share Acala growth ([tweet thread](https://twitter.com/AcalaNetwork/status/1678955311561076737?s=20))
* Euphrates liquidity DApp for boosted staking is now Live ([tweet thread](https://x.com/AcalaNetwork/status/1706600178629955814?s=20))

{% content-ref url="execution-roadmap.md" %}
[execution-roadmap.md](execution-roadmap.md)
{% endcontent-ref %}


# Universal Asset Hub (UAH)

## Overview

Liquidity is fragmented on different L1, L2 and parachains. Real adoption requires deep and ubiquitous liquidity accessible for any dApp on any chain and any parachain. This is the goal for Acala’s Universal Asset Hub (UAH).

{% hint style="warning" %}
The following documentation outlines the intended features and processes that Acala Exodus Upgrade intends to implement in the future. This document will continue to be updated and reviewed as we progress with the Exodus Upgrade. Please note that certain sections may contain inaccuracies or outdated information.
{% endhint %}

## LST Variaty & Liquidity

Acala has been reliant on DOT, DOT LST (liquid staking token), and DOT derivatives as collateral and liquidity, and has been leading the Polkadot native assets TVL and xcm transaction volume. With the Exodus Upgrade, this will be taken to the next level and with expanded scope.&#x20;

An initial step of the Exodus Upgrade is to boost DOT LSTs to DOT, to other LSTs, and to USDC/USDT liquidity, meanwhile launching with new LST partners that have significant synergy with Acala, and preparing expansion for multichain LSTs.

### Types of LSTs:

**Acala built:**

LDOT, powered by the Homa protocol, is a DeFi-native non-custodial LST. It’s live and battle-tested on Acala

**Acala hosted:**

LSDOT, an enterprise-grade LST built by Liquid Collective, is a compliant and secure solution for more adoption through partners like Alluvial, Coinbase and Figment. It will be built on top of the Homa protocol and launched on Acala.

tDOT, a synthetic DOT LST by Taiga that aggregates LST liquidity. Already live on Acala.

**Multichain LSTs:**

We will expand to build multichain LST liquidity from where the demand is e.g. Ethereum LSTs including LSETH (enterprise-grade LST by Liquid Collective), stETH by Lido, tapETH (Curve for LSTs). Through building with the Tapio protocol (tapETH) in stealth mode in the past months, we have received reaffirming feedback to contribute our innovation in the ever-growing LSTFi ecosystem, which is now aligned with our strategy via the Exodus Upgrade.

## Acala Multichain Asset Router

Fragmented liquidity leads to fragmented developer and user experience. Thus UAH aims to offer liquidity agnostic to blockchains and seamless to DApps. This is powered by Acala Multichain Asset Router built on top of the XCM standard and Wormhole protocol using Substrate and Acala EVM+. UAH supports both Substrate token formats and EVM token standards, and will expand to other standards that deem to bring liquidity and adoption.

<figure><img src="https://lh6.googleusercontent.com/if3JxD_W6hT2HpqXH221KE8Q9pZHgTbugjwIQPJFw2QKwXFRq8wDNXpr89dbLVqBZToigosDAziCRvOPqses5JBwOR6uZq3Hl6fPLyCXtBCAWLNFbNsusTYGWXY5WiK55cw067sF2RmrkqCv9qPepKE" alt=""><figcaption></figcaption></figure>

## LSTFi Ecosystem

An LSTFi ecosystem will be fostered to create innovative use cases and bring in more adoption of Web3, which will be powered by Acala EVM+ dApp platform and long-term yield farming from upgraded ACA tokenomics.&#x20;

ACA holders can vote to direct ACA emission contribution to incentives programs for dApps and pools, and stake to participate in sharing ACA staking rewards and ecosystem project token contributions. This will potentially create a flywheel for ACA holder engagement and liquidity growth and will bring along more innovations, partners and communities to Acala.&#x20;

Euphrates liquidity dApp

The Euphrates dApp will initially be deployed with DOT-based LST liquidity vaults, and later expand to support Ethereum and other multichain LST liquidity vaults which will open up opportunities for DOT holders to get exposure for Ethereum LSTFi and vice versa.

\
\


---
description: The development direction.
---

# Governance Overview

* [Governance](https://wiki.acala.network/learn/basics/governance-overview#governance)
  * [Chambers of Acala Governance](https://wiki.acala.network/learn/basics/governance-overview#chambers-of-acala-governance)
  * [Progressive Decentralization](https://wiki.acala.network/learn/basics/governance-overview#progressive-decentralization)
    * [Phase I: Council Governance](https://wiki.acala.network/learn/basics/governance-overview#phase-i-council-governance)
      * [Implementation](https://wiki.acala.network/learn/basics/governance-overview#implementation)
        * [Mandala TC3](https://wiki.acala.network/learn/basics/governance-overview#mandala-tc3)
    * [Phase II: Elected Council + Referendum Governance](https://wiki.acala.network/learn/basics/governance-overview#phase-ii-elected-council-referendum-governance)
  * [Jurisdictions](https://wiki.acala.network/learn/basics/governance-overview#jurisdictions)
    * [Honzon Council Jurisdictions](https://wiki.acala.network/learn/basics/governance-overview#honzon-council-jurisdictions)
    * [Homa Council Jurisdictions](https://wiki.acala.network/learn/basics/governance-overview#homa-council-jurisdictions)
    * [General Council Jurisdiction](https://wiki.acala.network/learn/basics/governance-overview#general-council-jurisdiction)
  * [Under Discussion & Development](https://wiki.acala.network/learn/basics/governance-overview#under-discussion-and-development)

## Governance

Acala takes a phased approach to employ various governance mechanisms that will allow it to progressively decentralize and ultimately be commanded by the majority network stakeholders.

We take much inspiration from Polkadot for technical and governance mechanism design, and adapt it to best serve the Acala Network.

### Chambers of Acala Governance

The General Council and ACA Referendum are the overarching chambers that govern the Acala Network. The General Council appoints these specialist councils to manage aspects of the network: the Honzon \(Financial\) Council, the Homa \(Staking Liquidity\) Council and the Technical Council. The L-DOT Referendum chamber together with the Homa Council would govern the staking liquidity protocol related affairs.

### Progressive Decentralization

#### Phase I: Council Governance

The earliest stage of developing the Acala Network is led by the Acala Foundation, in a way not much different from a normal startup: a great team, lean development, tight execution, and quick learning. **There should be no pretense of decentralization**

At this stage, decisions of the Acala Foundation regarded the network is made transparent on-chain via appointed General Council voting. All the other councils are appointed by the General Council.

**Proposals & Motions**

* **Submission**: only council members can submit a proposal at this phase, and it will be open to the public in the next phase.
* **Voting**: is continuous \(no set time\) through motions that comprise of a proposal and required approvals.
* **Execution**: if a motion is approved, it can be executed using one of the following strategies, made possible by [Open Web3 Stack](https://github.com/open-web3-stack/open-runtime-module-library):
  * immediately: a super majority is required.
  * at a delayed time: specialist councils can cancel an uncontroversially dangerous or malicious motion before it is applied. A simple majority is required.
  * gradually: numeric value change motions e.g. increase stability fee can be applied gradually over time reduce disruption. A simple majority is required.
* **Durations**: all motion durations are set to 7 days in this phase.

**General Council**

* **Desired membership**: of the General Council is 5 in this phase, and will be increased in the next phase.
* **Tallying**: A simple majority of the council can decide the next non-immediately executable motion, a super majority is required otherwise.
* **Selection**: Appointed by the Acala Foundation.
* **Proposals/Motions**: Only members of the General Council can submit root call propose e.g. runtime upgrade. Can cancel any uncontroversially dangerous motions via unanimous vote.

**Honzon Council**

* **Desired membership**: of the Honzon Council is 5 in this phase, and will be increased in the next phase.
* **Tallying**: a simple majority of the council can decide the next motion.
* **Selection**: elected by the General Council via simple majority.
* **Proposals/Motions**: members can submit Honzon related parameter change proposals. All motions are executed at a delayed time, during which the General Council or Technical Council can uncontroversially dangerous motions.

**Homa Council**

* **Desired membership**: of the Homa Council is 3 in this phase, and will be increased in the next phase.
* **Tallying**: a simple majority of the council can decide the next motion.
* **Selection**: elected by the General Council via simple majority.
* **Proposals/Motions**: members can submit Homa related parameter change proposals. All motions are executed at a delayed time, during which the General Council or Technical Council can uncontroversially dangerous

**L-DOT Chamber**

* **Proposals/Motions**: L-DOT holders can vote to select desired validators every certain period e.g. every era.
* **Scheme**: L-DOT holders can vote for 16 candidates based on a scheme similar to Phragmen election \[https://wiki.polkadot.network/docs/en/learn-phragmen\].

**Technical Council**

* **Desired membership**: of the Technical Council is 3 in this phase, and will be increased in the next phase.
* **Selection**: elected by the General Council via simple majority.
* **Proposals/Motions**: can cancel any uncontroversially dangerous motions via unanimous vote.

#### **Implementation**

#### **Mandala TC3**

Four council chambers have been implemented: General Council, Honzon Council, Homa Council, Technical Council. They currently work alongside with `sudo` for functionality testing purposes only. 'Real' governance will take effect in our canary network **Karura** with real stake.

**Council Chambers** 

![Dapp](../../.gitbook/assets/gov_council.png)

**Council Motions** 

![Dapp](../../.gitbook/assets/gov_motion.png)

We are watching closely good practices and tools for documenting governance proposals, gathering opinions and debates, publishing voting result and execution status etc. As an example, [Polkassembly](https://kusama.polkassembly.io/) seems to be good place to start, and we might consider integrating or using similar approach for Acala governance.

#### Phase II: Elected Council + Referendum Governance

Coming soon...

### Jurisdictions

#### Honzon Council Jurisdictions

**Loan related parameters**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| StabilityFee | Rate | Stability fee \(in addition to global stability fee\) for a specific collateral | BTC: 0.000001 |
| LiquidationRatio | Ratio | Liquidation ratio for specific collateral | BTC: 150% |
| LiquidationPenalty | Rate | Liquidation penalty rate for specific collateral | BTC: 13% |
| RequiredCollateralRatio | Ratio | required collateral ratio for opening an aUSD loan for a given collateral | BTC: 180% |
| MaximumTotalDebitValue | Balance | Debt ceiling in aUSD for a given collateral | BTC: 100,000,000 |
| GlobalStabilityFee | Rate | Base stability fee for all collateral types | 0.0000005 |

**Liquidation and CDP Treasury related parameters**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| SurplusBufferSize | Balance | Surplus auction buffer. New surplus auction will be created when suplus &gt; surplus buffer + fixed size | 1,000,000 aUSD |
| SurplusAuctionFixedSize | Balance | Surplus auction size in aUSD | 10000 aUSD |
| InitialAmountPerDebitAuction | Balance | Initial ACA auction amount in a debt auction | 80000 ACA |
| DebitAuctionFixedSize | Balance | Debt auction size in aUSD | 10,000 aUSD |
| CollateralAuctionMaximumSize | Balance | Maximum collateral auction size | BTC: 0.1 |

#### Homa Council Jurisdictions

* allocation slash compensation either via Homa treasury or validator bond
* blacklist validators through unanimously consent
* define validator selection criteria

#### General Council Jurisdiction

Less frequently changed parameters and other types of changes are executed via runtime upgrade, which are administered by the General Council for now.

**Acala DeX parameters**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| GetExchangeFee | Rate | Exchange fee rate | 5‰ |
| GetBaseCurrencyId | CurrencyId | Base currency for trading pairs | aUSD |

**Global Stablecoin Parameters**

| parameter | type | description | example |
| :--- | :--- | :--- | :--- |
| CollateralCurrencyIds | Vec | Collateral asset types | \[BTC, DOT\] |
| DefaultLiquidationRatio | Ratio | Default liquidation ratio if no liquidation ratio set for specific collateral | 150% |
| DefaultDebitExchangeRate | ExchangeRate | Initial exchange ratio of debit and aUSD for all collateral | 10:1 |
| DefaultLiquidationPenalty | Ratio | Default liquidation ratio if no liquidation ratio set for specific collateral | 15% |
| MinimumDebitValue | Balance | Min debit value \(in aUSD\) of CDP to avoid dust | 1 |

**Liquidation and CDP treasury parameters**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| MaxSlippageSwapWithDEX | Ratio | During liquidation, if liquidate a collateral on DeX incurs a slippage less than this value, then the system would execute the liquidation on DeX instead of an auction | 5% |

**Auction parameters**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| MinimumIncrementSize | Rate | Minimum price increment | 5% |
| AuctionTimeToClose | BlockNumber | Auction time to close after each new bid | 500 |
| AuctionDurationSoftCap | BlockNumber | When total auction duration exceeds this value, the system will double price increment, and halve auction time to close to expedite the auction | 5000 |
| GetAmountAdjustment | Rate | Adjust ACA amount if there is no successful bit in a debt auction | 10% |

**Homa staking liquidity parameters**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| MaxBondRatio | Ratio | Maximum amount can be staked / total amount deposited. Remaining amount is used to expedite unbounding of unstaked assets | 90% |
| MinBondRatio | Ratio | Staking ratio would be kept above this ratio | 80% |
| MaxClaimFee | Rate | Maximum percentage charged for immediate or expedited unbounding period, fees charged in L-DOT | 5% |
| ClaimFeeReturnRatio | Ratio | Percentage of fees to be burned, remaining goes into Homa treasury | 80% |
| RewardFeeRatio | Ratio | Small portion of fee is charged from staking reward, which will be managed by the Homa treasury for slash compensation, development etc. | 1% |
| DefaultExchangeRate | ExchangeRate | Initial L-DOT to DOT exchange rate | 10:1 |

**Validators selection parameters**: Note: some of the code is mocked right now until relay chain bridge is available

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| MinBondThreshold | Balance | Minimum L-DOT bonded to elect validator to avoid dust | 1 LDOT |
| BondingDuration | Balance | Duration for unbonding L-DOT | 7 Era |
| MaxUnlockingChunks | usize | Maximum number of unbonding events at a pointing time | 7 |
| NominateesCount | usize | Number of validators can be nominated | 7 |

### Under Discussion & Development

* Next phase of the governance will involve elected councils and referendum chambers in action, details of which are being designed.More details on treasury will be released as we progress.
* Acala will have multiple treasuries and funds that manage the welfare of the network.
  * ACA Treasury holds genesis ACA, manages network income and expenses
  * each protocol will have their own treasury for income and expenses
  * the Sovereign Wealth Fund will hold surplus contributed from treasuries and purchase reserve according to investment strategies.
* The details of the Homa liquidity staking protocol is being fleshed out, which will have implication on governance.

---
description: This page will guide you through some basic interactions with your node.
---

# Node Interaction

This page will guide you through some basic interactions with your node. Always refer to the proper documentation for the tool you are using. This guide should _guide you to the proper tools,_ not be seen as canonical reference.

* [Substrate RPC API](https://crates.parity.io/sc\_rpc\_api/index.html)
* [Polkadot JS RPC Documentation](https://polkadot.js.org/docs/api/)
* [Substrate API Sidecar](https://github.com/paritytech/substrate-api-sidecar)

### RPC

The Substrate Chain client exposes HTTP and WS endpoints for RPC connections. The default ports are 9933 for HTTP and 9944 for WS.

To get a list of all RPC methods, the node has an RPC endpoint called `rpc_methods`.

For example:

```
$ curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "rpc_methods"}' http://localhost:9933/

{"jsonrpc":"2.0","result":{"methods":["account_nextIndex","author_hasKey","author_hasSessionKeys","author_insertKey","author_pendingExtrinsics","author_removeExtrinsic","author_rotateKeys","author_submitAndWatchExtrinsic","author_submitExtrinsic","author_unwatchExtrinsic","chain_getBlock","chain_getBlockHash","chain_getFinalisedHead","chain_getFinalizedHead","chain_getHead","chain_getHeader","chain_getRuntimeVersion","chain_subscribeAllHeads","chain_subscribeFinalisedHeads","chain_subscribeFinalizedHeads","chain_subscribeNewHead","chain_subscribeNewHeads","chain_subscribeRuntimeVersion","chain_unsubscribeAllHeads","chain_unsubscribeFinalisedHeads","chain_unsubscribeFinalizedHeads","chain_unsubscribeNewHead","chain_unsubscribeNewHeads","chain_unsubscribeRuntimeVersion","offchain_localStorageGet","offchain_localStorageSet","payment_queryInfo","state_call","state_callAt","state_getChildKeys","state_getChildStorage","state_getChildStorageHash","state_getChildStorageSize","state_getKeys","state_getKeysPaged","state_getKeysPagedAt","state_getMetadata","state_getPairs","state_getRuntimeVersion","state_getStorage","state_getStorageAt","state_getStorageHash","state_getStorageHashAt","state_getStorageSize","state_getStorageSizeAt","state_queryStorage","state_subscribeRuntimeVersion","state_subscribeStorage","state_unsubscribeRuntimeVersion","state_unsubscribeStorage","subscribe_newHead","system_accountNextIndex","system_addReservedPeer","system_chain","system_health","system_name","system_networkState","system_nodeRoles","system_peers","system_properties","system_removeReservedPeer","system_version","unsubscribe_newHead"],"version":1},"id":1}
```

Add parameters in the call, for example get a block by its hash value:

```
$ curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "chain_getBlock", "params":["0x3fa6a530850324391fde50bdf0094bdc17ee17ec84aca389b4047ef54fea0037"]}' http://localhost:9933

{"jsonrpc":"2.0","result":{"block":{"extrinsics":["0x280402000b50055ee97001","0x1004140000"],"header":{"digest":{"logs":["0x06424142453402af000000937fbd0f00000000","0x054241424501011e38401b0aab22f4d72ebc95329c3798445786b92ca1ae69366aacb6e1584851f5fcdfcc0f518df121265c343059c62ab0a34e8e88fda8578810fbe508b6f583"]},"extrinsicsRoot":"0x0e354333c062892e774898e7ff5e23bf1cdd8314755fac15079e25c1a7765f06","number":"0x16c28c","parentHash":"0xe3bf2e8f0e901c292de24d07ebc412d67224ce52a3d1ffae76dc4bd78351e8ac","stateRoot":"0xd582f0dfeb6a7c73c47db735ae82d37fbeb5bada67ee8abcd43479df0f8fc8d8"}},"justification":null},"id":1}
```

Some return values may not appear meaningful at first glance. Substrate uses [SCALE encoding](https://substrate.dev/docs/en/knowledgebase/advanced/codec) as a format that is suitable for resource-constrained execution environments. You will need to decode the information and use the chain [metadata](https://substrate.dev/docs/en/knowledgebase/runtime/metadata) (`state_getMetadata`) to obtain human-readable information.

#### Tracking the Chain Head

Use the RPC endpoint `chain_subscribeFinalizedHeads` to subscribe to a stream of hashes of finalized headers, or `chain_FinalizedHeads` to fetch the latest hash of the finalized header. Use `chain_getBlock` to get the block associated with a given hash. `chain_getBlock` only accepts block hashes, so if you need to query intermediate blocks, use `chain_getBlockHash` to get the block hash from a block number.

### Substrate API Sidecar

Parity maintains an RPC client, written in TypeScript, that exposes a limited set of endpoints. It handles the metadata and codec logic so that you are always dealing with decoded information. It also aggregates information that an infrastructure business may need for accounting and auditing, e.g. transaction fees.

The sidecar can fetch blocks, get the balance of an address atomically (i.e., with a corresponding block number), get the chain's metadata, get a transaction fee prediction, and submit transactions to a node's transaction queue. If you have any feature/endpoint requests, log an issue in the [repo](https://github.com/paritytech/substrate-api-sidecar).

The client runs on an HTTP host. The following examples use python3, but you can query any way you prefer at `http://HOST:PORT/`. The default is `http://127.0.0.1:8080`.

#### Fetching a Block

Fetch a block using the `block/number` endpoint. To get the chain tip, omit the block number.

```
import requests
import json

url = 'http://127.0.0.1:8080/block/2077200'
response = requests.get(url)
if response.ok:
    block_info = json.loads(response.text)
    print(block_info)
```

This returns a fully decoded block. In the `balances.transfer` extrinsic, the `partialFee` item is the transaction fee. It is called "partial fee" because the total fee would include the `tip` field. Notice that some extrinsics do not have a signature. These are inherents.

> When tracking transaction fees, the `extrinsics.paysFee` value is not sufficient for determining if the extrinsic had a fee. This field only means that it would require a fee if submitted as a transaction. In order to charge a fee, a transaction also needs to be signed. So in the following example, the `timestamp.set` extrinsic does not pay a fee because it is an _inherent,_ put in the block by the block author.

```
{'number': '2077200',
 'hash': '0x00e4e8bd8ec39e54aa26f01f5af7484d771f810fd7f1f4685a204dbc8fbfe80b',
 'parentHash': '0xf4065df1171047819592013770a98fff4b9058a96c4499676b72b1b93f5589e9',
 'stateRoot': '0xf1258925262058ef5d9eaaed49bd878e82584356f42aade40b68cdbd219be46c',
 'extrinsicsRoot': '0xbd4ea887b1a3cb3068db0524b938a0fb13093584b4e6664b3f121448a871cd3d',
 'logs': [{'type': 'PreRuntime',
   'index': '6',
   'value': ['BABE', '0x02b300000087b5c60f00000000']},
  {'type': 'Seal',
   'index': '5',
   'value': ['BABE',
    '0x689eddf91f1551f74de96ab0e2e52f41522bd82920cbe595148f873aa6d0541f48cfbb9b281181f2e52141b1c401dde7259634485fdab02cc7b63febe51ff78a']}],
 'onInitialize': {'events': []},
 'extrinsics': [{'method': 'timestamp.set',
   'signature': None,
   'nonce': '0',
   'args': ['1588085034000'],
   'tip': '0',
   'hash': '0x3cb46207ef8fadf3def3400ae2cb2a09b780431a6daf0b9bde15d91aeaf8faa3',
   'info': {},
   'events': [{'method': 'system.ExtrinsicSuccess',
     'data': [{'weight': '10000000', 'class': 'Mandatory', 'paysFee': True}]}],
   'success': True,
   'paysFee': True},
  {'method': 'finalityTracker.finalHint',
   'signature': None,
   'nonce': '0',
   'args': ['2077197'],
   'tip': '0',
   'hash': '0x2214831b2a13c75288d2267ebd089fffef82ba99d41f6c319ca06e24facc4d51',
   'info': {},
   'events': [{'method': 'system.ExtrinsicSuccess',
     'data': [{'weight': '10000000', 'class': 'Mandatory', 'paysFee': True}]}],
   'success': True,
   'paysFee': True},
  {'method': 'parachains.setHeads',
   'signature': None,
   'nonce': '0',
   'args': [[]],
   'tip': '0',
   'hash': '0xcf52705d1ade64fc0b05859ac28358c0770a217dd76b75e586ae848c56ae810d',
   'info': {},
   'events': [{'method': 'system.ExtrinsicSuccess',
     'data': [{'weight': '1000000000',
       'class': 'Mandatory',
       'paysFee': True}]}],
   'success': True,
   'paysFee': True},
  {'method': 'balances.transfer',
   'signature': {'signature': '0xf4cd36691d6ceb0a913e9d8409bde34e83761829f2fb25db15052de7ba9a6f7c4c54949f884d59005248c2c8b2951575ad0ae8f3c5d866e147a1771f47d91385',
    'signer': 'HUewJvzVuEeyaxH2vx9XiyAPKrpu1Zj5r5Pi9VrGiBVty7q'},
   'nonce': '155',
   'args': ['GoJ89MXptpNt1dH4NaZ73YtzknhrYeZcBJ33mifX5BMqoFz',
    '5000000000000'],
   'tip': '0',
   'hash': '0xc7b57537e2e63f866083ea22265cb65c846528d76378a3b3490eeada97f83d1d',
   'info': {'weight': '200000000', 'class': 'Normal', 'partialFee': '10000000000'},
   'events': [{'method': 'system.NewAccount',
     'data': ['GoJ89MXptpNt1dH4NaZ73YtzknhrYeZcBJ33mifX5BMqoFz']},
    {'method': 'balances.Endowed',
     'data': ['GoJ89MXptpNt1dH4NaZ73YtzknhrYeZcBJ33mifX5BMqoFz',
      '5000000000000']},
    {'method': 'balances.Transfer',
     'data': ['HUewJvzVuEeyaxH2vx9XiyAPKrpu1Zj5r5Pi9VrGiBVty7q',
      'GoJ89MXptpNt1dH4NaZ73YtzknhrYeZcBJ33mifX5BMqoFz',
      '5000000000000']},
    {'method': 'treasury.Deposit', 'data': ['8000000000']},
    {'method': 'balances.Deposit',
     'data': ['E58yuhUAwWzhn2V4thF3VciAJU75eePPipMhxWZe9JKVVfq',
      '2000000000']},
    {'method': 'system.ExtrinsicSuccess',
     'data': [{'weight': '200000000', 'class': 'Normal', 'paysFee': True}]}],
   'success': True,
   'paysFee': True}],
 'onFinalize': {'events': []}}
```

> The JS number type is a 53 bit precision float. There is no guarantee that the numerical values in the response will have a numerical type. Any numbers larger than `2**53-1` will have a string type.

#### Submitting a Transaction

Submit a serialized transaction using the `tx` endpoint with an HTTP POST request.

```
import requests
import json

url = 'http://127.0.0.1:8080/tx/'
tx_headers = {'Content-type' : 'application/json', 'Accept' : 'text/plain'}
response = requests.post(
    url,
    data='{"tx": "0xed0...000"}', # A serialized tx.
    headers=tx_headers
)
tx_response = json.loads(response.text)
```

If successful, this endpoint returns a JSON with the transaction hash. In case of error, it will return an error report, e.g.:

```
{
    "error": "Failed to parse a tx" | "Failed to submit a tx",
    "cause": "Upstream error description"
}
```


# Ledger Hardware Wallet

Following steps from this article, you will be able to access Acala account on Ledger Hardware Wallet via Polkadot{.js} web wallet, as well as interacting with the account with Acala App through Polkadot{.js} browser extension.

When using Ledger devices, always ensure you are using the latest version of Acala App, Ledger Live, and firmware on your Ledger device.

### Step 1 - Install Acala App on your Ledger Hardware Wallet

1. **Connect** and **unlock** your Ledger device on your computer
2. Open **Ledger Live**, follow on screen instruction to allow access on your Ledger device
3. In **My Ledger, s**earch for **Acala** then click **Install**
4. Proceed to Step 2 below

### Step 2 - Add your Acala Account on Ledger Hardware Wallet on Polkadot{.js}

Note: please add the account using Polkadot{.js} on web, do not use Polkadot.js browser extension to perform this step (it will be Step 3 below).

1. **Connect** and **unlock** your Ledger device on your computer, **open** the **Acala App** on your Ledger device
2. On your browser, **go to** [Polkadot.js Web Wallet](https://polkadot.js.org/)\
   Note: Use the same browser with Polkadot.js browser extension installed if you would like to  access this account with Acala apps, **click** on either the **apps wallet (hosted)** or **apps wallet (ipfs)** tile
3.  **Switch** to **Acala** network&#x20;

    3.1. **** Clicking on top left corner of the site\
    ![](<../../../../.gitbook/assets/image (38).png>)

    3.2. **Click** and expand **Polkadot & Parachains** then **select** **Acala** via any of the RPCs listed and **click Switch**\
    ****![](<../../../../.gitbook/assets/image (47).png>)****
4. **Go** to Settings**, click** manage hardware connection**,** and **select**:\
   4.1. **Attach Ledger via WebHID** if you are on macOS or Linux.\
   4.2. A**ttach Ledger via WebUSB** if you are on Windows.\
   4.3. **Click** Save
5. **Go** to Accounts - Accounts via the top menu\
   5.1. Select **Add via Ledger**\
   ****5.2. Input a name for the account\
   5.3. Select the Ledger Device connected if prompted\
   5.4. Done

### Step 3 - Add your Acala Account on Ledger Hardware Wallet on Polkadot{.js} Browser Extension

1. **Click** on Polkadot.js browser extension, **click** + then **click** "Attach Ledger Account to add an account\
   \
   ![](<../../../../.gitbook/assets/image (41).png>)
2. **Select** Acala\
   ![](<../../../../.gitbook/assets/image (42).png>)
3. **Input** name of the account and **click** Import
4. Done, and now you can interact with Acala account on Ledger account, with Acala apps through Polkadot.js browser extension.&#x20;


# Polkadot{.js} Browser Extension

### Install the Browser Extension

The browser extension is available for both [Google Chrome](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd?hl=en) (and Chromium based browsers like Brave) and [FireFox](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension). Download the plugins [here](https://polkadot.js.org/extension/).

![](<../../../../.gitbook/assets/Screen Shot 2021-05-14 at 4.49.27 PM.png>)

### Create Account

Open the Polkadot{.js} browser extension by clicking the logo on the top bar of your browser. You will see a browser popup not unlike the one below

![](<../../../../.gitbook/assets/Screen Shot 2021-05-14 at 4.52.43 PM.png>)

Click the big plus button or select "Create new account" from the small plus icon in the top right. The Polkadot{.js} plugin will then use system randomness to make a new seed for you and display it to you in the form of twelve words.

![](<../../../../.gitbook/assets/Screen Shot 2021-05-14 at 4.53.46 PM.png>)

You should back up these words as [explained here](https://wiki.polkadot.network/docs/en/learn-account-generation#storing-your-key-safely). It is imperative to store the seed somewhere safe, secret, and secure. If you cannot access your account via Polkadot{.js} for some reason, you can re-enter your seed through the "Add account menu" by selecting "Import account from pre-existing seed".

### Name Account & Password

The account name is arbitrary and for your use only. The password will be used to encrypt this account's information. You will need to re-enter it when using the account for any kind of outgoing transaction or when using it to cryptographically sign a message.

Note that this password does NOT protect your seed phrase. If someone knows the twelve words in your mnemonic seed, they still have control over your account even if they do not know the password.

![](<../../../../.gitbook/assets/Screen Shot 2021-05-14 at 4.54.44 PM.png>)

### Set Address for Acala Mainnet

Now we will ensure that the addresses are displayed as Acala mainnet addresses.

Click on "Options" at the top-right corner of the plugin window, and under "Display address format for" select "Acala".

**Your address's format is only visual** - the data used to derive this representation of your address are the same, so **you can use the same address on multiple chains**.&#x20;

You can copy your address by clicking on the account's icon.

![](<../../../../.gitbook/assets/Screen Shot 2021-05-14 at 4.58.59 PM.png>)

### Set Address for Karura Mainnet

Click on "Options" at the top-right corner of the plugin window, and under "Display address format for" select "Karura".

**Your address's format is only visual** - the data used to derive this representation of your address are the same, so **you can use the same address on multiple chains**.&#x20;

You can copy your address by clicking on the account's icon.

![](<../../../../.gitbook/assets/Screen Shot 2021-06-08 at 2.27.20 PM.png>)

### Set Address for Polkadot Mainnet

Click on "Options" at the top-right corner of the plugin window, and under "Display address format for" select "Polkadot".

**Your address's format is only visual** - the data used to derive this representation of your address are the same, so **you can use the same address on multiple chains**.&#x20;

You can copy your address by clicking on the account's icon.

![](<../../../../.gitbook/assets/Screen Shot 2021-05-16 at 9.45.59 AM.png>)

### Set Address for Kusama Mainnet

Click on "Options" at the top of the plugin window, and under "Display address format for" select "Kusama".

**Your address's format is only visual** - the data used to derive this representation of your address are the same, so **you can use the same address on multiple chains**.&#x20;

You can copy your address by clicking on the account's icon.

![](<../../../../.gitbook/assets/Screen Shot 2021-05-16 at 9.46.09 AM.png>)

### Convert Address for different chain formats

You can use the [Subscan Address Transform tool](https://polkadot.subscan.io/tools/ss58\_transform) to convert your address between the different chain formats.

Enter any address in the input box on the left-hand side, then click **`Transform`** button, you can see address formats for all chains on the right-hand side.


# Polkawallet Mobile App

## I**nstall Polkawallet App**

Download the Polkawallet app via [its official website](https://polkawallet.io/). The app is available through the Apple App Store for iOS devices, Google Play for Android devices, and as Android APK.

### Create Account

1. Click on the "Create Account" button.

![](https://lh5.googleusercontent.com/VaB4EcpFPO9Qmvl2K\_MVKk8rVevhEzDsD45WZzkWKe3B6DXyoSU8-IenMk3slTe4uGLVl4IzAEmOz-A0SyJ508VUy49UfiGpsBT5R7q2QRmeybP1cE-2fU52iOdoudgcdmsLv\_Kl)

2\. A new screen will appear explaining the importance of recording your mnemonic phrase in a safe place. Click the "Next" button.

![](https://lh6.googleusercontent.com/509\_xAUccOu0djt4YJZsvrLW4H\_fdBxmOmMMwpRrseGSt9xcyZdx4Tgge7ZofXk6um7rSR6LcPL7c23rJHF2ZHv7FlLl2SbYciqd3-ck\_v\_hlco0RRP7oPpin90nv2YETvvN\_cEb)

‌3. Your mnemonic phrase will appear. Write the mnemonic on a piece of paper and store it somewhere safe. Click on the "Next" button.

![](https://lh5.googleusercontent.com/XD1NG32OkmzZYToN8Fb-noLzUJmacWIACYhi-gSyV3-s58n4Ovu6sS0qQMRe1NkMMyLA4LBz\_wEHRnEDwVnQgEaXQwCrgvUr0fNvA8SDilS7mrrnP--9bx3-SnHaioy\_prFD4KoE)

4\. Confirm your mnemonic by entering the words in the correct order. Click on the "Next" button when completed.

![](https://lh4.googleusercontent.com/ROVs8A4woJy9RYKmsGd6Jm1W8GMzG\_cpB6ba3XLViS18GMTmRK0giSV7qkDh2XZrKxxLv4LFLEFuiRT6Lw3wri8yu6cT9tBMyw00vMhxq5Vmwb2qBOUg9-Eey7RHMbh4araqvk7P)

### **Name Account & Password**

Name your account and create a strong password (at least 6 characters). Click on the "Next" button when completed.

![](https://lh4.googleusercontent.com/PWXIJxAuCBlb-QGBrpce0gvFgG\_C\_jWUL125eOU\_ke\_thRY4WDhUq1AvDa6bAWHWy\_sD5BXp40gM5zzJRdkDGF5XrtLEuLD5TwJ1sV8FDdjr1QRjDm9I-hzfXGsqBLsq0QVFgb02)

Your wallet is now set up! The screen will default to the Polkadot network. You can determine which network you're connected to by looking at the grey text under the account name. In the case of this screenshot, it says "Polkadot."

![](https://lh5.googleusercontent.com/xlFLRGhSFMpRc1QeJrObC8vazj7YCLIe2AvW-euSwN4bvjlZWhTbcyBxF4SPTXQGuOCJtdxMW\_1IMNyoL88RzC51RGN7CkLepjjOXTnJkEkp0ZSRzS58F7rAVMamcuXJ\_01S6AhE)

### Set Address for Polkadot Mainnet

1. Click the menu button on the top-right corner.

<img src="https://i.imgur.com/JwPrsVe.jpg%20=250x" alt="" data-size="original">

2\. In the opened menu select the Polkadot logo, then press on the appeared address on the main screen.

&#x20;<img src="https://i.imgur.com/YGx8nne.jpg%20=250x" alt="" data-size="original">

### Set Address for Kusama Mainnet

1. Click the menu button on the top-right corner.
2. In the opened menu select the Kusama logo, then press on the appeared address on the main screen.

### Set Address for Acala Mainnet (Coming Soon)

### Set Address for Karura Mainnet (Coming Soon)&#x20;


# Account Generation

You can generate Acala and Karura account in the following ways:

* [Polkadot{.js} Browser Extension](../../../get-started/karura-account/account-generation/polkadot-.js-browser-extension.md)
* [Polkawallet Mobile App](../../../get-started/karura-account/account-generation/polkawallet-mobile-app.md)
* Talisman Wallet [install](https://docs.talisman.xyz/talisman/navigating-the-paraverse/account-management/download-the-extension), [create new wallet](https://docs.talisman.xyz/talisman/navigating-the-paraverse/account-management/create-a-talisman-wallet)
* SubWallet [install](https://docs.subwallet.app/main/extension-user-guide/getting-started/install-subwallet), [create new wallet](https://docs.subwallet.app/main/extension-user-guide/account-management/create-a-new-account-with-seed-phrase)
* [Ledger Hardware Wallet](ledger-hardware-wallet.md)


# Balance Type and Vesting

## Balance Types

On Acala there are the following steps balance types

* **Transferrable Balance**: as the name suggests, this balance can be used for transfers, paying fees and performing any actions on-chain.
* **Locked Balance:** this balance is frozen, depending on the scheme, it could be locked for a certain period of time before being transferrable, or it could be vested where a portion of the balance gradually becomes transferrable, or a combination of these. The tokens are released lazily, meaning you are required to perform a `claim` transaction to obtain it. The guide for claiming vested tokens is in the next section.
* **Total Balance:** is the sum of transferrable balance plus the locked balance. The entire balance can be used for governance operations such as voting.&#x20;

## Check & Claim Vested Tokens

### Claiming Vested ACA via Web App

You can claim your vested ACA here [https://apps.acala.network/](https://apps.acala.network/)

### Claiming Vested ACA

**Even though tokens may be vested (unlocked), you will still need to claim them before you can transfer them or use them in DeFi applications on the Acala platform.** You can learn how to claim your tokens by following the guide below:

1\) Go to your Polkadot.js **extension** and make sure it is set to `allow use on any chain`.

![](<../../../.gitbook/assets/Allow use on any chain.png>)

2\) Go to [Polkadot JS Apps](https://polkadot.js.org/apps/#/explorer) and connect to the Acala network. You can do this by clicking on the dropdown box in the upper left hand corner (shown below).

![](<../../../.gitbook/assets/Toggle for Acala (1) (1).png>)

3\) Select an Acala node (any is fine) and click `Switch`.

![](<../../../.gitbook/assets/Select Acala.png>)

4\) Select `Accounts`. You should see your ACA amount. You can expand the balance in your account to see if there's a vested (locked) balance. If there's one, it will be displayed.

![](<../../../.gitbook/assets/locked tokens wiki.png>)

Go to the `Developer - Extrinsics` section, use the account that you want to claim the vested balance. Select `vesting` then `claim()` in the `submit the following extrinsics` field, then click the `Submit Transaction` button to complete the process.

![](../../../.gitbook/assets/claim.png)

### Claiming Vested ACA for Other Accounts

Users can also claim vested ACA for other accounts by going to the `Developer - Extrinsics` section. Select the account you'd like to use to initiate the claim in `using the selected account`. Submit the `vesting` then `claimFor(dest)` extrinsic and the account you'd like to claim **for** which is the account that has the locked tokens (shown at bottom of screenshot).

Note that submitting this transaction only makes the vested tokens transferrable. It does not transfer them to the account that initiates the claim.

![](<../../../.gitbook/assets/Screen Shot 2022-01-25 at 6.53.34 PM.png>)

### Check Vesting

Go to the `Developer - Chain state` section, select `vesting` then `vestingSchedules()` , then select your account, then click the `+` button to see what vesting schedule it has.

![](<../../../.gitbook/assets/vesting schedule.png>)

Below is an example result

* `start`: the tokens are locked until **Polkadot block #**
* `period`: release period e.g. release every block or every 432,000 block as in the example
* `periodCount`: how many vesting periods
* `perPeriod`: how much to release each period

```
[
  {
    start: 13,795,200
    period: 432,000
    periodCount: 12
    perPeriod: 100 ACA
  }
]
```



# Check Address for Different Chains

If you already set up a Polkadot account, Acala account, or any Substrate-based chain account, there are two options to check the corresponding DOT address:

* you can use [Subscan Address Transform](https://acala-testnet.subscan.io/tools/ss58\_transform);
* setting your wallets in polkadot.js extension&#x20;
* use PolkaWallet mobile app

## Using Subscan transform

1. Navigate to [Subscan Address Transform](https://acala-testnet.subscan.io/tools/ss58\_transform) and paste your existing account address into "Input Account or Public Key".

![](https://i.imgur.com/v7damrj.png)

1. Press "Transform" and find the corresponding Polkadot address in the appeared list on the right (in the screenshot, it is second from the top).

![](https://i.imgur.com/bv0T6dD.png)

## Using Polkadot.js extension

1. Open polkadot.js extension in your browser and press 3 dots on the right from your account name.
2.  In the opened window click on the dropdown menu and pick "Polkadot Relay Chain"

    ![](https://i.imgur.com/GxbRxhs.jpg)
3. Now all your accounts are converted to Polkadot format, you can copy them.

## Using Polkawallet

1. Open PolkaWallet on your mobile device and click the menu button on the top-right corner. ![](https://i.imgur.com/JwPrsVe.jpg%20=250x)
2. In the opened menu select Polkadot logo (second from the top) and press on the appeared address on the main screen.
3. &#x20;![](https://i.imgur.com/YGx8nne.jpg%20=250x)
4.  Click on the account block under the "Add Account" button, which will navigate you back to the main page.

    ![](https://i.imgur.com/JwPrsVe.jpg%20=250x)
5. Now your wallet is set up and you can copy your Polkadot address. You can see that your wallet changed color to black and among your assets you can see DOT.


# Exchange Withdraw/Deposit

#### DOT **withdraw/deposit to/from Acala network** <a href="#dot-withdrawdeposit" id="dot-withdrawdeposit"></a>

⚠️ **NOT All Exchanges support direct withdraw/deposit DOT to/from Acala network.** Please do Do NOT transfer DOT to an exchange address on Acala App except for the ones listed below as they become available.

Exchanges that support direct withdraw/deposit DOT to/from Acala Network:



Unless DOT on Acala is explicitly supported by Exchange, please withdraw/transfer by withdraw/transfer to Polkadot then bridge to Acala using Acala App.

#### ACA Withdraw/Deposit <a href="#aca-withdrawdeposit" id="aca-withdrawdeposit"></a>

Exchanges that support the Acala network and the ACA token would support direct withdraw/deposit ACA to/from Acala network. Please do confirm with your exchange. Always send a small amount to verify before sending the full amount.

#### Other Tokens on Acala <a href="#other-tokens-on-acala" id="other-tokens-on-acala"></a>

By default Exchanges do NOT automatically support direct withdraw/deposit new tokens on Acala network, e.g. LCDOT. We will update the status of support as we progress.\

# Wallet & Account

This document covers the basics of Acala, Karura, Polkadot and Kusama account addresses.

## Address Format

Acala and Karura use the Substrate-based chain address format SS58. Read more [here](https://wiki.polkadot.network/docs/en/learn-accounts).

* Acala addresses usually but not always start with the number 2.
* Karura addresses could start with a small letter like l, r, p, q, o...
* Polkadot addresses always start with the number 1.
* Kusama addresses always start with a capital letter like C, D, F, G, H, J...
* Generic Substrate addresses start with 5.

## Existential Deposit

Karura uses an [_existential deposit_ (ED)](https://wiki.polkadot.network/docs/learn-accounts#existential-deposit-and-reaping) to prevent dust accounts from bloating state. If an account drops below the ED, the state of this account will be removed from the blockchain to preserve scarce on-chain storage resources. The balance on this account will be removed and donated to the Treasury. You still retain access to the account, but it no longer has an on-chains state.

**Transfers:** when you transfer an amount from account A to account B

* if after the transfer, account A's balance is below ED, it will be removed. So make sure to leave enough balance on account A to keep it alive.
* if account B has no balance, and the transfer amount is below ED, account B would be as if never receive any amount, because its state would be removed from the chain. So make sure to send enough amount to keep a fresh account alive.

**Swap**: when you swap token A for token B, if token A balance then falls below ED requirement, then the transaction might fail. Anyone can build a front-end using acala.js SDK to facilitate this transaction and check ED for you, but you shall always be aware of it.

**Claim rewards**: when claiming LP tokens or other rewards, if the balance is below ED requirement after the claim, then the balance might be wiped.

ED applies to all supported token accounts, and each type of token account e.g. DOT account has its own ED requirement, meaning if DOT account balance is lower than ED, then your DOT balance may get wiped, while all other balances won't be affected.

Any transactions that change the balance of a particular token e.g. swap, then you shall be aware of its ED requirement. Here's the list of ED requirements for currently available tokens on Karura:

* ACA ED: 0.1 ACA
* aUSD ED: 0.1 aUSD
* DOT ED: 0.01 DOT
* LDOT ED: 0.05 LDOT

You can verify the existential deposit of ACA by checking the chain state for the constant `balances.existentialDeposit`

([ED Runtime Code](https://github.com/AcalaNetwork/Acala/blob/35078ea2b2d0e3a3937a075c54d94c77faea2f36/runtime/acala/src/lib.rs#L752-L754))

([ED SDK](https://github.com/AcalaNetwork/acala.js/blob/master/packages/sdk-wallet/src/utils/get-existential-deposit-config.ts))

## Account Generation&#x20;

You can generate Acala and Karura account in the following ways:

* Polkadot{.js} Browser Extension
* Polkawallet Mobile App
* Ledger Hardware Wallet




# Early Adopter Program

## About the Early Adopter Program&#x20;

As laid out in our [launch roadmap](https://acala.notion.site/d1ce5e03f5354bc0be8fcf3c18b6e5b6?v=af1ff9fa66aa4dce851da0e429ed51ca), Acala is enabling each component of its new financial infrastructure in a phased approach. A blockchain platform can’t launch in a single-day event, so the Early Adopter program is meant to give the most advanced Acala users the opportunity to gain experience with Acala while the platform gets enabled. Since the platform is not completely enabled in the Early Adopter phase, users should anticipate some user experience difficulties (see disclaimers below). However, these difficulties will be resolved once all components are enabled and Acala fully launches.

Users who try Acala (link to App [here](https://apps.acala.network/)) as part of the Early Adopter program will be rewarded with an exclusive NFT if they meet certain criteria. For updates on the Early Adopter program go to [https://acala.network/early-adopters](https://acala.network/early-adopters). See the details below for how to qualify to receive the NFT.

It is important to note, **individuals who decide to participate in the Early Adopter program should be aware there are some disclaimers involved.** Please read below for additional information.

## Frequently Asked Questions

### What are the Early Adopter disclaimers I should be aware of?

Users in the Early Adopter program should be aware of the following disclaimers:

* **To bring DOT from Polkadot to Acala, a one-way DOT bridge is being enabled. Once DOT has been transferred to Acala, there will be no immediate way to transfer it back out.** Users will only be able to exit with their liquidity back to Polkadot once Polkadot’s cross-chain messaging (XCM) functionality is completely enabled. Read below for more information on the timing for exporting assets.

&#x20;👉**As a reminder, you must leave a minimum of 1 DOT in your Polkadot account** for the required account minimum, called an [Existential Deposit](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-). Anything less than 1 DOT will be wiped from your account👈

* Features are being enabled on Acala using a staggered approach. There may be certain features users are interested in utilizing that are not readily available.
* **This is not a testnet environment.** All tokens used to try the various primitives have real monetary value. If you make a mistake, Acala can not revert your actions.
* Bring your own gas will not be enabled at the start of the program. **Users will need to have ACA to pay the gas fees on Acala.**

### How do I participate?&#x20;

The Early Adopter program is a self-elected program making it open to anyone interested in gaining early experience with Acala. You can  use Acala by going to our [App](https://apps.acala.network/). As a reminder, please make sure you are aware of the disclaimers involved in participating in the program.

### How do I earn my NFT?

To earn the exclusive NFT, Early Adopters must meet **ALL** of the following criteria by April 28th at 11:59pm UTC:&#x20;

* One on-chain recording of DOT transfer to Acala via the bridge
* One on-chain recording of aUSD minting
* Three on-chain recordings of Acala Swap operation:
  * &#x20;Operation includes Liquidity Provisioning or Swaps

### How long will the Early Adopter program run for?

The Early Adopter Program will start on February 3rd and will end at 11:59 pm UTC on April 28th.

### When will I be able to transfer my DOT assets out of Acala?

Currently only ACA can be transferred to exchanges, and no assets can be transferred from the Acala parachain to the Polkadot Relay Chain. The Acala team is actively working on solutions to transfer assets out of Acala. Timing estimates can be found on our [launch roadmap](https://acala.notion.site/d1ce5e03f5354bc0be8fcf3c18b6e5b6?v=af1ff9fa66aa4dce851da0e429ed51ca).

### How can I exit with my liquidity?

At the start of the Early Adopter program, users will only be able to transfer their DOT into Acala via a one-way bridge. Once enabled, there are 3 ways users will be able to exit Acala with their liquidity:

1. Once XCM is enabled by Polkadot, a two-way bridge will be opened. Users will then be able to transfer their DOT from their account on the Acala Parachain to their account on the Polkadot Relay Chain.
2. Certain **** Centralized Exchanges that support DOT transfers directly from the Acala chain.
3. Bridge to other ecosystems like Ethereum, Solana, Terra, etc. once they are opened.

**Acala will announce when these exits are enabled. They are currently not available.**

### Why is the DOT bridge one way?

In order to transfer DOT back and forth from the Relay Chain to a Parachain, Cross Consensus Messaging (often referred to as “XCM”), must be enabled. The Parity team is still working on building out this technology. Until XCM is live, two-way DOT transfers cannot be completed.

In the meantime, the Acala engineering team has built a one-way bridge to allow users to transfer their DOT to Acala to start to utilize the aUSD stablecoin and DeFi ecosystem.

The asset import and export experience is a priority for Acala and the team is actively working on solutions to improve options available to users.

### Do I need ACA to pay for gas fees?

Yes. All users will need ACA on Acala to pay for gas fees.

### When will I get my NFT?

The NFT will be distributed at the end of the program. You can sign up for updates on your NFT qualification status [here](https://acala.network/early-adopters).


# Acala Launch Phases

Acala network has a phased launch plan. Keep up-to-date with the roll-out plan by viewing this [live roadmap](https://aca.la/acala-roadmap).

**Current Phase: Win Acala Parachain Slot Auction - Acala Genesis Launch**

## 🚀 (WIP) Acala Genesis - Launch

The Genesis block of the Acala network will be launched on 18th December, 2021, as a Proof of Authority network. Governance was restricted to a single super-user (sudo) key, which is held by the Acala Foundation to issue transactions and upgrades to resolve issues and completes the launch process.

Since genesis, Acala's network security is provided by Polkadot's Nominated Proof of Stake (NPoS) Validators upon launch. Acala's Collators will be provided by node service partners at this stage.

**Acala parachain is available on** [**Subscan**](https://acala.subscan.io) **&** [**Polkadot App**](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Facala.api.onfinality.io%2Fpublic-ws#/explorer)**.**

## 🏒 (WIP) **Finalize ACA Distribution**

**You can view ACA distributions are available** [**here**](https://distribution.acala.network)**.**

* [ ] Airdrops
* [ ] Build Acala #1
* [ ] Build Acala #2
* [ ] Acala crowdloan
* [ ] Others

## 🕵️ (WIP) Tech Verification & Runtime Upgrade

Acala will perform a set of tests and verifications to ensure the network is operational.

* [ ] Collators are producing blocks as expected
* [ ] Polkadot is verifying blocks from Acala as expected
* [ ] Runtime upgrade to fix any issues
* [ ] Block time is stable
* [ ] p2p connectivity is good
* [ ] RPC node availability is good

## 🤹 (WIP) Enable DOT Transfer from Polkadot to Acala

Transfer DOT from Polkadot Relay Chain to Acala parachain and back via **xtoken** will be enabled. However, transfer within the Acala parachain will still be disabled at this stage.

Read the how-to [here](../../../acala/defi-hub/inter-polkadot-transfer.md).

## 🏵 (WIP) Upgrade to Support LCDOT

## 🎯 (WIP) Distribute ACA & LCDOT

Batch distribution of ACA & LCDOT to

* [ ] Airdrops to pre-ACA holders
* [ ] Build Acala Participants
* [ ] Crowdloan Participants via Acala Website, Polkawallet and partner exchanges.
* [ ] Other round participants

If you have participated via exchanges or custodial agencies, the rewards will be distributed to you by these exchange and custodial agencies. Please contact them directly for the distribution schedule.

## 🎁 (WIP) Claim ACA & LCDOT

**You can check whether your ACA rewards need to be claimed** [**here**](../../../acala/crowdloan/claim-aca.md)**.**

If you have participated via exchanges or custodial agencies, the rewards will be distributed to you by these exchange and custodial agencies. Please contact them directly for the distribution schedule.

If you participated in Acala\*\* **crowdloan via the** \*\*Polkadot web app directly, or via non-custodial wallets other than Polkawallet and Fearless wallet, you will need to agree to our T\&C by completing a claim process for ACA. The Claim ACA website can be found [here](https://distribution.acala.network/claim).

## 🎒 (WIP) Collator Onboarding

## 🎁 (WIP) DOT Treasury Donation Ceremony

## ✋ (WIP) Council Governance + Democracy

After the chain has been running stably with the collator set, the sudo key will perform a runtime upgrade and enable appointed Councilors and democracy. Other councils including Financial Council, Technical Council, and Liquid Staking Council, as well as public referenda will also be enabled.

Read more [here](../../../acala/get-started/governance/participate-in-democracy.md).

## 🗳️ (WIP) Enable Democracy

Once the chain has been running well under Elected Council, it will propose to enable democracy - public referenda.

Enable public referenda so that anyone can propose a referendum by depositing the minimum amount of tokens for a certain period.

## 💥 (WIP) Remove Sudo

Sudo module will be removed via a runtime upgrade, and the Acala network will be governed by on-chain governance and token holders hereafter.

Read more [here](https://acala.discourse.group/t/1-acala-runtime-upgrade-disable-sudo-enable-token-transfers/163).

## 🚃 (WIP) Enable Balance Transfers

Balance transfers within the Acala network are restricted until this point.

## 👩‍🌾 (WIP) Enable Primitive Protocols

* [ ] Enable Stablecoin
* [ ] Enable Swap
* [ ] Enable Liquid Staking

## 🚜 (WIP) Bootstrap Plan & Sequence

Details of launching specific collaterals and liquidity pools, as well as associated bootstrap programs will be announced separately.

## 🤖 (WIP) Enable EVM+


# Acala Assets

These are native assets on the Acala Network

* **Acala Token (ACA)** | Decimal Place: 12\
  ERC20 mirrored token address 0x0000000000000000000100000000000000000000
* **Acala Dollar (aUSD)** | Decimal Place: 12\
  ERC20 mirrored token address 0x0000000000000000000100000000000000000001
* **Liquid Staking DOT (LDOT)** | Decimal Place: 10\
  ERC20 mirrored token address 0x0000000000000000000100000000000000000003
* **Liquid Crowdloan DOT (LCDOT)** | Decimal Place: 10\
  ERC20 mirrored token address 0x000000000000000000040000000000000000000d
* **Polkadot DOT (DOT)** | Decimal Place: 10\
  ERC20 mirrored token address 0x0000000000000000000100000000000000000002

### On-Chain Metadata

{% embed url="https://replit.com/@shunjizhan/Acala-On-chain-Asset-Registry-Metadata?v=1" %}

---
description: Acala
---

# Acala Assets

These are native assets on the Acala Network

* **Acala Token (ACA)** | Decimal Place: 12
* **Acala Dollar (aUSD)** | Decimal Place: 12
* **Liquid Staking DOT (LDOT)** | Decimal Place: 10
* **Liquid Crowdloan DOT (LCDOT)** | Decimal Place: 10
* **Polkadot (DOT)** | Decimal Place: 10


# Acala's DOT Bridge

### Background

As the DeFi Hub of Polkadot, Acala is building financial infrastructures and an ecosystem around DOT. Acala has been taking a phased launch approach to account for any technical dependencies on Polkadot.

One of these dependencies is the XCM Bridge Infrastructure, a component of the Polkadot ecosystem that enables Cross-Consensus Communication between parachains. While the development of XCM is near completion, it’s expected that it will take an indeterminate amount of time to appropriately test and deploy for the broader ecosystem.

To provide an answer to the desire from the community for DOT liquidity on Acala, we are pleased to announce an interim non-custodial bridge solution to support DOT transfers to Acala, endorsed by Parity. While it is a limited one-direction DOT bridge that enables transferring DOT from Polkadot to Acala, once XCM is available on Polkadot, it will be seamlessly upgraded to use XCM with no migration required for DOT holders.

Note: Regarding DOT withdrawal from Acala, please refer to [Exchange Withdraw/Deposit](acala-account/exchange-withdraw-deposit.md).&#x20;

### What is the Acala's DOT Bridge

The DOT bridge is Acala's solution which:

* is a non-custodial bridge DOT from Polkadot to Acala
* enables a path for users with DOT to participate in Acala's DeFi economy
* is seamlessly upgradeable to Polkadot's [XCM](https://polkadot.network/blog/xcm-the-cross-consensus-message-format/) when it becomes available. No migration or extra actions required for DOT holders.

### Before you start

You should be aware of some limitations in using Acala's DOT Bridge:

* bringing DOT from Polkadot to Acala is one-way, currently there is no way to bridge the DOT back - until Polkadot's XCM mentioned above becomes available, or until direct DOT withdraw and deposit from/to Exchanges become available
* it only works for DOT, not any other tokens or assets
* DOT transfers over 5,000 DOT will require approval as an extra security protection, which will take up to 24 hours to process

### How to use the Bridge?

If you read the above and would like to action, welcome to the Acala world! You will find a step by step guide [here](https://guide.acalaapps.wiki/general/bringing-tokens-to-karura/sending-dot-to-acala).



# Governance

Read Governance overview [here](../../learn/governance-overview/).

Below are governance discussion and proposal avenues:

* [Acala Subsquare - Discussion & View related on-chain Proposal](https://acala.subsquare.io/)
* [Polkadot Web App - On-chain Voting](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Facala-rpc-0.aca-api.network#/extrinsics)
* [Acala Discourse Forum - long form, informal discussions](https://acala.discourse.group/c/acala/16)

## Governance Parameters

These are important governance parameters, which may change over time as we progress through the governance phases.

* Launch Period: Public referenda is every **5 days**
* Voting Period: Votes are tallied every **5 days**
* Emergency Voting Period: Voting period for fast-tracked emergency referendum is **3 Hours**
* Minimum Deposit: Proposing a referendum requires a minimum deposit of **200 ACA**
* Enactment Period: Minimum period for locking funds and the period between a proposal being approved and enacted is **2 days**
* Cool-off Period: Vetoed proposal may not be re-submitted within **7 days**

Most of these parameters are visible on the Polkadot App. You can also view upcoming governance events on `the Event Calendar`

![](<../../.gitbook/assets/governance calendar.PNG>)

## Propose a Referendum

A referendum consists of some action that you want to propose. If voted in by token holders, then the action will be enacted on-chain automatically. You are required to bond some tokens to propose an action. Once a proposal is submitted, it can not be canceled.&#x20;

On the [Polkadot Apps - Acala parachain](https://polkadot.js.org/apps/#/accounts), you can use the “Democracy” tab to make a new proposal. The action, such as 'force transfer balance from account A to account B', is encoded in a preimage, and the hash of the action is called preimage hash.&#x20;

Since the preimage can be quite large (hence costly to submit), you can submit a Proposal first which includes the preimage hash only, and submit the preimage (or have someone else submit it for you) later but before voting completes.

### Step 1: Submit a Proposal

#### Get the preimage hash&#x20;

By clicking on the `Submit preimage` button, then fill in the action you want to propose, copy and note down the preimage hash `0xe2dafd2ace4fbc0b2f6d28f92db250d052975c704a16058b9d620a6a24800357`. Once you noted down the hash, you can now cancel the prompt.&#x20;

![](<../../.gitbook/assets/preimage (1).PNG>)

#### Submit a proposal

Submit a proposal by clicking on the `Submit a proposal` button, and pasting in the preimage hash to submit it. Then the proposal shall appear in the proposal table.&#x20;

### Step 2: Submit a Preimage

Before voting of your proposal completes, you will need to submit the actual preimage. Otherwise, it cannot be enacted on-chain. You can repeat the ‘Submit a preimage’ process as previously mentioned, and click the ‘Submit preimage’ button to send the transaction.

## Vote on a Referenda

To Vote on Referenda, you must hold KAR tokens and these tokens must be held in a wallet that has the functionality to participate in Democracy like Polkadot.js. If you don't have your tokens in Polkadot.js wallet, you can read more about [account generation](acala-account/#account-generation).

Once a proposal is in as a referendum, it will show up in the referenda table. You can navigate to the [Polkadot Apps - Acala Parachain Democracy](https://polkadot.js.org/apps/#/democracy) to cast your vote.

![](../../.gitbook/assets/referenda.PNG)

You can click on the ‘Vote’ button to vote. Select "Vote Aye" to support the proposal, and select "Vote Nay" to disapprove the proposal.&#x20;

You can also increase your conviction with the same number of tokens by locking them. The longer you are willing to lock your tokens, the stronger your vote will be weighted. Read more on [voting](https://wiki.polkadot.network/docs/maintain-guides-democracy/#voting-on-a-proposal) and [tallying](https://wiki.polkadot.network/docs/learn-governance#tallying).

![](../../.gitbook/assets/Voting.PNG)

## Unlock locked tokens

You will need to explicitly unlock these tokens once the locking period ends. You can go to the `Accounts` page, click the menu button for the voted account, and select the menu item`Clear expired democracy locks` to claim it back. Read more [here](https://wiki.polkadot.network/docs/maintain-guides-democracy/#unlocking-locked-tokens).&#x20;

### Check Locked Democracy Votes

Go to `Developer` - `Chain state`, then select `democracy` and `locks`. Select the account used for voting in the dropdown, and click the `+` button to see whether there's locked votes, and if any how long they are locked for.

## Delegate Vote

You can delegate your vote to others to vote on your behalf. On the [Polkadot Apps - Acala parachain](https://polkadot.js.org/apps/#/accounts), go to the `Developer` tab -- `Extrinsics` , then select `democracy.delegate` .

![](../../.gitbook/assets/delegate.PNG)


# Build DApps

There are 4 ways to build with Acala:&#x20;

1. [**Build Pallet DApp**](deploy-ecosystem-modules.md): deploy permissioned protocol aka _**runtime modules/pallets on the Acala network**_. This is available now with more flexibility for customization & integration. Ren Protocol's Bitcoin bridge gateway is implemented this way.&#x20;
2. [Build Solidity Smart Contract DApp](smart-contracts/): deploy permisionless smart contracts using _**Solidity on Acala EVM**_. This is fully composable with aggregated cross-chain liquidity like BTC and DOT, and Acala's existing DeFi stack, and is a landing pad for DApps to access the Polkadot ecosystem. Ampleforth is deployed this way.&#x20;
3. [Bridge Parachains: ](composable-chains/)build a chain and _**connect with Acala using cross-chain message-passing protocol by Polkadot**_. We are connected to multiple parachains including common-good asset chain Statemine, where assets can be freely bridged to our chain for listing and other integrations. If you are also a parachain and are ready to test cross-chain functionalities, please contact us for options.&#x20;
4. Deploy smart contracts using _Ink!_ rust-based native smart contract platform. This is yet to be production-ready and will be made available on Acala later, but if you are interested, feel free to contact us and learn more.&#x20;

Developers, teams, or organizations looking to integrate the aUSD stablecoin and Acala Network can contact the Acala team here to schedule time to discuss the integration: [https://aca.la/build-with-Acala](https://aca.la/build-with-Acala)



# Polkadot Explorer

Polkadot Explorer is used to communicate with an Acala Node, where you can query the state of the blockchain e.g. balances of accounts, block information etc., and execute transactions to interact with various runtime modules of the chain e.g. transfer a token, do a token swap on the DeX etc. 

Open the [Polkadot Explorer]((https://polkadot.js.org/apps/)).

The Console is a generated front-end provided by Polkadot that can connect to various Substrate nodes. To connect the Console to your particular node, open the dropdown menu on the top left corner

![](https://i.imgur.com/8G8Rnbe.png)

Open the `Development` section, select `Local Node` to connect to your local Acala node.

![](https://i.imgur.com/TygeyXu.png)

Select `Custom` to connect to a deployed node, and paste the Websocket URL to the `custom endpoint` input box. You can find deployed nodes here \[TODO\]. 

```text
wss://node-6757141250775003136.rz.onfinality.io/ws?apikey=086df60c-6a2d-414e-add2-cc0b74b6d00b
```

Then click `Switch` on the top, and wait for the page to refresh and connect to the network. If your current endpoint already matches your selection, the `Switch` button will be disabled.

### Check Balance

Click the `Developer` tab on the top navigation bar, and select `Chain State` in the dropdown list.

![](https://i.imgur.com/BvFEcsZ.png)

Then click on the `selected state query` , and select `token` . 

Select `Alice` from the `AccountId` dropdown.

Select `Token` from `CurrencyId` and `DOT` as `Token: TokenSymbol`

Press `+` button to initiate the call.

![](https://i.imgur.com/5hdanQC.png)

Alice's DOT balance will be shown below.

![](https://i.imgur.com/nOB7L3k.png)



# Connect to a Node

To use Acala EVM, you need to connect to an Acala Node. You can either

1. run a local Acala test node
2. connect to a deployed test network \(maintained by Acala\)

### **1. Run a local Acala test node Comment**

To run your own node, you need to have installed [Docker](https://www.docker.com/) on your machine. If you don’t have it installed, please follow the instructions [here](https://docs.docker.com/get-docker/).

To check whether Docker is successfully installed run the command below:

```text
docker version
```

If you receive the version number, you can start your local Acala node with the command below:

```text
docker pull acala/acala-node:latest
docker run -it -p 9944:9944 -p 9933:9933 acala/acala-node:latest --dev --ws-external --rpc-external --rpc-cors=all
```

The output of your node should look like this:

![](https://i.imgur.com/EyryyFs.png)

### **2. Connect to a deployed test network**

Find all available testnet nodes [here](https://wiki.acala.network/learn/get-started/public-nodes#mandala-test-network-nodes)



# Deploy Contracts

The `Acala EVM Playground` is useful to test various functionalities of Acala EVM. It’s a fork from parity `canvas-ui`.

### **1. Setup**

To deploy your smart contract you can use our testnet or you can run your local dev node.

#### Run your own dev node**

To run your dev node, you can:
1. Build Acala project locally. 
   You can follow the guide on how to do it here:
   [https://github.com/AcalaNetwork/Acala#3-building](https://github.com/AcalaNetwork/Acala#3-building). Once you have built Acala you can start an EVM ready local dev node by running the following command:

```bash=
make run-eth;
```
2. Use the prebuilt Acala Docker image.
   You need to have Docker installed in your machine. You can follow the installation instructions here: [Install Docker](https://docs.docker.com/get-docker/). Once docker is running you need pull the last acala image and to run it:
```shell=
docker pull acala/acala-node:latest
docker run -p 9944:9944 acala/acala-node:latest --name "calling_home_from_a_docker_container" --rpc-external --ws-external --rpc-cors=all --dev
```

Once your node is running you should see something similar to this in your terminal window:

![](https://i.imgur.com/MQEURQr.png)

After your dev node is up and running you can set the Acala EVM playground to point to your node by clicking the dropdown in the bottom left corner and selecting `Local Node`.

![](https://i.imgur.com/pOfQb8z.png)

Running the local dev node will prepopulate the `Accounts` dropdowns with pre-funded developer accounts.

**Deploy to our test network**

To deploy to our test network you need to have the [polkadot{.js}](https://polkadot.js.org/extension/) wallet extension installed in your browser.

Once you have the extension installed, you can bind your accounts with an EVM address and get test network funds on the `Setup EVM Account` page on the Acala EVM playground. For more in-depth instructions, read the documentation [here](https://wiki.acala.network/build/development-guide/smart-contracts/get-started-evm/evm-account).

**Note:** For the remainder of this page we will assume you are using a local dev node. If you are deploying to the test network using the `polkadot{.js}` extension simply replace the accounts `Alice`, and `Bob` with the accounts you have set up in your extension.

### **2. Upload Contract ABI & bytecode**

Upload `BasicToken` ABI & bytecode file by navigating to [https://evm.acala.network/](https://evm.acala.network/).

Go to the `Upload` tab.

![](https://i.imgur.com/Ge3IwiM.png)


Fill in the contract name, then upload the contract file `BasicToken.json`.

![](https://i.imgur.com/kRM8Mfb.png)


It will then display a list of available methods in the contract. Then click `Upload`.

### **3. Deploy the Contract**

After uploading the ABI & bytecode file, the Playground will automatically navigate to the `Deploy` step. If not, just select `Deploy` in the left sidebar. `BasicToken` shall appear in the `ABI bundles`.

Click the `Deploy` button, and choose `Alice` (or your account if using the browser extension) as the `deployment account`.

![](https://i.imgur.com/FfoYEFU.png)

Set the initial supply \(e.g. `1000`\) and press `Deploy`.

![](https://i.imgur.com/wY0YG54.png)

After confirming the transaction you should be automatically navigated to the `Execute` section. Or you can navigate there manually by clicking "Execute" on the left sidebar.

![](https://i.imgur.com/wyrpMIv.png)

### **4. Interact with the Contract**

Navigate to the `Execute` tab. Find the deployed `BasicToken` contract and Click the `Execute` button on the bottom of the "BasicToken" box.


### **5. Query Balances**

To perform a query on an account's balance, do the following steps:

1. Select `Alice` from the `Call from Account` dropdown. This is the account used to send the transaction.

2. Pick `balanceOf` from the `Message to Send` dropdown.

3. Find Alice’s EVM Address under `Call from Account`, copy and paste it in the `account: address` input.

![](https://i.imgur.com/xH1j0ph.png)

**Note:** Solidity contracts have two types of methods: `views` and `executable` methods.

- `Views` are used to query information from the blockchain without writing data to it. `Views` transactions are free. The Playground uses the `Call` button to indicate this.
- `Executable` methods can write data onto the blockchain, and these transactions aren’t free. Click the `Execute` button to execute it.

Finally, click `Call` at the bottom, and `Call results` should show the BasicToken balance of Alice (1000).

![](https://i.imgur.com/GS7Znys.png)

### **6. Transfer**

Now let's try transferring BasicTokens to Bob’s Account.

1. Select `Alice` from the account dropdown.

2. Select `transfer` from the `Message to Send` dropdown.

3. Select Bob’s account (don't forget to bind EVM address to BOB's account how we did for Alice) from the `Call from Account` dropdown, then copy its `EVM address` and paste it in the `recipient address` input box. (Remember to switch `Call from Account` back to `Alice`)

4. Enter transfer amount in the `amount: unit256` argument box, note the token has a standard 18 decimals.

5. Click `Execute`.

![](https://i.imgur.com/l2utsuN.png)

A notification would pop-up to confirm the transaction is successful.

Now check the balances of Alice and Bob, and confirm that they have changed.
Alice's account:

![](https://i.imgur.com/SCLwxRk.png)

Bob's account:

![](https://i.imgur.com/pi3AKiN.png)


# EVM Playground

We have created a web application - **Acala EVM Playground** to test various functionalities of Acala EVM. It’s a fork from parity `canvas-ui`.

To launch the Playground, please navigate to [https://evm.acala.network/](https://evm.acala.network/).

By default, the Playground is connected to the Acala test network. It can also be connected it to a local node. If you've used the Playground before, the connection information may be cached.

### Set Up Node Connection

Click on the connection tab at the bottom left corner of the Playground.

![](https://i.imgur.com/9qnD9Gq.png)

Click on the `Node to connect to` dropdown to choose a node you want to connect to

- Select `Local Node` to connect to your local Acala node.
- Select `Acala` to connect to deployed Acala test network.
- Click `Use custom endpoint` to enter a custom Websocket URL

![](https://i.imgur.com/eHAdxLb.png)

### Bind EVM address

To use smart contracts, you will need to have an EVM address. By default, we don't attach the address to the user's account, and users need to claim it. Claiming an EVM account is a transaction, and you need to have tokens to pay for it.
If you're running your Acala node and using standard Development accounts (Alice, Bob), you have enough funds. Though using provided by Acala test network, you need to get funds using a faucet. 
Navigate to EVM account settings, clicking on "Setup EVM Account" in the top left corner.
![](https://i.imgur.com/F6UTXtm.png)
Next, select a substrate account in "Step 1". If you aren't using the local node you will see a "Faucet" button under the selected account. 
Click it to receive test tokens.
And finally, click "Bind" button on the bottom to attach generated EVM to the current account. Confirm transaction from your Polkadot.js extension.
You should receive a confirmation.

### Check Balance

Let’s check Alice's DOT balance. On the left sidebar click `Execute`.

A list of native token contracts would appear e.g. DOT, aUSD, ACA, renBTC, etc. These native tokens \(including cross-chain assets like renBTC\) are exposed as pre-compiled contracts that would otherwise not be available in an EVM. Their supply, balances on accounts and functions are all available in EVM.

Select `DOT` and press `Execute` under it.

![](https://i.imgur.com/gGqwRZM.png)

Pick Alice from the `Call from Account`.

Pick `balanceOf` from `Message to Send`.

Notice `EVM Address` under Alice's account, copy and paste it to the `owner: address` argument field.

Click the `Call` button to execute.

![](https://i.imgur.com/8XQSarA.png)

The `Call results` at the bottom should show Alice’s DOT account balance.

![](https://i.imgur.com/2TNjbUM.png)


# Use Remix

There are multiple tools you can use to develop and compile Solidity contracts, we'd present two here as options

* online web app Remix 
* Solidity development and testing framework Waffle

### Compile a Solidity Contract using Remix Comment

This guide walks through the process of creating and deploying a Solidity-based smart contract to the Acala standalone node using the [Remix](http://remix.ethereum.org/). Remix is one of the commonly used development environments for smart contracts on Ethereum.

### **1. Launch Remix**

Navigate to [https://remix.ethereum.org/](https://remix.ethereum.org/). Under `Environments`, select `Solidity` to configure Remix for Solidity development, then navigate to the `File Explorers` view.

Here’s an example to compile an ERC20 contract using Remix.
Open Remix and under the `File` section click `New File`. 
![](https://i.imgur.com/J9jtCF4.png)

In the file explorer in the left window will appear an input, where you write filename: `BasicToken.sol`.

### **2. Compile the Solidity code**

Paste the following code into the editor tab that comes up.

```text
pragma solidity ^0.7.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.2.0-solc-0.7/contracts/token/ERC20/ERC20.sol';

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract BasicToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("BASICT", "BAT") public {
    _mint(msg.sender, initialSupply);
  }
}

```

Note: this is a simple ERC-20 contract based on the Open Zeppelin ERC-20 template. On construction, it creates the BasicToken with the symbol BAT, and mints the total initial supply.

Below is the editor view.
![](https://i.imgur.com/le9ZroU.png)

Then click the `Solidity compiler` on the left sidebar sidebar, make sure that you use exactly same compiler version that is shown in above screenshot; and click the `Compile BasicToken.sol` button. 

Remix will all of the Open Zeppelin dependencies and compile the contract.

### **3. Get the ABI & bytecode File**

To deploy smart contract into Acala EVM we will need a file with ABI (Application Binary Interface) - metadata of smart contract, allowing to interact with it; and bytecode - the compiled code which will be executed. For Acala EVM we need to have both of these data in one file.

Navigate back to `File explorers` (the top icon in the left sidebar), in the opened explorer select folder `artifacts`, and find inside the `BasicToken.json` file, click on it. You will see the content of the file, copy this content.
![](https://i.imgur.com/SHH7Mj3.png)

Copy and paste the content and save it locally, this is the ABI & bytecode file that will be deployed to Acala EVM later.


####   <a id="Compile-a-Solidity-Contract-using-Remix"></a>



# Use Waffle

There are multiple tools you can use to develop and compile Solidity contracts, we'd present two here as options

* online web app Remix 
* Solidity development and testing framework Waffle

### Compile Solidity Contract using Waffle Comment

**Note:** you can skip this section if you compiled the smart contract with Remix.

This guide walks through the process of deploying a Solidity-based smart contract to Acala using [Waffle](https://github.com/EthWorks/Waffle). Waffle is one of the most commonly used smart contract development frameworks for Ethereum.

### **1. Check Prerequisites**

First, we need to install Node.js \(we use v15.x in this example\) and the npm package manager. For installation follow guides in the official documentation for your operating system: [install NodeJS](https://nodejs.org/en/download/package-manager/)

We can verify that everything installed correctly by querying the version for each package:

```text
node -v
```

```text
npm -v
```

Install yarn package manager:

```text
npm install --global yarn
```

Check if it's installed correctly:
```text
yarn -v
```

### **2. Using Waffle With Our Examples**

We've made it easy by collecting all required dependencies in the [AcalaNetwork/evm-examples](https://github.com/AcalaNetwork/evm-examples) repo.

Simply clone the repository and install the dependencies.

```text
git clone https://github.com/AcalaNetwork/evm-examples
cd evm-examples/erc20

yarn install 
```

### **3. Using Waffle from Scratch (optional)**


Alternatively, you can install each library separately as the following: 

Create a project folder `smart-contract-waffle`

```text
mkdir smart-contract-waffle
cd smart-contract-waffle
```

Initiate package manager

```text
yarn init -y
```

Install all following dependencies

```text
yarn add --dev @openzeppelin/contracts@3.3.0 ethereum-waffle@3.2.1
```

Note: it's recommended to install dependencies with exact versions as specified to avoid breaking changes.

Then create a waffle settings file

```text
touch waffle.json
```

Paste the following in the `waffle.json` file

```text
 {
    "compilerType": "solcjs",
    "compilerVersion": "0.6.2",
    "sourceDirectory": "./contracts",
    "outputDirectory": "./build"
  }
```

This sets up the solidity compiler with version `0.6.2`, compiles contracts from the `./contracts` folder, and saves the bytecode output and ABI files to `./build` folder.


Now create the `./contracts` folder, and add the `BasicToken.sol` contract.

```text

mkdir contracts
touch contracts/BasicToken.sol
```

Paste the following content into the `BasicToken.sol` file and save.

```text
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Example class - a mock class using delivering from ERC20
contract BasicToken is ERC20 {
    constructor(uint256 initialBalance) public ERC20("Basic", "BSC") {
        _mint(msg.sender, initialBalance);
    }
}

```

### **4. Compile the Smart Contract**
Now compile the contract into ABI and bytecode. Run the following in the terminal

```text
yarn waffle
```

### **5. Get the ABI file**

Waffle will then generate the output file `./build/BasicToken.json` into the `./build` folder. 

Note: this file should be the same as the one created with Remix.

Waffle also provides a full suite of testing utilities, check out their documentation and code samples [here](https://github.com/EthWorks/Waffle).



# Open HRMP Channel

Steps to open HRMP channels: 1. Sender parachain send a init open channel request. 2. Recipient parachain accept request.

The steps above are done via `Xcm::Transact` from the sender's or recipient's part.

### Send init open channel request

#### Generate encoded transact

In PolkadotJS app, switch to the live Rococo network. Go to **Developer -&gt; Javascript** section.

Run the encoding code, note to replace the demo recipient para id `777` with your recipient:

```javascript
const tx = api.tx.hrmp.hrmpInitOpenChannel(777, 8, 1024);
console.log(tx.toHex())
```

The result will be like `0x3c041600090300000800000000040000`, remove the leading hex `3c04`, and the encoded result is `0x1600090300000800000000040000`.

#### Send request

Go to PolkadotJS app, switch to sender parachain. Go to **Developer -&gt; Sudo** section.

Use `xcmHandler -> sudoSendXcm` to send the transaction.

To confirm the request was sent, switch to live Rococo, go to **Developer -&gt; Chain State**, check **hrmp -&gt; hrmpOpenChannelRequests**.

### Accept channel request

#### Generate encoded transact

In PolkadotJS app, switch to the live Rococo network. Go to **Developer -&gt; Javascript** section.

Run the encoding code, note to replace the demo recipient para id `666` with your recipient:

```javascript
const tx = api.tx.hrmp.hrmpAcceptOpenChannel(666);
console.log(tx.toHex())
```

The result will be like `0x1c0416019a020000`, remove the leading hex `1c04`, and the encoded result is `0x16019a020000`.

#### Send request

Go to PolkadotJS app, switch to sender parachain. Go to **Developer -&gt; Sudo** section.

Use `xcmHandler -> sudoSendXcm` to send the transaction.



---
description: >-
  This page will discuss the transaction format in Acala and how to create,
  sign, and broadcast transactions.
---

# Transaction Construction

This page will discuss the transaction format in Polkadot and how to create, sign, and broadcast transactions. Like the other pages in this guide, this page demonstrates some of the available tools. **Always refer to each tool's documentation when integrating.**

### Transaction Format

Polkadot has some basic transaction information that is common to all transactions.

* Address: The SS58-encoded address of the sending account.
* Block Hash: The hash of the checkpoint block.
* Block Number: The number of the checkpoint block.
* Genesis Hash: The genesis hash of the chain.
* Metadata: The SCALE-encoded metadata for the runtime when submitted.
* Nonce: The nonce for this transaction.\*
* Spec Version: The current spec version for the runtime.
* Transaction Version: The current version for transaction format.
* Tip: Optional, the tip to increase transaction priority.
* Era Period: Optional, the number of blocks after the checkpoint for which a transaction is valid. If zero, the transaction is immortal.

\*The nonce queried from the System module does not account for pending transactions. You must track and increment the nonce manually if you want to submit multiple valid transactions at the same time.

Each transaction will have its own (or no) parameters to add. For example, the `transferKeepAlive` function from the Balances pallet will take:

* `dest`: Destination address
* `#[compact] value`: Number of tokens (compact encoding)

Once you have all the necessary information, you will need to:

1. Construct an unsigned transaction.
2. Create a signing payload.
3. Sign the payload.
4. Serialize the signed payload into a transaction.
5. Submit the serialized transaction.

Parity provides the following tools to help perform these steps.

### Acala JS

\[TODO]

### Tx Wrapper

If you do not want to use the CLI for signing operations, Parity provides an SDK called [TxWrapper](https://github.com/paritytech/txwrapper) to generate and sign transactions offline. See the [examples](https://github.com/paritytech/txwrapper/tree/master/examples) for a guide.

**Import a private key**

```
import { importPrivateKey } from '@substrate/txwrapper';

const keypair = importPrivateKey(“pulp gaze fuel ... mercy inherit equal”);
```

**Derive an address from a public key**

```
import { deriveAddress } from '@substrate/txwrapper';

// Public key, can be either hex string, or Uint8Array
const publicKey = “0x2ca17d26ca376087dc30ed52deb74bf0f64aca96fe78b05ec3e720a72adb1235”;
const address = deriveAddress(publicKey);
```

**Construct a transaction offline**

```
import { methods } from "@substrate/txwrapper";

const unsigned = methods.balances.transferKeepAlive(
  {
    dest: "15vrtLsCQFG3qRYUcaEeeEih4JwepocNJHkpsrqojqnZPc2y",
    value: 500000000000,
  },
  {
    address: "121X5bEgTZcGQx5NZjwuTjqqKoiG8B2wEAvrUFjuw24ZGZf2",
    blockHash: "0x1fc7493f3c1e9ac758a183839906475f8363aafb1b1d3e910fe16fab4ae1b582",
    blockNumber: 4302222,
    genesisHash: "0xe3777fa922cafbff200cadeaea1a76bd7898ad5b89f7848999058b50e715f636",
    metadataRpc, // must import from client RPC call state_getMetadata
    nonce: 2,
    specVersion: 1019,
    tip: 0,
    eraPeriod: 64, // number of blocks from checkpoint that transaction is valid
    transactionVersion: 1,
  },
  {
    metadataRpc,
    registry, // Type registry
  }
);
```

**Construct a signing payload**

```
import { methods, createSigningPayload } from '@substrate/txwrapper';

// See "Construct a transaction offline" for "{...}"
const unsigned = methods.balances.transferKeepAlive({...}, {...}, {...});
const signingPayload = createSigningPayload(unsigned, { registry });
```

**Serialize a signed transaction**

```
import { createSignedTx } from "@substrate/txwrapper";

// Example code, replace `signWithAlice` with actual remote signer.
// An example is given here:
// https://github.com/paritytech/txwrapper/blob/630c38d/examples/index.ts#L50-L68
const signature = await signWithAlice(signingPayload);
const signedTx = createSignedTx(unsigned, signature, { metadataRpc, registry });
```

**Decode payload types**

You may want to decode payloads to verify their contents prior to submission.

```
import { decode } from "@substrate/txwrapper";

// Decode an unsigned tx
const txInfo = decode(unsigned, { metadataRpc, registry });

// Decode a signing payload
const txInfo = decode(signingPayload, { metadataRpc, registry });

// Decode a signed tx
const txInfo = decode(signedTx, { metadataRpc, registry });
```

**Check a transaction's hash**

```
import { getTxHash } from ‘@substrate/txwrapper’;
const txHash = getTxHash(signedTx);
```

### Submitting a Signed Payload

There are several ways to submit a signed payload:

1. Signer CLI (`yarn run:signer submit --tx <signed-transaction> --ws <endpoint>`)
2. [Substrate API Sidecar](https://wiki.polkadot.network/docs/en/build-node-interaction#substrate-api-sidecar)
3. [RPC](https://wiki.polkadot.network/docs/en/build-node-interaction#polkadot-rpc) with `author_submitExtrinsic` or `author_submitAndWatchExtrinsic`, the latter of which will subscribe you to events to be notified as a transaction gets validated and included in the chain.

### Notes

Some addresses to use in the examples. See [Subkey documentation](https://substrate.dev/docs/en/knowledgebase/integrate/subkey).

```
$ subkey --network polkadot generate
Secret phrase `pulp gaze fuel ... mercy inherit equal` is account:
  Secret seed:      0x57450b3e09ba4598 ... ... ... ... ... ... ... .. 219756eeba80bb16
  Public key (hex): 0x2ca17d26ca376087dc30ed52deb74bf0f64aca96fe78b05ec3e720a72adb1235
  Account ID:       0x2ca17d26ca376087dc30ed52deb74bf0f64aca96fe78b05ec3e720a72adb1235
  SS58 Address:     121X5bEgTZcGQx5NZjwuTjqqKoiG8B2wEAvrUFjuw24ZGZf2

$ subkey --network polkadot generate
Secret phrase `exercise auction soft ... obey control easily` is account:
  Secret seed:      0x5f4bbb9fbb69261a ... ... ... ... ... ... ... .. 4691ed7d1130fbbd
  Public key (hex): 0xda04de6cd781c98acf0693dfb97c11011938ad22fcc476ed0089ac5aec3fe243
  Account ID:       0xda04de6cd781c98acf0693dfb97c11011938ad22fcc476ed0089ac5aec3fe243
  SS58 Address:     15vrtLsCQFG3qRYUcaEeeEih4JwepocNJHkpsrqojqnZPc2y
```


# Acala Stablecoin

To interact with Acala or Karura from Javascript you can use `@polkadot/api` along with `@acala-network/api`. You can learn more about `@polkadot/api` \[here]. ([https://polkadot.js.org/docs/api](https://polkadot.js.org/docs/api)).

We do also provide a [Stablecoin SDK](https://github.com/AcalaNetwork/acala.js/tree/master/packages/sdk-loan) which provides more some automation around stablecoins.

## Source Code of Karura Stablecoin

[https://github.com/AcalaNetwork/Acala/tree/master/modules/honzon](https://github.com/AcalaNetwork/Acala/tree/master/modules/honzon)

## Read-Only Functions (State queries)

These functions only read information from the chain, and thus don't require signing transactions with a private key. Read more about state queries here: [State queries docs](https://polkadot.js.org/docs/api/start/api.query)

### Get Vault for specific Account for given Collateral Type

Returns amount of `collateral` and amount of minted stablecoin as `debit` for specific collateral type and account.

> Note :warning: `debit` reflects the only amount of minted kUSD. The amount of debt is higher as it includes accumulated interest. To calculate the total amount to payback you need to use `debitExchangeRate` parameter (the example for fetching `debitExchangeRate` is shown below).

```typescript
positions(currencyId: CurrencyId, accountId: AccountId):
    Promise<{collateral: number, debit: number}>
```

**Arguments**

| Name       | Type       |                                                      |
| ---------- | ---------- | ---------------------------------------------------- |
| currencyId | CurrencyId | collateral currency Id                               |
| accountId  | AccountId  | account to fetch vaults for, can be passed as string |

Example:

```typescript
    const result = await api.query.loans.positions(
        { TOKEN: "KSM" },
        "<ACCOUNT>"
    );
  console.log(result.toHuman());
```

#### Full code snippet:

[loan-examples/get-positions.js](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/loan-examples/get-positions.ts)

### Get total amount of collateral and borrowed kUSD for Collateral Type

Returns total amount of `collateral` and amount of borrowed stablecoin as `debit` for specific collateral type.

```typescript
totalPositions(currencyId: CurrencyId):
    Promise<{collateral: number, debit: number}>
```

**Arguments**

| Name       | Type       |                                               |
| ---------- | ---------- | --------------------------------------------- |
| currencyId | CurrencyId | identificator for currency used as collateral |

Example:

```typescript
    const result = await api.query.loans.totalPositions(
        { TOKEN: "KSM" }
    );
  console.log(result.toHuman());
```

#### Full code snippet:

[loan-examples/total-positions.ts](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/loan-examples/total-positions.ts)

### Get Risk Parameters for given Collateral type.

Each accepted by Karura Collateral Type can have different risk parameters. These values are controlled by Karura Governance.

```typescript
collateralParams(currencyId: CurrencyId):
    Promise<{
    maximumTotalDebitValue: number,
    interestRatePerSec: number, 
    liquidationRatio: number,
    liquidationPenalty: number,
    requiredCollateralRatio: number,

    }>
```

**Arguments**

| Name       | Type       |                                               |
| ---------- | ---------- | --------------------------------------------- |
| currencyId | CurrencyId | identificator for currency used as collateral |

**Return values**

| Name                    | Type    |                                                                                                                                             |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| maximumTotalDebitValue  | Number  | maximum amount of KUSD that can be borrowed for one vault                                                                                   |
| interestRatePerSec      | Percent | the percentage of borrowed kUSD to be paid each next block. This amount should be added to `globalInterestRatePerSec` to calculate the debt |
| liquidationRatio        | Percent | collateral ratio (collateral value / debt value) reaching which the vault gets liquidated                                                   |
| liquidationPenalty      | Percent | penalty that is charged from the vault if the vault gets liquidated                                                                         |
| requiredCollateralRatio | Percent | Minimum collateral ratio till which user can borrow kUSD                                                                                    |

Example:

```
    const result = await api.query.cdpEngine.collateralParams({ 
      TOKEN: "KSM" 
    });
    console.log(result.toHuman());
```

#### Full code snippet:

[loan-examples/collateral-params.ts](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/loan-examples/collateral-params.ts)

### Get Debt Exchange Rate for given collateral type

This parameter is used to calculate the debt. The amount of minted kUSD should be multiplied by this parameter. As the Interest rate is accumulated depends on block number, it makes sense to fetch this parameter for a certain block.

```typescript
debitExchangeRate(currencyId: CurrencyId):
    Promise<number}>
```

**Arguments**

| Name       | Type       |                                               |
| ---------- | ---------- | --------------------------------------------- |
| currencyId | CurrencyId | identificator for currency used as collateral |

Example:

```
  const result = await api.query.cdpEngine.debitExchangeRate.at(
      '<BLOCK_HASH'
      { TOKEN: "KSM" }
  );
  console.log(result.toHuman());
```

#### Full code snippet:

[loan-examples/debit-exchange-rate.ts](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/loan-examples/debit-exchange-rate.ts)

## State-Changing Functions

These transactions write data on-chain and require a private key to sign the transaction. To perform run test code snippets ensure that you have `SEED_PHRASE` environment variable defined in your `.env` file.

### Create and manage the Vault

All operations: creating a vault, adding/removing collateral, borrowing, paying back kUSD can be done using a single method: `honzon.adjustLoan`

```typescript
adjustLoan(currency_id: CurrencyId, collateral_adjustment: Number, debit_adjustment: Number): Extrinsic
```

**Arguments**

| Name                   | Type          |                                                                                                                                  |
| ---------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| currencyId             | CurrencyId    | collateral CurrencyId                                                                                                            |
| collateral\_adjustment | Signed Amount | positive means to deposit collateral currency into Vault, negative means withdraw collateral currency from the Vault             |
| debit\_adjustment      | Signed Amount | positive means to mint some amount of stablecoin to the caller; negative means that caller will pay back stablecoin to the Vault |

Example

```typescript
  const currencyId = { TOKEN: "KSM" };
  const collateralAdjustment = <DESIRED_ADJUSTMENT>;
  const debitAdjustment = <DESIRED_ADJUSTMENT>;

  const extrinsic = api.tx.honzon.adjustLoan(
    currencyId,
    collateralAdjustment,
    debitAdjustment
  );
  const hash = await extrinsic.signAndSend(signer);
  console.log('hash', hash.toHuman());
```

> Note :warning: the supply amount should be denormalised with KAR decimals for this example

#### Full code snippet:

[loan-examples/adjustLoan.ts](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/loan-examples/adjustLoan.ts)

### Grants permission for transferring loan

Sets permission to transfer caller's loan to another Account (`to`).

```typescript
authorize(curencyId: CurrencyId, to: AccountId): Extrinsic
```

Returns `Extrinsic` type that should be signed with a private key.

**Arguments**

| Name       | Type       |                                                     |
| ---------- | ---------- | --------------------------------------------------- |
| currencyId | CurrencyId | collateral CurrencyId                               |
| to         | AccountId  | sets permission to transfer loan for this accountId |

**Example**:

```typescript
  const accountId = "<ACCOUNT_ID>";
  const extrinsic = api.tx.honzon.authorize(
    { TOKEN: "KSM" }, 
    accountId
  );
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
```

#### Full code snippet:

[loan-examples/authorize.ts](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/loan-examples/authorize.ts)

### Removes permission for transferring loan

Removes permission to transfer caller's loan to another Account (`to`). This method can be used to decline previously given permission.

```typescript
unauthorize(curencyId: CurrencyId, to: AccountId): Extrinsic
```

Returns `Extrinsic` type that should be signed with a private key.

**Arguments**

| Name       | Type       |                                                        |
| ---------- | ---------- | ------------------------------------------------------ |
| currencyId | CurrencyId | collateral CurrencyId                                  |
| to         | AccountId  | removes permission to transfer loan for this accountId |

**Example**:

```typescript
  const accountId = "<ACCOUNT_ID>";
  const extrinsic = api.tx.honzon.unauthorize(
    { TOKEN: "KSM" }, 
    accountId
  );
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
```

### Removes permissions for ALL accounts to transfer the vault

Removes permission to transfer caller's vault to ALL accounts for all Collateral types. This method can be used to decline previously given permission.

```
unauthorizeAll(): Extrinsic
```

Returns `Extrinsic` type that should be signed with a private key.

**Example**:

```typescript
  const extrinsic = api.tx.honzon.unauthorizeAll();
  const hash = await extrinsic.signAndSend(signer);
  console.log("hash", hash.toHuman());
```

### Transfering Vault to another account

Transfers Vault to the caller's account if it has permissions (if `authorize` was called previously by `from` account).

```
transferLoanFrom(currency_id, from): Extrinsic
```

Returns `Extrinsic` type that should be signed with a private key.

**Arguments**

| Name       | Type       |                                                      |
| ---------- | ---------- | ---------------------------------------------------- |
| currencyId | CurrencyId | collateral CurrencyId                                |
| from       | AccountId  | transfers collateral from this account to the caller |

**Example**:

```typescript
    const fromAccountId = "<ACCOUNT_ID>";
    const extrinsic = api.tx.honzon.transferLoanFrom(
      { TOKEN: "KSM" },
      fromAccountId
    );
    const hash = await extrinsic.signAndSend(signer);
    console.log("hash", hash.toHuman());
```

### Closing caller's Vault by swapping collateral in DeX

This action can be done with `adjustLoan`, but there is a shortcut created for this purpose which is applied only to safe vaults (where the collateral ratio is above liquidation level) and where the debt amount is positive.

This method closes the caller's Vault by selling a sufficient amount of collateral on Karura Dex.

```typescript
closeLoanHasDebitByDex(
    currency_id: CurrencyId, 
    max_collateral_amount: number, 
    maybe_path?: CurrencyId[]
): Extrinsic
```

Returns `Extrinsic` type that should be signed with a private key.

**Arguments**

| Name                    | Type          |                                                                                  |
| ----------------------- | ------------- | -------------------------------------------------------------------------------- |
| currencyId              | CurrencyId    | collateral CurrencyId                                                            |
| max\_collateral\_amount | number        | the maximum collateral that's allowed to be swapped in DeX to pay back the Vault |
| maybe\_path             | CurrencyId\[] | swap path that can be used for swapping collateral for kUSD in DeX               |

**Example**:

```typescript
    const extrinsic = api.tx.honzon.closeLoanHasDebitByDex(
      { TOKEN: "KSM" },
      // large number, allows swapping almost any amount
      1 * 10 ** 30,
      [{ TOKEN: "KSM" }, { TOKEN: "KUSD" }]
    );
    const hash = await extrinsic.signAndSend(signer);
    console.log("hash", hash.toHuman());
```

#### Full code snippet:

[loan-examples/close-vault-with-dex.ts](https://github.com/AcalaNetwork/acala-js-example/blob/master/src/loan-examples/close-vault-with-dex.ts)


# Try Acala DApp

![](<../../../../.gitbook/assets/Screen Shot 2021-02-03 at 4.41.26 PM.png>)

Try Acala's DeFi Suite on the ETHDenver live testnet

* Set up Polkadot{js} extension (Metamask for Polkadot), and create an account [here](https://wiki.polkadot.network/docs/en/learn-account-generation#polkadotjs-browser-plugin)
* Use this [Get Started guide](https://wiki.acala.network/learn/get-started) to use the applications. Bear in mind ETHDenver DApp and Nodes are different as specified below.
* [Dapp](https://acala-dapp-git-update-acalanetwork.vercel.app/): this deployment connects to the same network (TC6) used for ETHDenver hackathon&#x20;
* [ETHDenver Nodes](https://wiki.acala.network/learn/get-started/public-nodes#latest-ethdenver-nodes)

When first landing on the DApp website, you'd be asked to Upload metadata, click `Upload` and sign the transaction in the Polkadot{js} extension prompt. The extension doesn't have the latest changes of EVM deployment yet - you're in this really early!&#x20;

![](<../../../../.gitbook/assets/screen-shot-2021-02-03-at-4.39.46-pm (1) (1) (1) (1) (1).png>)







