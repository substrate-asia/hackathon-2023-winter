"use client";
import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { VscDebugDisconnect } from "@react-icons/all-files/vsc/VscDebugDisconnect";

import { Inter } from "next/font/google";
import Link from "next/link";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const Connect = () => {
  const { address, isConnected } = useAccount();

  const { connect, connectors, isLoading } = useConnect();

  const { disconnect } = useDisconnect();

  return (
    <div
      className={`${inter.className} flex flex-col gap-4 w-11/12 mx-auto my-4`}
    >
      {isConnected ? (
        <div className="flex justify-between items-center">
          <div className="bg-schemes-light-primary text-schemes-light-onPrimary py-2 px-4 rounded-full flex gap-2 w-fit items-center ">
            <p>
              {address.slice(0, 6)}...{address.slice(-6)}
            </p>
            <button
              onClick={disconnect}
              className="bg-schemes-light-primary text-schemes-light-onPrimary py-2 px-2 rounded-full flex gap-2 w-fit hover:bg-coreColors-primary transition duration-200"
            >
              <VscDebugDisconnect className="text-lg" />
            </button>
          </div>
          <Link href={"/docs"}>Docs</Link>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          {connectors.map((connector) => (
            <button
              className="bg-schemes-light-primary text-schemes-light-onPrimary rounded-full py-2 px-4 text-white hover:bg-coreColors-primary transition duration-200"
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {!connector.ready && "unsupported"}
              {connector.ready && !isLoading && "Connect wallet"}
              {connector.ready && isLoading && "Connecting"}
            </button>
          ))}
          <Link href={"/docs"}>Docs</Link>
        </div>
      )}
    </div>
  );
};

export default Connect;
