using Substrate.Hexalem.NET.GameException;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Substrate.Hexalem.NET.Draw
{
    public class Draw
    {
        private static readonly Random _random = new Random();

        public SelectableTile[] Tiles { get; private set; }

        public void Generate(int nb)
        {
            Tiles = new SelectableTile[nb];
            var values = Enum.GetValues(typeof(HexTileType));

            for(int i = 0; i < nb; i++)
            {
                Tiles[i] = new SelectableTile(new HexTile((HexTileType)_random.Next(values.Length), HexTileLevel.None));
            }
        }

        /// <summary>
        /// Get a tile by his type
        /// </summary>
        /// <param name="hexTileType"></param>
        /// <returns></returns>
        /// <exception cref="TileNotAvailableException"></exception>
        public HexTile Take(HexTile hexTile)
        {
            var tile = Tiles.FirstOrDefault(x => x.GetHexTile().Value == hexTile.Value && x.IsAvailable());

            if(tile == null)
            {
                throw new TileNotAvailableException($"There is not {hexTile} available in the draw");
            }

            // Remove tile from the draw
            tile.SetUnavailable();

            return tile.GetHexTile();
        }

        public HexTile this[int index]
        {
            get { return Tiles[index].GetHexTile(); }
        }
    }
}
