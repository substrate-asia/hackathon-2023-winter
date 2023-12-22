// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13;


import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";


contract BeaconERC20 is UpgradeableBeacon{
    constructor(address _impl) UpgradeableBeacon(_impl, msg.sender){}
}