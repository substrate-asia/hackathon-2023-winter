// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

interface IGlobalShared {
    function getVaultFactory() external view returns (address);
    function getIntegrationManager() external view returns (address);
    function getValueEvaluator() external view returns (address);
    function getWethToken() external view returns (address);
}