using System;

namespace Substrate.Hexalem.Engine
{
    public partial class HexaPlayer : IHexaBase, ICloneable
    {
        public const int STORAGE_SIZE = 32;

        public static implicit operator byte[](HexaPlayer p) => p.Value;

        public static implicit operator HexaPlayer(byte[] p) => new HexaPlayer(p);

        public byte[] Id { get; set; } // AccountId32

        public byte[] Value { get; set; }

        public HexaPlayer(byte[] id) : this(id, new byte[STORAGE_SIZE])
        {
            Value = new byte[STORAGE_SIZE];
            TargetGoal = TargetGoal.HumanThreshold;
            TargetValue = TargetGoal switch
            {
                TargetGoal.HumanThreshold => HexalemConfig.GetInstance().TargetGoalHuman,
                TargetGoal.GoldThreshold => HexalemConfig.GetInstance().TargetGoalGold,
                _ => throw new NotSupportedException("Invalid target goal"),
            };
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
            foreach(RessourceType resource in Enum.GetValues(typeof(RessourceType))) 
            {
                this[resource] = HexalemConfig.GetInstance().StartPlayerResources[(int)resource];
            }
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