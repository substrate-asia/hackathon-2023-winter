using Substrate.Hexalem.Engine;
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
            playerRessourceBytes[7] = new HexaTargetGoal(TargetGoal.GoldThreshold, 10);

            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32], playerRessourceBytes) };
            
            Assert.That(hexaPlayers.First().TargetGoal, Is.EqualTo(TargetGoal.GoldThreshold));
            Assert.That(hexaPlayers.First().TargetValue, Is.EqualTo(10));

        }
    }
}
