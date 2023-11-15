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
        [Test, Ignore("Todo debug coordinate")]
        public void StartGame_ThenPlayFirstRound()
        {
            var board = new HexBoard(new byte[32]);
            var draw = new Draw();

            // 32 tiles generated
            draw.Generate(32);

            Assert.That(draw.Tiles.Length, Is.EqualTo(32));

            board = Game.Start(board, 1, 1, Substitute.For<Serilog.ILogger>());

            // Let's play the first tile of the draw
            var playCoordinate = new GridCoords(0, -1);
            board = Game.Play(board, 0, draw[0], playCoordinate, draw);

            Assert.That(board.PlayerGrids[0][playCoordinate.q, playCoordinate.r], Is.EqualTo(draw[0]));
        }
    }
}
