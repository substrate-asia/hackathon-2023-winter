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
using Substrate.NetApi.Model.Types.Primitive;

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
        private string _nodeUri = "ws://127.0.0.1:9944";

        private Game _game;
        private List<Account>_players;
        private SubstrateNetwork _client;

        [OneTimeSetUp]
        public void SetUp()
        {
            bot = new RandomAI(0);

            _players = new List<Account>() { AliceAccount, BobAccount };
            _client = new SubstrateNetwork(_players.First(), Substrate.Integration.Helper.NetworkType.Live, _nodeUri);

            _game = Game.Pvp(new SubstrateNetwork(_players.First(), Substrate.Integration.Helper.NetworkType.Live, _nodeUri), _players);
        }

        [Test]
        public async Task StartNewSubstrateGame_ThenPlay_ShouldSucceedAsync()
        {
            var token = CancellationToken.None;

            Assert.That(_client.IsConnected, Is.EqualTo(false));

            Assert.That(_game.HexaGame, Is.Null);

            // Create a new game, and wait for extrinsic
            GameWorflowStatus result = await _game.CreateGameAsync(GridSize.Medium, token);

            Assert.That(result, Is.True);

            Assert.That(_game.HexaGame.HexaTuples, Is.Not.Null);

            var aliceTiles = _game.HexaGame.HexaTuples[0].board.Value.Select(x => (HexaTile)x);
            Assert.That(aliceTiles.Where(x => x.TileType == TileType.Empty).Count, Is.EqualTo(((int)GridSize.Medium) - 1));
            Assert.That(aliceTiles.Where(x => x.TileType == TileType.Home).Count, Is.EqualTo(1));

            var bobTiles = _game.HexaGame.HexaTuples[1].board.Value.Select(x => (HexaTile)x);
            Assert.That(bobTiles.Where(x => x.TileType == TileType.Empty).Count, Is.EqualTo(((int)GridSize.Medium) - 1));
            Assert.That(bobTiles.Where(x => x.TileType == TileType.Home).Count, Is.EqualTo(1));

            // Alice start first
            Assert.That(_game.HexaGame.PlayerTurn, Is.EqualTo((byte)0));

            // Alice has 1 mana
            Assert.That(_game.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(1));
            result = await _game.ChooseAndPlaceAsync(_game.HexaGame.PlayerTurn, 0, (0, 1), CancellationToken.None);
            Assert.That(result, Is.True);
            Assert.That(_game.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(0));

            Assert.That(((HexaTile)_game.HexaGame.CurrentPlayerBoard[0, 1]).IsEmpty(), Is.False);

            result = await _game.FinishTurnAsync(_game.HexaGame.PlayerTurn,CancellationToken.None);
            Assert.That(result, Is.True);

            // Now it is Bob's turn
            Assert.That(_game.HexaGame.PlayerTurn, Is.EqualTo((byte)1));
            Assert.That(_game.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(1));
            result = await _game.ChooseAndPlaceAsync(_game.HexaGame.PlayerTurn, 0, (0, 1), CancellationToken.None);
            Assert.That(result, Is.True);
            Assert.That(_game.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(0));

            Assert.That(_game.HexaGame.HexBoardRound, Is.EqualTo((byte)0));
            result = await _game.FinishTurnAsync(_game.HexaGame.PlayerTurn, CancellationToken.None);
            Assert.That(result, Is.True);

            // Now it is Alice turn again, and we have a new round
            Assert.That(_game.HexaGame.PlayerTurn, Is.EqualTo((byte)0));
            Assert.That(_game.HexaGame.HexBoardRound, Is.EqualTo((byte)1));
        }
    }
}
