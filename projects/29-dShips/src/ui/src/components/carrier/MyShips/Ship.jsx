"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAccount } from "wagmi";
import Link from "next/link";
import { FaMapMarkerAlt } from "@react-icons/all-files/fa/FaMapMarkerAlt";
import { RiPinDistanceFill } from "@react-icons/all-files/ri/RiPinDistanceFill";
import { IoMdSend } from "@react-icons/all-files/io/IoMdSend";
import { FaTruck } from "@react-icons/all-files/fa/FaTruck";
import { FaArrowDown } from "@react-icons/all-files/fa/FaArrowDown";

import useGetShipmentDetails from "@/hooks/useGetShipmentDetails";
import useGetDistance from "@/hooks/useGetDistance";

const Ship = ({ ship }) => {
  const { address } = useAccount();

  const { data } = useGetShipmentDetails(ship);

  const { shipmentDistance, userToFromDistance } = useGetDistance(data);

  return (
    data &&
    data[2] == address && (
      <Link href={`carrier/${ship}`}>
        <div className=" bg-schemes-light-surfaceContainerLow rounded-xl p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-2 truncate">
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

            {shipmentDistance ? (
              <div className="flex gap-2 items-center">
                <RiPinDistanceFill className="text-xl text-coreColors-primary" />
                <p>
                  Total distance:{" "}
                  {(
                    parseFloat(shipmentDistance) +
                    parseFloat(userToFromDistance)
                  ).toFixed(2)}
                  Km
                </p>
              </div>
            ) : (
              <p>Loading</p>
            )}

            <div className="flex gap-2 items-center">
              <IoMdSend className="text-lg -rotate-90 text-coreColors-primary" />
              <p className="">Sender:</p>
              <Link
                href={`https://etherscan.io/address/${data[0]}`}
                className="underline text-slate-900"
              >
                {data[0].slice(0, 6)}...{data[0].slice(-6)}
              </Link>
            </div>

            <div className="flex gap-2 items-center">
              <IoMdSend className="text-lg rotate-90 text-coreColors-primary" />
              <p className="">Recipient:</p>
              <Link
                href={`https://etherscan.io/address/${data[1]}`}
                className="underline text-slate-900"
              >
                {data[1].slice(0, 6)}...{data[1].slice(-6)}
              </Link>
            </div>

            <div className="flex gap-2">
              <div className="h-5 w-5">
                <FaMapMarkerAlt className="text-lg text-coreColors-primary" />
              </div>
              <div className="flex flex-col text-clip gap-1">
                <p>{data[5]}</p>
                <FaArrowDown className="text-md mx-auto text-coreColors-primary" />
                <p>{data[3]}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  );
};

export default Ship;
