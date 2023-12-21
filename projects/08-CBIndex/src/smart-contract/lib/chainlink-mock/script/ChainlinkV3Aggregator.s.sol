// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";

contract ChainlinkV3Aggregator is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // deploy MockV3Aggregator
        uint8 decimals = 8;
        int256 latestAnswer = 38000 * 10**8;
        address mockV3Aggregator = deployCode("MockV3Aggregator.sol", abi.encode(decimals, latestAnswer));
        console.log("mockV3Aggregator", mockV3Aggregator);
    }
}
