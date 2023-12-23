//using NSubstitute;
//using Serilog;
//using Substrate.Hexalem.NET;

//namespace Substrate.Hexalem.Test
//{
//    public class RewardsTest
//    {
//        [Test]
//        public void GetAllCombinaison_WithValidGroup_ShouldSuceed()
//        {
//            var tiles = new List<HexTile>()
//            {
//                new HexTile(HexTileType.Grass, HexTileLevel.Normal),
//                new HexTile(HexTileType.Desert, HexTileLevel.Normal),
//                new HexTile(HexTileType.Home, HexTileLevel.Normal),
//                new HexTile(HexTileType.Mountain, HexTileLevel.Normal)
//            };

//            var combinaisonsGroupedBy3 = Rewards.GetAllCombinaison(tiles, 3).ToArray();

//            Assert.That(combinaisonsGroupedBy3, Is.Not.Null);
//            Assert.That(combinaisonsGroupedBy3[0], Is.EquivalentTo(new List<HexTile>() { tiles[0], tiles[1], tiles[2] }));
//            Assert.That(combinaisonsGroupedBy3[1], Is.EquivalentTo(new List<HexTile>() { tiles[0], tiles[1], tiles[3] }));
//            Assert.That(combinaisonsGroupedBy3[2], Is.EquivalentTo(new List<HexTile>() { tiles[0], tiles[2], tiles[3] }));
//            Assert.That(combinaisonsGroupedBy3[3], Is.EquivalentTo(new List<HexTile>() { tiles[1], tiles[2], tiles[3] }));

//            var combinaisonsGroupedBy4 = Rewards.GetAllCombinaison(tiles, 4).ToArray();
//            Assert.That(combinaisonsGroupedBy4[0], Is.EquivalentTo(new List<HexTile>() { tiles[0], tiles[1], tiles[2], tiles[3] }));
//        }

//        [Test]
//        public void GetAllCombinaison_WithInvalidGroup_ShouldFail()
//        {
//            var tiles = new List<HexTile>()
//            {
//                new HexTile(HexTileType.Grass, HexTileLevel.Normal),
//                new HexTile(HexTileType.Desert, HexTileLevel.Normal),
//            };

//            Assert.Throws<ArgumentException>(() => Rewards.GetAllCombinaison(tiles, 0).ToArray());

//        }

//        [Test]
//        public void CalcReward_FromHexGrid_ShouldSucceed()
//        {
//            var grassTile = new HexTile(HexTileType.Grass, HexTileLevel.Normal);
//            var homeTile = new HexTile(HexTileType.Home, HexTileLevel.Normal);
//            var desertTile = new HexTile(HexTileType.Desert, HexTileLevel.Normal);

//            // Create a 3x3 map
//            var hexGrid = new HexGrid(new byte[]
//            {
//                grassTile.Value,
//                grassTile.Value,
//                homeTile.Value,
//                grassTile.Value,
//                desertTile.Value,
//                grassTile.Value,
//                desertTile.Value,
//                grassTile.Value,
//                desertTile.Value,
//            });

//            var bonus = Rewards.CalcReward(hexGrid, Substitute.For<ILogger>());
//            Assert.That(bonus, Is.EqualTo(5));
//        }
//    }
//}
