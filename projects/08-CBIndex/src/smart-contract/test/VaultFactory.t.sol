// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import { IVaultFactory } from "./interfaces/IVaultFactory.sol";
import { IDeployment } from "./interfaces/IDeployment.sol";
import { IValueEvaluator } from "./interfaces/IValueEvaluator.sol";
import { IGuardianLogic } from "./interfaces/IGuardianLogic.sol";
import { IVaultLogic } from "./interfaces/IVaultLogic.sol";
import { DeploymentUtil } from "./utils/DeploymentUtil.sol";

contract VaultFactoryTest is DeploymentUtil {
    function setUp() public {
    }

    function testGetOwnerSuccess() public {
        address creator = makeAddr("FundDeployerCreator");
        // Deploy a new FundDeployer from an expected account
        vm.prank(creator);
        address beaconGuardianLogicAddress =  makeAddr("BeaconGuardianLogic");
        address beaconVaultLogicAddress =  makeAddr("BeaconVaultLogic");
        address vaultFactoryAddress = deployCode("VaultFactory.sol",abi.encode(beaconGuardianLogicAddress,beaconVaultLogicAddress));

        assertEq(IVaultFactory(vaultFactoryAddress).getCreator(), creator);
        assertEq(IVaultFactory(vaultFactoryAddress).getOwner(), creator);
        assertEq(IVaultFactory(vaultFactoryAddress).isActivated(), false);
    }

    function testCreateNewFundWithNotActivated() public {
        address creator = makeAddr("FundDeployerCreator");
        // Deploy a new FundDeployer from an expected account
        vm.startPrank(creator);
        address beaconGuardianLogicAddress =  makeAddr("BeaconGuardianLogic");
        address beaconVaultLogicAddress =  makeAddr("BeaconVaultLogic");
        address vaultFactoryAddress = deployCode("VaultFactory.sol",abi.encode(beaconGuardianLogicAddress,beaconVaultLogicAddress));
        vm.stopPrank();

        address fundCreator = makeAddr("fundCreator");
        vm.expectRevert("contract is not yet activate");
        vm.prank(fundCreator);
        IVaultFactory(vaultFactoryAddress).createNewVault("testVault", "TEST_VAULT", address(0), 0);
    }

    function testCreateNewFundWithActivated() public {
        
        address mockChainlink = deployMockAggregator(38000);
        IDeployment.VaultFactoryConf memory vaultFactoryConf = deployRelease(makeAddr("weth"), mockChainlink, 0, true);
        address fundCreator = makeAddr("fundCreator");
        vm.prank(fundCreator);
        (address guardianProxyAddress, address vaultProxyAddress) = vaultFactoryConf.vaultFactory.createNewVault("testVault", "TEST_VAULT", makeAddr("denominationAsset"), 10);
        // check vault
        assertEq(IVaultLogic(vaultProxyAddress).getAccessor(), guardianProxyAddress);
        assertEq(IVaultLogic(vaultProxyAddress).getTrackedAssets()[0], makeAddr("denominationAsset"));
        assertEq(IVaultLogic(vaultProxyAddress).getCreator(), address(vaultFactoryConf.vaultFactory));
        assertEq(IVaultLogic(vaultProxyAddress).getOwner(), fundCreator);

        // check guardian
        assertEq(IGuardianLogic(guardianProxyAddress).getVaultProxy(), vaultProxyAddress);
        assertEq(IGuardianLogic(guardianProxyAddress).getDenominationAsset(), makeAddr("denominationAsset"));
    }
}