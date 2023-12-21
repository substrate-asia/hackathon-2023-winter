// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import { EnvironmentUtil } from "../../utils/EnvironmentUtil.sol";
import { FundUtil } from "../../utils/FundUtil.sol";
import { IGuardianLogic } from "../../interfaces/IGuardianLogic.sol";
import { IVaultLogic } from "../../interfaces/IVaultLogic.sol";
import { IGlobalShared } from "../../../src/utils/IGlobalShared.sol";
import { IntegrationSelectors } from "../../../src/extensions/integration-manager/integrations/utils/IntegrationSelectors.sol";
import { IERC20 } from "openzeppelin/token/ERC20/IERC20.sol";

contract Uniswapv2Test is EnvironmentUtil, FundUtil, IntegrationSelectors {
    address public adapterUniV2ExchangeAddress;

    function setUp() public override {
        setUpMainnetEnvironment();
        setUpUniswapv2EthMainet();
    }

    function setUpUniswapv2() internal {
        adapterUniV2ExchangeAddress = deployCode("UniswapV2ExchangeAdapter.sol", abi.encode(IGlobalShared(vaultFactoryConf.globalShared).getIntegrationManager(), ETHEREUM_UNISWAP_V2_ROUTER_02));
    }

    function setUpUniswapv2EthMainet() internal {
        setUpUniswapv2();
        // add wbtc to primitive
        address[] memory assetsAddresses = new address[](2);
        assetsAddresses[0] = ETHEREUM_WBTC;
        assetsAddresses[1] = ETHEREUM_DAI;
        address[] memory aggregatorAddresses = new address[](2);
        aggregatorAddresses[0] = ETHEREUM_WBTC_USD_AGGREGATOR;
        aggregatorAddresses[1] = ETHEREUM_DAI_USD_AGGREGATOR;
        uint8[] memory rateAssets = new uint8[](2);
        rateAssets[0] = 1;
        rateAssets[1] = 1;
        vm.prank(vaultFactoryConf.owner);
        vaultFactoryConf.vauleEvaluator.addPrimitives(assetsAddresses, aggregatorAddresses,rateAssets);
    }

    function testTradeSuccess() public {
        // create fund
        address fundOwner = makeAddr("fundowner");
        vm.prank(fundOwner);
        (IGuardianLogic guardianLogicProxy, IVaultLogic vaultLogicProxy) = createFund(vaultFactoryConf, ETHEREUM_DAI, 10);
        // buy shares
        uint256 depositAmount = 10000 * 10**18;
        uint256 sharesReceived = buyShares(makeAddr("depositor"), guardianLogicProxy, depositAmount);
        assertEq(sharesReceived, depositAmount);
        // call on integration(swap dai to wbtc)
        address[] memory path = new address[](2);
        path[0] = ETHEREUM_DAI;
        path[1] = ETHEREUM_WBTC;
        uint256 tradeDaiAmount = depositAmount / 2;
        bytes memory uniswapv2TradeArgs = abi.encode(path, tradeDaiAmount, 0);
        bytes memory callArgs = abi.encode(adapterUniV2ExchangeAddress,TAKE_ORDER_SELECTOR, uniswapv2TradeArgs);
        callOnIntegration(vaultFactoryConf, guardianLogicProxy, fundOwner, callArgs);
        // check balance
        assertEq(IERC20(ETHEREUM_DAI).balanceOf(address(vaultLogicProxy)), depositAmount - tradeDaiAmount);
    }

    function testFailedTradeNotVaultOwner() public {
        // create fund
        address fundOwner = makeAddr("fundowner");
        vm.prank(fundOwner);
        (IGuardianLogic guardianLogicProxy,) = createFund(vaultFactoryConf, ETHEREUM_DAI, 10);
        // buy shares
        uint256 depositAmount = 10000 * 10**18;
        uint256 sharesReceived = buyShares(makeAddr("depositor"), guardianLogicProxy, depositAmount);
        assertEq(sharesReceived, depositAmount);
        // call on integration(swap dai to wbtc)
        address[] memory path = new address[](2);
        path[0] = ETHEREUM_DAI;
        path[1] = ETHEREUM_WBTC;
        uint256 tradeDaiAmount = depositAmount / 2;
        bytes memory uniswapv2TradeArgs = abi.encode(path, tradeDaiAmount, 0);
        bytes memory callArgs = abi.encode(adapterUniV2ExchangeAddress,TAKE_ORDER_SELECTOR, uniswapv2TradeArgs);
        callOnIntegration(vaultFactoryConf, guardianLogicProxy, makeAddr("notvaultowner"), callArgs);
    }
}