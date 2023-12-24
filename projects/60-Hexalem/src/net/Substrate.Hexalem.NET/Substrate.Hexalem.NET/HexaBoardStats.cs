using System;

namespace Substrate.Hexalem.Engine
{
    public class HexaBoardStats
    {
        public const int StorageSize = 64;

        private byte[] _value { get; }

        private byte[] _levelValues { get; }

        private byte[] _patternValues { get; }

        private readonly int _maxTileTypes;

        public HexaBoardStats() : this(new byte[8], new byte[StorageSize], new byte[StorageSize])
        {
        }

        protected HexaBoardStats(byte[] resultType, byte[] resultLevel, byte[] resultPattern)
        {
            _maxTileTypes = Enum.GetValues(typeof(TileType)).Length;

            _value = resultType;
            _levelValues = resultLevel;
            _patternValues = resultPattern;
        }

        public byte this[TileType tileType]
        {
            get => _value[(int)tileType];
            set => _value[(int)tileType] = value;
        }

        public byte this[TileType tileType, byte tileLevel]
        {
            get => _levelValues[(int)tileType * _maxTileTypes + tileLevel];
            set => _levelValues[(int)tileType * _maxTileTypes + tileLevel] = value;
        }

        public byte this[TileType tileType, TilePattern tilePattern]
        {
            get => _patternValues[(int)tileType * _maxTileTypes + (int)tilePattern];
            set => _patternValues[(int)tileType * _maxTileTypes + (int)tilePattern] = value;
        }
    }
}