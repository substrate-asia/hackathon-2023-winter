using Serilog;
using Substrate.Hexalem.Integration.Model;
using Substrate.Integration;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

[assembly: InternalsVisibleTo("Substrate.Hexalem.Test")]

namespace Substrate.Hexalem
{
    public class Game
    {
        public HexaGame HexaGame { get; internal set; }
        public GameType GameType { get; internal set; }

        private readonly List<HexaPlayer> _players;
        private readonly List<Account> _substratePlayers;

        private SubstrateNetwork? _client = null;
        private Dictionary<string, InternalGameState> _state;
        private readonly string _nodeUri;
        private readonly int _concurentTask;
        private byte[]? _gameId;

        private readonly TaskCompletionSource<bool> _onChainGameCreated ;
        private readonly TaskCompletionSource<bool> _onChainPlayed;
        private readonly TaskCompletionSource<bool> _onChainUpgrade;
        private readonly TaskCompletionSource<bool> _onChainFinishTurn;
        private readonly TaskCompletionSource<bool> _onGameFinished;

        private enum InternalGameState
        {
            GameCreated,
            Play,
            Upgrade,
            FinishTurn,
            GameFinished
        }
        protected Game()
        {
            _nodeUri = "ws://127.0.0.1:9944";
            _concurentTask = 10;

            _players = new List<HexaPlayer>();
            _substratePlayers = new List<Account>();

            _onChainGameCreated = new TaskCompletionSource<bool>();
            _onChainPlayed = new TaskCompletionSource<bool>();
            _onChainUpgrade = new TaskCompletionSource<bool>();
            _onChainFinishTurn = new TaskCompletionSource<bool>();
            _onGameFinished = new TaskCompletionSource<bool>();
        }

        protected Game(GameType gameType, List<HexaPlayer> players) : this()
        {
            GameType = gameType;
            _players = players;
        }
        protected Game(GameType gameType, List<HexaPlayer> players, SubstrateNetwork substrateNetwork) : this(gameType, players)
        {
            _client = substrateNetwork;
        }

        /// <summary>
        /// Start a new training game with a single player
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        public static Game Training(HexaPlayer player)
        {
            return new Game(GameType.Training, new List<HexaPlayer>() { player });
        }

        /// <summary>
        /// Start a new game versus a bot
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        public static Game VsBot(List<HexaPlayer> players) // Todo : Add AI in parameters ?
        {
            return new Game(GameType.VsBots, players);
        }

        /// <summary>
        /// Start a new OnChain game
        /// </summary>
        /// <param name="substrateNetwork"></param>
        /// <param name="nodePlayers"></param>
        /// <returns></returns>
        public static Game Pvp(SubstrateNetwork substrateNetwork, List<Account> nodePlayers)
        {
            var players = nodePlayers.Select(x => new HexaPlayer(x.Bytes)).ToList();

            return new Game(GameType.Pvp, players, substrateNetwork);
        }

        /// <summary>
        /// Check if client is currently connected. If not, try to connect
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        private async Task EnsureConnectedAsync(CancellationToken token)
        {
            if(GameType == GameType.Pvp && !_client!.IsConnected)
            {
                var isConnected = await _client.ConnectAsync(true, true, token);
                if (isConnected)
                    Log.Information("Connected to Hexalem node !"); 
                else
                    throw new InvalidOperationException("Unable to connect to Hexalem node...");
            }
        }

        private void EnsurePlayerIndex(byte playerIndex)
        {
            if(!(HexaGame != null && HexaGame.PlayerTurn == playerIndex && playerIndex < _players.Count))
                throw new InvalidOperationException($"Invalid {nameof(playerIndex)}");
        }

        /// <summary>
        /// Return current block number (mock it if off chain)
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<uint> getBlockNumberAsync(CancellationToken token)
        {
            await EnsureConnectedAsync(token);

            if (GameType == GameType.Pvp)
            {
                return (uint)await _client!.GetBlocknumberAsync(token);
            }

            // It is not a Pvp game, so let's return defaut value
            return default;
        }

