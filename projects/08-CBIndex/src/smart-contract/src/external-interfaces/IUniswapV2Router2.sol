// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

/// @title UniswapV2Router2 Interface
/// @dev Minimal interface for our interactions with Uniswap V2's Router2
interface IUniswapV2Router2 {
    function addLiquidity(address, address, uint256, uint256, uint256, uint256, address, uint256)
        external
        returns (uint256, uint256, uint256);

    function removeLiquidity(address, address, uint256, uint256, uint256, address, uint256)
        external
        returns (uint256, uint256);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256,
        uint256,
        address[] calldata,
        address,
        uint256
    ) external;
}