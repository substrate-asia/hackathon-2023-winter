using Newtonsoft.Json.Linq;
using StreamJsonRpc.Protocol;
using Substrate.Hexalem.NET;
using Substrate.NetApi.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Test
{
    public class GameTest
    {
        private HexaBoard _hexGridMedium_Player1;
        private HexaPlayer _hexPlayer_Player1;
        private readonly int _player1_Index = 0;

        private HexaBoard _hexGridMedium_Player2;
        private HexaPlayer _hexPlayer_Player2;
        private readonly int _player2_Index = 1;

        private byte[] _selectionGenerator;
        private uint _defaultBlockStart;

        [SetUp]
        public void Setup()
        {
            _hexGridMedium_Player1 = new HexaBoard(new byte[(int)GridSize.Medium]);
            _hexPlayer_Player1 = new HexaPlayer(new byte[32]);

            _hexGridMedium_Player2 = new HexaBoard(new byte[(int)GridSize.Medium]);
            _hexPlayer_Player2 = new HexaPlayer(new byte[32]);

            _selectionGenerator = new byte[GameConfig.NB_MAX_UNBOUNDED_TILES].Populate();

            _defaultBlockStart = 1;
        }

        [Test]
        public void StandardGameStart_2v2_ShouldSucceed()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            // Player select the second tile
            var indexSelection = 1;
            var selectedTile = hexaGame.UnboundTiles[indexSelection];
            // Player coordinate move
            var coordinate = (-2, -2);


            // Players should have 1 mana when start
            Assert.That(hexaGame.HexaTuples[_player1_Index].player[RessourceType.Mana], Is.EqualTo(1));
            Assert.That(hexaGame.HexaTuples[_player2_Index].player[RessourceType.Mana], Is.EqualTo(1));

            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            Game.ChooseAndPlace(_defaultBlockStart + 1, hexaGame, hexaGame.PlayerTurn, indexSelection, coordinate);

            // Player 1 should have now 0 mana 
            Assert.That(hexaGame.HexaTuples[hexaGame.PlayerTurn].player[RessourceType.Mana], Is.EqualTo(0));

            // Now we should have selectedTile put in the correct coord
            Assert.That(hexaGame.HexaTuples[hexaGame.PlayerTurn].board[coordinate.Item1, coordinate.Item2], Is.EqualTo((byte)selectedTile));

            Assert.That(hexaGame.SelectBase, Is.EqualTo(2));

            Game.FinishTurn(_defaultBlockStart + 2, hexaGame, hexaGame.PlayerTurn);

            // Reward should have given 1 food (because of grass tile) and also 1 mana because of home starting tile
            Assert.That(hexaGame.HexaTuples[hexaGame.PlayerTurn].player[RessourceType.Mana], Is.EqualTo(1));

            // Need to find a solution for other ressources

            // Now it is Player 2 turn
            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player2_Index));

            selectedTile = hexaGame.UnboundTiles[0];
             Game.ChooseAndPlace(_defaultBlockStart + 5, hexaGame, hexaGame.PlayerTurn, 0, coordinate);

            // Now we should have selectedTile put in the correct coord
            Assert.That(hexaGame.HexaTuples[hexaGame.PlayerTurn].board[coordinate.Item1, coordinate.Item2], Is.EqualTo((byte)selectedTile));

            // Selection is 4
            Assert.That(hexaGame.SelectBase, Is.EqualTo(4));

            Game.FinishTurn(_defaultBlockStart + 6, hexaGame, hexaGame.PlayerTurn);
        }

        [Test]
        public void StartInitialize_ShouldHaveValidSetup()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexaGame.HexBoardState, Is.EqualTo(HexBoardState.Running), "Initial state should be 'Running'.");

            Assert.That(hexaGame, Is.Not.Null);
            Assert.That(hexaGame.HexBoardState, Is.EqualTo(HexBoardState.Running), "Initial state should be 'Running'.");
            Assert.That(hexaGame.HexBoardRound, Is.EqualTo(0), "Initial round should be 0.");
            Assert.That(hexaGame.PlayersCount, Is.EqualTo(2), "Initial player count should be 2.");
            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(0), "Initial player turn should be 0.");

            Assert.That(hexaGame.HexaTuples.Count, Is.EqualTo(2));

            Assert.That(hexaGame.HexaTuples[0].player[RessourceType.Mana], Is.EqualTo(GameConfig.DEFAULT_MANA));
            Assert.That(hexaGame.HexaTuples[0].player[RessourceType.Humans], Is.EqualTo(GameConfig.DEFAULT_HUMANS));
            Assert.That(hexaGame.HexaTuples[0].player[RessourceType.Water], Is.EqualTo(GameConfig.DEFAULT_WATER));
            Assert.That(hexaGame.HexaTuples[0].player[RessourceType.Food], Is.EqualTo(GameConfig.DEFAULT_FOOD));
            Assert.That(hexaGame.HexaTuples[0].player[RessourceType.Wood], Is.EqualTo(GameConfig.DEFAULT_WOOD));
            Assert.That(hexaGame.HexaTuples[0].player[RessourceType.Stone], Is.EqualTo(GameConfig.DEFAULT_STONE));
            Assert.That(hexaGame.HexaTuples[0].player[RessourceType.Gold], Is.EqualTo(GameConfig.DEFAULT_GOLD));
        }

        

        [Test]
        public void GameWrongPlayerTryToPlay_ShouldNotSuceed()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            // Player index = 1 => Player 2
            Assert.That(hexaGame.ChooseAndPlace(1, 1, (-2, -2)), Is.False);

        }

        [Test]
        public void Game_WhenPlayOnInvalidCoordinate_ShouldNotSucceed()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 1, (-3, -3)), Is.False);

        }

        [Test]
        public void Game_WhenPlayOnAlreadyFilledTile_ShouldNotSucceed()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 1, (-1, -1)), Is.True);

            Game.FinishTurn(_defaultBlockStart + 2, hexaGame, hexaGame.PlayerTurn);

            // It is just a one player game, so it is always Player 1 turn
            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 0, (-1, -1)), Is.False);

        }
    }
}
