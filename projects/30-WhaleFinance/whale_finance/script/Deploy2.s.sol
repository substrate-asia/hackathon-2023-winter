// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";


import "../src/SafeAccount.sol";
import "../src/WhaleFinance.sol";
import "../src/QuotaBeacon.sol";
import "../src/MockERC20.sol";

contract Deploy is Script {
    SafeAccount public safeAccount;
    BeaconERC20 public beacon;
    MockERC20 public stablecoin;


    function setUp() public {}

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        stablecoin = new MockERC20("ZUSD", "ZUSD");

        address quotaTokenImplementationAddress = 0xB6e2Fb3360F76a51a0AF8A4F86aE5194ae145c6b;

        safeAccount = new SafeAccount();
        beacon = new BeaconERC20(address(quotaTokenImplementationAddress)); //quota

        console.log("SafeAccount address: %s", address(safeAccount));
        console.log("Beacon address: %s", address(beacon));
        console.log("Stablecoin address: %s", address(stablecoin));



        vm.stopBroadcast();
        
    }
}
