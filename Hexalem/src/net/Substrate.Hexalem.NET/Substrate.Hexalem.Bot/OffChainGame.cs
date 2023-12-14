using Serilog;
using Substrate.Hexalem.Engine;
using Substrate.NetApi.Model.Types.Base;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Game
{
    public class OffChainGame : GameManager
    {
        public override GameType GameType => throw new NotImplementedException();

        public OffChainGame(List<HexaPlayer> players) : base(players)
        {

        }

        protected override async Task<uint> getBlockNumberAsync(CancellationToken token)
        {
            // It is not a Pvp game, so let's return defaut value
            return default;
        }

        public override async Task<GameWorflowStatus> CreateGameAsync(GridSize gridSize, CancellationToken token)
        {
            var blockNumber = await getBlockNumberAsync(token);

            HexaGame = Engine.Game.CreateGame(blockNumber, _players, gridSize);

            return GameWorflowStatus.Success();
        }

        public override async Task<GameWorflowStatus> ChooseAndPlaceAsync(byte playerIndex, int selectionIndex, (int, int) coords, CancellationToken token)
        {
            var blockNumber = await getBlockNumberAsync(token);

            var res = Engine.Game.ChooseAndPlace(blockNumber, HexaGame, playerIndex, selectionIndex, coords);
            if (res == null)
            {
                return GameWorflowStatus.Fail("ChooseAndPlace fail");
            }

            HexaGame = res;
            return GameWorflowStatus.Success();
        }

        public override async Task<GameWorflowStatus> UpgradeAsync(byte playerIndex, (int, int) coords, CancellationToken token)
        {
            var blockNumber = await getBlockNumberAsync(token);

            var res = Engine.Game.Upgrade(blockNumber, HexaGame, playerIndex, coords);
            if (res == null)
            {
                return GameWorflowStatus.Fail("UpgradeAsync fail");
            }

            HexaGame = res;
            return GameWorflowStatus.Success();
        }

        public override async Task<GameWorflowStatus> FinishTurnAsync(byte playerIndex, CancellationToken token)
        {
            var blockNumber = await getBlockNumberAsync(token);

            var res = Engine.Game.FinishTurn(blockNumber, HexaGame, playerIndex);
            if(res == null)
            {
                return GameWorflowStatus.Fail("Finish turn fail");
            }

            HexaGame = res;

            return GameWorflowStatus.Success();
        }
    }
}
