using System;
using System.Linq;

namespace Substrate.Hexalem
{
    public class Helper
    {
        public static T[] ExtractSubArray<T>(T[] source, int startIndex, int length)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));

            if (startIndex < 0 || startIndex >= source.Length)
                throw new ArgumentOutOfRangeException(nameof(startIndex), "Start index must be within the bounds of the source array.");

            if (length < 0 || (startIndex + length) > source.Length)
                throw new ArgumentOutOfRangeException(nameof(length), "Length must be positive and within the bounds of the source array.");

            T[] subArray = new T[length];
            Array.Copy(source, startIndex, subArray, 0, length);
            return subArray;
        }

        public enum ShuffleType
        {
            SplitHalfAndMove = 0,
            ReverseFirstHalf = 1,
            ReverseSecondHalf = 2,
            Rotate = 3,
            RandomShuffle = 4,
            SwapInPairs = 5
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