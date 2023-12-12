using Newtonsoft.Json.Linq;
using Schnorrkel.Keys;

using Substrate.Hexalem.Integration.Model;
using Substrate.Integration;
using Substrate.Integration.Client;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Substrate.NetApi.Model.Types.Primitive;
using Substrate.Hexalem.Game;
using Substrate.Hexalem.Game.Test;

namespace Substrate.Hexalem.Integration.Test
{
    public class SubstrateGameTest : IntegrationTest
    {
        private GameManager _game;

        [Test]
        public async Task StartNewSubstrateGame_ThenPlay_ShouldSucceedAsync()
        {
            _game = GameManager.OnChain(new SubstrateNetwork(_players.First(), Substrate.Integration.Helper.NetworkType.Live, _nodeUri), _players);

            var token = CancellationToken.None;

            Assert.That(_client.IsConnected, Is.EqualTo(false));

            Assert.That(_game.HexaGame, Is.Null);

            // Create a new game, and wait for extrinsic
            GameWorflowStatus result = await _game.CreateGameAsync(GridSize.Medium, token);

            Assert.That(result.IsSuccess, Is.True, result.Message);

            Assert.That(_game.HexaGame.HexaTuples, Is.Not.Null);

            var aliceTiles = _game.HexaGame.HexaTuples[0].board.Value.Select(x => (HexaTile)x);
            Assert.That(aliceTiles.Where(x => x.TileType == TileType.Empty).Count, Is.EqualTo(((int)GridSize.Medium) - 1));
            Assert.That(aliceTiles.Where(x => x.TileType == TileType.Home).Count, Is.EqualTo(1));

            var bobTiles = _game.HexaGame.HexaTuples[1].board.Value.Select(x => (HexaTile)x);
            Assert.That(bobTiles.Where(x => x.TileType == TileType.Empty).Count, Is.EqualTo(((int)GridSize.Medium) - 1));
            Assert.That(bobTiles.Where(x => x.TileType == TileType.Home).Count, Is.EqualTo(1));

            // Alice start first
            Assert.That(_game.HexaGame.PlayerTurn, Is.EqualTo((byte)0));

            // Alice has 1 mana
            Assert.That(_game.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(1));
            result = await _game.ChooseAndPlaceAsync(_game.HexaGame.PlayerTurn, 0, (0, 1), CancellationToken.None);
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(_game.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(0));

            Assert.That(((HexaTile)_game.HexaGame.CurrentPlayerBoard[0, 1]).IsEmpty(), Is.False);

            result = await _game.FinishTurnAsync(_game.HexaGame.PlayerTurn,CancellationToken.None);
            Assert.That(result.IsSuccess, Is.True);

            // Now it is Bob's turn
            Assert.That(_game.HexaGame.PlayerTurn, Is.EqualTo((byte)1));
            Assert.That(_game.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(1));
            result = await _game.ChooseAndPlaceAsync(_game.HexaGame.PlayerTurn, 0, (0, 1), CancellationToken.None);
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(_game.HexaGame.CurrentPlayer[RessourceType.Mana], Is.EqualTo(0));

//var hexaGame = Substrate.Integration.Helper.HexalemWrapper.GetHexaGame(game, new BoardSharp[2] { aliceBoard, bobBoard });
            Assert.That(_game.HexaGame.HexBoardRound, Is.EqualTo((byte)0));
            result = await _game.FinishTurnAsync(_game.HexaGame.PlayerTurn, CancellationToken.None);
            Assert.That(result.IsSuccess, Is.True);

            // Now it is Alice turn again, and we have a new round
            Assert.That(_game.HexaGame.PlayerTurn, Is.EqualTo((byte)0));
            Assert.That(_game.HexaGame.HexBoardRound, Is.EqualTo((byte)1));
        }
    }
}
