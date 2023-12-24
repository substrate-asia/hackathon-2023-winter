import { WsProvider, ApiPromise } from "@polkadot/api";
import { useContext, useEffect, useState } from "react";
import {web3Enable, web3Accounts, web3FromAddress} from "@polkadot/extension-dapp";
import {type InjectedAccountWithMeta} from "@polkadot/extension-inject/types"

import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
import { PolkadotContext } from "../wallet_provider/PolkadotContext";
const NAME = "polkadot"

export function WalletButton() {
  
  const {accounts, handleConnection, selectedAccount, handleAccountSelection} = useContext(PolkadotContext);
  console.log("Polkadot Context",useContext(PolkadotContext))
  return (
  <div>
    {accounts.length === 0 ? 
    <button onClick={handleConnection}>Connect Polkadot</button>
    : 
    <select onChange={handleAccountSelection}>
      <option defaultValue={"Choose your wallet"}>Choose your wallet</option>
      {accounts.map((account, index) => (
        <option key={index} value={account.address}>{account.meta.name ?? account.address}</option>
      ))}
    </select>
    }
    {selectedAccount ?
    <div>{selectedAccount.address}
    </div> 
    : 
    "No account selected"}    
  </div>
  )
}