
## Name - summary of the project:
 PlanetDAO - DAO as a service to Empower Your Community with Trust: PlanetDAO gives any community the possibility to use a DAO for the best community experience, regardless the size of the community.

## Problem being addressed: 
Community is key for many organisations, specially like NGOs and small organisations. Based on experience and research we found four difficulties:

 1. Engage and giving members a voice
 2. Onboard and getting new users (scale)
 3. The payment and processes are not always transparent for donators
 4. Get revenue to achieve goals as community

## Solution:
That's why we created PlanetDAO: DAO as a service, to Empower Your Community with Trust. PlanetDAO gives any community the possibility to create a decentralized autonomous organization (DAO) to empower and grow their community. Everything with just a couple clicks. PlanetDAO is integrated with the Polkadot SDK, MoonBeam and Bifrost. Start your DAO today and give everyone in your community a voice!

**Please view presentation for more information about technical,  business, scale, team and other parts:**
https://docs.google.com/presentation/d/1FcsCbK9XW2u6ULbUrD5S5pw1I7PglBiF/edit?usp=sharing&ouid=108031027387406024340&rtpof=true&cd=true

**Demo video: ​​**https://vimeo.com/897075235?share=copy

**During the hackathon we put PlanetDAO live on the domain name:** http://www.planetdao.net/

**Repository link:** https://github.com/PlanetDAO/PlanetDAO-Polkadot-Winter


## Market:
According to Forbes, the total market capitalization of all DAO tokens at roughly 21 billion and will grow  

The market of Content Management Systems (CMS) will grow extremely in the coming years, according to Statista: 

 - Revenue in the Content Management Software market is projected to reach US$20.95bn in 2023.
- Revenue is expected to show an annual growth rate (CAGR 2023-2028) of 5.44%, resulting in a market volume of US$27.30bn by 2028.
- Content Management Systems (CMS) Market" is expected to witness significant growth in the coming years, primarily driven by the growing demand for (Personal Use, Large Enterprise, SMEs, Other).

**Source:**  https://www.statista.com/outlook/tmo/software/enterprise-software/content-management-software/worldwide




## Technology implementation:
### Category 3: Building a blockchain based on Polkadot SDK
We created PlanetDAO Parachain from Substrate template and deployed it on https://planetdao.net. We have used it on Login, Signup, DAO pages and using @polkadot/api for transacting. We implemented the following three chains:
1. Content, social network chain
2. Decentralized storage chain
3. DAO chain

**Content, social network chain:** On the login and signup page, the account information is being saved to polkadot sdk (PlanetDAO Parachain). For login and signup there is a different extrinsic for each of them. We have also added getter functions. Using Polkadot/api package we are retrieving and doing call transactions.


**Decentralized storage chain:** We have integrated IPFS system in Polkadot SDK. From the frontend we are uploading files/images via IPFS. The IPFS is giving us a unique content id. Then we are saving it into PlanetDAO Parachain. We have used Storage at the time of signing up and creating DAO/Communities.

**DAO chain:** After cloning the Polkadot SDK. We have customised it as per PlanetDAO. We have made daos pallets. There are some extrinsic call functions, such as creating DAO. So, similarly there are some getter functions. We are calling these via the Polkadot API from frontend. With the DAO chain we have made it possible for users to create DAO. After that, using Moonbeam or other chains(BNB, Celo, ETH) can create goals, ideas inside that DAO.


## We have integrate the following two bounties

### (1) Bifrost x Moonbeam -  vToken: 
We integrated XCM at the time of donations. This makes it possible that the donator can send xcvGMLR token. For the xcvGMLR, we are using the XCM precompile from moonbeam. We have integrated vToken at the donation part. Here users can swap their vToken via metamask. This is possible, because of the integration with Bifrost. For example, users can donate vGLMR and it will be swapped into native GLMR and sent to the DAO owner. Using Moonbeam XCM Token Precompile, the user can swap xcvGMLR to DEV token directly. In the code we are calling a function which swap and send Native token to recipient address. Means when a user send xcvtoken, then it will be swapped into native GMLR token and will send GMLR to ideas owner account. We are using @polkadot/api for XCM transact.


### (2) Moonbeam challenge - on chain governance and cross-chain integration capabilities

**Customization:** In Web2 organisations can create their own customised platform with tools like WordPress, JIMDO and Wix. PlanetDAO makes it possible to create a customised DAO platform with the benefits of Web3 with just a couple clicks. This makes it possible for a community manager to create and customise their own DAO. For the builder (DAO customization) we are using grapes.js node modules. First we are saving html at the time of creating a DAO template. Then we are showing that html template in the customization builder and dao page. When a DAO manager wants to customise the dao page, then we are loading the already saved html in smart contract. When the manager is done with customization, then it clicks the save button. After that, it will show a metmask popup to save the information. We have also created a custom component (Buttons). 

https://moonbase.moonscan.io/address/0xfcdB39BE384F0f62Be6dAE7AfCe59d297A7e3156

**Batch and cross chain DAO:** We have integrated batch precompile which makes it possible to combine multiple transactions as one batch. We integrated this for features like subscriptions (fee for joining a community) and giving a donation. We deployed the PlanetDAO smart contract on the moonbase network. 

**Conviction Voting:** PlanetDAO makes it possible to let the community decide with voting protocol. For example the community can decide how to invest the money. Members can submit an idea and can vote on the submitted ideas. The idea with the most support will be automatically executed.

**Multichain DAOs:** For creating daos, goals, ideas, messages, vote, etc. we are using hyperlane. So, user can create those from other chains (eg. Celo, BNB or Goerli). Also, we have used Batch precompiles. Using it people can send multiple transactions at once. Other than these, we are using wormhole to send transfers to the moonbase network from other chains (such as Celo, BNB, Goerli). 

**Profile Page:** The summary gives an overview how active you are in a community, like total messages read, total dao created, total ideas created, total donated, total ideas replied stats, etc.. How more active you are, how more batches you can earn from the community.
The summary tab also gives an overview of Top Daos, Top Ideas, Top Donated Ideas, and Top Replies of the user.



## Built with
Next.js, CSS, SCSS, JSX, TSX, Rust, Solidity, Ink, Cargo


## Instructions
Steps to run the code:
Download the code and then change direct to that folder
Then run: “npm i”
Next run: “npm run dev” to run the code
Open http://localhost:3001 with your browser to see the result.

## Team members:
**Arjen van Gaal:** Senior Product Designer at Kahoot! and previously Bloobirds and Goin
**Thomas Goethals:** Blockchain and Web3 expert, full stack developer at Kahoot! and previously Renault
**MD Baha Uddin:** Web3 developer, Blockchain expert, full stack developer 
**Steve Thijssen:** Business and designer, Founder of Wavy Health Inc. and FamilyPay, (raised over 1 million in funds), board member of the nonprofit organisation Conscious Nona in Orlando, USA
