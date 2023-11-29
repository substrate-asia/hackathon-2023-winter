using Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using System.Linq;

namespace Substrate.Hexalem.Integration.Model
{
    public class TileSharp
    {
        public TileSharp(HexalemTile tile) {
            TileType = tile.TileType.Value;
            TileLevel = tile.TileLevel.Value;
            Formations = tile.Formations.Value.Select(x => x.Value).ToArray();
        }

        public TileType TileType { get; private set; }
        public byte TileLevel { get; private set; }
        public bool[] Formations { get; private set; }
    }
}
