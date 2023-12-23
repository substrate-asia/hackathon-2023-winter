//using Substrate.Hexalem.Engine;
//using Substrate.Hexalem.Game;

//namespace Substrate.Hexalem.Test
//{
//    public class GameTest
//    {
//        private readonly int _player1_Index = 0;
//        private readonly int _player2_Index = 1;

//        private GameManager _gameManager;

//        [SetUp]
//        public void Setup()
//        {
//        }

//        [Test]
//        public async Task RenewSelection_ShouldHaveRandomGenerationAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            _ = await _gameManager.CreateGameAsync(GridSize.Medium,CancellationToken.None);
            
//            List<List<HexaTile>> hexaTiles = new List<List<HexaTile>>
//            {
//                _gameManager.HexaGame.RenewSelection(10, 10),
//                _gameManager.HexaGame.RenewSelection(10, 10),
//                _gameManager.HexaGame.RenewSelection(10, 10),
//                _gameManager.HexaGame.RenewSelection(10, 10),
//                _gameManager.HexaGame.RenewSelection(10, 10)
//            };

//            Assert.IsFalse(hexaTiles.All(x => x.SequenceEqual(hexaTiles.First())));
//        }

//        [Test]
//        public async Task StartInitialize_ShouldHaveValidSetupAsync()
//        {
//            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) };
//            _gameManager = GameManager.OffChain(hexaPlayers);

//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.HexBoardState, Is.EqualTo(HexBoardState.Running), "Initial state should be 'Running'.");

//            Assert.That(_gameManager.HexaGame, Is.Not.Null);
//            Assert.That(_gameManager.HexaGame.HexBoardState, Is.EqualTo(HexBoardState.Running), "Initial state should be 'Running'.");
//            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(0), "Initial round should be 0.");
//            Assert.That(_gameManager.HexaGame.PlayersCount, Is.EqualTo(2), "Initial player count should be 2.");
//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(0), "Initial player turn should be 0.");

//            Assert.That(_gameManager.HexaGame.HexaTuples.Count, Is.EqualTo(2));

//            Assert.That(_gameManager.HexaGame.HexaTuples[0].player[RessourceType.Mana], Is.EqualTo(GameConfig.DEFAULT_MANA));
//            Assert.That(_gameManager.HexaGame.HexaTuples[0].player[RessourceType.Humans], Is.EqualTo(GameConfig.DEFAULT_HUMANS));
//            Assert.That(_gameManager.HexaGame.HexaTuples[0].player[RessourceType.Water], Is.EqualTo(GameConfig.DEFAULT_WATER));
//            Assert.That(_gameManager.HexaGame.HexaTuples[0].player[RessourceType.Food], Is.EqualTo(GameConfig.DEFAULT_FOOD));
//            Assert.That(_gameManager.HexaGame.HexaTuples[0].player[RessourceType.Wood], Is.EqualTo(GameConfig.DEFAULT_WOOD));
//            Assert.That(_gameManager.HexaGame.HexaTuples[0].player[RessourceType.Stone], Is.EqualTo(GameConfig.DEFAULT_STONE));
//            Assert.That(_gameManager.HexaGame.HexaTuples[0].player[RessourceType.Gold], Is.EqualTo(GameConfig.DEFAULT_GOLD));
//        }

//        [Test]
//        public async Task GameWrongPlayerTryToPlay_ShouldNotSuceedAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            // Player index = 1 => Player 2
//            Assert.That(_gameManager.HexaGame.ChooseAndPlace(1, 1, (-2, -2)), Is.False);
//        }

//        [Test]
//        public async Task Game_WhenPlayOnInvalidCoordinate_ShouldNotSucceedAsync()
//        {
//            var hexaPlayer = new HexaPlayer(new byte[32]);
//            _gameManager = GameManager.OffChain(hexaPlayer);
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            // make sure to set ressources
//            hexaPlayer[RessourceType.Mana] = 1;
//            hexaPlayer[RessourceType.Gold] = 1;

//            Assert.That((await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 1, (-3, -3), CancellationToken.None)).IsSuccess, Is.False);

//            Assert.That(hexaPlayer[RessourceType.Mana], Is.EqualTo(1));
//            Assert.That(hexaPlayer[RessourceType.Gold], Is.EqualTo(1));
//        }

