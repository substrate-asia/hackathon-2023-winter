import React from "react";
import useSubwallet from "../hooks/subWallet";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { state, handleConnect, handleDisconnect } = useSubwallet();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between px-12 py-8 w-full bg-white">
      <a href={"/"} className="text-3xl font-semibold text-[#E2E2E2]">
        BLEND
      </a>
      <button
        onClick={() => {
          handleDisconnect();
          navigate("/connect");
        }}
        className="px-4 py-2 border rounded-lg hover:bg-[#E2E2E2] transition-all"
      >
        Disconnect Wallet
      </button>
    </nav>
  );
};

export default Navbar;
