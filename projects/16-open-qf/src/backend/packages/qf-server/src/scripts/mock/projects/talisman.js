const { category } = require("../consts/category");

const talisman = {
  id: "talisman",
  name: "Talisman",
  summary:
    "A user-friendly wallet built for Polkadot & Ethereum. The better way to explore Web3.",
  creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
  category: category.wallet,
  links: ["https://www.talisman.xyz/", "https://twitter.com/wearetalisman"],
  description: `Talisman is a community-owned wallet that enables users to “traverse the Paraverse” with ease. We believe in a future where everyone has freedom via true agency over their intentions and finances, and we believe that DotSama will bring this to fruition.

For more on Talisman, please see the following talks from Polkadot Decoded 2022: Agyle’s How Talisman is bringing multi-chain to the masses, as well as Jonathan's introduction to light clients in Talisman.

Today, because of its early stage of development and complex multi-chain architecture, both Polkadot and Kusama are changing rapidly and the user experience (UX) can be confusing for end users. It’s our goal to solve that using user experience design and storytelling. We abstract away the complexity of underlying implementation and provide a friendly user experience when using DotSama and a way to discover new applications and services available to end users, while keeping them safe and educated about the actions they are taking.

In this proposal, we are seeking to fund development of a cross-chain transaction history service for the benefit of users, parachains and applications. We believe this will be an advancement in usability and security for end users, as they will be able to more easily understand the actions they have taken across different parachains in DotSama. Parachains and applications that have a presence across multiple parachains will also have an easier way to show users their relevant actions.

We regularly gather customer feedback as we work to uncover difficulties customers have with Talisman and within DotSama. Here are what some users have told us about the need for better cross-chain transaction visibility:

- “Sometimes I don’t even know what assets I have. I do it the hard way, I have them all listed in p.js and I have to cycle through each of the projects to check my balances. When I check on sub.id everything loads, but sometimes locked tokens are missing. So I have to switch parachains, then visit each dapp to keep track.”
- "I would like to see my transaction history all in one place. This would be a huge help for example with my tax filings. Right now it's a real hassle."
- “I want to be able to see multichain assets across multiple parachains.”

Thank you everyone who has commented during the community feedback stage of this proposal. We have corresponded with everyone that has provided comments.
`,
  bannerCid: "bafybeifw6ibaf2p4jw5ryvge3goahejf2fk7hhqbtna3qyfxzqw5h75ski",
  logoCid: "bafybeib6bshjfcbbbyg3uw4hp5hmfmlqoju6hq6g3c54nylzksrri7tdka",
  contributors: [],
};

module.exports = {
  talisman,
};
