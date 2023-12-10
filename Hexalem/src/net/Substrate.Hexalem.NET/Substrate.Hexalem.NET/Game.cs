using Serilog;
using Substrate.Hexalem.Integration.Model;
using Substrate.Integration;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;
using Substrate.NetApi.Model.Types.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Substrate.Hexalem.Integration.Helper;

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

        private readonly TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onChainGameCreated ;
        private readonly TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onChainPlayed;
        private readonly TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onChainUpgrade;
        private readonly TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onChainFinishTurn;
        private readonly TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onGameFinished;

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

            _onChainGameCreated = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            _onChainPlayed = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            _onChainUpgrade = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            _onChainFinishTurn = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            _onGameFinished = new TaskCompletionSource<(bool, GameWorflowStatus)>();
        }

        protected Game(GameType gameType, List<HexaPlayer> players) : this()
        {
            GameType = gameType;
            _players = players;
        }
        protected Game(GameType gameType, List<Account> players, SubstrateNetwork substrateNetwork) 
            : this(gameType, players.Select(x => new HexaPlayer(x.Bytes)).ToList())
        {
            _client = substrateNetwork;
            _substratePlayers = players;
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
            return new Game(GameType.Pvp, nodePlayers, substrateNetwork);
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
                if(e.IsSuccess && _state.ContainsKey(sender))
                {
                    Log.Information($"{_state[sender]} successfully received !");

                    string? errorMessage = null;
                    NET.NetApiExt.Generated.Model.frame_system.pallet.Event? systemEvent;
                    e.SystemExtrinsicEvent(out systemEvent, out errorMessage);

                    GameWorflowStatus extrinsicStatus = errorMessage == null ?
                        GameWorflowStatus.Success() :
                        GameWorflowStatus.Fail(errorMessage!);

                    switch (_state[sender])
                    {
                        case InternalGameState.GameCreated:
                            _state.Remove(sender);
                            OnGameCreatedAsync(extrinsicStatus, token);
                            break;

                        case InternalGameState.Play:
                            _state.Remove(sender);
                            OnPlayTurnAsync(extrinsicStatus, token);
                            break;

                        case InternalGameState.Upgrade:
                            _state.Remove(sender);
                            OnUpgradeAsync(extrinsicStatus, token);
                            break;

                        case InternalGameState.FinishTurn:
                            _state.Remove(sender);
                            OnFinishTurnAsync(extrinsicStatus, token);
                            break;

                        case InternalGameState.GameFinished:
                            _state.Remove(sender);
                            OnGameFinishedAsync(extrinsicStatus, token);
                            break;
                    }
                }
            };
        }

        /// <summary>
        /// Call Hexalem storage to build an <see cref="HexaGame"/> instance
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<GameWorflowStatus> reloadHexaGameFromStorageAsync(CancellationToken token)
        {
            var boards = new List<BoardSharp>();
            foreach (var substratePlayer in _substratePlayers)
            {
                var playerAddress = Utils.GetAddressFrom(substratePlayer.Bytes);
                var board = await _client.GetBoardAsync(playerAddress, token);

                if (board == null)
                {
                    return LogErrorThenReturn($"Board for player {playerAddress} is empty");
                }

                boards.Add(board);
            }

            _gameId = boards[0].GameId;
            Log.Information("GameId = {gameId}", Utils.Bytes2HexString(_gameId));

            var game = await _client.GetGameAsync(_gameId, token);

            if (game == null)
            {
                return LogErrorThenReturn("Game is not set propertly");
            }

            HexaGame = Helper.GetHexaGame(game, boards.ToArray());
            return GameWorflowStatus.Success();
        }

        /// <summary>
        /// Trigger when CreateGameAsync extrinsic is in finalized block
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        private async Task<bool> OnGameCreatedAsync(GameWorflowStatus extrinsicStatus, CancellationToken token)
        {
            if(extrinsicStatus.IsSuccess)
            {
                await EnsureConnectedAsync(token);
                await reloadHexaGameFromStorageAsync(token);
            }

            _onChainGameCreated.SetResult((true, extrinsicStatus));
            return true;
        }

        /// <summary>
        /// Trigger when PlayAsync extrinsic is in finalized block
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<bool> OnPlayTurnAsync(GameWorflowStatus extrinsicStatus, CancellationToken token)
        {
            if (extrinsicStatus.IsSuccess)
            {
                await EnsureConnectedAsync(token);
                await reloadHexaGameFromStorageAsync(token);
            }

            _onChainPlayed.SetResult((true, extrinsicStatus));
            return true;
        }

        /// <summary>
        /// Trigger when FinishTurnAsync extrinsic is in finalized block
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<bool> OnFinishTurnAsync(GameWorflowStatus extrinsicStatus, CancellationToken token)
        {
            if (extrinsicStatus.IsSuccess)
            {
                await EnsureConnectedAsync(token);
                await reloadHexaGameFromStorageAsync(token);
            }

            _onChainFinishTurn.SetResult((true, extrinsicStatus));
            return true;
        }

        /// <summary>
        /// Trigger when UpgradeAsync extrinsic is in finalized block
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<bool> OnUpgradeAsync(GameWorflowStatus extrinsicStatus, CancellationToken token)
        {
            if (extrinsicStatus.IsSuccess)
            {
                await EnsureConnectedAsync(token);
                await reloadHexaGameFromStorageAsync(token);
            }

            _onChainUpgrade.SetResult((true, extrinsicStatus));
            return true;
        }

        private async Task<bool> OnGameFinishedAsync(GameWorflowStatus extrinsicStatus, CancellationToken token)
        {
            _onGameFinished.SetResult((true, extrinsicStatus));
            return true;
        }

        /// <summary>
        /// Create a new game
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="players"></param>
        /// <param name="gridSize"></param>
        /// <returns></returns>
        public async Task<GameWorflowStatus> CreateGameAsync(GridSize gridSize, CancellationToken token)
        {
            if(GameType == GameType.Pvp)
            {
                await InitOnChainGame(token);

                var gameSubscription = await _client.CreateGameAsync(_substratePlayers[0], _substratePlayers, (int)GridSize.Medium, _concurentTask, token);

                if(string.IsNullOrEmpty(gameSubscription))
                {
                    return LogErrorThenReturn($"[{_gameId}] Error while creating a new OnChain game. GameSubscription is empty");
                }

                _state.Add(gameSubscription, InternalGameState.GameCreated);

                Log.Information("[{gameId}] New game started, subscription = {subscription}, wait for finalized block", _gameId, gameSubscription);

                return (await _onChainGameCreated.Task).extrinsicStatus;
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

                return GameWorflowStatus.Success();
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
        public async Task<GameWorflowStatus> ChooseAndPlaceAsync(byte playerIndex, int selectionIndex, (int, int) coords, CancellationToken token)
        {
            EnsurePlayerIndex(playerIndex);

            if (GameType == GameType.Pvp)
            {
                var chooseAndPlaceSubscription = await _client.PlayAsync(_substratePlayers[HexaGame.PlayerTurn], (byte)HexaGame.CurrentPlayerBoard.ToIndex(coords).Value, (byte)selectionIndex, _concurentTask, token);

                if (string.IsNullOrEmpty(chooseAndPlaceSubscription))
                {
                    return LogErrorThenReturn("$[{_gameId}] Error while playing a new OnChain game. chooseAndPlaceSubscription is empty");
                }

                _state.Add(chooseAndPlaceSubscription, InternalGameState.Play);
                Log.Information("[{gameId}] Played at [{r},{q}], wait for finalized block", _gameId, coords.Item1, coords.Item2);
                
                return (await _onChainPlayed.Task).extrinsicStatus;
            } else
            {
                if (!HexaGame.ChooseAndPlace(playerIndex, selectionIndex, coords))
                {
                    return GameWorflowStatus.Fail("");
                }

                HexaGame.PostMove(await getBlockNumberAsync(token));

                return GameWorflowStatus.Success();
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
        public async Task<GameWorflowStatus> UpgradeAsync(byte playerIndex, (int, int) coords, CancellationToken token)
        {
            EnsurePlayerIndex(playerIndex);

            if (GameType == GameType.Pvp)
            {
                var upgradeSubscription = await _client.UpgradeAsync(_substratePlayers[HexaGame.PlayerTurn], (byte)HexaGame.CurrentPlayerBoard.ToIndex(coords).Value, _concurentTask, token);

                if (string.IsNullOrEmpty(upgradeSubscription))
                {
                    return LogErrorThenReturn($"[{_gameId}] Error while trying to upgrade tile [{coords.Item1},{coords.Item2}] OnChain game. upgradeSubscription is empty");
                }

                _state.Add(upgradeSubscription, InternalGameState.Upgrade);
                return (await _onChainUpgrade.Task).extrinsicStatus;
            } else
            {
                if (!HexaGame.Upgrade(playerIndex, coords))
                {
                    return GameWorflowStatus.Fail("");
                }

                HexaGame.PostMove(await getBlockNumberAsync(token));

                return GameWorflowStatus.Success();
            }
        }

        /// <summary>
        /// Player finish his turn or win the game by call a late opponent
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        public async Task<GameWorflowStatus> FinishTurnAsync(byte playerIndex, CancellationToken token)
        {
            EnsurePlayerIndex(playerIndex);

            var blockNumber = await getBlockNumberAsync(token);

            if (GameType == GameType.Pvp)
            {
                var finishTurnSubscription = await _client.FinishTurnAsync(_substratePlayers[playerIndex], _concurentTask, token);

                if (string.IsNullOrEmpty(finishTurnSubscription))
                {
                    return LogErrorThenReturn($"[{_gameId}] Error while trying to finish a turn OnChain game. finishTurnSubscription is empty");
                }

                _state.Add(finishTurnSubscription, InternalGameState.FinishTurn);
                return (await _onChainFinishTurn.Task).extrinsicStatus;
            } else
            {
                // Update game turn information
                if (!HexaGame.UpdateTurnState(blockNumber, playerIndex))
                {
                    return GameWorflowStatus.Fail("");
                }

                // Add new ressouces to player
                HexaGame.CalcRewards(blockNumber, playerIndex);
                Log.Debug("Rewards calculated for player {index}", playerIndex);

                // Does the current player win ?
                if (HexaGame.IsGameWon())
                {
                    return GameWorflowStatus.Success();
                }

                if (HexaGame.PlayerTurn != 0)
                {
                    Log.Debug("Players does not have already played this turn");
                    return GameWorflowStatus.Success();
                }

                HexaGame.NextRound(blockNumber);

                return GameWorflowStatus.Success();
            }
        }

        private GameWorflowStatus LogErrorThenReturn(string message)
        {
            Log.Error(message);
            return GameWorflowStatus.Fail(message);
        }
    }
}