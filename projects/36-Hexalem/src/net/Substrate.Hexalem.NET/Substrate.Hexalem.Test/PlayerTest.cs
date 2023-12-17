using Substrate.Hexalem.Engine;

namespace Substrate.Hexalem.Test
{
    public class PlayerTest
    {
        [Test]
        public void CreatePlayer_WithWinningConditionSet_ShouldSucceed()
        {
            var playerRessourceBytes = new byte[HexaPlayer.STORAGE_SIZE];
            playerRessourceBytes[7] = (byte)TargetGoal.GoldThreshold;
            playerRessourceBytes[8] = 10;

            var hexaPlayers = new List<HexaPlayer>() { new HexaPlayer(new byte[32], playerRessourceBytes) };

            Assert.That(hexaPlayers[0].TargetGoal, Is.EqualTo(TargetGoal.GoldThreshold));
            Assert.That(hexaPlayers[0].TargetValue, Is.EqualTo(10));
        }
    }
}
