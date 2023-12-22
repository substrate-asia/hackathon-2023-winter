## 基本资料

项目名称：DeQ

项目立项日期 (哪年哪月)：2023/12

## 项目整体简介

付费咨询顾问是一个历史悠久的商业模式，但由于存在劳动力密集并且无法有效衡量成效的弊端，因此在商业化方面一直没有得到很好的开发，只能作为高端服务占据较小的市场；当前互联网上也有不少的产品针对知识付费进行过平台化运作，结果均不错，但存在一些问题：

1. 容易通过刷票的方式得到“高赞”的假象；
2. 问题的解答者没有办法通过分享自身经验获得直接收益；
3. 一些知识是有时效性的，而一些高赞答案在经历过一些时效以后需要更新，除去兴趣的动力，没有一个持续的方式让创作者获得收益并以此为动力鼓励创作者进行更新；
4. 在商业化过程中，无论是顾问模式还是问答平台化模式，都没有公开可审计的收入数据来证实成效，只能通过隐含黑箱操作空间的投票点赞数字来进行评估。

DeQ 希望通过引入货币经济模型和结合 De-Fi 的方式来尝试解决上述问题。


## 黑客松期间计划完成的事项

在这一次 Hackathon 期间，我们希望通过完成下述功能完成一个 Proof-of-concept 的版本：

- 提问者通过悬赏的方式提问，而悬赏的奖金通过质押的方式，随着时间的推移出现一个产生收益的效果；
- 答题者可以在回答问题被得到提问者认可后获得悬赏的奖金，然后可以选择是否继续质押；
- 社区成员可以通过 buy shares 的方式给自己认可的答案的答题者进行支持，而答题者在提交答案时获取到一个初始 shares，可以通过出售 shares 的方式进一步获取收益，也会在不同用户交易 shares 的时候获得分成；
- 无论问题或是答案，都通过 NFT 的方式进行转为链上资产。


## 黑客松期间所完成的事项

基于上述目标，我们在这次的提交中完成以下事项：

- [ ] 通过智能合约的方式将问题和答案转为链上资产；
- [ ] 答案可以通过 shares 交易的方式来持续为答题者提供收益；

一个简易的 dApp 前端应用展示相关概念：

- [ ] 热门答案，看到最能获得社区认同的问题答案；
- [ ] 未解答的悬赏问题列表；
- [ ] 发起提问并质押对应的 token；
- [ ] 进行回答；
- [ ] 提问者可以选择心目中的最佳答案授予悬赏；
- [ ] 对答案的 shares 进行买卖，而通过 shares 呈现的价值来决定答案的价值；
- [ ] 通过查看个人页的方式初步了解用户，并且可选以付费咨询的方式向该名用户进行提问。


## Roadmap

如果在这一轮 Hackathon 中验证了我们的想法是基本可行的 ，那么预期会从几个方向进行迭代。

1. **可升级的合约**。在 PoC 之中，我们仅考虑了整个规则的可行性，并且由于 Hackathon 时间有限，我们并没有很详细地对合约代码进行考量。我们希望在证明可行性后，通过大幅度改进合约代码让其得到一定的弹性，让整个经济模型可以在后续运作时得到更好的调整。
2. **重新审视整个经济模型**。在这一次 PoC 中，我们通过引入 Homa Protocol 的方式来增加收益，而未来应该可以通过例如进一步接入 Acala Multichain Asset Router 增强跨链资产的流动性，通过平衡 De-Fi 比例来帮忙用户获得更持续的长期收益。
3. **通过账户抽象的方式降低整体准入门槛**。包括目前需要多次签名才能完成问题发布和质押流程的问题，通过朴素版本 Intent-Centric 的方式，大大降低 De-Fi 操作的繁琐程度(例如，“每个月底把我质押的 token 总数限制在 X，多余部分转换为 DOT”)


## 队员信息

### Ruby

5+ years of crypto marketing experience. Used to work for media and public chains like Phala.

### Charle

Lead Engineer & Software Architect. Lead developer from leading Dropshipping B2C company in China previously, being technical consulting and growth support to various start-ups for years.

### Parker

Smart Contract developer. Product Engineer from one of the largest social networking companies in China, experienced growth hacking for high-end clothing industry.

### Carson

Senior Full-Stack developer. 7+ years of experience and previously worked as SRE at a top 10 international SaaS company.
