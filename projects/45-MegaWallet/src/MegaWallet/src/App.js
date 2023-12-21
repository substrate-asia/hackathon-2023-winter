import React, { useEffect, useRef, useState } from 'react'

// ... (其他的导入)
import axios from 'axios'

import './App.css'
import alanBtn from "@alan-ai/alan-sdk-web"
import {
  Box, Button, Flex, Img, Spacer, useBreakpointValue,
} from '@chakra-ui/react'
// import { useState } from 'react'
import { connectWallet } from './utils/connectWallet'
import { ChakraProvider } from '@chakra-ui/react'
import Web3 from 'web3'
import { Core } from '@walletconnect/core'
import { Text } from "@chakra-ui/react"
import { IDKitWidget, CredentialType } from '@worldcoin/idkit'
import { Web3Button } from '@web3modal/react'
import { ChainId, Token, WETH, Trade, Route, Percent, TradeType } from '@uniswap/v3-sdk'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
//import { NonfungiblePositionManager, SwapRouter } from '@uniswap/v3-periphery'
import {
  Connection,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  clusterApiUrl, LAMPORTS_PER_SOL, PublicKey
} from '@solana/web3.js';

import * as buffer from "buffer";
import bs58 from "bs58";
window.Buffer = buffer.Buffer;
let alanBtnInstance
function App () {
  const alanBtnContainer = useRef();
  const logoEl = useRef();
  const web3 = new Web3(Web3.givenProvider || 'https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletAddress, setshowWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const name2addr = {
    'BOYU': '0x7e106F7951E73e513641cCF154C34aEBc986DE11',
    'BOB': '0x57b8AeEcD8a396856C64ffcB442d13CA382e6Ce4',
    'ALICE': '0x15a0c85082301573B1664586d101CAF2fF86bC8B',
    'DAVID': '0xae26fC8A9A3396a309e57963834457681f473C2D'
  };
  const sendTransaction = async (fromAddress, toAddress, amount) => {
    try {
      const ethAmount = web3.utils.toWei(amount, 'ether');
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(fromAddress);

      const txObject = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toHex(ethAmount),
        gas: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(gasPrice),
        nonce: web3.utils.toHex(nonce),
      };

      web3.eth.sendTransaction(txObject)
          .on('transactionHash', (hash) => {
            console.log('Transaction hash:', hash);
          })
          .on('error', (error) => {
            console.error('Error while sending transaction:', error);
          });
    } catch (error) {
      console.error('Error while sending transaction:', error);
    }
  };

  const getBalance = async (address) => {
    try {
      const balanceWei = await web3.eth.getBalance(address);
      const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
      await alanBtnInstance.activate();
      alanBtnInstance.playText("Your balance is " + balanceEther);
      return balanceEther;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  };


  const handleWalletConnection = async () => {
    try {
      // 请求用户连接钱包
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const connectedAddress = accounts[0];
      if (connectedAddress) {
        setWalletAddress(connectedAddress);
        setshowWalletAddress(connectedAddress.slice(0, 8));
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const wordToNumber = (word) => {
    switch (word) {
      case 'one':
        return '1';
      case 'two':
        return '2';
      case 'three':
        return '3';
      case 'four':
        return '4';
      case 'five':
        return '5';
      case 'six':
        return '6';
      case 'seven':
        return '7';
      case 'eight':
        return '8';
      case 'nine':
        return '9';
      default:
        return word;
    }
  }





  useEffect(() => {
    alanBtnInstance = alanBtn({
      key: '495c9d232960c1cf6604686c36a6cc3f2e956eca572e1d8b807a3e2338fdd0dc/stage',
      rootEl: alanBtnContainer.current,
      onCommand: (commandData) => {
        console.log(commandData);
        if (commandData.command === 'transfer') {

          let fromUser = commandData.data.fromUser;
          let toUser = commandData.data.toUser;
          let num = wordToNumber(commandData.data.num);
          console.log(name2addr[fromUser.toUpperCase()], name2addr[toUser.toUpperCase()], num);
          sendTransaction(name2addr[fromUser.toUpperCase()], name2addr[toUser.toUpperCase()], num);

          console.log("fromUser", fromUser);
          console.log(commandData.data);
        }
        if (commandData.command === 'checkBalance') {
          console.log(commandData.data);
          let user = commandData.data.user;
          getBalance(name2addr[user.toUpperCase()]);
        }
      }
    });
  }, []);

  return (
    <ChakraProvider>
      <div className="App">

        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1rem"
          boxShadow="md"
          height="8vh"
        >
          <Box>
            <h1 className="logo">LightWallet</h1>
          </Box>
          <Spacer />
          <Button colorScheme="gray" onClick={handleWalletConnection}>
            {walletAddress ? showWalletAddress : 'Connect Wallet'}
          </Button>
        </Flex>
        <header className="App-header">
          {balance !== null && (
            <p>Balance: {balance} ETH</p>
          )}
          <Flex align="center" justify="center" width="90%">
            <img src="https://thesource4ym.com/wp-content/uploads/2007/10/Youth-Ministry-Game-The-Blind-Leading-the-Blind-Games-with-a-Point.jpg"
              ref={logoEl}
              className="Alan-logo" alt="logo" />
            <Box marginLeft="20px">
              <Text fontSize={60} fontWeight="extrabold">
                LightWallet
              </Text>
              <Text fontSize={30} fontWeight="extrabold">
                Web3 for Visually Impaired
              </Text>
              <ul>
                <li>Say: "Hello"</li>
                <li>Say: "My name is xxx"</li>
                <li>Say: "Transfer xxx to xxx"</li>
                <li>Say: "Check my balance"</li>
                <li>"other data analysis query......"</li>
              </ul>
            </Box>
          </Flex>


          <div className="micicon" ref={alanBtnContainer}></div>

          <Box w="100%" h="20px" />

          <uu>
            Join LightWallet, which will open a door for the visually impaired and lead them to the wonders of web3
          </uu>
          <us>
            Support to Worldcoin, Metamask, WalletConnect, 1inch, Filecoin and Uniswap etc.
          </us>


        </header>
      </div>
    </ChakraProvider>

  )

}
export default App