//        [Test]
//        public async Task Game_WhenPlayOnNotAdjectingCoordinate_ShouldNotSucceedAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            Assert.That((await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 1, (-2, -2), CancellationToken.None)).IsSuccess, Is.False);
//        }

//        [Test]
//        public async Task Game_WhenPlayOnAdjectingCoordinate_ShouldSucceedAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.HexaTuples[0].board.CanPlace((1, 0)), Is.True);

//            Assert.That((await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 1, (1, 0), CancellationToken.None)).IsSuccess, Is.True);
//        }

//        [Test]
//        public async Task Game_WhenPlayOnAlreadyFilledTile_ShouldNotSucceedAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

//            Assert.That((await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 1, (0, -1), CancellationToken.None)).IsSuccess, Is.True);

//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            // It is just a one player game, so it is always Player 1 turn
//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

//            var res = await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 0, (0, -1), CancellationToken.None);
//            Assert.That(res.IsSuccess, Is.False);
//        }

//        [Test]
//        public async Task Game_WhenPlayedATile_ShouldSucceedButNoMoreManaAsync()
//        {
//            var player = new HexaPlayer(new byte[32]);
//            _gameManager = GameManager.OffChain(player);
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

//            // make sure to set ressources
//            player[RessourceType.Mana] = 1;
//            player[RessourceType.Gold] = 1;

//            Assert.That((await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 1, (0, -1), CancellationToken.None)).IsSuccess, Is.True);

//            Assert.That(player[RessourceType.Mana], Is.EqualTo(0));
//            Assert.That(player[RessourceType.Gold], Is.EqualTo(1));

//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(_player1_Index));

//            // Can't play anymore because no more mana
//            Assert.That((await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 0, (1, 0), CancellationToken.None)).IsSuccess, Is.False);

//            // Make sure no tile got placed
//            Assert.That(_gameManager.HexaGame.CurrentPlayerBoard[1, 0], Is.EqualTo(0x00));

//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            Assert.That(player[RessourceType.Mana], Is.EqualTo(1));
//        }

//        [Test]
//        public async Task Game_EveryRound_ShouldHaveFreeManaAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.HexaTuples.First().player[RessourceType.Mana], Is.EqualTo(1));
//            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(0));

//            // When a solo player finish a turn, it also finish a round
//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(1));
//            Assert.That(_gameManager.HexaGame.HexaTuples.First().player[RessourceType.Mana], Is.EqualTo(2));

//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(2));
//            Assert.That(_gameManager.HexaGame.HexaTuples.First().player[RessourceType.Mana], Is.EqualTo(3));
//        }

//        [Test]
//        public async Task Game_With3Players_ShouldHaveValidTurnsAndRoundsAsync()
//        {
//            var hexaPlayers = new List<HexaPlayer>() {
//                new HexaPlayer(new byte[32]),
//                new HexaPlayer(new byte[32]),
//                new HexaPlayer(new byte[32])
//            };

//            _gameManager = GameManager.OffChain(hexaPlayers);
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(0));
//            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(0));

//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(1));
//            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(0));

//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(2));
//            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(0));

//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(0));
//            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(1));
//        }

//        [Test]
//        public async Task UpgradeTile_WithEnoughtRessources_ShouldSucceedAsync()
//        {
//            var playerRessources = new byte[8] { 25, 25, 25, 25, 25, 25, 35, 0 };
//            (int q, int r) coords = (0, 0); // Only Home can be upgraded at the moment

//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            // Set ressources
//            _gameManager.HexaGame.HexaTuples.First().player.Value = playerRessources;

//            await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 0, (coords.q, coords.r), CancellationToken.None);

//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            var standardTile = (HexaTile)_gameManager.HexaGame!.HexaTuples.First().board[coords.q, coords.r];
//            Assert.That(standardTile.TileLevel, Is.EqualTo(0));

//            // Now let's upgrade the tile
//            await _gameManager.UpgradeAsync(_gameManager.HexaGame.PlayerTurn, (coords.q, coords.r), CancellationToken.None);

//            var rareTile = (HexaTile)_gameManager.HexaGame!.HexaTuples.First().board[coords.q, coords.r];
//            Assert.That(rareTile.TileLevel, Is.EqualTo(1));

