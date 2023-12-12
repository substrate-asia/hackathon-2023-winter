using System;
using System.Collections.Generic;

namespace Substrate.Hexalem.Engine
{
    public static class GameConfig
    {
        public const uint MAX_TURN_BLOCKS = 10;

        public const double WATER_PER_HUMANS = 0.5;
        public const double FOOD_PER_HUMANS = 1;
        public const double HOME_PER_HUMANS = 3;

        public const double WATER_PER_WATER = 1;
        public const double FOOD_PER_GRASS = 1;
        public const double FOOD_PER_TREE = 0.5;

        public const int GAME_STORAGE_SIZE = 16;
        public const int PLAYER_STORAGE_SIZE = 8;

        // Default player ressources
        public const byte DEFAULT_MANA = 1;

        public const byte DEFAULT_HUMANS = 1;
        public const byte DEFAULT_WATER = 0;
        public const byte DEFAULT_FOOD = 0;
        public const byte DEFAULT_WOOD = 0;
        public const byte DEFAULT_STONE = 0;
        public const byte DEFAULT_GOLD = 0;

        public const byte FREE_MANA_PER_ROUND = 1;

        public const int NB_MAX_UNBOUNDED_TILES = 32;

        public const int DEFAULT_WINNING_CONDITION_GOLD = 10;
        public const int DEFAULT_WINNING_CONDITION_HUMAN = 7;

        /// <summary>
        /// Upgradeable tile type
        /// </summary>
        /// <returns></returns>
        public static List<TileType> UpgradableTypeTile()
        {
            return new List<TileType>() { TileType.Home }; // For now, only home can be upgrade
        }

        /// <summary>
        /// Maximum humans in a home
        /// </summary>
        /// <param name="level"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public static int HumansPerHome(byte level)
        {
            switch (level)
            {
                case 0: // Normal to rare
                    return 3;

                case 1: // Rare to Epic
                    return 5;

                case 2: // Epic to Legendary
                    return 8;

                default:
                    throw new InvalidOperationException($"Level {level} not supported...");
            }
        }

        /// <summary>
        /// Map tile upgrade cost
        /// </summary>
        /// <param name="tileType"></param>
        /// <param name="tileLevel"></param>
        /// <returns></returns>
        public static byte[]? MapTileUpgradeCost(TileType tileType, byte tileLevel)
        {
            var materialCost = new byte[Enum.GetValues(typeof(RessourceType)).Length];

            switch (tileType)
            {
                case TileType.Grass:
                case TileType.Water:
                case TileType.Mountain:
                case TileType.Tree:
                case TileType.Desert:
                case TileType.Cave:
                    return null;

                case TileType.Home:
                    materialCost[(int)RessourceType.Wood] = (byte)((tileLevel + 1) * 2);
                    materialCost[(int)RessourceType.Stone] = (byte)((tileLevel + 1) * 2);
                    materialCost[(int)RessourceType.Gold] = (byte)(tileLevel * 2);
                    return materialCost;
            }
            return null;
        }

        /// <summary>
        /// Tile offer
        /// </summary>
        public static TileOffer[] TILE_COSTS = new TileOffer[16] {
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Grass, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Grass, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Grass, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Water, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Water, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Water, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Mountain, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
             new TileOffer {
                TileToBuy = new HexaTile(TileType.Mountain, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
              new TileOffer {
                TileToBuy = new HexaTile(TileType.Mountain, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Tree, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Tree, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Tree, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Desert, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Desert, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Cave, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
            new TileOffer {
                TileToBuy = new HexaTile(TileType.Cave, 0, TilePattern.Normal),
                SelectCost = new MaterialCost { MaterialType = RessourceType.Mana, Cost = 1, }
            },
        };
    }
}