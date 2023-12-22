// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../src/MockERC20.sol";
import "../src/WhaleFinance.sol";

contract Create is Script {
    MockERC20 public token;
    MockERC20 public weth;


    function setUp() public {}

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY_DANCEBOX"));
        address target = 0xB0Eb2a4CDf7be2D0c408cF60Ed8ba1065920b339;

        MockERC20 itub4 = new MockERC20("WHALETEST", "WHALETEST");

        console.log("itub4 address: %s", address(itub4));
        console.log("my account: %s", tx.origin);
        

        itub4.mint(target, 1000000000000000 ether);


        vm.stopBroadcast();
        
    }
}