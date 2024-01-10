'use client';

import { siteImage } from '@/config/image';
import Image from 'next/image';
import Link from 'next/link';
import MainNav from './main-nav';
import { useState, useEffect } from 'react';
import ConnectedWalletButton from './connected-wallet-button';
import ConnectKiltButton from './connect-kilt-button';
import ConnectWalletButton from './connect-wallet-button';
// import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';

export default function NavHeader() {
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  const fetchWalletAddresses = async () => {
    const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');
    const extensions = await web3Enable('Your App Name');
    if (extensions.length === 0) {
      alert('No wallet extensions found!');
      return;
    }

    const accounts = await web3Accounts();
    setWalletAddresses(accounts.map(account => account.address));

    const localStorageAddress = localStorage.getItem('selectedWalletAddress');
    if (
      localStorageAddress &&
      accounts.some(account => account.address === localStorageAddress)
    ) {
      setSelectedAddress(localStorageAddress);
    }
  };

  const disconnectWallet = () => {
    setSelectedAddress('');
    localStorage.removeItem('selectedWalletAddress');
  };

  useEffect(() => {
    fetchWalletAddresses();
  }, []);

  const handleSelectAddress = (address: string) => {
    setSelectedAddress(address);
    localStorage.setItem('selectedWalletAddress', address);
    setShowWalletSelector(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-nav-header">
      <nav className="container flex items-center justify-between px-4 pb-4 pt-6 md:px-[100px]">
        <Link href={'/'}>
          <Image src={siteImage.logo} alt="logo" width={236} height={60} priority />
        </Link>
        <MainNav />

        {/* {selectedAddress ? (
          <ConnectedWalletButton onClick={disconnectWallet} address={selectedAddress} />
        ) : (
          <button
            onClick={() => setShowWalletSelector(!showWalletSelector)}
            className="flex items-center gap-2.5 rounded-3xl bg-primary px-4 py-2 text-[0.875rem]/[1.25rem] text-primary-light duration-700 hover:bg-primary/90"
          >
            Connect Wallet
          </button>
        )}
        {showWalletSelector && (
          <WalletSelector
            walletAddresses={walletAddresses}
            onSelect={handleSelectAddress}
          />
        )} */}
        {/* <ConnectKiltButton /> */}
        <ConnectWalletButton />
      </nav>
    </header>
  );
}

interface WalletSelectorProps {
  walletAddresses: string[];
  onSelect: (address: string) => void;
}

const WalletSelector = ({ walletAddresses, onSelect }: WalletSelectorProps) => {
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const address = event.target.value;
    onSelect(address);
  };

  return (
    <div className="mt-2">
      <select
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        onChange={handleAddressChange}
      >
        <option value="">Select a wallet</option>
        {walletAddresses.map((address, index) => (
          <option key={index} value={address}>
            {address}
          </option>
        ))}
      </select>
    </div>
  );
};
