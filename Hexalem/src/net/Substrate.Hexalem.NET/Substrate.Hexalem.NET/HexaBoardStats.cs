using System;

namespace Substrate.Hexalem
{
    internal class HexaBoardStats
    {
        public byte[] Value;
        
        private int _maxTileTypes;
        private int _maxTilePatterns;

        public HexaBoardStats() : this(new byte[64])
        {

        }

        public HexaBoardStats(byte[] result)
        {
            Value = result;
            _maxTileTypes = Enum.GetValues(typeof(TileType)).Length;
            _maxTilePatterns = Enum.GetValues(typeof(TileRarity)).Length;
        }

        public byte this[TileType tileType]
        {
            get => Value[(int)tileType * _maxTileTypes];
            set => Value[(int)tileType * _maxTileTypes] = value;
        }

        public byte this[TileType tileType, TileRarity tilePattern]
        {
            get => Value[(int)tileType * _maxTileTypes + (int)tilePattern];
            set => Value[(int)tileType * _maxTileTypes + (int)tilePattern] = value;
        }
    }
}