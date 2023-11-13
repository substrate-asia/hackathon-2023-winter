namespace Substrate.Hexalem.Tests
{
    [TestFixture]
    public class HexBoardTests
    {
        private HexBoard hexBoard;

        [SetUp]
        public void Setup()
        {
            // This method runs before each test, setting up the test environment
            hexBoard = new HexBoard(new byte[32]);
            // Assuming Initialize sets default values
            hexBoard.Initialize(1);
        }

        [Test]
        public void Initialize_ShouldSetDefaultValues()
        {
            // Arrange is handled by Setup()

            // Act
            bool result = hexBoard.Initialize(1);

            // Assert
            Assert.IsTrue(result, "Initialize should return true.");
            Assert.That(hexBoard.HexBoardState, Is.EqualTo(HexBoardState.Round), "Initial state should be 'Round'.");
            Assert.That(hexBoard.HexBoardRound, Is.EqualTo(0), "Initial round should be 0.");
            Assert.That(hexBoard.Players, Is.EqualTo(1), "Initial player count should be 1.");
            Assert.That(hexBoard.PlayerTurn, Is.EqualTo(0), "Initial player turn should be 0.");
            // ... Add more assertions for other initial values ...
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
            hexBoard.Players = 2;

            // Act & Assert
            Assert.That(hexBoard.Players, Is.EqualTo(2), "Players should be set to 2.");
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