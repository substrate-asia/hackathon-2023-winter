// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { WETH } from "uniswapv2/src/WETH.sol";
import { UniswapV2Factory } from "uniswapv2/src/UniswapV2Factory.sol";
import { UniswapV2Router02 } from "uniswapv2/src/UniswapV2Router02.sol";


// need change init code in uniswapv2/src/libraries/UniswapV2Library.sol(https://emn178.github.io/online-tools/keccak_256.html)
contract UniswapV2Deploy is Script {
    function setUp() public{}

    function run() public {
        // change this to the address of the blockchain WETH addrss you want to deploy to 
        // address WETH = 0x60Cd78c3edE4d891455ceAeCfA97EECD819209cF;
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // get the deployer address
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);
        // if need deploy wethtoken, use this code（remenber change name and symbol）
        string memory name = vm.envString("WNATIVE_TOKEN_NAME");
        string memory symbol = vm.envString("WNATIVE_TOKEN_SYMBOL");
        if (bytes(name).length == 0) {
            name = "Wrapped ETH";
        }
        if (bytes(symbol).length == 0) {
            symbol = "WETH";
        }
        address wNativeTokenddress = deployCode("WETH.sol", abi.encode(name, symbol));
        console.log("wnativetoken address: ", wNativeTokenddress);
        // deploy the factory
        address factory = deployCode("UniswapV2Factory.sol", abi.encode(deployerAddress));
        console.log("factory address: ", factory);
        // deploy the router
        address router = deployCode("UniswapV2Router02.sol", abi.encode(factory, wNativeTokenddress));
        console.log("router address: ", router);
        vm.stopBroadcast();
    }
}