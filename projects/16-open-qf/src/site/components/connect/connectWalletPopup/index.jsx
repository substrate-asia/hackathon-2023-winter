import { useCallback, useState } from "react";
import SelectAccountPopup from "./selectAccountPopup";
import SelectWalletPopup from "./selectWalletPopup";
import { useDispatch } from "react-redux";
import { setAccount } from "@/store/reducers/accountSlice";

export default function ConnectWalletPopup({ open, setOpen }) {
  const dispatch = useDispatch();
  const [walletExtensionType, setWalletExtensionType] = useState();

  const onConnectAccount = useCallback(
    (account) => {
      dispatch(
        setAccount({
          network: "polkadot",
          address: account.address,
        }),
      );
      setOpen(false);
    },
    [dispatch],
  );

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
