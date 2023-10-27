# 参赛类别

## 目录
<details>
  <summary>点击打开看目录</summary>

<!-- TOC -->

- [参赛类别](#%E5%8F%82%E8%B5%9B%E7%B1%BB%E5%88%AB)
    - [目录](#%E7%9B%AE%E5%BD%95)
    - [类别 1：Polkadot 生态开发者工具](#%E7%B1%BB%E5%88%AB-1polkadot-%E7%94%9F%E6%80%81%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7)
        - [可视化工具](#%E5%8F%AF%E8%A7%86%E5%8C%96%E5%B7%A5%E5%85%B7)
        - [substrate pallets 工具集](#substrate-pallets-%E5%B7%A5%E5%85%B7%E9%9B%86)
        - [治理工具](#%E6%B2%BB%E7%90%86%E5%B7%A5%E5%85%B7)
        - [数据分析工具](#%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7)
    - [类别 2：Dapp产品&智能合约](#%E7%B1%BB%E5%88%AB-2dapp%E4%BA%A7%E5%93%81%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6)
        - [智能合约链](#%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E9%93%BE)
        - [智能合约平台](#%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E5%B9%B3%E5%8F%B0)
    - [类别 3：基于 Polkadot SDK 构建区块链](#%E7%B1%BB%E5%88%AB-3%E5%9F%BA%E4%BA%8E-polkadot-sdk-%E6%9E%84%E5%BB%BA%E5%8C%BA%E5%9D%97%E9%93%BE)
        - [游戏链](#%E6%B8%B8%E6%88%8F%E9%93%BE)
        - [DeFi 或 稳定币链](#defi-%E6%88%96-%E7%A8%B3%E5%AE%9A%E5%B8%81%E9%93%BE)
        - [隐私链](#%E9%9A%90%E7%A7%81%E9%93%BE)
        - [DAO 链](#dao-%E9%93%BE)
        - [内容、社交网络、存储链](#%E5%86%85%E5%AE%B9%E7%A4%BE%E4%BA%A4%E7%BD%91%E7%BB%9C%E5%AD%98%E5%82%A8%E9%93%BE)
        - [去中心化身份链 DId](#%E5%8E%BB%E4%B8%AD%E5%BF%83%E5%8C%96%E8%BA%AB%E4%BB%BD%E9%93%BE-did)
        - [去中心化市场链](#%E5%8E%BB%E4%B8%AD%E5%BF%83%E5%8C%96%E5%B8%82%E5%9C%BA%E9%93%BE)
        - [其它想法](#%E5%85%B6%E5%AE%83%E6%83%B3%E6%B3%95)

<!-- /TOC -->

</details>

## 类别 1：Polkadot 生态开发者工具

基于Substrate开发的Solo-Chain，Relay-Chain，Parachain都需要好的测试工具模拟环境，快速启动，还能够开发测试用例。你也可以开发类似的测试工具

参考例子：

- [Zombienet](https://github.com/paritytech/zombienet/)

智能合约的开发所需要的工具，类似以太坊的Hardhat和Foundry。

参考例子：

- [Openbrush](https://openbrush.brushfam.io/)

### 可视化工具

我们想到了从以下角度思考，但如果你有其他视角，别犹豫，用你的行动告诉我们吧。

- **区块块可视化工具**

    建立一个有趣、深刻，和美丽的方法来可视化 Polkadot 中继链增长，允许简单的区块探索、最终化、验证人数据、临时叉，或其他与Polkadot上的区块生产相关的信息。

- **区块探索者**

    如果你有一个很棒的方式来探索历史区块链状态，现在就是你的向世界展示它的机会。

- **验证人可视化工具**

    用你的动态展示验证人信息的方法来打动我们吧——例如它们的身份信息、地址、年代节点，或它们生成了哪些区块。您可以根据生成区块的数量或它们作为活跃验证人组的时间长度来对它们进行排序。发挥你的创造力吧！

- **提名可视化**

    在Polkadot中，验证人通常是由其他人提名从而进入活跃验证人组的。我们将其想象成一个巨大的图，其中一些节点是验证人，更多的节点是提名人，以及提名人和他们选择的验证人之间的连接。请分享您的观点，告诉我们如何将现有提名生态系统的状态展示给用户。

### substrate pallets 工具集

将常用的Pallet集中放在一个Repo里面，让其他项目可以从中挑选出需要的Pallet集成到自己的链中。

参考例子：Substrate Open Runtime Module Library
- https://github.com/open-web3-stack/open-runtime-module-library

### 治理工具

灵感：

- https://kusama.polkassembly.io/opengov
- https://commonwealth.im/

### 数据分析工具
在区块链的运行过程中，会产生大量的链上数据，数据分析可以通过数据挖掘来得到数据中隐藏的信息。

参考例子：

- [web3 go](https://web3go.xyz/)


## 类别 2：Dapp产品&智能合约

### 智能合约链

智能合约链是用于小段代码的沙箱执行环境，其他开发人员可以不经许可地部署这些代码。Substrate提供了一个基于EVM和Ink的智能合约模块，Kusama肯定需要执行这个模块来部署一个活跃的平行链。一些具体的想法可以包括使用其它语言的智能合约，例如汇编脚本，特别是那些已有工具链的语言。在你看来，一个完美的智能合约链是什么样的？

参考例子：

- [Patract Network](https://patract.network/?lang=zh-CN)
- [Moonbeam Network](https://moonbeam.network/)

及如：

- 基于 EVM 合约的应用
- 基于 Ink 合约的应用

### 智能合约平台
智能合约平台提供一个高效的智能合约规范和执行的平台。Substrate拥有的扩展性使得开发一个合约平台非常容易。新的合约平台可以在执行的效率，合约的安全性，合约的跨链调用等方向做出创新。

参考例子：

- [Gear Tech](https://www.gear-tech.io/)
- [t3rn](https://www.t3rn.io/)

## 类别 3：基于 Polkadot SDK 构建区块链


在这个类别中，你可使用 Substrate 构建一个自定义区块链的挑战。在不久的将来，你的链将有能力接入 Kusama 中继链以实现互操作性和即插即用的安全性。下面的想法是为了能给你一些启发。我们希望你发挥创意，构建你认为对 Substrate 生态系统的其他建设者最有用的定制链！

### 游戏链

游戏可以定义为具有附加预定义规则的两个或多个参与方之间的状态变化。我们对理想游戏链的设想并不是它能够支持缓慢的双人回合制游戏（这个问题已经得到解决），而是一个足够抽象的链，可以适用于从国际象棋和战舰到几乎实时的、有许多玩家在同一世界的 rogue-like 游戏。这类产品理想上将是一个抽象链，开发者/企业家可以在这个链上将游戏无缝地投放到多元宇宙中，以此来建立一个具有体育预订和电子竞技功能的锦标赛平台，为游戏筹集资金，并使得游戏开发者能够得到公平的分配。其功能可以包括以下所有或部分特性：

- 执行多令牌标准（ERC1155）。
- ERC1155令牌的交换或互换协议（例如修改为ERC1155）。
- 链上/链下（例如IPFS）的元数据部署和托管工具。
- 稳定币集成（Acala）。
- 用于以JS/Unity为基础的游戏的交易和集成API。

尝试使用免费的tx，在特定限制下的免费tx，或者基于玩家声誉的免费tx。构建一个web3游戏的概念证明，它不会破坏中心化游戏的感觉，而是坚持玩家、物品和信息，以实现虚拟角色的真正所有权。

例子：

- NFT平行链例子
- Substrate收藏品例子
- Substrate游戏例子

现有的游戏链例子：

- [Darwinia](https://darwinia.network/)
- [Celer](https://www.celer.network/)
- 游戏 DAO
- [Plasm](https://www.plasmnet.io/)

### DeFi 或 稳定币链

去中心化金融是对传统金融服务的重新构想，其核心是区块链的信任最小化。DeFi的其中一个例子就是贷款和有息头寸，例如 MakerDAO 的抵押债务头寸系统。另一个例子就是合成资产协议，它允许用户创建稳定币头寸或衍生品。对 Kusama 来说，通过创建优化的执行，DeFi可以单独存在于它自己的平行链中，或者通过在底层原语之上组成协议并使用XCMP实现互操作性，从而跨平行链存在。

稳定币是波动性较低的加密货币，通常与参考资产（如美元）的价值挂钩。通过使用算法稳定币设计，现在有不同的设计来执行稳定币，如 Schellingcoin 或合成资产设计。一个 Kusama 稳定币可能是类似的其中一个或完全原始和新的东西。

这个类别种的其他想法包括一个稳定币储蓄帐户（例如 Dharma）、一个用于 DeFi 的保险层（例如 Opyn）、一个B2B支付平台（例如 Veem）、一个快速支付链，或是一个再生的订阅支付执行，或一个可以与任何监护方案集成的没有监护的互换过程，这个过程允许用户互相交易而无需放弃对第三方的监管。

现有的 DeFi 链例子：

- [Acala](https://acala.network/)
- [Laminar](https://laminar.one/)
- [Centrifuge](https://centrifuge.io/)

### 隐私链

区块链本质上就是透明的，所有的交易历史是对所有人可见的。一些应用程序会需有更强的隐私保护。在Kusama上，可以通过使用zkSNARK、STARK、环形签名等链上隐藏信息的方法来集成隐私。通过设计隐藏节点或验证人身份，也可以在协议或网络级别创建隐私。一个项目在这里能包含的最小功能就是让用户能够在Kusama或Polkadot生态系统中私下交易价值。不同的设计是有可能的，但最有用的设计会是一个平行链，它允许使用任意Substrate令牌来处理私密交易。其功能可以包括以下所有或部分特性：

- 机密交易: 具有在两个账户之间转移令牌而不透露转移的数量或类型的能力，即使是涉及到的交易地址仍然可见。
- 匿名交易: 具有在两个账户之间转移令牌而不透露涉及地址的能力，即使转移令牌的数量或类型是公开的。
- 保密账户: 帐户余额未知，但也有一个查看秘钥允许指定用户查看这个帐户的余额，但不能查看传入或传出的交易。这与ZCash的z地址是类似的。

参考例子：

- [Advanca Network](https://www.advanca.network/)
- [Phala Network](https://phala.network/)
- [Manta Network](https://manta.network/)

### DAO 链

一个DAO，或去中心化自治组织，是一个区块链应用程序，它允许社区成员在DAO中的某些决策上共同达成协议。Aragon是Ethereum世界中最著名的DAO框架。它允许某个人点击几下鼠标就可以启动一个DAO，同时添加入新的应用程序（例如不同的投票或融资模式），以及允许成员发起对执行行为的投票，不仅是在DAO内部执行，还有DAO对外的智能合约（即DAO可以对DeFi投资，从而赚取会员费利息）。一个Kusama的DAO链允许使用具有开箱即用的基本模块的模块化DAO框架，并且允许用户轻松地将自己的定制模块接入到DAO中。这是否能更好的通过智能合约或需要治理的WASM模块来完成是由开发人员决定的，但一个DAO的本质是能够以编程的方式与其他在同一链中的DAO互动的能力——治理的互操作性是一种新的思考数字国家状态的方法。

示例：

- https://github.com/web3garden/sunshine
- https://github.com/aragon/
- https://daostack.org/

### 内容、社交网络、存储链

一个内容或存储链的重点将会是方方面面的，包括从去中心化的Github的版本和获取个人数据的所有权，到托管不可阻挡、不受审查的网站。内置隐私的社交网络、去中心化的电子邮件平台、下一代的种子，所有的这些都应该通过与类似IPFS或Storj这样的协议集成一个Substrate链而成为可能。一个Kusama存储链将证明去中心化存储的真实需求，而不仅仅是为了存储而存储。或者，它可以是一个抽象链，用于基于费用的读/写，而其他人可以像连接AWS S3 bucket一样轻松地连接它。这可能包括与IPFS、Storj等的集成。

示例：

- [SubSocial](https://subsocial.network/)
- Redis 风格的数据存储和命令

### 去中心化身份链 (DId)

想法：https://github.com/substrate-developer-hub/hacktoberfest/issues/27

参考例子:

- [KILT Protocol](https://kilt.io/)
- [Dock](https://www.dock.io/)
- [Litentry](https://www.litentry.com/)

### 去中心化市场链

想法：https://github.com/substrate-developer-hub/hacktoberfest/issues/27

### 其它想法

- 公众投票链
- 计算链（例如Golem）
- 许可链
- 预测市场
- 联邦预言机
