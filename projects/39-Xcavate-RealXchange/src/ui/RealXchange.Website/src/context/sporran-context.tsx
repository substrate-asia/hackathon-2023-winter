'use client';

import { exceptionToError } from '@/lib/exceptionToError';
import { initializeKiltExtensionAPI } from '@kiltprotocol/kilt-extension-api';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

declare global {
  interface Window {
    kilt?: any;
  }
}

type FlowError = 'closed' | 'unauthorized' | 'unknown';

if (typeof window !== 'undefined') {
  initializeKiltExtensionAPI();
}

let { kilt } = window || {};

const SporranContext = createContext<any | null>(null);

export function useSporranContext() {
  return useContext(SporranContext);
}

export interface SporranContextProps {
  children?: React.ReactNode;
}

export default function SporranContextProvider({ children }: SporranContextProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<FlowError>();
  const [user, setUser] = useState<any>(); // did of the user

  const connectKiltWallet = useCallback(async (extension: any) => {
    try {
      setProcessing(true);
      setError(undefined);

      if (extension) {
        const didList = await extension.getDidList();
        if (didList.length > 0) {
          const did = didList[0].did || '';
          setUser(did);
          localStorage.setItem('did', did);
          setProcessing(false);
          setIsConnected(true);
        }
      }
    } catch (exception) {
      const { message } = exceptionToError(exception);
      if (message.includes('closed')) {
        setError('closed');
      } else if (message.includes('Not authorized')) {
        setError('unauthorized');
      } else {
        setError('unknown');
        console.error(exception);
      }
      setProcessing(false);
    }
  }, []);

  const checkUserIsConnected = async (user: any) => {
    const localStorageAddress = localStorage.getItem('did');
    if (localStorageAddress && localStorageAddress.startsWith('did')) {
      setUser(localStorageAddress);
      setIsConnected(true);
    }
  };

  const disconnectWallet = () => {
    setUser('');
    localStorage.removeItem('did');
    setIsConnected(false);
  };

  useEffect(() => {
    checkUserIsConnected(user);
  }, [user]);

  return (
    <SporranContext.Provider
      value={{ kilt, processing, isConnected, user, connectKiltWallet, disconnectWallet }}
    >
      {children}
    </SporranContext.Provider>
  );
}
