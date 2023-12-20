# Hexalem

Date: 7th November, Kick-Off Meeting

## Project Informations

### Description
- Project Name: Hexalem
- Initial Kickof: Start of November '23

### Logo

![small_logo](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/ef3a3811-a5a0-46c1-ba2a-cdf437df9a0f)

### Background

### Introduction

Hexalem is a multiplayer strategy game built on a hexagonal grid, designed to leverage the transparency and immutability of blockchain technology. At its core, the game is a strategic contest where players, acting as deities overseeing their realms, manage resources on a personal 5x5 grid to grow their civilization and harness the mystical energy known as Mana.

Players begin with a central home tile, expanding their territory by strategically placing and upgrading tiles that represent various biomes—each with distinct resource implications. The resources—Mana, Humans, Water, Food, Wood, Stone, and Gold—are not just game mechanics but are integral to the game’s economic system and player progression.

The blockchain aspect is crucial, as it records each move, ensuring a transparent gameplay history and providing a foundation for a trustless gaming environment. The use of blockchain also opens the door for unique game features such as proof of ownership, traceable in-game assets, and the potential for player-driven economies.

The game’s round-based mechanics allow for thoughtful, turn-by-turn gameplay, where players' actions are sequential rather than concurrent for now. This design choice respects the need for strategic planning and decision-making, which is central to the game's experience. The shared tile selection pool introduces an element of shared fate and competition, as players must anticipate and react to the choices of their opponents.

While the current implementation has players interacting with their grids, future iterations have the potential to introduce more versatile interactions, including acting on opponent boards with spells cast with mana, to harm production or destroy elemental buildings, and create an advantage to reach the own goal, adding an additional layer of strategy and competition.

Hexalem stands out as a strategy-god game that offers a rich solo experience with extensive multiplayer capabilities. Its blockchain integration isn't just a feature—it's a foundational component that offers a new dimension of gameplay and strategy, making Hexalem a fitting entry for a susbtrate-based mobile game. The game aims to push the boundaries of what is possible at the intersection of strategy gaming and blockchain technology.

As future plans, additionally to spells, the integration of 


Game Core Loop: Start, Place Tile, Gain Resources, Upgrade Tile, End Turn, and Repeat

### Hackathon Deliverables & Priority

1. Documentation
- Initial GDD, allign the idea on the game design concept and the game core loop.
- Backend Specification, allign datamodel for storage and function calls.
- Basic UI/UX, allign abput the basic features and experiences for the UI.
- Testing Workflow, allign test coverage to achieve, and agree on certain shortcuts, to achieve the timeline.
- Tooling, allign tooling to be used for each artifacts.

Challenges, address workflow for creative idea to follow an implemtation path, to avoid inconsistency.

2. Backend
- ref. game engine (C#)
- ref. game engine unit test (C#)
- WebAPI, to simulate Blockchain

3. Blockchain
- game engine pallet (Rust/Substrate)
- runtime integration solo (Rust/Substrate)
- tanssi integration parachain (Rust/Substrate)

4. Client
- Unity Client (C#)
- Headless Client (C#)

5. Additonal
- AI Opponents, for simulating training games, and loadtesting purpose
- Googla App Store, publishing for internal testing

### Team

- Rostislav Litovkin (https://github.com/RostislavLitovkin)
- Romain Friot (https://github.com/Apolixit)
- Cedric Decoster (https://github.com/darkfriend77)

## File structure

36-Hexalem
   +-- docs (Concept documents, like the Game Design Document and more)
   |
   +-- src --+-- generated (Generated artifacts from the metadata of the node)
             |
             +-- net (ref. hexalem game engine, integration, ai modules, unit tests)
             |
             +-- substrate (pallet hexalem game, in node template)
             |
             +-- ui (unity integration project, apk and abb releases)

## Architecture Overview

![FRIOT Romain's landscape - Big picture (Latest)](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/4fc2323e-457f-461c-b3d0-d608b405c763)

### Datamodel & Entities

![Leeres Diagramm](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/4259d92f-de42-4767-bec6-c5cf62caab76)

### Backend

Substrate Blockchain
- Pallet Hexalem (Testing: Localhost, Production: Tanssi)
  - Testing: Localhost - ws://127.0.0.1:9944
  - Production: Tanssi - wss://fraa-dancebox-3023-rpc.a.dancebox.tanssi.network/

### Frontend Client

Unity Mobile Client
- Unity Client
  - Testing: Unity Simulator and Android Live Debug on Device
  - Production: Google App Store - Internal Testing (https://play.google.com/apps/internaltest/4700550332736328157)

Additional repo for the Tanssi integration,
https://github.com/ajuna-network/tanssi/tree/ds/add_aaa

## Demo & Visuals

### Screenshots

## Future Features

### The Hidden Agenda (Private Player Goals)
Add multiple target goals and a selection at the beginning of the game that uses the [Choose](https://github.com/ajuna-network/pallet-ajuna-rps/blob/937bd81d823cea007c6ef20f48edc7c0ac752dba/src/lib.rs#L378) & [Reveal](https://github.com/ajuna-network/pallet-ajuna-rps/blob/937bd81d823cea007c6ef20f48edc7c0ac752dba/src/lib.rs#L412) concept, to add a small privacy layer.

  - Player choose 1 of 5 exposed winning conditions.
  - Player hash, the choice with a seed.
  - Hash is stored, on chain, seed is kept private on the player client.
  - When achieving the game goal, the player can call for the win, by revealing his seed and proving his choice from the begining
  - If verified and true, he won the game
  - Else the game continues, with the player having exposed his target, and making him easier to combat.
