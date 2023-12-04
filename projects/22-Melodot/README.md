## 1.Basic information:

Project name: Melodot

Date of project initiation: 2023/6/11

## Project Introduction

### Project Background

Melodot is a domain-specific blockchain data availability layer. We have introduced the role of the "farmer," liberating validators and enabling the system to become more decentralized. This approach allows for distributed generation, higher throughput, and enhanced security.

**Scalability Bottleneck of Monolithic Blockchains**

In recent years, numerous methods have been employed to scale blockchains, ranging from larger blocks and sharding to modular blockchains. These solutions, including modular blockchains, inherently seek diminishing marginal utility in scalability on a monolithic blockchain platform.

Our proposed domain-specific blockchain represents a radical restructuring of blockchain technology. It demands that after modules are decoupled, the overall system's security remains unaffected. Moreover, it requires that these decoupled modules prevent knowledge leakage to ensure the scalability of each module and the security of their interactions. The data availability layer is the most fundamental domain, but existing solutions still face many challenges.

**The Gentle Trap: Minimum Honest Sampler Assumption**

Unlike centralized servers, the data in the data availability layer is distributed across a sampling network. This presents a gentle trap: the system's data throughput increases with the number of samplers. Implicitly, this assumes the presence of sufficient sampler nodes in the system to ensure that the data stored during sampling is enough to reconstruct the original data. However, we cannot determine the number of samplers, especially since samplers may only be interested in blocks relevant to them. If a block contains no data of interest to a sampler, they might choose not to sample it for efficiency, leading to significant variability in the number of samplers per block. This can become a bottleneck for the DA layer, impacting the system's security.

**Excessive Centralization**

The data availability layer requires encoding and rapidly propagating a large volume of data in a very short time, necessitating nodes with substantial computational power and bandwidth. This leads to excessive centralization of the network. Existing DA layer solutions, whether based on Merkle trees or KZG commitments, cannot avoid this issue. While Polynomial-based Sampling (PBS) can alleviate this, it also increases the cost of data transactions. More importantly, this becomes another bottleneck for the system's data throughput.

**Highly Coupled Validators**

Furthermore, the DA layer faces several issues: who downloads the data, who stores it, who reconstructs it, etc. In current solutions, all these tasks are assigned to validators, including encoding and disseminating data blocks. This not only increases the centralization of the system but also complicates sharding.

### Technical Architecture

**Domain-Specific Blockchain**

