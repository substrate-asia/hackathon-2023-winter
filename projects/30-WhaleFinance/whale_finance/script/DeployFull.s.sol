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

        stablecoin = new MockERC20("WUSD", "WUSD");

        stablecoin.mint(msg.sender, 1000000000000 ether);
        stablecoin.mint(0xB0Eb2a4CDf7be2D0c408cF60Ed8ba1065920b339, 100000000000000 ether);

        

        safeAccount = new SafeAccount();
        beacon = new BeaconERC20(address(quotaTokenImplementation)); //quota

        whaleFinance = new WhaleFinance(address(registry), address(safeAccount), address(beacon), address(stablecoin));
        whaleFinance.setWhiteListedToken(address(stablecoin));

        address token1 = 0x0a4cc877dAb8DDC00ed9EaDCF964930C1cB2Cf2c;
        address token2 = 0xF687Fe7Ea931B4256981F7948BFBC89289Adfd4D;
        address token3 = 0x083C06f4191e5350ba7Ce70a9Ab86c601b17cCFf;
        address token4 = 0x3E8D3319CbB430685CA1b100f83E4C882e65D635;
        whaleFinance.setWhiteListedToken(address(token1));
        whaleFinance.setWhiteListedToken(address(token2));
        whaleFinance.setWhiteListedToken(address(token3));
        whaleFinance.setWhiteListedToken(address(token4));

        console.log("Stablecoin address: %s", address(stablecoin));
        console.log("WhaleFinance address: %s", address(whaleFinance));

        vm.stopBroadcast();
        
    }
}
