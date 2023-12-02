// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import { ERC20 } from "openzeppelin/token/ERC20/ERC20.sol";
import { SafeERC20 } from "openzeppelin/token/ERC20/utils/SafeERC20.sol";
import { SharesTokenBase } from "./SharesTokenBase.sol";
import { Initializable } from "openzeppelin/proxy/utils/Initializable.sol";
import { IWETH } from "../external-interfaces/IWETH.sol";
import { AddressArrayLib } from "../utils/AddressArrayLib.sol";
import { IVaultLogic } from "./IVaultLogic.sol";
import { IGlobalShared } from "../utils/IGlobalShared.sol";

contract VaultLogic is IVaultLogic, SharesTokenBase, Initializable {
    event AccessorSet(address prevAccessor, address nextAccessor);

    event OwnerSet(address prevOwner, address nextOwner);

    event AssetWithdrawn(address indexed asset, address indexed target, uint256 amount);

    event TrackedAssetAdded(address asset);

    event TrackedAssetRemoved(address asset);

    event EthReceived(address indexed sender, uint256 amount);

    event NameSet(string name);

    event SymbolSet(string symbol);
    // Global shared
    address internal _globalShared;

    address internal _accessor;
    // dispatcher adrress
    address internal _creator;
    address internal _owner;
    string internal _vaultName;

    address[] internal _trackedAssets;
    mapping(address => bool) internal _assetToIsTracked;

    using AddressArrayLib for address[];
    using SafeERC20 for ERC20;

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner can call this function");
        _;
    }

     modifier onlyAccessor() {
        require(msg.sender == _accessor, "Only the designated accessor can make this call");
        _;
    }

    modifier notShares(address _asset) {
        require(_asset != address(this), "Cannot act on shares");
        _;
    }

    /// @dev Initializes the VaultProxy with the initial VaultLogic implementation
    function initialize(address globalShared_, address owner_, address accessor_, string calldata vaultName_) external initializer {
        _globalShared = globalShared_;
        _sharesName = vaultName_;
        _creator = msg.sender;
        __setOwner(owner_);
        __setAccessor(accessor_);
    }

    /// @dev If receives ETH, immediately wrap into WETH. 
    receive() external payable {
        uint256 ethAmount = payable(address(this)).balance;
        IWETH(payable(IGlobalShared(getGlobalShared()).getWethToken())).deposit{value: ethAmount}();

        emit EthReceived(msg.sender, ethAmount);
    }

    function setName(string calldata _nextName) external onlyOwner {
        _sharesName = _nextName;

        emit NameSet(_nextName);
    }

    /// @notice Set the symbol of the shares token
    function setSymbol(string calldata _nextSymbol) external override {
        require(msg.sender == _owner || msg.sender == IGlobalShared(getGlobalShared()).getVaultFactory(), "Unauthorized");

        _sharesSymbol = _nextSymbol;

        emit SymbolSet(_nextSymbol);
    }

    /// @notice add a tracked asset
    /// @param _asset Address of the asset to track
    function addTrackedAsset(address _asset) external override onlyAccessor() {
            __addTrackedAsset(_asset);
    }

    /// @notice burn shares
    /// @param _account Address of the account to burn shares from
    /// @param _amount Amount of shares to burn
    function burnShares(address _account, uint256 _amount) external override onlyAccessor {
        __burn(_account, _amount);
    }

    /// @notice Mint shares
    /// @param _account Address of the account to mint shares to
    /// @param _amount Amount of shares to mint
    function mintShares(address _account, uint256 _amount) external override onlyAccessor {
        __mint(_account, _amount);
    }
    
    /// @notice transfer shares
    function transferShares(address _from, address _to, uint256 _amount) external override onlyAccessor() {
        __transfer(_from, _to, _amount);
    }

    /// @notice withdraw an asset to a specified recipient
    function withdrawAssetTo(address _asset, address _target, uint256 _amount) external override onlyAccessor {
        __withdrawAssetTo(_asset, _target, _amount);
    }

    // VAULT ACTIONS DISPATCHER
    
    /// @notice Dispatches a call initiated from an Extension, validated by the ComptrollerProxy
    /// @param _action The VaultAction to perform
    /// @param _actionData The call data for the action to perform
    function receiveValidatedVaultAction(VaultAction _action, bytes calldata _actionData)
        external
        override
        onlyAccessor
    {
        if (_action == VaultAction.AddTrackedAsset) {
            __executeVaultActionAddTrackedAsset(_actionData);
        } else if (_action == VaultAction.ApproveAssetSpender) {
            __executeVaultActionApproveAssetSpender(_actionData);
        } else if (_action == VaultAction.BurnShares) {
            __executeVaultActionBurnShares(_actionData);
        } else if (_action == VaultAction.MintShares) {
            __executeVaultActionMintShares(_actionData);
        } else if (_action == VaultAction.RemoveTrackedAsset) {
            __executeVaultActionRemoveTrackedAsset(_actionData);
        } else if (_action == VaultAction.TransferShares) {
            __executeVaultActionTransferShares(_actionData);
        } else if (_action == VaultAction.WithdrawAssetTo) {
            __executeVaultActionWithdrawAssetTo(_actionData);
        }
    }

    /// @dev Helper to decode actionData and execute VaultAction.AddTrackedAsset
    function __executeVaultActionAddTrackedAsset(bytes memory _actionData) private {
        __addTrackedAsset(abi.decode(_actionData, (address)));
    }

    /// @dev Helper to decode actionData and execute VaultAction.ApproveAssetSpender
    function __executeVaultActionApproveAssetSpender(bytes memory _actionData) private {
        (address asset, address target, uint256 amount) = abi.decode(_actionData, (address, address, uint256));

        __approveAssetSpender(asset, target, amount);
    }

    /// @dev Helper to decode actionData and execute VaultAction.BurnShares
    function __executeVaultActionBurnShares(bytes memory _actionData) private {
        (address target, uint256 amount) = abi.decode(_actionData, (address, uint256));

        __burn(target, amount);
    }

    /// @dev Helper to decode actionData and execute VaultAction.MintShares
    function __executeVaultActionMintShares(bytes memory _actionData) private {
        (address target, uint256 amount) = abi.decode(_actionData, (address, uint256));

        __mint(target, amount);
    }

    /// @dev Helper to decode actionData and execute VaultAction.RemoveTrackedAsset
    function __executeVaultActionRemoveTrackedAsset(bytes memory _actionData) private {
        __removeTrackedAsset(abi.decode(_actionData, (address)));
    }

    /// @dev Helper to decode actionData and execute VaultAction.TransferShares
    function __executeVaultActionTransferShares(bytes memory _actionData) private {
        (address from, address to, uint256 amount) = abi.decode(_actionData, (address, address, uint256));

        __transfer(from, to, amount);
    }

    /// @dev Helper to decode actionData and execute VaultAction.WithdrawAssetTo
    function __executeVaultActionWithdrawAssetTo(bytes memory _actionData) private {
        (address asset, address target, uint256 amount) = abi.decode(_actionData, (address, address, uint256));

        __withdrawAssetTo(asset, target, amount);
    }


    // INTERNAL FUNCTIONS

    /// @dev Helper to set the accessor of the VaultProxy
    /// @param _nextAccessor Address of the new accessor
    function __setAccessor(address _nextAccessor) internal {
        require(_nextAccessor != address(0), "__setAccessor: _nextAccessor cannot be empty");
        address prevAccessor = _accessor;

        _accessor = _nextAccessor;

        emit AccessorSet(prevAccessor, _nextAccessor);
    }

    /// @dev Helper to set the owner of the VaultProxy
    /// @param _nextOwner Address of the new owner
    function __setOwner(address _nextOwner) internal {
        require(_nextOwner != address(0), "__setOwner: _nextOwner cannot be empty");
        address prevOwner = _owner;
        require(_nextOwner != prevOwner, "__setOwner: _nextOwner is the current owner");

        _owner = _nextOwner;

        emit OwnerSet(prevOwner, _nextOwner);
    }


    /// @dev Helper to add a tracked asset
    function __addTrackedAsset(address _asset) private notShares(_asset) {
        if (!isTrackedAsset(_asset)) {

            _assetToIsTracked[_asset] = true;
            _trackedAssets.push(_asset);

            emit TrackedAssetAdded(_asset);
        }
    }

    /// @dev Helper to remove a tracked asset
    function __removeTrackedAsset(address _asset) private notShares(_asset) {
        if (isTrackedAsset(_asset)) {
            _assetToIsTracked[_asset] = false;
            _trackedAssets.removeStorageItem(_asset);

            emit TrackedAssetRemoved(_asset);
        }
    }

    /// @dev Helper to grant an allowance to a spender to use a vault asset
    function __approveAssetSpender(address _asset, address _target, uint256 _amount) private notShares(_asset) {
        ERC20 assetContract = ERC20(_asset);
        if (assetContract.allowance(address(this), _target) > 0) {
            assetContract.safeApprove(_target, 0);
        }
        assetContract.safeApprove(_target, _amount);
    }


    /// @dev Helper to the get the Vault's balance of a given asset
    function __getAssetBalance(address _asset) private view returns (uint256 balance_) {
        return ERC20(_asset).balanceOf(address(this));
    }

    /// @dev Helper to withdraw an asset from the vault to a specified recipient
    function __withdrawAssetTo(address _asset, address _target, uint256 _amount) private notShares(_asset) {
        ERC20(_asset).safeTransfer(_target, _amount);

        emit AssetWithdrawn(_asset, _target, _amount);
    }

    // SHARES ERC20 OVERRIDES

    /// @notice Get the `symbol` value of the shares token
    /// @return symbol_ The `symbol` value
   function symbol() public view override returns (string memory symbol_) {
        return _sharesSymbol;
    }

    /// @dev Overrides the ERC20 `_beforeTokenTransfer` hook to prevent shares from being sent to the zero address
    function transfer(address _recipient, uint256 _amount) public override returns (bool success_) {
       return super.transfer(_recipient, _amount);
    }

    /// @dev Overrides the ERC20 `_beforeTokenTransfer` hook to prevent shares from being sent to the zero address
    function transferFrom(address _sender, address _recipient, uint256 _amount)
        public
        override
        returns (bool success_)
    {
        return super.transferFrom(_sender, _recipient, _amount);
    }

    // PUBLIC FUNCTIONS

    /// @notice get the global shared address
    /// @return globalShared_ address of the global shared
    function getGlobalShared() public view returns (address globalShared_) {
        return _globalShared;
    }

    /// @notice get the assessors address
    /// @return accessor_ the assessors address
    function getAccessor() public override view returns (address accessor_) {
        return _accessor;
    }

    /// @notice get the creator address
    /// @return creator_ the creator address
    function getCreator() public view override returns (address creator_) {
        return _creator;
    }

    /// @notice get the owner address
    /// @return owner_ the owner address
    function getOwner() public view override returns (address owner_) {
        return _owner;
    }

    /// @notice get the vault name
    /// @return vaultName_ the vault name
    function getVaultName() public view returns (string memory vaultName_) {
        return _vaultName;
    }

    /// @notice get the tracked assets
    /// @return trackedAssets_ the tracked assets
    function getTrackedAssets() public view override returns (address[] memory trackedAssets_) {
        return _trackedAssets;
    }

    /// @notice check if an asset is tracked
    /// @param _asset address to check
    /// @return isTracked if the asset is tracked
    function isTrackedAsset(address _asset) public view override returns (bool isTracked) {
        return _assetToIsTracked[_asset];
    }
}