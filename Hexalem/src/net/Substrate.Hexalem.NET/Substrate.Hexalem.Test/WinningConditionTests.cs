using Substrate.Hexalem.Engine;
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
        [TestCase(TargetGoal.HumanThreshold, 2)]
        [TestCase(TargetGoal.HumanThreshold, 10)]
        [TestCase(TargetGoal.GoldThreshold, 0)]
        [TestCase(TargetGoal.GoldThreshold, 4)]
        public void GetAndSetValue_ShouldSucceed(TargetGoal winning, int target)
        {
            var winningCondition = new HexaTargetGoal(winning, (byte)target);

            Assert.That(winningCondition.TargetGoal, Is.EqualTo(winning));
            Assert.That(winningCondition.TargetValue, Is.EqualTo((byte)target));
        }

        [Test]
        public void InitWithByte_ShouldSucceed()
        {
            var winningCondition = new HexaTargetGoal(2);

            Assert.That(winningCondition.TargetGoal, Is.EqualTo(TargetGoal.HumanThreshold));
            Assert.That(winningCondition.TargetValue, Is.EqualTo((byte)2));
        }
    }
}
