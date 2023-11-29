using Newtonsoft.Json.Linq;
using Serilog;
using StrobeNet.Extensions;
using Substrate.Hexalem.Integration.Model;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_core.crypto;
using Substrate.Hexalem.NET.NetApiExt.Generated.Storage;
using Substrate.Integration.Call;
using Substrate.Integration.Client;
using Substrate.Integration.Helper;
using Substrate.Integration.Model;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;
using Substrate.NetApi.Model.Types.Base;
using Substrate.NetApi.Model.Types.Primitive;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;

namespace Substrate.Integration
{
    public partial class SubstrateNetwork : BaseClient
    {


        #region storage

        /// <summary>
        /// Get game
        /// </summary>
        /// <param name="gameId"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<GameSharp?> GetGameAsync(byte[] gameId, CancellationToken token)
        {
            if (!IsConnected)
            {
                Log.Warning("Currently not connected to the network!");
                return null;
            }

            var key = new Hexalem.NET.NetApiExt.Generated.Types.Base.Arr32U8();
            key.Create(gameId);

            var result = await SubstrateClient.HexalemModuleStorage.GameStorage(key, token);
            if (result == null)
            {
                return null;
            }

            return new GameSharp(result);
        }

        #endregion storage

        #region call

        /// <summary>
        /// Create game
        /// </summary>
        /// <param name="account"></param>
        /// <param name="players"></param>
        /// <param name="gridSize"></param>
        /// <param name="concurrentTasks"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string?> CreateGameAsync(Account account, List<Account> players, byte gridSize, int concurrentTasks, CancellationToken token)
        {
            var extrinsicType = $"Hexalem.CreateGame";

            var extrinsic = HexalemModuleCalls.CreateGame(new BaseVec<AccountId32>(players.Select(p => p.ToAccountId32()).ToArray()), new U8(gridSize));

            return await GenericExtrinsicAsync(account, extrinsicType, extrinsic, concurrentTasks, token);
        }

        /// <summary>
        /// Play
        /// </summary>
        /// <param name="account"></param>
        /// <param name="placeIndex"></param>
        /// <param name="buyIndex"></param>
        /// <param name="payType"></param>
        /// <param name="concurrentTasks"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string?> PlayAsync(Account account, byte placeIndex, byte buyIndex, PayType payType, int concurrentTasks, CancellationToken token)
        {
            var extrinsicType = $"Hexalem.Play";

            var enumPayType = new EnumPayType();
            enumPayType.Create(payType);

            var moveStruct = new Move
            {
                PlaceIndex = new U8(placeIndex),
                BuyIndex = new U8(buyIndex),
                PayType = enumPayType
            };

            var extrinsic = HexalemModuleCalls.Play(moveStruct);

            return await GenericExtrinsicAsync(account, extrinsicType, extrinsic, concurrentTasks, token);
        }

        /// <summary>
        /// Finish turn
        /// </summary>
        /// <param name="account"></param>
        /// <param name="concurrentTasks"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string?> FinishTurnAsync(Account account, int concurrentTasks, CancellationToken token)
        {
            var extrinsicType = $"Hexalem.FinishTurn";

            var extrinsic = HexalemModuleCalls.FinishTurn();

            return await GenericExtrinsicAsync(account, extrinsicType, extrinsic, concurrentTasks, token);
        }

        #endregion call
    }
}