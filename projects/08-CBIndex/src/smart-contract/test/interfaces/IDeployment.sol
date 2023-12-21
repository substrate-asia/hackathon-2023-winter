// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import { IVaultFactory } from "./IVaultFactory.sol";
import { IValueEvaluator } from "./IValueEvaluator.sol";

interface IDeployment {
    struct VaultFactoryConf {
        address owner;
        address weth;
        address globalShared;
        address ethUsdAggregator;
        uint256 chainlinkStaleRateThreshold;
        bool active;
        IVaultFactory vaultFactory;
        IValueEvaluator vauleEvaluator;
    }
}