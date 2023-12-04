using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Substrate.Hexalem.NET.AI
{
    public abstract class AI
    {
        /// <summary>
        /// Current player index
        /// </summary>
        protected readonly int _index;

        protected AI(int index)
        {
            _index = index;
        }

        /// <summary>
        /// AI algorithm name
        /// </summary>
        public abstract string AiName { get; }

        /// <summary>
        /// Choose the best action to perform based on given HexaGame state
        /// </summary>
        /// <param name="initialState"></param>
        /// <param name="iteration"></param>
        /// <returns></returns>
        public abstract PlayAction FindBestAction(HexaGame initialState, int iteration);

        /// <summary>
        /// Return the list of tile AI can buy
        /// </summary>
        /// <returns></returns>
        protected List<HexaTile> SelectionTiles(HexaGame hexGame)
        {
            // Each tile cost 1 mana
            if (hexGame.HexaTuples[hexGame.PlayerTurn].player[RessourceType.Mana] == 0)
            {
                return new List<HexaTile>();
            }

            return hexGame.UnboundTiles;
        }

        /// <summary>
        /// Return the list of tiles which can be upgraded
        /// </summary>
        /// <param name="hexGame"></param>
        /// <returns></returns>
        protected List<(int q, int r)> UpgradableTiles(HexaGame hexGame)
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

                if (player.CanUpgrade(currentTile))
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
        protected List<(int q, int r)> EmptyMapTiles(HexaGame hexGame)
        {
            var freeTiles = new List<(int, int)>();
            var playerBoard = hexGame.HexaTuples[_index].board;
            for (int i = 0; i < playerBoard.Value.Length; i++)
            {
                if (((HexaTile)playerBoard[i]).IsEmpty())
                {
                    freeTiles.Add(playerBoard.ToCoords(i));
                }
            }

            return freeTiles;
        }

        protected bool IsTerminal(HexaGame state)
        {
            // Player can play if :
            // He can upgrade tiles
            // Or : He can buy tile and put them on the board
            return !(UpgradableTiles(state).Any() || (SelectionTiles(state).Any() && EmptyMapTiles(state).Any()));
        }

        /// <summary>
        /// Expose available win condition a player can choose
        /// </summary>
        /// <returns></returns>
        public static WinningCondition ChooseWinningCondition()
        {
            var values = Enum.GetValues(typeof(WinningCondition))
                .Cast<WinningCondition>().ToArray();

            return (WinningCondition)new System.Random().Next(values.Length);
        }
    }
}
