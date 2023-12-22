using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_balances.types;
using System.Numerics;

namespace Substrate.Integration.Model
{
    public class ExtraFlagsSharp
    {
        public ExtraFlagsSharp(ExtraFlags extraFlags)
        {
            Value = extraFlags.Value.Value;
        }

        public BigInteger Value { get; }
    }
}