using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET.GameException
{
    public class NotActiveTurnException : Exception
    {
        public NotActiveTurnException(string message) : base(message) { }
    }
}
