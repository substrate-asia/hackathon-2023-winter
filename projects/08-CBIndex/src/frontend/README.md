# 🏆 What has been done in New Horizon Hackathon

## Smart Contracts

**1. Completed the smart contracts for the ACTIVE FUND feature.**

**2. Deployed and tested the smart contracts on the XRPL EVM Sidechain.**

- [`vaultFactory`](https://evm-sidechain.xrpl.org/address/0x28703Bde2b910Ea546022a31A0C956f4C7eD2023) contract

**3. Issued five ERC20 crypto assets on the XRPL EVM Sidechain, the contract addresses are:**

- WXRP: [`0xfDaF44799BA8fa3DC6af978ea142B7101c17CDD9`](https://evm-sidechain.xrpl.org/address/0xfDaF44799BA8fa3DC6af978ea142B7101c17CDD9)
- WBTC: [`0x9aF7D95036e2516E2c3149b79A8992345d56F80B`](https://evm-sidechain.xrpl.org/address/0x9aF7D95036e2516E2c3149b79A8992345d56F80B)
- WSOL: [`0x73aaB0aef913eA76d5EA81c61BC31fe76023cC4f`](https://evm-sidechain.xrpl.org/address/0x73aaB0aef913eA76d5EA81c61BC31fe76023cC4f)
- WETH: [`0x83Ff9c342388e77eE480Ffa262A5a0E52536fFcc`](https://evm-sidechain.xrpl.org/address/0x83Ff9c342388e77eE480Ffa262A5a0E52536fFcc)
- DAI: [`0xEBeB6B2744469111dBA0e5B0C7FBdC88c1427544`](https://evm-sidechain.xrpl.org/address/0xEBeB6B2744469111dBA0e5B0C7FBdC88c1427544)

**4. Mocked Chainlink V3's `Price Feed`, the contract addresses are:**

- WXRP/USD: [`0xC0FcE24e33DB355e21d63eb91Fd35D8F65D0A1DE`](https://evm-sidechain.xrpl.org/address/0xC0FcE24e33DB355e21d63eb91Fd35D8F65D0A1DE)
- WBTC/USD: [`0x5CA4db2bB728b0d6285A9C83d43F7503Dca12e92`](https://evm-sidechain.xrpl.org/address/0x5CA4db2bB728b0d6285A9C83d43F7503Dca12e92)
- WSOL/USD: [`0xf283c304b29c94385C01e77ef5E08160419D5760`](https://evm-sidechain.xrpl.org/address/0xf283c304b29c94385C01e77ef5E08160419D5760)
- WETH/USD: [`0x46BAFFad74F525f5D3eaCE0e7D94A3A74a224eFa`](https://evm-sidechain.xrpl.org/address/0x46BAFFad74F525f5D3eaCE0e7D94A3A74a224eFa)
- DAI/USD: [`0xaF4c3cB96c011Bd123a5aeB7C8eaf5E17f5Ca080`](https://evm-sidechain.xrpl.org/address/0xaF4c3cB96c011Bd123a5aeB7C8eaf5E17f5Ca080)

**5. Built a Uniswap V2 on the XRPL EVM Sidechain with the `UniswapV2Factory`(`0xc871b0b1c10F40059512F2DA2cD37255e6a9ae54`) to create three Liquidity Pools on the XRPL EVM Sidechain containing the five crypto assets, the contract addresses are:**

- WBTC/DAI LP: [`0x0875A5008Ad137dA00956Eb0332baaF1d31D172B`](https://evm-sidechain.xrpl.org/address/0x0875A5008Ad137dA00956Eb0332baaF1d31D172B)
- WSOL/DAI LP: [`0xeD073fD89b0E5954F8717D798376AdB0088cC141`](https://evm-sidechain.xrpl.org/address/0xeD073fD89b0E5954F8717D798376AdB0088cC141)
- WETH/DAI LP: [`0x79f37E9e5C7aB2EE8c39b3B8951205689034974E`](https://evm-sidechain.xrpl.org/address/0x79f37E9e5C7aB2EE8c39b3B8951205689034974E)

**6. Deployed `Adaptor` for Uniswap V2 to enable swap.**

- UniswapV2Router02 ([`0x722f41d377caf139619ab365A27da1018a74901e`](https://evm-sidechain.xrpl.org/address/0x722f41d377caf139619ab365A27da1018a74901e) is used for swap.

## Frontend

**1. Completed the frontend for the active fund feature.**

**2. Connected Metamask.**

---

### 📚 Important links

- [**Deck for New Horizon Hackathon**](https://docsend.com/view/inh6dvp6ki9paimg)
- [**Demo Video**](https://www.youtube.com/watch?v=B1gyny2OdrU)
- [**Demo Website**](https://ripple.cbindex.finance)
- [**Whitepaper**](https://cbindex.finance/CBIndex_whitepaper_2023_v1.pdf)
- [**X (Twitter)**](https://twitter.com/CBIndex_Global)
- [**Telegram**](https://t.me/CBIndexGlobal)

---

# 🚀 How to run the project

## 📦 Prerequisites

- Node.js v18.18.2+
- npm v9.8.1+
- Make sure you have installed [foundry](https://github.com/foundry-rs/foundry) on your machine.

## 🔆 Deploy smart contracts

### Step 1. Clone the repository

Note: the smart contracts and frontend are located in two repositories, please use the correct one.

```bash
git clone [GIT_REPOSITORY_URL] --recursive
```

### Step2. Go to the directory
```bash
cd [Project Name]
```

### Step 3. Create your `.env` file by copying `.env.example`

There is a private key of a wallet on the XRPL EVM Sidechain with a positive balance, with which you can deploy the smart contracts directly.

```bash
cp .env.example .env
```

You can also use your own wallet on the XRPL EVM Sidechain by setting `PRIVATE_KEY` in the `.env` file.


### Step 4. Deploy Uniswap V2 on the XRPL EVM Sidechain

(1) Build the project.
```bash
forge build
```

(2) Find the "init code hash". It is the `bytecode`'s `object` in `out/UniswapV2Pair.sol/UniswapV2Pair.json`.

(3) Format the object using an online tool: https://emn178.github.io/online-tools/keccak_256.html. Choose `Hex` as the input type and `Hash` as the output type. Copy the bytecode located in (2) into the input box and delete the `0x` at the beginning.

(4) Replace the init code hash in `lib/uniswapv2/src/libraries/UniswapV2Library.sol`, line 26) with the output of (3).

(5) Deploy the Uniswap V2 on the XRPL EVM Sidechain.
```bash
forge script ./script/UniswapV2Deploy.s.sol --skip-simulation --rpc-url https://rpc-evm-sidechain.xrpl.org --broadcast --slow -vvv
```

(6) Remember the three addresses (`wnativetoken address`, `factory address`, and `router address`) shown in `===Logs===` in the console. They will be used later.

### Step 5. Deploy test environment, including ERC20 test tokens, Uniswap V2 liquidity pools, and mocked Chainlink V3's price feed.

(1) Replace `UNISWAP_V2_ROUTER_02` in `script/EnvironmentDeploy.s.sol` (line 14) with the `router address` in Step 4's (6).

(2) Deploy the corresponding contracts
```bash
forge script ./script/EnvironmentDeploy.s.sol --skip-simulation --rpc-url https://rpc-evm-sidechain.xrpl.org --broadcast --slow -vvv
```

(3) Remember nine addresses shown in `===Logs===` in the console: `erc20WBTCAddress`, `erc20WETHAddress`, `erc20WSOLAddress`, `erc20DAIAddress`, `btcUsdAggregatorAddress`, `ethUsdAggregatorAddress`, `solEthAggregatorAddress`, `daiUsdAggregatorAddress`, and `wNativeTokenUsdAggregatorAddress`. They will be used later.

(4) Replace `WNATIVE_TOKEN` with `wnativetoken address` in `script/VaultFactoryDeploy.s.sol`.

(5) Replace `WNATIVE_TOKEN_USD_AGGREGATOR` with `wNativeTokenUsdAggregatorAddress` in `script/VaultFactoryDeploy.s.sol`.

(6) Replace `WBTC`, `WETH`, `WSOL`, and `DAI` with `erc20WBTCAddress`, `erc20WETHAddress`, `erc20WSOLAddress`, and `erc20DAIAddress` in `script/VaultFactoryDeploy.s.sol`, respectively.

(7) Replace `BTC_USD_AGGREGATOR`, `ETH_USD_AGGREGATOR`, `SOL_ETH_AGGREGATOR`, and `DAI_USD_AGGREGATOR` with `btcUsdAggregatorAddress`, `ethUsdAggregatorAddress`, `solUsdAggregatorAddress`, and `daiUsdAggregatorAddress` in `script/VaultFactoryDeploy.s.sol`. 

(8) Deploy test environment.
```bash
forge script ./script/VaultFactoryDeploy.s.sol --skip-simulation --rpc-url https://rpc-evm-sidechain.xrpl.org --broadcast --slow -vvv
```

### Step 6. Deploy Uniswapv2 adapter.

(1) Remember the address shown in `===Logs===` in the console: `integrationManagerAddress`.

(2) Replace `IntergrationManagerAddress`, `UNISWAP_V2_FACTORY`, and `UNISWAP_V2_ROUTER_02` with `integrationManagerAddress`, `factory address`, and `router address` respectively (`factory address`, and `router address` are in the first log).

(3) Deploy.
```bash
forge script ./script/AdapterDeploy.s.sol --skip-simulation --rpc-url https://rpc-evm-sidechain.xrpl.org --broadcast --slow -vvv
```

------

## 🔆 Test smart contracts

```bash
forge test
```

You can also manually run parts of the test suite, e.g:
```bash
forge test --match-test <REGEX>
```

Note: if the test is failed with `Could not instantiate forked environment with fork url`, please find a valid node of the Ethereum Mainnet and change `ETHEREUM_NODE_MAINNET` in `.env`.

----
## 🗿 Deploy frontend

### Step 1. Clone the repository

Note: the smart contracts and frontend are located in two repositories, please use the correct one.

```bash
git clone [GIT_REPOSITORY_URL] 
```

### Step 2. Go to the project directory (frontend)

```bash
cd [Project Name]
```

### Step 3. Install dependencies

```bash
npm i -f
```

### Step 4. Run the project

```bash
npm run dev
```

<div style="color:orange; background-color:#333">
Note:
<br />
- The frontend connects to the smart contracts deployed on the XRPL EVM Sidechain by us instead of yours.
  <br />
- The frontend also connects to our centralized backend for data fetching, e.g. vault list.
  </div>

---

# About CBIndex

![CBIndex](https://assets.cbindex.finance/api/uploads/thumbnail/azq5pkw824.png)

## 🌍 Hello World

### 🙋‍♀ What is CBIndex

As a crypto asset management platform using on-chain funds, CBIndex provides various crypto investment tools built on the CBI protocol, fostering an innovative environment for individuals and entities to manage and grow their crypto assets.

CBIndex is structured as a dual-component platform, comprising the "CBIndex Simulator" and the "CBIndex DApp." This unique architecture allows CBIndex to offer a comprehensive suite of features that cater to a wide range of user needs and preferences.

In the CBIndex ecosystem, the Simulator and the DApp components operate on distinct financial frameworks to cater to varying user needs and risk profiles. Within the Simulator, all investment activities are conducted using simulated USDT (sUSDT), which mirrors the real-time prices of crypto assets. This allows users to engage in a wide array of investment strategies without any financial risk, offering a sandbox environment for experimentation and learning. Conversely, the DApp component facilitates real investments, where users deploy actual crypto assets such as USDT to engage in actual financial transactions. This bifurcated approach ensures that while the Simulator serves as a risk-free educational platform, the DApp offers a real-world investment experience, each aligning with CBIndex's overarching goal of comprehensive and flexible on-chain investment and crypto asset management.

### 🌈 What problem do we want to solve

The problem is most crypto investors make bad investment decisions.

### 🧙 How do we solve the problem

We deliver a solution built with on-chain funds.

- **Copy fund & active fund:** copy-investing and mutual investing to bridge seasoned and new investors.
- **Index fund:** easy access to diversified crypto asset investments.
- **Simulator:** equip each user with a powerful investment simulator to play with.

### 💻 Technical Architecture

The technical architecture of CBIndex serves as the bedrock upon which the platform's diverse functionalities and features are built. This chapter aims to provide a comprehensive overview of the architecture, underlying technologies, and technical considerations that empower both the Simulator and the DApp components of CBIndex.
By delving into the intricacies of our technical infrastructure, we seek to offer readers a transparent and in-depth understanding of how CBIndex operates, ensuring that it aligns with industry best practices and meets the highest standards of security, scalability, and performance. Whether you are a potential investor, a developer, or an end-user, this chapter is designed to elucidate the technical robustness that makes CBIndex a pioneering solution in the realm of on-chain investment and crypto asset management.

![CBIndex Architecture](https://assets.cbindex.finance/api/uploads/2023-11-17/u5pi1j7stf.png)

The architecture of CBIndex is meticulously designed to offer a harmonious blend of centralized and decentralized components, encapsulated within the Simulator and the DApp, respectively. This dual-architecture approach serves multiple purposes. First, it provides an educational, playful, and risk-free environment through the Simulator, allowing users to familiarize themselves with on-chain investment and crypto asset management without financial exposure.

Second, it offers a decentralized, secure, and transparent platform through the DApp, aligning with the ethos of blockchain and catering to users who are ready for real investments.

The three-layered structure—Infrastructure, Core, and Application—ensures modularity and scalability, allowing each component to evolve independently while maintaining overall system integrity. Additionally, the "Integration" part signifies CBIndex's commitment to adaptability and innovation, as it leaves room for incorporating essential services and emerging technologies to meet evolving market demands.
The architecture diagram of CBIndex, as shown in Figure 2, offers a holistic view of the technical structure, divided into three primary layers: Infrastructure, Core, and Application. Each layer has specific components for both the Simulator and the DApp, and an additional part on the right outlines various integrations that enhance the platform's capabilities.
