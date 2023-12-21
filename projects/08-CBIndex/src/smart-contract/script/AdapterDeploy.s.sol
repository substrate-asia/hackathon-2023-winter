// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";

// integrationManagerAddress (from VaultFactoryDeploy)
address constant IntergrationManagerAddress = 0x8F025faeF26c649e5D093677dFf7dfC023e78f31;

//uniswap v2
address constant UNISWAP_V2_FACTORY = 0xc871b0b1c10F40059512F2DA2cD37255e6a9ae54;
address constant UNISWAP_V2_ROUTER_02 = 0x722f41d377caf139619ab365A27da1018a74901e;


contract AdapterDeploy is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // deploy uniswap v2 adapter
        address adapterUniV2ExchangeAddress = deployCode("UniswapV2ExchangeAdapter.sol", abi.encode(IntergrationManagerAddress, UNISWAP_V2_ROUTER_02));
        console.log("adapterUniV2ExchangeAddress",adapterUniV2ExchangeAddress);
        address adapterUniV2LPAddress = deployCode("UniswapV2LiquidityAdapter.sol", abi.encode(IntergrationManagerAddress, UNISWAP_V2_ROUTER_02, UNISWAP_V2_FACTORY));
        console.log("adapterUniV2LPAddress",adapterUniV2LPAddress);
        vm.stopBroadcast();
    }
}