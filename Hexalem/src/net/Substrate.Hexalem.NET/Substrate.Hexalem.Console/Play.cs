using Serilog;
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
        public List<IThinking> Bots { get; set; }

        public Play(List<IThinking> bots)
        {
            Bots = bots;
        }

        public void StartGame()
        {
            Log.Information("Start a new game between AI [{aiFirstType}] and [{aiSecondType}]", Bots[0].AiName, Bots[1].AiName);
            List<HexaPlayer> hexaPlayers = InitializePlayers();

            var hexGame = Game.CreateGame(1, hexaPlayers, GridSize.Medium);

            bool isFinish = true;
            uint blockNumber = 1;
            do
            {
                Log.Information("[Turn {turnId}][Round {roundId}] Player {playerId} is currently playing...", hexGame.HexBoardTurn, hexGame.HexBoardRound, hexGame.PlayerTurn);

                while (hexGame.HexaTuples[hexGame.PlayerTurn].player[RessourceType.Mana] > 0)
                {
                    var move = Bots[hexGame.PlayerTurn].FindBestAction(hexGame, 0);

                    isFinish = !move.CanPlay;
                    if (!move.CanPlay)
                        break;

                    hexGame = Game.ChooseAndPlace(1, hexGame, hexGame.PlayerTurn, move.SelectionIndex!.Value, move.Coords!.Value);
                }

                Log.Warning("Player {num} has no mana and can not play anymore", hexGame.PlayerTurn);
                Game.FinishTurn(blockNumber, hexGame, hexGame.PlayerTurn);
                blockNumber++;
            } while (!isFinish);
        }

        private static List<HexaPlayer> InitializePlayers()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) };

            foreach (var hexaPlayer in hexaPlayers)
            {
                hexaPlayer.AddWinCondition(IThinking.ChooseWinningCondition());
            }

            return hexaPlayers;
        }
    }
}
