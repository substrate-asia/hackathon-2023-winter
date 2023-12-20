//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using Substrate.NetApi.Model.Types.Base;
using System.Collections.Generic;


namespace Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet
{
    
    
    public enum Call
    {
        
        create_game = 0,
        
        play = 1,
        
        upgrade = 2,
        
        finish_turn = 3,
        
        force_finish_turn = 4,
        
        receive_reward = 5,
        
        root_delete_game = 6,
        
        root_set_game = 7,
        
        root_set_hex_board = 8,
    }
    
    /// <summary>
    /// >> 88 - Variant[pallet_hexalem.pallet.Call]
    /// Contains a variant per dispatchable extrinsic that this pallet has.
    /// </summary>
    public sealed class EnumCall : BaseEnumExt<Call, BaseTuple<Substrate.NetApi.Model.Types.Base.BaseVec<Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_core.crypto.AccountId32>, Substrate.NetApi.Model.Types.Primitive.U8>, Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Move, Substrate.NetApi.Model.Types.Primitive.U8, BaseVoid, Substrate.Hexalem.NET.NetApiExt.Generated.Types.Base.Arr32U8, BaseVoid, Substrate.Hexalem.NET.NetApiExt.Generated.Types.Base.Arr32U8, BaseTuple<Substrate.Hexalem.NET.NetApiExt.Generated.Types.Base.Arr32U8, Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Game>, BaseTuple<Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_core.crypto.AccountId32, Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.HexBoard>>
    {
    }
}
