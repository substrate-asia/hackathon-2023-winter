using System;
using System.Collections.Generic;

namespace Substrate.Hexalem.Engine
{
    public class HexalemConfig
    {
        private static HexalemConfig _instance;
        private static readonly object _lock = new object();

        private static bool _isInitialized = false;

        public static HexalemConfig GetInstance()
        {
            lock (_lock)
            {
                if (_instance == null)
                {
                    _instance = new Builder().Build();
                }
                return _instance;
            }
        }

        public static void Initialize(Builder builder)
        {
            lock (_lock)
            {
                if (!_isInitialized)
                {
                    _instance = builder.Build();
                    _isInitialized = true;
                }
            }
        }

        public int MaxPlayers { get; private set; }
        public int MinPlayers { get; private set; }
        public int MaxRounds { get; private set; }
        public int BlocksToPlayLimit { get; private set; }
        public int MaxHexGridSize { get; private set; }
        public int MaxTileSelection { get; private set; }
        public int WaterPerHuman { get; private set; }
        public int FoodPerHuman { get; private set; }
        public int HomePerHumans { get; private set; }
        public byte[] StartPlayerResources { get; private set; }
        public byte TargetGoalGold { get; private set; }
        public byte TargetGoalHuman { get; private set; }
        public Dictionary<TileType, List<byte[]>> MapTileCost { get; private set; }
        public Dictionary<TileType, List<byte[]>> MapTileUpgradeCost { get; private set; }
        public Dictionary<TileType, Dictionary<TilePattern, List<byte[]>>> MapTileProduction { get; private set; }

        // Default values
        private const int DefaultMaxPlayers = 100;

        private const int DefaultMinPlayers = 1;
        private const int DefaultMaxRounds = 25;
        private const int DefaultBlocksToPlayLimit = 10;
        private const int DefaultMaxHexGridSize = 25;
        private const int DefaultMaxTileSelection = 16;
        private const int DefaultWaterPerHuman = 2;
        private const int DefaultFoodPerHuman = 1;
        private const int DefaultHomePerHumans = 3;
        private static readonly byte[] DefaultPlayerResources = { 1, 1, 0, 0, 0, 0, 0 };
        private const byte DefaultTargetGoalGold = 10;
        private const byte DefaultTargetGoalHuman = 7;

        public const int GAME_STORAGE_ID = 32;
        public const int MAX_TILE_LEVEL = 3;

        private readonly Dictionary<TileType, List<byte[]>> DefaultMapTileCost = new Dictionary<TileType, List<byte[]>>
        {
            { TileType.Grass, new List<byte[]> { new byte[] { 1, 0, 0, 0, 0, 0, 0 } } },
            { TileType.Water, new List<byte[]> { new byte[] { 1, 0, 0, 0, 0, 0, 0 } } },
            { TileType.Mountain, new List<byte[]> { new byte[] { 1, 0, 0, 0, 0, 0, 0 } } },
            { TileType.Tree, new List<byte[]> { new byte[] { 1, 0, 0, 0, 0, 0, 0 } } },
            { TileType.Desert, new List<byte[]> { new byte[] { 1, 0, 0, 0, 0, 0, 0 } } },
            { TileType.Cave, new List<byte[]> { new byte[] { 1, 0, 0, 0, 0, 0, 0 } } },
        };

        private readonly Dictionary<TileType, List<byte[]>> DefaultMapTileUpgradeCost = new Dictionary<TileType, List<byte[]>>
        {
            {
                TileType.Home,
                new List<byte[]> {
                    new byte[] { 0, 0, 0, 0, 2, 2, 0 }, // To Level 1
                    new byte[] { 0, 0, 0, 0, 4, 4, 2 }, // To Level 2
                    new byte[] { 0, 0, 0, 0, 6, 6, 4 }  // To Level 3
                }
            },
        };

