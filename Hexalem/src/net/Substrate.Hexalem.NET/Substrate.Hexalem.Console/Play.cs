using Serilog;
using Substrate.Hexalem.NET;
using Substrate.Hexalem.NET.AI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Console
{
    public class Play
    {
        public List<AI> Bots { get; set; }

        public Play(List<AI> bots)
        {
            Bots = bots;
        }

        public GameResult StartGame()
        {
            GameResult? gameResult = null;

            Log.Information("Start a new game between AI [{aiFirstType}] and [{aiSecondType}]", Bots[0].AiName, Bots[1].AiName);
            List<HexaPlayer> hexaPlayers = InitializePlayers();

            var hexGame = Game.CreateGame(1, hexaPlayers, GridSize.Medium);

            bool isFinish = true;
            uint blockNumber = 1;
            do
            {
                Log.Information("[Turn {turnId}][Round {roundId}][Player {playerId} {aiType}] is currently playing...", hexGame.PlayerTurn, hexGame.HexBoardRound, hexGame.PlayerTurn, Bots[hexGame.PlayerTurn].AiName);

                while (hexGame.HexaTuples[hexGame.PlayerTurn].player[RessourceType.Mana] > 0)
                {
                    var move = Bots[hexGame.PlayerTurn].FindBestAction(hexGame, 0);

                    isFinish = !move.CanPlay;
                    if (!move.CanPlay)
                    {
                        gameResult = GameResult.TieGame();
                        break;
                    }

                    if(move.PlayTileAt is not null)
                    {
                        hexGame = Game.ChooseAndPlace(1, hexGame, hexGame.PlayerTurn, move.SelectionIndex!.Value, move.PlayTileAt!.Value);
                    } else if(move.UpgradeTileAt is not null)
                    {
                        hexGame = Game.Upgrade(1, hexGame, hexGame.PlayerTurn, move.UpgradeTileAt.Value);
                    }
                }

                Log.Warning("Player {num} has no mana and can not play anymore", hexGame.PlayerTurn);
                hexGame = Game.FinishTurn(blockNumber, hexGame, hexGame.PlayerTurn);
                
                isFinish = isFinish || hexGame.IsGameWon();
                gameResult = GameResult.PlayerWinByReachingWinCondition(hexaPlayers[hexGame.PlayerTurn]);

                blockNumber++;
            } while (!isFinish);

            return gameResult;
        }

        private static List<HexaPlayer> InitializePlayers()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) };

            foreach (var hexaPlayer in hexaPlayers)
            {
                hexaPlayer.AddWinCondition(AI.ChooseWinningCondition());
            }

            return hexaPlayers;
        }
    }
}
