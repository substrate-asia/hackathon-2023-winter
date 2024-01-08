using Substrate.Hexalem.Engine;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Hexalem.Game
{
    public class MonteCarlo : Strategy
    {
        public override string AiName => "MonteCarlo";

        private sealed class Node
        {
            public HexaGame State { get; }
            public PlayAction Action { get; }
            public int Visits { get; set; }
            public double Score { get; set; }
            public List<Node> Children { get; } = new List<Node>();
            public Node Parent { get; }

            public Node(HexaGame state, PlayAction action, Node parent)
            {
                State = state;
                Action = action;
                Parent = parent;
            }
        }

        private readonly int _explorationParameter;
        private readonly Random _random = new Random();

        public MonteCarlo(int index, int explorationParameter = 2) : base(index)
        {
            _explorationParameter = explorationParameter;
        }

        public override PlayAction FindBestAction(HexaGame initialState, int iterations)
        {
            var root = new Node(initialState, default, null);

            for (int i = 0; i < iterations; i++)
            {
                Node selectedNode = Select(root);
                double simulationResult = Simulate(selectedNode);
                Backpropagate(selectedNode, simulationResult);
            }

            return GetBestAction(root);
        }

        private Node Select(Node node)
        {
            while (node.Children.Any())
            {
                node = UCTSelectChild(node);
            }
            return node;
        }

        private Node UCTSelectChild(Node node)
        {
            double logTotalVisits = Math.Log(node.Visits);

            var selectedNode = node.Children
                .OrderBy(child =>
                    child.Score / child.Visits +
                    _explorationParameter * Math.Sqrt(logTotalVisits / child.Visits))
                .Last();

            return selectedNode;
        }

        private double Simulate(Node node)
        {
            // For simplicity, this simulation is random. In a real game, you'd use a simulation based on game rules.
            HexaGame currentState = node.State;
            while (!IsTerminal(currentState))
            {
                var possibleActions = GetPossibleActions(currentState);
                PlayAction randomAction = possibleActions[_random.Next(possibleActions.Count)];
                currentState = ApplyAction(currentState, randomAction);
            }

            return Evaluate(currentState);
        }

        private void Backpropagate(Node node, double result)
        {
            while (node != null)
            {
                node.Visits++;
                node.Score += result;
                node = node.Parent;
            }
        }

        private PlayAction GetBestAction(Node root)
        {
            var bestChild = root.Children
            .OrderBy(child => child.Visits)
                .LastOrDefault();

            return bestChild.Action ?? default;
        }

        // Implement the following methods based on your specific game rules:
        private bool IsTerminal(HexaGame state)
        {
            // Check if the state is terminal (end of the game).
            // Return true if the game is over, false otherwise.
            return false;
        }

        private List<PlayAction> GetPossibleActions(HexaGame state)
        {
            // Return a list of possible actions from the current state.
            return new List<PlayAction>();
        }

        private HexaGame ApplyAction(HexaGame state, PlayAction action)
        {
            // Apply the given action to the current state and return the new state.
            return state;
        }

        private double Evaluate(HexaGame state)
        {
            // Evaluate the given state and return a score.
            // This could be based on some heuristics or other evaluation methods.
            return 0.0;
        }
    }
}