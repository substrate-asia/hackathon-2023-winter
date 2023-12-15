using System;

namespace Substrate.Hexalem.Engine
{
    public static class GameConfig
    {
        public const uint MAX_TURN_BLOCKS = 10;

        public const double WATER_PER_HUMANS = 2;
        public const double FOOD_PER_HUMANS = 1;
        public const double HOME_PER_HUMANS = 3;

        public const double WATER_PER_WATER = 2;
        public const double FOOD_PER_GRASS = 2;
        public const double FOOD_PER_TREE = 1;

        public const int GAME_STORAGE_ID = 32;
        public const int GAME_STORAGE_SIZE = 16;
        public const int PLAYER_ADDRESS_STORAGE_SIZE = 32;
        public const int PLAYER_STORAGE_SIZE = 10;

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
        /// Map tile cost
        /// </summary>
        /// <param name="tileType"></param>
        /// <param name="tileLevel"></param>
        /// <returns></returns>
        public static byte[]? MapTileCost(TileType tileType, byte tileLevel)
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
                    materialCost[(int)RessourceType.Mana] = (byte)(1 + tileLevel);
                    return materialCost;

                case TileType.Home:
                    return null;
            }
            return null;
        }

        /// <summary>
        /// Tile offer
        /// </summary>
        public static TileOffer[] TILE_COSTS = new TileOffer[15] {
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