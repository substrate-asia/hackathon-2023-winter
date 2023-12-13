// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

interface IValueEvaluator {
    function calcCanonicalAssetValue(address, uint256, address) external returns (uint256);

    function calcCanonicalAssetsTotalValue(address[] calldata, uint256[] calldata, address)
        external
        view
        returns (uint256);
        
    function isSupportedPrimitiveAsset(address) external view returns (bool);

    function isSupportedAsset(address) external view returns (bool);
}