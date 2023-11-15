using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET.GameException
{
    public class InvalidMapCoordinate : Exception
    {
        public InvalidMapCoordinate(string message) : base(message) { }
    }
}
