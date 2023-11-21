using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET.GameException
{
    public static class LogMessages
    {
        public static string InvalidPlayerTurn(byte currentPlayerIndex, byte realPlayerTurn) 
            => $"Player num ${currentPlayerIndex} try to play while it is the turn of player ${realPlayerTurn}";

        public static string InvalidTileSelection(int selectionIndex)
            => $"Invalid tiles selection : choose ${selectionIndex} which is out of bounds";

        public static string TooMuchTimeToPlay(uint nbBlockToPlay)
            => $"Player decision was too long, {nbBlockToPlay} block passed since last move (max allowed : {GameConfig.MAX_TURN_BLOCKS} blocks)";
    }
}
