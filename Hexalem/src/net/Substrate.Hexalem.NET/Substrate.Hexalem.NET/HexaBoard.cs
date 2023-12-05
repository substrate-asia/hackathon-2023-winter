
using Substrate.Hexalem.NET;
using Substrate.Hexalem.NET.GameException;
using System;
using System.Collections.Generic;

namespace Substrate.Hexalem
{
    public class HexaBoard : IHexaBase
    {
        // Implicit operator to convert a HexGrid to a byte[]
        public static implicit operator byte[](HexaBoard hexGrid) => hexGrid.Value;

        // Implicit operator to convert a byte[] to a HexGrid
        public static implicit operator HexaBoard(byte[] bytes) => new HexaBoard(bytes);

        private readonly int _sideLength;
        private readonly int _maxDistanceFromCenter;

        public byte[] Value { get; set; }

        /// <summary>
        /// HexGrid constructor, bytes need to be of size 9, 25 or 49
        /// An odd number power two, to have a middle tile
        /// </summary>
        /// <param name="bytes"></param>
        public HexaBoard(byte[] bytes)
        {
            Value = bytes;

            // Check if the byte array is of a valid size
            if (bytes.Length != (int)GridSize.Small &&
                bytes.Length != (int)GridSize.Medium &&
                bytes.Length != (int)GridSize.Large)
            {
                throw new NotSupportedException("Invalid byte array size");
            }

            _sideLength = (int)Math.Sqrt(bytes.Length);
            _maxDistanceFromCenter = (_sideLength - 1) / 2;
        }

        public GridSize CalcGridSize()
        {
            switch (Value.Length)
            {
                case (int)GridSize.Small:
                    return GridSize.Small;

                case (int)GridSize.Medium:
                    return GridSize.Medium;

                case (int)GridSize.Large:
                    return GridSize.Large;

                default:
                    throw new NotSupportedException("Invalid byte array size");
            }
        }

        public void Init(uint blockNumber)
        {
            this[Value.Length / 2] = new HexaTile(TileType.Home, TileRarity.Normal, TilePattern.Normal);
        }

        public void NextRound(uint blockNumber)
        {
        }

        public void PostMove(uint blockNumber)
        {
        }

        internal HexaBoard Clone()
        {
            var cloneBoard = new HexaBoard((byte[])Value.Clone());
            return cloneBoard;
        }

        /// <summary>
        /// Indexer to access the internal array
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public byte this[int index]
        {
            get { return Value[index]; }
            set { Value[index] = value; }
        }

        public byte this[int q, int r]
        {
            get => Value[ToIndex((q, r))!.Value];
            set => Value[ToIndex((q, r))!.Value] = value;
        }

        /// <summary>
        /// Get the side length of the grid
        /// </summary>
        /// <param name="q"></param>
        /// <param name="r"></param>
        /// <returns></returns>
        /// <exception cref="IndexOutOfRangeException"></exception>
        public int? ToIndex((int q, int r)? coords)
        {
            if (coords == null)
            {
                return null;
            }

            int q = coords.Value.q;
            int r = coords.Value.r;

            // Check if the coordinates are valid before proceeding
            if (!IsValidHex(q, r))
            {
                throw new InvalidMapCoordinate($"Hex coordinates (${q}; ${r}) are out of range");
            }

            int index = q + _maxDistanceFromCenter + (r + _maxDistanceFromCenter) * _sideLength;

            return index;
        }

        /// <summary>
        /// Convert a 1D array index back to hexagonal grid coordinates (q, r)
        /// </summary>
        /// <param name="index">The index in the 1D array.</param>
        /// <returns>A tuple (q, r) representing hexagonal coordinates.</returns>
        public (int q, int r) ToCoords(int index)
        {
            if (index < 0 || index >= Value.Length)
            {
                throw new NotSupportedException("Index is out of the range of the grid");
            }

            int q = (index % _sideLength) - _maxDistanceFromCenter;
            int r = index / _sideLength - (_sideLength - 1) / 2;

            return (q, r);
        }