//            await _gameManager.UpgradeAsync(_gameManager.HexaGame.PlayerTurn, (coords.q, coords.r), CancellationToken.None);
//            var epicTile = (HexaTile)_gameManager.HexaGame!.HexaTuples.First().board[coords.q, coords.r];
//            Assert.That(epicTile.TileLevel, Is.EqualTo(2));

//            //hexaGame = Game.Upgrade(_defaultBlockStart + 4, hexaGame, hexaGame.PlayerTurn, (coords.q, coords.r));
//            //var legendaryTile = (HexaTile)hexaGame!.HexaTuples.First().board[coords.q, coords.r];
//            //Assert.That(legendaryTile.TileRarity, Is.EqualTo(TileRarity.Legendary));
//        }

//        [Test]
//        public async Task UpgradeTile_WithNotEnoughRessources_ShouldFailAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 0, (-2, -2), CancellationToken.None);
//            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

//            var res = await _gameManager.UpgradeAsync(_gameManager.HexaGame.PlayerTurn, (-2, -2), CancellationToken.None);
//            Assert.That(res.IsSuccess, Is.False);
//        }

//        [Test]
//        public async Task UpgradeTile_WithEmptyTile_ShouldFailAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            var res = await _gameManager.UpgradeAsync(_gameManager.HexaGame.PlayerTurn, (-2, -2), CancellationToken.None);
//            Assert.That(res.IsSuccess, Is.False);
//        }

//        [Test]
//        public async Task RewardsMana_ShouldBeValidAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            var tuple = _gameManager.HexaGame.HexaTuples[_gameManager.HexaGame.PlayerTurn];

//            // One mana from home and not enough human to have more
//            Assert.That(HexaGame.Evaluate(RessourceType.Mana, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

//            // Now add 2 more humans
//            tuple.player[RessourceType.Humans] = 3;

//            // One mana from home and one mana from 3 humans
//            Assert.That(HexaGame.Evaluate(RessourceType.Mana, tuple.player, tuple.board.Stats()), Is.EqualTo(2));

//            // Add rarity to home tile should not increase mana rewards
//            var homeTile = (HexaTile)tuple.board[12];

//            // Ensure we are on home tile
//            Assert.That(homeTile.TileType, Is.EqualTo(TileType.Home));
//            homeTile.TileLevel = 2;

//            // Same rewards as before
//            Assert.That(HexaGame.Evaluate(RessourceType.Mana, tuple.player, tuple.board.Stats()), Is.EqualTo(2));
//        }

//        [Test]
//        public async Task RewardsHuman_ShouldBeValidAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            var tuple = _gameManager.HexaGame.HexaTuples[_gameManager.HexaGame.PlayerTurn];

//            // One human for home when not upgrade
//            Assert.That(HexaGame.Evaluate(RessourceType.Humans, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

//            // Add rarity to home tile to increase human rewards
//            var homeTile = (HexaTile)tuple.board[12];
//            Assert.That(homeTile.TileType, Is.EqualTo(TileType.Home));

//            homeTile.TileLevel = 2;
//            tuple.board[12] = homeTile;

//            // Add ressources humans need
//            tuple.player[RessourceType.Water] = 10;
//            tuple.player[RessourceType.Food] = 10;

//            Assert.That(HexaGame.Evaluate(RessourceType.Humans, tuple.player, tuple.board.Stats()), Is.EqualTo(5));

//            // But if I have not enough water for human
//            tuple.player[RessourceType.Water] = 4;

//            Assert.That(HexaGame.Evaluate(RessourceType.Humans, tuple.player, tuple.board.Stats()), Is.EqualTo(2));
//        }

//        [Test]
//        public async Task RewardsWater_ShouldBeValidAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            var tuple = _gameManager.HexaGame.HexaTuples[_gameManager.HexaGame.PlayerTurn];
//            tuple.board[4] = new HexaTile(TileType.Water, 0, TilePattern.Normal);
//            tuple.board[5] = new HexaTile(TileType.Water, 0, TilePattern.Normal);

//            // Water reward is equal to nb water tiles on the field
//            Assert.That(HexaGame.Evaluate(RessourceType.Water, tuple.player, tuple.board.Stats()), Is.EqualTo(2));
//        }

//        [Test]
//        public async Task RewardsFood_ShouldBeValidAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            var tuple = _gameManager.HexaGame.HexaTuples[_gameManager.HexaGame.PlayerTurn];
//            tuple.board[4] = new HexaTile(TileType.Grass, 0, TilePattern.Normal);
//            tuple.board[5] = new HexaTile(TileType.Grass, 0, TilePattern.Normal);

