// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../src/ERC6551Registry.sol";
import "../src/SafeAccount.sol";
import "../src/interface/IERC6551Account.sol";
import "../src/WhaleFinance.sol";
import "../src/QuotaBeacon.sol";
import "../src/MockERC20.sol";

contract Deploy is Script {

    WhaleFinance public whaleFinance;



    function setUp() public {}

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        address stablecoin = 0xA3f156324feCc5ED3A8495C2399666a598A73ee4;

        address registry = 0x16C71580A4D79d6bE3413F5226125Efb5630D669;
        address beacon = 0xcBb864E7Af870F000F7b88eeD508Bc0392E2BE94;
        address safeAccount = 0x83988Eb399460dD07f9e37628bC61a47dc094113;

        whaleFinance = new WhaleFinance(address(registry), address(safeAccount), address(beacon), address(stablecoin));

        console.log("WhaleFinance address: %s", address(whaleFinance));
        vm.stopBroadcast();
        
    }
}