        /// <summary>
        /// Get the neighbors of a hex tile in the grid
        /// </summary>
        public List<(int q, int r)?> GetNeighbors((int, int) coord)
        {
            var neighbors = new List<(int q, int r)?>();
            var directions = new[] { (0, -1), (+1, -1), (+1, 0), (0, +1), (-1, +1), (-1, 0) };

            foreach (var direction in directions)
            {
                int neighbor_q = coord.Item1 + direction.Item1;
                int neighbor_r = coord.Item2 + direction.Item2;

                if (IsValidHex(neighbor_q, neighbor_r))
                {
                    neighbors.Add((neighbor_q, neighbor_r));
                }
                else
                {
                    neighbors.Add(null);
                }
            }

            return neighbors;
        }

        /// <summary>
        /// Set patterns only around a tile and it's impacting neighbours
        /// </summary>
        /// <param name="tileCoords"></param>
        /// <returns></returns>
        public List<List<int>> SetPatterns((int, int) tileCoords)
        {
            List<int> impactTiles = new List<int>() { ToIndex(tileCoords).Value };
            foreach (var neighbour in GetNeighbors(tileCoords))
            {
                var neighbourIndex = ToIndex(neighbour);
                if (neighbourIndex != null)
                {
                    impactTiles.Add(neighbourIndex.Value);
                }
            }

            List<List<int>> result = new List<List<int>>();
            foreach (var i in impactTiles)
            {
                var patternResult = SetPatternAroundTile(i);
                if (patternResult != null)
                {
                    result.Add(patternResult);
                }
            }

            return result;
        }