        private readonly Dictionary<TileType, Dictionary<TilePattern, List<byte[]>>> DefaultMapTileProduction = new Dictionary<TileType, Dictionary<TilePattern, List<byte[]>>>
        {
            {
                TileType.Home,
                new Dictionary<TilePattern, List<byte[]>>
                {
                    { TilePattern.Normal, new List<byte[]> {
                        new byte[] { 0, 1, 0, 0, 0, 0, 0 }, // Level 0
                        new byte[] { 0, 1, 0, 0, 0, 0, 0 }, // Level 1
                        new byte[] { 0, 1, 0, 0, 0, 0, 0 }, // Level 2
                        new byte[] { 0, 1, 0, 0, 0, 0, 0 }, // Level 3
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }  // Req. Humans (all level same)
                     } },
                }
            },
            { TileType.Grass, new Dictionary<TilePattern, List<byte[]>>
                {
                    { TilePattern.Normal, new List<byte[]> {
                        new byte[] { 0, 0, 0, 2, 0, 0, 0 }, // Level 0
                        new byte[] { 0, 0, 0, 3, 0, 0, 0 }, // Level 1
                        new byte[] { 0, 0, 0, 4, 0, 0, 0 }, // Level 2
                        new byte[] { 0, 0, 0, 5, 0, 0, 0 }, // Level 3
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }  // Req. Humans (all level same)
                     } },
                    { TilePattern.Delta, new List<byte[]> {
                        new byte[] { 0, 0, 0, 3, 0, 0, 0 }, // Level 0
                        new byte[] { 0, 0, 0, 4, 0, 0, 0 }, // Level 1
                        new byte[] { 0, 0, 0, 5, 0, 0, 0 }, // Level 2
                        new byte[] { 0, 0, 0, 6, 0, 0, 0 }, // Level 3
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }  // Req. Humans (all level same)
                    } } } },
            { TileType.Water, new Dictionary<TilePattern, List<byte[]>> { 
                { TilePattern.Normal, new List<byte[]> {
                        new byte[] { 0, 0, 2, 0, 0, 0, 0 }, // Level 0
                        new byte[] { 0, 0, 2, 0, 0, 0, 0 }, // Level 1
                        new byte[] { 0, 0, 2, 0, 0, 0, 0 }, // Level 2
                        new byte[] { 0, 0, 2, 0, 0, 0, 0 }, // Level 3
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }  // Req. Humans (all level same)
                     } } } },
            { TileType.Mountain, new Dictionary<TilePattern, List<byte[]>> { 
                { TilePattern.Normal, new List<byte[]> {
                        new byte[] { 0, 0, 0, 0, 0, 4, 0 }, // Level 0
                        new byte[] { 0, 0, 0, 0, 0, 4, 0 }, // Level 1
                        new byte[] { 0, 0, 0, 0, 0, 4, 0 }, // Level 2
                        new byte[] { 0, 0, 0, 0, 0, 4, 0 }, // Level 3
                        new byte[] { 0, 0, 0, 0, 0, 4, 0 }  // Req. Humans (all level same)
                     } } } },
            { TileType.Tree, new Dictionary<TilePattern, List<byte[]>> { 
                { TilePattern.Normal, new List<byte[]> {
                        new byte[] { 0, 0, 0, 1, 3, 0, 0 }, // Level 0
                        new byte[] { 0, 0, 0, 1, 3, 0, 0 }, // Level 1
                        new byte[] { 0, 0, 0, 1, 3, 0, 0 }, // Level 2
                        new byte[] { 0, 0, 0, 1, 3, 0, 0 }, // Level 3
                        new byte[] { 0, 0, 0, 0, 2, 0, 0 }  // Req. Humans (all level same)
                     } } } },
            { TileType.Desert, new Dictionary<TilePattern, List<byte[]>> { 
                { TilePattern.Normal, new List<byte[]> {
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }, // Level 0
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }, // Level 1
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }, // Level 2
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }, // Level 3
                        new byte[] { 0, 0, 0, 0, 0, 0, 0 }  // Req. Humans (all level same)
                     } } } },
            { TileType.Cave, new Dictionary<TilePattern, List<byte[]>> { 
                { TilePattern.Normal, new List<byte[]> {
                        new byte[] { 0, 0, 0, 0, 0, 2, 1 }, // Level 0
                        new byte[] { 0, 0, 0, 0, 0, 2, 1 }, // Level 1
                        new byte[] { 0, 0, 0, 0, 0, 2, 1 }, // Level 2
                        new byte[] { 0, 0, 0, 0, 0, 2, 1 }, // Level 3
                        new byte[] { 0, 0, 0, 0, 0, 2, 3 }  // Req. Humans (all level same)
                     } } } },
            // Add other TileType initializations here if needed
        };

        // Private constructor to prevent direct instantiation
        private HexalemConfig()
        {
            MaxPlayers = DefaultMaxPlayers;
            MinPlayers = DefaultMinPlayers;
            MaxRounds = DefaultMaxRounds;
            BlocksToPlayLimit = DefaultBlocksToPlayLimit;
            MaxHexGridSize = DefaultMaxHexGridSize;
            MaxTileSelection = DefaultMaxTileSelection;
            WaterPerHuman = DefaultWaterPerHuman;
            FoodPerHuman = DefaultFoodPerHuman;
            HomePerHumans = DefaultHomePerHumans;
            StartPlayerResources = DefaultPlayerResources;
            TargetGoalGold = DefaultTargetGoalGold;
            TargetGoalHuman = DefaultTargetGoalHuman;
            MapTileCost = DefaultMapTileCost;
            MapTileUpgradeCost = DefaultMapTileUpgradeCost;
            MapTileProduction = DefaultMapTileProduction;
        }

        public class Builder
        {
            private readonly HexalemConfig _config = new HexalemConfig();

            public Builder SetMaxPlayers(int maxPlayers)
            {
                _config.MaxPlayers = maxPlayers;
                return this;
            }

            public Builder SetMinPlayers(int minPlayers)
            {
                _config.MinPlayers = minPlayers;
                return this;
            }

            public Builder SetMaxRounds(int maxRounds)
            {
                _config.MaxRounds = maxRounds;
                return this;
            }

            public Builder SetBlocksToPlayLimit(int blocksToPlayLimit)
            {
                _config.BlocksToPlayLimit = blocksToPlayLimit;
                return this;
            }

            public Builder SetMaxHexGridSize(int maxHexGridSize)
            {
                _config.MaxHexGridSize = maxHexGridSize;
                return this;
            }

            public Builder SetMaxTileSelection(int maxTileSelection)
            {
                _config.MaxTileSelection = maxTileSelection;
                return this;
            }

            public Builder SetWaterPerHuman(int waterPerHuman)
            {
                _config.WaterPerHuman = waterPerHuman;
                return this;
            }

            public Builder SetFoodPerHuman(int foodPerHuman)
            {
                _config.FoodPerHuman = foodPerHuman;
                return this;
            }

            public Builder SetHomePerHumans(int homePerHumans)
            {
                _config.HomePerHumans = homePerHumans;
                return this;
            }

            public Builder SetDefaultPlayerResources(byte[] defaultPlayerResources)
            {
                _config.StartPlayerResources = defaultPlayerResources;
                return this;
            }

            public Builder SetTargetGoalGold(byte targetGoalGold)
            {
                _config.TargetGoalGold = targetGoalGold;
                return this;
            }

            public Builder SetTargetGoalHuman(byte targetGoalHuman)
            {
                _config.TargetGoalHuman = targetGoalHuman;
                return this;
            }

            public Builder SetMapTileCost(Dictionary<TileType, List<byte[]>> mapTileCost)
            {
                _config.MapTileCost = mapTileCost;
                return this;
            }

            public Builder SetMapTileUpgradeCost(Dictionary<TileType, List<byte[]>> mapTileUpgradeCost)
            {
                _config.MapTileUpgradeCost = mapTileUpgradeCost;
                return this;
            }

            public Builder SetMapTileProduction(Dictionary<TileType, Dictionary<TilePattern, List<byte[]>>> mapTileProduction)
            {
                _config.MapTileProduction = mapTileProduction;
                return this;
            }

            public HexalemConfig Build()
            {
                // Additional validation or adjustments can be added here
                return _config;
            }
        }
    }

    public static class GameConfig
    {
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