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
  userInfo:{}
});

export function PolkadotProvider({ children }) {
  const [api, setApi] = useState();
  const [deriveAcc, setDeriveAcc] = useState(null)
  const [userInfo, setUserInfo] = useState({})

  async function showToast(status,id,FinalizedText,doAfter,callToastSuccess= true, events){
 
   if (status.isInBlock) {
      toast.update(id, { render: "Transaction In block...", isLoading: true });

    }else if (status.isFinalized) {
      if (callToastSuccess)
      toast.update(id, { render: FinalizedText, type: "success", isLoading: false });
      doAfter(events);
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
  
  
  
        const {web3Enable} = require('@polkadot/extension-dapp');
      
        if (window.localStorage.getItem('loggedin') == "true" && window.localStorage.getItem('login-type') == "polkadot" ){
          await web3Enable('PlanetDAO');
          let userid = window.localStorage.getItem('user_id');
          const userInformation = await _api.query.users.userById(userid);
          setUserInfo(userInformation);
        }
      }catch(e){

      }
     
    })();
  },[])


  return <AppContext.Provider value={{api:api,deriveAcc:deriveAcc,showToast:showToast, userInfo:userInfo}}>{children}</AppContext.Provider>;
}

export const usePolkadotContext = () => useContext(AppContext);
