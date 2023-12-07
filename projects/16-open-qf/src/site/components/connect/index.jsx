import { useSelector } from "react-redux";
import ConnectedAccount from "../user/connectedAccount";
import ConnectWalletButton from "./connectWalletButton";
import { useAccount } from "@/context/account";
import { useState } from "react";
import ConnectWalletPopup from "./connectWalletPopup";

export default function Connect() {
  const account = useAccount();
  const [showConnectPopup, setShowConnectPopup] = useState(false);

  return (
    <div>
      {account ? (
        <ConnectedAccount setShowConnectPopup={setShowConnectPopup} />
      ) : (
        <ConnectWalletButton setShowConnectPopup={setShowConnectPopup} />
      )}
      {showConnectPopup && (
        <ConnectWalletPopup
          open={showConnectPopup}
          setOpen={setShowConnectPopup}
        />
      )}
    </div>
  );
}
