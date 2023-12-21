// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "openzeppelin/utils/math/SafeMath.sol";
import "openzeppelin/token/ERC20/ERC20.sol";
import "../../vault/IVaultLogic.sol";
import "../../value-evaluator/IValueEvaluator.sol";
import "../../utils/AddressArrayLib.sol";
import "../../utils/AssetHelpers.sol";
import "./integrations/IIntegrationAdapter.sol";
import "./IIntegrationManager.sol";
import "../utils/ExtensionBase.sol";
import "../utils/PermissionedVaultActionMixin.sol";
import "../../vault/IVaultLogic.sol";

/// @title IntegrationManager
/// @notice Extension to handle DeFi integration actions for vaults
/// @dev Any arbitrary adapter is allowed by default, so all participants must be aware of
/// their vault's configuration, especially whether they use a policy that only allows
/// official adapters. Owners and asset managers must also establish trust for any
/// arbitrary adapters that they interact with.
contract IntegrationManager is IIntegrationManager, ExtensionBase, PermissionedVaultActionMixin, AssetHelpers {
    using AddressArrayLib for address[];
    using SafeMath for uint256;

    event CallOnIntegrationExecutedForvault(
        address indexed guardianProxy,
        address caller,
        address indexed adapter,
        bytes4 indexed selector,
        bytes integrationData,
        address[] incomingAssets,
        uint256[] incomingAssetAmounts,
        address[] spendAssets,
        uint256[] spendAssetAmounts
    );

    address private immutable _valueEvaluator;

    constructor(address _vaultFactory, address _valueInterpreter) ExtensionBase(_vaultFactory)
    {
        _valueEvaluator = _valueInterpreter;
    }

    /////////////
    // GENERAL //
    /////////////

    /// @notice Enables the IntegrationManager to be used by a vault
    /// @param _guardianProxy The guardianProxy of the vault
    /// @param _vaultProxy The VaultProxy of the vault
    function setConfigForVault(address _guardianProxy, address _vaultProxy, bytes calldata)
        external
        override
        onlyVaultFactory
    {
        __setValidatedVaultProxy(_guardianProxy, _vaultProxy);
    }

    ///////////////////////////////
    // CALL-ON-EXTENSION ACTIONS //
    ///////////////////////////////

    /// @notice Receives a dispatched `callOnExtension` from a vault's guardianProxy
    /// @param _caller The user who called for this action
    /// @param _actionId An ID representing the desired action
    /// @param _callArgs The encoded args for the action
    function receiveCallFromGuardian(address _caller, uint256 _actionId, bytes calldata _callArgs)
        external
        override
    {
        address guardianProxy = msg.sender;

        // This validation comes at negligible cost but is not strictly necessary,
        // as all actions below call permissioned actions on the VaultProxy,
        // which will fail for an invalid guardianProxy
        address vaultProxy = getVaultProxyForVault(guardianProxy);
        require(vaultProxy != address(0), "receiveCallFromGuardian: vault is not valid");
        require(IVaultLogic(vaultProxy).getOwner() == _caller, "receiveCallFromGuardian: caller is not owner");

        // Dispatch the action
        if (_actionId == 0) {
            __callOnIntegration(_caller, guardianProxy, vaultProxy, _callArgs);
        } else if (_actionId == 1) {
            __addTrackedAssetsToVault(guardianProxy, _callArgs);
        } else if (_actionId == 2) {
            __removeTrackedAssetsFromVault(guardianProxy, _callArgs);
        } else {
            revert("receiveCallFromGuardian: Invalid _actionId");
        }
    }

    /// @dev Adds assets as tracked assets of the vault.
    /// Does not validate that assets are not already tracked.
    function __addTrackedAssetsToVault(address _guardianProxy, bytes memory _callArgs) private {
        address[] memory assets = abi.decode(_callArgs, (address[]));

        for (uint256 i; i < assets.length; i++) {
            require(
                IValueEvaluator(getValueEvaluator()).isSupportedPrimitiveAsset(assets[i]),
                "__addTrackedAssetsToVault: Unsupported asset"
            );

            __addTrackedAsset(_guardianProxy, assets[i]);
        }
    }

    /// @dev Removes assets from the tracked assets of the vault.
    /// Does not validate that assets are not already tracked.
    function __removeTrackedAssetsFromVault(address _guardianProxy, bytes memory _callArgs)
        private
    {
        address[] memory assets = abi.decode(_callArgs, (address[]));

        for (uint256 i; i < assets.length; i++) {
            __removeTrackedAsset(_guardianProxy, assets[i]);
        }
    }

    /////////////////////////
    // CALL ON INTEGRATION //
    /////////////////////////

    /// @notice Universal method for calling third party contract functions through adapters
    /// @param _caller The caller of this function via the guardianProxy
    /// @param _guardianProxy The guardianProxy
    /// @param _vaultProxy The VaultProxy
    /// @param _callArgs The encoded args for this function
    /// - _adapter Adapter of the integration on which to execute a call
    /// - _selector Method selector of the adapter method to execute
    /// - _integrationData Encoded arguments specific to the adapter
    /// @dev Refer to specific adapter to see how to encode its arguments.
    function __callOnIntegration(
        address _caller,
        address _guardianProxy,
        address _vaultProxy,
        bytes memory _callArgs
    ) private {
        // Validating the guardianProxy is the active VaultProxy.accessor()
        // protects against corner cases of lingering permissions on adapters issued
        // via VaultLib.callOnContract() that could otherwise be called from an
        // undestructed guardianProxy
        require(
            _guardianProxy == IVaultLogic(_vaultProxy).getAccessor(), "receiveCallFromGuardian: vault is not active"
        );

        (address adapter, bytes4 selector, bytes memory integrationData) = __decodeCallOnIntegrationArgs(_callArgs);

        (
            address[] memory incomingAssets,
            uint256[] memory incomingAssetAmounts,
            address[] memory spendAssets,
            uint256[] memory spendAssetAmounts
        ) = __callOnIntegrationInner(_guardianProxy, _vaultProxy, adapter, selector, integrationData);

        emit CallOnIntegrationExecutedForvault(
            _guardianProxy,
            _caller,
            adapter,
            selector,
            integrationData,
            incomingAssets,
            incomingAssetAmounts,
            spendAssets,
            spendAssetAmounts
        );
    }

    /// @dev Helper to execute the bulk of logic of callOnIntegration.
    /// Avoids the stack-too-deep-error.
    function __callOnIntegrationInner(
        address _guardianProxy,
        address _vaultProxy,
        address _adapter,
        bytes4 _selector,
        bytes memory _integrationData
    )
        private
        returns (
            address[] memory incomingAssets_,
            uint256[] memory incomingAssetAmounts_,
            address[] memory spendAssets_,
            uint256[] memory spendAssetAmounts_
        )
    {
        uint256[] memory preCallIncomingAssetBalances;
        uint256[] memory minIncomingAssetAmounts;
        SpendAssetsHandleType spendAssetsHandleType;
        uint256[] memory maxSpendAssetAmounts;
        uint256[] memory preCallSpendAssetBalances;

        (
            incomingAssets_,
            preCallIncomingAssetBalances,
            minIncomingAssetAmounts,
            spendAssetsHandleType,
            spendAssets_,
            maxSpendAssetAmounts,
            preCallSpendAssetBalances
        ) = __preProcessCoI(_guardianProxy, _vaultProxy, _adapter, _selector, _integrationData);

        __executeCoI(
            _vaultProxy,
            _adapter,
            _selector,
            _integrationData,
            abi.encode(spendAssets_, maxSpendAssetAmounts, incomingAssets_)
        );

        (incomingAssetAmounts_, spendAssetAmounts_) = __postProcessCoI(
            _guardianProxy,
            _vaultProxy,
            _adapter,
            incomingAssets_,
            preCallIncomingAssetBalances,
            minIncomingAssetAmounts,
            spendAssetsHandleType,
            spendAssets_,
            maxSpendAssetAmounts,
            preCallSpendAssetBalances
        );

        return (incomingAssets_, incomingAssetAmounts_, spendAssets_, spendAssetAmounts_);
    }

    /// @dev Helper to decode CoI args
    function __decodeCallOnIntegrationArgs(bytes memory _callArgs)
        private
        pure
        returns (address adapter_, bytes4 selector_, bytes memory integrationData_)
    {
        return abi.decode(_callArgs, (address, bytes4, bytes));
    }

    /// @dev Helper to execute a call to an integration
    /// @dev Avoids stack-too-deep error
    function __executeCoI(
        address _vaultProxy,
        address _adapter,
        bytes4 _selector,
        bytes memory _integrationData,
        bytes memory _assetData
    ) private {
        (bool success, bytes memory returnData) =
            _adapter.call(abi.encodeWithSelector(_selector, _vaultProxy, _integrationData, _assetData));
        require(success, string(returnData));
    }

    /// @dev Helper to get the vault's balance of a particular asset
    function __getVaultAssetBalance(address _vaultProxy, address _asset) private view returns (uint256) {
        return ERC20(_asset).balanceOf(_vaultProxy);
    }

    /// @dev Helper for the internal actions to take prior to executing CoI
    function __preProcessCoI(
        address _guardianProxy,
        address _vaultProxy,
        address _adapter,
        bytes4 _selector,
        bytes memory _integrationData
    )
        private
        returns (
            address[] memory incomingAssets_,
            uint256[] memory preCallIncomingAssetBalances_,
            uint256[] memory minIncomingAssetAmounts_,
            SpendAssetsHandleType spendAssetsHandleType_,
            address[] memory spendAssets_,
            uint256[] memory maxSpendAssetAmounts_,
            uint256[] memory preCallSpendAssetBalances_
        )
    {
        // Note that incoming and spend assets are allowed to overlap
        // (e.g., a fee for the incomingAsset charged in a spend asset)
        (spendAssetsHandleType_, spendAssets_, maxSpendAssetAmounts_, incomingAssets_, minIncomingAssetAmounts_) =
            IIntegrationAdapter(_adapter).parseAssetsForAction(_vaultProxy, _selector, _integrationData);
        require(spendAssets_.length == maxSpendAssetAmounts_.length, "__preProcessCoI: Spend assets arrays unequal");
        require(
            incomingAssets_.length == minIncomingAssetAmounts_.length, "__preProcessCoI: Incoming assets arrays unequal"
        );
        require(spendAssets_.isUniqueSet(), "__preProcessCoI: Duplicate spend asset");
        require(incomingAssets_.isUniqueSet(), "__preProcessCoI: Duplicate incoming asset");

        // INCOMING ASSETS

        // Incoming asset balances must be recorded prior to spend asset balances in case there
        // is an overlap (an asset that is both a spend asset and an incoming asset),
        // as a spend asset can be immediately transferred after recording its balance
        preCallIncomingAssetBalances_ = new uint256[](incomingAssets_.length);
        for (uint256 i; i < incomingAssets_.length; i++) {
            require(
                IValueEvaluator(getValueEvaluator()).isSupportedAsset(incomingAssets_[i]),
                "__preProcessCoI: Non-receivable incoming asset"
            );

            preCallIncomingAssetBalances_[i] = ERC20(incomingAssets_[i]).balanceOf(_vaultProxy);
        }

        // SPEND ASSETS

        preCallSpendAssetBalances_ = new uint256[](spendAssets_.length);
        for (uint256 i; i < spendAssets_.length; i++) {
            preCallSpendAssetBalances_[i] = ERC20(spendAssets_[i]).balanceOf(_vaultProxy);

            // Grant adapter access to the spend assets.
            // spendAssets_ is already asserted to be a unique set.
            if (spendAssetsHandleType_ == SpendAssetsHandleType.Approve) {
                // Use exact approve amount, and reset afterwards
                __approveAssetSpender(_guardianProxy, spendAssets_[i], _adapter, maxSpendAssetAmounts_[i]);
            } else if (spendAssetsHandleType_ == SpendAssetsHandleType.Transfer) {
                __withdrawAssetTo(_guardianProxy, spendAssets_[i], _adapter, maxSpendAssetAmounts_[i]);
            }
        }
    }

    /// @dev Helper to reconcile incoming and spend assets after executing CoI
    function __postProcessCoI(
        address _guardianProxy,
        address _vaultProxy,
        address _adapter,
        address[] memory _incomingAssets,
        uint256[] memory _preCallIncomingAssetBalances,
        uint256[] memory _minIncomingAssetAmounts,
        SpendAssetsHandleType _spendAssetsHandleType,
        address[] memory _spendAssets,
        uint256[] memory _maxSpendAssetAmounts,
        uint256[] memory _preCallSpendAssetBalances
    ) private returns (uint256[] memory incomingAssetAmounts_, uint256[] memory spendAssetAmounts_) {
        // INCOMING ASSETS

        incomingAssetAmounts_ = new uint256[](_incomingAssets.length);
        for (uint256 i; i < _incomingAssets.length; i++) {
            incomingAssetAmounts_[i] =
                __getVaultAssetBalance(_vaultProxy, _incomingAssets[i]).sub(_preCallIncomingAssetBalances[i]);
            require(
                incomingAssetAmounts_[i] >= _minIncomingAssetAmounts[i],
                "__postProcessCoI: Received incoming asset less than expected"
            );

            // Even if the asset's previous balance was >0, it might not have been tracked
            __addTrackedAsset(_guardianProxy, _incomingAssets[i]);
        }

        // SPEND ASSETS

        spendAssetAmounts_ = new uint256[](_spendAssets.length);
        for (uint256 i; i < _spendAssets.length; i++) {
            // Calculate the balance change of spend assets. Ignore if balance increased.
            uint256 postCallSpendAssetBalance = __getVaultAssetBalance(_vaultProxy, _spendAssets[i]);
            if (postCallSpendAssetBalance < _preCallSpendAssetBalances[i]) {
                spendAssetAmounts_[i] = _preCallSpendAssetBalances[i].sub(postCallSpendAssetBalance);
            }

            // Reset any unused approvals
            if (
                _spendAssetsHandleType == SpendAssetsHandleType.Approve
                    && ERC20(_spendAssets[i]).allowance(_vaultProxy, _adapter) > 0
            ) {
                __approveAssetSpender(_guardianProxy, _spendAssets[i], _adapter, 0);
            } else if (_spendAssetsHandleType == SpendAssetsHandleType.None) {
                // Only need to validate _maxSpendAssetAmounts if not SpendAssetsHandleType.Approve
                // or SpendAssetsHandleType.Transfer, as each of those implicitly validate the max
                require(
                    spendAssetAmounts_[i] <= _maxSpendAssetAmounts[i],
                    "__postProcessCoI: Spent amount greater than expected"
                );
            }
        }

        return (incomingAssetAmounts_, spendAssetAmounts_);
    }

    ///////////////////
    // STATE GETTERS //
    ///////////////////

    /// @notice Gets the `_valueEvaluator` variable
    /// @return valueInterpreter_ The `_valueEvaluator` variable value
    function getValueEvaluator() public view returns (address valueInterpreter_) {
        return _valueEvaluator;
    }
}
