// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.13;

interface ERC677Receiver {
    function onTokenTransfer(address _sender, uint _value, bytes memory _data) external;
}
