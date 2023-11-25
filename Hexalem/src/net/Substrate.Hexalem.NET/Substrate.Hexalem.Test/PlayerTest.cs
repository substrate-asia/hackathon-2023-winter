using Substrate.Hexalem.NET;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Test
{
    public class PlayerTest
    {
        [Test]
        public void CreatePlayer_WithWinningConditionSet_ShouldSucceed()
        {
            var playerRessourceBytes = new byte[8];
            playerRessourceBytes[7] = new HexaWinningCondition(WinningCondition.GoldThreshold, 10);

            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32], playerRessourceBytes) };
            
            Assert.That(hexaPlayers.First().WinningCondition.WinningCondition, Is.EqualTo(WinningCondition.GoldThreshold));
            Assert.That(hexaPlayers.First().WinningCondition.Target, Is.EqualTo(10));

        }
    }
}
