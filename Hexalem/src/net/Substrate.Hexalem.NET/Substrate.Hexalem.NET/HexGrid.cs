using System;
using System.Collections.Generic;

namespace Substrate.Hexalem
{
    public enum HexGridSize
    {
        Small = 9,
        Medium = 25,
        Large = 49,
    }

    public class HexGrid
    {
        // Implicit operator to convert a HexGrid to a byte[]
        public static implicit operator byte[](HexGrid hexGrid) => hexGrid.Bytes;

        // Implicit operator to convert a byte[] to a HexGrid
        public static implicit operator HexGrid(byte[] bytes) => new HexGrid(bytes);

        private byte[] Bytes { get; }

        private int _sideLength;
        private int _maxDistanceFromCenter;

        /// <summary>
        /// HexGrid constructor, bytes need to be of size 9, 25 or 49
        /// An odd number power two, to have a middle tile
        /// </summary>
        /// <param name="bytes"></param>
        public HexGrid(byte[] bytes)
        {
            Bytes = bytes;

            _sideLength = (int)Math.Sqrt(bytes.Length);
            _maxDistanceFromCenter = (_sideLength - 1) / 2;
        }

        /// <summary>
        /// Indexer to access the internal array
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public byte this[int index]
        {
            get { return Bytes[index]; }
            set { Bytes[index] = value; }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="q"></param>
        /// <param name="r"></param>
        /// <returns></returns>
        public byte this[int q, int r]
        {
            get => Bytes[ToIndex(q, r)];
            set => Bytes[ToIndex(q, r)] = value;
        }

        /// <summary>
        /// Get the side length of the grid
        /// </summary>
        /// <param name="q"></param>
        /// <param name="r"></param>
        /// <returns></returns>
        /// <exception cref="IndexOutOfRangeException"></exception>
        private int ToIndex(int q, int r)
        {
            // Check if the coordinates are valid before proceeding
            if (!IsValidHex(q, r))
            {
                throw new NotSupportedException("Hex coordinates are out of range");
            }

            // Convert axial coordinates (q, r) to a 1D array index
            // Adapt this formula based on your grid's structure.
            // Assuming a pointy-topped hex grid.
            int index = r * _sideLength + q + (r / 2); // Example for pointy-topped

            return index;
        }

        /// <summary>
        /// Get the neighbors of a hex tile in the grid
        /// </summary>
        public List<(int q, int r)> GetNeighbors(int q, int r)
        {
            var neighbors = new List<(int q, int r)>();
            var directions = new[] { (0, -1), (+1, -1), (+1, 0), (0, +1), (-1, +1), (-1, 0) };

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
            int distance = (Math.Abs(q) + Math.Abs(q + r) + Math.Abs(r)) / 2;
            return distance <= _maxDistanceFromCenter;
        }
    }
}