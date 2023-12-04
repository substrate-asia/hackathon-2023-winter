using System;

namespace Substrate.Hexalem.NET.GameException
{
    public class NotActiveTurnException : Exception
    {
        public NotActiveTurnException(string message) : base(message)
        {
        }
    }
}