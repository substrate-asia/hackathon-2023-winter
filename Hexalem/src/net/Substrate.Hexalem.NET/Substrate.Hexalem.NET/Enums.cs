namespace Substrate.Hexalem
{
    public enum TileType
    {
        None = 0,
        Home = 1,
        Grass = 2,
        Water = 3,
        Mountain = 4,
        Forest = 5,
        Desert = 6,
        Cave = 7,
    }

    public enum TileRarity
    {
        None = 0,
        Normal = 1,
        Rare = 2,
        Epic = 3,
        Legendary = 4,
        // Mythic = 5, // ...
    }

    public enum TilePattern
    {
        None = 0,
        Normal = 1,
        Delta = 2,
        Line = 3,
        Ypsilon = 4
    }

    public enum GridSize
    {
        /// <summary>
        /// 3x3 tiles
        /// </summary>
        Small = 9,

        /// <summary>
        /// 5x5 tiles
        /// </summary>
        Medium = 25,

        /// <summary>
        /// 7x7 tiles
        /// </summary>
        Large = 49,
    }

    public enum RessourceType
    {
        Mana = 1,
        Humans = 2,
        Water = 3,
        Food = 4,
        Wood = 5,
        Stone = 6,
        Gold = 7,
    }

    public enum ShuffleType
    {
        SplitHalfAndMove = 0,
        ReverseFirstHalf = 1,
        ReverseSecondHalf = 2,
        Rotate = 3,
        RandomShuffle = 4,
        SwapInPairs = 5
    }

    public enum HexBoardState
    {
        Preparing,
        Running,
        Finish,
    }

    public enum WinningCondition
    {
        HumanThreshold,
        GoldThreshold,
        DestructionThreshold,
    }
}