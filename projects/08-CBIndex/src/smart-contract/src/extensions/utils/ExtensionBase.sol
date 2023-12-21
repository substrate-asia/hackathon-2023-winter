// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "../../utils/VaultFactoryOwnerMixin.sol";
import "../IExtension.sol";

/// @title ExtensionBase Contract
/// @notice Base class for an extension
abstract contract ExtensionBase is IExtension, VaultFactoryOwnerMixin {
    event ValidatedVaultProxySetForVault(address indexed guardianProxy, address indexed vaultProxy);

    mapping(address => address) internal _guardianProxyToVaultProxy;

    modifier onlyVaultFactory() {
        require(msg.sender == getVaultFactory(), "Only the VaultFactory can make this call");
        _;
    }

    constructor(address _vaultFactory) VaultFactoryOwnerMixin(_vaultFactory) {}


    /// @notice Receives calls from Guardian.callOnExtension()
    /// and dispatches the appropriate action
    /// @dev Unimplemented by default, may be overridden.
    function receiveCallFromGuardian(address, uint256, bytes calldata) external virtual override {
        revert("receiveCallFromGuardian: Unimplemented for Extension");
    }

    /// @notice Allows extension to run logic during fund configuration
    /// @dev Unimplemented by default, may be overridden.
    function setConfigForVault(address, address, bytes calldata) external virtual override {
        return;
    }

    /// @dev Helper to store the validated GuardianProxy-VaultProxy relation
    function __setValidatedVaultProxy(address _guardianProxy, address _vaultProxy) internal {
        _guardianProxyToVaultProxy[_guardianProxy] = _vaultProxy;

        emit ValidatedVaultProxySetForVault(_guardianProxy, _vaultProxy);
    }

    ///////////////////
    // STATE GETTERS //
    ///////////////////

    /// @notice Gets the verified VaultProxy for a given GuardianProxy
    /// @param _guardianProxy The GuardianProxy of the fund
    /// @return vaultProxy_ The VaultProxy of the fund
    function getVaultProxyForVault(address _guardianProxy) public view returns (address vaultProxy_) {
        return _guardianProxyToVaultProxy[_guardianProxy];
    }
}
