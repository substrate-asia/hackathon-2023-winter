// SPDX-License-Identifier: MIT
pragma solidity >=0.4.15 <0.9.0;

// 导入 Truffle 的测试工具
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Lottery.sol";

contract TestLottery {

    // 合约实例
    Lottery lottery;

    // 在每个测试用例之前执行
    function beforeEach() public {
        lottery = new Lottery();
    }

    // 测试抽奖是否能正常进行
    function testEnterLottery() public {
        // 获取合约所有者地址
        address owner = DeployedAddresses.Lottery();

        // 参与者地址
        address participant = address(0x1);

        // 验证合约所有者
        Assert.equal(lottery.owner(), owner, "Owner should be set correctly");

        // 验证抽奖状态
        Assert.isFalse(lottery.lotteryClosed(), "Lottery should be open initially");

        // 合约所有者参与抽奖应该失败
        bool ownerEntered = address(lottery).call(abi.encodeWithSignature("enterLottery()"));
        Assert.isFalse(ownerEntered, "Owner should not be able to enter the lottery");

        // 参与者参与抽奖
        bool participantEntered = address(lottery).call(abi.encodeWithSignature("enterLottery()"));
        Assert.isTrue(participantEntered, "Participant should be able to enter the lottery");
        
        // 获取参与者列表
        address[] memory participants = lottery.getParticipants();
        Assert.equal(participants.length, 1, "Participants array should have one participant");
        Assert.equal(participants[0], participant, "Participant address should match");

        // 关闭抽奖
        lottery.closeLottery();
        Assert.isTrue(lottery.lotteryClosed(), "Lottery should be closed after calling closeLottery");
    }

    // 在每个测试用例之后执行
    function afterEach() public {
        // 清理合约状态
        delete lottery;
    }
}
