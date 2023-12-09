using Newtonsoft.Json.Linq;
using Schnorrkel.Keys;
using Serilog;
using Substrate.Hexalem.Integration.Model;
using Substrate.Hexalem.Bot;
using Substrate.Integration;
using Substrate.Integration.Client;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Integration.Test
{
    public class SubstrateGameTest
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

        private RandomAI bot = new RandomAI(0);
        private SubstrateNetwork client;
        private string nodeUri = "ws://127.0.0.1:9944";

        [OneTimeSetUp]
        public void SetUp()
        {
            client = new SubstrateNetwork(AliceAccount, Substrate.Integration.Helper.NetworkType.Live, nodeUri);
            bot = new RandomAI(0);
        }

        [Test]
        public async Task StartNewSubtrateGame_ThenPlay_ShouldSucceedAsync()
        {
            var pendingExtrinsic = new List<string>();
            var successEvent = new List<ExtrinsicInfo>();
            Assert.That(client.IsConnected, Is.EqualTo(false));

            bool isConnected = await client.ConnectAsync(true, true, CancellationToken.None);

            Assert.That(isConnected, Is.EqualTo(true));

            var players = new List<Account>() { AliceAccount, BobAccount };
            pendingExtrinsic.Add(
                await client.CreateGameAsync(AliceAccount, players, (int)GridSize.Medium, 10, CancellationToken.None));
            Assert.That(pendingExtrinsic.First(), Is.Not.Null);

            
            client.ExtrinsicManager.ExtrinsicUpdated += delegate (string sender, ExtrinsicInfo ei) {
                if(ei.IsSuccess && pendingExtrinsic.Any(x => x == sender))
                {
                    pendingExtrinsic.Remove(sender);
                    successEvent.Add(ei);
                }
            };

            Thread.Sleep(20_000);

            Assert.That(successEvent.Count, Is.EqualTo(1));

            var aliceBoard = await client.GetBoardAsync(Utils.GetAddressFrom(AliceAccount.Bytes), CancellationToken.None);
            var bobBoard = await client.GetBoardAsync(Utils.GetAddressFrom(BobAccount.Bytes), CancellationToken.None);

            // Tiles have to be set correctly
            Assert.That(aliceBoard, Is.Not.Null);
            Assert.That(aliceBoard.HexGrid.All(x => x.TileType == Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Empty));

            Assert.That(bobBoard, Is.Not.Null);
            Assert.That(aliceBoard.HexGrid.All(x => x.TileType == Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.TileType.Empty));

            var game = await client.GetGameAsync(aliceBoard.GameId, CancellationToken.None);

            Assert.That(game, Is.Not.Null);


            var hexaGame = Helper.GetHexaGame(game, new BoardSharp[2] { aliceBoard, bobBoard });
            Assert.That(hexaGame, Is.Not.Null);

            Assert.That(hexaGame.HexaTuples, Is.Not.Null);

            var aliceTiles = hexaGame.HexaTuples[0].board.Value.Select(x => (HexaTile)x);
            Assert.IsTrue(aliceTiles.All(x => x.TileType == TileType.Empty));

            var bobTiles = hexaGame.HexaTuples[1].board.Value.Select(x => (HexaTile)x);
            Assert.IsTrue(bobTiles.All(x => x.TileType == TileType.Empty));

        }
    }
}
