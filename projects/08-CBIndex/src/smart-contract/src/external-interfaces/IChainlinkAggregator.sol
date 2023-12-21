// SPDX-License-Identifier: MIT 
pragma solidity >=0.6.0 < 0.9.0;

/// @title IChainlinkAggregator Interface
interface IChainlinkAggregator {
    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80);
}
