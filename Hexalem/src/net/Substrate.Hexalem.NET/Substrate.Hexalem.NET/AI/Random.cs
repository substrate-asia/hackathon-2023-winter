using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Substrate.Hexalem.NET.AI
{
    public class Random : IThinking
    {
        private readonly System.Random _random;
        private readonly int _index;

        public Random(int index)
        {
            _random = new System.Random();
            _index = index;
        }

        public string AiName => "Random";

        public PlayAction FindBestAction(HexaGame initialState, int iteration)
        {
            var buyableTiles = BuyableTiles(initialState);

            if(!buyableTiles.Any())
            {
                Log.Information("[AI {index}] does not have enough mana to buy a new tile", _index);
                return PlayAction.CannotPlay();
            }

            var availableTiles = AvailableTiles(initialState);

            if(!availableTiles.Any())
            {
                Log.Warning("[AI {index}] have full board !", _index);
                return PlayAction.CannotPlay();
            }

            var selectedTileIndex = _random.Next(buyableTiles.Count);
            var tileCoords = availableTiles[_random.Next(availableTiles.Count)];

            Log.Information("[AI {_index}] choose tile num {num} ({typrTile}) to play at ({r},{q})", _index, selectedTileIndex, buyableTiles[selectedTileIndex], tileCoords.q, tileCoords.r);


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
