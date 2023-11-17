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
            public int Q { get; set; }
            public int R { get; set; }
            public VisitedTile(bool alreadyVisisted, HexTile hexTile, int q, int r)
            {
                this.IsAlreadyVisisted = alreadyVisisted;
                this.HexTile = hexTile;
                this.Q = q;
                this.R = r;
            }

            public bool IsAlreadyVisisted { get; set; }
            public HexTile HexTile { get; set; }

            public void Visit() => IsAlreadyVisisted = true;

            public override string ToString()
            {
                return $"[{Q};{R}] | {IsAlreadyVisisted} | {HexTile}";
            }

        }

        private class VisitGrid : HexGrid<VisitedTile>
        {
            public VisitGrid(VisitedTile[] tiles) : base(tiles)
            {
            }
        }

        private static VisitGrid BuildFromHexGrid(HexGrid hexGrid)
        {
            var visitedTiles = new List<VisitedTile>();
            for (int i = 0; i < hexGrid.Tiles.Length; i++)
            {
                var coordinate = hexGrid.ToAxialCoordinates(i);
                visitedTiles.Add(new VisitedTile(false, hexGrid.Tiles[i], coordinate.q, coordinate.r));
            }

            return new VisitGrid(visitedTiles.ToArray());
        }

        public static int CalcReward(HexGrid hexGrid, ILogger logger)
        {
            int reward = 0;
            //var visitedTiles = hexGrid.Tiles.Select(x => new VisitedTile(false, x)).ToArray();

            var visitGrid = BuildFromHexGrid(hexGrid);

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

                        string log = $"Match combinaison = [{string.Join(", ", combinaisons.Select(x => (x.Q, x.R)))}] | Grouped ressource = {GameConfig.BonusGroupedRessources} adjacent. Bonus = {bonus}. Rewards are now {reward}";
                        logger.Information(log);
                        
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

            return tiles.Combinations(nbGroupBy);
        }
    }
}

