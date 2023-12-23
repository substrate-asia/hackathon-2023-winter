import { WsProvider, ApiPromise } from "@polkadot/api";
import { FC, useEffect, useState } from "react";
import {web3Enable, web3Accounts, web3FromAddress} from "@polkadot/extension-dapp";
import {type InjectedAccountWithMeta} from "@polkadot/extension-inject/types"
import dynamic from 'next/dynamic';
import {WalletButton} from './BaseWalletPolkadot'

const PolkadotWalletButton = WalletButton;
// export const PolkadotWalletButton : FC = () => {
//   const WalletButtonDynamic = dynamic(
//     async () =>
//       (await import('./BaseWalletPolkadot')).WalletButton,
//     { ssr: false }
//   );
//   return (
//       <WalletButtonDynamic />
//   );
// }

export default PolkadotWalletButton;