// SPDX-License-Identifier: MIT 
pragma solidity >=0.6.0 < 0.9.0;

/// @title IIntegrationManager interface
/// @notice Interface for the IntegrationManager
interface IIntegrationManager {
    enum SpendAssetsHandleType {
        None,
        Approve,
        Transfer
    }
}
