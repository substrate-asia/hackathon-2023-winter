namespace Substrate.Hexalem.Tests
{
    [TestFixture]
    public class HexGridTests
    {
        private HexGrid _hexGrid;
        private byte[] _testBytes;

        [SetUp]
        public void Setup()
        {
            // Initialize with a medium-sized grid for testing
            _testBytes = new byte[(int)HexGridSize.Medium];
            _hexGrid = new HexGrid(_testBytes);
        }

        [Test]
        public void ImplicitConversion_ToByteArray_ShouldSucceed()
        {
            byte[] byteArray = _hexGrid;
            Assert.That(byteArray.Length, Is.EqualTo(_testBytes.Length));
        }

        [Test]
        public void ImplicitConversion_FromByteArray_ShouldSucceed()
        {
            var hexGrid = (HexGrid)_testBytes;
            Assert.IsNotNull(hexGrid);
        }

        [Test]
        public void Indexer_1D_ShouldGetAndSetValue()
        {
            _hexGrid[0] = 10;
            Assert.That(_hexGrid[0], Is.EqualTo(10));
        }

        [Test]
        public void Indexer_2D_ShouldGetAndSetValue()
        {
            _hexGrid[0, 0] = 20;
            Assert.That(_hexGrid[0, 0], Is.EqualTo(20));
        }

        [Test]
        public void GetNeighbors_ShouldReturnCorrectNeighbors()
        {
            var neighbors = _hexGrid.GetNeighbors(0, 0); // Assuming (0,0) is the center
            var expectedNeighborCount = 6; // A hexagon should have 6 neighbors
            Assert.That(neighbors.Count, Is.EqualTo(expectedNeighborCount));
        }

        [Test]
        public void IsValidHex_ShouldReturnTrueForValidHex()
        {
            Assert.That(_hexGrid.IsValidHex(0, 0), Is.True); // Center hex
        }

        [Test]
        public void IsValidHex_ShouldReturnFalseForInvalidHex()
        {
            Assert.IsFalse(_hexGrid.IsValidHex(10, 10)); // Out of range hex
        }

        // Additional tests for edge cases and other scenarios...
    }
}