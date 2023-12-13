// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import { IVaultLogic } from "../vault/IVaultLogic.sol";

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
}