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
        public void GetAndSetValue_ShouldSucceed()
        {
            var winningCondition = new HexaWinningCondition(WinningCondition.HumanThreshold, 2);

            Assert.That(winningCondition.WinningCondition, Is.EqualTo(WinningCondition.HumanThreshold));
            Assert.That(winningCondition.Target, Is.EqualTo((byte)2));
        }

        [Test]
        public void InitWithByte_ShouldSucceed()
        {
            var winningCondition = new HexaWinningCondition(new byte[2] { 1, 4 });

            Assert.That(winningCondition.WinningCondition, Is.EqualTo(WinningCondition.GoldThreshold));
            Assert.That(winningCondition.Target, Is.EqualTo((byte)4));
        }
    }
}
