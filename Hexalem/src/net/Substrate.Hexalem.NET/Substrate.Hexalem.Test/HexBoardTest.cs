using Substrate.Hexalem.Engine;
using Substrate.Hexalem.Engine.GameException;

namespace Substrate.Hexalem.Tests
{
    [TestFixture]
    public class HexBoardTests
    {
        private HexaBoard _hexGridSmall;
        private HexaBoard _hexGridMedium;
        private HexaTile _defaultTile;

        [SetUp]
        public void Setup()
        {
            // Initialize with a medium-sized grid for testing
            _hexGridMedium = new HexaBoard(new byte[(int)GridSize.Medium]);

            // Initialize with a small-sized grid for testing
            _hexGridSmall = new HexaBoard(new byte[(int)GridSize.Small]);

            _defaultTile = new HexaTile(TileType.Grass, 0, TilePattern.Normal);
        }

        [Test]
        public void Constructor_ValidSize_CreatesBoard()
        {
            byte[] bytes = new byte[(int)GridSize.Medium];
            var board = new HexaBoard(bytes);

            Assert.That(board, Is.Not.Null);
        }

        [Test]
        public void Constructor_InvalidSize_ThrowsException()
        {
            byte[] bytes = new byte[10]; // Not a valid board size

            Assert.Throws<NotSupportedException>(() => new HexaBoard(bytes));
        }

        [Test]
        public void Indexer_1D_ShouldGetAndSetValue()
        {
            _hexGridMedium[0] = _defaultTile;
            Assert.That(_hexGridMedium[0], Is.EqualTo(_defaultTile.Value));
        }

        [Test]
        public void Indexer_2D_ShouldGetAndSetValue()
        {
            _hexGridMedium[0, 0] = _defaultTile;
            Assert.That(_hexGridMedium[0, 0], Is.EqualTo(_defaultTile.Value));
        }

        [Test]
        public void GetIndex_ValidCoordinates_ReturnsCorrectIndex()
        {
            int? index = _hexGridMedium.ToIndex((0, 0)); // Replace with valid coordinates for your grid

            Assert.That(index, Is.EqualTo(12));
        }

        [Test]
        public void GetIndex_InvalidCoordinates_ThrowsException()
        {
            Assert.Throws<InvalidMapCoordinate>(() => _hexGridMedium.ToIndex((-10, 10)));
        }

        [Test]
        public void GetNeighbors_ValidCoordinates_ReturnsCorrectNeighbors()
        {
            var neighbors = _hexGridMedium.GetNeighbors((0, 0));

            Assert.That(neighbors.Count, Is.EqualTo(6));
        }

        [Test]
        public void IsValidHex_ValidCoordinates_ReturnsTrue()
        {
            Assert.That(_hexGridMedium.IsValidHex(0, 0), Is.True);
        }

        [Test]
        public void IsValidHex_InvalidCoordinates_ReturnsFalse()
        {
            Assert.That(_hexGridMedium.IsValidHex(-10, 10), Is.False);
        }

        [Test]
        public void ToIndex_NegativeCoords_ReturnsZero()
        {
            Assert.That(_hexGridMedium.ToIndex((-2, -2)), Is.EqualTo(0), "Index should be 0 for coordinates (-2, -2)");

            Assert.That(_hexGridMedium.ToIndex((0, 0)), Is.EqualTo(12), "Index should be 0 for coordinates (-2, -2)");

            Assert.That(_hexGridMedium.ToIndex((2, 2)), Is.EqualTo(24), "Index should be 0 for coordinates (-2, -2)");
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
            var calculatedIndex = _hexGridMedium.ToIndex((q, r));
            Assert.That(calculatedIndex, Is.EqualTo(index));

            var calculatedCoord = _hexGridMedium.ToCoords(index);
            Assert.That(calculatedCoord, Is.EqualTo((q, r)));
        }

        [Test]
        public void GetNeighbors_CentralTile_ShouldReturnSixNeighbors()
        {
            // Arrange
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);
            var centralCoord = (0, 0);
            var expectedNeighbors = new List<(int, int)?>
            {
                (0, -1), (1, -1), (1, 0),
                (0, 1), (-1, 1), (-1, 0)
            };

            // Act
            var neighbors = hexaBoard.GetNeighbors(centralCoord);

            // Assert
            Assert.That(neighbors.Count, Is.EqualTo(expectedNeighbors.Count), "Number of neighbors should match");
            for (int i = 0; i < expectedNeighbors.Count; i++)
            {
                Assert.That(neighbors[i], Is.EqualTo(expectedNeighbors[i]), $"Neighbor {i} does not match");
            }
        }

