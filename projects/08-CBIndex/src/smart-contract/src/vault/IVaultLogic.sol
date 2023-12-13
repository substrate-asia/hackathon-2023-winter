// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

interface IVaultLogic {
    enum VaultAction {
        None,
        // Shares management
        BurnShares,
        MintShares,
        TransferShares,
        // Asset management
        AddTrackedAsset,
        ApproveAssetSpender,
        RemoveTrackedAsset,
        WithdrawAssetTo
    }

    function getCreator() external view returns (address creator_);

    function getAccessor() external view returns (address accessor_);

    function getOwner() external view returns (address owner_);

    function addTrackedAsset(address _asset) external;

    function burnShares(address _account, uint256 _sharesAmount) external;

    function mintShares(address _account, uint256 _sharesAmount) external;

    function transferShares(
        address _from,
        address _to,
        uint256 _sharesAmount
    ) external;

    function withdrawAssetTo(
        address _asset,
        address _target,
        uint256 _amount
    ) external;
    
    function getTrackedAssets() external view returns (address[] memory);

    function isTrackedAsset(address) external view returns (bool);

    function receiveValidatedVaultAction(VaultAction, bytes calldata) external;

    function setSymbol(string calldata) external;

    function initialize(address _globalShared,address _owner, address _accessor, string calldata _fundName) external;
}