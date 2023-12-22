import { ethers } from "ethers";

export async function connectMetamask(){
    if(!window.ethereum){
        alert("Voce precisa da Metamask!");
    } else{
        try{

            const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
            
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

export function getMetamaskProvider(){
    if(!window.ethereum){
        alert("Você precisa da Metamask!");
    } else{
        try{
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            return web3Provider;

        } catch(err){
            return null;
        }
    }
}