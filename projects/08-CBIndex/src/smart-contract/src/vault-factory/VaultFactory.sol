// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import  { IGuardianLogic } from "../guardian/IGuardianLogic.sol";
import  { GuardianProxy } from "../guardian/GuardianProxy.sol";
import  { IVaultLogic } from "../vault/IVaultLogic.sol";
import { IGlobalShared } from "../utils/IGlobalShared.sol";
import { VaultProxy } from "../vault/VaultProxy.sol";
import { IExtension } from "../extensions/IExtension.sol";

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract VaultFactory {
    event GuardianLibSet(address guardianLibSet);

    event GuardianProxyDeployed(
        address indexed creator,
        address guardianProxy,
        address indexed denominationAsset,
        uint256 sharesActionTimelock
    );

    event NewVaultCreated(address indexed creator, address vaultProxy, address guardianProxy);

    event Activated();

    event GlobalSharedSet(address globalShared);

    // Constants
    address private immutable _creator;
    
    // pseudoConstant(can only be set once)
    address private _globalShared;

    // Storage
    bool internal _activated;
    address private _beaconGuardianLogic;
    address private _beaconVaultLogic;

    modifier onlyCreator() {
        require(msg.sender == _creator, "Only Creator can call this function");
        _;
    }

    modifier onlyActivated() {
        require(isActivated(), "contract is not yet activate");
        _;
    }

    modifier pseudoConstant(address _storageValue) {
        require(_storageValue == address(0), "This value can only be set once");
        _;
    }

    constructor(address beaconGuardianLogic_, address beaconVaultLogic_) {
        _creator = msg.sender;

        _beaconGuardianLogic = beaconGuardianLogic_;
        _beaconVaultLogic = beaconVaultLogic_;
    }

    /// PSEUDO-CONSTANTS (only set once)

    /// @notice Sets the GlobalShared contract address
    /// @param globalShared_ The address of the GlobalShared contract
    function setGlobalShared(address globalShared_) external onlyCreator pseudoConstant(getGlobalShared()) {
        _globalShared = globalShared_;
        emit GlobalSharedSet(globalShared_);
    }

    /// PUBLIC FUNCTIONS

    /// @notice Gets the current owner of the contract
    /// @return owner_ The contract owner address
    function getOwner() public view  returns (address owner_) {
        return getCreator();
    }

    /// @notice Set vaultFactory activated
    function activate() external onlyCreator {
        require(!isActivated(), "activate: Already Activated");

        // All pseudo-constants should be set
        require(getGlobalShared() != address(0), "activate: globalShared is not set");

        _activated = true;

        emit Activated();
    }

    /// CREATE VAULT FUNCTIONS

    /// @notice Creates a new vault
    /// @param _vaultName The name of the vault
    /// @param _vaultSymbol The symbol of the vault
    /// @param _denominationAsset The address of the denomination asset
    /// @param _sharesActionTimelock The timelock for shares actions
    function createNewVault(
        string calldata _vaultName,
        string calldata _vaultSymbol,
        address _denominationAsset,
        uint256 _sharesActionTimelock
    ) external onlyActivated returns (address guardianProxy_, address vaultProxy_) {

        address canonicalSender = msg.sender;

        guardianProxy_ = __deployGuardianProxy(canonicalSender, _denominationAsset, _sharesActionTimelock);

        vaultProxy_ = __deployVaultProxy(canonicalSender, guardianProxy_, _vaultName, _vaultSymbol);

        IGuardianLogic guardianProxyContract = IGuardianLogic(guardianProxy_);
        guardianProxyContract.setVaultProxy(vaultProxy_);

        __configureExtensions(guardianProxy_, vaultProxy_);

        guardianProxyContract.activate();

        emit NewVaultCreated(canonicalSender, vaultProxy_, guardianProxy_);

        return (guardianProxy_, vaultProxy_);
    }

    /// @dev Helper function to deploy a configured GuardianProxy
    function __deployGuardianProxy(
        address _canonicalSender,
        address _denominationAsset,
        uint256 _sharesActionTimelock
    ) private returns (address guardianProxy_) {
        bytes memory constructData =
            abi.encodeWithSelector(IGuardianLogic.initialize.selector, getGlobalShared(), _denominationAsset, _sharesActionTimelock);
        guardianProxy_ = address(new GuardianProxy(getGuardianLib(), constructData));

        emit GuardianProxyDeployed(_canonicalSender, guardianProxy_, _denominationAsset, _sharesActionTimelock);

        return guardianProxy_;
    }

    /// @dev Helper to deploy a new VaultProxy instance during vault creation.
    /// Avoids stack-too-deep error.
    function __deployVaultProxy(
        address _vaultOwner,
        address _guardianProxy,
        string calldata _vaultName,
        string calldata _vaultSymbol
    ) private returns (address vaultProxy_) {
        bytes memory constructData =
            abi.encodeWithSelector(IVaultLogic.initialize.selector, getGlobalShared(),_vaultOwner, _guardianProxy, _vaultName);
        vaultProxy_ = address(new VaultProxy(getVaultLib(), constructData));
        if (bytes(_vaultSymbol).length != 0) {
            IVaultLogic(vaultProxy_).setSymbol(_vaultSymbol);
        }

        return vaultProxy_;
    }

    /// @dev Helper function to configure the Extensions for a given GuardianProxy
    function __configureExtensions(
        address _guardianProxy,
        address _vaultProxy
    ) private {
        IExtension(IGlobalShared(getGlobalShared()).getIntegrationManager()).setConfigForVault(
            _guardianProxy, _vaultProxy, ""
        );
    }

    /// public getters

    /// @notice Gets the address of the contract creator
    /// @return creator_ The address of the contract creator
    function getCreator() public view returns (address creator_) {
        return _creator;
    }

    /// @notice Gets the address of the GlobalShared contract
    /// @return globalShared_ The address of the GlobalShared contract
    function getGlobalShared() public view returns (address globalShared_) {
        return _globalShared;
    }

    /// @notice Checks if factory is activated
    /// @return activated_ True if factory is activated
    function isActivated() public view returns (bool activated_) {
        return _activated;
    }

    /// @notice Gets the address of the VaultLogic contract
    /// @return vaultLib_ The address of the VaultLogic contract
    function getVaultLib() public view returns (address vaultLib_) {
        return _beaconVaultLogic;
    }

    /// @notice Gets the address of the GuardianLogic contract
    /// @return guardianLib_ The address of the GuardianLogic contract
    function getGuardianLib() public view returns (address guardianLib_) {
        return _beaconGuardianLogic;
    }
}

