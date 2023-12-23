using System;

namespace Substrate.Hexalem.Engine.GameException
{
    public class NotActiveTurnException : Exception
    {
        public NotActiveTurnException(string message) : base(message)
        {
        }
    }
}