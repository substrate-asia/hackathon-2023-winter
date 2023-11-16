using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Substrate.Hexalem.NET.Extension
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<IEnumerable<T>> Combinations<T>(this IEnumerable<T> elems, int k)
        {
            return k == 0 ? new[] { new T[0] } :
                elems.SelectMany((e, i) =>
                    elems.Skip(i + 1).Combinations(k - 1).Select(c => (new[] { e }).Concat(c)));
        }
    }
}
