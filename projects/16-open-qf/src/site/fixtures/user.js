export const ADDRESS = "ESgz7GLVW7BL5DhRgpVnxSXVwaKt4ytWcrf52TY1GQD1cEb";

export const USER_INFO = {
  address: ADDRESS,
  contributions: {
    contributions: 5,
    value: "102099",
  },
  project: {
    proposed: 3,
    contributors: 24,
    received: "102099",
  },
};

export const USER_POWER = {
  score: 49,
};

export const USER_QFPOWER_ACTIVITIES = [
  {
    label: "Fellowship Member",
    power: 10,
  },
  {
    label: "Active OpenGov Participant",
    power: 4,
  },
  {
    label: "something cave bad",
    power: 8,
  },
  {
    label: "complete perfect forest",
    power: 8,
  },
  {
    label: "last usual pan",
    power: 8,
  },
  {
    label: "flag note keep",
    power: 8,
  },
  {
    label: "is porch village",
    power: 8,
  },
];

export const USER_CONTRIBUTIONS_RESULT = {
  items: [
    {
      id: 12,
      roundId: 1,
      name: "Smoldot",
      summary:
        "Smoldot is an alternative client of Substrate-based chains, including Polkadot.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Libs",
      links: ["https://github.com/smol-dot"],
      description:
        "As many of you might already know, smoldot is an alternative implementation of the Polkadot client focused on using as little CPU, memory, and bandwidth as possible. It can be embedded within a web page, and thus allow end users to connect directly to the Polkadot network.\nIf you have watched the recent Polkadot decoded conference, smoldot was mentioned in several talks, and Gavin Wood's roadmap overview emphasized the importance of light clients.\nSmoldot is a critical component in order to properly fulfill the goal of building a decentralized blockchain. It is one of the most dynamic client-engineering-related projects.\n\nYou can find a link to smoldot's repository here: https://github.com/smol-dot/smoldot/\n\nIt must be emphasized that smoldot is not a prototype. It was initially started in December 2019 within Parity Technologies and has been financed through treasury proposals since February 2023. Since its inception, all of its goals have been fulfilled consistently and on relatively short time frames. It is robust and ready to be used in production.\n\nThis treasury proposal concerns the continuation of the financing of the development of smoldot.\n\nYou can find all the details of the proposal here: https://docs.google.com/document/d/1hXWsYPyvsF5KjU320hXseaoY4qxZ6TJLeZKt3WzcGEw/edit?usp=sharing\nThis document highlights the work that has been performed, and proposes new milestones for the upcoming quarter year.\n\nPlease let me know what you think in the comments.\n",
      bannerCid: "bafybeidiyza4ulzzqtiw3ryvjyeehtlnorkhkp4hsu5tudunnghvzujqz4",
      logoCid: "bafybeifbhb3zuulk4xshqqiinqy2uxoc62vrun3frypjktl5jha6clsa3m",
      contributors: [],
    },
    {
      id: 11,
      roundId: 1,
      name: "Chopsticks by Acala Network",
      summary: "Create parallel reality of your Substrate network.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Libs",
      links: ["https://github.com/AcalaNetwork/chopsticks"],
      description:
        "Chopsticks is a testing client that enables 1-step creation of a mainnet replica of substrate-based network, for safely testing action and reviewing outcome. Projects can test new runtime, proposal actions, XCM, different configurations, dry run transactions, etc, to discover and eliminate issues before they arrive to the live network.\n\nWith Chopsticks, we are able to provide the tool needed to the community, and prevent issues that we see in the ecosystem.\n\nThis submission is to propose a retroactive payment by Polkadot Treasury to cover development costs incurred.\n\n---\n\n## Benefits of using Chopsticks\n\n- Avoid mistakes by dry running actions\n- Removing the need of maintaining multiple testnets, run as many fork networks as and when it is required\n- Preview what to expect on a live network. e.g. :\n- Runtime upgrade\n- XCM transactions end to end testing\n- Governance actions such as voting\n- Submission and action of proposal\n- Events happened during a block and review storage changed\n- Scheduled events\n- Try new features e.g. OpenGov and fellowship\n- Update configurable components of network\n\n## Chopsticks Features\n\n- 1-step forking of a block producing Parachain or Relay Chain that are exactly the same as the production network\n- Ability to fork and run multiple chains that support interactions such as XCM\n- Configuration files to support:\n- Overriding endpoint\n- Overriding wasm\n- Specify starting block\n- Sudo\n- Overriding (add/modify/delete) storage - e.g. fellowship member on forked Kusama, update token and account balance\n- Submit transactions as another user\n- Mock signature to simulate action by different users\n- Replay a block and generate a storage diff\n\n## Milestones\n\n- Milestone 1 Done - Able to fork Acala mainnet and serving RPC endpoints to be useable with polkadot.js apps\n- Milestone 2 Done - Optimizations & Improvements\n- Milestone 3 Done - Support forking multiple chains and connect UMP/DMP/HRMP and support XCM\n\nFuture developments (Not included in this proposal) - Library mode and SDK to be developed for e2e tool, sdk and dApps such as wallet, extension, browser. Ability to fast forward blocks. Current target is to deliver these features in Q2 2023, but the schedule is subject to availability of resources.\n\nTo follow the latest news on Chopsticks, set Custom Watch on its Github repo to receive notifications on PRs, follow Acala and our CTO Bryan Chen on Twitter where new features or use cases will be shared.\n\nFor feature requests or discussions on current features, feel free to open a discussion on Polkadot Forum.\n\n## Budget\n\nAmount Requested\n113,000 USD\n\nExchange Rate\nExchange rate of USD:DOT is the 7-day EMA by Subscan taken on the day of on-chain submission, and will be used to convert the amount requested above to DOT.\n\nPayment\nA one-off payment is requested to cover work already completed.\n\nHuman Resources and Cost\nTechnical Lead, Senior Engineer: $200/hr\n\n\n---\n\nThank you for reading and questions are welcome. :)\n",
      bannerCid: "bafybeifseowcqivdayzsvhqyjcuafire2wrgudrdfoliek3sr3t7a7f2gm",
      logoCid: "bafybeibicx5krldhxhws2vc3i22dmu43rz7hxnh545r335v5evazkkvh3i",
      contributors: [],
    },
    {
      id: 10,
      roundId: 1,
      name: "SubSquid",
      summary:
        "Subsquid Network is a decentralized query engine optimized for batch extraction of large volumes of data. It currently serves historial on-chain data ingested from 100+ EVM and Substrate networks, including event logs, transaction receipts, traces and per-transaction state diffs.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Data",
      links: ["https://subsquid.io/", "https://twitter.com/subsquid"],
      description:
        "This proposal has been put forward to cover for the infrastructure costs of running an indexing service for the community.\n\nSubsquid is providing the community with access to on-chain data in the form of GraphQL gateways and it is doing it completely for free for the time being. Such endpoints are being used both as data sources for complex APIs and as an on-chain data exploration tool.\nThe purpose of the proposal is to ask for funds to cover the cost of running the infrastructure, given the utility they provide to the community.\n\nBear in mind that the linked raw data spreadsheet is taking into account both Polkadot and Kusama chains and parachains, but in the end the costs have been split proportionally to each chain's usage and the proposal presented here only covers the sum of Polkadot and related chains and parachains costs (a \"twin\" proposal has been created on Kusama Polkassembly for the remaining amount).\n\nFor any further information or doubts, please don't hesitate to reply here below.\n\nThank you for your consideration.\n",
      bannerCid: "bafybeigkhrkznc27yk6fm5o5fztuhxnldbug7knnkn5ktgzzpbrd7eocmq",
      logoCid: "bafybeiaa63d3abqdphxjsp5usewedtfm2txdvd2imz7xn6262ohdljqvfy",
      contributors: [],
    },
    {
      id: 9,
      roundId: 1,
      name: "SubQuery",
      summary:
        "SubQuery is a fast, flexible, and reliable open-source data indexer that provides you with custom APIs for your web3 project across all of our supported chains.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Data",
      links: [
        "https://linktr.ee/subquerynetwork",
        "https://subquery.network/home",
        "https://twitter.com/SubQueryNetwork",
      ],
      description:
        'SubQuery is the Universal data indexing toolkit facilitating the construction of Web3 applications of the future. This proposal seeks funding to cover expenses associated with maintaining the SubQuery <> Nova Wallet Common API infrastructure in Q1-Q2 2023.\n\n---\n\nRequested allocation: 46,122.04 USD\nProject Category / Type: Infrastructure and Network Operations\n\n---\n\nIn continuation of our commitment to fostering the growth and development of the Polkadot ecosystem, we present a treasury proposal for Q1-Q2 2023 to fund the reimbursement of the costs for running the SubQuery Common API infrastructure. The SubQuery Common API has proven to be an invaluable tool for client applications, enabling seamless access to pre-indexed data that would otherwise be resource-consuming or challenging to query directly from the blockchain, such as operation history, staking analytics, and more.\n\nThe partnership between SubQuery and Nova has flourished over time, exemplifying a collaborative spirit that has enhanced the Polkadot ecosystem. Notably, Nova Wallet has seamlessly integrated support for the public SubQuery projects, specifically tailoring them to index transfers from both the "assets" and "ORML" pallets, as well as providing Staking & OpenGov data. This innovative integration has enabled easy access and querying of this vital data not only for Nova Wallet but also for any stakeholders within the ecosystem. Whether utilizing the free hosted projects or by running the relevant SubQuery project locally, the ability to glean insights from transfers across parachains has become both accessible and efficient.\n\nThis proposal outlines the infrastructure costs incurred for Q1-Q2 2023 that have played an instrumental role in ensuring the availability and accessibility of invaluable data to the Polkadot community. This symbiotic relationship, wherein SubQuery charges Nova for hosting services, signifies the collaborative synergy propelling this initiative and setting a path for future funding requests initiated by the SubQuery team themselves.\n\nSubQuery’s Common Good API features:\n\n- Supports 74 Substrate-based networks of Polkadot & Kusama ecosystem\n- The Nova Wallet SubQuery projects are grouped based on the following supported features, each using a standard API:\n- Operation History: Transfers and Extrinsics for Utility (main) token of the network\n- Multi-asset transfers: Support for transfer history for tokens from ORML and Assets pallets\n- Staking rewards: Rewards history and accumulated total rewards, support both Staking and ParachainStaking pallets\n- Staking analytics: Queries for a current stake, validators statistics, and stake change history\n- OpenGov: Queries for Aye/Nay votes, agile delegations\n- Multistaking: Queries for gettings total rewards, APY/APR, stake and status simultaneously across all supported networks\n- Hosted on SubQuery infrastructure by Novasama Technologies:\nLink: https://api.novasama.io/\n- Developed & maintained by Novasama Technologies, available in open source:\n- Operation history: https://github.com/novasamatech/subquery-nova\n- OpenGov: https://github.com/novasamatech/subquery-governance\n- Multistaking: https://github.com/novasamatech/subquery-staking\n- The SubQuery Common API extends its accessibility to a wide array of teams and projects. Notable examples of those leveraging the capabilities of the SubQuery Common API include:\n- Nova Wallet: https://novawallet.io/ (full integration)\n- SubWallet: https://subwallet.app/ (full integration till January 2023, partial till today)\n- Variety of different individual projects based on data from SubQuery\n',
      bannerCid: "bafybeif25u7wshxzd5dmbnwtqk7i4fvfh4u66xry66gffc4rt7yb5p7gmy",
      logoCid: "bafybeibu5t45ofqnhela5tk3zyr4hdyddswbcoa637bwcew2sucmerhfla",
      contributors: [],
    },
    {
      id: 8,
      roundId: 1,
      name: "Polkassembly",
      summary:
        "Polkassembly is a governance forum for Polkadot & Kusama and all substrate chains!",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Governance",
      links: ["https://polkassembly.io/", "https://twitter.com/polk_gov"],
      description:
        "Polkassembly is an integral part of Polkadot and Kusama governance.\n\nThis submission proposes a recurring payment (half yearly) as part of our social contract with the Polkadot & Kusama treasury to cover maintenance, operations and human resource costs for Polkassembly, including general maintenance, runtime upgrades changes and cloud/infrastructure cost.\nWe have transitioned to a half yearly method to improve on the scope of our deliverability and execute larger changes to our platform. This submission covers costs for Q3 & Q4 of 2023. The maintenance proposal alternates between Polkadot & Kusama treasury and we are requesting the Polkadot treasury to provide funds.\n\nThis recurring proposal aims to secure the continuous operation and sustainability of Polkassembly, a vital component of Polkadot and Kusama governance. To ensure the smooth functioning of Polkassembly, we request payments to cover essential expenses such as maintenance, operations, and human resources. The funds are allocated towards general maintenance, runtime upgrades, and infrastructure costs, guaranteeing the reliability and efficiency of Polkassembly.\n\n## Attached below are key highlights of our proposal:\n\n### Voting & Transparency Upgrades:\n\n- Voting Details on Referendum (Live): Enhance the proposal page to show users' self vs. delegation vote split, detailed breakdown of delegators, and more.\n- Vote History in Profile (Live): Display voting history in user profiles, including self vs. delegated votes.\n- Reason for Voting (Live): Enable users to add voting reasons immediately after casting their votes.\n- Vote Anonymously: Allow users to hide their identity while voting.\n- Share reason for voting: Enable users to share voting reasons on social media.\n- Unlocking token locks: Simplify unlocking locked tokens.\n\n### New Features:\n\n- AI Summary (Live): Provide a quick summary of proposals.\n- Tooltip & Tipping: Allow users to tip others and view tipping history.\n- Statistics: Display on-chain balances and user activity details.\n- Micro Features: Enhancements to existing features.\n- Markdown <> Rich Text Editor Support: Toggle between markdown and rich text editors.\n- See more proposals: Recommend and display related proposals on detail pages.\n\n### Partnerships:\n\n- Moderation (Live): Enable Polkadot & Kusama forum moderators to moderate on Polkassembly.\n- Polkasafe Integration: Utilize multisigs and proxies for governance interactions.\n\n### Maintenance & Site-wide Migrations:\n\n- Husky Setup: Implement Git pre-commit hooks for code quality.\n- Redux setup & remove contexts: Optimize state management for performance and debugging.\n- Remove Styled Components; implemented CSS modules: Refactor components to improve performance and eliminate - hydration errors.\n\n### Additional Upgrades:\n\n- Optimistic Updates: Improve user experience and speed for actions like reactions and comments.\n- V2 DS & Routed APIs: Simplify and optimize APIs.\n- Timeline UI upgrade: Enhance the timeline for on/off-chain events and proposal progress.\n- Navigation bar: Improve visibility and accessibility.\n- Open any profile: Allow viewing of any on-chain account.\n- JSDoc: Provide documentation for functions to facilitate open-source contributions and development.\n\nThese upgrades aim to enhance user engagement, transparency, and the overall experience on Polkassembly while streamlining development and maintenance processes.\n",
      bannerCid: "bafybeih56atbgorfipdrdgufsvghohjkio3iadpbh4jywhdm3s3glmglae",
      logoCid: "bafybeiebkbxkhxsm7mcf7grsah4fogdikdpk6wvlzsixlukqa3p2zj4cri",
      contributors: [],
    },
    {
      id: 7,
      roundId: 1,
      name: "SubSquare",
      summary:
        "A governance platform for substrate based chains. SubSquare enables community members to propose, discuss and vote on governance proposals.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Governance",
      links: [
        "https://www.subsquare.io/",
        "https://polkadot.subsquare.io/",
        "https://kusama.subsquare.io/",
      ],
      description:
        "Beneficiary: OpenSquare\nRequested Allocation: $48,320\n\n---\n\n## Subsquare enhancement features\n\n- Democracy public proposal second multiplier. With this feature, we can second a public proposal multiple times in a batch call.\n- Add search box to support google in-site search. We also refactored the whole header components and improved the logos.\n- Nested comments. Currently we support comment to comments, not comment to comment of comments.\n- Support collective(council/tech comm motion) closing action.\n\n## Subsquare new features plan\n\n### Governance statistics\n\nWe have more than 260 democracy referenda on Kusama, and more than 160 referenda on OpenGov. Though we show votes detail on each referendum detail page and simple summary data, more statistics will help us to analyze how governance models work. We plan to implement the following governance statistics.\n\nFor OpenGov tracks comparison:\n\n- To get the popularity of different tracks, we will create a pie chart to show the referendum count by tracks.\n- There will be a chart to show delegation data of different tracks, and delegation data will includes:\n- Total delegation capital.\n- Total delegation votes(post-conviction value).\n- Total delegator address count.\n- Total delegatee address count.\n- To compare turnout percentage between tracks, there will be a chart to show the average turnout percentage and we can easily see which track has the highest voting turnout.\n\nFor OpenGov each track and democracy referenda:\n\n- Show delegation rankings:\n- Delegators ranking which can be sorted by capital(without conviction) or votes(with conviction).\n- Delegatee ranks which can be sorted by delegators count, capital or votes.\n- Show votes participating trends, including:\n- The total votes value trend.\n- The total capital(votes without conviction) trend.\n- The votes/capital trend without delegation.\n- The vote address counts trend with/without delegation.\n- Show turnout percentage trend by referenda.\n\nEach referendum data view enhancement\n\n- Currently we have votes list which shows direct votes and delegated votes, but we can not see which voter has the most impact. We will provide a view to show the direct voter ranked by the total affected balance(self balance + delegation balance) and delegation addresses details.\n- Components will be developed to show ratios between delegations and direct votes balances, addresses.\n\nDemocracy statistics\n\n- Show votes participation trend by democracy referenda.\n- Show delegation rankings similar to OpenGov track.\n- Show turnout percentage trend by democracy referenda.\n\nUser governance participation\n\nUser votes activities\n\nCurrently on users' profile page, we can see various proposed proposals by the user. They are not enough to show all users' governance participation. The activities we'd plan to add including:\n\n- OpenGov referendum vote records including casting vote or delegation votes.\n- OpenGov fellowship referendum vote records.\n- Democracy referendum vote records including drect vote or delegation votes.\n- Democracy public proposal second records.\n- Collectives(council/Tech Comm) vote records.\n\nUser votes management\n\nIt's a problem that we usually forget which referendum we have voted, and it's troublesome to query them and remove them before we can transfer the locked balances. We propose to implement interfaces for users to manage the votes.\n\n- It will be for both democracy and OpenGov referenda.\n- Users should be able to see a list of votes which may be for ongoing or finished referenda.\n- On the interfaces users should be able to see whether the referenda are finished, so they won't remove the votes of ongoing referenda.\n- Users should be able to see the lock period of finished referenda votes, and there will be countdown components, so users will know which referenda votes are closeable.\n\n## Subsquare new design\n\nMany community members have expressed their positive comments about subsquare's UI&UX. We never stop our work for better design, and we propose to implement our new design which we believe will bring users better experiences. The new design has improvements in the following aspects.\n\n- The navigation menu will be a left sidebar style, always accessible.\n- Following the polkadot icon set, we redesigned icons.\n- On the proposal detail page, content card style is abandoned, font size is improved, and width of content area is expanded.\n- Improve page responsiveness support.\n- Improve customizability. Customizable items include menu background color, button color, logo, etc.\n\n## Other enhancement features\n\n- Democracy vote extrinsics. We implemented this for OpenGov, and it's good for users to know the direct vote history. We propose to implement this for democracy too.\n- Support upload images directly with subsquare editors. Currently users can only use image links to edit their content. We will support users to drag images to subsquare editors to upload images like what can be done with github editor.\n- Preimages page on which we can see all the submitted preimages and the correlated referenda.\n- OpenGov referenda preparing phase visualization enhancement. Currently we have a UI for the decision and confirmation phase, but not so good for the preparation phase.\n- Support users placing OpenGov referendum decision deposits.\n- Allow users to mark any discussion/proposal post as a scam.\n",
      bannerCid: "bafybeibddhrymw56omwsj22cbwzbxhb2355xyha35u5sqoyn5tvoyrr63y",
      logoCid: "bafybeicwoec2onzrh72gvo6y6huz4nkhdoc3ujiizhax5ejkbjupdc4a3u",
      contributors: [],
    },
    {
      id: 6,
      roundId: 1,
      name: "SubWallet",
      summary:
        "A non-custodial Polkadot & Ethereum wallet. Available on browser extension, mobile app & web dashboard.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Wallet",
      links: [
        "https://linktr.ee/subwallet.app",
        "https://www.subwallet.app/",
        "https://twitter.com/subwalletapp",
      ],
      description:
        "SubWallet team started building in November 2021 and we have been very focused and building fast since then. We released the SubWallet extension version on all popular browsers (Google Chrome, Firefox, Brave, Edge) in February 2022 and keep releasing our product updates on a bi-weekly basis.\n\nWhile using the browser extension, our community constantly asked about a more convenient mobile app, which can provide them with a homogenous wallet experience in the whole Polkadot & Kusama ecosystem, and we listened. At the moment, there hasn’t been a native wallet on the Polkadot & Kusama ecosystem that offers this comprehensive and consistent multi-platform experience from Extension through to Mobile to users. That is why we decided to start building the SubWallet Mobile App.\n\nThis is SubWallet Mobile App's 1st proposal for Milestone 1 - 20 Weeks\n\n## Full proposal for Milestone 1 with a detailed description, costs, tractions, and future plans\n\n- Mobile App Architecture Design\n- React Native Core Module (Android & iOS)\n- Basic React Native Element (Android & iOS)\n- Basic Features: Account Management, Send & Receive Assets, XCM Transfer,... (Android & iOS)\n- NFT Feature: Display, Send (Android & iOS)\n- Crowdloan Feature (Android & iOS)\n- Staking Feature (Android & iOS)\n- In-App Browser (Android & iOS)\n- Performance Optimization (Android & iOS)\n\n## Our tractions\n\n- 80+ networks supported (relaychains, parachains & solochains) in the Polkadot & Kusama ecosystem\n- Browser extension: 32,000+ organic installs on Chrome Store & Firefox Store.\n- The mobile app is in the public testing phase on both iOS and Android. + 3,000 installs\n- Our users come from 80+ countries.\n- 8000+ community members on Twitter, Telegram, and Discord\n- A member of the Substrate Builders Program\n- Working with 100+ teams in the ecosystem with the ultimate goal of bringing the best UI/UX for users.\n\nWe would love to hear feedback/recommendations from the community.\n",
      bannerCid: "bafybeiae5atns5bdszlvlht3pbvnpzqufcqhpx72utwnybtvczxw2bid5i",
      logoCid: "bafybeihskoeeejs4gia3bizo5bfqg5fxogifoiqcdzjubb4yfelx6pvkvu",
      contributors: [],
    },
    {
      id: 5,
      roundId: 1,
      name: "Nova Wallet",
      summary: "Next-gen iOS/Android app for Polkadot & Kusam eco.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Wallet",
      links: ["https://novawallet.io/", "https://twitter.com/NovaWalletApp"],
      description:
        "## Leading mobile application for Polkadot ecosystem\n\nExecution estimate: 5 months\nRequested allocation: 125 484 DOT | 621 400 USD\n\n## Description\n\n- Cloud backups and Updated onboarding\n- Push Notifications\n- Proxy (Delegated to you) wallets\n- OpenGov improvements\n- Network management and optimization\n- Deeplinks & Applinks integration\n- Reimbursement for delivered features\n",
      bannerCid: "bafybeifgnmpcalzyjw6nzh25krvfmns4uevmls6vzzb4jxja2cgo6kjcqm",
      logoCid: "bafybeifqcjkb7p2fnxarnq76cbpjf64ghcqntczhfomzachw736vug3eny",
      contributors: [],
    },
    {
      id: 4,
      roundId: 1,
      name: "Talisman",
      summary:
        "A user-friendly wallet built for Polkadot & Ethereum. The better way to explore Web3.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Wallet",
      links: ["https://www.talisman.xyz/", "https://twitter.com/wearetalisman"],
      description:
        "Talisman is a community-owned wallet that enables users to “traverse the Paraverse” with ease. We believe in a future where everyone has freedom via true agency over their intentions and finances, and we believe that DotSama will bring this to fruition.\n\nFor more on Talisman, please see the following talks from Polkadot Decoded 2022: Agyle’s How Talisman is bringing multi-chain to the masses, as well as Jonathan's introduction to light clients in Talisman.\n\nToday, because of its early stage of development and complex multi-chain architecture, both Polkadot and Kusama are changing rapidly and the user experience (UX) can be confusing for end users. It’s our goal to solve that using user experience design and storytelling. We abstract away the complexity of underlying implementation and provide a friendly user experience when using DotSama and a way to discover new applications and services available to end users, while keeping them safe and educated about the actions they are taking.\n\nIn this proposal, we are seeking to fund development of a cross-chain transaction history service for the benefit of users, parachains and applications. We believe this will be an advancement in usability and security for end users, as they will be able to more easily understand the actions they have taken across different parachains in DotSama. Parachains and applications that have a presence across multiple parachains will also have an easier way to show users their relevant actions.\n\nWe regularly gather customer feedback as we work to uncover difficulties customers have with Talisman and within DotSama. Here are what some users have told us about the need for better cross-chain transaction visibility:\n\n- “Sometimes I don’t even know what assets I have. I do it the hard way, I have them all listed in p.js and I have to cycle through each of the projects to check my balances. When I check on sub.id everything loads, but sometimes locked tokens are missing. So I have to switch parachains, then visit each dapp to keep track.”\n- \"I would like to see my transaction history all in one place. This would be a huge help for example with my tax filings. Right now it's a real hassle.\"\n- “I want to be able to see multichain assets across multiple parachains.”\n\nThank you everyone who has commented during the community feedback stage of this proposal. We have corresponded with everyone that has provided comments.\n",
      bannerCid: "bafybeifw6ibaf2p4jw5ryvge3goahejf2fk7hhqbtna3qyfxzqw5h75ski",
      logoCid: "bafybeib6bshjfcbbbyg3uw4hp5hmfmlqoju6hq6g3c54nylzksrri7tdka",
      contributors: [],
    },
    {
      id: 3,
      roundId: 1,
      name: "Polkascan",
      summary:
        "Polkascan is a publicly available instance of a general-purpose open-source explorer that disseminates the highest granularity of data found on the Polkadot Ecosystem’s Relay Chains and supported Parachains.",
      creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
      category: "Explorer",
      links: [
        "https://explorer.polkascan.io/",
        "https://twitter.com/polkascan",
      ],
      description:
        "Now, we aim to enhance the Polkascan Explorer by tapping into the rich data resource Subsquid offers, making the tool more powerful and user-friendly.\n\nWith the support we received from the Kusama community in a past voting event (#83), we've built an extension for our open source block explorer that allows us to connect with Subsquid, a service that makes data available from the Polkadot network that is not easy to query from a node.\n\nWe incorporated Subsquid's data into the Polkascan Explorer, which is an open source block explorer to track the activity happening on the Polkadot network, as well as other Substrate-based networks. Our software is open-source, meaning it's freely available for anyone to use, modify, and distribute. This is particularly beneficial for parachain teams looking to host and customize their own blockchain explorers. They can use our software as a foundational tool to build an explorer that caters specifically to their community's needs.\n\nNow, these teams can choose where they get their data from: they can use data from existing API's hosted by Subsquid, use data they index themselves with the Polkascan API on their own machines, or use a combination of both for extra reliability.\n\nUntil now, we put in a lot of work to ensure that Subsquid's data could be used seamlessly with the existing features of our Polkascan Explorer. Meaning, no matter where you decide to get your data from, you'll have the same user experience.\n\nBut there is an opportunity - Subsquid has even more data available and plans to add even more valuable information in the future, including details about transfers made with Polkadot's cross-chain messaging service.\n\nSo, what we want to do now with this proposal is to take full advantage of all this extra data that Subsquid offers. We want to improve the Polkascan Explorer by making all of Subsquid's extensive data available through it, ultimately aiming to make the explorer a more powerful and user-friendly tool for every Substrate-based network.\n\n## Here's what we have planned:\n\n- Dashboard Enhancement. We want our dashboard to offer more than just a glimpse of the latest blocks and activities. We plan to add easy-to-understand descriptions and insights, like token distribution and inflation rates, enhancing the experience for both novice and advanced users.\n- Validators and Staking Page. Find validators with ease on our new page that showcases all network validators, equipped with search and filter options.\n- Calls Page. To give you a deeper understanding of network activities, we're adding a Calls page that lists individual calls, unavailable elsewhere, enhancing your data analysis capabilities.\n- Making List Pages Understandable. We aim to declutter list pages by highlighting the most relevant info while giving power users the option to dive into technical details if they wish.\n- More Identity Features. Discover accounts using on-chain registered identities, a feature bolstered by data from Subsquid.\n- Search Bar Improvements. Enjoy a seamless search experience with a constantly available search bar that offers previews of your search results.\n- Transfers and Rewards Pages. We're improving our pages to leverage Subsquid's specialized data lists for transfers and rewards, promising speed and efficiency.\n- Combine Staking Events with Staking Calls. We're merging staking events and calls into one comprehensive view, giving you a complete picture of staking activities at a glance.\n- Historical Balance. Track account balance changes effortlessly with our revamped chart that offers a broader perspective by showcasing daily or weekly data points.\n- Technical improvements. Behind the scenes, we're fine-tuning our system to enhance data presentation and ensure smooth operation amidst changes in Subsquid's service architecture, including adapting to handle big numbers more effectively.\n\n## Team & Planning\n\nThe team will consist of two part-time developers. We estimate a duration of 15 weeks of development work.\n",
      bannerCid: "bafybeibjj6j2gukjnrooliwrydfhdrhyjs2h47hzlgrdmkylph7bawttpe",
      logoCid: "bafybeiflalcgo4jzemxg2iabjr6eedhnyf37qksktymbm2kp2brcpwi5i4",
      contributors: [],
    },
  ],
  page: 0,
  pageSize: 10,
  total: 12,
};
