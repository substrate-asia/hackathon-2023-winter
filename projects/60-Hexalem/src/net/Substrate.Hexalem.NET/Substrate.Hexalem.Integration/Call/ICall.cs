using Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime;

namespace Substrate.Integration.Call
{
    public interface ICall
    {
        EnumRuntimeCall ToCall();
    }
}