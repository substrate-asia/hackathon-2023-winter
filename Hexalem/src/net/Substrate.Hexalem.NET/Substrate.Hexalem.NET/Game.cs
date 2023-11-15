using Substrate.Hexalem.NET;
using Substrate.Hexalem.NET.Draw;
using Substrate.Hexalem.NET.GameException;
using System.Runtime.CompilerServices;
using Serilog;
using Serilog.Core;
using System;
using System.Linq;

[assembly: InternalsVisibleTo("Substrate.Hexalem.Test")]

namespace Substrate.Hexalem
{
    public static class Game
    {
        public static HexBoard Start(HexBoard hexBoard, byte players, uint blockNumber, ILogger logger)
        {
            logger.Information($"Start a new game | Start block = {blockNumber} | Nb player = {players}");

            hexBoard.Initialize(players, HexGridSize.Medium);
            hexBoard.ShuffleSelection(blockNumber);

            // initial rewards given out ...
            return Rewards(hexBoard);
        }

        public static HexBoard Play(HexBoard hexBoard, byte playerId, HexTile hexTile, GridCoords gridCoords, Draw draw)
        {
            if (hexBoard.PlayerTurn != playerId)
            {
                throw new NotActiveTurnException($"Unable to play with playerId = {playerId} while it is not his turn");
            }

            if (!Choose(hexTile, draw))
            {
                throw new TileNotAvailableException($"Tile {hexTile} is not available in the draw");
            }

            return Place(hexBoard, playerId, hexTile, gridCoords);
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
            hexBoard.PlayerTurn = (byte)((hexBoard.PlayerTurn + 1) % hexBoard.PlayersCount);

            if (hexBoard.HexBoardTurn < hexBoard.PlayersCount)
            {
                return hexBoard;
            }

            // end of round start new one
            hexBoard.HexBoardRound += 1;
            hexBoard.HexBoardTurn = 0;

            hexBoard.ShuffleSelection(blockNumber);

            return Rewards(hexBoard);
        }

        public static bool Choose(HexTile hexTile, Draw draw)
        {
            draw.Take(hexTile);
            return true;
        }

        private static HexBoard Place(HexBoard hexBoard, byte playerId, HexTile hexTile, GridCoords gridCoords)
        {
            var playerGrid = hexBoard.PlayerGrids[playerId];

            if(!playerGrid.IsValidHex(gridCoords.q, gridCoords.r))
            {
                throw new InvalidMapCoordinate($"({gridCoords.q}, {gridCoords.r}) are invalid coordinate");
            }

            playerGrid[gridCoords.q, gridCoords.r] = hexTile;

            return hexBoard;
        }

        private static HexBoard Rewards(HexBoard hexBoard)
        {
            // calculate rewards

            return hexBoard;
        }
    }
}