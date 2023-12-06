using Newtonsoft.Json.Linq;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using System.Linq;

namespace Substrate.Hexalem.Integration.Model
{
    public class TileSharp
    {
        public byte Value { get; private set; }

        public TileSharp(HexalemTile tile) {
            TileType = (TileType)((tile.Value.Value >> 3) & 0x7);
            TileLevel = (byte)((tile.Value.Value >> 6) & 0x3);
            Pattern = (TilePattern)(tile.Value.Value & 0x7);
            Value = tile.Value.Value;
        }

        public TileType TileType { get; private set; }
        public byte TileLevel { get; private set; }
        public TilePattern Pattern { get; private set; }
    }
}