![](https://pic.tom24h.com/melo/1.png)

This is a typical architecture of a domain-specific blockchain, which is actually a very common architectural pattern. It's important to note that this is not about the design of frameworks like Substrate themselves, but rather the architecture from the perspective of the ecosystem. The message queue includes common cross-chain message chains and cross-chain protocols, as well as the often-overlooked monolithic blockchain itself. For instance, the Bitcoin ecosystem's inscriptions utilize the Bitcoin network as a reliable message layer, similar to Polkadot's RMRK, Arweave's SmartWeave, and so on.

While blockchains are usually viewed as finite state machines, we can also decouple the state machine itself and the consensus layer that forms consensus for all state machines. The application layer, by various means, calls upon the consensus layer, state machine, and data availability layer to form secure, rich product mechanisms. Modular blockchains can be seen as the rudimentary form of domain-specific blockchains, but the lack of deeper architectural design leads to various bottlenecks and limitations in products.

**Melodot Network Architecture**

![](https://pic.tom24h.com/melo/2.png)

The Melodot data availability layer mainly comprises three parts: full nodes, light clients, and farmer clients. Full nodes are primarily used to form consensus and provide services to other roles. Light nodes, mainly sampling clients, obtain block headers from the network and perform sampling. Farmer clients are used for data availability sampling, distributed generation, and data storage. Data is propagated through a separate network, isolated from the consensus layer, to ensure the security of the consensus layer's network and to facilitate future network sharding.

The challenge here is how to make data availability usable on other monolithic blockchains, especially those blockchains where validators lack third-party sampling capabilities. We use a Restake mechanism, essentially an interface of the consensus layer. Its security depends on the cost incurred by validators. In our design, the cost of performing light client sampling is very low, so the security can be approximated to the security of the monolithic blockchain itself.

As shown in the diagram, we design a special parachain using Polkadot relay chain validators' Restake to validate Melodot sampling data availability, saving the results on-chain. This allows all Polkadot parachains to obtain data availability layer capabilities. We can apply the same approach to Ethereum and other monolithic blockchains to obtain a secure third-party data availability layer. In this scenario, Polkadot and Ethereum become the consensus layers in the domain-specific blockchain, and we don't need to make any modifications to the consensus layer. In fact, the consensus layer might not even be aware of the existence of the data availability layer, which represents a very clean decoupling.

### Overview

Melodot is a gigabyte-scale data availability layer where you can fit a 90-minute 1080P movie into a block. Melodot draws from past successes in data availability layers and decentralized storage, adopting special designs to solve many tricky problems.

**Polynomial Commitment**

Melodot uses polynomial commitments to ensure data is correctly encoded. The original data availability layer scheme used Merkle coding, requiring a powerful full node to obtain all data and generate and spread fraud proofs. We avoided this, which not only reduced efficiency but also introduced additional assumptions. Specifically, we generate KZG commitments in the row direction included in the block header, allowing nodes to verify the validity of sampled data in real time with just the block header.

**Distributed Generation**

In the original data availability layer proposal, the proposer alone performed expensive polynomial commitments and RS coding on all data, requiring very high bandwidth and performance. Imagine a node capable of encoding 500MB of data in two seconds. This not only deepens the system’s centralization but also becomes a bottleneck for system throughput.

In Melodot, validators are more like light clients. They don’t need to perform expensive coding, and no single node encodes all data. This is all distributedly done by farmers, with the task of expanding data in the column direction assigned to different farmers, and they don’t need to calculate expensive polynomial commitments, just direct data expansion. It’s important to note that in the worst case, if all farmers go offline, it will lead to sampling failure and data unavailability, but farmers do not affect system security.

Distributed generation is crucial for system throughput. We’ve achieved a system throughput that increases with the number of farmers without sacrificing decentralization.

**PoSpace**

Melodot uses Chia-style PoSpace to ensure farmers store data honestly. It requires farmers to complete a one-time step called “Plotting” to commit a certain size of hard disk space. After this, farmers can farm on this disk for a considerable time with very little resource consumption, allowing consumer-grade PCs to join the network, a highly decentralized incentive mechanism.

### Demo

https://github.com/ZeroDAO/melodot

### Logo

[Logo .SVG](https://pic.tom24h.com/melo/logo.svg)

[Logo .PNG](https://pic.tom24h.com/melo/melodot-logo.png)

[Logo-icon .SVG](https://pic.tom24h.com/melo/logo-icon.svg)

[Logo-icon .PNG](https://pic.tom24h.com/melo/chrome-512.png)

### Initial Commit

https://github.com/ZeroDAO/melodot/tree/winter

## Tasks Planned for the Hackathon

### Farmer Client

- [ ] Connects to the sampling network and full nodes.
- [ ] Distributed generation.
- [ ] Saves data.
- [ ] Submits PoSpace proofs.

### PoSpace

A Proof of Capacity (PoC) level crate using Hellman's Time-Memory Trade-Off (TMTO) for space proofs.

- [ ] Finds solutions.
- [ ] Verifies solutions.

### Farmers Fortune Pallet

- [ ] Interface for claiming rewards.

## 黑客松期间所完成的事项 (2023年12月22日上午11:59初审前提交)

- 2023年12月22日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

## 队员信息

### DKLee

Full-stack Developer, Rust and Substrate Developer, core developer of Melodot.

Github: https://github.com/DarkingLee
wechat: darkingleedaqin