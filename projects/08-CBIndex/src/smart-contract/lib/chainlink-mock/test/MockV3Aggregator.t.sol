// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/MockV3Aggregator.sol";

contract MockV3AggregatorTest is Test {

    MockV3Aggregator mockV3Aggregator;

    function setUp() public {
        mockV3Aggregator = new MockV3Aggregator(8, 38000 * 10**8);
    }

    function testLatestRoundData() public {
        (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) = mockV3Aggregator.latestRoundData();
        console.log("roundId", uint(roundId));
        console.log("answer", uint(answer));
        console.log("startedAt", uint(startedAt));
        console.log("updatedAt", uint(updatedAt));
        console.log("answeredInRound", uint(answeredInRound));
        assertEq(answer, 38000 * 10**8);
    }

    function testUpdateRoundData() public {
        mockV3Aggregator.updateRoundData(2, 28000 * 10**8, 2, 2);
        (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) = mockV3Aggregator.latestRoundData();
        console.log("roundId", uint(roundId));
        console.log("answer", uint(answer));
        console.log("startedAt", uint(startedAt));
        console.log("updatedAt", uint(updatedAt));
        console.log("answeredInRound", uint(answeredInRound));
        assertEq(answer, 28000 * 10**8);
    }
}