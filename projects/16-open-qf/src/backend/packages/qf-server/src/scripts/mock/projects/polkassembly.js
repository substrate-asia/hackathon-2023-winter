const { category } = require("../../../utils/consts/category");

const polkassembly = {
  name: "Polkassembly",
  summary:
    "Polkassembly is a governance forum for Polkadot & Kusama and all substrate chains!",
  creator: "13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC",
  donationAddress: "15VobmA4kybmJW6dLJ4Sd5YkdugqqeNcadTwtBfarvBuB6Ad",
  category: category.governance,
  links: ["https://polkassembly.io/", "https://twitter.com/polk_gov"],
  description: `Polkassembly is an integral part of Polkadot and Kusama governance.

This submission proposes a recurring payment (half yearly) as part of our social contract with the Polkadot & Kusama treasury to cover maintenance, operations and human resource costs for Polkassembly, including general maintenance, runtime upgrades changes and cloud/infrastructure cost.
We have transitioned to a half yearly method to improve on the scope of our deliverability and execute larger changes to our platform. This submission covers costs for Q3 & Q4 of 2023. The maintenance proposal alternates between Polkadot & Kusama treasury and we are requesting the Polkadot treasury to provide funds.

This recurring proposal aims to secure the continuous operation and sustainability of Polkassembly, a vital component of Polkadot and Kusama governance. To ensure the smooth functioning of Polkassembly, we request payments to cover essential expenses such as maintenance, operations, and human resources. The funds are allocated towards general maintenance, runtime upgrades, and infrastructure costs, guaranteeing the reliability and efficiency of Polkassembly.

## Attached below are key highlights of our proposal:

### Voting & Transparency Upgrades:

- Voting Details on Referendum (Live): Enhance the proposal page to show users' self vs. delegation vote split, detailed breakdown of delegators, and more.
- Vote History in Profile (Live): Display voting history in user profiles, including self vs. delegated votes.
- Reason for Voting (Live): Enable users to add voting reasons immediately after casting their votes.
- Vote Anonymously: Allow users to hide their identity while voting.
- Share reason for voting: Enable users to share voting reasons on social media.
- Unlocking token locks: Simplify unlocking locked tokens.

### New Features:

- AI Summary (Live): Provide a quick summary of proposals.
- Tooltip & Tipping: Allow users to tip others and view tipping history.
- Statistics: Display on-chain balances and user activity details.
- Micro Features: Enhancements to existing features.
- Markdown <> Rich Text Editor Support: Toggle between markdown and rich text editors.
- See more proposals: Recommend and display related proposals on detail pages.

### Partnerships:

- Moderation (Live): Enable Polkadot & Kusama forum moderators to moderate on Polkassembly.
- Polkasafe Integration: Utilize multisigs and proxies for governance interactions.

### Maintenance & Site-wide Migrations:

- Husky Setup: Implement Git pre-commit hooks for code quality.
- Redux setup & remove contexts: Optimize state management for performance and debugging.
- Remove Styled Components; implemented CSS modules: Refactor components to improve performance and eliminate - hydration errors.

### Additional Upgrades:

- Optimistic Updates: Improve user experience and speed for actions like reactions and comments.
- V2 DS & Routed APIs: Simplify and optimize APIs.
- Timeline UI upgrade: Enhance the timeline for on/off-chain events and proposal progress.
- Navigation bar: Improve visibility and accessibility.
- Open any profile: Allow viewing of any on-chain account.
- JSDoc: Provide documentation for functions to facilitate open-source contributions and development.

These upgrades aim to enhance user engagement, transparency, and the overall experience on Polkassembly while streamlining development and maintenance processes.
`,
  bannerCid: "bafybeih56atbgorfipdrdgufsvghohjkio3iadpbh4jywhdm3s3glmglae",
  logoCid: "bafybeiebkbxkhxsm7mcf7grsah4fogdikdpk6wvlzsixlukqa3p2zj4cri",
};

module.exports = {
  polkassembly,
};
