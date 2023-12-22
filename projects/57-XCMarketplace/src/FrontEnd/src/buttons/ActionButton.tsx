import { Button } from '@material-tailwind/react'
import React, { useContext } from 'react'
import '../types'
import { xcmMessageBuilder } from '../extrinsics_utils/xcmExtrinsicsLogic'
import { PolkadotContext } from '../wallet_provider/PolkadotContext'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { dummyWeight } from '../constants'

interface ActionButtonProps {
  chain: Chain,
  action: Action
}
const ActionButton = ({chain, action}: ActionButtonProps) => {

  const {api, signer, selectedAccount, setNewWebSocket} = useContext(PolkadotContext);


  
  const sendExtrinsic = async () => {
    console.log("We are trying to send a tx")
    const webSocket = chain.webSocketUrl
    await setNewWebSocket(webSocket)
    if (!api) throw Error("API_NOT_DEFINED")
    if (!signer) throw Error("SIGNER_NOT_SET")
    if (!selectedAccount) throw Error("ACCOUNT_NOT_SELECTED")
    
    // const injector = await web3FromAddress(selectedAccount.address)
    // Compute the xcm execute parameters
    const xcmMessage = xcmMessageBuilder(action)
    // TODO Compute a good weight
    const weight: XCMWeight = dummyWeight;
    try{
      let result = await api.tx.polkadotXcm.execute(xcmMessage,weight).signAndSend(selectedAccount.address, {signer})
      // let result = await api.tx.templatePallet.doSomething(3).signAndSend(selectedAccount.address, {signer})//: injector.signer});
      console.log("Result",result.toString())
    }
    catch (e) {
      console.log(e)
    }
    finally {
      console.log("Tx sent!")
    }
  }
  
  return (
    <Button placeholder={"ActionButton"} onClick={sendExtrinsic}>{action.name}</Button>
  )
}

export default ActionButton