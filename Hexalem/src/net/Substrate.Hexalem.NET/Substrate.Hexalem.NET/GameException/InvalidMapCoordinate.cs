using System;

namespace Substrate.Hexalem.GameException
{
    public class InvalidMapCoordinate : Exception
    {
        public InvalidMapCoordinate(string message) : base(message)
        {
        }
    }
}