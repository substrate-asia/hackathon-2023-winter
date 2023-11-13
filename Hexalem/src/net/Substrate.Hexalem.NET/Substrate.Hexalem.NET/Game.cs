using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Substrate.Hexalem.Test")]

namespace Substrate.Hexalem
{
    public class Game
    {
        public static HexBoard Initialise(HexBoard hexBoard, byte players, uint blockNumber)
        {
            hexBoard.Initialize(players);
            hexBoard.ShuffleSelection(blockNumber);

            // initial rewards given out ...
            return Rewards(hexBoard);
        }

        public static HexBoard? ChooseAndPlace(HexBoard hexBoard, byte playerId, HexTile hexTile, GridCoords gridCoords)
        {
            if (hexBoard.PlayerTurn != playerId)
            {
                return null;
            }

            if (!Choose(hexBoard, hexTile))
            {
                return null;
            }

            return Place(hexBoard, hexTile, gridCoords);
        }

        public static HexBoard? NextTurn(uint blockNumber, HexBoard hexBoard, byte playerId)
        {
            if (hexBoard.PlayerTurn != playerId)
            {
                // TODO: check if max block per rounds are passed to force turn
                // else return null

                return null;
            }

            // add turn
            hexBoard.HexBoardTurn += 1;

            // next player turn
            hexBoard.PlayerTurn = (byte)((hexBoard.PlayerTurn + 1) % hexBoard.Players);

            if (hexBoard.HexBoardTurn < hexBoard.Players)
            {
                return hexBoard;
            }

            // end of round start new one
            hexBoard.HexBoardRound += 1;
            hexBoard.HexBoardTurn = 0;

            hexBoard.ShuffleSelection(blockNumber);

            return Rewards(hexBoard);
        }

        public static bool Choose(HexBoard hexBoard, HexTile hexTile)
        {
            return true;
        }

        public static HexBoard Place(HexBoard hexBoard, HexTile hexTile, GridCoords gridCoords)
        {
            return hexBoard;
        }

        private static HexBoard Rewards(HexBoard hexBoard)
        {
            // calculate rewards

            return hexBoard;
        }
    }
}