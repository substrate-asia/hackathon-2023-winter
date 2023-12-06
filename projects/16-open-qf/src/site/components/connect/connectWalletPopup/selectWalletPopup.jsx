import tw from "tailwind-styled-components";
import Modal from "@osn/common-ui/es/Modal";
import {
  polkadotJs,
  subWalletJs,
  talisman,
  polkagate,
  nova,
} from "./constants";
import useInjectedWeb3 from "./useInjectedWeb3";
import { useIsMounted } from "@osn/common";
import { useEffect, useState } from "react";

const Wallets = [polkadotJs, subWalletJs, talisman, polkagate, nova];

const WalletExtensionWrapper = tw.div`
  cursor-pointer
  flex
  justify-center
  items-center
  py-[12px]
  px-[24px]
  border
  border-stroke-action-default
  text-text-primary
  text14medium
`;

function WalletExtension({ wallet, onClick }) {
  const [installed, setInstalled] = useState(null);
  const { loading: loadingInjectedWeb3, injectedWeb3 } = useInjectedWeb3();
  const isMounted = useIsMounted();
  const Logo = wallet.logo;

  useEffect(() => {
    if (loadingInjectedWeb3) {
      return;
    }

    if (isMounted.current) {
      setInstalled(!!injectedWeb3?.[wallet?.extensionName]);
    }
  }, [loadingInjectedWeb3, injectedWeb3, wallet?.extensionName, isMounted]);

  if (!installed) {
    return null;
  }

  return (
    <WalletExtensionWrapper onClick={() => onClick(wallet)}>
      <div className="flex items-center gap-[8px]">
        <Logo className={wallet.title} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </div>
    </WalletExtensionWrapper>
  );
}

function WalletsList({ setWalletExtensionType }) {
  return (
    <div className="space-y-2">
      {Wallets.map((wallet, index) => {
        return (
          <WalletExtension
            key={index}
            wallet={wallet}
            onClick={() => setWalletExtensionType(wallet.extensionName)}
          />
        );
      })}
    </div>
  );
}

export default function SelectWalletPopup({
  open,
  setOpen,
  setWalletExtensionType,
}) {
  return (
    <Modal open={open} setOpen={setOpen} footer={false}>
      <div className="flex flex-col gap-[20px]">
        <h2 className="text-2xl font-bold">Connect Wallet</h2>
        <WalletsList setWalletExtensionType={setWalletExtensionType} />
      </div>
    </Modal>
  );
}
