using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Substrate.Hexalem.Integration.Model;

namespace Substrate.Hexalem.Test
{
    internal class HexaTileTest
    {
        [Test]
        public void HexTile_Accessors_ShouldSuceed()
        {
            var tile = new HexaTile(TileType.Home, 1, TilePattern.Delta);

            Assert.That(tile.TileType, Is.EqualTo(TileType.Home));
            Assert.That(tile.TileLevel, Is.EqualTo(1));
            Assert.That(tile.TilePattern, Is.EqualTo(TilePattern.Delta));

            tile.TileType = TileType.Water;
            Assert.That(tile.TileType, Is.EqualTo(TileType.Water));

            tile.TileLevel = 0;
            Assert.That(tile.TileLevel, Is.EqualTo(0));

            tile.TilePattern = TilePattern.Ypsilon;
            Assert.That(tile.TilePattern, Is.EqualTo(TilePattern.Ypsilon));
        }
    }
}
