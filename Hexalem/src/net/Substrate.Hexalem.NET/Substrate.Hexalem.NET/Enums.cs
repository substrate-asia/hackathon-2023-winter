namespace Substrate.Hexalem.Engine
{
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
        Mana = 0,
        Humans = 1,
        Water = 2,
        Food = 3,
        Wood = 4,
        Stone = 5,
        Gold = 6,
    }

    public enum TileType
    {
        Empty = 0,
        Home = 1,
        Grass = 2,
        Water = 3,
        Mountain = 4,
        Tree = 5,
        Desert = 6,
        Cave = 7,
    }

    public enum TilePattern
    {
        Normal = 0,
        Delta = 1,
        Line = 2,
        Ypsilon = 3
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

    public enum TargetState
    {
        None,
        Failed,
        Achieved
    }

    public enum TargetGoal
    {
        HumanThreshold,
        GoldThreshold,
    }
}