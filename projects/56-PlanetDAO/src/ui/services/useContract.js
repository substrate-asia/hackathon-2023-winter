import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import HCABI from "./json/HCABI.json"
import Web3 from 'web3';
import chains from "./json/chains.json"
import IGPABI from "./json/IGPABI.json"
import ERC20Singleton from './ERC20Singleton';
import erc20 from '../contracts/deployments/moonbase/PlanetDAO.json';
import { useUtilsContext } from '../contexts/UtilsContext';
import HDWalletProvider from '@truffle/hdwallet-provider'
import PlanetDAO from '../contracts/deployments/moonbase/PlanetDAO.json';

let providerURL = 'https://rpc.api.moonbase.moonbeam.network';

export default function useContract() {
	const [contractInstance, setContractInstance] = useState({
		contract: null,
		signerAddress: null,
		sendTransaction: sendTransaction,
		formatTemplate: formatTemplate,
		saveReadMessage: saveReadMessage
	})
	const { LoadSmartAccount } = useUtilsContext();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (window.localStorage.getItem("login-type") === "metamask") {
					const provider = new ethers.providers.Web3Provider(window.ethereum);
					const signer = provider.getSigner();
					const contract = { contract: null, signerAddress: null, sendTransaction: sendTransaction, formatTemplate: formatTemplate, saveReadMessage: saveReadMessage };

					window.provider = provider;


					let contract2 = await ERC20Singleton();
					contract.contract = contract2;
					window.contract = contract2;


					window.sendTransaction = sendTransaction;
					window.signer = signer;
					contract.signerAddress = (await signer.getAddress())?.toString()?.toLocaleLowerCase();
					window.signerAddress = contract.signerAddress;

					setContractInstance(contract);
					console.clear();
				} else {
					const contract = { contract: null, signerAddress: null, sendTransaction: sendTransaction, formatTemplate: formatTemplate, saveReadMessage: saveReadMessage };

					// Define provider
					const provider = new ethers.providers.JsonRpcProvider(providerURL, {
						chainId: 1287,
						name: 'moonbase-alphanet'
					});
					let signer = provider;
					const contract2 = new ethers.Contract(erc20.address, erc20.abi, signer)
					contract.contract = contract2;
					window.contract = contract2;
					setContractInstance(contract);

				}
			} catch (error) {
				console.error(error)
			}
		}

		fetchData()
	}, [])


	async function sendTransaction(methodWithSignature) {
		if (Number(window.ethereum.networkVersion) === 1287) { //If it is sending from Moonbase then it will not use bridge
			const tx = {
				...methodWithSignature,
				value: 0,
			}
			await (await window.signer.sendTransaction(tx)).wait();
			return;
		}


		let chainInfo = getChain(Number(window.ethereum.networkVersion));
		let encoded = methodWithSignature.data


		const txs = [];
		let gasAmount = 1852656;
		var domain_id = 1287; //Moonbase alpha Domain ID where main contract is deployed

		//HyperCall contract

		const providerURL = chainInfo.rpc[0];
		// Define provider
		const provider = new ethers.providers.JsonRpcProvider(providerURL, {
			chainId: chainInfo.chainId
		});
		const HCcontract = new ethers.Contract(chainInfo.HCA, HCABI.abi, provider)


		//Transaction 1
		const tx1 = await HCcontract.populateTransaction.sendTransaction(domain_id, chainInfo.ICA, erc20.address, 0, encoded)
		const tx1Full = {
			to: chainInfo.HCA, // destination smart contract address
			data: tx1.data
		}
		txs.push(tx1Full);

		const provider2 = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider2.getSigner();
		const IGPcontract = new ethers.Contract(chainInfo.IGP, IGPABI.abi, signer)
		let weiGasFee = await IGPcontract.quoteGasPayment(domain_id, gasAmount);
		let gasFee = weiGasFee;

		//Transaction 2
		const txIGP = await HCcontract.populateTransaction.processMessage(domain_id, chainInfo.IGP, gasAmount)
		const txIGPFull = {
			to: chainInfo.HCA, // destination smart contract address
			data: txIGP.data,
			value: gasFee
		}
		txs.push(txIGPFull);
		console.log(txs);

		if (chainInfo.chainId == 5) { // If it is Goerli then use Biconomy
			await sendBiconomyBatchTX(txs);
		} else {
			//Send tx1 normally
			const tx_normal1 = {
				...tx1,
				value: 0,
			}
			await (await window.signer.sendTransaction(tx_normal1)).wait();

			//Send tx2 normally
			const tx_normal2 = {
				...txIGP,
				value: gasFee,
			}
			await (await window.signer.sendTransaction(tx_normal2)).wait();

		}

	}

	async function sendBiconomyBatchTX(txs) {

		let smartAccount = await LoadSmartAccount();


		//First check if smart account has balance for deploying
		if ((await smartAccount.isDeployed()) == false) {

			const Web3 = require("web3")
			const web3 = new Web3(window.ethereum)
			await web3.eth.sendTransaction({ to: smartAccount.address, from: window?.ethereum?.selectedAddress, value: 1 * 1e15 })

		}


		const feeQuotes = await smartAccount.getFeeQuotesForBatch({
			transactions: txs,
		});

		// Choose a fee quote of your choice provided by the relayer
		const transaction = await smartAccount.createUserPaidTransactionBatch({
			transactions: txs,
			feeQuote: feeQuotes[0],
		});
		// optional
		let gasLimit = {
			hex: "0x1E8480",
			type: "hex",
		};
		const txHash = await smartAccount.sendUserPaidTransaction({ tx: transaction, gasLimit });

	}


	return contractInstance
}



export function getChain(chainid) {
	for (let i = 0; i < chains.allchains.length; i++) {
		const element = chains.allchains[i]
		if (element.chainId === chainid) {
			return element
		}
	}
	return chains.allchains[0];
}

export function formatTemplate(template, changings) {



	for (let i = 0; i < changings.length; i++) {
		const element = changings[i];
		template = template.replaceAll("{{" + element.key + "}}", element.value);
	}
	return template;

}


export async function saveReadMessage(messageid, ideasid, msg_type) {

	let myPrivateKeyHex = "1aaf69473f4f8f88822046eb5f8d3e30f06eb290e82e32162dcf96bd5d8a2495";

	// Create web3.js middleware that signs transactions locally
	const localKeyProvider = new HDWalletProvider({
		privateKeys: [myPrivateKeyHex],
		providerOrUrl: providerURL,
	});
	const web3 = new Web3(localKeyProvider);
	if ((await contract.getReadMsg(messageid, msg_type)) || (await web3.eth.getPendingTransactions().length) > 0) {
		return;
	}

	const myAccount = web3.eth.accounts.privateKeyToAccount(myPrivateKeyHex);

	const PlanetDAOContract = new web3.eth.Contract(PlanetDAO.abi, PlanetDAO.address).methods

	window.PlanetDAOContract = PlanetDAOContract;
	await PlanetDAOContract.sendReadMsg(messageid, ideasid, Number(window.userid), msg_type).send({ from: myAccount.address });

	console.log("read message ->", messageid)

}