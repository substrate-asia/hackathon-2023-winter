const { category } = require("../../../utils/consts/category");

const smoldot = {
  name: "Smoldot",
  summary:
    "Smoldot is an alternative client of Substrate-based chains, including Polkadot.",
  creator: "15kgSF6oSMFeaN7xYAykihoyQFZLRu1cF5FaBdiSDHJ233H5",
  donationAddress: "138brKiwierdmvLz2m9kxq5MbmRFH6w34RbMh7vRXoXSAKLz",
  category: category.libs,
  links: ["https://github.com/smol-dot"],
  description: `As many of you might already know, smoldot is an alternative implementation of the Polkadot client focused on using as little CPU, memory, and bandwidth as possible. It can be embedded within a web page, and thus allow end users to connect directly to the Polkadot network.
If you have watched the recent Polkadot decoded conference, smoldot was mentioned in several talks, and Gavin Wood's roadmap overview emphasized the importance of light clients.
Smoldot is a critical component in order to properly fulfill the goal of building a decentralized blockchain. It is one of the most dynamic client-engineering-related projects.

You can find a link to smoldot's repository here: https://github.com/smol-dot/smoldot/

It must be emphasized that smoldot is not a prototype. It was initially started in December 2019 within Parity Technologies and has been financed through treasury proposals since February 2023. Since its inception, all of its goals have been fulfilled consistently and on relatively short time frames. It is robust and ready to be used in production.

This treasury proposal concerns the continuation of the financing of the development of smoldot.

You can find all the details of the proposal here: https://docs.google.com/document/d/1hXWsYPyvsF5KjU320hXseaoY4qxZ6TJLeZKt3WzcGEw/edit?usp=sharing
This document highlights the work that has been performed, and proposes new milestones for the upcoming quarter year.

Please let me know what you think in the comments.
`,
  bannerCid: "bafybeidiyza4ulzzqtiw3ryvjyeehtlnorkhkp4hsu5tudunnghvzujqz4",
  logoCid: "bafybeifbhb3zuulk4xshqqiinqy2uxoc62vrun3frypjktl5jha6clsa3m",
  contributors: [],
};

module.exports = {
  smoldot,
};
