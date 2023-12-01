using Serilog;
using Substrate.Hexalem.Integration.Model;
using Substrate.Hexalem.NET;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Substrate.Hexalem.Test")]

namespace Substrate.Hexalem
{
    public static class Game
    {
        
        public static HexaGame CreateGame(uint blockNumber, List<HexaPlayer> players, GridSize gridSize)
        {
            Random random = new Random();

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
        /// <param name="coords"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public static HexaGame? ChooseAndPlace(uint blockNumber, HexaGame hexaGame, byte playerIndex, int selectionIndex, 
            (int,int) coords)
        {
            if (!hexaGame.ChooseAndPlace(playerIndex, selectionIndex, coords)) 
            {
                return null;
            }

            hexaGame.PostMove(blockNumber);

            return hexaGame;
        }

        public static HexaGame? Upgrade(uint blockNumber, HexaGame hexaGame, byte playerIndex, (int, int) coords)
        {
            if (!hexaGame.UpgradeTile(playerIndex, coords))
            {
                return null;
            }

            hexaGame.PostMove(blockNumber);

            return hexaGame;
        }

        public static HexaGame? FinishTurn(uint blockNumber, HexaGame hexaGame, byte playerIndex)
        {
            // Update game turn information
            if (!hexaGame.UpdateTurnState(blockNumber, playerIndex))
            {
                return null;
            }

            // Add new ressouces to player
            hexaGame.CalcRewards(blockNumber, playerIndex);
            Log.Debug("Rewards calculated for player {index}", playerIndex);

            // Does the current player win ?
            if(hexaGame.IsGameWon())
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

    }
}