using Ardalis.GuardClauses;
using Serilog;
using Substrate.Hexalem.NET.Extension;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Substrate.Hexalem.NET
{
    public class Rewards
    {
        private sealed class VisitedTile
        {
            public VisitedTile(bool alreadyVisisted, HexTile hexTile)
            {
                this.IsAlreadyVisisted = alreadyVisisted;
                this.HexTile = hexTile;
            }

            public bool IsAlreadyVisisted { get; set; }
            public HexTile HexTile { get; set; }

            public void Visit() => IsAlreadyVisisted = true;

            public override string ToString()
            {
                return $"{IsAlreadyVisisted} | {HexTile.ToString()}";
            }

        }

        private class VisitGrid : HexGrid<VisitedTile>
        {
            public VisitGrid(VisitedTile[] tiles) : base(tiles)
            {
            }
        }

        public static int CalcReward(HexGrid hexGrid, ILogger logger)
        {
            int reward = 0;
            var visitedTiles = hexGrid.Tiles.Select(x => new VisitedTile(false, x)).ToArray();
            var visitGrid = new VisitGrid(visitedTiles);

            for (int i = 0; i < visitGrid.Tiles.Count(); i++)
            {
                var adjacents = visitGrid
                    .GetNeighbors(i)
                    .Select(x => visitGrid.ToTile(x.q, x.r));

                foreach(var combinaisons in GetAllCombinaison(adjacents, GameConfig.BonusGroupedRessources))
                {
                    // Check all tiles are same
                    var typeTile = combinaisons.First();
                    if (combinaisons.All(x => !typeTile.IsAlreadyVisisted && typeTile.HexTile.GetHexTileType() == x.HexTile.GetHexTileType()))
                    {
                        var bonus = typeTile.HexTile.BonusPoint();
                        reward += bonus;
                        logger.Information($"{GameConfig.BonusGroupedRessources} {typeTile} adjacent. Bonus = {bonus}. Rewards are now {reward}");
                        
                        foreach(var combinaison in combinaisons)
                        {
                            combinaison.Visit();
                        }
                    }
                }
            }

            return reward;
        }

        /// <summary>
        /// Return all combinaison
        /// </summary>
        /// <param name="tiles"></param>
        /// <param name="nbGroupBy"></param>
        /// <returns></returns>
        public static IEnumerable<IEnumerable<T>> GetAllCombinaison<T>(IEnumerable<T> tiles, int nbGroupBy)
        {
            Guard.Against.Null(tiles);
            Guard.Against.NegativeOrZero(nbGroupBy);

            if(nbGroupBy > tiles.Count())
            {
                throw new ArgumentException("Invalid group value which is greater than tiles number");
            }

            return tiles.Combinations(nbGroupBy);
        }
    }
}