        [Test]
        public void GetNeighbors_FirstTile_ShouldReturnSixNeighbors()
        {
            // Arrange
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);
            var centralCoord = (-2, -2);
            var expectedNeighbors = new List<(int, int)?>
            {
               null, null, (-1, -2),
                 (-2, -1), null, null
            };

            // Act
            var neighbors = hexaBoard.GetNeighbors(centralCoord);

            // Assert
            Assert.That(neighbors.Count, Is.EqualTo(expectedNeighbors.Count), "Number of neighbors should match");
            for (int i = 0; i < expectedNeighbors.Count; i++)
            {
                Assert.That(neighbors[i], Is.EqualTo(expectedNeighbors[i]), $"Neighbor {i} does not match");
            }
        }

        [Test]
        public void GetNeighbors_LastTile_ShouldReturnSixNeighbors()
        {
            // Arrange
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);
            var centralCoord = (2, 2);
            var expectedNeighbors = new List<(int, int)?>
            {
                (2, 1),  null, null,  null,null,(1, 2),
            };

            // Act
            var neighbors = hexaBoard.GetNeighbors(centralCoord);

            // Assert
            Assert.That(neighbors.Count, Is.EqualTo(expectedNeighbors.Count), "Number of neighbors should match");
            for (int i = 0; i < expectedNeighbors.Count; i++)
            {
                Assert.That(neighbors[i], Is.EqualTo(expectedNeighbors[i]), $"Neighbor {i} does not match");
            }
        }

        [Test]
        public void GetNeighborsSmall_FirstTile_ShouldReturnSixNeighbors()
        {
            // Arrange
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Small]);
            var centralCoord = (-1, -1);
            var expectedNeighbors = new List<(int, int)?>
            {
                null,  null, (0, -1),  (-1, 0), null, null
            };

            // Act
            var neighbors = hexaBoard.GetNeighbors(centralCoord);

            // Assert
            Assert.That(neighbors.Count, Is.EqualTo(expectedNeighbors.Count), "Number of neighbors should match");
            for (int i = 0; i < expectedNeighbors.Count; i++)
            {
                Assert.That(neighbors[i], Is.EqualTo(expectedNeighbors[i]), $"Neighbor {i} does not match");
            }
        }

        [Test]
        [TestCase(-2, -2, 2)]  // top left
        [TestCase(2, 2, 2)]  // top middle
        [TestCase(2, 0, 4)]  // top right middle
        [TestCase(0, -2, 4)]  // bottom right middle
        [TestCase(0, 2, 4)]  // top left middle
        [TestCase(-2, 0, 4)]  // bottom left middle
        [TestCase(-2, 2, 3)]  // left
        [TestCase(2, -2, 3)]  // right
        public void GetNeighbors_WithExternalCell_ShouldReturnCorrectNeighbors(int q, int r, int RealNeighborsExpected)
        {
            Assert.Multiple(() =>
            {
                Assert.That(_hexGridMedium.GetNeighbors((q, r)).Where(x => x.HasValue).Count, Is.EqualTo(RealNeighborsExpected));
            });
        }

        [Test]
        public void GetPattern_DeltaPattern_ReturnsDeltaAndIndices()
        {
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);

            // Arrange
            var neighbors = new List<(int, HexaTile)?>
            {
                (15, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                (1, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                (6, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                null,
                null,
                null,
                null
            };

            // Act
            var pattern = hexaBoard.GetPattern(neighbors);

            // Assert
            Assert.That(pattern, Is.Not.Null, "Pattern should not be null for Delta pattern");
            Assert.That(pattern.Value.pattern, Is.EqualTo(TilePattern.Delta), "Pattern should be Delta");
            CollectionAssert.AreEqual(new[] { 15, 1, 6 }, pattern.Value.indices, "Indices should match Delta pattern");
        }

        [Test]
        public void GetPattern_LinePattern_ReturnsDeltaAndIndices()
        {
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);

            // Arrange
            var neighbors = new List<(int, HexaTile)?>
            {
                (15, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                (1, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                null,
                null,
                (6, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                null,
                null
            };

            // Act
            var pattern = hexaBoard.GetPattern(neighbors);

            // Assert
            Assert.That(pattern, Is.Not.Null, "Pattern should not be null for Line pattern");
            Assert.That(pattern.Value.pattern, Is.EqualTo(TilePattern.Line), "Pattern should be Line");
            CollectionAssert.AreEqual(new[] { 15, 1, 6 }, pattern.Value.Item2, "Indices should match Line pattern");
        }

        [Test]
        public void GetPattern_YpsilonPattern_ReturnsDeltaAndIndices()
        {
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);

            // Arrange
            var neighbors = new List<(int, HexaTile)?>
            {
                (15, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                (1, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                null,
                (6, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                null,
                (7, new HexaTile(TileType.Grass, 0, TilePattern.Normal)),
                null
            };

            // Act
            var pattern = hexaBoard.GetPattern(neighbors);

            // Assert
            Assert.That(pattern, Is.Not.Null, "Pattern should not be null for Ypsilon pattern");
            Assert.That(pattern.Value.pattern, Is.EqualTo(TilePattern.Ypsilon), "Pattern should be Ypsilon");
            CollectionAssert.AreEqual(new[] { 15, 1, 6, 7 }, pattern.Value.Item2, "Indices should match Ypsilon pattern");
        }

        [Test]
        public void SetPattern_DeltaPattern_ReturnsBoardWithSetPatterns()
        {
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);
            hexaBoard[6] = new HexaTile(TileType.Grass, 0, TilePattern.Normal);
            hexaBoard[7] = new HexaTile(TileType.Grass, 0, TilePattern.Normal);
            hexaBoard[11] = new HexaTile(TileType.Grass, 0, TilePattern.Normal);

            // Act
            var patterns = hexaBoard.SetPatterns((-1, -1));

            // Assert
            Assert.That(patterns, Is.Not.Null, "Pattern should not be null for Delta pattern");
            Assert.That(patterns.Count, Is.EqualTo(3), "Should have three tiles as pattern");
            Assert.That(((HexaTile)hexaBoard[6]).TilePattern, Is.EqualTo(TilePattern.Delta), "Should be delta pattern");
        }

        [Test]
        public void Stats_BoardStats_ShouldReturnCorrectCounts()
        {
            var tileTypes = Enum.GetValues(typeof(TileType)).Length;
            var nbTilesNotEmpty = 7;
            // Arrange
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);

            hexaBoard.Init(0);

            // Set up the board with some tiles
            hexaBoard[0] = new HexaTile(TileType.Grass, 0, TilePattern.Normal);
            hexaBoard[1] = new HexaTile(TileType.Water, 0, TilePattern.Normal);
            hexaBoard[2] = new HexaTile(TileType.Water, 1, TilePattern.Delta);
            hexaBoard[3] = new HexaTile(TileType.Water, 1, TilePattern.Delta);
            hexaBoard[7] = new HexaTile(TileType.Water, 2, TilePattern.Delta);
            hexaBoard[22] = new HexaTile(TileType.Mountain, 2, TilePattern.Normal);

            var stats = hexaBoard.Stats();

            Assert.That(stats[TileType.Empty], Is.EqualTo((int)GridSize.Medium - nbTilesNotEmpty));

            // Home
            Assert.That(stats[TileType.Home], Is.EqualTo(1));
            Assert.That(stats[TileType.Home, (byte)0], Is.EqualTo(1));
            Assert.That(stats[TileType.Home, (byte)1], Is.EqualTo(0));
            Assert.That(stats[TileType.Home, (byte)2], Is.EqualTo(0));

            // Grass
            Assert.That(stats[TileType.Grass], Is.EqualTo(1));
            Assert.That(stats[TileType.Grass, (byte)0], Is.EqualTo(1));
            Assert.That(stats[TileType.Grass, (byte)1], Is.EqualTo(0));
            Assert.That(stats[TileType.Grass, (byte)2], Is.EqualTo(0));

            // Mountain
            Assert.That(stats[TileType.Mountain], Is.EqualTo(1));

            Assert.That(stats[TileType.Mountain, (byte)0], Is.EqualTo(0));
            Assert.That(stats[TileType.Mountain, (byte)1], Is.EqualTo(0));
            Assert.That(stats[TileType.Mountain, (byte)2], Is.EqualTo(1));

            // Watter
            Assert.That(stats[TileType.Water], Is.EqualTo(4));

            Assert.That(stats[TileType.Water, (byte)0], Is.EqualTo(1));
            Assert.That(stats[TileType.Water, (byte)1], Is.EqualTo(2));
            Assert.That(stats[TileType.Water, (byte)2], Is.EqualTo(1));

            Assert.That(stats[TileType.Water, TilePattern.Delta], Is.EqualTo(3));
        }

        [Test]
        public void CanPlace_WithNeighbors_ShouldWork()
        {
            var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);
            hexaBoard[0, 0] = new HexaTile(TileType.Home, 0, TilePattern.Normal);
            Assert.That(hexaBoard.CanPlace((1, 0)));
        }
    }
}