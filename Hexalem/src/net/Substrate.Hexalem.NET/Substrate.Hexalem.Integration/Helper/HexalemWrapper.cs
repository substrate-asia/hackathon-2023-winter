using Substrate.Hexalem;
using Substrate.Hexalem.Engine;
using Substrate.Hexalem.Integration.Model;
using Substrate.NetApi;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Integration.Helper
{
    public static class HexalemWrapper
    {

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
                var hexTiles = board.HexGrid.Select(x => new HexaTile(x.Value));
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