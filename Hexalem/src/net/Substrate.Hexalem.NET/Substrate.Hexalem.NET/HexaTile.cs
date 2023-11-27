using Serilog;
using Substrate.Hexalem.NET;
using Substrate.NetApi.Model.Meta;
using System;
using System.Linq;

namespace Substrate.Hexalem
{
    public partial class HexaTile
    {
        public static implicit operator byte(HexaTile p) => p.Value;
        public static implicit operator HexaTile(byte p) => new HexaTile(p);

        public byte Value { get; set; }

        public HexaTile(TileType hexTileType, TileRarity hexTileRarity, TilePattern hexTilePattern)
        {
            var rarity = ((byte)hexTileRarity & 0x3) << 6;
            var type = ((byte)hexTileType & 0x7) << 3;
            var pattern = ((byte)hexTilePattern & 0x7);

            Value = (byte)(rarity | type | pattern);
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

        /// <summary>
        /// Determine if a tile can be upgrade
        /// </summary>
        /// <returns></returns>
        internal bool CanUpgrade()
        {
            if (TileRarity == TileRarity.None) // Should never happen but...
            {
                Log.Debug("Cannot upgrade tile which has not been set");
                return false;
            }

            if (TileRarity == TileRarity.Legendary)
            {
                Log.Debug($"{nameof(TileRarity.Legendary)} cannot be upgrade");
                return false;
            }

            var upgradable = GameConfig.UpgradableTypeTile();

            if (!upgradable.Any(x => x == TileType))
            {
                Log.Debug("{TileType} cannot be upgrade", TileType);
                return false;
            }

            return true;
        }
        internal bool Upgrade()
        {
            if (!CanUpgrade())
                return false;

            TileRarity += 1;
            return true;
        }

        public override string ToString()
        {
            return $"{TileType} - {TileRarity} - {TilePattern}";
        }
    }

    public partial class HexaTile
    {
        /// <summary>
        /// 2 bits
        /// </summary>
        public TileRarity TileRarity
        {
            get => (TileRarity)((Value >> 6) & 0x3);
            set => Value = (byte)((Value & 0x3F) | (((byte)value & 0x3) << 6));
        }

        /// <summary>
        /// 3 bits
        /// </summary>
        public TileType TileType
        {
            get => (TileType)((Value >> 3) & 0x7);
            set => Value = (byte)((Value & 0xCF) | (((byte)value & 0x7) << 3));
        }

        /// <summary>
        /// 3 bits
        /// </summary>
        public TilePattern TilePattern
        {
            get => (TilePattern)(Value & 0x7);
            set => Value = (byte)((Value & 0xF8) | ((byte)value & 0x7));
        }
    }

}