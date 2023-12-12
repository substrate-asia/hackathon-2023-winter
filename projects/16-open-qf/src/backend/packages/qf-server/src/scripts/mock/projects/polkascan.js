const { category } = require("../../../utils/consts/category");

const polkascan = {
  name: "Polkascan",
  summary:
    "Polkascan is a publicly available instance of a general-purpose open-source explorer that disseminates the highest granularity of data found on the Polkadot Ecosystem’s Relay Chains and supported Parachains.",
  creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
  category: category.explorer,
  links: ["https://explorer.polkascan.io/", "https://twitter.com/polkascan"],
  description: `Now, we aim to enhance the Polkascan Explorer by tapping into the rich data resource Subsquid offers, making the tool more powerful and user-friendly.

With the support we received from the Kusama community in a past voting event (#83), we've built an extension for our open source block explorer that allows us to connect with Subsquid, a service that makes data available from the Polkadot network that is not easy to query from a node.

We incorporated Subsquid's data into the Polkascan Explorer, which is an open source block explorer to track the activity happening on the Polkadot network, as well as other Substrate-based networks. Our software is open-source, meaning it's freely available for anyone to use, modify, and distribute. This is particularly beneficial for parachain teams looking to host and customize their own blockchain explorers. They can use our software as a foundational tool to build an explorer that caters specifically to their community's needs.

Now, these teams can choose where they get their data from: they can use data from existing API's hosted by Subsquid, use data they index themselves with the Polkascan API on their own machines, or use a combination of both for extra reliability.

Until now, we put in a lot of work to ensure that Subsquid's data could be used seamlessly with the existing features of our Polkascan Explorer. Meaning, no matter where you decide to get your data from, you'll have the same user experience.

But there is an opportunity - Subsquid has even more data available and plans to add even more valuable information in the future, including details about transfers made with Polkadot's cross-chain messaging service.

So, what we want to do now with this proposal is to take full advantage of all this extra data that Subsquid offers. We want to improve the Polkascan Explorer by making all of Subsquid's extensive data available through it, ultimately aiming to make the explorer a more powerful and user-friendly tool for every Substrate-based network.

## Here's what we have planned:

- Dashboard Enhancement. We want our dashboard to offer more than just a glimpse of the latest blocks and activities. We plan to add easy-to-understand descriptions and insights, like token distribution and inflation rates, enhancing the experience for both novice and advanced users.
- Validators and Staking Page. Find validators with ease on our new page that showcases all network validators, equipped with search and filter options.
- Calls Page. To give you a deeper understanding of network activities, we're adding a Calls page that lists individual calls, unavailable elsewhere, enhancing your data analysis capabilities.
- Making List Pages Understandable. We aim to declutter list pages by highlighting the most relevant info while giving power users the option to dive into technical details if they wish.
- More Identity Features. Discover accounts using on-chain registered identities, a feature bolstered by data from Subsquid.
- Search Bar Improvements. Enjoy a seamless search experience with a constantly available search bar that offers previews of your search results.
- Transfers and Rewards Pages. We're improving our pages to leverage Subsquid's specialized data lists for transfers and rewards, promising speed and efficiency.
- Combine Staking Events with Staking Calls. We're merging staking events and calls into one comprehensive view, giving you a complete picture of staking activities at a glance.
- Historical Balance. Track account balance changes effortlessly with our revamped chart that offers a broader perspective by showcasing daily or weekly data points.
- Technical improvements. Behind the scenes, we're fine-tuning our system to enhance data presentation and ensure smooth operation amidst changes in Subsquid's service architecture, including adapting to handle big numbers more effectively.

## Team & Planning

The team will consist of two part-time developers. We estimate a duration of 15 weeks of development work.
`,
  bannerCid: "bafybeibjj6j2gukjnrooliwrydfhdrhyjs2h47hzlgrdmkylph7bawttpe",
  logoCid: "bafybeiflalcgo4jzemxg2iabjr6eedhnyf37qksktymbm2kp2brcpwi5i4",
  contributors: [],
};

module.exports = {
  polkascan,
};
