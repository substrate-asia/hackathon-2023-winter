using Serilog;
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
        internal int? ToIndex((int q, int r)? coords)
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
        /// Set the patterns of the hex tiles in the grid
        /// </summary>
        /// <returns></returns>
        /// <exception cref="NotSupportedException"></exception>
        public List<List<(int q, int r)>> SetPatterns()
        {
            for (int i = 0; i < Value.Length; i++)
            {
                HexaTile t = Value[i];
                if (t == null || t.TileRarity != TileRarity.Normal)
                {
                    continue;
                }

                if (t == null)
                {
                    continue;
                }

                var coords = ToCoords(i);
                List<(int, int)?> neighbours = GetNeighbors(coords);
                List<(int, HexaTile)?> n = new List<(int, HexaTile)?>() { (i, t) };
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

                if (n.Count != 6)
                {
                    throw new NotSupportedException("Not the correct amount of neighbours to proccess!");
                }

                (TileRarity, int[])? result = GetPattern(n);

                if (result == null)
                {
                    continue;
                }

                foreach (var index in result.Value.Item2)
                {
                    SetTileLevel(index, result.Value.Item1);
                }
            }

            return null;
        }

        /// <summary>
        /// Get the pattern of a hex tile in the grid
        /// </summary>
        /// <param name="n"></param>
        /// <returns></returns>
        internal (TileRarity rarity, int[] indices)? GetPattern(List<(int indice, HexaTile tile)?> n)
        {
            // delta
            if (n[1] != null && n[2] != null && n[1].Value.tile.Same(n[2].Value.tile) && n[0].Value.tile.Same(n[2].Value.tile))
            {
                return (TileRarity.Rare, new[] { n[0].Value.indice, n[1].Value.indice, n[2].Value.indice });
            }
            else if (n[2] != null && n[3] != null && n[2].Value.tile.Same(n[3].Value.tile) && n[0].Value.tile.Same(n[3].Value.tile))
            {
                return (TileRarity.Rare, new[] { n[0].Value.indice, n[2].Value.indice, n[3].Value.indice });
            }
            else if (n[3] != null && n[4] != null && n[3].Value.tile.Same(n[4].Value.tile) && n[0].Value.tile.Same(n[4].Value.tile))
            {
                return (TileRarity.Rare, new[] { n[0].Value.indice, n[3].Value.indice, n[4].Value.indice });
            }
            else if (n[4] != null && n[5] != null && n[4].Value.tile.Same(n[5].Value.tile) && n[0].Value.tile.Same(n[5].Value.tile))
            {
                return (TileRarity.Rare, new[] { n[0].Value.indice, n[4].Value.indice, n[5].Value.indice });
            }
            else if (n[5] != null && n[6] != null && n[5].Value.tile.Same(n[6].Value.tile) && n[0].Value.tile.Same(n[6].Value.tile))
            {
                return (TileRarity.Rare, new[] { n[0].Value.indice, n[5].Value.indice, n[6].Value.indice });
            }
            else if (n[6] != null && n[1] != null && n[6].Value.tile.Same(n[1].Value.tile) && n[0].Value.tile.Same(n[1].Value.tile))
            {
                return (TileRarity.Rare, new[] { n[0].Value.indice, n[6].Value.indice, n[1].Value.indice });
            }
            else
            // line
            if (n[1] != null && n[4] != null && n[1].Value.tile.Same(n[4].Value.tile) && n[0].Value.tile.Same(n[4].Value.tile))
            {
                return (TileRarity.Epic, new[] { n[0].Value.indice, n[1].Value.indice, n[4].Value.indice });
            }
            else if (n[2] != null && n[5] != null && n[2].Value.tile.Same(n[5].Value.tile) && n[0].Value.tile.Same(n[5].Value.tile))
            {
                return (TileRarity.Epic, new[] { n[0].Value.indice, n[2].Value.indice, n[5].Value.indice });
            }
            else if (n[3] != null && n[6] != null && n[3].Value.tile.Same(n[6].Value.tile) && n[0].Value.tile.Same(n[6].Value.tile))
            {
                return (TileRarity.Epic, new[] { n[0].Value.indice, n[3].Value.indice, n[6].Value.indice });
            }
            else
            // ypsilon
            if (n[1] != null && n[3] != null && n[5] != null && n[1].Value.tile.Same(n[3].Value.tile) && n[1].Value.tile.Same(n[5].Value.tile) && n[0].Value.tile.Same(n[5].Value.tile))
            {
                return (TileRarity.Legendary, new[] { n[0].Value.indice, n[1].Value.indice, n[3].Value.indice, n[5].Value.indice });
            }
            else if (n[2] != null && n[4] != null && n[6] != null && n[2].Value.tile.Same(n[4].Value.tile) && n[2].Value.tile.Same(n[6].Value.tile) && n[0].Value.tile.Same(n[6].Value.tile))
            {
                return (TileRarity.Legendary, new[] { n[0].Value.indice, n[2].Value.indice, n[4].Value.indice, n[6].Value.indice });
            }

            return null;
        }

        /// <summary>
        /// Set the level of a hex tile in the grid
        /// </summary>
        /// <param name="i"></param>
        /// <param name="hexTileLevel"></param>
        private void SetTileLevel(int i, TileRarity hexTileLevel)
        {
            if (Value.Length <= i || Value[i] == 0x00)
            {
                return;
            }
            var hexaTile = ((HexaTile)Value[i]);
            hexaTile.TileRarity = hexTileLevel;

            Value[i] = hexaTile;
        }

        /// <summary>
        /// Check if the hexagon at (q, r) is within the valid bounds of the grid
        /// </summary>
        internal bool IsValidHex(int q, int r)
        {
            return Math.Abs(q) <= _maxDistanceFromCenter && Math.Abs(r) <= _maxDistanceFromCenter;
        }

        /// <summary>
        /// Place a tile on the board
        /// </summary>
        /// <param name="coords"></param>
        /// <param name="chooseTile"></param>
        /// <returns></returns>
        internal bool Place((int, int) coords, HexaTile chooseTile)
        {
           var index = ToIndex(coords);

            if (index == null)
            {
                return false;
            }

            if (Value[index.Value] != 0x00)
            {
                Log.Warning("Try to put a new tile ${tileType} on a non empty tile map (index = ${tileMapIndex}", chooseTile.TileType, index.Value);

                return false;
            }

            Value[index.Value] = chooseTile;
            return true;
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
                if (t.TileRarity != TileRarity.None)
                {
                    result[t.TileType, t.TileRarity] += 1;
                    result[t.TileType, t.TilePattern] += 1;
                }
            }

            return result;
        }
    }
}