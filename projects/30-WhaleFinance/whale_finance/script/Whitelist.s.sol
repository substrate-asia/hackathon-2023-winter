// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../src/ERC6551Registry.sol";
import "../src/SafeAccount.sol";
import "../src/interface/IERC6551Account.sol";
import "../src/WhaleFinance.sol";
import "../src/QuotaBeacon.sol";
import "../src/MockERC20.sol";

contract Deploy is Script {

    WhaleFinance public whaleFinance;



    function setUp() public {}

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        address token1 = 0x0a4cc877dAb8DDC00ed9EaDCF964930C1cB2Cf2c;
        address token2 = 0xF687Fe7Ea931B4256981F7948BFBC89289Adfd4D;
        address token3 = 0x083C06f4191e5350ba7Ce70a9Ab86c601b17cCFf;
        address token4 = 0x3E8D3319CbB430685CA1b100f83E4C882e65D635;

        whaleFinance = WhaleFinance(0x9e40f546EeC71cBE34F079B0Bb8fBf4a7529BcD8);
        whaleFinance.setWhiteListedToken(address(token1));
        whaleFinance.setWhiteListedToken(address(token2));
        whaleFinance.setWhiteListedToken(address(token3));
        whaleFinance.setWhiteListedToken(address(token4));

        vm.stopBroadcast();
        
    }
}
