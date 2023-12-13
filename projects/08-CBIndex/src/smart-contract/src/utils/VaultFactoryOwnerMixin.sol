// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "../vault-factory/IVaultFactory.sol";

/// @title VaultFactoryOwnerMixin Contract
/// @notice Mixin contract for inheriting the Vault Factory Owner
/// @dev This contract is inherited by other contracts to enable them to be owned by the Vault Factory
abstract contract VaultFactoryOwnerMixin {
    address internal immutable _vaultFactoryAddress;

    constructor(address vaultFactory_) {
        _vaultFactoryAddress = vaultFactory_;
    }

    modifier onlyVaultFactoryOwner() {
        require(msg.sender == IVaultFactory(getVaultFactory()).getOwner(), "Only Vault Factory owner can call this function");
        _;
    }

    // PUBLIC FUNCTIONS
    
    /// @notice Gets the Vault Factory Address
    /// @return vaultFactory_ The Vault Factory A ddress
    function getVaultFactory() public view returns (address) {
        return _vaultFactoryAddress;
    }
}