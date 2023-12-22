'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import polkadotConfig from './json/polkadot-config.json';
import { toast } from 'react-toastify';

const AppContext = createContext({
  api: null,
  deriveAcc:null,
  showToast:(status,id,FinalizedText,doAfter,callToastSuccess= true, events)=>{},
  userInfo:{},
  userWalletPolkadot: "",
  userSigner:null,
  PolkadotLoggedIn:false,
  getUserInfoById: ()=>{}
});

export function PolkadotProvider({ children }) {
  const [api, setApi] = useState();
  const [deriveAcc, setDeriveAcc] = useState(null)
  const [PolkadotLoggedIn, setPolkadotLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [userWalletPolkadot, setUserWalletPolkadot] = useState("")
  const [userSigner, setUserSigner] = useState("")

  async function showToast(status,id,FinalizedText,doAfter,callToastSuccess= true, events){
 
   if (status.isInBlock) {
      toast.update(id, { render: "Transaction In block...", isLoading: true });

    }else if (status.isFinalized) {
      if (callToastSuccess)
      toast.update(id, { render: FinalizedText, type: "success", isLoading: false,  autoClose: 1000,
      closeButton: true,
      closeOnClick: true,
      draggable: true });
      doAfter(events);
    }
  }

  async function getUserInfoById(userid){
    if (api){
      return await api.query.users.userById(userid);
    }else{
      return {};
    }
  }


  useEffect(() => {
    (async function () {
      try{
        const wsProvider = new WsProvider(polkadotConfig.chain_rpc);
        const _api = await ApiPromise.create({ provider: wsProvider });
        await _api.isReady;
  
        setApi(_api);
  
        const keyring = new Keyring({ type: 'sr25519' });
        const newPair = keyring.addFromUri(polkadotConfig.derive_acc);
        setDeriveAcc(newPair)
  
  
  
        const {web3Enable,web3Accounts, web3FromAddress} = require('@polkadot/extension-dapp');
      
        if (window.localStorage.getItem('loggedin') == "true"  ){
        
          let userid = window.localStorage.getItem('user_id');
          window.userid = userid;
          const userInformation = await _api.query.users.userById(userid);
          setUserInfo(userInformation); 
          
          if (window.localStorage.getItem('login-type') == "polkadot"){
            setPolkadotLoggedIn(true);
            await web3Enable('PlanetDAO');
            let wallet = (await web3Accounts())[0];
            const injector = await web3FromAddress(wallet.address);
  
            setUserSigner(injector.signer);
  
            setUserWalletPolkadot(wallet.address)
            window.signerAddress = wallet.address;
          }
        }
      }catch(e){

      }
     
    })();
  },[])


  return <AppContext.Provider value={{api:api,deriveAcc:deriveAcc,showToast:showToast,getUserInfoById:getUserInfoById,userWalletPolkadot:userWalletPolkadot,userSigner:userSigner,PolkadotLoggedIn:PolkadotLoggedIn, userInfo:userInfo}}>{children}</AppContext.Provider>;
}

export const usePolkadotContext = () => useContext(AppContext);
