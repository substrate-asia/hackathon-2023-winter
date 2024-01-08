import React, { useState, useEffect } from 'react'
import { WsProvider, ApiPromise } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { Signer } from '@polkadot/types/types';


interface PolkadotContextInterface {
  api?: ApiPromise,
  setNewWebSocket: (webSocketUrl: string) => void,
  accounts: Array<InjectedAccountWithMeta>,
  setAccounts: (accounts: Array<InjectedAccountWithMeta>) => void,
  selectedAccount: InjectedAccountWithMeta | undefined,
  signer? : Signer,
  setSigner? : (signer: Signer) => void,
  setSelectedAccount: (account: InjectedAccountWithMeta) => void,
  handleConnection: () => void,
  handleAccountSelection: (e: any) => void
}

const DEFAULT_CONTEXT : PolkadotContextInterface = {
  accounts: [],
  setNewWebSocket: (webSocket) => {},
  setAccounts: (accounts) => {},
  selectedAccount: undefined,
  setSelectedAccount: (account) => {},
  handleConnection: () => {},
  handleAccountSelection: (e) => {},
}

export const PolkadotContext = React.createContext(DEFAULT_CONTEXT);
