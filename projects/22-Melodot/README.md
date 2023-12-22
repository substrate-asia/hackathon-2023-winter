## 1.Basic information:

Project name: Melodot

Date of project initiation: 2023/6/11

## Project Introduction

### Project Background

Melodot 是一个独立数据可用性层，与当前主流的数据可用性层不同的是，它是从领域化区块链的角度设计，它具备很多独特之处：

- 采用多项式承诺而非默克尔承诺
- 分布式生成数据，系统中没有一个节点完整地计算数据
- 数据单独网络，解耦共识层，非常易于分片
- 引入农民来解决棘手的最小诚实采样者数量假设，并采用基于 TMTO 的 PoSpace 来抵御女巫攻击
- 由农民存储数据而非验证者，使得共识层更加轻巧

以上特性使得系统吞吐量达到 GB 级别

### Overview

这次黑客松我们在数据可用性层的基础上，完成了波卡的再质押平行链 Redot，它利用波卡验证者的闲置资源来运行任务。Redot 是一个中立的共识层接口，它允许其他数据可用性层加入，同样也运行运行其他类型的任务，但条件是需要相当轻，它的设计目标是作为领域化区块链共识层的接口。你可以在[这篇文章](https://medium.com/p/aefe6d6836ef)中详细了解领域化区块链的概念和 Melodot 、Redot 的设计思路。

### Logo

[Logo .SVG](https://pic.tom24h.com/melo/logo.svg)

[Logo .PNG](https://pic.tom24h.com/melo/melodot-logo.png)

[Logo-icon .SVG](https://pic.tom24h.com/melo/logo-icon.svg)

[Logo-icon .PNG](https://pic.tom24h.com/melo/chrome-512.png)

### Initial Commit

src 中全部为新实现

## Tasks Planned for the Hackathon

### Farmer Client

- [x] Connects to the sampling network and full nodes.
- [x] Distributed generation.
- [x] Saves data.
- [x] Submits PoSpace proofs.

### PoSpace

A Proof of Capacity (PoC) level crate using Hellman's Time-Memory Trade-Off (TMTO) for space proofs.

- [x] Finds solutions.
- [x] Verifies solutions.

### Farmers Fortune Pallet

- [x] Interface for claiming rewards.

## 黑客松期间所完成的事项

我们在规定时间期限内实现了计划中的全部功能，但由于 Melodot 的数据可用性层是在 W3F 的资助下完成的，在中途了解到这违反了某个规则。我们全新实现了 Redot ，以上计划中的内容将不作为本次黑客松的任务。

在 Melodot 数据可用性层的基础上，我们完成了作为波卡再质押层的平行链的核心部分，从而形成从数据可用性层到共识层接口的全流程垂直切片。简单来说，我们在 Redot 中完成了：

1. 分布式密钥生成： 验证者注册后需要生成用于阈值签名的分布式密钥
2. 阈值签名： 用于 task 的结果进行阈值签名，并提交到链上
3. 验证器网络： 一个独立的验证者网络，用于密钥生成和阈值签名以及验证者的其他沟通
4. 验证器轻客户端： 这使得验证者只需要消耗少量的资源既可运行，且不需要加入共识网络
5. 链上验证者管理：允许波卡验证者加入到 Redot 网络并进行验证 
6. 验证器 Task 管理： 验证阈值签名的结果，允许验证者提交达成共识的结果

你可以在这里看到[技术评估文档](./docs/README.md)

受限于黑客松时间资源限制，我们在一些方面非核心能力方面进行了简化，包括

1. 客户端部分简化了部分指标监控
2. 故意忽略了部分安全问题
3. 部分流程进行了简化，例如 task 结果的提交、验证者队列。
4. 忽略了很多测试

## 队员信息

### DKLee

Full-stack Developer, Rust and Substrate Developer, core developer of Melodot.

Github: https://github.com/DarkingLee
wechat: darkingleedaqin