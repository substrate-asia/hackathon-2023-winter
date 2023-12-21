// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

interface IVaultFactory {
     function getOwner() external view returns (address);
     function setGlobalShared(address) external;
     function activate() external;
     function getCreator() external view returns (address creator_);
     function getGlobalShared() external view returns (address globalShared_);
     function isActivated() external view returns (bool activated_);
     function getVaultLib() external view returns (address vaultLib_);
     function getGuardianLib() external view returns (address guardianLib_);
     function createNewVault(
        string calldata _vaultName,
        string calldata _vaultSymbol,
        address _denominationAsset,
        uint256 _sharesActionTimelock
    ) external  returns (address guardianProxy_, address vaultProxy_);
}