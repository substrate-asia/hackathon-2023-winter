## Basic Info

Project Name: Monte Carlo

## Project Details

### Introduction
Monte Carlo is a decentralized AI app platform.
We provide an open AI application platform, where developers can deploy their own AI applications and generate results through decentralized computing power. 
Users can pay cryptocurrency to the AI application, such as generating NFT images, consulting agents for investment advice, etc. 
The payment will be distributed by smart contracts, and the specific profit-sharing ratio is determined by the developers.

### Background
Many builders are trying adopting on-chain-analytics + LLM,  NFT + AIGC or blockchain-based games + AI agent. 
But no practical Web3-native AI infra to support them yet

### Insights
Web3-native AI infrastructure holds significant potential in revolutionizing the way artificial intelligence operates and interacts. The primary benefits are centered around composability - with Web3, different AI tools can be seamlessly combined for better functionality, creating a more cohesive and multi-dimensional system. Also, it offers better verifiability, ensuring the transparency and reliability of AI operations. Importantly, Web3-native AI respects authentic rights of invention, providing the option to share benefits from any derivable concepts, leading to a fairer and more inclusive creation landscape. It also promises cost-efficiency and could be pivotal in aiding AI startups, particularly by providing easy access to GPU computing powers. Harnessing the power of Web3 tokenomics, such infrastructure could incentivize global GPU resource contributions, building a vibrant, worldwide community. Additionally, by making high-end AI technology more accessible and understandable for the broader public, it could help in popularizing these advanced concepts, thereby fostering an environment of innovation and inclusivity.

### Architecture
Monte Carlo is an open AI App platform. 
Developers can develop apps based on the platform's smart contracts.
Smart contracts are responsible for independent functional modules, such as LLM/AIGC, which will create tasks and hand them over to the work pool for execution. 
The work pool is responsible for organizing and scheduling computing resources, which are the workers. 
Users can register their own devices as workers, and we provide ready-to-use deployment scripts that will automatically install some essential software.

### Links
- Demo Website: https://dot.monte-carlo.ai/
- Demo Video: https://www.youtube.com/watch?v=pjopplp5L_8
- Logo: https://monte-carlo.ai/logo.png
- Slides: https://monte-carlo.ai/dot.pdf

## Plan to do during hackathon

**Blockchain**
- [ ] PoC: leverage ipynb and ink to implement custom AI script
- [ ] Image AIGC worker script for offchain execution

**Web Client**
- [ ] Polkadot.js wallet integration
- [ ] Explorer for workers, apps and tasks
- [ ] Submit task to blockchain


## Done during hackathon

We have shipped an open AI app platform, and deployed several image generation AIGC apps to demonstrate how developers use the platform's functional services to develop applications. 
In the future, we will deploy and execute custom scripts through ink. Currently, we have just completed the PoC.

File structure:
- web-frontend: integrated with polkadot.js, implementing the functions of task creation, viewing, and worker monitoring.
- offchain-image-aigc: scripts for workers to execute image generation AGIC tasks off-chain.
- poc-ai-script: PoC of custom AI script, leverage ipynb to implement the protocol and the script will be deployed in the smart contract(ink!).

## Team members

- Haiyang: Web engineer. Microsoft Senior Engineer, and excels in web development. GitHub: @callmewhy
- Jun: Blockchain engineer. Co-founder of Phala Network. He possesses thorough knowledge in blockchain and backend skills. GitHub: @jasl
