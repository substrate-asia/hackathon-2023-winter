## Basic Information

**Project Name:** CBIndex

**Project Initiation Date:** 2023-11-15

**Track:** DApp & Smart Contract

**Useful Links:**

- [**Demo Website**](https://moonbase.cbindex.finance/)
- [**Deck for Hackathon**](https://docsend.com/view/v6nkyudvtjsr55v5)
- [**Demo Video**]()
- [**Whitepaper**](https://cbindex.finance/CBIndex_whitepaper_2023_v1.pdf)
- [**X (Twitter)**](https://twitter.com/CBIndex_Global)
- [**Telegram**](https://t.me/CBIndexGlobalM)

## Important Note

> The Project CBIndex attended Polkadot Hackathon Summer 2023. At that time, we tried to complete the copy-investing feature for the copy fund (the basic feature of our project), and tried to deploy on the Vara blockchain. Due to the lack of maturity of the infra and time constraints, we barely finished the copy-investing feature during the hackathon.
>
> We were very lucky to win the 3rd place of the smart contract track.
>
> This time, we've done sufficient research and planning. We would love to try completing one of our advanced features, namely active on-chain funds, on Moonbase Alpha TestNet.

## Planned Tasks for the Hackathon

**Blockchain Side**

- [x] Develop the smart contracts for the ACTIVE FUND feature (fund creation, investment, withdrawal, and etc.).
- [x] Test and deploy the smart contracts on Moonbase Alpha TestNet.
- [x] Build an environment for demoing the active funds, including issue ERC20 tokens, set up LP pools, mock Chainlink's V3's price feed, and deploy Uniswap V2.

**Client Side**

- [x] Develop the frontend for the ACTIVE FUND feature using NextJS.
- [x] Realize wallet connection by integrating Web3Modal V3.

---

## Completed Tasks During the Hackathon (100% completion)

**Blockchain Side**

- [✓] Develop the smart contracts for the ACTIVE FUND feature (fund creation, investment, withdrawal, and etc.).
- [✓] Test and deploy the smart contracts on Moonbase Alpha TestNet.
- [✓] Build an environment for demoing the active funds, including issue ERC20 tokens, set up LP pools, mock Chainlink's V3's price feed, and deploy Uniswap V2.

**Client Side**

- [✓] Develop the frontend for the ACTIVE FUND feature using NextJS.
- [✓] Realize wallet connection by integrating Web3Modal V3.

---

## Details about the completed tasks for blockchain side

**1. Completed the smart contracts for the ACTIVE FUND feature.**

**2. Deployed and tested the smart contracts on the Moonbase Alpha TestNet.**

- [`vaultFactory`]() contract

**3. Issued five ERC20 crypto assets on the Moonbase Alpha TestNet, the contract addresses are:**

- WDEV: [``]()
- WBTC: [``]()
- WETH: [``]()
- WSOL: [``]()
- DAI: [``]()

**4. Mocked Chainlink V3's `Price Feed`, the contract addresses are:**

- WDEV/USD: [``]()
- WBTC/USD: [``]()
- WETH/USD: [``]()
- WSOL/USD: [``]()
- DAI/USD: [``]()

**5. Built a Uniswap V2 on the Moonbase Alpha TestNet with the `UniswapV2Factory`(``) to create three Liquidity Pools on the XRPL EVM Sidechain containing the five crypto assets, the contract addresses are:**

- WDEV/DAI LP: [``]()
- WBTC/DAI LP: [``]()
- WETH/DAI LP: [``]()
- WSOL/DAI LP: [``]()

**6. Deployed `Adaptor` for Uniswap V2 to enable swap.**

- UniswapV2Router02 ([``]() is used for swap.

---
