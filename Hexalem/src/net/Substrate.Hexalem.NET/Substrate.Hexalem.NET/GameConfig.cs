using System;
using System.Collections.Generic;

namespace Substrate.Hexalem.NET
{
    public static class GameConfig
    {
        public const uint MAX_TURN_BLOCKS = 10;

        public const double WATER_PER_HUMANS = 0.5;
        public const double FOOD_PER_HUMANS = 1;
        public const double HOME_PER_HUMANS = 3;

        public const double WATER_PER_WATER = 1;
        public const double FOOD_PER_GRASS = 1;

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
        /// Gold cost to upgrade a tile
        /// </summary>
        /// <param name="level"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public static int GoldCostForUpgrade(byte level)
        {
            switch (level)
            {
                case 0: // Normal to rare
                    return 5;

                case 1: // Rare to Epic
                    return 10;

                case 2: // Epic to Legendary
                    return 15;

                default:
                    throw new InvalidOperationException($"Level {level} not supported...");
            }
        }

        /// <summary>
        /// Minimum human to upgrade a tile
        /// </summary>
        /// <param name="level"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public static int MininumHumanToUpgrade(byte level)
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
    }
}