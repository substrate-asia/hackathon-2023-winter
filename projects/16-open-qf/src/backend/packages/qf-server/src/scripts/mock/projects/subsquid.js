const { category } = require("../consts/category");

const subsquid = {
  id: "subsquid",
  name: "SubSquid",
  summary:
    "Subsquid Network is a decentralized query engine optimized for batch extraction of large volumes of data. It currently serves historial on-chain data ingested from 100+ EVM and Substrate networks, including event logs, transaction receipts, traces and per-transaction state diffs.",
  creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
  category: category.data,
  links: ["https://subsquid.io/", "https://twitter.com/subsquid"],
  description: `This proposal has been put forward to cover for the infrastructure costs of running an indexing service for the community.

Subsquid is providing the community with access to on-chain data in the form of GraphQL gateways and it is doing it completely for free for the time being. Such endpoints are being used both as data sources for complex APIs and as an on-chain data exploration tool.
The purpose of the proposal is to ask for funds to cover the cost of running the infrastructure, given the utility they provide to the community.

Bear in mind that the linked raw data spreadsheet is taking into account both Polkadot and Kusama chains and parachains, but in the end the costs have been split proportionally to each chain's usage and the proposal presented here only covers the sum of Polkadot and related chains and parachains costs (a "twin" proposal has been created on Kusama Polkassembly for the remaining amount).

For any further information or doubts, please don't hesitate to reply here below.

Thank you for your consideration.
`,
  bannerCid: "bafybeigkhrkznc27yk6fm5o5fztuhxnldbug7knnkn5ktgzzpbrd7eocmq",
  logoCid: "bafybeiaa63d3abqdphxjsp5usewedtfm2txdvd2imz7xn6262ohdljqvfy",
  contributors: [],
};

module.exports = {
  subsquid,
};
