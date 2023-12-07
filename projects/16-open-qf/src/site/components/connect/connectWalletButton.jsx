import { Button } from "../button";

export default function ConnectWalletButton({ setShowConnectPopup }) {
  return (
    <Button onClick={() => setShowConnectPopup(true)}>Connect Wallet</Button>
  );
}
