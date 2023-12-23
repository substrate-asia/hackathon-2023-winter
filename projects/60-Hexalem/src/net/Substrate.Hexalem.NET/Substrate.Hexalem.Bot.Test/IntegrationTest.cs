using Schnorrkel.Keys;
using Substrate.Integration;
using Substrate.NetApi.Model.Types;
using Substrate.NetApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Substrate.Hexalem.Engine;

namespace Substrate.Hexalem.Game.Test
{
    public abstract class IntegrationTest
    {
        #region Accounts
        private Account? _alice;
        public Account AliceAccount
        {
            get
            {
                if (_alice is null)
                {
                    //var kp = new Keyring().AddFromJson(File.ReadAllText($"{AppContext.BaseDirectory}/Accounts/json_alice.json"));
                    //kp.Unlock("alicealice");
                    //_alice = kp.Account;
                    _alice = BuildAccount("0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a");
                }

                return _alice;
            }
        }

        private Account? _bob;
        public Account BobAccount
        {
            get
            {
                if (_bob is null)
                    _bob = BuildAccount("0x398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89");

                return _bob;
            }
        }

        private Account? _charlie;
        public Account CharlieAccount
        {
            get
            {
                if (_charlie is null)
                    _charlie = BuildAccount("0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938");

                return _charlie;
            }
        }

        private Account BuildAccount(string hexPublicKey)
        {
            var miniSecret = new MiniSecret(
            Utils.HexToByteArray(hexPublicKey),
            ExpandMode.Ed25519);

            return Account.Build(
                KeyType.Sr25519,
                miniSecret.ExpandToSecret().ToBytes(),
                miniSecret.GetPair().Public.Key);
        }
        #endregion

        protected RandomAI bot = new RandomAI(0);
        protected string _nodeUri = "ws://127.0.0.1:9944";

        protected List<Account> _players;
        protected SubstrateNetwork _client;

        [OneTimeSetUp]
        public void SetUp()
        {
            bot = new RandomAI(0);

            _players = new List<Account>() { AliceAccount, BobAccount };
            _client = new SubstrateNetwork(_players.First(), Substrate.Integration.Helper.NetworkType.Live, _nodeUri);
        }

        protected GameManager gameManagerMultiPlayerFromType(string type)
        {
            if(type == "onchain")
            {
                return GameManager.OnChain(new SubstrateNetwork(_players.First(), Substrate.Integration.Helper.NetworkType.Live, _nodeUri), _players);
            } else
            {
                return GameManager.OffChain(new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) });
            }
        }
    }
}
