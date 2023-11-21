using System;

namespace Substrate.Hexalem
{
    public partial class HexaTile
    {
        public static implicit operator byte(HexaTile p) => p.Value;
        public static implicit operator HexaTile(byte p) => new HexaTile(p);

        public byte Value { get; set; }

        public HexaTile(TileType hexTileType, Rarity hexTilePattern)
        {
            Value = (byte)(((byte)hexTilePattern << 4) | (byte)hexTileType);
        }

        public HexaTile(byte value)
        {
            Value = value;
        }

        /// <summary>
        /// Is an empty tile
        /// </summary>
        public bool IsEmpty()
        {
            return Value == 0x00;
        }

        internal bool Same(HexaTile? v)
        {
            if (v == null)
            {
                return false;
            }

            return Value == v.Value;
        }

        public override string ToString()
        {
            return $"{TileType} - {TilePattern}";
        }
    }

    public partial class HexaTile
    {
        public TileType TileType
        {
            get => (TileType)(Value & 0x0F);
            set => Value = (byte) ((byte) (Value & 0xF0) | (byte)((byte)value & 0x0F));
        }

        public Rarity TilePattern
        {
            get => (Rarity)(Value >> 4);
            set => Value = (byte)(((byte)value << 4) | Value);

        }

    }

}