import ConnectedAccount from "../user/connectedAccount";
import ConnectWalletButton from "./connectWalletButton";
import { useAccount } from "@/context/account";
import { useState } from "react";
import ConnectWalletPopup from "./connectWalletPopup";
import NodeSelect from "../nodeSelect";

function DesktopConnect({ setShowConnectPopup }) {
  const account = useAccount();

  if (!account) {
    return <ConnectWalletButton setShowConnectPopup={setShowConnectPopup} />;
  }

  return (
    <div className="flex gap-[16px]">
      <ConnectedAccount setShowConnectPopup={setShowConnectPopup} />
      <NodeSelect small />
    </div>
  );
}

export default function Connect() {
  const [showConnectPopup, setShowConnectPopup] = useState(false);

  return (
    <div>
      <DesktopConnect setShowConnectPopup={setShowConnectPopup} />
      {showConnectPopup && (
        <ConnectWalletPopup
          open={showConnectPopup}
          setOpen={setShowConnectPopup}
        />
      )}
    </div>
  );
}
