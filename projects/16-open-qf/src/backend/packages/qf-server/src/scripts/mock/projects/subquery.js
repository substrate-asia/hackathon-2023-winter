const { category } = require("../../../utils/consts/category");

const subquery = {
  name: "SubQuery",
  summary:
    "SubQuery is a fast, flexible, and reliable open-source data indexer that provides you with custom APIs for your web3 project across all of our supported chains.",
  creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
  category: category.data,
  links: [
    "https://linktr.ee/subquerynetwork",
    "https://subquery.network/home",
    "https://twitter.com/SubQueryNetwork",
  ],
  description: `SubQuery is the Universal data indexing toolkit facilitating the construction of Web3 applications of the future. This proposal seeks funding to cover expenses associated with maintaining the SubQuery <> Nova Wallet Common API infrastructure in Q1-Q2 2023.

---

Requested allocation: 46,122.04 USD
Project Category / Type: Infrastructure and Network Operations

---

In continuation of our commitment to fostering the growth and development of the Polkadot ecosystem, we present a treasury proposal for Q1-Q2 2023 to fund the reimbursement of the costs for running the SubQuery Common API infrastructure. The SubQuery Common API has proven to be an invaluable tool for client applications, enabling seamless access to pre-indexed data that would otherwise be resource-consuming or challenging to query directly from the blockchain, such as operation history, staking analytics, and more.

The partnership between SubQuery and Nova has flourished over time, exemplifying a collaborative spirit that has enhanced the Polkadot ecosystem. Notably, Nova Wallet has seamlessly integrated support for the public SubQuery projects, specifically tailoring them to index transfers from both the "assets" and "ORML" pallets, as well as providing Staking & OpenGov data. This innovative integration has enabled easy access and querying of this vital data not only for Nova Wallet but also for any stakeholders within the ecosystem. Whether utilizing the free hosted projects or by running the relevant SubQuery project locally, the ability to glean insights from transfers across parachains has become both accessible and efficient.

This proposal outlines the infrastructure costs incurred for Q1-Q2 2023 that have played an instrumental role in ensuring the availability and accessibility of invaluable data to the Polkadot community. This symbiotic relationship, wherein SubQuery charges Nova for hosting services, signifies the collaborative synergy propelling this initiative and setting a path for future funding requests initiated by the SubQuery team themselves.

SubQuery’s Common Good API features:

- Supports 74 Substrate-based networks of Polkadot & Kusama ecosystem
- The Nova Wallet SubQuery projects are grouped based on the following supported features, each using a standard API:
- Operation History: Transfers and Extrinsics for Utility (main) token of the network
- Multi-asset transfers: Support for transfer history for tokens from ORML and Assets pallets
- Staking rewards: Rewards history and accumulated total rewards, support both Staking and ParachainStaking pallets
- Staking analytics: Queries for a current stake, validators statistics, and stake change history
- OpenGov: Queries for Aye/Nay votes, agile delegations
- Multistaking: Queries for gettings total rewards, APY/APR, stake and status simultaneously across all supported networks
- Hosted on SubQuery infrastructure by Novasama Technologies:
Link: https://api.novasama.io/
- Developed & maintained by Novasama Technologies, available in open source:
- Operation history: https://github.com/novasamatech/subquery-nova
- OpenGov: https://github.com/novasamatech/subquery-governance
- Multistaking: https://github.com/novasamatech/subquery-staking
- The SubQuery Common API extends its accessibility to a wide array of teams and projects. Notable examples of those leveraging the capabilities of the SubQuery Common API include:
- Nova Wallet: https://novawallet.io/ (full integration)
- SubWallet: https://subwallet.app/ (full integration till January 2023, partial till today)
- Variety of different individual projects based on data from SubQuery
`,
  bannerCid: "bafybeif25u7wshxzd5dmbnwtqk7i4fvfh4u66xry66gffc4rt7yb5p7gmy",
  logoCid: "bafybeibu5t45ofqnhela5tk3zyr4hdyddswbcoa637bwcew2sucmerhfla",
  contributors: [],
};

module.exports = {
  subquery,
};