//            // 2 grass field give 2 food
//            Assert.That(HexaGame.Evaluate(RessourceType.Food, tuple.player, tuple.board.Stats()), Is.EqualTo(2));

//            // 1 forest field give 0 food
//            tuple.board[6] = new HexaTile(TileType.Tree, 0, TilePattern.Normal);
//            Assert.That(HexaGame.Evaluate(RessourceType.Food, tuple.player, tuple.board.Stats()), Is.EqualTo(2));

//            // 2 forest field give 0 food
//            tuple.board[7] = new HexaTile(TileType.Tree, 0, TilePattern.Normal);
//            Assert.That(HexaGame.Evaluate(RessourceType.Food, tuple.player, tuple.board.Stats()), Is.EqualTo(3));
//        }

//        [Test]
//        public async Task RewardsWood_ShouldBeValidAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            var tuple = _gameManager.HexaGame.HexaTuples[_gameManager.HexaGame.PlayerTurn];

//            tuple.player[RessourceType.Humans] = 1;

//            // 0 forest and 1 human => no reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

//            tuple.board[4] = new HexaTile(TileType.Tree, 0, TilePattern.Normal);

//            // 1 forest and 1 human => no reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

//            tuple.player[RessourceType.Humans] = 2;

//            // 1 forest and 2 humans => 1 reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

//            tuple.player[RessourceType.Humans] = 4;

//            // 4 forest and 4 humans => 2 reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(2));

//            tuple.player[RessourceType.Humans] = 8;

//            // 1 forest and 6 humans => 1 reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Wood, tuple.player, tuple.board.Stats()), Is.EqualTo(3));
//        }

//        [Test]
//        public async Task RewardsStone_ShouldBeValidAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            var tuple = _gameManager.HexaGame.HexaTuples[_gameManager.HexaGame.PlayerTurn];

//            tuple.player[RessourceType.Humans] = 1;

//            // 0 moutain and 1 human => no reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

//            tuple.board[4] = new HexaTile(TileType.Mountain, 0, TilePattern.Normal);

//            // 1 moutain and 3 humans => no reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

//            tuple.player[RessourceType.Humans] = 4;

//            // 1 moutain and 4 humans => 1 reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

//            tuple.player[RessourceType.Humans] = 4;
//            tuple.board[5] = new HexaTile(TileType.Mountain, 0, TilePattern.Normal);
//            tuple.board[6] = new HexaTile(TileType.Mountain, 0, TilePattern.Normal);
//            tuple.board[7] = new HexaTile(TileType.Mountain, 0, TilePattern.Normal);

//            // 4 moutains and 4 humans => 1 reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

//            tuple.player[RessourceType.Humans] = 8;

//            // 4 moutain and 8 humans => 2 rewards
//            Assert.That(HexaGame.Evaluate(RessourceType.Stone, tuple.player, tuple.board.Stats()), Is.EqualTo(2));
//        }

//        [Test]
//        public async Task RewardsGold_ShouldBeValidAsync()
//        {
//            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
//            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

//            var tuple = _gameManager.HexaGame.HexaTuples[index: _gameManager.HexaGame.PlayerTurn];

//            tuple.player[RessourceType.Humans] = 1;

//            // 0 cave and 1 human => no reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

//            tuple.board[4] = new HexaTile(TileType.Cave, 0, TilePattern.Normal);
//            // 1 cave and 1 human => no reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(0));

//            tuple.player[RessourceType.Humans] = 3;
//            // 1 cave and 3 humans => 1 reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

//            tuple.player[RessourceType.Humans] = 4;
//            tuple.board[5] = new HexaTile(TileType.Cave, 0, TilePattern.Normal);
//            tuple.board[6] = new HexaTile(TileType.Cave, 0, TilePattern.Normal);
//            // 3 cave and 4 humans => 1 reward
//            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(1));

//            tuple.player[RessourceType.Humans] = 10;
//            tuple.board[7] = new HexaTile(TileType.Cave, 0, TilePattern.Normal);
//            // 4 and 10 humans => 3 rewards
//            Assert.That(HexaGame.Evaluate(RessourceType.Gold, tuple.player, tuple.board.Stats()), Is.EqualTo(3));
//        }
//    }
//}