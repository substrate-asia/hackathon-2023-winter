// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WAGToken is ERC20, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _claimed;

    mapping(address => bool) public hasClaimed;

    constructor() ERC20("WAG", "WAG") {
        _mint(msg.sender, 1000000 * (10 ** decimals())); // 初始化一定数量的代币，例如1,000,000。你可以按需调整。
    }

    function claim() external {
        require(!hasClaimed[msg.sender], "You have already claimed your tokens");
        hasClaimed[msg.sender] = true;
        _mint(msg.sender, 10 * (10 ** decimals())); // 给每个用户发放10个WAG
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
