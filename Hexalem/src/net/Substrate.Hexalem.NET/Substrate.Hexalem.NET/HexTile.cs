using Substrate.Hexalem.NET;

namespace Substrate.Hexalem
{
    public enum HexTileType
    {
        None = 0,
        Home = 1,
        Grass = 2,
        Water = 3,
        Mountain = 4,
        Forest = 5,
        Desert = 6,
    }

    public enum HexTileLevel
    {
        None = 0,
        Normal = 1,
    }

    public class HexTile
    {
        public byte Value { get; private set; }

        public HexTile(byte value)
        {
            Value = Value = (byte)((value << 4) | value);
        }

        public HexTile() : this(GameConfig.DefaultHexTileType, GameConfig.DefaultHexTileLevel)
        {

        }

        public HexTile(HexTileType hexTileType, HexTileLevel hexTileLevel)
        {
            Set(hexTileType, hexTileLevel);
        }

        private void Set(HexTileType hexTileType, HexTileLevel hexTileLevel)
        {
            // TileType is in the lower half, TileLevel in the upper half
            Value = (byte)(((byte)hexTileLevel << 4) | (byte)hexTileType);
        }

        public HexTileType GetHexTileType()
        {
            // Extract the lower half for TileType
            return (HexTileType)(Value & 0x0F);
        }

        public HexTileLevel GetHexTileLevel()
        {
            // Extract the upper half for TileLevel
            return (HexTileLevel)(Value >> 4);
        }

        public override string ToString()
        {
            return $"{GetHexTileType()} - {GetHexTileLevel()}";
        }
    }
}