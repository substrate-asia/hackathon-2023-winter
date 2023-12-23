# Backend Requirements

Designing a Substrate pallet for the backend of "Hexalem" requires careful planning to ensure that all game mechanics are effectively supported by the blockchain infrastructure. Here's an outline of the requirements and features that the pallet needs to handle:

### Requirements and Features for Hexalem's Substrate Pallet

#### 1. **Matchmaking System**
- **Queue Management**: Handle player queues for matchmaking, ensuring fair and efficient pairing based on rankings or other criteria.
- **Match Records**: Record details of matches, including participating players, match timestamps, and outcomes.

#### 2. **Game State Management**
- **Grid State**: Store and update the state of each player's 5x5 hexagonal grid.
- **Tile Management**: Track the type and status of each tile on the grid, including ownership and any applied effects.
- **Resource Tracking**: Monitor and update player resources (Gold, Human, Food, Wood, Water, Mana).

#### 3. **Gameplay Mechanics Implementation**
- **Tile Selection and Placement**: Facilitate the initial tile selection and subsequent placements during gameplay.
- **God Phase Handling**: Manage the selection and application of negative effects during the God Phase, including hashing and on-chain storage.
- **Turn-Based Logic**: Implement the turn-based structure of the game, ensuring fair play.

#### 4. **Randomness and Fair Play**
- **Random Tile Generation**: Integrate a fair and unbiased mechanism for random tile generation and replenishment.
- **Disaster Mechanism**: Implement Mana-based disaster triggering with verifiable randomness.

#### 5. **Scalability and Performance Optimization**
- **Efficient State Management**: Optimize for efficient storage and retrieval of game states.
- **Scalability Considerations**: Design the pallet to handle increasing numbers of players and transactions.

#### 6. **Blockchain Events and Notifications**
- **Event Logging**: Log significant game events and state changes on the blockchain for transparency and auditability.
- **Notification System**: Implement a system for notifying players of game updates, turns, and results.

---

The Substrate pallet for "Hexalem" will act as the backbone of the game's on-chain functionality, ensuring a seamless, secure, and engaging multiplayer experience. Careful implementation of these requirements and features is crucial for the game's success, especially considering the integration of blockchain technology into the gaming experience.

#### Hexa Grid Calculations

```pseudocode
Function GetNeighbors(q, r):
    // Define the six possible directions from any given hexagon
    Directions = [(0, -1), (+1, -1), (+1, 0), (0, +1), (-1, +1), (-1, 0)]

    Neighbors = []

    For each direction in Directions:
        neighbor_q = q + direction[0]
        neighbor_r = r + direction[1]

        // Check if the neighbor is within the bounds of the 5x5 grid
        If IsValidHex(neighbor_q, neighbor_r):
            Neighbors.append((neighbor_q, neighbor_r))

    Return Neighbors

Function IsValidHex(q, r):
    // Define the bounds of the 5x5 hexagonal grid
    // Note: These bounds depend on how you're visualizing your grid.
    // Adjust the bounds accordingly.
    MaxDistanceFromCenter = 2 // Maximum distance from the center (0,0) hex

    // Calculate the distance from the center using Manhattan distance for hex grid
    distance = (abs(q) + abs(q + r) + abs(r)) / 2

    Return distance <= MaxDistanceFromCenter
```

- `GetNeighbors(q, r)` calculates the neighbors for the hexagon at axial coordinates `(q, r)`.
- The `Directions` array contains the relative coordinates for all six neighboring positions in a flat-topped hexagonal grid.
- `IsValidHex(q, r)` checks if the hexagon is within the bounds of your 5x5 grid. The function for checking validity (`IsValidHex`) might need adjustment depending on how you visualize and implement your grid.
- The maximum distance from the center is 2 for a 5x5 grid, as the farthest hexes from the center are two steps away in any direction.

This approach ensures you're only adding valid hexagons that exist within your defined grid size. Adjust the `IsValidHex` function as needed based on how you define the limits of your grid.

---

![Axial Coordinates](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/e2431c27-907a-4233-8088-a34d8888bf06)

---

![datamodel](https://github.com/SubstrateGaming/hackathon-2023-winter/assets/17710198/994cffa1-3172-46c0-a770-95d1f3d8ee82)

