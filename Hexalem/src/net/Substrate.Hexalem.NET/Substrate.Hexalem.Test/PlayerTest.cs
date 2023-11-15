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
            players = new HexPlayer[1] { p1 };
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

        [Test]
        public void WhenTurnIsFinish_SecondPlayerStartToPlay()
        {
            // TODO
        }
    }
}
