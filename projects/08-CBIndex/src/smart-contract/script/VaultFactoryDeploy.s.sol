// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IVaultFactory } from "../src/vault-factory/IVaultFactory.sol";
import { IValueEvaluator } from "./interfaces/IValueEvaluator.sol";
import { ChainlinkPriceFeedMixin } from "../src/price-feeds/primitives/ChainlinkPriceFeedMixin.sol";

address constant WNATIVE_TOKEN = 0xfDaF44799BA8fa3DC6af978ea142B7101c17CDD9;
uint256 constant CHAINLINK_STALE_RATE_THRESHOLD = 365 * 5 days;

address constant WNATIVE_TOKEN_USD_AGGREGATOR = 0xC0FcE24e33DB355e21d63eb91Fd35D8F65D0A1DE;

// address primitive asset
address constant WBTC = 0x9aF7D95036e2516E2c3149b79A8992345d56F80B;
address constant BTC_USD_AGGREGATOR = 0x5CA4db2bB728b0d6285A9C83d43F7503Dca12e92;
address constant WETH = 0x83Ff9c342388e77eE480Ffa262A5a0E52536fFcc;
address constant ETH_USD_AGGREGATOR = 0x46BAFFad74F525f5D3eaCE0e7D94A3A74a224eFa;
address constant WSOL = 0x73aaB0aef913eA76d5EA81c61BC31fe76023cC4f;
address constant SOL_ETH_AGGREGATOR = 0xf283c304b29c94385C01e77ef5E08160419D5760;
address constant DAI = 0xEBeB6B2744469111dBA0e5B0C7FBdC88c1427544;
address constant DAI_USD_AGGREGATOR = 0xaF4c3cB96c011Bd123a5aeB7C8eaf5E17f5Ca080;

enum ChainlinkRateAsset {
    ETH,
    USD
}
contract VaultFactoryDeploy is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // deploy lib contract
        address guardianLogicAddress = deployCode("GuardianLogic.sol");
        address beaconGuardianLogicAddress = deployCode("Beacon.sol",abi.encode(guardianLogicAddress));
        address vaultLogicAddress = deployCode("VaultLogic.sol");
        address beaconVaultLogicAddress = deployCode("Beacon.sol",abi.encode(vaultLogicAddress));
        address vaultFactoryAddress = deployCode("VaultFactory.sol",abi.encode(beaconGuardianLogicAddress,beaconVaultLogicAddress));
        console.log("vaultFactoryAddress",vaultFactoryAddress);
        address vauleEvaluatorAddress = deployCode("ValueEvaluator.sol", abi.encode(vaultFactoryAddress, WNATIVE_TOKEN, CHAINLINK_STALE_RATE_THRESHOLD));
        console.log("vauleEvaluatorAddress",vauleEvaluatorAddress);
        address integrationManagerAddress = deployCode("IntegrationManager.sol", abi.encode(vaultFactoryAddress, vauleEvaluatorAddress));
        console.log("integrationManagerAddress",integrationManagerAddress);
        address globalSharedAddress = deployCode("GlobalShared.sol", abi.encode(vaultFactoryAddress, integrationManagerAddress, vauleEvaluatorAddress, WNATIVE_TOKEN));
        console.log("globalSharedAddress",globalSharedAddress);
        // set vault factory global shared
        IVaultFactory(vaultFactoryAddress).setGlobalShared(globalSharedAddress);
        // active vault factory
        IVaultFactory(vaultFactoryAddress).activate();
        // set value evaluator eth usd aggregator
        IValueEvaluator(vauleEvaluatorAddress).setEthUsdAggregator(WNATIVE_TOKEN_USD_AGGREGATOR);
        // set value evaluator primitives aggregator
        address[] memory erc20AddressList = new address[](4);
        erc20AddressList[0] = WBTC;
        erc20AddressList[1] = WETH;
        erc20AddressList[2] = WSOL;
        erc20AddressList[3] = DAI;
        address[] memory chainlinkAggregatorAddressList = new address[](4);
        chainlinkAggregatorAddressList[0] = BTC_USD_AGGREGATOR;
        chainlinkAggregatorAddressList[1] = ETH_USD_AGGREGATOR;
        chainlinkAggregatorAddressList[2] = SOL_ETH_AGGREGATOR;
        chainlinkAggregatorAddressList[3] = DAI_USD_AGGREGATOR;
        uint8[] memory rateAssetList = new uint8[](4);
        rateAssetList[0] = uint8(ChainlinkRateAsset.USD);
        rateAssetList[1] = uint8(ChainlinkRateAsset.USD);
        rateAssetList[2] = uint8(ChainlinkRateAsset.USD);
        rateAssetList[3] = uint8(ChainlinkRateAsset.USD);
        IValueEvaluator(vauleEvaluatorAddress).addPrimitives(erc20AddressList,chainlinkAggregatorAddressList,rateAssetList);
        vm.stopBroadcast();
    }
}
 