using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Hexalem
{
    public class HexaSelection
    {
        public static implicit operator byte[](HexaSelection p) => p.Value;

        public static implicit operator HexaSelection(byte[] p) => new HexaSelection(p);

        public byte[] Value { get; set; }

        public HexaSelection(byte[] hash)
        {
            Value = hash.Select(p => Validate(p)).ToArray();
        }

        public void Shuffle(uint blockNumber)
        {
            var values = Enum.GetValues(typeof(ShuffleType));

            var shuffleType = (ShuffleType)values.GetValue(blockNumber % values.Length);

            Log.Information($"Shuffle called, shuffle type is {shuffleType}");

            Value = ShuffleArray(Value, shuffleType);
        }

        public List<HexaTile> Selection(int selection)
        {
            return Value.Take(selection).Select(p => (HexaTile)p).ToList();
        }

        /// <summary>
        /// Only allow possibile selections, which is currently restricted to normal tiles,
        /// and exclude the first two values, which are none and home.
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        private byte Validate(byte p)
        {
            var values = Enum.GetValues(typeof(TileType)).Cast<TileType>()
                .Where(v => (int)v > 1).ToArray();
            return (byte)(((byte)Rarity.Normal << 4) | (byte)(int)values.GetValue((byte)(p & 0x0F) % values.Length));
        }

        public static T[] ShuffleArray<T>(T[] array, ShuffleType shuffleType)
        {
            switch (shuffleType)
            {
                case ShuffleType.SplitHalfAndMove:
                    var firstPartSplit = array.Take(array.Length / 2);
                    var secondPartSplit = array.Skip(array.Length / 2).Take(array.Length - array.Length / 2);

                    Array.Copy(firstPartSplit.Concat(secondPartSplit).ToArray(), array, array.Length);
                    break;

                case ShuffleType.ReverseFirstHalf:
                    var firstPartReverse = array.Take(array.Length / 2).Reverse();
                    var secondPartReverse = array.Skip(array.Length / 2).Take(array.Length - array.Length / 2);

                    Array.Copy(firstPartReverse.Concat(secondPartReverse).ToArray(), array, array.Length);
                    break;

                case ShuffleType.ReverseSecondHalf:
                    var firstPartReverse2 = array.Take(array.Length / 2).Reverse();
                    var secondPartReverse2 = array.Skip(array.Length / 2).Take(array.Length - array.Length / 2);

                    Array.Copy(firstPartReverse2.Concat(secondPartReverse2).ToArray(), array, array.Length);
                    break;

                case ShuffleType.Rotate:
                    {
                        int rotateBy = array.Length / 4; // Example rotation amount
                        T[] tempArray = new T[array.Length];
                        for (int i = 0; i < array.Length; i++)
                        {
                            tempArray[(i + rotateBy) % array.Length] = array[i];
                        }
                        Array.Copy(tempArray, array, array.Length);
                    }
                    break;

                case ShuffleType.RandomShuffle:
                    {
                        Random random = new Random();
                        for (int i = array.Length - 1; i > 0; i--)
                        {
                            int j = random.Next(i + 1);
                            T temp = array[i];
                            array[i] = array[j];
                            array[j] = temp;
                        }
                    }
                    break;

                case ShuffleType.SwapInPairs:
                    {
                        for (int i = 0; i < array.Length - 1; i += 2)
                        {
                            T temp = array[i];
                            array[i] = array[i + 1];
                            array[i + 1] = temp;
                        }
                    }
                    break;

                default:
                    break;
            }

            return array;
        }
    }
}