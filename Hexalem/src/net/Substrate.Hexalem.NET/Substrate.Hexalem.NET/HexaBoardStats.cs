using Newtonsoft.Json.Linq;
using System;
using System.Linq;

namespace Substrate.Hexalem
{
    internal class HexaBoardStats
    {
        public byte[] Value;
        
        public HexaBoardRarityStats Rarity { get; }
        public HexaBoardPatternStats Pattern { get; }

        public const int StorageSize = 64;
        private readonly int _maxTileTypes;

        public HexaBoardStats() : this(new byte[8], new byte[StorageSize], new byte[StorageSize])
        {

        }

        protected HexaBoardStats(byte[] resultType, byte[] resultRarity, byte[] resultPattern)
        {
            _maxTileTypes = Enum.GetValues(typeof(TileType)).Length;
            Value = resultType;

            Rarity = new HexaBoardRarityStats(resultRarity);
            Pattern = new HexaBoardPatternStats(resultPattern);
        }

        public byte this[TileType tileType]
        {
            get => Value[(int)tileType];
            set => Value[(int)tileType] = value;
        }
        public byte this[TileType tileType, TileRarity tileRarity]
        {
            get => Rarity[tileType, tileRarity];
            set => Rarity[tileType, tileRarity] = value;
        }

        public byte this[TileType tileType, TilePattern tilePattern]
        {
            get => Pattern[tileType, tilePattern];
            set => Pattern[tileType, tilePattern] = value;
        }
    }

    internal class HexaBoardRarityStats
    {
        
        public byte[] Value;
        private readonly int _maxTileTypes;

        public HexaBoardRarityStats() : this(new byte[HexaBoardStats.StorageSize])
        {

        }
        
        public HexaBoardRarityStats(byte[] result)
        {
            Value = result;
            _maxTileTypes = Enum.GetValues(typeof(TileType)).Length;
        }

        public byte this[TileType tileType, TileRarity tileRarity]
        {
            get => Value[(int)tileType * _maxTileTypes + (int)tileRarity];
            set => Value[(int)tileType * _maxTileTypes + (int)tileRarity] = value;
        }
    }

    internal class HexaBoardPatternStats
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