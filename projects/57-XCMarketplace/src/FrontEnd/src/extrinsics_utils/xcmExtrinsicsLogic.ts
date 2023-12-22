import '../types'
import { useContext } from 'react'
import { PolkadotContext } from '../wallet_provider/PolkadotContext'
import { dummyMessage } from '../constants'


export const xcmMessageBuilder: (action:Action) => XCMMessage = () => {
    return dummyMessage
}