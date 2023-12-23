using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_balances.types;
using System.Numerics;

namespace Substrate.Integration.Model
{
    public class AccountDataSharp
    {
        public AccountDataSharp(AccountData accountData)
        {
            Free = accountData.Free.Value;
            Reserved = accountData.Reserved.Value;
            Frozen = accountData.Frozen.Value;
            Flags = new ExtraFlagsSharp(accountData.Flags);
        }

        public BigInteger Free { get; }
        public BigInteger Reserved { get; }
        public BigInteger Frozen { get; }
        public ExtraFlagsSharp Flags { get; }
    }
}