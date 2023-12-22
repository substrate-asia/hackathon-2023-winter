pragma solidity ^0.8.0;

contract zkAdventure {
    struct Player {
        bool isActive;
        uint level;
        string lastOutcome;
        // Other player attributes can be added here
    }

    mapping(address => Player) public players;

    event GameStarted(address indexed player);
    event PlayerMadeChoice(address indexed player, string choice);
    event PlayerProgressUpdated(address indexed player, uint level, string outcome);

    // Start a new game for the player
    function startGame() public {
        require(!players[msg.sender].isActive, "Game already in progress.");
        players[msg.sender] = Player(true, 1, "Started journey");
        emit GameStarted(msg.sender);
    }

    // Player makes a choice in the game
    function makeChoice(string memory choice) public {
        require(players[msg.sender].isActive, "Start a game first.");
        // In a real game, logic to process the choice would go here
        // For demonstration, it just logs the choice
        emit PlayerMadeChoice(msg.sender, choice);
    }

    // Update player progress based on outcomes
    // This could be called by the player or potentially by an off-chain server
    function updateProgress(uint newLevel, string memory outcome) public {
        require(players[msg.sender].isActive, "Start a game first.");
        players[msg.sender].level = newLevel;
        players[msg.sender].lastOutcome = outcome;
        emit PlayerProgressUpdated(msg.sender, newLevel, outcome);
    }

    // Function to end the game for a player
    function endGame() public {
        require(players[msg.sender].isActive, "No active game to end.");
        players[msg.sender].isActive = false;
        // Reset player progress or handle end-of-game logic
    }

    // Getter function to fetch player details
    function getPlayerDetails(address playerAddress) public view returns (Player memory) {
        return players[playerAddress];
    }
}
