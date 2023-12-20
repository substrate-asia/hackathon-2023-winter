# Hexalem

Date: 7th November, Kick-Off Meeting

## Project Informations

### Description

- **Project Name:** Hexalem  
- **Initial Kickof:** Start of November '23
- **Project Type:** Multiplayer Mobile Blockchain Game
- **Genere:** Strategy / Godgame
- **Platform:** Android & iOS

### Logo

![small_logo](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/ef3a3811-a5a0-46c1-ba2a-cdf437df9a0f)

### Background ???

### Introduction

Hexalem is a multiplayer strategy game built on a hexagonal grid, designed to leverage the transparency and immutability of blockchain technology. At its core, the game is a strategic contest where players, acting as deities overseeing their realms, manage resources on a personal 5x5 grid to grow their civilization and harness the mystical energy known as Mana.

Players begin with a central home tile, expanding their territory by strategically placing and upgrading tiles that represent various biomes—each with distinct resource implications. The resources—Mana, Humans, Water, Food, Wood, Stone, and Gold—are not just game mechanics but are integral to the game’s economic system and player progression.

The blockchain aspect is crucial, as it records each move, ensuring a transparent gameplay history and providing a foundation for a trustless gaming environment. The use of blockchain also opens the door for unique game features such as proof of ownership, traceable in-game assets, and the potential for player-driven economies.

The game’s round-based mechanics allow for thoughtful, turn-by-turn gameplay, where players' actions are sequential rather than concurrent for now. This design choice respects the need for strategic planning and decision-making, which is central to the game's experience. The shared tile selection pool introduces an element of shared fate and competition, as players must anticipate and react to the choices of their opponents.

The current version of Hexalem allows players to engage with their grids, yet future updates are poised to expand the scope of interaction. Players will be able to influence their opponents' boards by utilizing mana to cast spells, potentially disrupting resource production or demolishing elemental structures. These strategic maneuvers are designed to provide a competitive edge and advance players toward their goals.

Hexalem distinguishes itself as a strategy-god game, offering an immersive single-player experience while boasting robust multiplayer functionality. The integration of blockchain technology is not merely an added feature but a core aspect of the game's architecture. It introduces a layer for digital ownership and an unbreakable backend, to host thousands of games, establishing Hexalem as a prime candidate for a mobile game first and a candidate to become a UNity Demo game for the Polkadot Unity SDK. The ambition of Hexalem is to explore and expand the frontiers of strategy gaming through the lens of blockchain innovation.

Game Core Loop: Start, Place Tile, Gain Resources, Upgrade Tile, End Turn, and Repeat

### Hackathon Deliverables & Artifacts

