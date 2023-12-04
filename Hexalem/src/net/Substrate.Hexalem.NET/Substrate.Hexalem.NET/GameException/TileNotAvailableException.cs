using System;

namespace Substrate.Hexalem.NET.GameException
{
    public class TileNotAvailableException : Exception
    {
        public TileNotAvailableException() : base()
        {
        }

        public TileNotAvailableException(string message) : base(message)
        {
        }
    }
}