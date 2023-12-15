using Schnorrkel.Keys;
using Substrate.Integration;
using Substrate.Integration.Helper;
using Substrate.NET.Wallet;
using Substrate.NetApi;
using Substrate.NetApi.Model.Rpc;
using Substrate.NetApi.Model.Types;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using UnityEngine;

namespace Assets.Scripts
{
    public enum AccountType
    {
        Alice,
        Bob,
        Charlie,
        Dave
    }

    public delegate void ExtrinsicStateUpdate(string subscriptionId, ExtrinsicStatus extrinsicUpdate);

    public class NetworkManager : Singleton<NetworkManager>
    {
        public delegate void ConnectionStateChangedHandler(bool IsConnected);

        public delegate void ExtrinsicCheckHandler();

        public event ConnectionStateChangedHandler ConnectionStateChanged;

        public event ExtrinsicCheckHandler ExtrinsicCheck;

        public MiniSecret MiniSecretAlice => new MiniSecret(Utils.HexToByteArray("0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a"), ExpandMode.Ed25519);
        public Account Alice => Account.Build(KeyType.Sr25519, MiniSecretAlice.ExpandToSecret().ToBytes(), MiniSecretAlice.GetPair().Public.Key);

        public MiniSecret MiniSecretBob => new MiniSecret(Utils.HexToByteArray("0x398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89"), ExpandMode.Ed25519);
        public Account Bob => Account.Build(KeyType.Sr25519, MiniSecretBob.ExpandToSecret().ToBytes(), MiniSecretBob.GetPair().Public.Key);

        public MiniSecret MiniSecretCharlie => new MiniSecret(Utils.HexToByteArray("0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938"), ExpandMode.Ed25519);
        public Account Charlie => Account.Build(KeyType.Sr25519, MiniSecretCharlie.ExpandToSecret().ToBytes(), MiniSecretCharlie.GetPair().Public.Key);

        public MiniSecret MiniSecretDave => new MiniSecret(Utils.HexToByteArray("0x868020ae0687dda7d57565093a69090211449845a7e11453612800b663307246"), ExpandMode.Ed25519);
        public Account Dave => Account.Build(KeyType.Sr25519, MiniSecretDave.ExpandToSecret().ToBytes(), MiniSecretDave.GetPair().Public.Key);

        // Sudo account if needed
        public Account Sudo => Alice;

        private readonly string _nodeUrl = "ws://127.0.0.1:9944";
        public string NodeUrl => _nodeUrl;

        private readonly NetworkType _networkType = NetworkType.Live;

        public AccountType? CurrentAccountType { get; private set; }

        private SubstrateNetwork _client;
        public SubstrateNetwork Client => _client;

        private bool? _lastConnectionState = null;

        protected override void Awake()
        {
            base.Awake();
            //Your code goes here
        }

        public void Start()
        {
            InvokeRepeating(nameof(UpdateNetworkState), 0.0f, 2.0f);
            InvokeRepeating(nameof(UpdatedExtrinsic), 0.0f, 3.0f);
        }

        private void OnDestroy()
        {
            CancelInvoke(nameof(UpdateNetworkState));
            CancelInvoke(nameof(UpdatedExtrinsic));
        }

        private void UpdateNetworkState()
        {
            if (_client == null)
            {
                return;
            }

            var connectionState = _client.IsConnected;
            if (_lastConnectionState == null || _lastConnectionState != connectionState)
            {
                ConnectionStateChanged?.Invoke(connectionState);
                _lastConnectionState = connectionState;
            }
        }

        private void UpdatedExtrinsic()
        {
            ExtrinsicCheck?.Invoke();
        }

        public bool ChangeAccount(AccountType accountType)
        {
            CurrentAccountType = accountType;

            switch (accountType)
            {
                case AccountType.Alice:
                    Client.Account = Alice;
                    break;

                case AccountType.Bob:
                    Client.Account = Bob;
                    break;

                case AccountType.Charlie:
                    Client.Account = Charlie;
                    break;

                case AccountType.Dave:
                    Client.Account = Dave;
                    break;

                default:
                    Client.Account = Alice;
                    break;
            }

            return true;
        }

        public List<Wallet> StoredWallets()
        {
            var result = new List<Wallet>();
            foreach (var w in WalletFiles())
            {
                if (!Wallet.Load(w, out Wallet wallet))
                {
                    Debug.Log($"Failed to load wallet {w}");
                }

                result.Add(wallet);
            }
            return result;
        }

        private IEnumerable<string> WalletFiles()
        {
            var d = new DirectoryInfo(CachingManager.GetInstance().PersistentPath);
            return d.GetFiles(Wallet.ConcatWalletFileType("*")).Select(p => Path.GetFileNameWithoutExtension(p.Name));
        }

        // Start is called before the first frame update
        public void InitializeClient()
        {
            if (_client != null)
            {
                return;
            }

            _client = new SubstrateNetwork(null, _networkType, _nodeUrl);
        }
    }
}