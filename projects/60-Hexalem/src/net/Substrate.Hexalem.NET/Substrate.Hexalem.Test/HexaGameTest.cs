using Newtonsoft.Json.Linq;
using Substrate.Hexalem.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Test
{
    public class HexaGameTest
    {
        private HexaGame _hexaGame;

        [SetUp]
        public void Setup()
        {
            uint blockNumber = 1;
            Random random = new Random((int)blockNumber);

            var randomHash = new byte[32];
            random.NextBytes(randomHash);

            var players = new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) };
            var hexaTuple = new List<(HexaPlayer, HexaBoard)>();
            foreach (var player in players)
            {
                var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);
                hexaTuple.Add((player, hexaBoard));
            }

            _hexaGame = new HexaGame(randomHash, hexaTuple);
            _hexaGame.Init(blockNumber);
        }

        [Test]
        public void InvalidId_ShouldFail()
        {
            uint blockNumber = 1;
            Random random = new Random((int)blockNumber);
            var randomHash = new byte[20];
            random.NextBytes(randomHash);

            var players = new List<HexaPlayer>() { new HexaPlayer(new byte[32]), new HexaPlayer(new byte[32]) };
            var hexaTuple = new List<(HexaPlayer, HexaBoard)>();
            foreach (var player in players)
            {
                var hexaBoard = new HexaBoard(new byte[(int)GridSize.Medium]);
                hexaTuple.Add((player, hexaBoard));
            }

            Assert.Throws<ArgumentException>(() => new HexaGame(randomHash, hexaTuple));
        }

        [Test]
        public void ClonedHexaGame_ShouldBeEqual()
        {
            Assert.True(((HexaGame)_hexaGame.Clone()).IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_WithDifferentTileType_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            HexaTile tile = _hexaGame.CurrentPlayerBoard[0];
            tile.TileType += 1;

            _hexaGame.CurrentPlayerBoard[0] = tile;
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_WithDifferentTileLevel_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            HexaTile tile = _hexaGame.CurrentPlayerBoard[0];
            tile.TileLevel += 1;

            _hexaGame.CurrentPlayerBoard[0] = tile;
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_WithDifferentTilePattern_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            HexaTile tile = _hexaGame.CurrentPlayerBoard[0];
            tile.TilePattern += 1;

            _hexaGame.CurrentPlayerBoard[0] = tile;
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_PlayersWithDifferentRessource_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            _hexaGame.CurrentPlayer[RessourceType.Mana] = (byte)(_hexaGame.CurrentPlayer[RessourceType.Mana] + 1);
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_DifferentState_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            _hexaGame.HexBoardState = HexBoardState.Finish;
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_DifferentRound_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            _hexaGame.HexBoardRound = (byte)(clonedGame.HexBoardRound + 1);
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_DifferentPlayersCount_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            _hexaGame.PlayersCount = (byte)(clonedGame.PlayersCount + 1);
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_DifferentPlayerTurn_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            _hexaGame.PlayerTurn = (byte)(clonedGame.PlayerTurn + 1);
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_DifferentSelectBase_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            _hexaGame.SelectBase = (byte)(clonedGame.SelectBase + 1);
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_DifferentPlayed_ShouldNotBeEqual()
        {
            var clonedGame = (HexaGame)_hexaGame.Clone();

            _hexaGame.Played = !clonedGame.Played;
            Assert.IsFalse(clonedGame.IsSame(_hexaGame));
        }

        [Test]
        public void HexaGame_PlayedAccessor_ShouldSucceed()
        {
            _hexaGame.Played = true;
            Assert.That(_hexaGame.Played, Is.True);

            _hexaGame.Played = false;
            Assert.That(_hexaGame.Played, Is.False);
        }

        [Test]
        public void HexaGame_ExportAndImportState_Init_ShouldSucceed()
        {
            var gameHex = _hexaGame.Export();
            Assert.That(gameHex, Is.Not.Empty);

            var loadedGame = HexaGame.Import(gameHex);
            Assert.That(_hexaGame.IsSame(loadedGame), Is.True);
        }
    }
}
