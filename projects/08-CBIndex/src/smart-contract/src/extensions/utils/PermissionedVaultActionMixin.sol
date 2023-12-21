// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "../../guardian/IGuardianLogic.sol";
import "../../vault/IVaultLogic.sol";

/// @title PermissionedVaultActionMixin Contract
/// @notice A mixin contract for extensions that can make permissioned vault calls
abstract contract PermissionedVaultActionMixin {
    /// @notice Adds a tracked asset
    /// @param _guardianProxy The GuardianProxy of the vault
    /// @param _asset The asset to add
    function __addTrackedAsset(address _guardianProxy, address _asset) internal {
        IGuardianLogic(_guardianProxy).permissionedVaultAction(IVaultLogic.VaultAction.AddTrackedAsset, abi.encode(_asset));
    }

    /// @notice Grants an allowance to a spender to use a vault's asset
    /// @param _guardianProxy The GuardianProxy of the vault
    /// @param _asset The asset for which to grant an allowance
    /// @param _target The spender of the allowance
    /// @param _amount The amount of the allowance
    function __approveAssetSpender(address _guardianProxy, address _asset, address _target, uint256 _amount)
        internal
    {
        IGuardianLogic(_guardianProxy).permissionedVaultAction(
            IVaultLogic.VaultAction.ApproveAssetSpender, abi.encode(_asset, _target, _amount)
        );
    }

    /// @notice Burns vault shares for a particular account
    /// @param _guardianProxy The GuardianProxy of the vault
    /// @param _target The account for which to burn shares
    /// @param _amount The amount of shares to burn
    function __burnShares(address _guardianProxy, address _target, uint256 _amount) internal {
        IGuardianLogic(_guardianProxy).permissionedVaultAction(
            IVaultLogic.VaultAction.BurnShares, abi.encode(_target, _amount)
        );
    }

    /// @notice Mints vault shares to a particular account
    /// @param _guardianProxy The GuardianProxy of the vault
    /// @param _target The account to which to mint shares
    /// @param _amount The amount of shares to mint
    function __mintShares(address _guardianProxy, address _target, uint256 _amount) internal {
        IGuardianLogic(_guardianProxy).permissionedVaultAction(
            IVaultLogic.VaultAction.MintShares, abi.encode(_target, _amount)
        );
    }

    /// @notice Removes a tracked asset
    /// @param _guardianProxy The GuardianProxy of the vault
    /// @param _asset The asset to remove
    function __removeTrackedAsset(address _guardianProxy, address _asset) internal {
        IGuardianLogic(_guardianProxy).permissionedVaultAction(
            IVaultLogic.VaultAction.RemoveTrackedAsset, abi.encode(_asset)
        );
    }

    /// @notice Transfers vault shares from one account to another
    /// @param _guardianProxy The GuardianProxy of the vault
    /// @param _from The account from which to transfer shares
    /// @param _to The account to which to transfer shares
    /// @param _amount The amount of shares to transfer
    function __transferShares(address _guardianProxy, address _from, address _to, uint256 _amount) internal {
        IGuardianLogic(_guardianProxy).permissionedVaultAction(
            IVaultLogic.VaultAction.TransferShares, abi.encode(_from, _to, _amount)
        );
    }

    /// @notice Withdraws an asset from the VaultProxy to a given account
    /// @param _guardianProxy The GuardianProxy of the vault
    /// @param _asset The asset to withdraw
    /// @param _target The account to which to withdraw the asset
    /// @param _amount The amount of asset to withdraw
    function __withdrawAssetTo(address _guardianProxy, address _asset, address _target, uint256 _amount) internal {
        IGuardianLogic(_guardianProxy).permissionedVaultAction(
            IVaultLogic.VaultAction.WithdrawAssetTo, abi.encode(_asset, _target, _amount)
        );
    }
}