1. Documentation
- [Initial GDD](https://github.com/SubstrateGaming/hackathon-2023-winter/blob/main/projects/36-Hexalem/docs/GDD.md), align the idea on the game design concept and the game core loop.
- [MVP](https://github.com/SubstrateGaming/hackathon-2023-winter/blob/main/projects/36-Hexalem/docs/MVP.md), align for the minimal version to achieve
- [Backend Specification](https://github.com/SubstrateGaming/hackathon-2023-winter/blob/main/projects/36-Hexalem/docs/Pallet.md), align data model for storage, function calls, and grid algorithms.
- [Basic UI/UX](https://github.com/SubstrateGaming/hackathon-2023-winter/blob/main/projects/36-Hexalem/docs/UX.md), align the basic features and experiences for the UI.
- Testing Workflow, align test coverage to achieve, and agree on certain shortcuts, to achieve the timeline.
- Tooling, align tooling to be used for each artifact.
- [Buisness Model Ideation](https://github.com/SubstrateGaming/hackathon-2023-winter/blob/main/projects/36-Hexalem/docs/bd-model.md)

2. Backend
- [Reference Hexalem Game Engine (C#)](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/net/Substrate.Hexalem.NET/Substrate.Hexalem.NET)
- [Hexalem Unit Tests (C#)](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/net/Substrate.Hexalem.NET/Substrate.Hexalem.Test)
- [Hexalem/Substrate Integration & Wrapper](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/net/Substrate.Hexalem.NET/Substrate.Hexalem.Integration)
- [Hexalem/Substrate Integration Tests](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/net/Substrate.Hexalem.NET/Substrate.Hexalem.Integration.Test)
- (generated)[.NET API Hexalem Extension](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/net/Substrate.Hexalem.NET/Substrate.Hexalem.NET.NetApiExt)
- (not used)[WebAPI](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/net/Substrate.Hexalem.NET/Substrate.Hexalem.WebAPI), to simulate Blockchain

3. Blockchain
- [Hexalem Game Engine Pallet (Rust/Substrate)](https://github.com/SubstrateGaming/hackathon-2023-winter/blob/main/projects/36-Hexalem/src/substrate/pallets/hexalem/src/lib.rs)
- [Runtime Integration Solo (Rust/Substrate)](https://github.com/SubstrateGaming/hackathon-2023-winter/blob/main/projects/36-Hexalem/src/substrate/runtime/src/lib.rs)
- [TANSSI Integration Parachain (Rust/Substrate)](https://github.com/ajuna-network/tanssi/tree/ds/add_aaa)

4. Client
- [Unity Client (C#)](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/ui/substrate.hexalem.unity)
- [Headless Client (C#)](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/net/Substrate.Hexalem.NET/Substrate.Hexalem.Console)
- [UI/UX FIGMA](https://www.figma.com/file/G2CPE1He0xMv0BgxbBpUFT/Untitled?type=design&node-id=0-1&mode=design&t=Hq3JXp0Fpl9CQ2d0-0)

5. Additional
- (WIP)[AI Simulations](https://github.com/SubstrateGaming/hackathon-2023-winter/tree/main/projects/36-Hexalem/src/net/Substrate.Hexalem.NET/Substrate.Hexalem.Bot), for simulating opponents, and for load testing

Assets from the Unity Asset Store: 

### Team

- Rostislav Litovkin (https://github.com/RostislavLitovkin)
- Romain Friot (https://github.com/Apolixit)
- Cedric Decoster (https://github.com/darkfriend77)

## Project Folders

- `36-Hexalem`
  - `docs` (Concept documents, like the Game Design Document and more)
  - `src`
    - `generated` (Generated artifacts from the metadata of the node)
    - `net` (ref. hexalem game engine, integration, ai modules, unit tests)
    - `substrate` (pallet hexalem game, in node template)
    - `ui` (unity integration project, apk and abb releases)

## Architecture Overview

![FRIOT Romain's landscape - Big picture (Latest)](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/4fc2323e-457f-461c-b3d0-d608b405c763)

### Datamodel & Entities

![Leeres Diagramm](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/4259d92f-de42-4767-bec6-c5cf62caab76)

### Backend

**Substrate Blockchain**
- **Pallet Hexalem**
  - **Testing**: Localhost 
    - URL: `ws://127.0.0.1:9944`
  - **Production**: Tanssi 
    - URL: `wss://fraa-dancebox-3023-rpc.a.dancebox.tanssi.network/`

### Frontend Client

**Unity Mobile Client**
- **Unity Client**
  - **Testing**: 
    - Methods: Unity Simulator and Android Live Debug on Device
  - **Production**: 
    - Google App Store - Internal Testing 
    - [App Store Link](https://play.google.com/apps/internaltest/4700550332736328157)

**Additional Repository for Tanssi Integration**
- [Tanssi Integration on GitHub](https://github.com/ajuna-network/tanssi/tree/ds/add_aaa)


## Demo & Visuals

### Screenshots (Samsung S23)

<p align="center">
  <img src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/7a65b571-bb2d-41a7-971a-d3c4f9caaa56" alt="Start Screen" width="30%"/>
  <img src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/6945795a-455b-4ae4-8e3f-c5ec4e37ad1a" alt="Choose Screen" width="30%"/>
  <img src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/1fe8e685-d1ea-4809-855b-d095732aa9a6" alt="Place Tile" width="30%"/>
</p>

<p align="center">
  <img src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/0128997a-e108-4777-aca0-415c6a6f25f1" alt="Upgrade Tile" width="30%"/>
  <img src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/c4c4ee8b-1cc6-4c3a-9aab-9a25a92dc277" alt="Ranking Players" width="30%"/>
  <img src="https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/62097337-bc52-4386-92ac-9d709d88c8f3" alt="Made with Unity" width="30%"/>
</p>

## Future Features planed

### The Lobby Matchmaker
To have proper matchmaking, that queues players looking for a game according to their ranking in different clusters. [pallet_matchmaker](https://github.com/ajuna-network/pallet-ajuna-matchmaker/blob/master/src/lib.rs)

### The Hidden Agenda (Private Player Goals)
Add multiple target goals and a selection at the beginning of the game that uses the [Choose](https://github.com/ajuna-network/pallet-ajuna-rps/blob/937bd81d823cea007c6ef20f48edc7c0ac752dba/src/lib.rs#L378) & [Reveal](https://github.com/ajuna-network/pallet-ajuna-rps/blob/937bd81d823cea007c6ef20f48edc7c0ac752dba/src/lib.rs#L412) concept, to add a small privacy layer.

  - Player choose 1 of 5 exposed winning conditions.
  - Player hash, the choice with a seed.
  - Hash is stored, on chain, seed is kept private on the player client.
  - When achieving the game goal, the player can call for the win, by revealing his seed and proving his choice from the begining
  - If verified and true, he won the game
  - Else the game continues, with the player having exposed his target, and making him easier to combat.

### Account/Wallet Creation
To make sure we can add new players and accounts, we need to add the [.NET API Wallet](https://github.com/SubstrateGaming/Substrate.NET.Wallet) project and integrate an onboarding workflow, similar to the one The Big Ballz of Bajun did.
![image](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/8f0db391-ef3a-49b9-937b-bfa82dab5f50)

## Why Pallet and not EVM

Pallets offer enhanced flexibility and integration, especially in C# environments, by exposing comprehensive metadata like types, calls, events, errors, and constants. This allows seamless interaction with the Substrate blockchain, similar to conventional backend systems. Current advancements aim to reduce latency to around 6 seconds.

Using a pallet as a game engine enables leveraging extensive on-chain functionalities. For instance, pallet_nfts provide on-chain attributes, significantly enhancing NFT utility.

While this flexibility is advantageous, it also brings greater responsibility.
