# 技术评估文档

Melodot 为数据可用性层，它使得网络中的任何人都可以通过抽样来验证数据可用性，非不需要信任数据可用性层中的验证者。我们可以用一个简单的数学语言可以描述为 safe(DA, User) = safe(User) ，它为区块链的可扩展性带来了至关重要的作用。

当仍然有另一个未解决的问题，其他领域的用户如何知道数据是可用的？特别是不具备采样能力的领域，例如 L1 。Redot 是我们利用再质押来实现的一种近似于共识层安全性的解决方案，对手方需要攻击原始共识层才能攻击再质押层。

先前我们已经完成了 Melodot 的数据可用性层部分，这次黑客松完成了 Redot ，但为了保持完整性，我们仍然需要对 Melodot 进行相应描述。

## 动机

1. 使用领域化区块链对区块链进行重构
2. 让波卡成为全球共识层

## 术语

1. 农民： 在 Melodot 中实际负责分布式生成和数据存储的角色，使用基于 TMTO 的容量证明。
2. 最小诚实采样者数量假设： 这是数据可用性层的为数不多的假设，由于所有数据都从点对点网络中无需信任地获取，这要求采样的轻客户端数据足够多，以确保所有采样的数据足以重建数据，否则将会带来数据无法恢复的风险。这个假设直接决定了数据可用性层的安全性和吞吐量。
3. 分布式生成： 在 Melodot 语境中，分布式生成是指利用 KZG 多项式承诺的同态的特性，直接在列方向上扩展数据，而不需要获取所有数据计算 KZG 承诺和证明，这使得系统可以轻松应对大量数据。
4. 共识层： 领域化区块链中的共识层为其他领域达成共识，并非指某个链的共识层。
5. 再质押： 共识层的验证者使用其身份加入到另一个网络，类似于另一种形式的质押。
6. Task： Redot 使用 [**ZF FROST**](https://github.com/ZcashFoundation/frost) 实现了分布式密钥和阈值签名，验证者每人有一份密钥，任何人都无法恢复完整私钥，只有超过一定阈值的验证者人同意某一个 Task 的运行的结果才会获得最终签名，并提交到链上。
## 模块

| 细项 | 功能点 | 目录 | 备注 |
| ---- | ------ | ---- | ---- |
| Primitives | 1. 主要的加密原语，基于 FROST 的两轮密钥协商的门限签名，已经测试，可在链上验证。 | [core-primitives](../src/redot/crates/core-primitives) | 1. 主要技术难点在于原始库不支持 no-std ，尝试过修改原始库支持 no-std ，由于工作量太大放弃，改用了其他的方式在链上验证。 2.  文档待完善 |
| ValidatorNetwork | 1. 基于 libp2p 的点对点网络的实现 | [rc-validator-network](../src/redot/crates/rc-validator-network) |      |
|      | 2. 使用 DHT 网络的发现机制，用于发现和验证波卡验证者，网络中的用户通过 DHT 公布自己的身份和地址并签名，以便其他用户发现和验证。 | - | 1. 其他更多的点对点发现机制 |
|      | 3. 使用 gossip 搭建验证者密钥协商和签名机制 | - | 1. 故意忽略了部分安全问题 2. 轮次管理待完善 |
|      | 4. worker-service 模式，通过 service 向 worker 发送命令来完成不同的任务。 | - |      |
| ValidatorFetch | 1. 一个抽象的用于发现和管理波卡验证者的模块，可用于 runtime/ node/ light-client 等环境 | [rc-validator-fetch](../src/redot/crates/rc-validator-fetch) | 1. 待完善同进程获取波卡验证者，而无须通过 RPC |
| validatorClient | 1. Worker 实际执行密钥协商、门限签名、节点管理的进程。 | [rc-validator](../src/redot/crates/rc-validator) |      |
|      | 2. Service 用于与其他模块进行通信，并通过指令使 worker 执行相应操作。已经包括了项目所需的所有核心功能。 | - |      |
| Registry | 1.  验证者注册到 Redot ，首先进入 pending 等待验证 | [validator-registry](../src/redot/pallets/validator-registry) | 1. 更安全和合理的验证者同步机制 |
|      | 2. 由共识在每个区块 on_finalize 后使用 OCW 读取链下数据库的波卡验证者集，并添加和删除验证者 | - | 1. 节点收集者的 ValidatorFetch 待完善 2. 更高效的验证机制 |
| Task | 1. 密钥轮换，由 old_key 签名新的公钥，验证通过后更新密钥。 | [task]((../src/redot/pallets/task)) | 1. 添加轮次管理以及密钥轮换的场景 |
|      | 2. 元数据管理，由 DKG 密钥签名的 Task 运行结果，验证成功后添加到链上。 |      |      |
| Redoxt | 1. 使用 subxt 搭建的 Redot 的交互模块，支持常规的链交互以及一些包装好的常用操作。 | [redoxt](../src/redot/redxt) | 1. 待完善 e2e |
| Redlight | 1. 验证者实际运行的轻客户端，用于实际运行所有必须模块和功能。 | [redlight](../src/redot/redlight) | 1. 采用更好的轻客户端机制，以防止故障 |
|      | 2. 用于从 melodot 采样轻客户端获取数据可用性的 RPC 客户端。 |      | 1. 时间原因未作解耦和优化，实际上无须从 RPC 获取，可以编译到一起。 |

另外，在黑客松规定的期间内，我们完成了 Melodot 的很多功能，由于这处于 Grant 的第四个里程碑，应该不计入此次黑客松。但为了更好地展示我们的工作，同时也为更全面地展示项目，我们作简单的介绍，你可以在这里看到 Melodot 的起点： [Melodot 的起始仓库](https://github.com/ZeroDAO/melodot/commit/7aac19f8a8fd93d5efb26f6653c1d74b902f11dd)



1. [farmer](https://github.com/ZeroDAO/melodot/tree/w3f/farmer) 农民实际运行的客户端，它连接到 melodot ，生成和存储的数据，并寻找 PoSapce 解决方案提交到链上
2. [proof-of-space](https://github.com/ZeroDAO/melodot/tree/w3f/crates/proof-of-space) 手动实现的基于 Hellman TMTO 的容量证明，这是一个初始实现，并未嵌套 Table ，包括分布式数据生成、解决方案寻找、证明和验证机制等等。
3. [pallet-farmers-fortune](https://github.com/ZeroDAO/melodot/tree/w3f/crates/pallet-farmers-fortune) 用于验证者领取奖励和验证 Pospace 证明的 Pallet

## **运行**

确保你已经正确搭建 rust 和 substrate 所需环境

### Melodot

你可以在 [Melodot 的文档](https://docs.melodot.io/guide/node/starting-a-node/#) 中找到如何编译节点和运行 Melodot 的所有客户端。

### 编译 Redot

确保你已下载并进入 redot 项目目录下，编译 runtime 和节点

```
make build-default
```

编译轻客户端：

```
make build-light
```
### 测试

运行以下命令进行测试，目前主要为 DKG 和 阈值签名的测试。

```
make test
```
### 运行 Redot

以下命令将启动一个开发链

```
make run-dev
```
但这并不能实际产生区块，因此 redot 是一个平行链，推荐使用 [Zombienet](https://github.com/paritytech/zombienet) 来实际运行。

### 运行 Redlight

首先你需要通过以下命令编译 Redlight

```
make build-light
```

在运行 Redlight 之前，请确保你已通过 Zomlienet 成功运行了 Redot ，之后通过以下命令运行 Redlight 。

```
make run-light
```
