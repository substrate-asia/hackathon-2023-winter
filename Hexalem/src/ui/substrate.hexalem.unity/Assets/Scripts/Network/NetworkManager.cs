using Schnorrkel.Keys;
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
    public delegate void ExtrinsicStateUpdate(string subscriptionId, ExtrinsicStatus extrinsicUpdate);

    public class NetworkManager : Singleton<NetworkManager>
    {
        public delegate void ConnectionStateChangedHandler(bool IsConnected);
        public delegate void ExtrinsicCheckHandler();

        public event ConnectionStateChangedHandler ConnectionStateChanged;
        public event ExtrinsicCheckHandler ExtrinsicCheck;

        private const string BIGBALLZ = "math purchase spawn allow identify fade tube science jelly degree language boss";

        public MiniSecret MiniSecretAlice => new MiniSecret(Utils.HexToByteArray("0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a"), ExpandMode.Ed25519);
        public Account Alice => Account.Build(KeyType.Sr25519, MiniSecretAlice.ExpandToSecret().ToBytes(), MiniSecretAlice.GetPair().Public.Key);

        private readonly string _nodeUrl = "wss://...";
        
        //private readonly string _nodeUrl = "wss://rpc-rococo.bajun.network";
        //private readonly NetworkType _networkType = NetworkType.Live;
        //private readonly string _nodeUrl = "wss://rpc-parachain.bajun.network";

        //private SubstrateNetwork _client;
        //public SubstrateNetwork Client => _client;

        public Wallet Wallet { get; private set; }

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
            //if (_client == null)
            //{
            //    return;
            //}

            //var connectionState = _client.IsConnected;
            //if (_lastConnectionState == null || _lastConnectionState != connectionState)
            //{
            //    ConnectionStateChanged?.Invoke(connectionState);
            //    _lastConnectionState = connectionState;
            //}
        }

        private void UpdatedExtrinsic()
        {
            ExtrinsicCheck?.Invoke();
        }

        public bool LoadWallet(string walletName = null)
        {
            if (walletName == null && Wallet != null && Wallet.IsStored)
            {
                Debug.Log($"No wallet name, but we have an active walet loaded.");
                return false;
            }

            var walletNames = WalletFiles().Where(p => Wallet.IsValidWalletName(p));

            if (!walletNames.Any() || (walletName != null && !walletNames.Contains(walletName)))
            {
                return false;
            }

            if (walletName == null)
            {
                walletName = walletNames.ElementAt(0);
                //Debug.Log($"Selected the first element {walletName} from existing wallets");
                if (PlayerPrefs.HasKey("NetworkManager.WalletRef"))
                {
                    var playerPrefsWallet = PlayerPrefs.GetString("NetworkManager.WalletRef");
                    if (walletNames.Contains(playerPrefsWallet))
                    {
                        walletName = playerPrefsWallet;
                        //Debug.Log($"Set wallet to {walletName} from player prefs");
                    }
                }
            }

            if (!Wallet.Load(walletName, out Wallet wallet))
            {
                Debug.Log($"Couldn't load wallet {walletName}");
                return false;
            }

            ChangeWallet(wallet);

            return true;
        }

        public bool ChangeWallet(Wallet wallet)
        {
            if (wallet == null)
            {
                return false;
            }

            //Debug.Log($"Loading {wallet.FileName} wallet with account {wallet.Account}");

            //Wallet = wallet;
            
            //// TODO: is this really needed? To hold two times the account?
            //Client.Account = Wallet.Account;

            //// save if we change wallet to a new one
            //if (PlayerPrefs.GetString("NetworkManager.WalletRef") != wallet.FileName)
            //{
            //    PlayerPrefs.SetString("NetworkManager.WalletRef", Wallet.FileName);
            //    PlayerPrefs.Save();
            //}

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
            //if (_client != null)
            //{
            //    return;
            //}

            //_client = new SubstrateNetwork(null, _networkType, _nodeUrl);
        }
    }
}