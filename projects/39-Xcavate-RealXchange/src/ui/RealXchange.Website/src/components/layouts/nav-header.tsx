'use client';

import { siteImage } from '@/config/image';
import Image from 'next/image';
import Link from 'next/link';
import MainNav from './main-nav';
import { useState, useEffect } from 'react';
import ConnectedWalletButton from './connected-wallet-button';
import ConnectKiltButton from './connect-kilt-button';
import ConnectWalletButton from './connect-wallet-button';
import { useSporranContext } from '@/context/sporran-context';
// import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';

export default function NavHeader() {
  const { isConnected, user, disconnectWallet } = useSporranContext();

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-nav-header">
      <nav className="container flex items-center justify-between px-4 pb-4 pt-6 md:px-[100px]">
        <Link href={'/'}>
          <Image src={siteImage.logo} alt="logo" width={236} height={60} priority />
        </Link>
        <MainNav />

        {isConnected ? (
          <ConnectedWalletButton address={user} onClick={disconnectWallet} />
        ) : (
          <ConnectWalletButton />
        )}
      </nav>
    </header>
  );
}
