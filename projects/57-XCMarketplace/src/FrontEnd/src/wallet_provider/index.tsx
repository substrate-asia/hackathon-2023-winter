import { Children, FC } from 'react';

import dynamic from 'next/dynamic';
import { PolkadotWalletProvider } from './PolkadotProvider';

// const PolkadotProvider = PolkadotWalletProvider;
const PolkadotProvider = ({ children }: { children: React.ReactNode }) => {
  const PolkadotProviderDynamic = dynamic(
    async () =>
      (await import('./PolkadotProvider')).PolkadotWalletProvider,
    { ssr: false }
  );
  return (
      <PolkadotProviderDynamic>
        {children}
      </PolkadotProviderDynamic>
  );
}

export default PolkadotProvider;