### User Experience of "Hexalem" Multiplayer

#### 1. **Login and Preparation**
- **User Login**: Players log in to their accounts, providing an additional layer of security by decrypting their private key with a password.
- **Dashboard View**: Upon successful login, players are greeted with a dashboard displaying current queues for multiplayer games.
- **Queue Up**: Players select to join a queue, indicating their readiness to participate in a match.

#### 2. **Matching and Game Initiation**
- **Matchmaking**: The system automatically matches players within similar ranking brackets.
- **Game Load**: Once a partner is found, the game interface loads, marking the start of the multiplayer session.

#### 3. **Starting Tile Selection**
- **Initial Choice**: Players are presented with three variations of starting tiles.
- **Selection**: Each player selects their preferred starting tile to initiate their strategy.

#### 4. **God Phase**
- **Strategic Debuffing**: Players enter the 'God Phase' where they can impose negative effects on the grid.
- **Choice of Debuffs**: Players choose between applying one, two, or three negative effects, with a trade-off between the number of tiles affected and the severity of the effect.
- **Hashing and Storage**: Selected fields and their effects are hashed and stored on the blockchain. The hash seed is retained on the client for later revelation when a tile is triggered.

#### 5. **Play Phase**
- **Grid Initialization**: Both players start with an empty 5x5 hexagonal grid, with the central four tiles reflecting their initial choices.
- **Turn-Based Play**: Players alternate turns. A random draw determines who starts.
- **Tile Acquisition**:
  - Each turn, a player can acquire one tile for free.
  - Players may purchase additional tiles using in-game gold.

- **Tile Replenishment**:
  - When tile supply drops below 50%, players can request replenishment.
  - The replenishment adds an increasing number of tiles (initially 4, then 6, etc.).

#### 6. **Mana and Disasters**
- **Mana Accumulation**: Players gather Mana as the game progresses.
- **Unleashing Disasters**: Accumulated Mana can be spent to unleash disasters on the opponent's grid.

#### 7. **Endgame Scenarios**
- **Defeat by Extinction**: A player loses if all their human units are eliminated.
- **Victory by Completion**: Filling up the grid triggers a win condition.
- **Alternative War Ending**:
  - If a player fills their grid, both grids are evaluated for their tile composition and corresponding human strength.
  - The resulting armies clash, determining the winner through a simulated battle.

#### 8. **Post-Game**
- **Results and Rewards**: The outcome of the match is displayed, along with any rewards or ranking changes.
- **Feedback and Improvement**: Players are encouraged to provide feedback or tips for improvement.
- **Next Match Option**: Players can choose to queue for another match or exit the game.

---

This user experience design for "Hexalem" aims to blend strategy, player choice, and blockchain technology into a cohesive and engaging multiplayer game. The seamless transition between phases ensures a dynamic and interactive gaming session, keeping players engaged from start to finish.
