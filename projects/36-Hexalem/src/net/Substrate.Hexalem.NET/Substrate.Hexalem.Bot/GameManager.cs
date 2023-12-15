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
using Substrate.Integration.Helper;
using Substrate.Hexalem.Engine;

[assembly: InternalsVisibleTo("Substrate.Hexalem.Bot.Test")]

namespace Substrate.Hexalem.Game
{
    public abstract class GameManager
    {
        public HexaGame HexaGame { get; internal set; }
        public abstract GameType GameType { get; }

        protected readonly List<HexaPlayer> _players;
        
        protected GameManager()
        {
            _players = new List<HexaPlayer>();
        }

        protected GameManager(List<HexaPlayer> players) : this()
        {
            _players = players;
        }
        

        /// <summary>
        /// Start a new training game with a single player
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        public static GameManager OffChain(HexaPlayer player)
        {
            return new OffChainGame(new List<HexaPlayer>() { player });
        }

        /// <summary>
        /// Start a new game versus a bot
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        public static GameManager OffChain(List<HexaPlayer> players)
        {
            return new OffChainGame(players);
        }

        /// <summary>
        /// Start a new OnChain game
        /// </summary>
        /// <param name="substrateNetwork"></param>
        /// <param name="nodePlayers"></param>
        /// <returns></returns>
        public static GameManager OnChain(SubstrateNetwork substrateNetwork, List<Account> nodePlayers)
        {
            return new OnChainGame(nodePlayers, substrateNetwork);
        }

        protected abstract Task<uint> getBlockNumberAsync(CancellationToken token);

        /// <summary>
        /// Create a new game
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="players"></param>
        /// <param name="gridSize"></param>
        /// <returns></returns>
        public abstract Task<GameWorflowStatus> CreateGameAsync(GridSize gridSize, CancellationToken token);

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
        public abstract Task<GameWorflowStatus> ChooseAndPlaceAsync(byte playerIndex, int selectionIndex, (int, int) coords, CancellationToken token);

        /// <summary>
        /// Player upgrade a tile
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        public abstract Task<GameWorflowStatus> UpgradeAsync(byte playerIndex, (int, int) coords, CancellationToken token);

        /// <summary>
        /// Player finish his turn or win the game by call a late opponent
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="hexaGame"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        public abstract Task<GameWorflowStatus> FinishTurnAsync(byte playerIndex, CancellationToken token);
    }
}