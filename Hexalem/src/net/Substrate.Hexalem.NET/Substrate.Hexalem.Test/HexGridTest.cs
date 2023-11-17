namespace Substrate.Hexalem.Tests
{
    [TestFixture]
    public class HexGridTests
    {
        private HexGrid _hexGridSmall;
        private HexGrid _hexGridMedium;
        private byte[] _testBytesMedium;
        
        private HexTile _defaultTile;

        [SetUp]
        public void Setup()
        {
            // Initialize with a medium-sized grid for testing
            _testBytesMedium = new byte[(int)HexGridSize.Medium];
            _hexGridMedium = new HexGrid(_testBytesMedium);

            _hexGridSmall = new HexGrid(new byte[(int)HexGridSize.Small]);
            _defaultTile = new HexTile(HexTileType.Grass, HexTileLevel.Normal);
        }

        [Test]
        public void ImplicitConversion_ToByteArray_ShouldSucceed()
        {
            byte[] byteArray = _hexGridMedium;
            Assert.That(byteArray.Length, Is.EqualTo(_testBytesMedium.Length));
        }

        [Test]
        public void ImplicitConversion_FromByteArray_ShouldSucceed()
        {
            var hexGrid = (HexGrid)_testBytesMedium;
            Assert.IsNotNull(hexGrid);
        }

        [Test]
        public void Indexer_1D_ShouldGetAndSetValue()
        {
            _hexGridMedium[0] = _defaultTile;
            Assert.That(_hexGridMedium[0], Is.EqualTo(_defaultTile));
        }

        [Test]
        public void Indexer_2D_ShouldGetAndSetValue()
        {
            _hexGridMedium[0, 0] = _defaultTile;
            Assert.That(_hexGridMedium[0, 0], Is.EqualTo(_defaultTile));
        }

        [Test]
        public void Indexer_2D_WithInvalidCoordinate_ShouldThrowException()
        {
            Assert.Throws<NotSupportedException>(() => _hexGridMedium[10, 10] = _defaultTile);
        }


        [Test]
        [TestCase(-2, -2, 0)]
        [TestCase(-1, -2, 1)]
        [TestCase(-2, -1, 5)]
        [TestCase(0, -1, 7)]
        [TestCase(0, 0, 12)]
        [TestCase(2, 0, 14)]
        [TestCase(-2, 2, 20)]
        [TestCase(2, 2, 24)]
        public void CorrelationBetweenIndexAndHexaCoord_ShouldWork(int q, int r, int index)
        {
            var calculatedIndex = _hexGridMedium.ToIndex(q, r);
            Assert.That(calculatedIndex, Is.EqualTo(index));

            var calculatedCoord = _hexGridMedium.ToAxialCoordinates(index);
            Assert.That(calculatedCoord, Is.EqualTo((q, r)));

        }

        [Test]
        public void GetNeighbors_ShouldReturnCorrectNeighbors()
        {
            var expectedNeighborCount = 6; // A hexagon should have 6 neighbors
            Assert.Multiple(() => {
                Assert.That(_hexGridMedium.GetNeighbors(0, 0).Count, Is.EqualTo(expectedNeighborCount)); // Assuming (0,0) is the center
                Assert.That(_hexGridMedium.GetNeighbors(-1, 1).Count, Is.EqualTo(expectedNeighborCount));
                Assert.That(_hexGridMedium.GetNeighbors(0, 1).Count, Is.EqualTo(expectedNeighborCount));
            });
        }

        [Test]
        public void GetNeighbors_WithExternalCell_ShouldReturnCorrectNeighbors()
        {
            Assert.Multiple(() =>
            {
                Assert.That(_hexGridMedium.GetNeighbors(-2, -2).Count, Is.EqualTo(3)); // bottom middle
                Assert.That(_hexGridMedium.GetNeighbors(2, 2).Count, Is.EqualTo(3)); // top middle

                Assert.That(_hexGridMedium.GetNeighbors(2, 0).Count, Is.EqualTo(4)); // top right middle
                Assert.That(_hexGridMedium.GetNeighbors(0, -2).Count, Is.EqualTo(4)); // bottom right middle

                Assert.That(_hexGridMedium.GetNeighbors(0, 2).Count, Is.EqualTo(4)); // top left middle
                Assert.That(_hexGridMedium.GetNeighbors(-2, 0).Count, Is.EqualTo(4)); // bottom left middle

                Assert.That(_hexGridMedium.GetNeighbors(-2, 2).Count, Is.EqualTo(2)); // left
                Assert.That(_hexGridMedium.GetNeighbors(2, -2).Count, Is.EqualTo(2)); // right
            });
        }

        [Test]
        public void IsValidHex_ShouldReturnTrueForValidHex()
        {
            Assert.That(_hexGridMedium.IsValidHex(0, 0), Is.True); // Center hex
        }

        [Test]
        public void IsValidHex_ShouldReturnFalseForInvalidHex()
        {
            Assert.IsFalse(_hexGridMedium.IsValidHex(10, 10)); // Out of range hex
        }

        [Test]
        [TestCase(-1, -1, 2)]
        [TestCase(0, 0, 6)]
        [TestCase(1, 1, 2)]
        public void GetNeighbors_SmallMap_ShouldReturnCorrectNeighbors(int q, int r, int expected)
        {
            Assert.That(_hexGridSmall.GetNeighbors(q, r).Count, Is.EqualTo(expected));
        }

        // Additional tests for edge cases and other scenarios...
    }
}