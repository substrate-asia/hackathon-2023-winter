/* eslint-disable */
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { ABI, ADDRESS } from "@/config";

import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const index = () => {
  const router = useRouter();
  const { deliver } = router.query;
  const { isConnected } = useAccount();

  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi: ABI,
    functionName: "markDelivered",
    args: deliver,
  });

  const { write, isLoading, isSuccess } = useContractWrite(config);

  useEffect(() => {
    isSuccess && router.push("/carrier");
  }, [isSuccess]);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);

  return (
    <main className={`h-[90vh] ${inter.className} w-full`}>
      <div className="rounded-2xl p-3 flex flex-col gap-2 w-11/12 mx-auto h-[99%] bg-schemes-light-surfaceContainerLowest">
        <button
          onClick={() => write()}
          className=" bg-schemes-light-primary text-schemes-light-onPrimary flex w-full h-full justify-center items-center rounded-xl py-2 px-4 hover:bg-coreColors-primary transition duration-200"
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="text-xl m-auto animate-spin" />
          ) : (
            "Deliver"
          )}
        </button>
      </div>
    </main>
  );
};

export default index;
