## 基本资料

项目名称：EVM account mapping

项目立项日期 (哪年哪月)：2023/11

## 项目整体简介

### Background

When people discuss the reasons that block users from entering the Polkadot world, they will mention difficulties in wallet acceptance.

Almost every Web3 user has an Ethereum wallet, and if Polkadot can support operations using Ethereum wallets like MetaMask, it may reduce the difficulty for new users to try.

### Introduction

We have implemented a Substrate pallet and a lightweight frontend SDK, allowing users to operate on the Substrate chain using their MetaMask wallet.
The pallet is very lightweight without any additional dependencies. Unlike Frontier, it directly maps the user's ETH wallet to the corresponding Substrate address instead of creating a new account programmatically. In other words, users can easily migrate to a Polkadot wallet anytime.

### Demo

[OneDrive](https://1drv.ms/v/s!AipA6eXBza6Khp1NDiOCu3qlhyXV8g?e=U0m00r)

## 黑客松期间计划完成的事项

- The pallet
- The frontend SDK
- A demo dApp

## 黑客松期间所完成的事项 (2023年12月22日上午11:59初审前提交)

- 2023年12月22日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

## 队员信息

### Jun Jiang (jasl)

GitHub: https://github.com/jasl

Substrate developer.

### Leechael

GitHub: https://github.com/Leechael

Frontend developer.
