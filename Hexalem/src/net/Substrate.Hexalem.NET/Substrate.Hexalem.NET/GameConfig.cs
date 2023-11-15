using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET
{
    public static class GameConfig
    {
        public const HexGridSize GRID_SIZE = HexGridSize.Medium;

        /// <summary>
        /// Game state [6 bytes]
        /// </summary>
        public const int GameStateStorageSize = 6;

        /// <summary>
        /// Set the player ressources [6 bytes]
        /// </summary>
        public const int PlayerRessourcesStorageSize = 6;
        // Set to 32 if we store account address

        public const int PlayerAccountStorageSize = 0;

        /// <summary>
        /// Medium Grid [9 bytes]
        /// </summary>
        public const int PlayerGrid_SmallMap_StorageSize = 3 * 3;

        /// <summary>
        /// Medium Grid [25 bytes]
        /// </summary>
        public const int PlayerGrid_MediumMap_StorageSize = 5 * 5;

        /// <summary>
        /// Large Grid [49 bytes]
        /// </summary>
        public const int PlayerGrid_LargeMap_StorageSize = 7 * 7;

        public static int PlayerGridStorageSize(HexGridSize grid)
        {
            return (int)grid;
        }

        

        public const byte DefaultMana = 0;
        public const byte DefaultHuman = 0;
        public const byte DefaultGold = 0;
        public const byte DefaultFood = 0;
        public const byte DefaultWood = 0;
        public const byte DefaultWater = 0;

        public const HexTileType DefaultHexTileType = HexTileType.None;
        public const HexTileLevel DefaultHexTileLevel = HexTileLevel.None;

        public const int NbBlockMaxToPlay = 4;

        public const int NbTileInDraw = 32;
    }
}
