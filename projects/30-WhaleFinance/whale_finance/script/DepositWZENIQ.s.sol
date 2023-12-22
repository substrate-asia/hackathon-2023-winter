// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "./interface/WETH.sol";

contract Deposit is Script {



    function setUp() public {}

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        address wzeniq = 0x74DC1C4ec10abE9F5C8A3EabF1A90b97cDc3Ead8;
        uint256 amount = 1 ether;

        IWETH9(wzeniq).deposit{value: amount}();

        vm.stopBroadcast();
        
    }
}
