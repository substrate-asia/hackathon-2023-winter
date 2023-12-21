// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import { IDeployment } from "../interfaces/IDeployment.sol";
import { DeploymentUtil } from "./DeploymentUtil.sol";
import { Constants } from "./Constants.sol";


contract EnvironmentUtil is DeploymentUtil, Constants {

    IDeployment.VaultFactoryConf public vaultFactoryConf;

    function setUp() public virtual {
        setUpMainnetEnvironment();
    }

    function setUpMainnetEnvironment() internal {
        string memory MAINNET_RPC_URL = vm.envString("ETHEREUM_NODE_MAINNET");
        vm.createSelectFork(MAINNET_RPC_URL);
        setUpEnvironment(
            ETHEREUM_WNATIVE_TOKEN,
            ETHEREUM_WNATIVE_TOKEN_USD_AGGREGATOR,
            CHAINLINK_STALE_RATE_THRESHOLD
        );

    }

    function setUpEnvironment(
        address weth,
        address ethUsdAggregator,
        uint256 chainlinkStaleRateThreshold
    ) private {
        vm.label(weth, "WETH");
        address owner = makeAddr("vaultfactoryowner_fork");
        vm.startPrank(owner);
        vaultFactoryConf = deployRelease(weth, ethUsdAggregator, chainlinkStaleRateThreshold,true);
        vaultFactoryConf.owner = owner;
        vm.stopPrank();
    }
}