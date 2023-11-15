using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET.Draw
{
    public class SelectableTile
    {
        public byte[] Value { get; private set; }


        public SelectableTile(HexTile hexTile)
        {
            Set(true, hexTile);
        }

        private void Set(bool isAvailable, HexTile hexTile)
        {
            Value = new byte[2] { Convert.ToByte(isAvailable), hexTile.Value };
        }

        public void SetUnavailable()
        {
            Set(false, GetHexTile());
        }

        public HexTile GetHexTile()
        {
            return new HexTile(Value[1]);
        }

        public bool IsAvailable()
        {
            return Convert.ToBoolean(Value[0]);
        }

        public override string ToString()
        {
            return $"{IsAvailable()} - {GetHexTile()}";
        }
    }
}
