using Substrate.Hexalem.Engine;
using Substrate.Hexalem.Game;
using Substrate.Hexalem.Game.Test;
using Substrate.Integration;

namespace Substrate.Hexalem.Bot.Test
{
    public class ScenarioGameTest : IntegrationTest
    {
        private GameManager _gameManager;

        [Test]
        public async Task StandardGameStart_Training_ShouldSucceedAsync()
        {
            _gameManager = GameManager.OffChain(new HexaPlayer(new byte[32]));
            _ = await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

            // Player select the second tile
            var indexSelection = 1;
            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(0));

            await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, indexSelection, (-1, 1), CancellationToken.None);

            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);

            // Allways player 1 index
            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(0));

            await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 0, (0, 1), CancellationToken.None);

            // Selection is 4
            Assert.That(_gameManager.HexaGame.SelectBase, Is.EqualTo(4));

            await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);
        }

        [Test]
        [TestCase("offchain")]
        [TestCase("onchain", Ignore = "Todo debug Romain")]
        public async Task StandardGameStart_2v2_ShouldSucceedAsync(string mode)
        {
            _gameManager = gameManagerMultiPlayerFromType(mode);

            await _gameManager.CreateGameAsync(GridSize.Medium, CancellationToken.None);

            // Player select the second tile
            var indexSelection = 1;
            var selectedTileOffer = GameConfig.TILE_COSTS[_gameManager.HexaGame.UnboundTileOffers[indexSelection]];
            // Player coordinate move
            var coordinate = (1, 0);

            // Players should have 1 mana when start
            Assert.That(_gameManager.HexaGame.HexaTuples[0].player[RessourceType.Mana], Is.EqualTo(1));
            Assert.That(_gameManager.HexaGame.HexaTuples[1].player[RessourceType.Mana], Is.EqualTo(1));

            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(0));

            // Unbounded tiles should have normal rarity
            Assert.That(_gameManager.HexaGame.UnboundTileOffers.All(x => GameConfig.TILE_COSTS[x].TileToBuy.TileLevel == 0), Is.True);

            var res = await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, indexSelection, coordinate, CancellationToken.None);
            Assert.That(res.IsSuccess, Is.True, res.Message);

            // Player 1 should have now 0 mana
            Assert.That(_gameManager.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(0));

            // Now we should have selectedTile put in the correct coord
            Assert.That(_gameManager.HexaGame.CurrentPlayerBoard[coordinate.Item1, coordinate.Item2], Is.EqualTo((byte)selectedTileOffer.TileToBuy));

            Assert.That(_gameManager.HexaGame.SelectBase, Is.EqualTo(4));

            res = await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);
            Assert.That(res.IsSuccess, Is.True, res.Message);

            // Reward should have given 1 food (because of grass tile) and also 1 mana because of home starting tile
            Assert.That(_gameManager.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(1));

            // Need to find a solution for other ressources

            // Now it is Player 2 turn
            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(1));

            indexSelection = 2;
            selectedTileOffer = GameConfig.TILE_COSTS[_gameManager.HexaGame.UnboundTileOffers[indexSelection]];
            res = await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, indexSelection, coordinate, CancellationToken.None);
            Assert.That(res.IsSuccess, Is.True, res.Message);

            // Now we should have selectedTile put in the correct coord
            Assert.That(_gameManager.HexaGame.CurrentPlayerBoard[coordinate.Item1, coordinate.Item2], Is.EqualTo((byte)selectedTileOffer.TileToBuy));

            Assert.That(_gameManager.HexaGame.SelectBase, Is.EqualTo(4));

            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(0));
            res = await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);
            Assert.That(res.IsSuccess, Is.True, res.Message);

            // Player 2 finish his turn, next round
            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo(1));
            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo(0));

            // Now upgrade home
            Assert.That(((HexaTile)_gameManager.HexaGame.CurrentPlayerBoard[0, 0]).TileLevel, Is.EqualTo(0));

            //Affect ressources to allow upgrade (yeah I hack a bit...)
            _gameManager.HexaGame.CurrentPlayer[RessourceType.Gold] = 5;
            _gameManager.HexaGame.CurrentPlayer[RessourceType.Wood] = 5;
            _gameManager.HexaGame.CurrentPlayer[RessourceType.Stone] = 5;

            res = await _gameManager.UpgradeAsync(_gameManager.HexaGame.PlayerTurn, (0, 0), CancellationToken.None);
            Assert.That(res.IsSuccess, Is.True, res.Message);

            Assert.That(((HexaTile)_gameManager.HexaGame.CurrentPlayerBoard[0, 0]).TileLevel, Is.EqualTo(1));
        }

        [Test, Ignore("")]
        public async Task StartNewSubstrateGame_ThenPlay_ShouldSucceedAsync()
        {
            _gameManager = GameManager.OnChain(new SubstrateNetwork(_players.First(), Substrate.Integration.Helper.NetworkType.Live, _nodeUri), _players);

            var token = CancellationToken.None;

            Assert.That(_client.IsConnected, Is.EqualTo(false));

            Assert.That(_gameManager.HexaGame, Is.Null);

            // Create a new game, and wait for extrinsic
            GameWorflowStatus result = await _gameManager.CreateGameAsync(GridSize.Medium, token);

            Assert.That(result.IsSuccess, Is.True, result.Message);

            Assert.That(_gameManager.HexaGame.HexaTuples, Is.Not.Null);

            var aliceTiles = _gameManager.HexaGame.HexaTuples[0].board.Value.Select(x => (HexaTile)x);
            Assert.That(aliceTiles.Where(x => x.TileType == TileType.Empty).Count, Is.EqualTo(((int)GridSize.Medium) - 1));
            Assert.That(aliceTiles.Where(x => x.TileType == TileType.Home).Count, Is.EqualTo(1));

            var bobTiles = _gameManager.HexaGame.HexaTuples[1].board.Value.Select(x => (HexaTile)x);
            Assert.That(bobTiles.Where(x => x.TileType == TileType.Empty).Count, Is.EqualTo(((int)GridSize.Medium) - 1));
            Assert.That(bobTiles.Where(x => x.TileType == TileType.Home).Count, Is.EqualTo(1));

            // Alice start first
            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo((byte)0));

            // Alice has 1 mana
            Assert.That(_gameManager.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(1));
            result = await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 0, (0, 1), CancellationToken.None);
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(_gameManager.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(0));

            Assert.That(((HexaTile)_gameManager.HexaGame.CurrentPlayerBoard[0, 1]).IsEmpty(), Is.False);

            result = await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);
            Assert.That(result.IsSuccess, Is.True);

            // Now it is Bob's turn
            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo((byte)1));
            Assert.That(_gameManager.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(1));
            result = await _gameManager.ChooseAndPlaceAsync(_gameManager.HexaGame.PlayerTurn, 0, (0, 1), CancellationToken.None);
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(_gameManager.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(0));

            //var hexaGame = Substrate.Integration.Helper.HexalemWrapper.GetHexaGame(game, new BoardSharp[2] { aliceBoard, bobBoard });
            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo((byte)0));
            result = await _gameManager.FinishTurnAsync(_gameManager.HexaGame.PlayerTurn, CancellationToken.None);
            Assert.That(result.IsSuccess, Is.True);

            // Now it is Alice turn again, and we have a new round
            Assert.That(_gameManager.HexaGame.PlayerTurn, Is.EqualTo((byte)0));
            Assert.That(_gameManager.HexaGame.HexBoardRound, Is.EqualTo((byte)1));
        }
    }
}
