// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

/// @title IntegrationSelectors Contract
/// @notice Selectors for integration actions
/// @dev Selectors are created from their signatures rather than hardcoded for easy verification
abstract contract IntegrationSelectors {
    // Trading
    bytes4 public constant TAKE_MULTIPLE_ORDERS_SELECTOR = bytes4(keccak256("takeMultipleOrders(address,bytes,bytes)"));
    bytes4 public constant TAKE_ORDER_SELECTOR = bytes4(keccak256("takeOrder(address,bytes,bytes)"));

    // Lending
    bytes4 public constant LEND_SELECTOR = bytes4(keccak256("lend(address,bytes,bytes)"));
    bytes4 public constant REDEEM_SELECTOR = bytes4(keccak256("redeem(address,bytes,bytes)"));

    // Staking
    bytes4 public constant STAKE_SELECTOR = bytes4(keccak256("stake(address,bytes,bytes)"));
    bytes4 public constant UNSTAKE_SELECTOR = bytes4(keccak256("unstake(address,bytes,bytes)"));

    // Rewards
    bytes4 public constant CLAIM_REWARDS_SELECTOR = bytes4(keccak256("claimRewards(address,bytes,bytes)"));

    // Combined
    bytes4 public constant LEND_AND_STAKE_SELECTOR = bytes4(keccak256("lendAndStake(address,bytes,bytes)"));
    bytes4 public constant UNSTAKE_AND_REDEEM_SELECTOR = bytes4(keccak256("unstakeAndRedeem(address,bytes,bytes)"));
}
