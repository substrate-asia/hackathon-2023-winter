const { category } = require("../../../utils/consts/category");

const chopsticks = {
  name: "Chopsticks by Acala Network",
  summary: "Create parallel reality of your Substrate network.",
  creator: "12eWtdVxQ9ScYD9AzyMuSsX8B9iEikWtUGiirJ1YJtDCCuwu",
  donationAddress: "16dS95vdZ6DpvHobQ32YiUiDhYeNWV9KYny2QAUqSthBkX1y",
  category: category.libs,
  links: ["https://github.com/AcalaNetwork/chopsticks"],
  description: `Chopsticks is a testing client that enables 1-step creation of a mainnet replica of substrate-based network, for safely testing action and reviewing outcome. Projects can test new runtime, proposal actions, XCM, different configurations, dry run transactions, etc, to discover and eliminate issues before they arrive to the live network.

With Chopsticks, we are able to provide the tool needed to the community, and prevent issues that we see in the ecosystem.

This submission is to propose a retroactive payment by Polkadot Treasury to cover development costs incurred.

---

## Benefits of using Chopsticks

- Avoid mistakes by dry running actions
- Removing the need of maintaining multiple testnets, run as many fork networks as and when it is required
- Preview what to expect on a live network. e.g. :
- Runtime upgrade
- XCM transactions end to end testing
- Governance actions such as voting
- Submission and action of proposal
- Events happened during a block and review storage changed
- Scheduled events
- Try new features e.g. OpenGov and fellowship
- Update configurable components of network

## Chopsticks Features

- 1-step forking of a block producing Parachain or Relay Chain that are exactly the same as the production network
- Ability to fork and run multiple chains that support interactions such as XCM
- Configuration files to support:
- Overriding endpoint
- Overriding wasm
- Specify starting block
- Sudo
- Overriding (add/modify/delete) storage - e.g. fellowship member on forked Kusama, update token and account balance
- Submit transactions as another user
- Mock signature to simulate action by different users
- Replay a block and generate a storage diff

## Milestones

- Milestone 1 Done - Able to fork Acala mainnet and serving RPC endpoints to be useable with polkadot.js apps
- Milestone 2 Done - Optimizations & Improvements
- Milestone 3 Done - Support forking multiple chains and connect UMP/DMP/HRMP and support XCM

Future developments (Not included in this proposal) - Library mode and SDK to be developed for e2e tool, sdk and dApps such as wallet, extension, browser. Ability to fast forward blocks. Current target is to deliver these features in Q2 2023, but the schedule is subject to availability of resources.

To follow the latest news on Chopsticks, set Custom Watch on its Github repo to receive notifications on PRs, follow Acala and our CTO Bryan Chen on Twitter where new features or use cases will be shared.

For feature requests or discussions on current features, feel free to open a discussion on Polkadot Forum.

## Budget

Amount Requested
113,000 USD

Exchange Rate
Exchange rate of USD:DOT is the 7-day EMA by Subscan taken on the day of on-chain submission, and will be used to convert the amount requested above to DOT.

Payment
A one-off payment is requested to cover work already completed.

Human Resources and Cost
Technical Lead, Senior Engineer: $200/hr


---

Thank you for reading and questions are welcome. :)
`,
  bannerCid: "bafybeifseowcqivdayzsvhqyjcuafire2wrgudrdfoliek3sr3t7a7f2gm",
  logoCid: "bafybeibicx5krldhxhws2vc3i22dmu43rz7hxnh545r335v5evazkkvh3i",
  contributors: [],
};

module.exports = {
  chopsticks,
};
