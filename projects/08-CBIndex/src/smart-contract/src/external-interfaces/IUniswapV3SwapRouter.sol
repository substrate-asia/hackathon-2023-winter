// SPDX-License-Identifier: MIT 
pragma solidity >=0.6.0 < 0.9.0;
pragma experimental ABIEncoderV2;

/// @title IUniswapV3Router Interface
/// @dev Minimal interface for our interactions with Uniswap V3's Router
interface IUniswapV3SwapRouter {
    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    function exactInput(ExactInputParams calldata) external payable returns (uint256);
}
