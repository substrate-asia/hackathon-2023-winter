## Basic Information

**Project Name:** CBIndex

**Project Initiation Date:** 2023-11-15

**Track:** DApp & Smart Contract

**Github Links:**

- [**Smart Contract**](https://github.com/DRGU0416/polkadot-2023-winter-contracts)
- [**Frontend**](https://github.com/CypherBabel-Lab/hackathon-frontend/tree/moonbase)

**Useful Links:**

- [**Demo Website**](https://moonbase.cbindex.finance/)
- [**Deck for Hackathon**](https://docsend.com/view/v6nkyudvtjsr55v5)
- [**Demo Video**](https://www.youtube.com/watch?v=ODh7vhxKT5A)
- [**Whitepaper**](https://cbindex.finance/CBIndex_whitepaper_2023_v1.pdf)
- [**X (Twitter)**](https://twitter.com/CBIndex_Global)
- [**Telegram**](https://t.me/CBIndexGlobalM)

## Important Note

<div style="color:darkred">
The Project CBIndex attended Polkadot Hackathon Summer 2023. At that time, we tried to complete the copy-investing feature for the copy fund (the basic feature of our project), and tried to deploy on the Vara blockchain. Due to the lack of maturity of the infra and time constraints, we barely finished the copy-investing feature during the hackathon.
<br />
<br />
We were very lucky to win the 3rd place of the smart contract track.
<br />
<br />
This time, we've done sufficient research and planning. We would love to try completing one of our advanced features, namely active on-chain funds, on the Moonbase Alpha TestNet.
</div>

## Planned Tasks for the Hackathon

**Blockchain Side**

[x] Develop the smart contracts for the ACTIVE FUND feature (fund creation, investment, withdrawal, and etc.).

[x] Test and deploy the smart contracts on Moonbase Alpha TestNet.

[x] Build an environment for demoing the active funds, including issue ERC20 tokens, set up LP pools, mock Chainlink's V3's price feed, and deploy Uniswap V2.

**Client Side**

[x] Develop the frontend for the ACTIVE FUND feature using NextJS.

[x] Realize wallet connection by integrating Web3Modal V3.

---

## Completed Tasks During the Hackathon (100% completion)

**Blockchain Side**

✅ Develop the smart contracts for the ACTIVE FUND feature (fund creation, investment, withdrawal, and etc.).

✅ Test and deploy the smart contracts on Moonbase Alpha TestNet.

✅ Build an environment for demoing the active funds, including issue ERC20 tokens, set up LP pools, mock Chainlink's V3's price feed, and deploy Uniswap V2.

**Client Side**

✅ Develop the frontend for the ACTIVE FUND feature using NextJS.

✅ Realize wallet connection by integrating Web3Modal V3.

---

## Details about the completed tasks for blockchain side

**1. Completed the smart contracts for the ACTIVE FUND feature.**

**2. Deployed and tested the smart contracts on the Moonbase Alpha TestNet.**

- `vaultFactory contract`: [`0x5dfb6B780ABb253EFCf71E6Ad746b037E87af119`](https://moonbase.moonscan.io/address/0x5dfb6B780ABb253EFCf71E6Ad746b037E87af119)

- `vauleEvaluator contract`: [`0x56dFCCf1CaCFDB4B7a8734e1180caf6a72a03095`](https://moonbase.moonscan.io/address/0x56dFCCf1CaCFDB4B7a8734e1180caf6a72a03095)

- `integrationManager contract`:[`0x5e7F4f3D819579B72250eA3905FeDfEC9d839ee5`](https://moonbase.moonscan.io/address/0x5e7F4f3D819579B72250eA3905FeDfEC9d839ee5)

**3. Issued five ERC20 crypto assets on the Moonbase Alpha TestNet, the contract addresses are:**

- WDEV: [`0x3d0773F4D6092ddA362942718d23e2d5839E9923`](https://moonbase.moonscan.io/address/0x3d0773F4D6092ddA362942718d23e2d5839E9923)
- WBTC: [`0x1717ce2518f2cE585a37E5EB9Ae84a4E9d15C933`](https://moonbase.moonscan.io/address/0x1717ce2518f2cE585a37E5EB9Ae84a4E9d15C933)
- WETH: [`0x44e124657dc15dceA2296C9e576055D8671D2010`](https://moonbase.moonscan.io/address/0x44e124657dc15dceA2296C9e576055D8671D2010)
- WSOL: [`0xa0D0C7d0FEdf76FE8916bA27865C5f22EA4E6E88`](https://moonbase.moonscan.io/address/0xa0D0C7d0FEdf76FE8916bA27865C5f22EA4E6E88)
- DAI: [`0xD4A7fe0B233698329b3Cd9a069E40321DE8B7B36`](https://moonbase.moonscan.io/address/0xD4A7fe0B233698329b3Cd9a069E40321DE8B7B36)

**4. Mocked Chainlink V3's `Price Feed`, the contract addresses are:**

- WDEV/USD: [`0x6427C7c9f8c46C046C3e3B6397d6c8025605F8f7`](https://moonbase.moonscan.io/address/0x6427C7c9f8c46C046C3e3B6397d6c8025605F8f7››)
- WBTC/USD: [`0xc04551568ecEb527c7086b729B4023C4bdbe0b23`](https://moonbase.moonscan.io/address/0xc04551568ecEb527c7086b729B4023C4bdbe0b23)
- WETH/USD: [`0x40853B288AaCbAcbc304eF1572929C21Aef6b16b`](https://moonbase.moonscan.io/address/0x40853B288AaCbAcbc304eF1572929C21Aef6b16b)
- WSOL/USD: [`0xAe31aCc3a0fFFD9F9cc7bce7857B8013b6f64498`](https://moonbase.moonscan.io/address/0xAe31aCc3a0fFFD9F9cc7bce7857B8013b6f64498)
- DAI/USD: [`0x783Ba53f62d3C7283463c251d0D092047109FA0A`](https://moonbase.moonscan.io/address/0x783Ba53f62d3C7283463c251d0D092047109FA0A)

**5. Built a Uniswap V2 on the Moonbase Alpha TestNet with the `UniswapV2Factory`([`0x7cfEc7b0C916682f41AaD078F72960BDFaC59B41`](https://moonbase.moonscan.io/address/0x7cfEc7b0C916682f41AaD078F72960BDFaC59B41)), `adapterUniswapV2Exchange`([`0x9E21b1C0335DC42ddD1a0a6054Afe04f5AE4cC9D`](https://moonbase.moonscan.io/address/0x9E21b1C0335DC42ddD1a0a6054Afe04f5AE4cC9D)), and `adapterUniswapV2LP`([`0xE280491f1A7505cd5871c04175F0e01FaA98DB16`](https://moonbase.moonscan.io/address/0xE280491f1A7505cd5871c04175F0e01FaA98DB16)) to create four Liquidity Pools on the XRPL EVM Sidechain containing the five crypto assets, the contract addresses are:**

- WDEV/DAI LP
- WBTC/DAI LP
- WETH/DAI LP
- WSOL/DAI LP

**6. Deployed `Adaptor` for Uniswap V2 to enable swap.**

- UniswapV2Router02 ([`0x0E1CE7f7E08682E581166E2610Ba185Bff3C78B4`](https://moonbase.moonscan.io/address/0x0E1CE7f7E08682E581166E2610Ba185Bff3C78B4)) is used for swap.
