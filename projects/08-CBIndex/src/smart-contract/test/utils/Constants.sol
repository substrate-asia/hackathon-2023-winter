// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

abstract contract Constants {
    // Time
    uint256 internal constant SECONDS_ONE_DAY = 60 * 60 * 24;

    // Percentages
    uint256 internal constant BPS_ONE_HUNDRED_PERCENT = 10_000;
    uint256 internal constant BPS_ONE_PERCENT = BPS_ONE_HUNDRED_PERCENT / 100;

    uint256 internal constant WEI_ONE_HUNDRED_PERCENT = 10 ** 18;
    uint256 internal constant WEI_ONE_PERCENT = WEI_ONE_HUNDRED_PERCENT / 100;

    // Network assets
    address internal constant ETHEREUM_DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address internal constant ETHEREUM_DAI_USD_AGGREGATOR = 0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9;

    address internal constant ETHEREUM_WBTC = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
    address internal constant ETHEREUM_WBTC_USD_AGGREGATOR = 0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c;

    address internal constant ETHEREUM_WSOL = 0xD31a59c85aE9D8edEFeC411D448f90841571b89c;
    address internal constant ETHEREUM_WSOL_USD_AGGREGATOR = 0x4ffC43a60e009B551865A93d232E33Fce9f01507;

    address internal constant ETHEREUM_WNATIVE_TOKEN = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address internal constant ETHEREUM_WNATIVE_TOKEN_USD_AGGREGATOR = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

    // Network config

    uint256 internal constant CHAINLINK_STALE_RATE_THRESHOLD = 30000 seconds;

    address internal constant ETHEREUM_UNISWAP_V2_ROUTER_02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
}
