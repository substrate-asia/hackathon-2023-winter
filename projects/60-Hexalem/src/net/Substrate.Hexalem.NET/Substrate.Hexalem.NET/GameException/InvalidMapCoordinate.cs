using System;

namespace Substrate.Hexalem.Engine.GameException
{
    public class InvalidMapCoordinate : Exception
    {
        public InvalidMapCoordinate(string message) : base(message)
        {
        }
    }
}