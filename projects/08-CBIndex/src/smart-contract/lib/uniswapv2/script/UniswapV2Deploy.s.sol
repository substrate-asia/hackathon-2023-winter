// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";

contract UniswapV2Deploy is Script {
    function setUp() public{}

    function run() public {
        // change this to the address of the blockchain WETH addrss you want to deploy to 
        // address WETH = 0x60Cd78c3edE4d891455ceAeCfA97EECD819209cF;
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // get the deployer address
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);
        // if need deploy wethtoken, use this code
        address WETH = deployCode("WETH.sol", abi.encode("Wrapped XRP", "WXRP"));
        // deploy the factory
        address factory = deployCode("UniswapV2Factory.sol", abi.encode(deployerAddress));
        console.log("factory address: ", factory);
        // deploy the router
        address router = deployCode("UniswapV2Router02.sol", abi.encode(factory, WETH));
        console.log("router address: ", router);
        vm.stopBroadcast();
    }
}