## 基本资料

项目名称：zkPokerdot

项目立项日期：2023年11月

## 项目整体简介

<img src="docs/logotext.png" width="256"/>

- 简介：zkPokerdot是一条为“公平游戏”而生的波卡平行链。对于游戏而言，公平是一种确保良好玩家体验，激发真实竞争，构建健康社区，以及实现商业成功的重要保障。zkPokerdot通过应用ZK（零知识证明）技术，为部署在链上的游戏提供了公平性和透明度的机制。
- 技术路线：zkPokerdot采用了 Substrate 框架，创建了用于游戏的逻辑电路，以及基于pallet实现的ZK验证器。游戏参与者可以利用前端页面进行ZK证明，并提交交易到链上完成游戏。尤其对于“信息不对称”游戏（即非公开化的、玩家无法获取彼此信息的游戏，典型的有扑克/卡牌对战游戏），zkPokerdot依靠其独特的证明和验证系统，提供了极佳的公平性和透明度，有效地保护了所有玩家的利益。

其他更多开发中信息请见[详细设计说明](./docs/archive.md)

[项目Demo](docs/demo.md)

## 技术架构

- `ui/` 界面相关的代码，并包含zk证明及合约交互的代码
- `circuits/` 电路代码
- `cryptography/` mixnet方案代码，但主要代码因为没做到no_std，所以最后没用成
- `node/` subtrate节点pallet代码

![](docs/arch.drawio.svg)

## 本项目的起点

- VueJs 3: https://vuejs.org/guide/introduction.html
- Substrate Node: https://github.com/substrate-developer-hub/substrate-node-template
- Cryptography: https://github.com/geometryresearch/mental-poker
- bls12_381 verifier: https://github.com/bright/zk-snarks-with-substrate
- bellman verifier: https://github.com/DoraFactory/snarkjs-bellman-adapter
- shuffling circuit: https://github.com/Poseidon-ZKP/zkShuffle

## 黑客松期间计划完成的事项

**接口：合约 \<-\> 前端**

- [x] 启动游戏 `fn create_game(name: String, pub_key: String) -> uint`
- [x] 登记公钥 `fn join_game(id: uint, pub_key: String)`
- [x] 提交洗牌数据 `fn shuffle(id: uint, cards: uint[])`
- [ ] 传递解密信息 `fn unmask(id: uint, unmask: uint[])`
- [ ] 登记叫地主 `fn call(id: uint, pub_key: String)`
- [x] 提交出牌数据 `fn play(id: uint, pub_key: String, cards: uint[])`

**功能：节点+合约**

- [x] 节点基础框架
- [ ] 随机源选取
- [ ] 出牌规则验证
- [x] 集成ZK验证

**功能：前端**

- [x] 基础扑克牌界面
- [x] 开始/加入游戏交互
- [x] 发牌交互
- [x] 叫地主界面交互
- [x] 出牌界面交互
- [x] 胜利界面交互

**功能：密码学**

- [x] 可验证秘密洗牌机制说明
- [x] 洗牌ZK证明生成
- [x] 出牌ZK证明生成
- [ ] 私牌解密
- [ ] 公牌解密
- [x] ZK验证器


## 队员信息

- [Icer](https://github.com/wizicer) - Full-Stack Developer
- [Hiya](https://github.com/lovehiya) - Product Owner
- [Wenjin](https://github.com/wenjin1997) - Cryptographic Developer
- [Panchen](https://github.com/panchen451161722) - Frontend Developer
- [mambaCoder](https://github.com/mambaCoder) - Backend Developer
