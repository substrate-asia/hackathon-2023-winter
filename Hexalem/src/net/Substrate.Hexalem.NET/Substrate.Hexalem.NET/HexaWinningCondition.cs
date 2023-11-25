using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET
{
    public partial class HexaWinningCondition
    {
        public static implicit operator byte(HexaWinningCondition p) => p.Value;
        public static implicit operator HexaWinningCondition(byte p) => new HexaWinningCondition(p);

        public byte Value { get; set; }

        public HexaWinningCondition(WinningCondition winningCondition, byte target)
        {
            //Value = new byte[2] { (byte)winningCondition, target };
            Value = (byte)(((byte)((byte)winningCondition & 0x3) << 6) | (target & 0x3F));
        }

        public HexaWinningCondition(byte bytes)
        {
            Value = bytes;
        }
    }

    public partial class HexaWinningCondition
    {
        public WinningCondition WinningCondition
        {
            get => (WinningCondition)((Value >> 6) & 0x3);
            set => Value = (byte)((Value & 0x3F) | (((byte)value & 0x3) << 6));
        }

        public byte Target
        {
            get => (byte)(Value & 0x3F);
            set => Value = (byte)((Value & 0xC0) | (value & 0x3F));

        }
    }
}
