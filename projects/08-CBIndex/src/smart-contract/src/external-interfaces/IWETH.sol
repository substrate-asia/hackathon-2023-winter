// SPDX-License-Identifier: MIT 
pragma solidity >=0.6.0 <= 0.8.19;

/// @title IWETH Interface
interface IWETH {
    function deposit() external payable;

    function withdraw(uint256) external;
}
