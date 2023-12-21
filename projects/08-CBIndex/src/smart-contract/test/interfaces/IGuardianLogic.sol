// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import { IVaultLogic } from "./IVaultLogic.sol";

interface IGuardianLogic {
    function activate() external;

    function calcAum() external returns (uint256);

    function calcNav() external returns (uint256);

    function callOnExtension(address, uint256, bytes calldata) external;

    function getDenominationAsset() external view returns (address);

    function getVaultProxy() external view returns (address);

    function initialize(address, address, uint256) external;

    function permissionedVaultAction(IVaultLogic.VaultAction, bytes calldata) external;

    function setVaultProxy(address) external;

    function buyShares(uint256 _investmentAmount, uint256 _minSharesQuantity)
        external
        returns (uint256 sharesReceived_);

    function redeemSharesForSpecificAssets(
        address _recipient,
        uint256 _sharesQuantity,
        address[] calldata _payoutAssets,
        uint256[] calldata _payoutAssetPercentages
    ) external returns (uint256[] memory payoutAmounts_);
}