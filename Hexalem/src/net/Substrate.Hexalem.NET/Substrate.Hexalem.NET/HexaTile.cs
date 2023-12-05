using Serilog;
using Substrate.Hexalem.Integration.Model;
using Substrate.Hexalem.NET;
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
            build(hexTileType, hexTileRarity, hexTilePattern);
        }

        private void build(TileType hexTileType, TileRarity hexTileRarity, TilePattern hexTilePattern)
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

        public HexaTile(TileSharp tileTypeSharp)
        {
            var tileType = TileType.Empty;
            switch (tileTypeSharp.TileType)
            {
                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Empty:
                    tileType = TileType.Empty;
                    break;

                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Tree:
                    tileType = TileType.Tree;
                    break;

                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Water:
                    tileType = TileType.Water;
                    break;

                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Mountain:
                    tileType = TileType.Mountain;
                    break;

                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Desert:
                    tileType = TileType.Desert;
                    break;
                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Home:
                    tileType = TileType.Home;
                    break;

                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Grass:
                    tileType = TileType.Grass;
                    break;
                    // TODO : add cave
            }

            var values = Enum.GetValues(typeof(TileRarity)).Cast<TileRarity>().ToArray();
            var titleRarity = (TileRarity)values[tileTypeSharp.TileLevel];

            // TODO : handle formation ?

            build(tileType, titleRarity, TilePattern.Normal);
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

            return TileType == v.TileType;
        }

        /// <summary>
        /// Determine if a tile can be upgrade
        /// </summary>
        /// <returns></returns>
        internal bool CanUpgrade()
        {
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

        internal void Upgrade()
        {
            if (CanUpgrade())
                TileRarity += 1;
        }

        public HexaTile Clone()
        {
            var cloneTile = new HexaTile(Value);
            return cloneTile;
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
            set => Value = (byte)((Value & 0xF8) | (byte)value & 0x7);
        }
    }
}