        /// <summary>
        /// Initialize subscription to extrinsic events to manage game state
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task InitOnChainGame(CancellationToken token)
        {
            _state = new Dictionary<string, InternalGameState>();
            Log.Information("Start creating a game on Hexalem node");
            //_client = new SubstrateNetwork(_substratePlayers.First(), Substrate.Integration.Helper.NetworkType.Live, _nodeUri);

            await EnsureConnectedAsync(token);

            _client.ExtrinsicManager.ExtrinsicUpdated += async (sender, e) =>
            {
                if (e.IsSuccess)
                {
                    if (_state.ContainsKey(sender))
                    {
                        Log.Information($"{_state[sender]} successfully received !");

                        switch (_state[sender])
                        {
                            case InternalGameState.GameCreated:
                                _state.Remove(sender);
                                await OnGameCreatedAsync(token);
                                break;

                            case InternalGameState.Play:
                                _state.Remove(sender);
                                await OnPlayTurnAsync(token);
                                break;

                            case InternalGameState.Upgrade:
                                _state.Remove(sender);
                                await OnUpgradeAsync(token);
                                break;

                            case InternalGameState.FinishTurn:
                                _state.Remove(sender);
                                await OnFinishTurnAsync(token);
                                break;

                            case InternalGameState.GameFinished:
                                _state.Remove(sender);
                                await OnGameFinished(token);
                                break;
                        }
                    }
                }
            };
        }

        /// <summary>
        /// Call Hexalem storage to build an <see cref="HexaGame"/> instance
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<bool> reloadHexaGameFromStorageAsync(CancellationToken token)
        {
            var boards = new List<BoardSharp>();
            foreach (var substratePlayer in _substratePlayers)
            {
                var playerAddress = Utils.GetAddressFrom(substratePlayer.Bytes);
                var board = await _client.GetBoardAsync(playerAddress, token);

                if (board == null)
                {
                    Log.Error("Board for player {address} is empty", playerAddress);
                    return false;
                }

                boards.Add(board);
            }

            _gameId = boards[0].GameId;
            Log.Information("GameId = {gameId}", Utils.Bytes2HexString(_gameId));

            var game = await _client.GetGameAsync(boards[0].GameId, token);

            if (game == null)
            {
                Log.Error("Game is not set propertly");
                return false;
            }

            HexaGame = Helper.GetHexaGame(game, boards.ToArray());
            return true;
        }

        /// <summary>
        /// Trigger when CreateGameAsync extrinsic is in finalized block
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        private async Task<bool> OnGameCreatedAsync(CancellationToken token)
        {
            await EnsureConnectedAsync(token);
            await reloadHexaGameFromStorageAsync(token);

            _onChainGameCreated.SetResult(true);
            return true;
        }

        /// <summary>
        /// Trigger when PlayAsync extrinsic is in finalized block
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<bool> OnPlayTurnAsync(CancellationToken token)
        {
            await EnsureConnectedAsync(token);
            await reloadHexaGameFromStorageAsync(token);

            _onChainPlayed.SetResult(true);
            return true;
        }

        /// <summary>
        /// Trigger when FinishTurnAsync extrinsic is in finalized block
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<bool> OnFinishTurnAsync(CancellationToken token)
        {
            await EnsureConnectedAsync(token);
            await reloadHexaGameFromStorageAsync(token);

            _onChainFinishTurn.SetResult(true);
            return true;
        }

        /// <summary>
        /// Trigger when UpgradeAsync extrinsic is in finalized block
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<bool> OnUpgradeAsync(CancellationToken token)
        {
            await EnsureConnectedAsync(token);
            await reloadHexaGameFromStorageAsync(token);

            _onChainUpgrade.SetResult(true);
            return true;
        }

        private async Task<bool> OnGameFinished(CancellationToken token)
        {
            _onGameFinished.SetResult(true);
            return true;
        }

        /// <summary>
        /// Create a new game
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="players"></param>
        /// <param name="gridSize"></param>
        /// <returns></returns>
        public async Task<bool> CreateGameAsync(GridSize gridSize, CancellationToken token)
        {
            if(GameType == GameType.Pvp)
            {
                await InitOnChainGame(token);

                var gameSubscription = await _client.CreateGameAsync(_substratePlayers[0], _substratePlayers, (int)GridSize.Medium, _concurentTask, token);

                if(string.IsNullOrEmpty(gameSubscription))
                {
                    Log.Error("[{gameId}] Error while creating a new OnChain game. GameSubscription is empty", _gameId);
                    return false;
                }

                _state.Add(gameSubscription, InternalGameState.GameCreated);
                Log.Information("[{gameId}] New game started, subscription = {subscription}, wait for finalized block", _gameId, gameSubscription);

                return await _onChainGameCreated.Task;
            }
            else
            {
                var blockNumber = await getBlockNumberAsync(token);

                Random random = new Random((int)await getBlockNumberAsync(token));

                var randomHash = new byte[32];
                random.NextBytes(randomHash);

                var hexaTuple = new List<(HexaPlayer, HexaBoard)>();
                foreach (var player in _players)
                {
                    var hexaBoard = new HexaBoard(new byte[(int)gridSize]);
                    hexaTuple.Add((player, hexaBoard));
                }

                HexaGame = new HexaGame(randomHash, hexaTuple);
                HexaGame.Init(blockNumber);

                Log.Information($"New Game created, with a {gridSize} hex grid and {HexaGame.PlayersCount} players.");

                return true;
            }
            
        }

