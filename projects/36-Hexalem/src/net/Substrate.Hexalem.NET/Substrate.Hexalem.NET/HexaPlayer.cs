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
            TargetGoal = TargetGoal.HumanThreshold;
            TargetValue = GameConfig.DEFAULT_WINNING_CONDITION_HUMAN;
        }

        public HexaPlayer(byte[] id, byte[] value)
        {
            Id = id;
            Value = value;
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

        /// <summary>
        /// Ha
        /// </summary>
        /// <returns></returns>
        public bool HasReachedTargetGoal()
        {
            switch (TargetGoal)
            {
                case TargetGoal.HumanThreshold:
                    return this[RessourceType.Humans] >= TargetValue;

                case TargetGoal.GoldThreshold:
                    return this[RessourceType.Gold] >= TargetValue;

                default:
                    return false;
            }
        }

        public void NextRound(uint blockNumber)
        {
        }

        public void PostMove(uint blockNumber)
        {
        }

        public object Clone()
        {
            return new HexaPlayer((byte[])Id.Clone(), (byte[])Value.Clone());
        }
    }

    public partial class HexaPlayer
    {
        public TargetGoal TargetGoal
        {
            get => (TargetGoal)Value[7];
            set => Value[7] = (byte)value;
        }

        public byte TargetValue
        {
            get => Value[8];
            set => Value[8] = value;
        }

        public TargetState TargetState
        {
            get => (TargetState)Value[9];
            set => Value[9] = (byte)value;
        }
    }
}