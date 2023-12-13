namespace Substrate.Hexalem.Engine
{
    public partial class HexaTargetGoal
    {
        public static implicit operator byte(HexaTargetGoal p) => p.Value;

        public static implicit operator HexaTargetGoal(byte p) => new HexaTargetGoal(p);

        public byte Value { get; set; }

        public HexaTargetGoal(TargetGoal winningCondition, byte target)
        {
            Value = (byte)(((byte)((byte)winningCondition & 0x3) << 6) | (target & 0x3F));
        }

        public HexaTargetGoal(byte bytes)
        {
            Value = bytes;
        }
    }

    public partial class HexaTargetGoal
    {
        public TargetGoal TargetGoal
        {
            get => (TargetGoal)((Value >> 6) & 0x3);
            set => Value = (byte)((Value & 0x3F) | (((byte)value & 0x3) << 6));
        }

        public byte TargetValue
        {
            get => (byte)(Value & 0x3F);
            set => Value = (byte)((Value & 0xC0) | (value & 0x3F));
        }
    }
}