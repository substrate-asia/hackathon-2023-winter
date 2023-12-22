using Serilog;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_core.crypto;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_runtime.multiaddress;
using Substrate.Hexalem.NET.NetApiExt.Generated.Storage;
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
        public const long DECIMALS = 1000000000000;

        public Account Account { get; set; }

        /// <summary>
        ///
        /// </summary>
        /// <param name="account"></param>
        /// <param name="networkType"></param>
        /// <param name="url"></param>
        public SubstrateNetwork(Account account, NetworkType networkType, string url) : base(url, networkType)
        {
            Account = account;
        }

        #region storage

        /// <summary>
        /// Get the current block number.
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<uint?> GetBlocknumberAsync(CancellationToken token)
        {
            if (!IsConnected)
            {
                Log.Warning("Currently not connected to the network!");
                return null;
            }
            var result = await SubstrateClient.SystemStorage.Number(token);
            if (result == null)
            {
                return null;
            }

            return result.Value;
        }

        /// <summary>
        /// Get owner account informations.
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<AccountInfoSharp> GetAccountAsync(CancellationToken token)
            => await GetAccountAsync(Account, token);

        /// <summary>
        /// Get account informations.
        /// </summary>
        /// <param name="account32"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<AccountInfoSharp> GetAccountAsync(Account key, CancellationToken token)
        {
            if (!IsConnected)
            {
                Log.Warning("Currently not connected to the network!");
                return null;
            }

            if (key == null || key.Value == null)
            {
                Log.Warning("No account reference given as key!");
                return null;
            }

            var result = await SubstrateClient.SystemStorage.Account(key.ToAccountId32(), token);
            if (result == null)
            {
                return null;
            }

            return new AccountInfoSharp(result);
        }

        #endregion storage

        #region storage_all_generic

        /// <summary>
        /// Get all storage as dictionary.
        /// </summary>
        /// <typeparam name="T1"></typeparam>
        /// <typeparam name="T2"></typeparam>
        /// <param name="client"></param>
        /// <param name="module"></param>
        /// <param name="item"></param>
        /// <param name="blockHash"></param>
        /// <param name="subKey"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<Dictionary<T1, T2>> GetAllStorageAsync<T1, T2>(string module, string item, CancellationToken token)
            where T1 : IType, new()
            where T2 : IType, new()
        {
            return await GetAllStorageAsync<T1, T2>(module, item, null, null, token);
        }

        public async Task<Dictionary<T1, T2>> GetAllStorageAsync<T1, T2>(string module, string item, byte[] subKey, CancellationToken token)
            where T1 : IType, new()
            where T2 : IType, new()
        {
            return await GetAllStorageAsync<T1, T2>(module, item, null, subKey, token);
        }

        public async Task<Dictionary<T1, T2>> GetAllStorageAsync<T1, T2>(string module, string item, string blockHash, CancellationToken token)
            where T1 : IType, new()
            where T2 : IType, new()
        {
            return await GetAllStorageAsync<T1, T2>(module, item, blockHash, null, token);
        }

        public async Task<Dictionary<T1, T2>> GetAllStorageAsync<T1, T2>(string module, string item, string blockHash, byte[] subKey, CancellationToken token)
            where T1 : IType, new()
            where T2 : IType, new()
        {
            byte[] nextStorageKey = null;
            List<(byte[], T1, T2)> storageEntries;

            var result = new Dictionary<T1, T2>();

            do
            {
                storageEntries = await GetStoragePagedAsync<T1, T2>(module, item, nextStorageKey, 1000, blockHash, subKey, token);

                foreach (var storageEntry in storageEntries)
                {
                    result.Add(storageEntry.Item2, storageEntry.Item3);

                    nextStorageKey = storageEntry.Item1;
                }
            } while (storageEntries.Any());

            Log.Debug("{0}.{1} storage {2} records parsed.", module, item, result.Count);

            return result;
        }

        /// <summary>
        /// Get all storage
        /// </summary>
        /// <typeparam name="T1"></typeparam>
        /// <typeparam name="T2"></typeparam>
        /// <param name="client"></param>
        /// <param name="module"></param>
        /// <param name="item"></param>
        /// <param name="startKey"></param>
        /// <param name="page"></param>
        /// <param name="blockHash"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        /// <exception cref="NotSupportedException"></exception>
        public async Task<List<(byte[], T1, T2)>> GetStoragePagedAsync<T1, T2>(string module, string item, byte[] startKey, uint page, string blockHash, CancellationToken token)
            where T1 : IType, new()
            where T2 : IType, new()
        {
            return await GetStoragePagedAsync<T1, T2>(module, item, startKey, page, blockHash, null, token);
        }

        public async Task<List<(byte[], T1, T2)>> GetStoragePagedAsync<T1, T2>(string module, string item, byte[] startKey, uint page, string blockHash, byte[] subKey, CancellationToken token)
            where T1 : IType, new()
            where T2 : IType, new()
        {
            if (!IsConnected)
            {
                return null;
            }

            if (page < 2 || page > 1000)
            {
                throw new NotSupportedException("Page size must be in the range of 2 - 1000");
            }

            var result = new List<(byte[], T1, T2)>();
            var keyBytes = RequestGenerator.GetStorageKeyBytesHash(module, item);

            var extKeyBytes = (byte[])keyBytes.Clone();  // Clone the original array to keep it intact
            if (subKey != null)
            {
                int oldLength = extKeyBytes.Length;
                Array.Resize(ref extKeyBytes, oldLength + subKey.Length);
                Array.Copy(subKey, 0, extKeyBytes, oldLength, subKey.Length);
            }

            var storageKeys = await SubstrateClient.State.GetKeysPagedAsync(extKeyBytes, page, startKey, token);
            if (storageKeys == null || !storageKeys.Any())
            {
                return result;
            }

            var keySize = Utils.Bytes2HexString(keyBytes).Length;

            var storageChangeSets = await SubstrateClient.State.GetQueryStorageAtAsync(storageKeys.Select(p => Utils.HexToByteArray(p.ToString())).ToList(), blockHash, token);
            if (storageChangeSets != null)
            {
                foreach (var storageChangeSet in storageChangeSets.First().Changes)
                {
                    var storageKeyString = storageChangeSet[0];

                    var keyParam = new T1();
                    //keyParam.Create(storageKeyString[keySize..]);
                    keyParam.Create(storageKeyString.Substring(keySize));

                    var valueParam = new T2();
                    valueParam.Create(storageChangeSet[1]);

                    result.Add((Utils.HexToByteArray(storageKeyString), keyParam, valueParam));
                }
            }

            return result;
        }

        /// <summary>
        /// Get all storage keys as list.
        /// </summary>
        /// <typeparam name="T1"></typeparam>
        /// <typeparam name="T2"></typeparam>
        /// <param name="module"></param>
        /// <param name="item"></param>
        /// <param name="blockHash"></param>
        /// <param name="subKey"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<List<byte[]>> GetAllStorageKeysAsync(string module, string item, string blockHash, byte[] subKey, CancellationToken token)
        {
            var result = new List<byte[]>();

            byte[] nextStorageKey = null;
            List<byte[]> storageEntries;
            do
            {
                storageEntries = await GetStorageKeysPagedAsync(module, item, nextStorageKey, 1000, blockHash, subKey, token);

                if (storageEntries != null && storageEntries.Any())
                {
                    result.AddRange(storageEntries);
                    //nextStorageKey = storageEntries[^1];
                    nextStorageKey = storageEntries[storageEntries.Count - 1];
                }
            }
            while (storageEntries != null && storageEntries.Any());

            Log.Debug("{0}.{1} storage key {2} records parsed.", module, item, result.Count);

            return result;
        }

        /// <summary>
        /// Get all storage keys paged as list.
        /// </summary>
        /// <param name="module"></param>
        /// <param name="item"></param>
        /// <param name="startKey"></param>
        /// <param name="page"></param>
        /// <param name="blockHash"></param>
        /// <param name="subKey"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        /// <exception cref="NotSupportedException"></exception>
        public async Task<List<byte[]>> GetStorageKeysPagedAsync(string module, string item, byte[] startKey, uint page, string blockHash, byte[] subKey, CancellationToken token)
        {
            if (!IsConnected)
            {
                return null;
            }

            if (page < 2 || page > 1000)
            {
                throw new NotSupportedException("Page size must be in the range of 2 - 1000");
            }

            var result = new List<byte[]>();
            var keyBytes = RequestGenerator.GetStorageKeyBytesHash(module, item);

            var extKeyBytes = (byte[])keyBytes.Clone();  // Clone the original array to keep it intact
            if (subKey != null)
            {
                int oldLength = extKeyBytes.Length;
                Array.Resize(ref extKeyBytes, oldLength + subKey.Length);
                Array.Copy(subKey, 0, extKeyBytes, oldLength, subKey.Length);
            }

            var storageKeys = await SubstrateClient.State.GetKeysPagedAsync(extKeyBytes, page, startKey, token);
            if (storageKeys == null || !storageKeys.Any())
            {
                return result;
            }

            return storageKeys.Select(p => Utils.HexToByteArray(p.ToString())).ToList();
        }

        /// <summary>
        /// Get all storage by keys.
        /// </summary>
        /// <typeparam name="T1"></typeparam>
        /// <param name="module"></param>
        /// <param name="item"></param>
        /// <param name="keys"></param>
        /// <param name="blockHash"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        /// <exception cref="NotSupportedException"></exception>
        public async Task<List<(string, T1)>> GetStorageByKeysAsync<T1>(string module, string item, List<string> keys, string blockHash, CancellationToken token)
            where T1 : IType, new()
        {
            if (!IsConnected)
            {
                return null;
            }

            if (keys.Count > 1000)
            {
                throw new NotSupportedException("Max keys to query is 1000");
            }

            var keyBytesHex = Utils.Bytes2HexString(RequestGenerator.GetStorageKeyBytesHash(module, item));
            var keySize = keyBytesHex.Length;
            var result = new List<(string, T1)>();

            var storageChangeSets = await SubstrateClient.State.GetQueryStorageAtAsync(keys.Select(p => Utils.HexToByteArray(keyBytesHex + p.ToString())).ToList(), blockHash, token);
            if (storageChangeSets != null)
            {
                foreach (var storageChangeSet in storageChangeSets.First().Changes)
                {
                    var storageKeyString = storageChangeSet[0];
                    var valueParam = new T1();
                    if (storageChangeSet[1] != null)
                    {
                        valueParam.Create(storageChangeSet[1]);
                    }
                    //result.Add((storageKeyString[keySize..], valueParam));
                    result.Add((storageKeyString.Substring(keySize), valueParam));
                }
            }

            return result;
        }

        #endregion storage_all_generic

        #region extrinsics

        /// <summary>
        /// Remark
        /// </summary>
        /// <param name="remark"></param>
        /// <param name="concurrentTasks"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string> RemarksAsync(BaseVec<U8> remark, int concurrentTasks, CancellationToken token)
        {
            var extrinsicType = "SystemCalls.Remark";

            if (!IsConnected || Account == null)
            {
                return null;
            }

            var extrinsic = SystemCalls.Remark(remark);

            return await GenericExtrinsicAsync(Account, extrinsicType, extrinsic, concurrentTasks, token);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="dest"></param>
        /// <param name="value"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string> TransferKeepAliveAsync(AccountId32 dest, BigInteger value, int concurrentTasks, CancellationToken token)
        {
            var extrinsicType = "BalancesCalls.TransferKeepAlive";

            if (!IsConnected || Account == null)
            {
                return null;
            }

            var multiAddress = new EnumMultiAddress();
            multiAddress.Create(MultiAddress.Id, dest);

            var balance = new BaseCom<U128>();
            balance.Create(value);

            var extrinsic = BalancesCalls.TransferKeepAlive(multiAddress, balance);

            return await GenericExtrinsicAsync(Account, extrinsicType, extrinsic, concurrentTasks, token);
        }

        /// <summary>
        /// Batch all extrinsics in one transaction.
        /// </summary>
        /// <param name="to"></param>
        /// <param name="amount"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string> BatchAllAsync(List<EnumRuntimeCall> callList, int concurrentTasks, CancellationToken token)
        {
            var extrinsicType = "UtilityCalls.BatchAll";

            if (!IsConnected || Account == null || callList == null || callList.Count == 0)
            {
                return null;
            }

            var calls = new BaseVec<EnumRuntimeCall>();
            calls.Create(callList.ToArray());

            var extrinsic = UtilityCalls.BatchAll(calls);

            return await GenericExtrinsicAsync(Account, extrinsicType, extrinsic, concurrentTasks, token);
        }

        /// <summary>
        /// Submit a sudo extrinsic.
        /// </summary>
        /// <param name="call"></param>
        /// <param name="concurrentTasks"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string> SudoAsync(Account sudoAccount, EnumRuntimeCall call, int concurrentTasks, CancellationToken token)
        {
            var extrinsicType = "Sudo.Sudo";

            if (!IsConnected || sudoAccount == null || call == null)
            {
                return null;
            }

            var extrinsic = SudoCalls.Sudo(call);

            return await GenericExtrinsicAsync(sudoAccount, extrinsicType, extrinsic, concurrentTasks, token);
        }

        #endregion extrinsics
    }
}