'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const SubstrateContext = createContext<any | null>(null);

export function useSubstrateContext() {
  return useContext(SubstrateContext);
}

export interface SubstrateContextProps {
  children?: React.ReactNode;
}

export default function SubstrateContextProvider({ children }: SubstrateContextProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [address, setAddress] = useState<string>('');

  const connectSubstrateWallet = async () => {
    const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');
    const extensions = await web3Enable('RealXchange');
    if (extensions.length === 0) {
      toast.error('No Polkadot wallet extensions found!');
      return;
    }

    setIsLoading(true);

    const accounts = await web3Accounts();
    const account = accounts[0].address;

    setAddress(account);
    localStorage.setItem('selectedWalletAddress', account);
    setIsLoading(false);
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setAddress('');
    localStorage.removeItem('selectedWalletAddress');
    setIsConnected(false);
    router.refresh();
  };

  const onReconnect = async () => {
    const localStorageAddress = localStorage.getItem('selectedWalletAddress');
    if (localStorageAddress) {
      setAddress(localStorageAddress);
      setIsConnected(true);
    }
  };

  useEffect(() => {
    onReconnect();
  }, []);

  return (
    <SubstrateContext.Provider
      value={{
        address,
        isLoading,
        isConnected,
        connectSubstrateWallet,
        disconnectWallet
      }}
    >
      {children}
    </SubstrateContext.Provider>
  );
}
