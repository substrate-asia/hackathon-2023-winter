/* eslint-disable */
"use client";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect } from "react";

import dynamic from "next/dynamic";

const Admin = dynamic(() => import("@/pages/admin/Admin"), { ssr: false });

import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
      <div className="flex flex-col gap-4 w-11/12 mx-auto bg-schemes-light-surfaceContainerLowest p-4 h-[88.5vh] md:h-[94.5vh] rounded-3xl overflow-scroll">
        {isConnected && <Admin />}
      </div>
    </main>
  );
}
