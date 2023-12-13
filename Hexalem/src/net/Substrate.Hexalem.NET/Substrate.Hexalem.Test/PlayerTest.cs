using Substrate.Hexalem.Engine;

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
