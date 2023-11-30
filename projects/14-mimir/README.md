## 基本资料

项目名称：Mimir

项目立项时间：2023-03

## Project Introduction

### Background

Within the Ethereum realm, multisig has emerged as a standard necessity. Ethereum's premier multisig wallet, Safe, oversees approximately 1% of the total ETH assets, valued at $3B. Additionally, features like Social Recovery and Seedless Login have garnered substantial attention in terms of development and rule-setting.

Substrate, on the other hand, has long incorporated related modules. Tools like the Multisig Pallet, Recovery, and Proxy can either individually or collectively implement robust AA features. Notably, in Polkadot, multisig accounts for 5% of DOT assets, even outpacing the Ethereum ecosystem. This underscores the heightened demand among Polkadot users. However, non-EOA wallets currently grapple with two primary issues:

1. Creation & Management: Setting up these accounts can be intricate, and there's a palpable absence of user-friendly interfaces. Given that different wallets cater to distinct account categories, users often find themselves toggling between multiple tools for holistic account management.
2. Application: The fragmentation of account types across diverse wallet apps has stymied the formation of a cohesive demand, enabling users to effortlessly access various apps (like Polkassembly, SubId, Staking, Subsquare, etc.) via non-EOA wallets. This has inadvertently led to a vast chunk of assets in these accounts remaining underutilized.

## Introducing Mimir

Mimir presents a holistic UI experience, guiding users through a streamlined journey from account inception to comprehensive asset management.

### Account Abstraction

Mimir amalgamates a spectrum of account frameworks. Presently, within Mimir, users can leverage the following account structures:

- Extension Wallet: Users can seamlessly access the wallet embedded in the extension by granting authorization via Mimir.
- Multisig Account: A collaborative wallet steered by multiple addresses, ensuring heightened security.
  - Static Multisig: Rooted in the Substrate Multisig Pallet, this variant has immutable members and thresholds.
  - Flexible Multisig: A fusion of Multisig and Proxy features, this version offers the flexibility to modify members and thresholds.
  - Nested Multisig: A unique multisig variant where the members themselves are multisig accounts.

Mimir is adept at navigating the nuances of the aforementioned accounts, ensuring a seamless transaction assembly process for each.

### Asset Management

Mimir serves as a gateway for non-EOA accounts, offering unhindered access to a plethora of applications. Users can, via their non-EOA identities, explore a myriad of apps within Mimir. Additionally, Mimir is committed to pioneering applications that bridge existing gaps in the ecosystem, thereby enhancing user asset management capabilities.

## Mimir's Signature Features
1. Unparalleled Support for Nested Multisig Accounts: Mimir is equipped to handle transaction initiation and approvals for these accounts, catering to diverse organizational structures and amplifying the inherent potential of multisig for enterprise-grade solutions.
2. Harmonized with Polkadot's Account Paradigm: Mimir empowers users to oversee all their account assets, encompassing all Extension Wallets, Static Multisig, Flexible Multisig, and beyond.
3. Anchored in the Substrate Framework: Mimir's suite of features, including Flexible Multisig, is crafted atop the native Substrate framework, positioning Mimir to seamlessly integrate with Polkadot's parachains.

## Logo

![Logo](./assets/logo.png)

## Demo

夏季黑客松Demo: https://drive.google.com/file/d/1kEImUb6QvMj1GvGBSqOO1mohMdXBfsR8/view?usp=drive_link

## 技术架构

*后端*: 使用nodejs以及koa框架，提供交易以及账户查询

*监听端*: 采用polkadotjs监听链上交易，并使用图数据库进行存储

*前端*: react技术栈

## Github

https://github.com/mimir-labs/mimir-wallet


***


# 中文项目介绍

## 背景

在以太坊生态中，多签已成为常见的需求，以太坊最大的多签钱包Safe中管理了大约1%的ETH资产($3B)，其他的如Social Recovery、Seedless Login也已经有大量项目参与开发与规则制定。

而Substrate中早已经有了相关的功能模块，如Multisig Pallet、Recovery、Proxy等都可以实现、或者通过功能组合实现强大的各类AA功能，且波卡中的Multisig控制了5%的DOT资产，甚至超过了以太坊生态，这表明波卡生态的用户有着更加旺盛的需求。

但是在当前生态中，非EOA钱包面临着两个问题：

1. 创建与管理

