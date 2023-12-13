using Serilog;
using Substrate.Hexalem.Game;
using Substrate.Hexalem.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Console
{
    public class Play
    {
        public List<Strategy> Bots { get; set; }
        private GameManager _game { get; set; }
        private List<HexaPlayer> hexaPlayers;

        public Play(List<Strategy> bots)
        {
            Bots = bots;
            hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) };
            _game = GameManager.OffChain(hexaPlayers);
        }

        public async Task<GameResult> StartGameAsync(CancellationToken token)
        {
            GameResult? gameResult = null;

            Log.Information("Start a new game between AI [{aiFirstType}] and [{aiSecondType}]", Bots[0].AiName, Bots[1].AiName);
            List<HexaPlayer> hexaPlayers = InitializePlayers();

            await _game.CreateGameAsync(GridSize.Medium, token);

            bool isFinish = true;
            uint blockNumber = 1;
            do
            {
                Log.Information("[Turn {turnId}][Round {roundId}][Player {playerId} {aiType}] is currently playing...", _game.HexaGame.PlayerTurn, _game.HexaGame.HexBoardRound, _game.HexaGame.PlayerTurn, Bots[_game.HexaGame.PlayerTurn].AiName);

                while (_game.HexaGame.HexaTuples[_game.HexaGame.PlayerTurn].player[RessourceType.Mana] > 0)
                {
                    var move = Bots[_game.HexaGame.PlayerTurn].FindBestAction(_game.HexaGame, 0);

                    isFinish = !move.CanPlay;
                    if (!move.CanPlay)
                    {
                        gameResult = GameResult.TieGame();
                        break;
                    }

                    if(move.PlayTileAt is not null)
                    {
                        await _game.ChooseAndPlaceAsync(_game.HexaGame.PlayerTurn, move.SelectionIndex!.Value, move.PlayTileAt!.Value, token);
                    } else if(move.UpgradeTileAt is not null)
                    {
                        await _game.UpgradeAsync(_game.HexaGame.PlayerTurn, move.UpgradeTileAt.Value, token);
                    }
                }

                Log.Warning("Player {num} has no mana and can not play anymore", _game.HexaGame.PlayerTurn);
                await _game.FinishTurnAsync(_game.HexaGame.PlayerTurn, token);
                
                isFinish = isFinish || _game.HexaGame.IsFinished();
                gameResult = GameResult.PlayerWinByReachingWinCondition(hexaPlayers[_game.HexaGame.PlayerTurn]);

                blockNumber++;
            } while (!isFinish);

            return gameResult;
        }

        private List<HexaPlayer> InitializePlayers()
        {
            foreach (var hexaPlayer in hexaPlayers)
            {
                hexaPlayer.TargetGoal = Strategy.ChooseWinningCondition();
            }

            return hexaPlayers;
        }
    }
}
