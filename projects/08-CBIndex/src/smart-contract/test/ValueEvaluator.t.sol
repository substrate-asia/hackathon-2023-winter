// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import { IDeployment } from "./interfaces/IDeployment.sol";
import { DeploymentUtil } from "./utils/DeploymentUtil.sol";
import { IVaultFactory } from "./interfaces/IVaultFactory.sol";

contract ValueEvaluatorTest is DeploymentUtil {
    address public vaultFactoryOwner;
    address public wNativeToken;
    uint256 public chainlinkStaleRateThreshold;
    address public ethUsdAggregator;
    uint256 public wNativeTokenPrice = 20000;
    IDeployment.VaultFactoryConf public vaultFactoryConf;

    function setUp() public {
        wNativeToken = makeAddr("wNativeToken");
        chainlinkStaleRateThreshold = 360;
        vm.warp(10000);
        ethUsdAggregator = deployMockAggregator(wNativeTokenPrice);
        vaultFactoryOwner = makeAddr("vaultFactoryOwner");
        vm.startPrank(vaultFactoryOwner);
        vaultFactoryConf = deployRelease(wNativeToken, ethUsdAggregator, chainlinkStaleRateThreshold, true);
        vm.stopPrank();
    }

    function testGetWethToken() public {
        assertEq(vaultFactoryConf.vauleEvaluator.getWethToken(), wNativeToken);
    }

    function testGetStaleRateThreshold() public {
        assertEq(vaultFactoryConf.vauleEvaluator.getStaleRateThreshold(), chainlinkStaleRateThreshold);
    }

    function testGetVaultFactoryOwner() public {
        assertEq(IVaultFactory(vaultFactoryConf.vauleEvaluator.getVaultFactory()).getOwner(), vaultFactoryOwner);
    }

    function testGetEthUsdAggregator() public {
        assertEq(vaultFactoryConf.vauleEvaluator.getEthUsdAggregator(), ethUsdAggregator);
    }

    function testIsSupportedAsset() public {
        assertEq(vaultFactoryConf.vauleEvaluator.isSupportedAsset(wNativeToken), true);
    }

    function testIsSupportedAssetFailed() public {
        assertEq(vaultFactoryConf.vauleEvaluator.isSupportedAsset(makeAddr("notSupportedAsset")), false);
    }

    function testAddPrimitivesFailed() public {
        vm.expectRevert("Only Vault Factory owner can call this function");
        vm.prank(makeAddr("notOwner"));
        address[] memory assetsAddresses = new address[](1);
        assetsAddresses[0] = makeAddr("asset");
        address[] memory aggregatorAddresses = new address[](1);
        aggregatorAddresses[0] = makeAddr("aggregator");
        uint8[] memory rateAssets = new uint8[](1);
        rateAssets[0] = 0;
        vaultFactoryConf.vauleEvaluator.addPrimitives(assetsAddresses, aggregatorAddresses,rateAssets);
    }

    function testAddPrimitivesSuccess() public {
        address[] memory assetsAddresses = new address[](1);
        assetsAddresses[0] = deployTestERC20Token();
        address[] memory aggregatorAddresses = new address[](1);
        aggregatorAddresses[0] =  deployMockAggregator(38000);
        uint8[] memory rateAssets = new uint8[](1);
        rateAssets[0] = 1;
        vm.prank(vaultFactoryOwner);
        vaultFactoryConf.vauleEvaluator.addPrimitives(assetsAddresses, aggregatorAddresses,rateAssets);
    }
    
    function testCalcCanonicalAssetsTotalValue() public {
        address[] memory assetsAddresses = new address[](1);
        assetsAddresses[0] = deployTestERC20Token();
        address[] memory aggregatorAddresses = new address[](1);
        uint256 testERC20TokenPrice = 40000;
        aggregatorAddresses[0] =  deployMockAggregator(testERC20TokenPrice);
        uint8[] memory rateAssets = new uint8[](1);
        rateAssets[0] = 1;
        vm.prank(vaultFactoryOwner);
        vaultFactoryConf.vauleEvaluator.addPrimitives(assetsAddresses, aggregatorAddresses,rateAssets);
        address[] memory baseAddresses = new address[](2);
        baseAddresses[0] = wNativeToken;
        baseAddresses[1] = assetsAddresses[0];
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 20 * 10 ** 18;
        amounts[1] = 10 * 10 ** 18;
        assertEq(vaultFactoryConf.vauleEvaluator.calcCanonicalAssetsTotalValue(baseAddresses, amounts, wNativeToken), 40 * 10 ** 18);
    }
}