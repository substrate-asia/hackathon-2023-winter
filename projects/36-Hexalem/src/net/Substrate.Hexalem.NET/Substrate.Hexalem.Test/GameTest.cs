using Substrate.Hexalem.Engine;

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

            _selectionGenerator = new byte[GameConfig.NB_MAX_UNBOUNDED_TILES];

            _defaultBlockStart = 1;
        }

        [Test]
        public void RenewSelection_ShouldHaveRandomGeneration()
        {
            var hexaGame = Game.CreateGame(_defaultBlockStart, new List<HexaPlayer>() { new HexaPlayer(new byte[32]) }, GridSize.Medium);
            
            List<List<HexaTile>> hexaTiles = new List<List<HexaTile>>
            {
                hexaGame.RenewSelection(10, 10),
                hexaGame.RenewSelection(10, 10),
                hexaGame.RenewSelection(10, 10),
                hexaGame.RenewSelection(10, 10),
                hexaGame.RenewSelection(10, 10)
            };

            Assert.IsFalse(hexaTiles.All(x => x.SequenceEqual(hexaTiles.First())));
        }

        [Test]
        public void StandardGameStart_Training_ShouldSucceed()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            // Player select the second tile
            var indexSelection = 1;
            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            hexaGame = Game.ChooseAndPlace(_defaultBlockStart, hexaGame, hexaGame.PlayerTurn, indexSelection, (-1, 1));

            Game.FinishTurn(_defaultBlockStart, hexaGame, hexaGame.PlayerTurn);

            // Allways player 1 index
            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            hexaGame = Game.ChooseAndPlace(_defaultBlockStart, hexaGame, hexaGame.PlayerTurn, 0, (0, 1));

            // Selection is 4
            Assert.That(hexaGame.SelectBase, Is.EqualTo(4));

            Game.FinishTurn(_defaultBlockStart, hexaGame, hexaGame.PlayerTurn);

            // Export game state
            var boardHex = hexaGame.Export();
            var importedGame = HexaGame.Import(boardHex);
            Assert.That(hexaGame.IsSame(importedGame), Is.True);
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

            // make sure to set ressources
            hexaPlayers[0][RessourceType.Mana] = 1;
            hexaPlayers[0][RessourceType.Gold] = 1;

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 1, (-3, -3)), Is.False);

            Assert.That(hexaPlayers[0][RessourceType.Mana], Is.EqualTo(1));
            Assert.That(hexaPlayers[0][RessourceType.Gold], Is.EqualTo(1));
        }

        [Test]
        public void Game_WhenPlayOnNotAdjectingCoordinate_ShouldNotSucceed()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 1, (-2, -2)), Is.False);
        }

        [Test]
        public void Game_WhenPlayOnAdjectingCoordinate_ShouldSucceed()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexaGame.HexaTuples[0].board.CanPlace((1, 0)), Is.True);

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 1, (1, 0)), Is.True);
        }

        [Test]
        public void Game_WhenPlayOnAlreadyFilledTile_ShouldNotSucceed()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 1, (0, -1)), Is.True);

            Game.FinishTurn(_defaultBlockStart + 2, hexaGame, hexaGame.PlayerTurn);

            // It is just a one player game, so it is always Player 1 turn
            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 0, (0, -1)), Is.False);
        }

        [Test]
        public void Game_WhenPlayedATile_ShouldSucceedButNoMoreMana()
        {
            // testing all checks before changing the states

            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            // make sure to set ressources
            hexaPlayers[0][RessourceType.Mana] = 1;
            hexaPlayers[0][RessourceType.Gold] = 1;

            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 1, (0, -1)), Is.True);

            Assert.That(hexaPlayers[0][RessourceType.Mana], Is.EqualTo(0));
            Assert.That(hexaPlayers[0][RessourceType.Gold], Is.EqualTo(1));

            Assert.That(hexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

            // Can't play anymore because no more mana
            Assert.That(hexaGame.ChooseAndPlace(hexaGame.PlayerTurn, 0, (1, 0)), Is.False);

            // Make sure no tile got placed
            Assert.That(hexaGame.HexaTuples[hexaGame.PlayerTurn].board[1, 0], Is.EqualTo(0x00));

            Game.FinishTurn(_defaultBlockStart + 2, hexaGame, hexaGame.PlayerTurn);

            Assert.That(hexaPlayers[0][RessourceType.Mana], Is.EqualTo(1));
        }

        [Test]
        public void Game_EveryRound_ShouldHaveFreeMana()
        {
            var hexaPlayers = new List<HexaPlayer>() {
                new HexaPlayer(new byte[32])
            };

            var hexGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexGame.HexaTuples.First().player[RessourceType.Mana], Is.EqualTo(1));
            Assert.That(hexGame.HexBoardRound, Is.EqualTo(0));

            // When a solo player finish a turn, it also finish a round
            Game.FinishTurn(1, hexGame, hexGame.PlayerTurn);

            Assert.That(hexGame.HexBoardRound, Is.EqualTo(1));
            Assert.That(hexGame.HexaTuples.First().player[RessourceType.Mana], Is.EqualTo(2));

            Game.FinishTurn(1, hexGame, hexGame.PlayerTurn);

            Assert.That(hexGame.HexBoardRound, Is.EqualTo(2));
            Assert.That(hexGame.HexaTuples.First().player[RessourceType.Mana], Is.EqualTo(3));
        }

        [Test]
        public void Game_With3Players_ShouldHaveValidTurnsAndRounds()
        {
            var hexaPlayers = new List<HexaPlayer>() {
                new HexaPlayer(new byte[32]),
                new HexaPlayer(new byte[32]),
                new HexaPlayer(new byte[32])
            };

            var hexGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Assert.That(hexGame.PlayerTurn, Is.EqualTo(0));
            Assert.That(hexGame.HexBoardRound, Is.EqualTo(0));

            Game.FinishTurn(1, hexGame, hexGame.PlayerTurn);

            Assert.That(hexGame.PlayerTurn, Is.EqualTo(1));
            Assert.That(hexGame.HexBoardRound, Is.EqualTo(0));

            Game.FinishTurn(2, hexGame, hexGame.PlayerTurn);

            Assert.That(hexGame.PlayerTurn, Is.EqualTo(2));
            Assert.That(hexGame.HexBoardRound, Is.EqualTo(0));

            Game.FinishTurn(3, hexGame, hexGame.PlayerTurn);

            Assert.That(hexGame.PlayerTurn, Is.EqualTo(0));
            Assert.That(hexGame.HexBoardRound, Is.EqualTo(1));
        }

        [Test]
        public void UpgradeTile_WithEnoughtRessources_ShouldSucceed()
        {
            var playerRessources = new byte[10] { 25, 25, 25, 25, 25, 25, 35, 0 , 0, 0};
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };
            (int q, int r) coords = (0, 0); // Only Home can be upgraded at the moment

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            // Set ressources
            hexaGame.HexaTuples.First().player.Value = playerRessources;

            Game.ChooseAndPlace(_defaultBlockStart + 1, hexaGame, hexaGame.PlayerTurn, 0, (coords.q, coords.r));
            Game.FinishTurn(2, hexaGame, hexaGame.PlayerTurn);

            var standardTile = (HexaTile)hexaGame!.HexaTuples.First().board[coords.q, coords.r];
            Assert.That(standardTile.TileLevel, Is.EqualTo(0));

            // Now let's upgrade the tile
            hexaGame = Game.Upgrade(_defaultBlockStart + 2, hexaGame, hexaGame.PlayerTurn, (coords.q, coords.r));

            var rareTile = (HexaTile)hexaGame!.HexaTuples.First().board[coords.q, coords.r];
            Assert.That(rareTile.TileLevel, Is.EqualTo(1));

            hexaGame = Game.Upgrade(_defaultBlockStart + 3, hexaGame, hexaGame.PlayerTurn, (coords.q, coords.r));
            var epicTile = (HexaTile)hexaGame!.HexaTuples.First().board[coords.q, coords.r];
            Assert.That(epicTile.TileLevel, Is.EqualTo(2));

            //hexaGame = Game.Upgrade(_defaultBlockStart + 4, hexaGame, hexaGame.PlayerTurn, (coords.q, coords.r));
            //var legendaryTile = (HexaTile)hexaGame!.HexaTuples.First().board[coords.q, coords.r];
            //Assert.That(legendaryTile.TileRarity, Is.EqualTo(TileRarity.Legendary));
        }

        [Test]
        public void UpgradeTile_WithNotEnoughRessources_ShouldFail()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            Game.ChooseAndPlace(_defaultBlockStart + 1, hexaGame, hexaGame.PlayerTurn, 0, (-2, -2));
            Game.FinishTurn(2, hexaGame, hexaGame.PlayerTurn);

            var res = Game.Upgrade(_defaultBlockStart + 2, hexaGame, hexaGame.PlayerTurn, (-2, -2));
            Assert.That(res, Is.Null);
        }

        [Test]
        public void UpgradeTile_WithEmptyTile_ShouldFail()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            var res = Game.Upgrade(_defaultBlockStart + 2, hexaGame, hexaGame.PlayerTurn, (-2, -2));
            Assert.That(res, Is.Null);
        }

        [Test]
        public void RewardsMana_ShouldBeValid()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            var tuple = hexaGame.HexaTuples[hexaGame.PlayerTurn];

            // One mana from home and not enough human to have more
            Assert.That(HexaGame.Evaluate(RessourceType.Mana, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

            // Now add 2 more humans
            tuple.player[RessourceType.Humans] = 3;

            // One mana from home and one mana from 3 humans
            Assert.That(HexaGame.Evaluate(RessourceType.Mana, tuple.player, tuple.board.Stats()), Is.EqualTo(2));

            // Add rarity to home tile should not increase mana rewards
            var homeTile = (HexaTile)tuple.board[12];

            // Ensure we are on home tile
            Assert.That(homeTile.TileType, Is.EqualTo(TileType.Home));
            homeTile.TileLevel = 2;

            // Same rewards as before
            Assert.That(HexaGame.Evaluate(RessourceType.Mana, tuple.player, tuple.board.Stats()), Is.EqualTo(2));
        }

        [Test]
        public void RewardsHuman_ShouldBeValid()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            var tuple = hexaGame.HexaTuples[hexaGame.PlayerTurn];

            // One human for home when not upgrade
            Assert.That(HexaGame.Evaluate(RessourceType.Humans, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

            // Add rarity to home tile to increase human rewards
            var homeTile = (HexaTile)tuple.board[12];
            Assert.That(homeTile.TileType, Is.EqualTo(TileType.Home));

            homeTile.TileLevel = 2;
            tuple.board[12] = homeTile;

            // Add ressources humans need
            tuple.player[RessourceType.Water] = 10;
            tuple.player[RessourceType.Food] = 10;

            Assert.That(HexaGame.Evaluate(RessourceType.Humans, tuple.player, tuple.board.Stats()), Is.EqualTo(9));

            // But if I have not enough water for human
            tuple.player[RessourceType.Water] = 4;

            Assert.That(HexaGame.Evaluate(RessourceType.Humans, tuple.player, tuple.board.Stats()), Is.EqualTo(8));
        }

        [Test]
        public void RewardsWater_ShouldBeValid()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            var tuple = hexaGame.HexaTuples[hexaGame.PlayerTurn];
            tuple.board[4] = new HexaTile(TileType.Water, 0, TilePattern.Normal);
            tuple.board[5] = new HexaTile(TileType.Water, 0, TilePattern.Normal);

            // Water reward is equal to nb water tiles on the field
            Assert.That(HexaGame.Evaluate(RessourceType.Water, tuple.player, tuple.board.Stats()), Is.EqualTo(4));
        }

        [Test]
        public void RewardsFood_ShouldBeValid()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            var tuple = hexaGame.HexaTuples[hexaGame.PlayerTurn];
            tuple.board[4] = new HexaTile(TileType.Grass, 0, TilePattern.Normal);
            tuple.board[5] = new HexaTile(TileType.Grass, 0, TilePattern.Normal);

            // 2 grass field give 2 food
            Assert.That(HexaGame.Evaluate(RessourceType.Food, tuple.player, tuple.board.Stats()), Is.EqualTo(4));

            // 1 forest field give 0 food
            tuple.board[6] = new HexaTile(TileType.Tree, 0, TilePattern.Normal);
            Assert.That(HexaGame.Evaluate(RessourceType.Food, tuple.player, tuple.board.Stats()), Is.EqualTo(5));

            // 2 forest field give 0 food
            tuple.board[7] = new HexaTile(TileType.Tree, 0, TilePattern.Normal);
            Assert.That(HexaGame.Evaluate(RessourceType.Food, tuple.player, tuple.board.Stats()), Is.EqualTo(6));
        }

        [Test]
        public void RewardsWood_ShouldBeValid()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            var tuple = hexaGame.HexaTuples[hexaGame.PlayerTurn];

            tuple.player[RessourceType.Humans] = 1;

            // 0 forest and 1 human => no reward
            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

            tuple.board[4] = new HexaTile(TileType.Tree, 0, TilePattern.Normal);

            // 1 forest and 1 human => no reward
            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

            tuple.player[RessourceType.Humans] = 2;

            // 1 forest and 2 humans => 1 reward
            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

            tuple.player[RessourceType.Humans] = 4;

            // 4 forest and 4 humans => 2 reward
            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(2));

            tuple.player[RessourceType.Humans] = 8;

            // 1 forest and 6 humans => 1 reward
            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(3));
        }

        [Test]
        public void RewardsStone_ShouldBeValid()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            var tuple = hexaGame.HexaTuples[hexaGame.PlayerTurn];

            tuple.player[RessourceType.Humans] = 1;

            // 0 moutain and 1 human => no reward
            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

            tuple.board[4] = new HexaTile(TileType.Mountain, 0, TilePattern.Normal);

            // 1 moutain and 3 humans => no reward
            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

            tuple.player[RessourceType.Humans] = 4;

            // 1 moutain and 4 humans => 1 reward
            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

            tuple.player[RessourceType.Humans] = 4;
            tuple.board[5] = new HexaTile(TileType.Mountain, 0, TilePattern.Normal);
            tuple.board[6] = new HexaTile(TileType.Mountain, 0, TilePattern.Normal);
            tuple.board[7] = new HexaTile(TileType.Mountain, 0, TilePattern.Normal);

            // 4 moutains and 4 humans => 1 reward
            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

            tuple.player[RessourceType.Humans] = 8;

            // 4 moutain and 8 humans => 2 rewards
            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(2));
        }

        [Test]
        public void RewardsGold_ShouldBeValid()
        {
            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]) };

            var hexaGame = Game.CreateGame(_defaultBlockStart, hexaPlayers, GridSize.Medium);

            var tuple = hexaGame.HexaTuples[hexaGame.PlayerTurn];

            tuple.player[RessourceType.Humans] = 1;

            // 0 cave and 1 human => no reward
            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

            tuple.board[4] = new HexaTile(TileType.Cave, 0, TilePattern.Normal);
            // 1 cave and 1 human => no reward
            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

            tuple.player[RessourceType.Humans] = 3;
            // 1 cave and 3 humans => 1 reward
            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

            tuple.player[RessourceType.Humans] = 4;
            tuple.board[5] = new HexaTile(TileType.Cave, 0, TilePattern.Normal);
            tuple.board[6] = new HexaTile(TileType.Cave, 0, TilePattern.Normal);
            // 3 cave and 4 humans => 1 reward
            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

            tuple.player[RessourceType.Humans] = 10;
            tuple.board[7] = new HexaTile(TileType.Cave, 0, TilePattern.Normal);
            // 4 and 10 humans => 3 rewards
            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(3));
        }
    }
}