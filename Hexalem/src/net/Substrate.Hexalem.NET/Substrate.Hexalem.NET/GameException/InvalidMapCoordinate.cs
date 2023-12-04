using System;

namespace Substrate.Hexalem.NET.GameException
{
    public class InvalidMapCoordinate : Exception
    {
        public InvalidMapCoordinate(string message) : base(message)
        {
        }
    }
}