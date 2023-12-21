// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

/// @title IUniswapV2Factory Interface
/// @notice Minimal interface for our interactions with the Uniswap V2's Factory contract
interface IUniswapV2Factory {
    function feeTo() external view returns (address);

    function getPair(address, address) external view returns (address);
}