/* eslint-disable */
"use client";
import { useAccount } from "wagmi";

import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";

const MyShips = dynamic(() => import("@/components/recipient/MyShips"), {
  ssr: false,
});

export default function Home() {
  const { isConnected } = useAccount();

  const router = useRouter();
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);

  return (
    <main className={`${inter.className} bg-schemes-light-surfaceContainer`}>
      <div className="flex flex-col gap-4 w-11/12 mx-auto bg-schemes-light-surfaceContainerLowest p-4 h-[88.5vh] md:min-min-h-[94.5vh] h-auto rounded-3xl">
        {isConnected && <MyShips />}
      </div>
    </main>
  );
}
