// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../src/interface/IV2SwapRouter.sol";
import "../src/MockERC20.sol";



contract Swap is Script {

    address public wzeniq = 0x74DC1C4ec10abE9F5C8A3EabF1A90b97cDc3Ead8;

    address public tokenA = 0x083C06f4191e5350ba7Ce70a9Ab86c601b17cCFf; //zusd
    address public tokenB = 0x3E8D3319CbB430685CA1b100f83E4C882e65D635; //weth 
    address public zeniqSwapRouter = 0xcbC9ce7898517049175280288f3838593Adcc660;

    function setUp() public {}

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        

        address[] memory path = new address[](2);
        path[0] = tokenA;
        path[1] = tokenB;

        MockERC20(tokenA).approve(zeniqSwapRouter, 0.2 ether);



        IV2SwapRouter router = IV2SwapRouter(zeniqSwapRouter);

        router.swapExactTokensForTokens(0.2 ether, 0, path, 0x0CCfc28Ce76f48726C59Fc2a598b6eAac8bd3Ab4, block.timestamp + 10 days);

        vm.stopBroadcast();
        
    }
}
