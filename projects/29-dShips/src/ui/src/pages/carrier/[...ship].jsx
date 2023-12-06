/* eslint-disable */
import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { ABI, ADDRESS } from "@/config";

import { useAccount, useContractRead } from "wagmi";

import "mapbox-gl/dist/mapbox-gl.css";

import Link from "next/link";

import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

import { FaMapMarkerAlt } from "@react-icons/all-files/fa/FaMapMarkerAlt";
import { IoMdSend } from "@react-icons/all-files/io/IoMdSend";
import { FaTruck } from "@react-icons/all-files/fa/FaTruck";

import ConfirmPick from "@/components/carrier/MyShips/ConfirmPick";
import StartRoute from "@/components/carrier/MyShips/StartRoute";
import Deliver from "@/components/carrier/MyShips/Deliver";

const index = () => {
  const router = useRouter();
  const { ship } = router.query;

  const { isConnected } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: ADDRESS,
    abi: ABI,
    functionName: "getShipmentDetails",
    args: ship,
  });

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);

  return (
    <main className={`h-[94.5vh] ${inter.className}`}>
      {data && (
        <div className="rounded-3xl p-6 flex flex-col gap-2 w-11/12 mx-auto h-full bg-schemes-light-surfaceContainerLowest">
          <div className="flex gap-2 items-center">
            <FaTruck className="text-xl text-coreColors-primary" />
            <p>
              {data[4] == 0 && "Unassigned"}
              {data[4] == 1 && "Assigned to me"}
              {data[4] == 2 && "Picked"}
              {data[4] == 3 && "Underway"}
              {data[4] == 4 && "Delivered"}
              {data[4] == 5 && "Canceled"}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <IoMdSend className="text-lg -rotate-90 text-coreColors-primary" />
            <p className="">Sender:</p>
            <Link href="" className="underline text-slate-900">
              {data[0].slice(0, 6)}...{data[0].slice(-6)}
            </Link>
          </div>

          <div className="flex gap-2 items-center">
            <IoMdSend className="text-lg rotate-90 text-coreColors-primary" />
            <p className="">Recipient:</p>
            <Link href="" className="underline text-slate-900">
              {data[1].slice(0, 6)}...{data[1].slice(-6)}
            </Link>
          </div>

          <div className="flex gap-2 items-center">
            <FaMapMarkerAlt className="text-lg text-coreColors-primary" />
            <Link href="">{data[3]}</Link>
          </div>

          {data[4] == 1 && <ConfirmPick ship={ship[0]} />}

          {data[4] == 2 && <StartRoute ship={ship[0]} />}

          {data[4] == 3 && <Deliver />}
        </div>
      )}
    </main>
  );
};

export default index;
