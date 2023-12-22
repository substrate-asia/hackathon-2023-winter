# Xcavate Protocol
Creating a fairer, trust-less and more sustainable real estate investment web3 future.

## Project Description

​​Xcavate, a decentralised real estate investment community-driven lending and asset tokenisation protocol, has been developed using the Polkadot SDK to advance the Web3 ecosystem. Our open-source and modular blockchain streamlines asset investment opportunities, while adhering to regulations. The Xcavate protocol aims to be the most decentralised, efficient, and regulatory-compliant global real estate centric lending and asset tokenisation community platform.

Complex and opaque processes that often involve many layers of intermediaries, unnecessarily increase cost and are extremely time intensive. By leveraging bank grade software encryption, decentralised digital identifiers, and verifiable reusable credentials, the Xcavate protocol delivers much greater transparency and removes the need for many trusted intermediaries.

Total global Real Estate was valued at over $378.7 trillion at the end of 2022 (Source: Savills Research, and Savills Research using World Bank, Bank for International Settlements, World Federation of Exchanges, World Gold Council). This eye watering sum remains the largest store of wealth across all sectors. Yet only 1.1% of the global population own nearly half of the world’s total wealth (Source: Credit Suisse Global Wealth Databook 2021). Due to the complex nature of real estate investment and the traditional need for trusted intermediaries, many real estate investment opportunities are not possible for the average person.

Nearly 40% of global carbon dioxide emissions come from the real estate sector (Source: Forbes article by David Carlin Apr 5, 2022). Approximately 70% are produced by building operations, while the remaining 30% comes from construction.

An estimated 150 million people are homeless globally, though the real number is probably higher (Source: The World Economic Forum website article by Patrick Henry Oct 2021).
The Xcavate blockchain protocol aims to tackle these issues by leveraging the power of blockchain technology, digital identity, smart contracts and oracles to introduce transparency, security,  accessibility and sustainability to the real estate market.


## Already completed - before Polkadot Winter Hackathon start date 01-11-2023

We had build a custom substrate / Tanssi node with specific custom pallets for both Community Loan Pool (lending for new build real estate projects) & NFT marketplace (Buying & selling fractional real estate). We had launched this successfully on the Tanssi testnet.

- Tanssi node Github repo: https://github.com/XcavateBlockchain/tanssi

We had also built a frontend dApp which leveraged the Kilt protocol so digital identifers and verifiable credentials could be used to confirm KYC/KYB prior to

- Xcavate dApp frontend repo: https://github.com/XcavateBlockchain/MVP_Frontend
- Xcavate dApp backend repo: https://github.com/XcavateBlockchain/MVP_Backend
- Wanos DID credential verification dApp repo: https://github.com/XcavateBlockchain/MVP_Admin  

## Hackathon project submission - Enhanced Xcavate substrate node & realXchange dApp

To deliver on our goal of making our protocol Planet Positive. Our hackathon team is planning to create a custom substrate pallet called the "Community Projects Pallet". The idea is that a number of XCAV (the native token of the Xcavate Protocol) tokens... currently set at 5% of the total supply, Will be locked in this pallet to pay for transaction fees. In addition to payment of fees, as NFT are sold on the Xcavate NFT marketplace, XCAV tokens in the Community Projects pallet will be unlocked and used as a rewards pool. These rewards can be deliverd to specific projects that any XCAV token holder bonds their tokens on.

We are also looking to build a frontend typescript dApp called "realXchange" so that a "Project Manager" (who has passed KYC/KYB), can list a new project to support any of the three focus areas; Environment, Ecology & Social.

The Project Manager would create the project by filling in the form and uploading relevant information and the required project fund total along with the expected timescale. Then the Project Manager would create NFTs (which are auto generated using an AI integration tool), specifying the number and cost of each NFT. Finally, the project and NFT collection is posted on the project marketplace so buyers can purchase NFTs to support a particular project.

However, it is not a passive donation and the NFT holder can vote on the various stages on the specific project their NFT relates to. Only after a majority of NFT holders have accepted the evidence provided by the Project Manager, can the next tranche of funds be realesed to the Project Managers wallet. This voting happens at ever stage of the project. If the project receives a majority "no" vote then the remaining funds are returned to the NFT holders and the NFTs burned.
