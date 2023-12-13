/* eslint-disable */
"use client";
import React, { useEffect } from "react";
import { ABI, ADDRESS } from "../../../config";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Link from "next/link";

import { RiPinDistanceFill } from "@react-icons/all-files/ri/RiPinDistanceFill";
import { IoMdSend } from "@react-icons/all-files/io/IoMdSend";
import { FaMapMarkerAlt } from "@react-icons/all-files/fa/FaMapMarkerAlt";
import useGetShipmentDetails from "@/hooks/useGetShipmentDetails";
import useGetDistance from "@/hooks/useGetDistance";
import Map from "./Map";
import { useRouter } from "next/router";

const Ship = ({ ship, userCoordinates, verified }) => {
  const router = useRouter();
  const { data } = useGetShipmentDetails(ship);
  const { shipmentDistance, userToFromDistance } = useGetDistance(data);

  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi: ABI,
    functionName: "assignCarrier",
    args: [ship],
  });

  const { write, isSuccess } = useContractWrite(config);

  useEffect(() => {
    isSuccess && router.push("/carrier");
  }, [isSuccess]);

  return (
    data &&
    data[4] == 0 && (
      <div className=" bg-schemes-light-surfaceContainerLow rounded-xl p-3 flex flex-col gap-2">
        <div className="flex flex-col gap-2 truncate">
          {userToFromDistance ? (
            <div className="flex gap-1">
              <FaMapMarkerAlt className="text-lg text-coreColors-primary" />
              <p>
                Collection point: {data[6]} ({userToFromDistance}Km)
              </p>
            </div>
          ) : (
            <p>Loading</p>
          )}
          <div className="flex gap-1">
            <IoMdSend className="text-lg -rotate-90 text-coreColors-primary" />
            <p className="">Sender:</p>
            <Link href="" className="underline text-slate-900">
              {data[0].slice(0, 6)}...{data[0].slice(-6)}
            </Link>
          </div>
          <div className="flex gap-1">
            <IoMdSend className="text-lg rotate-90 text-coreColors-primary" />
            <p className="">Recipient:</p>
            <Link href="" className="underline text-slate-900">
              {data[1].slice(0, 6)}...{data[1].slice(-6)}
            </Link>
          </div>
          {shipmentDistance ? (
            <div className="flex gap-1">
              <div className="">
                <RiPinDistanceFill className="text-xl text-coreColors-primary" />
              </div>
              <p className="">
                Destination point: {data[3]} ({shipmentDistance}Km)
              </p>
            </div>
          ) : (
            <p>Loading</p>
          )}

          <Map data={data} />

          <button
            disabled={!verified}
            onClick={() => write()}
            className={
              verified
                ? "bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4"
                : "bg-coreColors-neutral text-schemes-light-onPrimary rounded-full py-2 px-4"
            }
          >
            Assign to me
          </button>
        </div>
      </div>
    )
  );
};

export default Ship;
