using System;

namespace Substrate.Hexalem.Engine
{
    public partial class HexaPlayer : IHexaBase, ICloneable
    {
        public static implicit operator byte[](HexaPlayer p) => p.Value;

        public static implicit operator HexaPlayer(byte[] p) => new HexaPlayer(p);

        public byte[] Id { get; set; } // AccountId32

        public byte[] Value { get; set; }

        public HexaPlayer(byte[] id) : this(id, new byte[GameConfig.PLAYER_STORAGE_SIZE])
        {
            Value = new byte[GameConfig.PLAYER_STORAGE_SIZE];
            AddWinCondition(Engine.WinningCondition.HumanThreshold);
        }

        public HexaPlayer(byte[] id, byte[] hash)
        {
            Id = id;
            Value = hash;
        }

        public byte this[RessourceType ressourceType]
        {
            get => Value[(int)ressourceType];
            set => Value[(int)ressourceType] = value;
        }

        public void Init(uint blockNumber)
        {
            this[RessourceType.Mana] = GameConfig.DEFAULT_MANA;
            this[RessourceType.Humans] = GameConfig.DEFAULT_HUMANS;
            this[RessourceType.Water] = GameConfig.DEFAULT_WATER;
            this[RessourceType.Food] = GameConfig.DEFAULT_FOOD;
            this[RessourceType.Wood] = GameConfig.DEFAULT_WOOD;
            this[RessourceType.Stone] = GameConfig.DEFAULT_STONE;
            this[RessourceType.Gold] = GameConfig.DEFAULT_GOLD;
        }

        public void AddWinCondition(WinningCondition condition)
        {
            switch (condition)
            {
                case Engine.WinningCondition.GoldThreshold:
                    WinningCondition = new HexaWinningCondition(condition, GameConfig.DEFAULT_WINNING_CONDITION_GOLD);
                    break;

                case Engine.WinningCondition.HumanThreshold:
                    WinningCondition = new HexaWinningCondition(condition, GameConfig.DEFAULT_WINNING_CONDITION_HUMAN);
                    break;
            }
        }

        /// <summary>
        /// Check if player reach his win condition
        /// </summary>
        /// <returns></returns>
        public bool HasWin()
        {
            switch (WinningCondition.WinningCondition)
            {
                case Engine.WinningCondition.GoldThreshold:
                    return this[RessourceType.Gold] >= WinningCondition.Target;

                case Engine.WinningCondition.HumanThreshold:
                    return this[RessourceType.Humans] >= WinningCondition.Target;
            }

            return false;
        }

        public void NextRound(uint blockNumber)
        {
        }

        public void PostMove(uint blockNumber)
        {
        }

        public object Clone()
        {
            return new HexaPlayer((byte[])Id.Clone(), (byte[])Value.Clone())
            {
                WinningCondition = new HexaWinningCondition(WinningCondition.WinningCondition, WinningCondition.Target)
            };
        }
    }

    public partial class HexaPlayer
    {
        /// <summary>
        /// Winning condition selected by the player
        /// </summary>
        public HexaWinningCondition WinningCondition
        {
            get => (HexaWinningCondition)Value[7];
            set => Value[7] = value;
        }
    }
}