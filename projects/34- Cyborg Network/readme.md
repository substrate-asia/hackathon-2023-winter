# Cyborg Network
![photo_2023-10-30 21 15 10](https://github.com/Cyborg-Network/hackathon-2023-winter/assets/93442895/5126a02f-68ab-4640-92c2-7f52b081cfdc)


## Basic Information

- Project Name: [Cyborg Network](https://cyborgnetwork.io/)
- Project Establishment: April 2023
- Whitepaper link: [Cyborg Technical Whitepaper](https://drive.google.com/file/d/1NIFXUuLOZuMIjcGDUBrnP10ZwN-w7QZS/view?usp=drive_link)
- Executive Summary: [Cyborg One Pager](https://drive.google.com/file/d/1VTMqxvwKu4QK2uE-SkW7JscCKeKr4nCu/view?usp=drive_link)

## Description

### Introduction

Cyborg network is a decentralized edge computing platform that leverages blockchain to enable IoT sensors and gateways with low-latency data processing and transmission, while offering improved storage and a distributed architecture for increased security and transparency. With a blockchain-based approach, the platform provides superior data governance, privacy, and incentives for edge server providers, making it a secure and decentralized solution for any individual or project in need of edge servers.

### Inspiration

Our team was motivated by a shared vision of leveraging blockchain technology to create practical applications in the real world. We are passionate about decentralized computing and recognize the immense potential of edge computing, which served as the inspiration behind the development of the Cyborg network.

### Current Problems

The problem lies in the potential risks associated with centralized providers in edge computing, including the extraction of excessive value and the hoarding of user data. This leads to market distortion and an alarming concentration of power and control. To address this issue, there is a need to develop decentralized systems that prioritize user control and transparency while ensuring the fair and secure distribution of computing resources.

### Our Solution

Cyborg Network is a revolution in edge computing. It introduces a decentralized approach that empowers users by giving them control over their data and computing resources. Through smart edge tracking and cryptographic encryption, the network automates app deployment, placing a strong emphasis on user-centricity and transparency. This disruptive solution aims to challenge the dominance of centralized providers in the field of edge computing.

### Tech Architecture
![Whitepaper Cyborg architecture (1)](https://github.com/Cyborg-Network/hackathon-2023-winter/assets/93442895/72fbb304-e775-418a-9686-0156fd80ea68)


### Tools used: Substrate, Rust, Javascript.

- Cyborg PoC [demo video](https://youtu.be/xHdELatEaoc)

## Already completed - before Polkadot Winter Hackathon start date 01-11-2023

Our team has successfully finalized the development of a resilient low-level client software written in Rust. This software has been optimized to run efficiently on various devices, including smaller ones like Raspberry Pi. It exposes data based on API calls, allowing seamless integration with other systems.

Additionally, we have introduced a new pallet in Substrate called "Edge Connect." This pallet enables the writing of data from an edge server directly to the Blockchain. It serves as a crucial component in facilitating the connectivity between edge servers and the Blockchain.

Furthermore, we have implemented a server implementation in Rust. This server communicates with all connected clients, sending API requests and collecting their responses. The responses are then posted to a specified HTTP endpoint, ensuring efficient data transmission and retrieval.

But as a recommendation from [Web 3 Foundation](https://web3.foundation/) We have started working on eliminating the centralized server implementation to promote further decentralization of the protocol. This is our old architecture which has been updated to the one in the top and worked for in this hackathon.

![10k Feet  (1)](https://github.com/Cyborg-Network/hackathon-2023-winter/assets/93442895/0fa5eab3-3bf0-49e5-9bdf-952ba345a276)

## Hackathon project submission - Enhanced Cyborg Node implementation to support full decentralized Connectivity of offchain worker

Cyborg Node Implementation: [Websocket Connection Branch](https://github.com/Cyborg-Network/cyborg-node/tree/websocket_connection)

We have been working on improving the pre existing working setup to remove centralized server implementation from the architecture and push the full functionality into the substrate off-chain worker which can be called from the pallets, so that the end user can control their deployments directly from their UI since they have connected their wallets with whose private keys we would be cryptographically encrypting the compute though the instances come from a third party that has physical access to the machines.

Sample Mockups of End user's UI (Here we have shown a product type for hosting Blockchain Nodes)

<img width="1077" alt="Screenshot 2023-12-21 at 23 50 36" src="https://github.com/Cyborg-Network/hackathon-2023-winter/assets/93442895/38dc7993-2fe7-4a74-a3b4-15b69dbb4d69">


## How to run

### Build Cyborg Node

Compile the code

```sh
cargo build --release
```

Execute the off chain worker module

```sh
./target/release/cyborg-node --dev --offchain-worker always
```

### Build Cyberhub

Run the server

```sh
cargo run
```

### Build Cyborg Smart Client

Compile the code

```sh
cargo build --release
```

Create a config using any token string

```sh
Cargo run create config "any name"
```

Execute CSC using the existing Config

```sh
./target/release/bin run
```

## About Cyborg Team

### Our team members

We are a team of Web3 enthusiasts who share the vision of creating real-world utility using blockchain technology. Our passion for decentralized computing and the potential of edge computing inspired us to build the Cyborg network.

### Barath Kanna ([Github](https://github.com/) ;  [LinkedIn](https://www.linkedin.com/in/barath-kanna-23a23a172/)) : Remote edge server, backend API, integration

Barath is an experienced entrepreneur who has a deep understanding of the technical challenges and opportunities in these areas and has significant experience in the blockchain sector. As a leader, he spearheads the team's vision and directs the overarching strategy of the Cyborg Network. He is a graduate of the [Polkadot Blockchain Academy](https://polkadot.network/development/blockchain-academy/) that was conducted at UC Berkeley.

### Kresna Sucandra ([Github](https://github.com/SHA888) ; [LinkedIn](https://www.linkedin.com/in/kresna-sucandra/)) : Substrate nodes, pallet, offchain worker, runtime

Kresna is a specialist in blockchain and decentralized systems, with notable expertise as a Rust/Substrate developer in various blockchain projects. After working with prominent blockchain projects, Kresna now oversees the development and execution of Cyborg Network's technological framework. He is the former co-founder at [Invarch Network](https://invarch.network/) which is currently a parachain on Polkadot and Kusama.

### Megha Varshini ([Github](https://github.com/) ; [LinkedIn](https://www.linkedin.com/in/megha-varshini-tamilarasan-b1247a212/)) : Operations, Education, Media

Megha has an impressive history in business development and operations, with experience spanning the startups. She is responsible for managing daily operations, forging partnerships, and ensuring the continued growth and success of the Cyborg Network. Megha is going to the Polkadot Blockchain Academy in Hong Kong in January 2024.

## Achievements

Winners - [web3hackx](https://www.hkweb3month.com/hackathon) Hackathon - Hong Kong (Nov 2024)

Top 10 Finalist - [Bybit DMCC Web3 Innovation Challenge](https://finance.yahoo.com/news/bybit-dmcc-crypto-centre-announce-100000868.html) Hackathon

[Polkadot Relayers Incubator](https://www.polkadotglobalseries.com/incubator/) - Top 14 Selected teams - Sep 2023

[Polkadot Encode Accelerator](https://www.encode.club/encode-polkadot-accelerator-2023) - Top 10 teams - Ongoing
