using Substrate.Hexalem.Engine;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Hexalem.Game
{
    public abstract class Strategy
    {
        /// <summary>
        /// Current player index
        /// </summary>
        protected readonly int _index;

        protected Strategy(int index)
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
            var tilesTobuy = new List<HexaTile>();

            foreach (byte index in hexGame.UnboundTileOffers)
            {
                var tileOffer = GameConfig.TILE_COSTS[index];

                if (hexGame.HexaTuples[hexGame.PlayerTurn].player[tileOffer.SelectCost.MaterialType] >= tileOffer.SelectCost.Cost)
                {
                    tilesTobuy.Add(tileOffer.TileToBuy);
                }
            }

            return tilesTobuy;
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
                 *  Lower level than 3
                 *  Have enough ressources to pay the upgrade
                 */

                var currentTile = (HexaTile)playerBoard[i];

                if (HexalemConfig.GetInstance().MapTileUpgradeCost.TryGetValue(currentTile.TileType, out List<byte[]> costs) && costs.Count > currentTile.TileLevel)
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
            return !(UpgradableTiles(state).Any() || SelectionTiles(state).Any() && EmptyMapTiles(state).Any());
        }

        /// <summary>
        /// Expose available win condition a player can choose
        /// </summary>
        /// <returns></returns>
        public static TargetGoal ChooseWinningCondition()
        {
            var values = Enum.GetValues(typeof(TargetGoal))
                .Cast<TargetGoal>().ToArray();

            return (TargetGoal)new System.Random().Next(values.Length);
        }
    }
}