// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import { EnvironmentUtil } from "./utils/EnvironmentUtil.sol";
import { FundUtil } from "./utils/FundUtil.sol";
import { IGuardianLogic } from "./interfaces/IGuardianLogic.sol";
import { IVaultLogic } from "./interfaces/IVaultLogic.sol";
import { IERC20 } from "openzeppelin/token/ERC20/IERC20.sol";

contract GuardianLogicTest is EnvironmentUtil, FundUtil {

    function setUp() public override {
        setUpMainnetEnvironment();
    }

    function testBuyShares() public {
        uint256 depositAmount = 100 * 10 ** 18;
        (IGuardianLogic guardianProxy, IVaultLogic vaultProxy) = createFund(vaultFactoryConf, ETHEREUM_WNATIVE_TOKEN, 0);
        address buyer = makeAddr("buyer");
        uint256 sharesReceived = buyShares(buyer, guardianProxy, depositAmount);
        assertEq(sharesReceived, depositAmount);
        assertEq(IERC20(address(vaultProxy)).balanceOf(buyer), depositAmount);
    }

    function testRedeemSharesForSpecificAssets() public {
        uint256 depositAmount = 100 * 10 ** 18;
        (IGuardianLogic guardianProxy, IVaultLogic vaultProxy) = createFund(vaultFactoryConf, ETHEREUM_WNATIVE_TOKEN, 0);
        address buyer = makeAddr("buyer");
        vm.prank(buyer);
        uint256 sharesReceived = buyShares(buyer, guardianProxy, depositAmount);
        assertEq(sharesReceived, depositAmount);
        assertEq(IERC20(address(vaultProxy)).balanceOf(buyer), depositAmount);
        
        uint256 sharesToRedeem = sharesReceived / 2;
        uint256 buyerSharesBeforeRedeem = IERC20(address(vaultProxy)).balanceOf(buyer);
        uint256 buyerWethBeforeRedeem = IERC20(ETHEREUM_WNATIVE_TOKEN).balanceOf(buyer);
        address[] memory payoutAssets = new address[](1);
        payoutAssets[0] = ETHEREUM_WNATIVE_TOKEN;
        uint256[] memory payoutAssetPercentages = new uint256[](1);
        payoutAssetPercentages[0] = BPS_ONE_HUNDRED_PERCENT;
        vm.prank(buyer);
        uint256[] memory payoutAmounts = guardianProxy.redeemSharesForSpecificAssets(buyer, sharesToRedeem, payoutAssets, payoutAssetPercentages);
        assertEq(payoutAmounts[0], depositAmount / 2);
        assertEq(IERC20(address(vaultProxy)).balanceOf(buyer), buyerSharesBeforeRedeem - sharesToRedeem);
        assertEq(IERC20(ETHEREUM_WNATIVE_TOKEN).balanceOf(buyer), buyerWethBeforeRedeem + payoutAmounts[0]);
    }
}