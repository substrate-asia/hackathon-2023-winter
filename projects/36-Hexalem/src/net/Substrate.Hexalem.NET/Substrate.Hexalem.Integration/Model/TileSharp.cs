using Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime;

namespace Substrate.Hexalem.Integration.Model
{
    public class TileSharp
    {
        public byte Value { get; private set; }

        public TileSharp(HexalemTile tile)
        {
            TileType = (byte)((tile.Value.Value >> 3) & 0x7);
            TileLevel = (byte)((tile.Value.Value >> 6) & 0x3);
            Pattern = (byte)(tile.Value.Value & 0x7);
            Value = tile.Value.Value;
        }

        public byte TileType { get; private set; }
        public byte TileLevel { get; private set; }
        public byte Pattern { get; private set; }
    }
}