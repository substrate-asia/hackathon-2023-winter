## Basic Information

Project Name: zkAdventure

Date of Project Establishment (Which year and month): 2023.12

## Overall Project Profile
This project is a decentralized application (DApp) for a text adventure game built on the Ethereum blockchain, featuring a smart contract backend and a machine learning (ML) model for dynamic gameplay. The game utilizes Zero-Knowledge Machine Learning (ZKML) concepts to create an engaging and unique player experience in a blockchain-based environment.

In this text-based adventure, players embark on a journey as a treasure hunter in an enchanted world. The game's narrative is rich and immersive, with players navigating through mysterious forests, ancient ruins, and mystical lands. Each decision made by the player influences the direction of the story, leading to multiple possible endings.

Decision Making: At each stage of the game, players are presented with various scenarios where they must make choices. These decisions impact the game's progression and outcomes.

Levels and Progress: Players advance through levels by making choices and solving puzzles. Progress is tracked on the Ethereum blockchain, ensuring transparency and security.

Dynamic Outcomes: The integration of a decision tree ML model means each player's choice can lead to different scenarios, making the gameplay dynamic and unpredictable.
Blockchain and ML Integration

Smart Contract: The game logic, including player progress and outcomes, is managed through Ethereum smart contracts, allowing for a decentralized gaming experience.
Machine Learning: Player choices are processed through an ML model, providing a unique outcome based on various factors, enhancing the depth and replayability of the game.

ZKML Concepts: The game incorporates ZKML to ensure that player achievements and decisions are verified without revealing specific details, adding an extra layer of privacy and intrigue.

Certainly! To make the decision tree model more complex and interesting for the text adventure game, we can introduce additional features and create more nuanced relationships between the inputs and the outcomes. This will make the game more engaging and less predictable. Here's an enhanced scenario:

### Attributes
1. **Terrain**: Types could include Forest, Mountain, Desert, or River.
2. **Weather**: Sunny, Rainy, Foggy, or Windy.
3. **Health Level**: Low, Medium, or High.
4. **Enemy Proximity**: Near or Far.
5. **Magic Level**: None, Low, Medium, or High.

### Dataset
| Time of Day | Equipment | Companion | Terrain | Weather | Health Level | Enemy Proximity | Magic Level | Outcome               |
|-------------|-----------|-----------|---------|---------|--------------|-----------------|-------------|-----------------------|
| Day         | Yes       | Partner   | Forest  | Sunny   | High         | Far             | Medium      | Find Rare Artifact    |
| Night       | No        | Alone     | Mountain| Windy   | Low          | Near            | None        | Fall into a Trap      |
| Day         | Yes       | Alone     | Desert  | Hot     | Medium       | Far             | Low         | Discover Hidden Oasis |
| ...         | ...       | ...       | ...     | ...     | ...          | ...             | ...         | ...                   |



## Things planned to be accomplished during the hackathon

### Smart Contract Development

- `zkAdventure Contract`
  - [ ] Function for starting a new game (`function startGame()`)
  - [ ] Function for making choices in the game (`function makeChoice(string memory choice)`)
  - [ ] Function to update player progress (`function updateProgress(uint newLevel, string memory outcome)`)
  - [ ] Function to end the game (`function endGame()`)
  - [ ] Additional game-related functions as required

### Machine Learning Model Integration

- `Decision Tree Model Server`
  - [ ] Setup and deploy the ML model server
  - [ ] Endpoint for processing player choices and returning outcomes (`/predict` endpoint)
  - [ ] Integration testing with the smart contract and frontend

### Frontend Development (if time permits)

- **Web Application**
  - [ ] User registration and wallet connection page
  - [ ] Game interface for displaying story and accepting player choices
  - [ ] Dynamic outcome display based on ML model responses
  - [ ] Player progress tracking and display

- **Additional Features** 
  - [ ] Enhanced user interface design
  - [ ] Implementing additional game scenarios and outcomes
  - [ ] Real-time updates and notifications

### Testing and Quality Assurance

- [ ] Smart contract testing on a testnet (e.g., Rinkeby or Ropsten)
- [ ] End-to-end testing of the DApp (smart contract, ML model, frontend)
- [ ] Performance and security testing

### Documentation and Final Submission

- [ ] Update project README with comprehensive documentation
- [ ] Prepare a demonstration video or presentation (if required)
- [ ] Submit final Pull Requests (PRs) to the main repository

---

## Things accomplished during the Hackathon (submitted by 11:59am Dec 22, 2023 initial review)

- By December 22, 2023, 11:59 AM, list in this column the feature points that were finalized during the hackathon.
- Place the relevant code in the `src` directory and list in this column the development work done during the hackathon and the code structure. We will do a focused technical review of these directories/files.
- Demo videos, ppts and other large files should not be submitted. You can store their link addresses in the readme

## Team Information

@only4sim
Core Developer
WeChat account: v136177849

