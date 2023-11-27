using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static System.Collections.Specialized.BitVector32;

namespace Substrate.Hexalem.NET.AI
{
    public class MinMax : AI
    {
        private readonly int _maxDepth;
        private PlayAction? bestAction;

        public override string AiName => "MinMax";

        public MinMax(int index, int maxDepth) : base(index)
        {
            _maxDepth = maxDepth;
        }

        public override PlayAction FindBestAction(HexaGame initialState, int iteration)
        {
            int bestScore = int.MinValue;

            foreach (PlayAction action in GetPossibleActions(initialState))
            {
                int score = Minimax(ApplyAction(initialState, action), 0, false);

                if (score > bestScore)
                {
                    bestScore = score;
                    bestAction = action;
                }
            }

            return bestAction;
        }

        private int Minimax(HexaGame state, int depth, bool isMaximizingPlayer)
        {
            if (depth == _maxDepth || IsTerminal(state))
            {
                return Evaluate(state);
            }

            if (isMaximizingPlayer)
            {
                int maxEval = int.MinValue;

                foreach (PlayAction action in GetPossibleActions(state))
                {
                    int eval = Minimax(ApplyAction(state, action), depth + 1, false);
                    maxEval = Math.Max(maxEval, eval);
                }

                return maxEval;
            }
            else
            {
                int minEval = int.MaxValue;

                foreach (PlayAction action in GetPossibleActions(state))
                {
                    int eval = Minimax(ApplyAction(state, action), depth + 1, true);
                    minEval = Math.Min(minEval, eval);
                }

                return minEval;
            }
        }

        private bool IsTerminal(HexaGame state)
        {
            // Check if the state is terminal (end of the game).
            // Return true if the game is over, false otherwise.
            return !bestAction.CanPlay;
        }

        private List<PlayAction> GetPossibleActions(HexaGame state)
        {
            var possibleActions = new List<PlayAction>();

            var selectionTiles = SelectionTiles(state);
            var emptyMapTiles = EmptyMapTiles(state);
            var upgradableTiles = UpgradableTiles(state);

            var canPlayTile = emptyMapTiles.Any();
            var canUpgradeTile = upgradableTiles.Any();

            // No action are available => we are stuck
            if(!canPlayTile && !canUpgradeTile)
                return possibleActions;


            for(int i = 0; i < selectionTiles.Count; i++)
            {
                // Each tile that can be bought from the selection has to be put on the map
                foreach (var emptyTile in emptyMapTiles)
                {
                    possibleActions.Add(PlayAction.Play(i, emptyTile));
                }
            }

            foreach (var tileUpgrade in upgradableTiles)
            {
                possibleActions.Add(PlayAction.Upgrade(tileUpgrade));
            }

            return possibleActions;
        }

        private HexaGame ApplyAction(HexaGame state, PlayAction action)
        {
            if(action.PlayTileAt != null)
            {
                state = Game.ChooseAndPlace(1, state, (byte)_index, action.SelectionIndex!.Value, action.PlayTileAt!.Value);
            }

            if(action.UpgradeTileAt != null)
            {
                state = Game.Upgrade(1, state, (byte)_index, action.UpgradeTileAt.Value);
            }
            

            return state;
        }

        private int Evaluate(HexaGame state)
        {
            var hexaPlayer = state.HexaTuples[_index].player;
            var hexaBoardStats = state.HexaTuples[_index].board.Stats();

            var newMana = state.Evaluate(RessourceType.Mana, hexaPlayer, hexaBoardStats);
            var newHumans = state.Evaluate(RessourceType.Humans, hexaPlayer, hexaBoardStats);
            var newWater = state.Evaluate(RessourceType.Water, hexaPlayer, hexaBoardStats);
            var newFood = state.Evaluate(RessourceType.Food, hexaPlayer, hexaBoardStats);
            var newWood = state.Evaluate(RessourceType.Wood, hexaPlayer, hexaBoardStats);
            var newStone = state.Evaluate(RessourceType.Stone, hexaPlayer, hexaBoardStats);
            var newGold = state.Evaluate(RessourceType.Gold, hexaPlayer, hexaBoardStats);

            return 0;
        }
    }
}
