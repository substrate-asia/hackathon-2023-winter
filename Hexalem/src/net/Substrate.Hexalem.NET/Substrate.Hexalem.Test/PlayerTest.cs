using Substrate.Hexalem.NET;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Test
{
    public class PlayerTest : BaseTest
    {
        private HexBoard hexBoard;
        private HexPlayer[] players;

        [SetUp]
        public void Setup()
        {
            players = new HexPlayer[2] { p1, p2 };
            // This method runs before each test, setting up the test environment
            hexBoard = new HexBoard(new byte[32]);
            // Assuming Initialize sets default values
            hexBoard.Initialize(1, HexGridSize.Medium);
        }

        [Test]
        public void WhenGameStart_FirstPlayerStartToPlay()
        {
            Assert.That(hexBoard.PlayerTurn, Is.EqualTo(0));
        }

        [Test, Ignore("Fix storage size ?")]
        public void WhenTurnIsFinish_SecondPlayerStartToPlay()
        {
            hexBoard = Game.NextTurn(0, hexBoard, 0);
            Assert.That(hexBoard.PlayerTurn, Is.EqualTo(1));
        }
    }
}
