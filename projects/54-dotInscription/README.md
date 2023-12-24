# Dot Inscription

## Background of the project

Recently, memes from BRC 20 to ORC 20 and "Wizards" to "Frog Pepe" have sparked FOMO in the Bitcoin ecosystem. Alongside the Ordinals protocol, Bitcoin Script protocol RGB and various Layer 2 projects have become hot trends. New projects aim to join and build the Bitcoin ecosystem, capitalizing on renewed opportunities.

Despite script market potential with fair launch and decentralized features, a critical issue remains—the script's indexer. This application, retrieving transaction data, is crucial; without it, there is no script. However, current indexers on project servers contradict decentralization, allowing teams to alter rules and invalidate user scripts.

This project aims to address this issue, unlocking the full potential of the script market. DotInscription is a Polkadot parachain designed to serve as a decentralized indexer deployment platform for scripts. The project teams behind scripts need to bring their indexers on-chain in the form of smart contracts on DotInscription. These indexers will only retrieve data from nodes on other chains, achieving a truly decentralized indexer.

## Technical
We implement smart contracts on our own chain, enabling data retrieval from other block nodes to ensure data security. Using Rust as the contract language provides high performance. Concurrent support is available among multiple indexers. XCM technology is employed to ensure data transmission, greatly enhancing the decentralization and stable operation of the indexing program.

### Summary
DotInscription brings decentralized security assurance to scripts, further unleashing the potential of the script market. With the support of Dot technology, it significantly advances this paradigm shift, completing the infrastructure development of the script market and addressing the most challenging obstacles in the script market.


## Who are we?

- harlan009 - Team leader 
- xun0x78 - Product ma