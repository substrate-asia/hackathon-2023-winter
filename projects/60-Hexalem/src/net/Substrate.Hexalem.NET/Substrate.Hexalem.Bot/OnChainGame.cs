using Serilog;
using Substrate.Hexalem.Engine;
using Substrate.Hexalem.Integration.Model;
using Substrate.Integration;
using Substrate.Integration.Helper;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Game
{
    public class OnChainGame : GameManager
    {
        private enum InternalGameState
        {
            GameCreated,
            Play,
            Upgrade,
            FinishTurn,
            GameFinished
        }

        private readonly List<Account> _substratePlayers;

        private SubstrateNetwork _client = null;
        private Dictionary<string, InternalGameState> _state;
        private readonly int _concurentTask;
        private byte[]? _gameId;

        private TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onChainGameCreated;
        private TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onChainPlayed;
        private TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onChainUpgrade;
        private TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onChainFinishTurn;
        private TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)> _onGameFinished;

        public override GameType GameType => GameType.OnChain;

        internal OnChainGame(List<Account> players, SubstrateNetwork substrateNetwork)
            : base(players.Select(x => new HexaPlayer(x.Bytes)).ToList())
        {
            _client = substrateNetwork;
            _substratePlayers = players;

            _concurentTask = 10;

            _onChainGameCreated = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            _onChainPlayed = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            _onChainUpgrade = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            _onChainFinishTurn = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            _onGameFinished = new TaskCompletionSource<(bool, GameWorflowStatus)>();
        }

        /// <summary>
        /// Check if client is currently connected. If not, try to connect
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        private async Task EnsureConnectedAsync(CancellationToken token)
        {
            if (GameType == GameType.OnChain && !_client!.IsConnected)
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
            if (!(HexaGame != null && HexaGame.PlayerTurn == playerIndex && playerIndex < _players.Count))
                throw new InvalidOperationException($"Invalid {nameof(playerIndex)}");
        }

        /// <summary>
        /// Return current block number (mock it if off chain)
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        protected override async Task<uint> getBlockNumberAsync(CancellationToken token)
        {
            await EnsureConnectedAsync(token);
            return (uint)await _client!.GetBlocknumberAsync(token);
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
                if (e.IsSuccess && _state.ContainsKey(sender))
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
                    return GameWorflowStatus.LogErrorThenReturn($"Board for player {playerAddress} is empty");
                }

                boards.Add(board);
            }

            _gameId = boards[0].GameId;
            Log.Information("GameId = {gameId}", Utils.Bytes2HexString(_gameId));

            var game = await _client.GetGameAsync(_gameId, token);

            if (game == null)
            {
                return GameWorflowStatus.LogErrorThenReturn("Game is not set propertly");
            }

            HexaGame = HexalemWrapper.GetHexaGame(game, boards.ToArray());
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
            if (extrinsicStatus.IsSuccess)
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

        public override async Task<GameWorflowStatus> CreateGameAsync(GridSize gridSize, CancellationToken token)
        {
            await InitOnChainGame(token);

            var gameSubscription = await _client.CreateGameAsync(_substratePlayers[0], _substratePlayers, (int)GridSize.Medium, _concurentTask, token);

            if (string.IsNullOrEmpty(gameSubscription))
            {
                return GameWorflowStatus.LogErrorThenReturn($"[{_gameId}] Error while creating a new OnChain game. GameSubscription is empty");
            }

            _state.Add(gameSubscription, InternalGameState.GameCreated);

            Log.Information("[{gameId}] New game started, subscription = {subscription}, wait for finalized block", _gameId, gameSubscription);

            var res = (await _onChainGameCreated.Task).extrinsicStatus;
            _onChainGameCreated = new TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)>();
            return res;
        }

        

        public override async Task<GameWorflowStatus> ChooseAndPlaceAsync(byte playerIndex, int selectionIndex, (int, int) coords, CancellationToken token)
        {
            var chooseAndPlaceSubscription = await _client.PlayAsync(_substratePlayers[HexaGame.PlayerTurn], (byte)HexaGame.CurrentPlayerBoard.ToIndex(coords).Value, (byte)selectionIndex, _concurentTask, token);

            if (string.IsNullOrEmpty(chooseAndPlaceSubscription))
            {
                return GameWorflowStatus.LogErrorThenReturn("$[{_gameId}] Error while playing a new OnChain game. chooseAndPlaceSubscription is empty");
            }

            _state.Add(chooseAndPlaceSubscription, InternalGameState.Play);
            Log.Information("[{gameId}] Played at [{r},{q}], wait for finalized block", _gameId, coords.Item1, coords.Item2);

            var result = (await _onChainPlayed.Task).extrinsicStatus;
            _onChainPlayed = new TaskCompletionSource<(bool, GameWorflowStatus)>();
            return result;
        }

        public override async Task<GameWorflowStatus> UpgradeAsync(byte playerIndex, (int, int) coords, CancellationToken token)
        {
            var upgradeSubscription = await _client.UpgradeAsync(_substratePlayers[HexaGame.PlayerTurn], (byte)HexaGame.CurrentPlayerBoard.ToIndex(coords).Value, _concurentTask, token);

            if (string.IsNullOrEmpty(upgradeSubscription))
            {
                return GameWorflowStatus.LogErrorThenReturn($"[{_gameId}] Error while trying to upgrade tile [{coords.Item1},{coords.Item2}] OnChain game. upgradeSubscription is empty");
            }

            _state.Add(upgradeSubscription, InternalGameState.Upgrade);

            var res = (await _onChainUpgrade.Task).extrinsicStatus;
            _onChainUpgrade = new TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)>();
            return res;
        }

        public override async Task<GameWorflowStatus> FinishTurnAsync(byte playerIndex, CancellationToken token)
        {
            var finishTurnSubscription = await _client.FinishTurnAsync(_substratePlayers[playerIndex], _concurentTask, token);

            if (string.IsNullOrEmpty(finishTurnSubscription))
            {
                return GameWorflowStatus.LogErrorThenReturn($"[{_gameId}] Error while trying to finish a turn OnChain game. finishTurnSubscription is empty");
            }

            _state.Add(finishTurnSubscription, InternalGameState.FinishTurn);
            var res = (await _onChainFinishTurn.Task).extrinsicStatus;
            _onChainFinishTurn = new TaskCompletionSource<(bool res, GameWorflowStatus extrinsicStatus)>();
            return res;
        }
    }
}
