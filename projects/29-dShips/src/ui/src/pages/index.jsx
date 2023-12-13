"use client";
import { useAccount } from "wagmi";
import Link from "next/link";

import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main
      className={`${inter.className} bg-schemes-light-surfaceContainer flex flex-col h-max`}
    >
      {isConnected ? (
        <div className="flex flex-col gap-4 w-11/12 mx-auto">
          <Link
            href={"/admin"}
            className="bg-schemes-light-primary text-schemes-light-onPrimary py-2 px-4 rounded-full hover:bg-coreColors-primary transition duration-200"
          >
            Admin
          </Link>

          <Link
            href={"/carrier"}
            className="bg-schemes-light-primary text-schemes-light-onPrimary py-2 px-4 rounded-full hover:bg-coreColors-primary transition duration-200"
          >
            Carrier
          </Link>

          <Link
            href={"/recipient"}
            className="bg-schemes-light-primary text-schemes-light-onPrimary py-2 px-4 rounded-full hover:bg-coreColors-primary transition duration-200"
          >
            Recipient
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-11/12 mx-auto bg-schemes-light-surfaceContainerLowest p-4 rounded-3xl mb-4 h-screen">
          <p>You will need MoonBase Alpha Faucet</p>
          <Link
            href={"https://faucet.moonbeam.network/"}
            className="text-coreColors-primary underline"
          >
            Get faucet
          </Link>
          <p className="text-lg font-semibold">Network info</p>
          <p className="text-md font-semibold">Network name</p>
          <p>Moonbase Alpha</p>
          <p className="text-md font-semibold">New RPC URL</p>
          <p>https://rpc.api.moonbase.moonbeam.network</p>
          <p className="text-md font-semibold">Chain ID</p>
          <p>1287</p>
          <p className="text-md font-semibold">Currency symbol</p>
          <p>DEV</p>
          <p className="text-md font-semibold">Block explorer URL</p>
          <p>https://moonbase.moonscan.io/</p>
        </div>
      )}
    </main>
  );
}
