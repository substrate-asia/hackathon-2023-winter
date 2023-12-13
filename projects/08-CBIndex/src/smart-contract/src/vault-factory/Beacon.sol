// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import { UpgradeableBeacon } from "openzeppelin/proxy/beacon/UpgradeableBeacon.sol";


contract Beacon is UpgradeableBeacon {
    constructor(address _implementation) UpgradeableBeacon(_implementation) {}
}