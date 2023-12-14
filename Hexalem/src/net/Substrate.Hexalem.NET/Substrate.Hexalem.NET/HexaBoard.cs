using Serilog;
using Substrate.Hexalem.Engine.GameException;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Hexalem.Engine
{
    public class HexaBoard : IHexaBase, ICloneable
    {
        // Implicit operator to convert a HexGrid to a byte[]
        public static implicit operator byte[](HexaBoard hexGrid) => hexGrid.Value;

        // Implicit operator to convert a byte[] to a HexGrid
        public static implicit operator HexaBoard(byte[] bytes) => new HexaBoard(bytes);

        private readonly int _sideLength;
        private readonly int _maxDistanceFromCenter;

        public byte[] Value { get; set; }

        public bool IsFull => Array.TrueForAll(Value, p => p != 0x00);

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
            this[Value.Length / 2] = new HexaTile(TileType.Home, 0 /* Lowest level */, TilePattern.Normal);
        }

        public void NextRound(uint blockNumber)
        {
        }

        public void PostMove(uint blockNumber)
        {
        }

        public object Clone()
        {
            return new HexaBoard((byte[])Value.Clone());
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

            int q = index % _sideLength - _maxDistanceFromCenter;
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
            if (n[0] != null && n[0].Value.tile.TileType == TileType.Empty)
            {
                return null;
            }
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
        public bool CanPlace((int, int) coords)
        {
            return CanPlace(ToIndex(coords));
        }

        /// <summary>
        /// Check if a tile can be placed on the board
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public bool CanPlace(int? index)
        {
            if (index == null)
            {
                return false;
            }

            // Check if the tile is empty
            if (!((HexaTile)Value[index.Value]).IsEmpty())
            {
                Log.Warning("Unable to play on a non empty tile map (index = {tileMapIndex})", index.Value);
                return false;
            }

            // sucks that we can't decide if we use coords or index
            var coords = ToCoords(index.Value);

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
            return Place(ToIndex(coords), tile);
        }

        /// <summary>
        /// Place a tile on the board
        /// </summary>
        /// <param name="index"></param>
        /// <param name="tile"></param>
        /// <returns></returns>
        internal bool Place(int? index, HexaTile tile)
        {
            if (!CanPlace(index))
            {
                return false;
            }

            Value[index.Value] = tile;

            return true;
        }

        /// <summary>
        /// Get the stats of the board
        /// </summary>
        /// <returns></returns>
        public HexaBoardStats Stats()
        {
            var result = new HexaBoardStats();

            for (int i = 0; i < Value.Length; i++)
            {
                HexaTile t = Value[i];

                result[t.TileType] += 1; // total

                // avoid counting none tiles twice
                if (t.TileType != TileType.Empty)
                {
                    result[t.TileType, t.TileLevel] += 1;

                    result[t.TileType, t.TilePattern] += 1;
                }
            }

            return result;
        }

        /// <summary>
        /// Check if two boards are the same
        /// </summary>
        /// <param name="compare"></param>
        /// <returns></returns>
        public bool IsSame(HexaBoard compare)
        {
            return Value.SequenceEqual(compare.Value);
        }
    }
}