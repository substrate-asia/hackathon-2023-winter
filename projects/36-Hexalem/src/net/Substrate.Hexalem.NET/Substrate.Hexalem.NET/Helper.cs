using System;

namespace Substrate.Hexalem.Engine
{
    public static class Helper
    {
        public static T[] ExtractSubArray<T>(T[] source, int startIndex, int length)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));

            if (startIndex < 0 || startIndex >= source.Length)
                throw new ArgumentOutOfRangeException(nameof(startIndex), "Start index must be within the bounds of the source array.");

            if (length < 0 || startIndex + length > source.Length)
                throw new ArgumentOutOfRangeException(nameof(length), "Length must be positive and within the bounds of the source array.");

            T[] subArray = new T[length];
            Array.Copy(source, startIndex, subArray, 0, length);
            return subArray;
        }
    }
}