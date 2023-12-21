// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.15 < 0.9.0;

// 导入 SafeMath 库，用于安全的整数运算
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./SafeMath.sol";

contract Lottery {
    using SafeMath for uint256;

    address public owner;
    address[] public participants;
    bool public lotteryClosed;
    uint256 public randomNumber;
    address public winner;

    event LotteryClosed(uint256 randomNumber, address winner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier lotteryOpen() {
        require(!lotteryClosed, "Lottery is closed");
        _;
    }

    modifier hasParticipants() {
        require(participants.length > 0, "No participants");
        _;
    }

    constructor() {
        owner = msg.sender;
        lotteryClosed = false;
    }

    function enterLottery() external lotteryOpen {
        require(msg.sender != owner, "Owner cannot participate");
        participants.push(msg.sender);
    }

    function closeLottery() external onlyOwner hasParticipants {
        // 使用链上区块随机数，实际使用中可以考虑链外获取更安全的随机数
        randomNumber =
            uint256(blockhash(block.number - 1)) %
            participants.length;
        winner = participants[randomNumber];
        lotteryClosed = true;
        emit LotteryClosed(randomNumber, winner);
    }

    function getParticipants() external view returns (address[] memory) {
        return participants;
    }

    function isParticipant(address _address) external view returns (bool) {
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == _address) {
                return true;
            }
        }
        return false;
    }
}
