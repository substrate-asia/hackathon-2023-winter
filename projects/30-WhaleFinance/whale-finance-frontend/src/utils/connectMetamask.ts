import { ChainContext } from "@/contexts/ChainContext";
import { ethers } from "ethers";
import { useContext } from "react";
import { networks } from "./chains";
import { toast } from "@/components/ui/use-toast";

export async function connectMetamask(setChain?: (chain: number) => void){
    if(!window.ethereum){
        alert("Voce precisa da Metamask!");
    } else{
        try{
            
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            web3Provider.getNetwork().then((network) => {
              setChain? setChain(network.chainId) : (() => {})();
              if(!(network.chainId in networks)){
                toast({
                  title: "Network not supported",
                  description: "Please switch to WhaleChain Testnet",
                })
              }
            }).catch((err) => {
              console.log(err);
              
            });
            
            const accounts = await web3Provider.send('eth_requestAccounts' ,[]);
            const address = accounts[0];
            const web3Signer = web3Provider.getSigner(address);
            
            return {
                web3Provider,
                web3Signer,
                address
            }

        } catch(err){
            console.log(err);
            return null;
        }
    }
}

export function getMetamaskProvider(setChain?: (chain: number) => void){
    if(!window.ethereum){
        alert("Você precisa da Metamask!");
    } else{
        try{

            const web3Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            web3Provider.getNetwork().then((network) => {
              setChain? setChain(network.chainId) : (() => {})();

              if(!(network.chainId in networks)){
                toast({
                  title: "Network not supported",
                  description: "Please switch to WhaleChain Testnet",
                })
              }
            }).catch((err) => {
              console.log(err)
            });
            return web3Provider;

        } catch(err){
            return null;
        }
    }
}

export async function switchNetwork(chainId: number, setChain?: (chain: number) => void) {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(chainId) }],
        });
        setChain ? setChain(chainId) : (() => {})();
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: ethers.utils.hexValue(chainId),
                // Add other network details here
              }],
            });

            setChain ? setChain(chainId) : (() => {})();
          } catch (addError: any) {
            console.error(addError);
          }
        } else {
          console.error(switchError);
        }
      }
    } else {
      alert('You need to have MetaMask installed to change networks!');
    }
  }