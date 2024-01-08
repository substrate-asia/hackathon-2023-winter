import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
require("@nomiclabs/hardhat-etherscan");

dotenv.config();

module.exports = {
	//Specifing Moonbase Testnet network for smart contract deploying
	networks: {
		moonbase: {
			url: "https://rpc.api.moonbase.moonbeam.network",
			accounts: [`b672a502a2a0942705d989a1db0c9d9904f45c32f35c0f6b7c5180420fd073df`],
			chainId: 1287,
			gasPrice: 10_000_000_000
		},
	},
	//Specifing Solidity compiler version
	solidity: {
		compilers: [
			{
				version: '0.8.17',
			},
		],
	},
	//Specifing Account to choose for deploying
	namedAccounts: {
		deployer: 0,
	},
	etherscan: {
		apiKey: {
		  moonbaseAlpha: "DH9NSRY95A8HB9BBJUWD6U113RGZZJJ8UH", // Moonbeam Moonscan API Key    
		}
	  }
};