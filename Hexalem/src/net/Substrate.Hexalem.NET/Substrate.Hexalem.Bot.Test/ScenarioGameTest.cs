using Substrate.Hexalem.Engine;
using Substrate.Hexalem.Game;
using Substrate.Hexalem.Game.Test;

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
            _gameManager.HexaGame.CurrentPlayer[RessourceType.Gold] = 10;
            _gameManager.HexaGame.CurrentPlayer[RessourceType.Humans] = 3;

            res = await _gameManager.UpgradeAsync(_gameManager.HexaGame.PlayerTurn, (0, 0), CancellationToken.None);
            Assert.That(res.IsSuccess, Is.True, res.Message);

            Assert.That(((HexaTile)_gameManager.HexaGame.CurrentPlayerBoard[0, 0]).TileLevel, Is.EqualTo(1));
        }
    }
}