这些账户的创建流程较为繁琐，且缺少相关的可视化界面帮助用户完成这类型账户的创建。同时，各类钱包都专注于某一项账户类别，导致用户在使用过程中需要切换不同的工具才能完成所有账户的管理。

2. 应用

由于不同类型的账户分散在不同的钱包应用中，导致生态中暂无形成规模化的需求促成用户可以便捷地通过非EOA钱包访问各类应用（如Polkassembly、SubId、Staking、Subsquare等）的目标。这也导致了这部分账户里管理的大量资金面临生态参与度低的问题。

## Mimir

Mimir提供一整套UI交互界面，帮助用户方便快捷地完成从账号生成到资产的管理的全流程。

### 账户抽象

Mimir综合各类别的账户体系，在当前的Mimir中，用户可以使用以下类型的账户体系：

**插件钱包**：用户可以通过授权插件，通过Mimir访问插件中的钱包

**多签账户**：由多个地址共同控制的钱包，具有更高的安全性

**--不可变多签账户**：基于Substrate Multisig Pallet产生的账户，成员和阈值不可变

**--可变多签账户**：组合了Multisig和Proxy功能产生的账户，成员和阈值可变

**--嵌套多签账户**：多签的成员也是多签的账户

Mimir适配了上述账户的创建、管理流程，也为他们适配了对应的交易组装功能，即用户可以丝滑地使用这些账户在Mimir中发起、管理交易。

将来Mimir也会适配Proxy，混合Proxy和Multisig架构的账户，**并且提供支持社交账户登陆的方案**。

### 资产管理

Mimir为非EOA账户提供便捷的应用访问入口，用户可以通过Mimir访问以非EOA的身份访问各类应用，Mimir也会自研各类生态中的空缺位应用，帮助用户更好的管理自己的资产。

资产管理部分的功能将会在下一版本作为重点功能进行开发。

## Mimir参赛的版本有以下特点：

1. Mimir支持任意级别的多签账户嵌套

并且为其适配了相关的交易发起、审批功能，以适应灵活的组织结构需要，更大程度上发挥多签的潜力，提供企业级服务的能力。

2. 更贴近波卡生态的账户架构模型

用户在Mimir中可以一站式管理自己所有类别的账户资产，包括所有的插件钱包，静态多签、可变账户，未来我们也将适配硬件钱包、代理账户等。

3. 完全基于Substrate框架

Mimir中所有的衍生功能如可变成员、阈值的多签均基于Substrate原生框架开发，因此Mimir可以更加深度广泛地适配波卡生态的平行链。

## 本次黑客松计划完成事项

### 功能1：支持多签中灵活的成员和阈值

用户可以创建嵌套的多签账户，Mimir对这种账户类别的交易发起和审批流程进行了深度适配。

1. **交易组装**：使用Proxy+Multisig Pallet组装一个可以修改成员和阈值的多签账户。
2. **账户架构**：扩展账户类别，将多签分类为静态多签（Static Multisig）和灵活多签（Flexible Multisig），并为其他账户类别（如Proxy）预留空间。
3. **UI/UX**：包括灵活多签的创建和管理流程（账户配置、发起交易、修改成员、调整阈值、删除账户）。

### 功能2：深度支持嵌套多签

Mimir组装了Proxy + Multisig，实现了具有可变成员和阈值的多签，拓展了波卡生态中多签的边界。
1. **交易组装**：用户可以使用嵌套多签账户发起和审批交易。
2. **UI/UX**：从发起到审批的嵌套多签交易的完整用户界面流程，适配任意多签节点的交易展示界面，以及嵌套多签的账户架构展示界面。

### 功能3：交易监听

用户可以恢复通过其他应用创建的多签账户，并可以使用Call Data恢复通过其他应用发起的多签交易。
1. **交易监听框架**：后端通过监听substrate节点的交易，解析并根据账户之间的关系模型构建出交易模型。
2. **UI/UX**：包括Mimir整体应用设置功能（RPC设置和账户显示设置），以及用户恢复和管理来自其他Dapp的交易和账户的可视化界面。

### 功能4：用户体验优化

优化了弹窗、菜单等多个产品细节，提升了整体的用户使用体验。
1. **UI/UX**：增强了细节展示（如余额、图标），新增了资金功能，调整了RPC切换逻辑等。

## 本次黑客松已完成事项

TODO

## 团队成员
| Role | Name | Wechat | Github |
| --- | --- | --- | --- |
| Product Manager | Tiny | ineedmeat |  |
| Full-Stack Engnieer | Jarvan | zzcadmin | jarvandev |
