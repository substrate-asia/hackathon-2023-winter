import React, { useState, useEffect } from 'react'
import { WsProvider, ApiPromise } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { PolkadotContext } from './PolkadotContext';
import { Signer } from '@polkadot/types/types';
import chains from '../chains.json';

const NAME="Polkadot";

export const PolkadotWalletProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  const [api, setApi] = useState<ApiPromise>()
  const [accounts, setAccounts] = useState<Array<InjectedAccountWithMeta>>([])
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta>()
  const [signer, setSigner] = useState<Signer>()

  const setup = async () => {
    const wsProvider = new WsProvider(chains["parachain-nfts"].webSocketUrl)
    const api = await ApiPromise.create({provider:wsProvider, rpc: jsonrpc})
    setApi(api)
  }

  const setNewWebSocket = async (webSocketUrl: string) => {
    const wsProvider = new WsProvider(webSocketUrl)
    const api = await ApiPromise.create({provider:wsProvider, rpc: jsonrpc})
    setApi(api)
  }

  const handleConnection = async () => {
    const extensions = await web3Enable(NAME)

    if (!extensions) {
      throw Error("NO_EXTENSION_FOUND")
    }

    const allAccounts = await web3Accounts()

    console.log(allAccounts)

    setAccounts(allAccounts)

    if (allAccounts.length === 1) {
      setSelectedAccount(allAccounts[0])
    }
  }

  const handleAccountSelection = async (e:any) => {
    const selectedAddress = e.target.value
    const account = accounts.find(account => account.address === selectedAddress)
    if (!account)  {
      throw Error("NO_ACCOUNT_FOUND")
    }

    setSelectedAccount(account)
    const injector = await web3FromAddress(account.address)
    if (!setSigner) return
    setSigner(injector.signer)
  }

  useEffect(() => {
    setup()
  },[])

  useEffect(() => {
    if(!api) return
    if (!api.query.timestamp) return 
    (async() => {
      const time = await api.query.timestamp.now();
      console.log("Connected to node if timestamp: ", time.toPrimitive());
    })()
  }, [api])

  return (
    <PolkadotContext.Provider value={{api, setNewWebSocket, accounts, setAccounts, selectedAccount, setSelectedAccount, signer, setSigner, handleConnection, handleAccountSelection}} >
      {children}
    </PolkadotContext.Provider>
  );
};
