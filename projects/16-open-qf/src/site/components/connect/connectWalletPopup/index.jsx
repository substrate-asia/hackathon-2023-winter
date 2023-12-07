import { useCallback, useState } from "react";
import SelectAccountPopup from "./selectAccountPopup";
import SelectWalletPopup from "./selectWalletPopup";
import { useLogin } from "@/context/account";

export default function ConnectWalletPopup({ open, setOpen }) {
  const login = useLogin();
  const [walletExtensionType, setWalletExtensionType] = useState();

  const onConnectAccount = useCallback((account) => {
    login({
      network: "polkadot",
      address: account.address,
    });
    setOpen(false);
  }, []);

  if (walletExtensionType) {
    return (
      <SelectAccountPopup
        open={open}
        setOpen={setOpen}
        walletExtensionType={walletExtensionType}
        onConnectAccount={onConnectAccount}
      />
    );
  }

  return (
    <SelectWalletPopup
      open={open}
      setOpen={setOpen}
      setWalletExtensionType={setWalletExtensionType}
    />
  );
}
