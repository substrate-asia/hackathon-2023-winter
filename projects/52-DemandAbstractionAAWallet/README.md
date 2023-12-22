## 基本资料

项目名称：Demand Abstraction AA Wallet and Trading Bot Based on Intent-centric and AI Agent

项目立项日期 (哪年哪月)：2023.12.01

## 项目整体简介

项目简介，英文提交。包括但不限于：
- 项目背景/原由/要解决的问题 (如有其他附件，可放到 `docs` 目录内。英文提交)。

The current Web2 is based on Apps, which are isolated and closed. As a result, few super Apps become giant platforms and suppress other innovative and thriving small business to maximize their self-interests for centralization and monopoly. With the barriers among Apps, users have to go through each App by themselves to find and get what they need, which is extremely inconvenient and inefficient. Therefore, to enable users to directly meet their demands, we need Web3 to make Apps fully interconnected, interoperable, and composable with each other without barriers and isolation.

However, the threshold, complexity and difficulty of user interactions and operations in Web3 are still too high to make Web3 usable for the ordinary users. For instance, if users want to convert USDT stablecoin in Ethereum into ARB token on Arbitrum, they need to find a suitable cross-chain bridge, connect to their account, then transfer their USDT and gas fee from Ethereum to Arbitrum, and then find a suitable DEX to exchange USDT for ARB with gas fee. It's so challenging, complicated, and troublesome for most users to understand and finish these steps by themselves. They have no way to simply express "I want to convert USDT into ARB",  and then directly get ARB without taking all those actions above by themselves. In order to do so, Web3 should support AI agent to intelligently analyze user demands and automatically run Apps to perform the corresponding operations in Apps for users, so users don't need to manually do so by themselves. 

- 项目介绍

Empowered by the interoperability of Web3 and intelligent automation of AI agents, we make an account abstraction (AA) wallet to enable a better new way of user interaction from Web2 based on Apps to Web3 based on the demand of users. Users can just express their needs and then directly get what they want without going through specific Apps by themselves in a fully natural, straightforward and convenient way. In order to do so, we will intelligently understand and analyze the need of users, match and combine different DApps to generate the optmial solutions which can best meet user demands. After getting confirmation from users, we will automatically execute the solution to operate crypto assets and run through different DApps for users to meet their demands. In this way, we can lower the threshold and complexity of on-chain operations, thus improving the efficiency and expereince of crypto users for the mass adoption of Web3.

In our demand abstraction wallet, after users express their specific demands via user interface, text, or speech as inputs, our underlying AI agent will intelligently understand them to analyze what users need, generate the best solution schemes to meet the demand of users, and then match the corresponding Apps according to the solution scheme. Based on the full inconnectuivity, interoperability and composability among Apps in Web3, our wallet can automatically execute the solution scheme to run the corresponding Apps and perform the corresponding operations within Apps for users to get what they need. Finally we will get the execution results back to users to directly meet their demands in a highly efficient and intelligent way.

- 项目Demo: sw-dev.web3idea.xyz

- 技术架构

Web3 and Blockchain: Based on blockchain, Web3 can break the barriers and isolation of Web2 Apps for full interconnectivity, interoperatblity, and composablity among Web3 Apps. Web3 can also support automatic execution within Apps, so users don't need to manually operate each App by themselves.

AI Agent: AI can intelligently understand the inputs of users via interface, text or speech to precisely analyze and get the demand of users. To meet user demands, AI will find, compare, choose, and combine all different Apps to generate the best solution schemes including what operations should be performed on which Apps.

Account Abstraction: The decentralized bundlers enabled by account abstraction based on ERC-4337 can run their AI agent to generate the solution schemes for users. After getting users' authorization, they will execute the solution scheme to run and operate different Apps for users. Finally, they will get what users need back to users as the execution results. Different bunlders will compete with each other, so users can choose the best one to best meet their own demands.

Zero-knowledege Proofs: Users can easily and quickly verify the correctness and effectiveness of both solution schemes and execution results provided by the bundlers. Users can also protect the privacy of their demands from being known or leaked by bundlers when getting and analyzing the demand of users.

- 项目 logo (如有)，这 logo 会印制在文宣，会场海报或贴子上。

![wallet](https://github.com/smarterwallet/hackathon-2023-winter/assets/110052573/d491ff3b-2a5c-41ac-ac27-60332f6448c2)


## 黑客松期间计划完成的事项

- 请团队在报名那一周 git clone 这个代码库并创建团队目录，在 readme 里列出黑客松期间内打算完成的代码功能点。并提交 PR 到本代码库。例子如下 (这只是一个 nft 项目的例子，请根据团队项目自身定义具体工作)：

**区块链端**
  - 在波卡上开发和实现AA钱包
  - 在Moonbeam上开发和实现EVM AA钱包

**客户端**
  - 注册登录
  - 账户抽象
  - 需求抽象
  - 转账汇款


## 黑客松期间所完成的事项 (2023年12月22日上午11:59初审前提交)

- 2023年12月22日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

**区块链端**
  - 在波卡上开发和实现AA钱包
  - 在Moonbeam上开发和实现AA钱包

**客户端**
  - 注册登录
  - 账户抽象
  - 需求抽象
  - 转账汇款

Prototype: https://www.figma.com/file/79vQtcOkQeVd0s6g9Ykonr/Demand-abstraction-AA-Wallet?type=design&node-id=0-1&mode=design

Demo video: https://www.youtube.com/@SmarterAAWallet

Pitch deck: https://drive.google.com/file/d/15GpYINg3rlTnSIkV9HLTTE8kbh8qSg4w/view?usp=sharing

## 队员信息

前端：[Gray](https://github.com/GrayJyy)、[Frank](https://github.com/frankda)

后端：[Myron](https://github.com/zhangzhishun)、[晨曦](https://github.com/ShadowDawnme)、[Freeman](https://github.com/StrFreeman)

合约：[方吉良](https://github.com/ericfjl)、[Spring](https://github.com/fospring)、[智邦富国](https://github.com/DOGEOFDOGE/DDOGE)

产品：[Jel](https://github.com/mryings) [尹于野]（https://github.com/DoraDong007/）
