using System.Linq;

namespace Substrate.Hexalem.NET.Extensions
{
    internal static class LoggableExtension
    {
        public static string ToLog<T>(this T[] source)
        {
            return string.Join(", ", source.Select(x => x.ToString()));
        }
    }
}