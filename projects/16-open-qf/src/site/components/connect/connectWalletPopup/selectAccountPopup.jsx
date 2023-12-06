import noop from "lodash.noop";
import Modal from "@osn/common-ui/es/Modal";
import { Button } from "@/components/button";
import { PROJECT_NAME } from "@/utils/constants";
import { useCallback, useEffect, useState } from "react";
import useInjectedWeb3 from "./useInjectedWeb3";
import { useIsMounted } from "@osn/common";
import { useDispatch } from "react-redux";
import AccountSelector from "@/components/accountSelector";
import { Chains } from "@osn/constants";

function ExtensionAccountSelect({
  walletExtensionType,
  onSelectAccount = noop,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { injectedWeb3 } = useInjectedWeb3();
  const [accounts, setAccounts] = useState([]);

  const loadPolkadotAccounts = useCallback(
    async (walletExtensionType) => {
      setAccounts([]);
      const extension = injectedWeb3?.[walletExtensionType];
      if (!extension) {
        return;
      }

      try {
        const wallet = await extension.enable(PROJECT_NAME);
        let extensionAccounts = await wallet.accounts?.get();

        extensionAccounts = extensionAccounts.filter(
          (acc) => acc.type !== "ethereum",
        );

        if (isMounted.current) {
          setAccounts(extensionAccounts);
        }
      } catch (e) {
        // dispatch(newErrorToast(e.message));
      }
    },
    [dispatch, injectedWeb3, setAccounts, isMounted],
  );

  useEffect(() => {
    if (!walletExtensionType) {
      return;
    }

    loadPolkadotAccounts(walletExtensionType);
  }, [walletExtensionType, loadPolkadotAccounts]);

  return (
    <AccountSelector
      accounts={accounts}
      chain={Chains.polkadot}
      onSelect={onSelectAccount}
    />
  );
}

export default function SelectAccountPopup({
  open,
  setOpen,
  walletExtensionType,
  onConnectAccount = noop,
}) {
  const [account, setAccount] = useState();

  const footer = (
    <div>
      <Button onClick={() => onConnectAccount(account)}>Connect</Button>
    </div>
  );

  return (
    <Modal open={open} setOpen={setOpen} footer={footer}>
      <div className="flex flex-col gap-[20px]">
        <h2 className="text-2xl font-bold">Connect Wallet</h2>
        <ExtensionAccountSelect
          walletExtensionType={walletExtensionType}
          onSelectAccount={setAccount}
        />
      </div>
    </Modal>
  );
}
