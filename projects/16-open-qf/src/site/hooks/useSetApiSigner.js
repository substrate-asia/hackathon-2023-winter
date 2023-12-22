import { useAccount } from "@/context/account";
import useApi from "./useApi";
import { useEffect } from "react";
import useInjectedWeb3 from "@/components/connect/connectWalletPopup/useInjectedWeb3";
import { PROJECT_NAME } from "@/utils/constants";

export default function useSetApiSigner() {
  const api = useApi();
  const account = useAccount();
  const { injectedWeb3 } = useInjectedWeb3();

  useEffect(() => {
    if (!api || !account) {
      return;
    }
    (async () => {
      const extension = injectedWeb3?.[account.wallet];
      if (!extension) {
        return;
      }
      const wallet = await extension.enable(PROJECT_NAME);
      api.setSigner(wallet.signer);
    })();
  }, [api, account, injectedWeb3]);
}
