// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../src/endpoint/contracts/Endpoint.sol";


contract DeployEndpoint is Script {


    function setUp() public {}

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        uint256 chainId = block.chainid;

        Endpoint endpoint = new Endpoint(1287);

        console.log("Endpoint Address: ", address(endpoint));
        console.log("ChainId: ", chainId);
        

        vm.stopBroadcast();
        
    }
}
