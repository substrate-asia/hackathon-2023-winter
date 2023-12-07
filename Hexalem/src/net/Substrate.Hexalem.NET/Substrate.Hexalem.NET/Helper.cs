using Substrate.Hexalem.Integration.Model;
using Substrate.NetApi;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Hexalem
{
    public static class Helper
    {
        public static T[] ExtractSubArray<T>(T[] source, int startIndex, int length)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));

            if (startIndex < 0 || startIndex >= source.Length)
                throw new ArgumentOutOfRangeException(nameof(startIndex), "Start index must be within the bounds of the source array.");

            if (length < 0 || (startIndex + length) > source.Length)
                throw new ArgumentOutOfRangeException(nameof(length), "Length must be positive and within the bounds of the source array.");

            T[] subArray = new T[length];
            Array.Copy(source, startIndex, subArray, 0, length);
            return subArray;
        }

        /// <summary>
        /// Get the hexa game
        /// </summary>
        /// <param name="game"></param>
        /// <param name="boards"></param>
        /// <returns></returns>
        public static HexaGame GetHexaGame(GameSharp game, BoardSharp[] boards)
        {
            var result = new HexaGame(game.GameId, new List<(HexaPlayer, HexaBoard)>())
            {
                HexBoardState = (HexBoardState)game.State,
                HexBoardRound = game.Round,
                PlayerTurn = game.PlayerTurn,
                SelectBase = game.SelectionSize,
                UnboundTileOffers = game.Selection.Select(x => x).ToList(),
                PlayersCount = (byte)boards.Length
            };

            foreach (var (board, playerAddress) in boards.Zip(game.Players, (b, p) => (b, p)))
            {
                var hexTiles = board.HexGrid.Select(x => new HexaTile(x));
                var currentBoard = new HexaBoard(hexTiles.Select(x => x.Value).ToArray());

                var ressources = new List<byte>()
                {
                    board.Mana,
                    board.Humans,
                    board.Water,
                    board.Food,
                    board.Wood,
                    board.Stone,
                    board.Gold
                };

                var currentPlayer = new HexaPlayer(Utils.GetPublicKeyFrom(playerAddress), ressources.ToArray());

                result.HexaTuples.Add((currentPlayer, currentBoard));
            }

            return result;
        }
    }

}