        /// <summary>
        /// Set patterns on the whole grid
        /// </summary>
        /// <returns></returns>
        public List<List<int>> SetPatterns()
        {
            List<List<int>> result = new List<List<int>>();
            for (int i = 0; i < Value.Length; i++)
            {
                var patternResult = SetPatternAroundTile(i);
                if (patternResult != null)
                {
                    result.Add(patternResult);
                }
            }

            return result;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="tileIndex"></param>
        /// <returns></returns>
        /// <exception cref="NotSupportedException"></exception>
        internal List<int> SetPatternAroundTile(int tileIndex)
        {
            HexaTile t = Value[tileIndex];
            if (t == null || t.TilePattern != TilePattern.Normal)
            {
                return null;
            }

            var coords = ToCoords(tileIndex);
            List<(int, int)?> neighbours = GetNeighbors(coords);
            List<(int, HexaTile)?> n = new List<(int, HexaTile)?>() { (tileIndex, t) };
            foreach (var neighbour in neighbours)
            {
                var index = ToIndex(neighbour);
                if (index == null)
                {
                    n.Add(null);
                    continue;
                }

                n.Add((index.Value, (HexaTile)Value[index.Value]));
            }

            if (n.Count != 7)
            {
                throw new NotSupportedException("Not the correct amount of neighbours to process!");
            }

            (TilePattern, int[])? pattern = GetPattern(n);

            if (pattern == null)
            {
                return null;
            }

            var list = new List<int>();
            foreach (var index in pattern.Value.Item2)
            {
                var hexaTile = (HexaTile)Value[tileIndex];
                hexaTile.TilePattern = pattern.Value.Item1;
                Value[tileIndex] = hexaTile;
                list.Add(index);
            }

            return list;
        }

        /// <summary>
        /// Get the pattern of a hex tile in the grid
        /// </summary>
        /// <param name="n"></param>
        /// <returns></returns>
        internal (TilePattern pattern, int[] indices)? GetPattern(List<(int indice, HexaTile tile)?> n)
        {
            // delta
            if (n[1] != null && n[2] != null && n[1].Value.tile.Same(n[2].Value.tile) && n[0].Value.tile.Same(n[2].Value.tile))
            {
                return (TilePattern.Delta, new[] { n[0].Value.indice, n[1].Value.indice, n[2].Value.indice });
            }
            else if (n[2] != null && n[3] != null && n[2].Value.tile.Same(n[3].Value.tile) && n[0].Value.tile.Same(n[3].Value.tile))
            {
                return (TilePattern.Delta, new[] { n[0].Value.indice, n[2].Value.indice, n[3].Value.indice });
            }
            else if (n[3] != null && n[4] != null && n[3].Value.tile.Same(n[4].Value.tile) && n[0].Value.tile.Same(n[4].Value.tile))
            {
                return (TilePattern.Delta, new[] { n[0].Value.indice, n[3].Value.indice, n[4].Value.indice });
            }
            else if (n[4] != null && n[5] != null && n[4].Value.tile.Same(n[5].Value.tile) && n[0].Value.tile.Same(n[5].Value.tile))
            {
                return (TilePattern.Delta, new[] { n[0].Value.indice, n[4].Value.indice, n[5].Value.indice });
            }
            else if (n[5] != null && n[6] != null && n[5].Value.tile.Same(n[6].Value.tile) && n[0].Value.tile.Same(n[6].Value.tile))
            {
                return (TilePattern.Delta, new[] { n[0].Value.indice, n[5].Value.indice, n[6].Value.indice });
            }
            else if (n[6] != null && n[1] != null && n[6].Value.tile.Same(n[1].Value.tile) && n[0].Value.tile.Same(n[1].Value.tile))
            {
                return (TilePattern.Delta, new[] { n[0].Value.indice, n[6].Value.indice, n[1].Value.indice });
            }
            else
            // line
            if (n[1] != null && n[4] != null && n[1].Value.tile.Same(n[4].Value.tile) && n[0].Value.tile.Same(n[4].Value.tile))
            {
                return (TilePattern.Line, new[] { n[0].Value.indice, n[1].Value.indice, n[4].Value.indice });
            }
            else if (n[2] != null && n[5] != null && n[2].Value.tile.Same(n[5].Value.tile) && n[0].Value.tile.Same(n[5].Value.tile))
            {
                return (TilePattern.Line, new[] { n[0].Value.indice, n[2].Value.indice, n[5].Value.indice });
            }
            else if (n[3] != null && n[6] != null && n[3].Value.tile.Same(n[6].Value.tile) && n[0].Value.tile.Same(n[6].Value.tile))
            {
                return (TilePattern.Line, new[] { n[0].Value.indice, n[3].Value.indice, n[6].Value.indice });
            }
            else
            // ypsilon
            if (n[1] != null && n[3] != null && n[5] != null && n[1].Value.tile.Same(n[3].Value.tile) && n[1].Value.tile.Same(n[5].Value.tile) && n[0].Value.tile.Same(n[5].Value.tile))
            {
                return (TilePattern.Ypsilon, new[] { n[0].Value.indice, n[1].Value.indice, n[3].Value.indice, n[5].Value.indice });
            }
            else if (n[2] != null && n[4] != null && n[6] != null && n[2].Value.tile.Same(n[4].Value.tile) && n[2].Value.tile.Same(n[6].Value.tile) && n[0].Value.tile.Same(n[6].Value.tile))
            {
                return (TilePattern.Ypsilon, new[] { n[0].Value.indice, n[2].Value.indice, n[4].Value.indice, n[6].Value.indice });
            }

            return null;
        }

        /// <summary>
        /// Check if the hexagon at (q, r) is within the valid bounds of the grid
        /// </summary>
        internal bool IsValidHex(int q, int r)
        {
            return Math.Abs(q) <= _maxDistanceFromCenter && Math.Abs(r) <= _maxDistanceFromCenter;
        }

        /// <summary>
        /// Check if a tile can be placed on the board
        /// </summary>
        /// <param name="coords"></param>
        /// <returns></returns>
        internal bool CanPlace((int, int) coords)
        {
             var index = ToIndex(coords);

            if (index == null)
            {
                return false;
            }

            // Check if the tile is empty
            if (Value[index.Value] != 0x00)
            {
                return false;
            }

            // Check if the tile is not surrounded by empty tiles
            var neighbours = GetNeighbors(coords);
            if (!neighbours.Exists(p => p.HasValue && this[p.Value.q, p.Value.r] != 0x00))
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Place a tile on the board
        /// </summary>
        /// <param name="coords"></param>
        /// <param name="tile"></param>
        /// <returns></returns>
        internal bool Place((int, int) coords, HexaTile tile)
        {
            if (!CanPlace(coords))
            {
                return false;
            }

            var index = ToIndex(coords);

            Value[index.Value] = tile;

            return true;
        }
        
        internal void CheckFormations((int, int) coords)
        {
            var neighbours = GetNeighbors(coords);

            neighbours.Add(coords);

            foreach((int, int)? c in neighbours)
            {
                if(c != null)
                {
                    int index = ToIndex(coords).Value;

                    HexaTile tile = Value[index];

                    switch (tile.TileType) {
                        case TileType.Tree:

                            var treeNeighbours = GetNeighbors(c.Value);

                            var delta = GetDeltaPosition(treeNeighbours);

                            tile.SetFormationFlag1 = (delta.HasValue && delta.Value.Item1 == TileType.Tree && delta.Value.Item2 == TileType.Tree);

                            var reverseDelta = GetReverseDeltaPosition(treeNeighbours);

                            tile.SetFormationFlag2 = (reverseDelta.HasValue && reverseDelta.Value.Item1 == TileType.Tree && reverseDelta.Value.Item2 == TileType.Tree);

                            Value[index] = tile;

                            break;

                        case TileType.Mountain:
                            var mountainNeighbours = GetNeighbors(c.Value);

                            var ypsilon = GetYpsilonPosition(mountainNeighbours);

                            tile.SetFormationFlag1 = (ypsilon.HasValue && ypsilon.Value.Item1 == TileType.Mountain && ypsilon.Value.Item2 == TileType.Mountain && ypsilon.Value.Item3 == TileType.Mountain);

                            var reverseYpsilon = GetReverseYpsilonPosition(mountainNeighbours);

                            tile.SetFormationFlag2 = (reverseYpsilon.HasValue && reverseYpsilon.Value.Item1 == TileType.Mountain && reverseYpsilon.Value.Item2 == TileType.Mountain && reverseYpsilon.Value.Item3 == TileType.Mountain);

                            Value[index] = tile;

                            break;

                        case TileType.Water:
                            var waterNeighbours = GetNeighbors(c.Value);

                            var lineRight = GetLineRightPosition(waterNeighbours);

                            tile.SetFormationFlag1 = (lineRight.HasValue && lineRight.Value.Item1 == TileType.Water && lineRight.Value.Item2 == TileType.Water);

                            var lineLeft = GetLineLeftPosition(waterNeighbours);

                            tile.SetFormationFlag2 = (lineLeft.HasValue && lineLeft.Value.Item1 == TileType.Water && lineLeft.Value.Item2 == TileType.Water);

                            Value[index] = tile;

                            break;

                        case TileType.Grass:
                            var grassNeighbours = GetNeighbors(c.Value);

                            var grassDelta = GetDeltaPosition(grassNeighbours);

                            tile.SetFormationFlag1 = (grassDelta.HasValue && grassDelta.Value.Item1 == TileType.Water && grassDelta.Value.Item2 == TileType.Grass);

                            var grassReverseDelta = GetReverseDeltaPosition(grassNeighbours);

                            tile.SetFormationFlag2 = (grassReverseDelta.HasValue && grassReverseDelta.Value.Item1 == TileType.Grass && grassReverseDelta.Value.Item2 == TileType.Water);

                            Value[index] = tile;

                            break;
                    }

                }
            }
        }

        internal (TileType, TileType)? GetDeltaPosition(List<(int, int)?> neighbours)
        {
            if (neighbours[0].HasValue && neighbours[1].HasValue) {
                int tile1Index = ToIndex(neighbours[0].Value).Value;
                int tile2Index = ToIndex(neighbours[1].Value).Value;

                HexaTile tile1 = Value[tile1Index];
                HexaTile tile2 = Value[tile2Index];

                return (tile1.TileType, tile2.TileType);
            }

            return null;
        }

        internal (TileType, TileType)? GetReverseDeltaPosition(List<(int, int)?> neighbours)
        {
            if (neighbours[1].HasValue && neighbours[2].HasValue)
            {
                int tile1Index = ToIndex(neighbours[1].Value).Value;
                int tile2Index = ToIndex(neighbours[2].Value).Value;

                HexaTile tile1 = Value[tile1Index];
                HexaTile tile2 = Value[tile2Index];

                return (tile1.TileType, tile2.TileType);
            }

            return null;
        }

        internal (TileType, TileType, TileType)? GetYpsilonPosition(List<(int, int)?> neighbours)
        {
            if (neighbours[0].HasValue && neighbours[2].HasValue && neighbours[4].HasValue)
            {
                int tile1Index = ToIndex(neighbours[0].Value).Value;
                int tile2Index = ToIndex(neighbours[2].Value).Value;
                int tile3Index = ToIndex(neighbours[4].Value).Value;

                HexaTile tile1 = Value[tile1Index];
                HexaTile tile2 = Value[tile2Index];
                HexaTile tile3 = Value[tile3Index];

                return (tile1.TileType, tile2.TileType, tile3.TileType);
            }

            return null;
        }

        internal (TileType, TileType, TileType)? GetReverseYpsilonPosition(List<(int, int)?> neighbours)
        {
            if (neighbours[1].HasValue && neighbours[3].HasValue && neighbours[5].HasValue)
            {
                int tile1Index = ToIndex(neighbours[1].Value).Value;
                int tile2Index = ToIndex(neighbours[3].Value).Value;
                int tile3Index = ToIndex(neighbours[5].Value).Value;

                HexaTile tile1 = Value[tile1Index];
                HexaTile tile2 = Value[tile2Index];
                HexaTile tile3 = Value[tile3Index];

                return (tile1.TileType, tile2.TileType, tile3.TileType);
            }

            return null;
        }

        internal (TileType, TileType)? GetLineRightPosition(List<(int, int)?> neighbours)
        {
            if (neighbours[0].HasValue && neighbours[3].HasValue)
            {
                int tile1Index = ToIndex(neighbours[0].Value).Value;
                int tile2Index = ToIndex(neighbours[3].Value).Value;

                HexaTile tile1 = Value[tile1Index];
                HexaTile tile2 = Value[tile2Index];

                return (tile1.TileType, tile2.TileType);
            }

            return null;
        }

        internal (TileType, TileType)? GetLineLeftPosition(List<(int, int)?> neighbours)
        {
            if (neighbours[2].HasValue && neighbours[5].HasValue)
            {
                int tile1Index = ToIndex(neighbours[2].Value).Value;
                int tile2Index = ToIndex(neighbours[5].Value).Value;

                HexaTile tile1 = Value[tile1Index];
                HexaTile tile2 = Value[tile2Index];

                return (tile1.TileType, tile2.TileType);
            }

            return null;
        }

        /// <summary>
        /// Get the stats of the board
        /// </summary>
        /// <returns></returns>
        internal HexaBoardStats Stats()
        {
            var result = new HexaBoardStats();

            for (int i = 0; i < Value.Length; i++)
            {
                HexaTile t = Value[i];

                result[t.TileType] += 1; // total

                // avoid counting none tiles twice
                if (t.TileType != TileType.Empty)
                {
                    result[t.TileType, t.TileRarity] += 1;
                    /// Does not work right now...
                    //result[t.TileType, t.TilePattern] += 1;
                }
            }

            return result;
        }

        /// <summary>
        /// Get the stats of the board
        /// </summary>
        /// <returns></returns>
        internal SimpleBoardStats SimpleStats()
        {
            var boardStats = new SimpleBoardStats();

            for (int i = 0; i < Value.Length; i++)
            {
                HexaTile t = Value[i];

                bool[] formations;
                switch (t.TileType)
                {
                    case TileType.Home:
                        boardStats.Homes += 1;
                        break;
                    case TileType.Tree:
                        boardStats.Trees += 1;

                        formations = t.FormationFlags;

                        boardStats.Forrests += (byte)((formations[0] ? 1 : 0) + (formations[1] ? 1 : 0));
                        break;

                    case TileType.Water:
                        boardStats.Waters += 1;

                        formations = t.FormationFlags;

                        boardStats.Rivers += (byte)((formations[0] ? 1 : 0) + (formations[1] ? 1 : 0));
                        break;
                    case TileType.Mountain:
                        boardStats.Mountains += 1;

                        formations = t.FormationFlags;

                        boardStats.ExtremeMountains += (byte)((formations[0] ? 1 : 0) + (formations[1] ? 1 : 0));
                        break;
                    case TileType.Grass:
                        boardStats.Grass += 1;

                        formations = t.FormationFlags;

                        boardStats.Farms += (byte)((formations[0] ? 1 : 0) + (formations[1] ? 1 : 0));
                        break;
                }
            }

            return boardStats;
        }
    }
}