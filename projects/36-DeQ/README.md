## Basic Information

项目名称：DeQ

项目立项日期：2023/12


## Introduction

The paid consulting advisor is a long-standing business model, but due to its labor-intensive nature and the inability to measure effectiveness effectively, the commercialization of this service is not well-developed, and it only has a small market share as a high-end offering. There are also many products that have carried out platform for paid knowledge services, and the results are all good, but they still have some footages:

1. It is easy to create the illusion by pay ratings.
2. Answer/knowledge creators cannot directly profit by sharing their own experiences.
3. Some knowledge is time-sensitive, and certain highly liked answers need updating after a period of time. Without a continuous way for creators to profit from their work and be motivated to update it beyond interest alone, this becomes challenging.
4. In the commercialization process, whether through a consulting model or Q&A platform model, there is no publicly auditable income data available to verify effectiveness. Evaluation can only rely on vote counts and good ratings, which are available as a paid service.

DeQ aims to address these issues by combining a tokenomics model and De-Fi.


## Objectives in Hackathon

During this Hackathon, our goal is to create a Proof-of-concept version by implementing the following features:

- Questioners can ask questions by offering rewards, and these rewards will generate profits over time through staking.
- Answerers can receive the reward after their answers are approved by questioners, and they have the option to continue staking.
- Community members can support answerers they approve of by buying shares. Answerers receive an initial share when submitting their answers, which they can further profit from by selling shares or through transaction fees.
- Both questions and answers are converted into on-chain assets by NFTs.


## Checklist

Based on the above objectives, we have accomplished the following in this submission.

We aim to create smart contracts that can:

- [ ] Convert questions and answers into on-chain assets through contracts.
- [ ] Provide continuous income to answerers through shares trading.

Develop a simple dApp to showcase relevant concepts:

- [ ] List top answers by tokenomics flavors ranking.
- [ ] List of questions that have not been answered yet and are eligible for rewards.
- [ ] Create question and staking corresponding tokens.
- [ ] Answer questions and claim rewards.
- [ ] Allow question creators to choose the best answer for rewards.
- [ ] Shares Trading for answers.
- [ ] Learn more about a dedicated user by viewing their personal pages. You can ask them questions and offer rewards if applicable.

## Roadmap

If our idea is proven dealing the Hackathon, we plan to expand to several areas.

1. **Upgradable contracts**. During the PoC, we focused on assessing the feasibility of the rules but did not have sufficient time during the Hackathon to consider smart contract implementation thoroughly. We plan to enhance the contract code quality in order to make the entire economic model more flexible.
2. **Review the entire tokenomics model**. In this PoC, we increased revenue by introducing Homa Protocol without considering potential enhancements such as further integrating Acala Multichain Asset Router to enhance cross-chain asset liquidity and helping users obtain sustained long-term returns through balancing De-Fi ratios in future operations.
3. **Reduce barriers through Account Abstraction**. By abstracting the account, the overall access threshold is reduced. This includes addressing the current need for multiple signing to complete the process. Through a simple version of Intent-Centric, we can significantly reduces the complexity of De-Fi operations (for example, "Keep the total number of staking tokens at the end of each month to X, with any excess converted to DOT").


## Teams

### Ruby

5+ years of crypto marketing experience. Used to work for media and public chains like Phala.

### Charle

Lead Engineer & Software Architect. Lead developer from leading Dropshipping B2C company in China previously, being technical consulting and growth support to various start-ups for years.

### Parker

Smart Contract developer. Product Engineer from one of the largest social networking companies in China, experienced growth hacking for high-end clothing industry.

### Carson

Senior Full-Stack developer. 7+ years of experience and previously worked as SRE at a top 10 international SaaS company.