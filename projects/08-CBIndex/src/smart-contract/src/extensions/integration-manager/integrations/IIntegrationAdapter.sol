// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "../IIntegrationManager.sol";

/// @title Integration Adapter interface
/// @notice Interface for all integration adapters
interface IIntegrationAdapter {
    function parseAssetsForAction(address _vaultProxy, bytes4 _selector, bytes calldata _encodedCallArgs)
        external
        view
        returns (
            IIntegrationManager.SpendAssetsHandleType spendAssetsHandleType_,
            address[] memory spendAssets_,
            uint256[] memory spendAssetAmounts_,
            address[] memory incomingAssets_,
            uint256[] memory minIncomingAssetAmounts_
        );
}
