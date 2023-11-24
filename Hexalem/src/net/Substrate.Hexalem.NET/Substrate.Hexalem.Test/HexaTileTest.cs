using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Test
{
    internal class HexaTileTest
    {
        [Test]
        public void HexTile_Accessors_ShouldSuceed()
        {
            var tile = new HexaTile(TileType.Home, TileRarity.Rare, TilePattern.Delta);

            Assert.That(tile.TileType, Is.EqualTo(TileType.Home));
            Assert.That(tile.TileRarity, Is.EqualTo(TileRarity.Rare));
            Assert.That(tile.TilePattern, Is.EqualTo(TilePattern.Delta));

            tile.TileType = TileType.Water;
            Assert.That(tile.TileType, Is.EqualTo(TileType.Water));

            tile.TileRarity = TileRarity.Normal;
            Assert.That(tile.TileRarity, Is.EqualTo(TileRarity.Normal));

            tile.TilePattern = TilePattern.Ypsilon;
            Assert.That(tile.TilePattern, Is.EqualTo(TilePattern.Ypsilon));
        }
    }
}
