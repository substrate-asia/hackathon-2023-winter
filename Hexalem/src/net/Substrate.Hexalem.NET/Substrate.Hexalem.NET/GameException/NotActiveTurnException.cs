using System;

namespace Substrate.Hexalem.GameException
{
    public class NotActiveTurnException : Exception
    {
        public NotActiveTurnException(string message) : base(message)
        {
        }
    }
}