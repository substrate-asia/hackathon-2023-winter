using Schnorrkel.Keys;
using Serilog;
using StreamJsonRpc;
using Substrate.Hexalem.NET.NetApiExt.Generated;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.frame_system;
using Substrate.Hexalem.NET.NetApiExt.Generated.Storage;
using Substrate.Integration.Helper;
using Substrate.NetApi;
using Substrate.NetApi.Model.Extrinsics;
using Substrate.NetApi.Model.Rpc;
using Substrate.NetApi.Model.Types;
using Substrate.NetApi.Model.Types.Base;
using Substrate.NetApi.Model.Types.Primitive;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Substrate.Integration.Client
{
    public class BaseClient
    {
        private readonly int _maxConcurrentCalls;

        private readonly ChargeType _chargeTypeDefault;

        public static MiniSecret MiniSecretAlice => new MiniSecret(Utils.HexToByteArray("0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a"), ExpandMode.Ed25519);
        public static Account Alice => Account.Build(KeyType.Sr25519, MiniSecretAlice.ExpandToSecret().ToBytes(), MiniSecretAlice.GetPair().Public.Key);

        public ExtrinsicManager ExtrinsicManager { get; }

        public SubscriptionManager SubscriptionManager { get; }

        public SubstrateClientExt SubstrateClient { get; }

        public bool IsConnected => SubstrateClient.IsConnected;

        public NetworkType NetworkType { get; set; }

        public BaseClient(string url, NetworkType networkType, int maxConcurrentCalls = 10)
        {
            if (networkType == NetworkType.Host || networkType == NetworkType.Test)
            {
                _chargeTypeDefault = ChargeAssetTxPayment.Default();
            }
            else
            {
                _chargeTypeDefault = ChargeTransactionPayment.Default();
            }

            _maxConcurrentCalls = maxConcurrentCalls;

            SubstrateClient = new SubstrateClientExt(new Uri(url), _chargeTypeDefault);

            ExtrinsicManager = new ExtrinsicManager(SubstrateClient);

            SubscriptionManager = new SubscriptionManager();
        }

        /// <summary>
        /// Connect to the network
        /// </summary>
        /// <param name="useMetadata"></param>
        /// <param name="standardSubstrate"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<bool> ConnectAsync(bool useMetadata, bool standardSubstrate, CancellationToken token)
        {
            if (!IsConnected)
            {
                try
                {
                    await SubstrateClient.ConnectAsync(useMetadata, standardSubstrate, token);
                }
                catch (Exception e)
                {
                    Log.Error("BaseClient.ConnectAsync: {0}",
                        e.ToString());
                }
            }

            return IsConnected;
        }

        public async Task<bool> DisconnectAsync()
        {
            if (!IsConnected)
            {
                return false;
            }

            await SubstrateClient.CloseAsync();
            return true;
        }

        public bool CanExtrinsic(string extrinsicType, int concurrentTasks)
            => IsConnected && !HasMaxConcurentTaskRunning() && !HasToManyConcurentTaskRunning(extrinsicType, concurrentTasks);

        public bool HasMaxConcurentTaskRunning()
            => ExtrinsicManager.Running.Count() >= _maxConcurrentCalls;

        public bool HasToManyConcurentTaskRunning(string extrinsicType, int concurrentTasks)
            => ExtrinsicManager.Running.Count(p => p.ExtrinsicType == extrinsicType) >= concurrentTasks;

        /// <summary>
        /// Generic extrinsic sender
        /// </summary>
        /// <param name="extrinsicType"></param>
        /// <param name="extrinsicMethod"></param>
        /// <param name="concurrentTasks"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        internal async Task<string> GenericExtrinsicAsync(Account account, string extrinsicType, Method extrinsicMethod, int concurrentTasks, CancellationToken token)
        {
            if (account == null)
            {
                Log.Warning("Account is null!");
                return null;
            }

            if (!IsConnected)
            {
                Log.Warning("Currently not connected to the network!");
                return null;
            }

            if (HasMaxConcurentTaskRunning())
            {
                Log.Warning("There can not be more then {0} concurrent tasks overall!", _maxConcurrentCalls);
                return null;
            }

            if (HasToManyConcurentTaskRunning(extrinsicType, concurrentTasks))
            {
                Log.Warning("There can not be more then {0} concurrent tasks of {1}!", concurrentTasks, extrinsicType);
                return null;
            }

            string subscription = null;
            try
            {
                subscription = await SubstrateClient.Unstable.TransactionUnstableSubmitAndWatchAsync(ActionExtrinsicUpdate, extrinsicMethod, account, _chargeTypeDefault, 64, token);
            }
            catch (RemoteInvocationException e)
            {
                Log.Error("RemoteInvocationException: {0}", e.Message);
                return subscription;
            }

            if (subscription == null)
            {
                return null;
            }

            Log.Debug("Generic extrinsic sent {0} with {1}.", extrinsicMethod.ModuleName + "_" + extrinsicMethod.CallName, subscription);

            ExtrinsicManager.Add(subscription, extrinsicType);

            return subscription;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="subscriptionId"></param>
        /// <param name="extrinsicUpdate"></param>
        public async void ActionExtrinsicUpdate(string subscriptionId, TransactionEventInfo extrinsicUpdate)
        {
            ExtrinsicManager.UpdateExtrinsicInfo(subscriptionId, extrinsicUpdate);

            var queueInfo = ExtrinsicManager.Get(subscriptionId);

            // proccessing events scrapping
            if (queueInfo != null && !queueInfo.HasEvents && extrinsicUpdate.Hash != null && extrinsicUpdate.Index != null)
            {
                string parameters = SystemStorage.EventsParams();
                var events = await SubstrateClient.GetStorageAsync<BaseVec<EventRecord>>(parameters, extrinsicUpdate.Hash.Value, CancellationToken.None);
                if (events == null)
                {
                    ExtrinsicManager.UpdateExtrinsicError(subscriptionId, "No block events");
                    return;
                }
                var allExtrinsicEvents = events.Value.Where(p => p.Phase.Value == Phase.ApplyExtrinsic && ((U32)p.Phase.Value2).Value == extrinsicUpdate.Index);
                if (!allExtrinsicEvents.Any())
                {
                    ExtrinsicManager.UpdateExtrinsicError(subscriptionId, "No extrinsic events");
                    return;
                }
                ExtrinsicManager.UpdateExtrinsicEvents(subscriptionId, allExtrinsicEvents);
            }
        }

        /// <summary>
        /// Subscribe to event storage
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<string> SubscribeEventsAsync(CancellationToken token)
        {
            if (!IsConnected)
            {
                Log.Warning("Currently not connected to the network!");
                return null;
            }

            if (SubscriptionManager.IsSubscribed)
            {
                Log.Warning("Already active subscription to events!");
                return null;
            }

            var subscription = await SubstrateClient.SubscribeStorageKeyAsync(SystemStorage.EventsParams(), SubscriptionManager.ActionSubscrptionEvent, token);
            if (subscription == null)
            {
                return null;
            }

            SubscriptionManager.IsSubscribed = true;

            Log.Debug("SystemStorage.Events subscription id {0] registred.", subscription);

            return subscription;
        }

        public static Account RandomAccount(int seed, string derivationPsw = "aA1234dd", KeyType keyType = KeyType.Sr25519)
        {
            var random = new Random(seed);
            var randomBytes = new byte[16];
            random.NextBytes(randomBytes);
            var mnemonic = string.Join(" ", Mnemonic.MnemonicFromEntropy(randomBytes, Mnemonic.BIP39Wordlist.English));
            Log.Information("mnemonic[Sr25519]: {0}", mnemonic);
            return Mnemonic.GetAccountFromMnemonic(mnemonic, derivationPsw, keyType);
        }
    }
}