// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity >=0.6.11;

interface IInterchainGasPaymaster {
    function payForGas(
        bytes32 _messageId,
         uint32 _destinationDomain,
        uint256 _gasAmount,
        address _refundAddress
    ) external payable;
}
