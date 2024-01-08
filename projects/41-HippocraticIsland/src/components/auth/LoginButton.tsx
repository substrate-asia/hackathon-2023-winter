import { useWalletLogin, useWalletLogout } from '@lens-protocol/react-web';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSigner } from 'wagmi';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function LoginButton({ handle }: { handle?: string }) {
  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();
  const { execute: logout, isPending: isLogoutPending } = useWalletLogout();

  const { data: signer, isError, isLoading } = useSigner()

  useEffect(() => {
    const connectToLens = async () => {
      console.log("have signer? ", signer)
      if (signer) {
        await login(signer, handle);
        console.log("signer IN")
      }
      else {
        await logout();
        console.log("signer OUT")
      }
    }
    connectToLens()
  }, [signer])

  useEffect(() => {
    if (loginError) toast.error(loginError.message);
  }, [loginError]);

  return (
    <>
      <ConnectButton showBalance={false} />
    </>
  );
}
