import {
  ProfileOwnedByMe,
  useActiveProfile,
  useActiveWallet,
  WalletData,
} from '@lens-protocol/react-web';
import { ReactNode, useEffect } from 'react';
import { CreateProfileForm } from '../../profiles/UseCreateProfile';

type LoggedInConfig = {
  wallet: WalletData;
  profile: ProfileOwnedByMe;
};

export type WhenLoggedInWithProfileProps = {
  children: (config: LoggedInConfig) => ReactNode;
};

export function WhenLoggedInWithProfile({ children }: WhenLoggedInWithProfileProps) {
  const { data: wallet, loading: walletLoading } = useActiveWallet();
  const { data: profile, error, loading: profileLoading } = useActiveProfile();

  useEffect(() => {
    console.log("wallet: ", profile)
  }, [walletLoading, profileLoading, wallet, profile])

  // if (walletLoading || profileLoading) {
  //   return null;
  // }

  if (!wallet) {
    return <>Please connect wallet</>;
  }

  if (!profile || error) {
    // TODO guide user to create profile
    return <CreateProfileForm />;
  }

  return <>{children({ wallet, profile })}</>;
}
