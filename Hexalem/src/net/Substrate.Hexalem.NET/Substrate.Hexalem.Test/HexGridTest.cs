namespace Substrate.Hexalem.Tests
{
    [TestFixture]
    public class HexGridTests
    {
        private HexGrid _hexGrid;
        private HexTile _defaultTile;
        private byte[] _testBytes;

        [SetUp]
        public void Setup()
        {
            // Initialize with a medium-sized grid for testing
            _testBytes = new byte[(int)HexGridSize.Medium];
            _hexGrid = new HexGrid(_testBytes);

            _defaultTile = new HexTile(HexTileType.Grass, HexTileLevel.Normal);
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
            _hexGrid[0] = _defaultTile;
            Assert.That(_hexGrid[0], Is.EqualTo(_defaultTile));
        }

        [Test]
        public void Indexer_2D_ShouldGetAndSetValue()
        {
            _hexGrid[0, 0] = _defaultTile;
            Assert.That(_hexGrid[0, 0], Is.EqualTo(_defaultTile));
        }

        [Test]
        public void Indexer_2D_WithInvalidCoordinate_ShouldThrowException()
        {
            Assert.Throws<NotSupportedException>(() => _hexGrid[10, 10] = _defaultTile);
        }


        [Test]
        public void GetNeighbors_ShouldReturnCorrectNeighbors()
        {
            var expectedNeighborCount = 6; // A hexagon should have 6 neighbors
            Assert.Multiple(() => {
                Assert.That(_hexGrid.GetNeighbors(0, 0).Count, Is.EqualTo(expectedNeighborCount)); // Assuming (0,0) is the center
                Assert.That(_hexGrid.GetNeighbors(-1, 1).Count, Is.EqualTo(expectedNeighborCount));
                Assert.That(_hexGrid.GetNeighbors(0, 1).Count, Is.EqualTo(expectedNeighborCount));
            });
        }

        [Test]
        public void GetNeighbors_WithExternalCell_ShouldReturnCorrectNeighbors()
        {
            Assert.Multiple(() =>
            {
                Assert.That(_hexGrid.GetNeighbors(-2, -2).Count, Is.EqualTo(3)); // bottom middle
                Assert.That(_hexGrid.GetNeighbors(2, 2).Count, Is.EqualTo(3)); // top middle

                Assert.That(_hexGrid.GetNeighbors(2, 0).Count, Is.EqualTo(4)); // top right middle
                Assert.That(_hexGrid.GetNeighbors(0, -2).Count, Is.EqualTo(4)); // bottom right middle

                Assert.That(_hexGrid.GetNeighbors(0, 2).Count, Is.EqualTo(4)); // top left middle
                Assert.That(_hexGrid.GetNeighbors(-2, 0).Count, Is.EqualTo(4)); // bottom left middle

                Assert.That(_hexGrid.GetNeighbors(-2, 2).Count, Is.EqualTo(2)); // left
                Assert.That(_hexGrid.GetNeighbors(2, -2).Count, Is.EqualTo(2)); // right
            });
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