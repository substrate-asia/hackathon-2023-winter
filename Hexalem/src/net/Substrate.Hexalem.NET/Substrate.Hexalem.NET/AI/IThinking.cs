using System;
using System.Collections.Generic;
using System.Text;
using static System.Collections.Specialized.BitVector32;

namespace Substrate.Hexalem.NET.AI
{
    public interface IThinking
    {
        public PlayAction FindBestAction(HexaGame initialState, int iteration);
    }
}
