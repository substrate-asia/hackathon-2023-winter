using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Hexalem
{
    public enum HexGridSize
    {
        /// <summary>
        /// 3x3 tiles
        /// </summary>
        Small = 9,

        /// <summary>
        /// 5x5 tiles
        /// </summary>
        Medium = 25,

        /// <summary>
        /// 7x7 tiles
        /// </summary>
        Large = 49,
    }

    public abstract class HexGrid<T>
    {
        protected HexGrid(T[] tiles)
        {
            Tiles = tiles;

            _hexagoneSize = (int)Math.Sqrt(Tiles.Length);
            _maxDistanceFromCenter = (_hexagoneSize - 1) / 2;
        }

        public T[] Tiles { get; internal set; }
        protected int _hexagoneSize { get; set; }
        protected int _maxDistanceFromCenter { get; set; }

        /// <summary>
        /// Indexer to access the internal array
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public T this[int index]
        {
            get { return Tiles[index]; }
            set { Tiles[index] = value; }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="q"></param>
        /// <param name="r"></param>
        /// <returns></returns>
        public T this[int q, int r]
        {
            get => Tiles[ToIndex(q, r)];
            set => Tiles[ToIndex(q, r)] = value;
        }

        /// <summary>
        /// Get the side length of the grid
        /// </summary>
        /// <param name="q"></param>
        /// <param name="r"></param>
        /// <returns></returns>
        /// <exception cref="IndexOutOfRangeException"></exception>
        public int ToIndex(int q, int r)
        {
            // Check if the coordinates are valid before proceeding
            if (!IsValidHex(q, r))
            {
                throw new NotSupportedException("Hex coordinates are out of range");
            }

            int index = q + _maxDistanceFromCenter + (r + _maxDistanceFromCenter) * _hexagoneSize;
            return index;
        }

        /// <summary>
        /// Return a tile from hex coordinate
        /// </summary>
        /// <param name="q"></param>
        /// <param name="r"></param>
        /// <returns></returns>
        public T ToTile(int q, int r) => Tiles[ToIndex(q, r)];

        /// <summary>
        /// Return axial coordinate from index
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        /// <exception cref="NotSupportedException"></exception>
        public (int q, int r) ToAxialCoordinates(int index)
        {
            int q = (index % _hexagoneSize) - _maxDistanceFromCenter;
            int r = index / _hexagoneSize - (_hexagoneSize - 1) / 2;

            // Check if the calculated coordinates are valid before returning
            if (!IsValidHex(q, r))
            {
                throw new NotSupportedException("Index is out of range for hexagonal grid");
            }

            return (q, r);
        }

        /// <summary>
        /// Get the neighbors of a hex tile in the grid
        /// </summary>
        public List<(int q, int r)> GetNeighbors(int index)
        {
            var coordinate = ToAxialCoordinates(index);
            return GetNeighbors(coordinate.q, coordinate.r);
        }

        public List<(int q, int r)> GetNeighbors(int q, int r)
        {
            var neighbors = new List<(int q, int r)>();
            var directions = new[] { (1, 1), (1, 0), (0, -1), (-1, -1), (-1, 0), (0, 1) };

            foreach (var direction in directions)
            {
                int neighbor_q = q + direction.Item1;
                int neighbor_r = r + direction.Item2;

                if (IsValidHex(neighbor_q, neighbor_r))
                {
                    neighbors.Add((neighbor_q, neighbor_r));
                }
            }

            return neighbors;
        }

        /// <summary>
        /// Check if the hexagon at (q, r) is within the valid bounds of the grid
        /// </summary>
        internal bool IsValidHex(int q, int r)
        {
            return Math.Abs(q) <= _hexagoneSize / 2 && Math.Abs(r) <= _hexagoneSize / 2;
        }
    }
    public class HexGrid : HexGrid<HexTile>
    {
        // Implicit operator to convert a HexGrid to a byte[]
        public static implicit operator byte[](HexGrid hexGrid) => hexGrid.Value;

        // Implicit operator to convert a byte[] to a HexGrid
        public static implicit operator HexGrid(byte[] bytes) => new HexGrid(bytes);

        private byte[] Value
        {
            get
            {
                return Tiles.Select(x => x.Value).ToArray();
            }
        }

        /// <summary>
        /// HexGrid constructor, bytes need to be of size 9, 25 or 49
        /// An odd number power two, to have a middle tile
        /// </summary>
        /// <param name="value"></param>
        public HexGrid(byte[] value) : base(new HexTile[value.Length])
        {
            for (int i = 0; i < value.Length; i++)
            {
                Tiles[i] = new HexTile(value[i]);
            }
        }
    }
}