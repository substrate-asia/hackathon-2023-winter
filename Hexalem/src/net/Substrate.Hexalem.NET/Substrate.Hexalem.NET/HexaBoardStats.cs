using Substrate.Hexalem.Integration.Model;
using System;

namespace Substrate.Hexalem
{
    public class HexaBoardStats
    {
        public byte[] Value;

        public HexaBoardLevelStats Level { get; }
        public HexaBoardPatternStats Pattern { get; }

        public const int StorageSize = 64;
        private readonly int _maxTileTypes;

        public HexaBoardStats() : this(new byte[8], new byte[StorageSize], new byte[StorageSize])
        {
        }

        protected HexaBoardStats(byte[] resultType, byte[] resultLevel, byte[] resultPattern)
        {
            _maxTileTypes = Enum.GetValues(typeof(TileType)).Length;
            Value = resultType;

            Level = new HexaBoardLevelStats(resultLevel);
            Pattern = new HexaBoardPatternStats(resultPattern);
        }

        public byte this[TileType tileType]
        {
            get => Value[(int)tileType];
            set => Value[(int)tileType] = value;
        }

        public byte this[TileType tileType, byte tileLevel]
        {
            get => Level[tileType, tileLevel];
            set => Level[tileType, tileLevel] = value;
        }

        public byte this[TileType tileType, TilePattern tilePattern]
        {
            get => Pattern[tileType, tilePattern];
            set => Pattern[tileType, tilePattern] = value;
        }
    }

    public class HexaBoardLevelStats
    {
        public byte[] Value;
        private readonly int _maxTileTypes;

        public HexaBoardLevelStats() : this(new byte[HexaBoardStats.StorageSize])
        {
        }

        public HexaBoardLevelStats(byte[] result)
        {
            Value = result;
            _maxTileTypes = Enum.GetValues(typeof(TileType)).Length;
        }

        public byte this[TileType tileType, byte tileLevel]
        {
            get => Value[(int)tileType * _maxTileTypes + (int)tileLevel];
            set => Value[(int)tileType * _maxTileTypes + (int)tileLevel] = value;
        }
    }

    public class HexaBoardPatternStats
    {
        public byte[] Value;
        private readonly int _maxTileTypes;

        public HexaBoardPatternStats() : this(new byte[HexaBoardStats.StorageSize])
        {
        }

        public HexaBoardPatternStats(byte[] result)
        {
            Value = result;
            _maxTileTypes = Enum.GetValues(typeof(TileType)).Length;
        }

        public byte this[TileType tileType, TilePattern tilePattern]
        {
            get => Value[(int)tileType * _maxTileTypes + (int)tilePattern];
            set => Value[(int)tileType * _maxTileTypes + (int)tilePattern] = value;
        }
    }
}