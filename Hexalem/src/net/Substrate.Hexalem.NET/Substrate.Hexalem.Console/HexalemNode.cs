using Schnorrkel.Keys;
using Serilog;
using Substrate.Hexalem.Game;
using Substrate.Hexalem.Engine;
using Substrate.Integration;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;

namespace Substrate.Hexalem.Console
{
    /// <summary>
    /// Basic class to test Hexalem node communication
    /// </summary>
    internal class HexalemNode
    {
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

        private Dictionary<string, NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Event> _state;
        private List<Account> _players;
        private SubstrateNetwork _client;
        private int _concurrentTask;

        public async Task InitAsync(CancellationToken token)
        {
            _concurrentTask = 10;
            _state = new Dictionary<string, NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Event>();
            Log.Information("Start creating a game on Hexalem node");
            _client = new SubstrateNetwork(AliceAccount, Substrate.Integration.Helper.NetworkType.Live, "ws://127.0.0.1:9944");

            bool isConnected = await _client.ConnectAsync(true, true, token);

            Log.Information("Connected to Hexalem local node = {isConnected}", isConnected);

            _players = new List<Account>() { AliceAccount, BobAccount };

            _client.ExtrinsicManager.ExtrinsicUpdated += async (sender, e) =>
            {
                if (e.IsSuccess)
                {
                    Log.Information("Extrinsic success");
                    if (_state.ContainsKey(sender))
                    {
                        Log.Information($"{_state[sender]} successfully received !");

                        switch (_state[sender])
                        {
                            case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Event.GameCreated:
                            case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Event.NewTurn:
                                _state.Remove(sender);
                                await PlayTurnAsync(token);
                                break;

                            case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Event.MovePlayed:
                                _state.Remove(sender);
                                await FinishTurnAsync(token);
                                break;
                        }
                    }
                }
            };

            await StartGameAsync(token);
        }

        public async Task StartGameAsync(CancellationToken token)
        {
            var gameSubscription = await _client.CreateGameAsync(AliceAccount, _players, (int)GridSize.Medium, _concurrentTask, token);

            _state.Add(gameSubscription, NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Event.GameCreated);

            Log.Information("New game started, subscription = {subscription}, wait for block", gameSubscription);

            if (gameSubscription == null) throw new InvalidOperationException(nameof(gameSubscription));
        }

        public async Task PlayTurnAsync(CancellationToken token)
        {
            var aliceBoard = await _client.GetBoardAsync(Utils.GetAddressFrom(AliceAccount.Bytes), token);
            var bobBoard = await _client.GetBoardAsync(Utils.GetAddressFrom(BobAccount.Bytes), token);
            if (aliceBoard is null || bobBoard is null)
                throw new InvalidOperationException("Boards are not set propertly");

            Log.Information("GameId = {gameId}", aliceBoard.GameId);

            var game = await _client.GetGameAsync(aliceBoard.GameId, token);

            if (game is null)
                throw new InvalidOperationException("Game is not set propertly");

            Log.Information("Game and player boards successfully received. Let's build HexaGame instance");
            var hexaGame = Substrate.Integration.Helper.HexalemWrapper.GetHexaGame(game, new Integration.Model.BoardSharp[2] { aliceBoard, bobBoard });

            Log.Information($"HexaGame instance : {hexaGame}");

            RandomAI bot = new RandomAI(0);
            var move = bot.FindBestAction(hexaGame, 0);
            //hexaGame = Game.ChooseAndPlaceAsync((await _client.GetBlocknumberAsync(CancellationToken.None)).Value, hexaGame, hexaGame.PlayerTurn, 0, (-2, -2));

            var playSubscription = await _client.PlayAsync(
                AliceAccount,
                (byte)hexaGame.HexaTuples[hexaGame.PlayerTurn].board.ToIndex(move.PlayTileAt).Value,
                (byte)move.SelectionIndex!.Value,
                _concurrentTask,
                CancellationToken.None);

            _state.Add(playSubscription, NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Event.MovePlayed);
        }

        public async Task FinishTurnAsync(CancellationToken token)
        {
            var finishTurnSubscription = await _client.FinishTurnAsync(AliceAccount, _concurrentTask, token);
            _state.Add(finishTurnSubscription, NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Event.NewTurn);
        }
    }
}