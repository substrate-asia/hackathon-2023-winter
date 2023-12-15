using Substrate.Hexalem.NET.NetApiExt.Generated.Model.frame_system;

namespace Substrate.Integration.Model
{
    public class AccountInfoSharp
    {
        public AccountInfoSharp(AccountInfo accountInfo)
        {
            Nonce = accountInfo.Nonce.Value;
            Consumers = accountInfo.Consumers.Value;
            Providers = accountInfo.Providers.Value;
            Sufficients = accountInfo.Sufficients.Value;
            Data = new AccountDataSharp(accountInfo.Data);
        }

        public uint Nonce { get; }
        public uint Consumers { get; }
        public uint Providers { get; }
        public uint Sufficients { get; }
        public AccountDataSharp Data { get; }
    }
}