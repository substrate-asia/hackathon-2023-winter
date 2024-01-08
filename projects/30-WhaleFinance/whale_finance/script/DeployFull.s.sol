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
    ERC6551Registry public registry;

    QuotaToken public quotaTokenImplementation;
    MockERC20 public stablecoin;
    SafeAccount public safeAccount;
    WhaleFinance public whaleFinance;
    BeaconERC20 public beacon;


    function setUp() public {}

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        quotaTokenImplementation = new QuotaToken();
        registry = new ERC6551Registry();

        stablecoin = MockERC20(0x22dfF2272A92e9Bc6cc960aE92373987a10Bddf2);

        stablecoin.mint(msg.sender, 1000000000000 ether);
        stablecoin.mint(0xB0Eb2a4CDf7be2D0c408cF60Ed8ba1065920b339, 100000000000000 ether);

        

        safeAccount = new SafeAccount();
        beacon = new BeaconERC20(address(quotaTokenImplementation)); //quota

        whaleFinance = new WhaleFinance(address(registry), address(safeAccount), address(beacon), address(stablecoin));
        whaleFinance.setWhiteListedToken(address(stablecoin));


        console.log("Stablecoin address: %s", address(stablecoin));
        console.log("WhaleFinance address: %s", address(whaleFinance));
        console.log("QuotaToken address: %s", address(quotaTokenImplementation));
        console.log("SafeAccount address: %s", address(safeAccount));
        console.log("Beacon address: %s", address(beacon));
        console.log("Registry address: %s", address(registry));


        vm.stopBroadcast();
        
    }
}
