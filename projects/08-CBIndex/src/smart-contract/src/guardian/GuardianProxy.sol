// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import { BeaconProxy } from "openzeppelin/proxy/beacon/BeaconProxy.sol";

/// @title A title that should describe the contract/interface
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details

contract GuardianProxy is BeaconProxy {
    constructor(address _beacon, bytes memory _data) BeaconProxy(_beacon, _data) {
        _changeAdmin(msg.sender);
    }

    modifier onlyContractOwner() {
        require(msg.sender == _getAdmin(), "Only admin can call this function");
        _;
    }

    function getAdmin() external view returns (address) {
        return _getAdmin();
    }

    function changeAdmin(address _newAdmin) external onlyContractOwner {
        _changeAdmin(_newAdmin);
    }

    function upgradeProxy(address _newBeacon, bytes memory data) external onlyContractOwner {
        _upgradeBeaconToAndCall(_newBeacon, data, false);
    }
}