using Serilog;
using Substrate.Hexalem.Engine;
using System;
using System.Linq;

namespace Substrate.Hexalem.Game
{
    public class RandomAI : Strategy
    {
        private readonly Random _random;

        public RandomAI(int index) : base(index)
        {
            _random = new Random();
        }

        public override string AiName => "Random";

        public override PlayAction FindBestAction(HexaGame initialState, int iteration)
        {
            var buyableTiles = SelectionTiles(initialState);

            // If the player cannot buy any tiles (assume that he cannot upgrade tile either) => cannot play
            if (!buyableTiles.Any())
            {
                Log.Information("[AI {index}] does not have enough mana to buy a new tile", _index);
                return PlayAction.CannotPlay();
            }

            var freeMapTiles = EmptyMapTiles(initialState);
            var canPlayTile = freeMapTiles.Any();
            var upgradableTiles = UpgradableTiles(initialState);
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

            if (selectedMove == "play")
            {
                var selectedTileIndex = _random.Next(buyableTiles.Count);
                var tileCoords = freeMapTiles[_random.Next(freeMapTiles.Count)];

                Log.Information("[AI {_index} Random] choose tile num {num} ({typeTile}) to play at ({r},{q})", _index, selectedTileIndex, buyableTiles[selectedTileIndex], tileCoords.q, tileCoords.r);

                return PlayAction.Play(selectedTileIndex, tileCoords);
            }
            else
            {
                var upgradableTilesIndex = _random.Next(upgradableTiles.Count);
                var tileCoords = upgradableTiles[upgradableTilesIndex];

                Log.Information("[AI {_index} Random] choose to upgrade tile ({r},{q})", _index, tileCoords.q, tileCoords.r);

                return PlayAction.Upgrade(tileCoords);
            }
        }
    }
}