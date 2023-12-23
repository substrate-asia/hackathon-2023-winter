using Serilog;
using System;
using System.Collections.Generic;

namespace Substrate.Hexalem.Engine
{
    public static class Game
    {
        /// <summary>
        /// Create a new game
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="players"></param>
        /// <param name="gridSize"></param>
        /// <returns></returns>
        public static HexaGame CreateGame(uint blockNumber, List<HexaPlayer> players, GridSize gridSize)
        {
            Random random = new Random((int)blockNumber);

            var randomHash = new byte[32];
            random.NextBytes(randomHash);

            var hexaTuple = new List<(HexaPlayer, HexaBoard)>();
            foreach (var player in players)
            {
                var hexaBoard = new HexaBoard(new byte[(int)gridSize]);
                hexaTuple.Add((player, hexaBoard));
            }

            var hexaGame = new HexaGame(randomHash, hexaTuple);
            hexaGame.Init(blockNumber);

            Log.Information($"New Game created, with a {gridSize} hex grid and {hexaGame.PlayersCount} players.");

            return hexaGame;
        }

        /// <summary>
        /// Player chose a tile and play it
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <param name="selectionIndex"></param>
        /// <param name="index"></param>
        /// <returns></returns>
        public static HexaGame? ChooseAndPlace(uint blockNumber, HexaGame hexaGame, byte playerIndex, int selectionIndex, int index)
        {
            return ChooseAndPlace(blockNumber, hexaGame, playerIndex, selectionIndex, hexaGame.HexaTuples[playerIndex].board.ToCoords(index));
        }

        /// <summary>
        /// Player chose a tile and play it
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <param name="selectionIndex"></param>
        /// <param name="coords"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public static HexaGame? ChooseAndPlace(uint blockNumber, HexaGame hexaGame, byte playerIndex, int selectionIndex, (int, int) coords)
        {
            if (!hexaGame.ChooseAndPlace(playerIndex, selectionIndex, coords))
            {
                return null;
            }

            hexaGame.PostMove(blockNumber);

            return hexaGame;
        }

        /// <summary>
        /// Player upgrade a tile
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <param name="index"></param>
        /// <returns></returns>
        public static HexaGame? Upgrade(uint blockNumber, HexaGame hexaGame, byte playerIndex, int index)
        {
            return Upgrade(blockNumber, hexaGame, playerIndex, hexaGame.HexaTuples[playerIndex].board.ToCoords(index));
        }

        /// <summary>
        /// Player upgrade a tile
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        public static HexaGame? Upgrade(uint blockNumber, HexaGame hexaGame, byte playerIndex, (int, int) coords)
        {
            if (!hexaGame.Upgrade(playerIndex, coords))
            {
                return null;
            }

            hexaGame.PostMove(blockNumber);

            return hexaGame;
        }

        /// <summary>
        /// Player finish his turn or win the game by call a late opponent
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        public static HexaGame? FinishTurn(uint blockNumber, HexaGame hexaGame, byte playerIndex)
        {
            // Update game turn information
            if (!hexaGame.FinsihTurn(blockNumber, playerIndex))
            {
                return null;
            }

            // Add new ressouces to player
            hexaGame.CalcRewards(blockNumber, playerIndex);
            Log.Debug("Rewards calculated for player {index}", playerIndex);

            // Does the current player win ?
            if (hexaGame.IsFinished())
            {
                return hexaGame;
            }

            if (hexaGame.PlayerTurn != 0)
            {
                Log.Debug("Players does not have already played this turn");
                return hexaGame;
            }

            hexaGame.NextRound(blockNumber);

            return hexaGame;
        }
    
        /// <summary>
        /// Force an opponents turn to finish
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        public static HexaGame? ForceFinishTurn(uint blockNumber, HexaGame hexaGame, byte playerIndex)
        {
            // Update game turn information
            if (!hexaGame.FinsihTurn(blockNumber, playerIndex))
            {
                return null;
            }

            // Does the current player win ?
            if (hexaGame.IsFinished())
            {
                return hexaGame;
            }

            if (hexaGame.PlayerTurn != 0)
            {
                Log.Debug("Players does not have already played this turn");
                return hexaGame;
            }

            hexaGame.NextRound(blockNumber);

            return hexaGame;
        }
    
        /// <summary>
        /// Receive rewards from the game
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <returns></returns>
        public static HexaGame? ReceiveRewards(uint blockNumber, HexaGame hexaGame)
        {
            throw new NotImplementedException();
        }   
    }
}