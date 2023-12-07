/* eslint-disable */
"use client";
import React, { useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { ABI, ADDRESS } from "@/config";

import { FaRegIdCard } from "@react-icons/all-files/fa/FaRegIdCard";
import { FaArrowRight } from "@react-icons/all-files/fa/FaArrowRight";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import usdc from "cryptocurrency-icons/svg/icon/usdc.svg";

import { Inter } from "next/font/google";
import Image from "next/image";
import useIsVerifiedCarrier from "@/hooks/useIsVerifiedCarrier";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const CarrierId = () => {
  const { address, isConnected } = useAccount();
  const [showId, setShowId] = useState(false);
  const [becomeCarrier, setBecomeCarrier] = useState(false);

  const { verified } = useIsVerifiedCarrier();

  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi: ABI,
    functionName: "becomeValidCarrier",
  });

  const { write } = useContractWrite(config);

  return (
    <div
      className={`${
        inter.className
      } absolute top-0 right-0 bg-schemes-light-primary text-schemes-light-onPrimary w-fit cursor-pointer z-50 ${
        showId ? "rounded-2xl" : "rounded-full hover:bg-coreColors-primary"
      } p-3 transition duration-200`}
    >
      {showId ? (
        <div className="flex flex-col gap-2 w-80 md:w-96 justify-between">
          <div className="flex justify-between h-fit items-center">
            <p>Carrier Id</p>
            <button
              onClick={() => setShowId(false)}
              className="text-xl rounded-full hover:bg-coreColors-primary transition duration-200 p-2"
            >
              <IoClose />
            </button>
          </div>
          {verified ? (
            <div className="h-36 flex items-end">
              <div className="h-12 w-full truncate">
                <p>{address}</p>
                <p>Verified carrier</p>
              </div>
            </div>
          ) : becomeCarrier ? (
            <div>
              <p className="mb-2">Guarantee payment (example)</p>
              <div className="flex gap-2 bg-schemes-light-background rounded-full py-1.5 pl-3 pr-2 text-schemes-light-onPrimaryContainer">
                <input
                  type="number"
                  className="rounded-full ring-0 flex"
                  placeholder="10"
                  disabled
                />
                <div className="flex gap-2 items-center pr-5">
                  <Image alt="USDC" src={usdc} />
                </div>
                <button
                  onClick={() => write()}
                  className="bg-schemes-light-primary text-schemes-light-onPrimary rounded-full p-2 hover:bg-coreColors-primary transition duration-200"
                >
                  <FaArrowRight />
                </button>
              </div>
              <p className="mt-4 text-sm">
                To become a verified carrier you need to make a guarantee
                payment, to guarantee the credibility of your work and to
                guarantee no scam or package theft, if there is any of these
                problems we will take part or all of your guarantee payment and
                we could block your account. Don't steal!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p>You are not a verified carrier</p>
              <button
                onClick={() => setBecomeCarrier(!becomeCarrier)}
                className=" bg-schemes-light-primaryContainer text-schemes-light-onPrimaryContainer rounded-full p-2 "
              >
                Become a verified carrier
              </button>
            </div>
          )}
        </div>
      ) : (
        <FaRegIdCard onClick={() => setShowId(true)} className="text-lg" />
      )}
    </div>
  );
};

export default CarrierId;
