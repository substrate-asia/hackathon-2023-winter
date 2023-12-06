import Modal from "@osn/common-ui/es/Modal";
import {
  polkadotJs,
  subWalletJs,
  talisman,
  polkagate,
  nova,
} from "./constants";
import WalletExtension from "./walletExtension";

const Wallets = [polkadotJs, subWalletJs, talisman, polkagate, nova];

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
        <span className="text16semibold text-text-primary">Connect Wallet</span>
        <WalletsList setWalletExtensionType={setWalletExtensionType} />
      </div>
    </Modal>
  );
}
