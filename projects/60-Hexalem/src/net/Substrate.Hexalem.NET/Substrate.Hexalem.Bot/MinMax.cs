using Serilog;
using Substrate.Hexalem.Engine;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Hexalem.Game
{
    public class MinMax : Strategy
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
                var gameClone = (HexaGame)initialState.Clone();
                int score = Minimax(ApplyAction(gameClone, action), 0, true);

                if (score > bestScore)
                {
                    bestScore = score;
                    bestAction = action;
                }
            }

            if (bestAction.CanPlay)
            {
                if (bestAction.PlayTileAt != null)
                {
                    Log.Information("[AI {_index} MinMax] choose tile num {num} ({typeTile}) to play at ({r},{q})", _index, bestAction.SelectionIndex, SelectionTiles(initialState)[bestAction.SelectionIndex.Value], bestAction.PlayTileAt.Value.q, bestAction.PlayTileAt.Value.r);
                }
                else if (bestAction.UpgradeTileAt != null)
                {
                    var tileUpgraded = (HexaTile)initialState.HexaTuples[initialState.PlayerTurn].board[bestAction.UpgradeTileAt.Value.q, bestAction.UpgradeTileAt.Value.r];
                    Log.Information("[AI {_index} MinMax] choose tu upgrade tile ({typeTile}) at ({r},{q})", _index, tileUpgraded, bestAction.UpgradeTileAt.Value.q, bestAction.UpgradeTileAt.Value.r);
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

            //state = Game.FinishTurn(0, state, state.PlayerTurn);
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
            if (!canPlayTile && !canUpgradeTile)
                return possibleActions;

            for (int i = 0; i < selectionTiles.Count; i++)
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

            Log.Debug("[MinMax - GetPossibleActions] {nb} possible action found", possibleActions.Count);
            return possibleActions;
        }

        private HexaGame ApplyAction(HexaGame state, PlayAction action)
        {
            if (action.PlayTileAt != null)
            {
                //state = Game.ChooseAndPlace(1, state, (byte)_index, action.SelectionIndex!.Value, action.PlayTileAt!.Value);
            }

            if (action.UpgradeTileAt != null)
            {
                //state = Game.Upgrade(1, state, (byte)_index, action.UpgradeTileAt.Value);
            }

            return state;
        }

        private int Evaluate(HexaGame state)
        {
            var hexaPlayer = state.HexaTuples[_index].player;
            var hexaBoardStats = state.HexaTuples[_index].board.Stats();

            var newMana = HexaGame.Evaluate(RessourceType.Mana, hexaPlayer, hexaBoardStats);
            var newHumans = HexaGame.Evaluate(RessourceType.Humans, hexaPlayer, hexaBoardStats);
            var newWater = HexaGame.Evaluate(RessourceType.Water, hexaPlayer, hexaBoardStats);
            var newFood = HexaGame.Evaluate(RessourceType.Food, hexaPlayer, hexaBoardStats);
            var newWood = HexaGame.Evaluate(RessourceType.Wood, hexaPlayer, hexaBoardStats);
            var newStone = HexaGame.Evaluate(RessourceType.Stone, hexaPlayer, hexaBoardStats);
            var newGold = HexaGame.Evaluate(RessourceType.Gold, hexaPlayer, hexaBoardStats);

            var score =
                manaScore(hexaPlayer.TargetGoal) * newMana +
                humanScore(hexaPlayer.TargetGoal) * newHumans +
                waterScore(hexaPlayer.TargetGoal) * newWater +
                foodScore(hexaPlayer.TargetGoal) * newFood +
                woodScore(hexaPlayer.TargetGoal) * newWood +
                stoneScore(hexaPlayer.TargetGoal) * newStone +
                goldScore(hexaPlayer.TargetGoal) * newGold;

            Log.Debug("\t[MinMax evaluation] Score = {score}", score);
            return score;
        }

        private int manaScore(TargetGoal wc) => 5;

        private int humanScore(TargetGoal wc) => wc == TargetGoal.HumanThreshold ? 8 : 5;

        private int waterScore(TargetGoal wc) => 1;

        private int foodScore(TargetGoal wc) => 1;

        private int woodScore(TargetGoal wc) => 1;

        private int stoneScore(TargetGoal wc) => 1;

        private int goldScore(TargetGoal wc) => wc == TargetGoal.GoldThreshold ? 8 : 5;
    }
}