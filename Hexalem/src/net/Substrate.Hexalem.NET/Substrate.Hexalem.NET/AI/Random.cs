using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Substrate.Hexalem.NET.AI
{
    public class Random: IThinking
    {
        private readonly System.Random _random;
        private readonly int _index;

        public Random(System.Random random, int index)
        {
            _random = random;
            _index = index;
        }

        public PlayAction FindBestAction(HexaGame initialState, int iteration)
        {
            var buyableTiles = BuyableTiles(initialState);

            if(!buyableTiles.Any())
            {
                Log.Information($"[AI {_index} does not have enough mana to buy a new tile");
                return PlayAction.CannotPlay();
            }

            var availableTiles = AvailableTiles(initialState);

            if(!availableTiles.Any())
            {
                Log.Information($"[AI {_index} does not have free tiles to play");
                return PlayAction.CannotPlay();
            }

            var selectedTileIndex = _random.Next(buyableTiles.Count);
            var selectedTile = buyableTiles[selectedTileIndex];

            var tileCoords = availableTiles[_random.Next(availableTiles.Count)];

            return PlayAction.Play(selectedTileIndex, tileCoords);
        }

        /// <summary>
        /// Return list of tile AI can buy
        /// </summary>
        /// <returns></returns>
        private List<HexaTile> BuyableTiles(HexaGame hexGame)
        {
            // Each tile cost 1 mana
            if(hexGame.HexaTuples[hexGame.PlayerTurn].player[RessourceType.Mana] == 0)
            {
                return new List<HexaTile>();
            }

            return hexGame.UnboundTiles;
        }

        /// <summary>
        /// Return tiles where AI can play
        /// </summary>
        /// <returns></returns>
        private List<(int q, int r)> AvailableTiles(HexaGame hexGame)
        {
            var freeTiles = new List<(int, int)>();
            var playerBoard = hexGame.HexaTuples[_index].board;
            for (int i = 0; i < playerBoard.Value.Length; i++)
            {
                if(((HexaTile)playerBoard[i]).IsEmpty())
                {
                    freeTiles.Add(playerBoard.ToCoords(i));
                }
            }

            return freeTiles;
        }
    }
}
