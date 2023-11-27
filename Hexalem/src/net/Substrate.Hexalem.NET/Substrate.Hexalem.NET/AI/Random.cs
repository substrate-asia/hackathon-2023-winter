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

            // If the player cannot buy any tiles (assume that he cannot upgrade tile either) => cannot play
            if (!buyableTiles.Any())
            {
                Log.Information("[AI {index}] does not have enough mana to buy a new tile", _index);
                return PlayAction.CannotPlay();
            }

            var availableTiles = AvailableTiles(initialState);
            var canPlayTile = availableTiles.Any();
            var upgradableTiles = UpgradableTile(initialState);
            var canUpgradeTile = upgradableTiles.Any();

            if (!canPlayTile)
            {
                Log.Warning("[AI {index}] have full board !", _index);
                return PlayAction.CannotPlay();
            }
            
            if (!canUpgradeTile)
            {
                Log.Debug("[AI {index}] have nothing to upgrade !", _index);
            }

            // AI have to choose between buy a new tile and play it, or upgrade a tile
            var selectedMove = (canPlayTile, canUpgradeTile) switch
            {
                (true, false) => "play",
                (false, true) => "upgrade",
                (true, true) => _random.Next(2) % 2 == 0 ? "play" : "upgrade",
                _ => throw new InvalidOperationException("Unexpected error...")
            };

            if(selectedMove == "play")
            {
                var selectedTileIndex = _random.Next(buyableTiles.Count);
                var tileCoords = availableTiles[_random.Next(availableTiles.Count)];

                Log.Information("[AI {_index}] choose tile num {num} ({typeTile}) to play at ({r},{q})", _index, selectedTileIndex, buyableTiles[selectedTileIndex], tileCoords.q, tileCoords.r);


                return PlayAction.Play(selectedTileIndex, tileCoords);
            } else
            {
                var upgradableTilesIndex = _random.Next(upgradableTiles.Count);
                var tileCoords = upgradableTiles[upgradableTilesIndex];

                Log.Information("[AI {_index}] choose to upgrade tile ({r},{q})", _index, tileCoords.q, tileCoords.r);


                return PlayAction.Upgrade(tileCoords);
            }
            
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

        public List<(int q, int r)> UpgradableTile(HexaGame hexGame)
        {
            var upgradableTile = new List<(int, int)>();
            var playerBoard = hexGame.HexaTuples[_index].board;
            var player = hexGame.HexaTuples[hexGame.PlayerTurn].player;

            for (int i = 0; i < playerBoard.Value.Length; i++)
            {
                /*
                 * An upgradable tile have to :
                 *  Be a non empty tile
                 *  Be a valid upgradable tile (defined in Game configuration)
                 *  Lower than epic rarity
                 *  Have enough ressources to pay the upgrade
                 */

                var currentTile = (HexaTile)playerBoard[i];

                if (currentTile.CanUpgrade() && player.CanUpgrade(currentTile))
                {
                    upgradableTile.Add(playerBoard.ToCoords(i));
                }
            }

            return upgradableTile;
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
