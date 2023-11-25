using Substrate.Hexalem.NET;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Substrate.Hexalem.Test
{
    internal class WinningConditionTests
    {
        [Test]
        [TestCase(WinningCondition.HumanThreshold, 2)]
        [TestCase(WinningCondition.HumanThreshold, 10)]
        [TestCase(WinningCondition.GoldThreshold, 0)]
        [TestCase(WinningCondition.GoldThreshold, 4)]
        public void GetAndSetValue_ShouldSucceed(WinningCondition winning, int target)
        {
            var winningCondition = new HexaWinningCondition(winning, (byte)target);

            Assert.That(winningCondition.WinningCondition, Is.EqualTo(winning));
            Assert.That(winningCondition.Target, Is.EqualTo((byte)target));
        }

        [Test]
        public void InitWithByte_ShouldSucceed()
        {
            var winningCondition = new HexaWinningCondition(2);

            Assert.That(winningCondition.WinningCondition, Is.EqualTo(WinningCondition.HumanThreshold));
            Assert.That(winningCondition.Target, Is.EqualTo((byte)2));
        }
    }
}
