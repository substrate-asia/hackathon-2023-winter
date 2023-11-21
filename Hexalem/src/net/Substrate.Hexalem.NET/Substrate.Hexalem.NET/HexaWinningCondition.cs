using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET
{
    public partial class HexaWinningCondition
    {
        public byte[] Value { get; set; }

        public HexaWinningCondition(WinningCondition winningCondition, byte target)
        {
            Value = new byte[2] { (byte)winningCondition, target };
        }

        public HexaWinningCondition(byte[] bytes)
        {
            Value = bytes;
        }
    }

    public partial class HexaWinningCondition
    {
        public WinningCondition WinningCondition
        {
            get => (WinningCondition)Value[0];
            set => Value[0] = (byte)value;
        }

        public byte Target
        {
            get => Value[1];
            set => Value[1] = value;

        }
    }
}
