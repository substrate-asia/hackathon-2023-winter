import { useState } from "react";
import { Button } from "../button";
import ConnectWalletPopup from "./connectWalletPopup";

export default function ConnectWalletButton() {
  const [showConnectPopup, setShowConnectPopup] = useState(false);

  return (
    <>
      <Button onClick={() => setShowConnectPopup(true)}>Connect Wallet</Button>
      {showConnectPopup && (
        <ConnectWalletPopup
          open={showConnectPopup}
          setOpen={setShowConnectPopup}
        />
      )}
    </>
  );
}