        /// <summary>
        /// Player chose a tile and play it
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <param name="selectionIndex"></param>
        /// <param name="coords"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public async Task<bool> ChooseAndPlaceAsync(byte playerIndex, int selectionIndex, (int, int) coords, CancellationToken token)
        {
            EnsurePlayerIndex(playerIndex);

            if (GameType == GameType.Pvp)
            {
                var chooseAndPlaceSubscription = await _client.PlayAsync(_substratePlayers[HexaGame.PlayerTurn], (byte)HexaGame.CurrentPlayerBoard.ToIndex(coords).Value, (byte)selectionIndex, _concurentTask, token);

                if (string.IsNullOrEmpty(chooseAndPlaceSubscription))
                {
                    Log.Error("[{gameId}] Error while playing a new OnChain game. chooseAndPlaceSubscription is empty", _gameId);
                    return false;
                }

                _state.Add(chooseAndPlaceSubscription, InternalGameState.Play);
                Log.Information("[{gameId}] Played at [{r},{q}], wait for finalized block", _gameId, coords.Item1, coords.Item2);
                
                return await _onChainPlayed.Task;
            } else
            {
                if (!HexaGame.ChooseAndPlace(playerIndex, selectionIndex, coords))
                {
                    return false;
                }

                HexaGame.PostMove(await getBlockNumberAsync(token));

                return true;
            }
                
        }

        /// <summary>
        /// Player upgrade a tile
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        public async Task<bool> UpgradeAsync(byte playerIndex, (int, int) coords, CancellationToken token)
        {
            EnsurePlayerIndex(playerIndex);

            if (GameType == GameType.Pvp)
            {
                var upgradeSubscription = await _client.UpgradeAsync(_substratePlayers[HexaGame.PlayerTurn], (byte)HexaGame.CurrentPlayerBoard.ToIndex(coords).Value, _concurentTask, token);

                if (string.IsNullOrEmpty(upgradeSubscription))
                {
                    Log.Error("[{gameId}] Error while trying to upgrade tile [{q},{r}] OnChain game. upgradeSubscription is empty", _gameId, coords.Item1, coords.Item2);
                    return false;
                }

                _state.Add(upgradeSubscription, InternalGameState.Upgrade);
                return await _onChainUpgrade.Task;
            } else
            {
                if (!HexaGame.Upgrade(playerIndex, coords))
                {
                    return false;
                }

                HexaGame.PostMove(await getBlockNumberAsync(token));

                return true;
            }
        }

        /// <summary>
        /// Player finish his turn or win the game by call a late opponent
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        public async Task<bool> FinishTurnAsync(byte playerIndex, CancellationToken token)
        {
            EnsurePlayerIndex(playerIndex);

            var blockNumber = await getBlockNumberAsync(token);

            if (GameType == GameType.Pvp)
            {
                var finishTurnSubscription = await _client.FinishTurnAsync(_substratePlayers[playerIndex], _concurentTask, token);

                if (string.IsNullOrEmpty(finishTurnSubscription))
                {
                    Log.Error("[{gameId}] Error while trying to finish a turn OnChain game. finishTurnSubscription is empty", _gameId);
                    return false;
                }

                _state.Add(finishTurnSubscription, InternalGameState.Upgrade);
                return await _onChainFinishTurn.Task;
            } else
            {
                // Update game turn information
                if (!HexaGame.UpdateTurnState(blockNumber, playerIndex))
                {
                    return false;
                }

                // Add new ressouces to player
                HexaGame.CalcRewards(blockNumber, playerIndex);
                Log.Debug("Rewards calculated for player {index}", playerIndex);

                // Does the current player win ?
                if (HexaGame.IsGameWon())
                {
                    return true;
                }

                if (HexaGame.PlayerTurn != 0)
                {
                    Log.Debug("Players does not have already played this turn");
                    return true;
                }

                HexaGame.NextRound(blockNumber);

                return true;
            }
        }
    }
}