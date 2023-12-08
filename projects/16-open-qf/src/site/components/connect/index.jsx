import ConnectedAccount from "../user/connectedAccount";
import ConnectWalletButton from "./connectWalletButton";
import { useAccount } from "@/context/account";
import { useState } from "react";
import ConnectWalletPopup from "./connectWalletPopup";
import NodeSelect from "../nodeSelect";

export default function Connect() {
  const account = useAccount();
  const [showConnectPopup, setShowConnectPopup] = useState(false);

  return (
    <div>
      {account ? (
        <div className="flex gap-[16px]">
          <ConnectedAccount setShowConnectPopup={setShowConnectPopup} />
          <NodeSelect small />
        </div>
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
