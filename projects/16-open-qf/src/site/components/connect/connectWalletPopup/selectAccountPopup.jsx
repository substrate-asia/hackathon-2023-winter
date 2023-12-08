import { noop } from "lodash-es";
import Modal from "@osn/common-ui/es/Modal";
import { Button } from "@/components/button";
import { PROJECT_NAME } from "@/utils/constants";
import { useCallback, useEffect, useState } from "react";
import useInjectedWeb3 from "./useInjectedWeb3";
import { useIsMounted } from "@osn/common";
import { useDispatch } from "react-redux";
import AccountSelector from "@/components/accountSelector";
import { Chains } from "@osn/constants";
import { Wallets } from "./constants";
import { newErrorToast } from "@/store/reducers/toastSlice";

function ConnectedExtension({ walletExtensionType }) {
  const wallet = Wallets.find(
    (item) => item.extensionName === walletExtensionType,
  );
  if (!wallet) {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-[12px] py-[12px] bg-fill-bg-tertiary">
      <div className="flex items-center gap-[8px]">
        <wallet.logo className={wallet.title} alt={wallet.title} />
        <span className="text-text-primary text14medium">{wallet.title}</span>
      </div>
      <span className="text12medium text-text-tertiary">Connected</span>
    </div>
  );
}

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
        dispatch(newErrorToast(e.message));
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
    <Button className="w-full" onClick={() => onConnectAccount(account)}>
      <span className="text14medium text-text-light-major">Confirm</span>
    </Button>
  );

  return (
    <Modal open={open} setOpen={setOpen} footer={footer}>
      <div className="flex flex-col gap-[20px]">
        <span className="text16semibold text-text-primary">Connect Wallet</span>
        <ConnectedExtension walletExtensionType={walletExtensionType} />
        <div className="flex flex-col gap-[12px]">
          <span className="text16semibold text-text-primary">Account</span>
          <ExtensionAccountSelect
            walletExtensionType={walletExtensionType}
            onSelectAccount={setAccount}
          />
        </div>
      </div>
    </Modal>
  );
}
