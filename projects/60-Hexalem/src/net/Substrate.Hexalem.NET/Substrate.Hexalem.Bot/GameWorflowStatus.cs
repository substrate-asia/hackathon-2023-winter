using Serilog;
using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem
{
    public class GameWorflowStatus
    {
        public static implicit operator bool(GameWorflowStatus p) => p.IsSuccess;

        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;

        protected GameWorflowStatus() { }

        public static GameWorflowStatus Fail(string message)
        {
            return new GameWorflowStatus()
            {
                IsSuccess = false,
                Message = message
            };
        }

        public static GameWorflowStatus Success()
        {
            return new GameWorflowStatus()
            {
                IsSuccess = true,
                Message = string.Empty
            };
        }

        public static GameWorflowStatus LogErrorThenReturn(string message)
        {
            Log.Error(message);
            return GameWorflowStatus.Fail(message);
        }
    }
}
