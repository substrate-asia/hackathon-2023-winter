const { category } = require("../../../utils/consts/category");

const subwallet = {
  name: "SubWallet",
  summary:
    "A non-custodial Polkadot & Ethereum wallet. Available on browser extension, mobile app & web dashboard.",
  creator: "5CFktU1BC5sXSfs64PJ9vBVUGZp2ezpVRGUCjAXv7spRZR3W",
  donationAddress: "15ASYNVVbjR44YZCV34yzQk8ZyNoXZbNYvC4piLxa5LGY8s2",
  category: category.wallet,
  links: [
    "https://linktr.ee/subwallet.app",
    "https://www.subwallet.app/",
    "https://twitter.com/subwalletapp",
  ],
  description: `SubWallet team started building in November 2021 and we have been very focused and building fast since then. We released the SubWallet extension version on all popular browsers (Google Chrome, Firefox, Brave, Edge) in February 2022 and keep releasing our product updates on a bi-weekly basis.

While using the browser extension, our community constantly asked about a more convenient mobile app, which can provide them with a homogenous wallet experience in the whole Polkadot & Kusama ecosystem, and we listened. At the moment, there hasn’t been a native wallet on the Polkadot & Kusama ecosystem that offers this comprehensive and consistent multi-platform experience from Extension through to Mobile to users. That is why we decided to start building the SubWallet Mobile App.

This is SubWallet Mobile App's 1st proposal for Milestone 1 - 20 Weeks

## Full proposal for Milestone 1 with a detailed description, costs, tractions, and future plans

- Mobile App Architecture Design
- React Native Core Module (Android & iOS)
- Basic React Native Element (Android & iOS)
- Basic Features: Account Management, Send & Receive Assets, XCM Transfer,... (Android & iOS)
- NFT Feature: Display, Send (Android & iOS)
- Crowdloan Feature (Android & iOS)
- Staking Feature (Android & iOS)
- In-App Browser (Android & iOS)
- Performance Optimization (Android & iOS)

## Our tractions

- 80+ networks supported (relaychains, parachains & solochains) in the Polkadot & Kusama ecosystem
- Browser extension: 32,000+ organic installs on Chrome Store & Firefox Store.
- The mobile app is in the public testing phase on both iOS and Android. + 3,000 installs
- Our users come from 80+ countries.
- 8000+ community members on Twitter, Telegram, and Discord
- A member of the Substrate Builders Program
- Working with 100+ teams in the ecosystem with the ultimate goal of bringing the best UI/UX for users.

We would love to hear feedback/recommendations from the community.
`,
  bannerCid: "bafybeiae5atns5bdszlvlht3pbvnpzqufcqhpx72utwnybtvczxw2bid5i",
  logoCid: "bafybeihskoeeejs4gia3bizo5bfqg5fxogifoiqcdzjubb4yfelx6pvkvu",
  contributors: [],
};

module.exports = {
  subwallet,
};
