// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import { IGlobalShared } from "./IGlobalShared.sol";

contract GlobalShared is IGlobalShared{
    address private immutable _vaultFactory;
    address private immutable _integrationManager;
    address private immutable _valueEvaluator;
    address private immutable _wethToken;

    constructor(
        address vaultFactory_,
        address integrationManager_,
        address valueEvaluator_,
        address wethToken_
    ) {
        _vaultFactory = vaultFactory_;
        _integrationManager = integrationManager_;
        _valueEvaluator = valueEvaluator_;
        _wethToken = wethToken_;
    }
    
    /// @notice returns the address of the vaultFactory contract
    /// @return vaultFactory_ The address of the vaultFactory contract
    function getVaultFactory() external view override returns (address vaultFactory_) {
        return _vaultFactory;
    }

    /// @notice Returns the address of the IntegrationManager contract
    /// @return integrationManager_ The address of the IntegrationManager contract
    function getIntegrationManager() external view override returns (address integrationManager_) {
        return _integrationManager;
    }

    /// @notice Returns the address of the ValueEvaluator contract
    /// @return valueEvaluator_ The address of the ValueEvaluator contract
    function getValueEvaluator() external view override returns (address valueEvaluator_) {
        return _valueEvaluator;
    }

    /// @notice Returns the address of the WETH token
    /// @return wethToken_ The address of the WETH token
    function getWethToken() external view override returns (address wethToken_) {
        return _wethToken;
    }

}