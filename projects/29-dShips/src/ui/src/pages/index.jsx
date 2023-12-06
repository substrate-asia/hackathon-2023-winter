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
    <main className={`${inter.className} bg-schemes-light-surfaceContainer`}>
      {isConnected && (
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
      )}
    </main>
  );
}
