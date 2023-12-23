using Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_core.crypto;
using Substrate.Hexalem.NET.NetApiExt.Generated.Types.Base;
using Substrate.NetApi.Model.Types.Base;
using Substrate.NetApi.Model.Types.Primitive;
using System.Linq;
using System.Numerics;

namespace Substrate.Integration.Call
{
    /// <summary>
    /// Pallet Hexalem
    /// </summary>
    public static class PalletHexalem
    {
        /// <summary>
        /// Create game
        /// </summary>
        /// <param name="players"></param>
        /// <param name="gridSize"></param>
        /// <returns></returns>
        public static EnumRuntimeCall HexalemCreateGame(AccountId32[] players, byte gridSize)
        {
            var enumPalletCall = new EnumCall();
            enumPalletCall.Create(
                Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Call.create_game,
                new BaseTuple<BaseVec<AccountId32>, U8>(new BaseVec<AccountId32>(players), new U8(gridSize)));

            var enumCall = new EnumRuntimeCall();
            enumCall.Create(RuntimeCall.HexalemModule, enumPalletCall);

            return enumCall;
        }

        /// <summary>
        /// Play
        /// </summary>
        /// <param name="placeIndex"></param>
        /// <param name="buyIndex"></param>
        /// <param name="payType"></param>
        /// <param name="amount"></param>
        /// <returns></returns>
        public static EnumRuntimeCall HexalemPlay(byte placeIndex, byte buyIndex, BigInteger amount)
        {
            var moveStruct = new Move
            {
                PlaceIndex = new U8(placeIndex),
                BuyIndex = new U8(buyIndex),
            };
            var enumPalletCall = new EnumCall();
            enumPalletCall.Create(Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Call.play, moveStruct);

            var enumCall = new EnumRuntimeCall();
            enumCall.Create(RuntimeCall.HexalemModule, enumPalletCall);

            return enumCall;
        }

        /// <summary>
        /// Finish turn
        /// </summary>
        /// <returns></returns>
        public static EnumRuntimeCall HexalemFinishTurn()
        {
            var enumPalletCall = new EnumCall();
            enumPalletCall.Create(Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Call.finish_turn, new BaseVoid());

            var enumCall = new EnumRuntimeCall();
            enumCall.Create(RuntimeCall.HexalemModule, enumPalletCall);

            return enumCall;
        }

        /// <summary>
        /// Root delete game
        /// </summary>
        /// <returns></returns>
        public static EnumRuntimeCall HexalemRootDeleteGame(byte[] gameIdBytes)
        {
            Arr32U8 gameId = new Arr32U8();
            gameId.Create(gameIdBytes.Select(p => new U8(p)).ToArray());

            var enumPalletCall = new EnumCall();
            enumPalletCall.Create(Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Call.root_delete_game, gameId);

            var enumCall = new EnumRuntimeCall();
            enumCall.Create(RuntimeCall.HexalemModule, enumPalletCall);

            return enumCall;
        }
    }
}