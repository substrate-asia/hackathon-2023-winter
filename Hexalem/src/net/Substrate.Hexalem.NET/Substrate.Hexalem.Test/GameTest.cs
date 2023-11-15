using NSubstitute;
using Substrate.Hexalem.NET.Draw;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Test
{
    public class GameTest
    {
        [Test]
        public void StartGame_ThenPlayFirstRound()
        {
            uint blockNumStart = 1;
            var board = new HexBoard(new byte[32]);
            var draw = new Draw();

            // 32 tiles generated
            draw.Generate(32);

            Assert.That(draw.Tiles.Length, Is.EqualTo(32));

            board = Game.Start(board, 1, 1, Substitute.For<Serilog.ILogger>());

            // Let's play the first tile of the draw
            var playCoordinate = new GridCoords(1, 0);
            board = Game.Play(board, 0, draw[0], playCoordinate, draw);

            var playerTile = board.PlayerGrids[0][playCoordinate.q, playCoordinate.r];

            // Coordinate are valid, null is not allowed
            Assert.That(playerTile, Is.Not.Null);
            Assert.That(playerTile.GetHexTileType(), Is.EqualTo(draw[0].GetHexTileType()));

            // Let's go to next turn
            board = Game.NextTurn(blockNumStart + 2, board, 0);
        }
    }
}
