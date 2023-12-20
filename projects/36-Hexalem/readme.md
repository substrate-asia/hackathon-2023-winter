# Hexalem

Date: 7th November, Kick-Off Meeting

## Project Informations

### Description
- Project Name: Hexalem
- Initial Kickof: Start of November '23

### Logo

### Background

### Introduction

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

### Datamodel adn Entities

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