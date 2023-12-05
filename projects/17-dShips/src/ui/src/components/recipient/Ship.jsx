"use client";
import React from "react";
import Link from "next/link";

import { useAccount } from "wagmi";

import { RiPinDistanceFill } from "@react-icons/all-files/ri/RiPinDistanceFill";
import { IoMdSend } from "@react-icons/all-files/io/IoMdSend";
import { FaMapMarkerAlt } from "@react-icons/all-files/fa/FaMapMarkerAlt";
import { FaTruck } from "@react-icons/all-files/fa/FaTruck";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";

import Code from "./Code";

import useGetShipmentDetails from "@/hooks/useGetShipmentDetails";
import useGetDistance from "@/hooks/useGetDistance";

const Ship = ({ ship }) => {
  const { address } = useAccount();

  const { data } = useGetShipmentDetails(ship);

  const { shipmentDistance } = useGetDistance(data);

  return (
    data &&
    data[1] == address && (
      <div className=" bg-schemes-light-surfaceContainerLow rounded-xl p-3 flex flex-col gap-2">
        <div className="flex flex-col gap-2 truncate">
          <div className="flex gap-2">
            <div
              className={
                data[4] >= 2
                  ? "rounded-full bg-green-400 h-2 w-full"
                  : "rounded-full bg-slate-300 h-2 w-full"
              }
            ></div>
            <div
              className={
                data[4] == 3
                  ? "rounded-full bg-green-400 animate-pulse h-2 w-full"
                  : data[4] > 3
                  ? "rounded-full bg-green-400 h-2 w-full"
                  : "rounded-full bg-slate-300 h-2 w-full"
              }
            ></div>
            <div
              className={
                data[4] >= 4
                  ? "rounded-full bg-green-400 h-2 w-full"
                  : "rounded-full bg-slate-300 h-2 w-full"
              }
            ></div>
          </div>

          <div className="flex gap-2 items-center">
            <FaTruck className="text-xl text-coreColors-primary" />
            <p>
              {data[4] == 0 && "Unassigned"}
              {data[4] == 1 && "Assigned"}
              {data[4] == 2 && "Picked"}
              {data[4] == 3 && "Underway"}
              {data[4] == 4 && "Delivered"}
              {data[4] == 5 && "Canceled"}
            </p>
            <Link href="" className="underline text-slate-900">
              {data[2].slice(0, 6) + "..." + data[2].slice(-6)}
            </Link>
          </div>

          {shipmentDistance ? (
            <div className="flex gap-2 items-center">
              <RiPinDistanceFill className="text-xl text-coreColors-primary" />
              <p>
                Distance total: {parseFloat(shipmentDistance)}
                Km
              </p>
            </div>
          ) : (
            <p>Loading</p>
          )}

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
          {data[4] <= 3 && <Code ship={ship} />}
          {data[4] > 3 && (
            <div className="text-lg text-coreColors-primary p-3 rounded-full w-fit ml-auto bg-schemes-light-primaryContainer">
              <FaCheck />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Ship;
