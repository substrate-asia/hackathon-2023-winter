// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

interface IVaultFactory {
     function getOwner() external view returns (address);
     function setGlobalShared(address) external;
     function activate() external;
}