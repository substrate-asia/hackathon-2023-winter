require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");

const { privateKey } = require("./secrets.js"); // Make sure to create this file and add your private key, Infura API key, and Etherscan API key

const SOLC_SETTINGS = {
  // evmVersion: "london",
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
};
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.8.20",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.8.19",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.8.17",
        settings: SOLC_SETTINGS,
      },
    ],
  },
  networks: {
    rotam: {
      url: "https://fraa-dancebox-3020-rpc.a.dancebox.tanssi.network",
      accounts: [privateKey],
    },
  },
};
