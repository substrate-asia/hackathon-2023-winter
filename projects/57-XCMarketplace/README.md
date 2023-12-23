<p style="text-align: center;">
    <img style="display: inline; width: 20vw;" alt="XCMarketplace" src="https://hackmd.io/_uploads/rJTzvKAXT.svg" >
</p>

### Project name

XCMarketplace

### Project Description

Unified NFT protocol using XCM.

### What problems and what solutions

Today's substrate and Polkadot NFT ecosystem is fractured. There are different protocols and standards which make developing on top of NFTs tedious as you need to filter depending on their features specificities. We want to solve this problem using a unified protocol based on XCM.

### General framework and technical architecture

We will mainly use XCM, either via a custom substrate pallet or a smart contract, depending on the available features.

(I think it's fine to just say we're going to make a pallet here)

## Idea

We only send messages, we don't hold the NFTs.
All chains that want to use our marketplace have to implement XCM to interface with whatever NFTs they use.
We could let people pay with any asset (using an external DEX).

## Project Video Introduction

https://clipchamp.com/watch/DVNogyLvk4z
https://www.youtube.com/watch?v=R3axwAxh-Po

## Repository Links:

# Frontend & Indexer

https://github.com/XCMarketplace/XCMarketUI

# Parachains

https://github.com/XCMarketplace/demo_environment

## Project Diagram

![diagram](./images/project-diagram.png)
