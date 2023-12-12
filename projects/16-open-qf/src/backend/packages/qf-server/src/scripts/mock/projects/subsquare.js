const { category } = require("../consts/category");

const subsquare = {
  name: "SubSquare",
  summary:
    "A governance platform for substrate based chains. SubSquare enables community members to propose, discuss and vote on governance proposals.",
  creator: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
  category: category.governance,
  links: [
    "https://www.subsquare.io/",
    "https://polkadot.subsquare.io/",
    "https://kusama.subsquare.io/",
  ],
  description: `Beneficiary: OpenSquare
Requested Allocation: $48,320

---

## Subsquare enhancement features

- Democracy public proposal second multiplier. With this feature, we can second a public proposal multiple times in a batch call.
- Add search box to support google in-site search. We also refactored the whole header components and improved the logos.
- Nested comments. Currently we support comment to comments, not comment to comment of comments.
- Support collective(council/tech comm motion) closing action.

## Subsquare new features plan

### Governance statistics

We have more than 260 democracy referenda on Kusama, and more than 160 referenda on OpenGov. Though we show votes detail on each referendum detail page and simple summary data, more statistics will help us to analyze how governance models work. We plan to implement the following governance statistics.

For OpenGov tracks comparison:

- To get the popularity of different tracks, we will create a pie chart to show the referendum count by tracks.
- There will be a chart to show delegation data of different tracks, and delegation data will includes:
- Total delegation capital.
- Total delegation votes(post-conviction value).
- Total delegator address count.
- Total delegatee address count.
- To compare turnout percentage between tracks, there will be a chart to show the average turnout percentage and we can easily see which track has the highest voting turnout.

For OpenGov each track and democracy referenda:

- Show delegation rankings:
- Delegators ranking which can be sorted by capital(without conviction) or votes(with conviction).
- Delegatee ranks which can be sorted by delegators count, capital or votes.
- Show votes participating trends, including:
- The total votes value trend.
- The total capital(votes without conviction) trend.
- The votes/capital trend without delegation.
- The vote address counts trend with/without delegation.
- Show turnout percentage trend by referenda.

Each referendum data view enhancement

- Currently we have votes list which shows direct votes and delegated votes, but we can not see which voter has the most impact. We will provide a view to show the direct voter ranked by the total affected balance(self balance + delegation balance) and delegation addresses details.
- Components will be developed to show ratios between delegations and direct votes balances, addresses.

Democracy statistics

- Show votes participation trend by democracy referenda.
- Show delegation rankings similar to OpenGov track.
- Show turnout percentage trend by democracy referenda.

User governance participation

User votes activities

Currently on users' profile page, we can see various proposed proposals by the user. They are not enough to show all users' governance participation. The activities we'd plan to add including:

- OpenGov referendum vote records including casting vote or delegation votes.
- OpenGov fellowship referendum vote records.
- Democracy referendum vote records including drect vote or delegation votes.
- Democracy public proposal second records.
- Collectives(council/Tech Comm) vote records.

User votes management

It's a problem that we usually forget which referendum we have voted, and it's troublesome to query them and remove them before we can transfer the locked balances. We propose to implement interfaces for users to manage the votes.

- It will be for both democracy and OpenGov referenda.
- Users should be able to see a list of votes which may be for ongoing or finished referenda.
- On the interfaces users should be able to see whether the referenda are finished, so they won't remove the votes of ongoing referenda.
- Users should be able to see the lock period of finished referenda votes, and there will be countdown components, so users will know which referenda votes are closeable.

## Subsquare new design

Many community members have expressed their positive comments about subsquare's UI&UX. We never stop our work for better design, and we propose to implement our new design which we believe will bring users better experiences. The new design has improvements in the following aspects.

- The navigation menu will be a left sidebar style, always accessible.
- Following the polkadot icon set, we redesigned icons.
- On the proposal detail page, content card style is abandoned, font size is improved, and width of content area is expanded.
- Improve page responsiveness support.
- Improve customizability. Customizable items include menu background color, button color, logo, etc.

## Other enhancement features

- Democracy vote extrinsics. We implemented this for OpenGov, and it's good for users to know the direct vote history. We propose to implement this for democracy too.
- Support upload images directly with subsquare editors. Currently users can only use image links to edit their content. We will support users to drag images to subsquare editors to upload images like what can be done with github editor.
- Preimages page on which we can see all the submitted preimages and the correlated referenda.
- OpenGov referenda preparing phase visualization enhancement. Currently we have a UI for the decision and confirmation phase, but not so good for the preparation phase.
- Support users placing OpenGov referendum decision deposits.
- Allow users to mark any discussion/proposal post as a scam.
`,
  bannerCid: "bafybeibddhrymw56omwsj22cbwzbxhb2355xyha35u5sqoyn5tvoyrr63y",
  logoCid: "bafybeicwoec2onzrh72gvo6y6huz4nkhdoc3ujiizhax5ejkbjupdc4a3u",
  contributors: [],
};

module.exports = {
  subsquare,
};
