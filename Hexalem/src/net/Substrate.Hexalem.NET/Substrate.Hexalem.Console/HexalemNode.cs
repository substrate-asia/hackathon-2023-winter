using Schnorrkel.Keys;
using Serilog;
using Substrate.Hexalem.NET;
using Substrate.Integration;
using Substrate.NET.Wallet.Keyring;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task StartGameAsync(CancellationToken token)
        {
            Log.Information("Start creating a game on Hexalem node");
            var client = new SubstrateNetwork(AliceAccount, Substrate.Integration.Helper.NetworkType.Live, "ws://127.0.0.1:9944");

            bool isConnected = await client.ConnectAsync(true, true, token);

            Log.Information("Connected to blockchain = {isConected}", isConnected);

            var players = new List<Account>() { AliceAccount, BobAccount };

            var gameSubscription = await client.CreateGameAsync(AliceAccount, players, (int)GridSize.Medium, 10, token);
            Log.Information("New game started, subscription = {subscription}, wait for block", gameSubscription);

            if (gameSubscription == null) throw new InvalidOperationException(nameof(gameSubscription));

            //client.ExtrinsicManager.Add(gameSubscription, "startGame");
            client.ExtrinsicManager.ExtrinsicUpdated += async (sender, e) =>
            {
                if (e.IsSuccess)
                {
                    Log.Information("Extrinsic success");

                    // Fetch board for each player
                    var aliceBoard = await client.GetBoardAsync(Utils.GetAddressFrom(AliceAccount.Bytes), token);
                    var bobBoard = await client.GetBoardAsync(Utils.GetAddressFrom(BobAccount.Bytes), token);
                    if (aliceBoard is null || bobBoard is null) 
                        throw new InvalidOperationException("Boards are not set propertly");

                    Log.Information("GameId = {gameId}", aliceBoard.GameId);

                    var game = await client.GetGameAsync(aliceBoard.GameId, token);

                    if(game is null)
                        throw new InvalidOperationException("Game is not set propertly");

                    Log.Information("Game and player boards successfully received. Let's build HexaGame instance");
                    var hexaGame = new HexaGame(game, new Integration.Model.BoardSharp[2] { aliceBoard, bobBoard });

                    Log.Information($"HexaGame instance ok : {hexaGame}");
                }
            };
        }
    }
}
