using Substrate.Hexalem.NET;
using Substrate.Hexalem.Test;

namespace Substrate.Hexalem.Tests
{
    [TestFixture]
    public class HexBoardTests : BaseTest
    {
        private HexBoard hexBoard;
        private HexPlayer[] players;

        [SetUp]
        public void Setup()
        {
            players = new HexPlayer[1] { p1 };

            // This method runs before each test, setting up the test environment
            hexBoard = new HexBoard(new byte[32]);

            // Assuming Initialize sets default values
            hexBoard.Initialize(1, HexGridSize.Medium);
        }

        [Test]
        public void InitializeBoard_SingleMode_ShouldSetDefaultValues()
        {
            // Arrange is handled by Setup()

            // Act
            bool result = hexBoard.Initialize(1, HexGridSize.Medium);

            // Assert
            Assert.IsTrue(result, "Initialize should return true.");
            Assert.That(hexBoard.HexBoardState, Is.EqualTo(HexBoardState.Round), "Initial state should be 'Round'.");
            Assert.That(hexBoard.HexBoardRound, Is.EqualTo(0), "Initial round should be 0.");
            Assert.That(hexBoard.PlayersCount, Is.EqualTo(1), "Initial player count should be 1.");
            Assert.That(players.Length, Is.EqualTo(hexBoard.PlayersCount), "All players should be instanciated");
            Assert.That(hexBoard.PlayerTurn, Is.EqualTo(0), "Initial player turn should be 0.");

            Assert.That(hexBoard.Players[0].Ressources, Is.Not.Null);
            Assert.That(hexBoard.Players[0].Ressources.Mana, Is.EqualTo(GameConfig.DefaultMana));
            Assert.That(hexBoard.Players[0].Ressources.Human, Is.EqualTo(GameConfig.DefaultHuman));
            Assert.That(hexBoard.Players[0].Ressources.Food, Is.EqualTo(GameConfig.DefaultFood));
            Assert.That(hexBoard.Players[0].Ressources.Gold, Is.EqualTo(GameConfig.DefaultGold));
            Assert.That(hexBoard.Players[0].Ressources.Water, Is.EqualTo(GameConfig.DefaultWater));
            Assert.That(hexBoard.Players[0].Ressources.Wood, Is.EqualTo(GameConfig.DefaultWood));
        }

        [Test, Ignore("Todo, increase storage size ?")]
        public void InitializeBoard_MultiPlayerMode_ShouldSetDefaultValues()
        {
            // Arrange is handled by Setup()

            // Act
            bool result = hexBoard.Initialize(2, HexGridSize.Medium);

            // Assert
            Assert.IsTrue(result, "Initialize should return true.");
            Assert.That(hexBoard.HexBoardState, Is.EqualTo(HexBoardState.Round), "Initial state should be 'Round'.");
            Assert.That(hexBoard.HexBoardRound, Is.EqualTo(0), "Initial round should be 0.");
            Assert.That(hexBoard.PlayersCount, Is.EqualTo(2), "Initial player count should be 1.");
            Assert.That(players.Length, Is.EqualTo(hexBoard.PlayersCount), "All players should be instanciated");
            Assert.That(hexBoard.PlayerTurn, Is.EqualTo(0), "Initial player turn should be 0.");

            Assert.That(hexBoard.Players[0].Ressources, Is.Not.Null);
            Assert.That(hexBoard.Players[0].Ressources.Mana, Is.EqualTo(GameConfig.DefaultMana));
            Assert.That(hexBoard.Players[0].Ressources.Human, Is.EqualTo(GameConfig.DefaultHuman));
            Assert.That(hexBoard.Players[0].Ressources.Food, Is.EqualTo(GameConfig.DefaultFood));
            Assert.That(hexBoard.Players[0].Ressources.Gold, Is.EqualTo(GameConfig.DefaultGold));
            Assert.That(hexBoard.Players[0].Ressources.Water, Is.EqualTo(GameConfig.DefaultWater));
            Assert.That(hexBoard.Players[0].Ressources.Wood, Is.EqualTo(GameConfig.DefaultWood));

            Assert.That(hexBoard.Players[1].Ressources, Is.Not.Null);
            Assert.That(hexBoard.Players[1].Ressources.Mana, Is.EqualTo(GameConfig.DefaultMana));
            Assert.That(hexBoard.Players[1].Ressources.Human, Is.EqualTo(GameConfig.DefaultHuman));
            Assert.That(hexBoard.Players[1].Ressources.Food, Is.EqualTo(GameConfig.DefaultFood));
            Assert.That(hexBoard.Players[1].Ressources.Gold, Is.EqualTo(GameConfig.DefaultGold));
            Assert.That(hexBoard.Players[1].Ressources.Water, Is.EqualTo(GameConfig.DefaultWater));
            Assert.That(hexBoard.Players[1].Ressources.Wood, Is.EqualTo(GameConfig.DefaultWood));
        }

        [Test]
        public void ShuffleSelection_ShouldWork()
        {
            _ = hexBoard.Initialize(1, HexGridSize.Medium);
            var previousSelection = hexBoard.SelectionCurrent;

            // Game has been initialized, no previous selection
            Assert.That(previousSelection, Is.Null);
            var previousNbSelection = hexBoard.Selection;

            hexBoard.ShuffleSelection(10);

            Assert.That(hexBoard.SelectionCurrent, Is.Not.Null);

            // Selection should increase
            Assert.That(previousNbSelection, Is.LessThan(hexBoard.Selection));
        }

            [Test]
        public void HexBoardState_ShouldGetAndSetValues()
        {
            // Arrange
            hexBoard.HexBoardState = HexBoardState.Reward;

            // Act & Assert
            Assert.That(hexBoard.HexBoardState, Is.EqualTo(HexBoardState.Reward), "HexBoardState should be set to 'Reward'.");
        }

        [Test]
        public void Players_ShouldGetAndSetValues()
        {
            // Arrange
            hexBoard.PlayersCount = 2;

            // Act & Assert
            Assert.That(hexBoard.PlayersCount, Is.EqualTo(2), "Players should be set to 2.");
        }

        [Test]
        public void PlayerTurn_ShouldGetAndSetValues()
        {
            // Arrange
            hexBoard.PlayerTurn = 1;

            // Act & Assert
            Assert.That(hexBoard.PlayerTurn, Is.EqualTo(1), "PlayerTurn should be set to 1.");
        }

        [Test]
        public void HexBoardRound_ShouldGetAndSetValues()
        {
            // Arrange
            byte expectedRound = 63; // Example round number
            hexBoard.HexBoardRound = expectedRound;

            // Act & Assert
            Assert.That(hexBoard.HexBoardRound, Is.EqualTo(expectedRound), "HexBoardRound should be set correctly.");
        }

        [Test]
        public void HexBoardTurn_ShouldGetAndSetValues()
        {
            // Arrange
            byte expectedTurn = 3; // Example turn number
            hexBoard.HexBoardTurn = expectedTurn;

            // Act & Assert
            Assert.That(hexBoard.HexBoardTurn, Is.EqualTo(expectedTurn), "HexBoardTurn should be set correctly.");
        }

        [Test]
        public void Selection_ShouldGetAndSetValues()
        {
            // Arrange
            byte expectedSelection = 5; // Example selection value
            hexBoard.Selection = expectedSelection;

            // Act & Assert
            Assert.That(hexBoard.Selection, Is.EqualTo(expectedSelection), "Selection should be set correctly.");
        }

        // Additional tests...
    }
}