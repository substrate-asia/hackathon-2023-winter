/* eslint-disable */
"use client";
import { useRouter } from "next/router";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import { ABI, ADDRESS } from "../../config";
import { useAccount, useContractRead } from "wagmi";
import Link from "next/link";
import axios from "axios";
import { RiPinDistanceFill } from "@react-icons/all-files/ri/RiPinDistanceFill";
import { IoMdSend } from "@react-icons/all-files/io/IoMdSend";
import { FaMapMarkerAlt } from "@react-icons/all-files/fa/FaMapMarkerAlt";
import { FaTruck } from "@react-icons/all-files/fa/FaTruck";

import { Inter } from "next/font/google";
import ShowCode from "@/components/admin/ShowCode";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const ShipPanel = () => {
  const router = useRouter();
  const { ship } = router.query;
  const { address, isConnected } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: ADDRESS,
    abi: ABI,
    functionName: "getShipmentDetails",
    args: [ship],
  });

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [fromCoordinates, setFromCoordinates] = useState(null);
  const [toCoordinates, setToCoordinates] = useState(null);
  const [shipmentDistance, setShipmentDistance] = useState(null);

  const getCoordinates = async (from, to) => {
    //FROM COORDINATES
    const fromAddress = from.split(" ");
    for (let i = 0; i < fromAddress.length; i++) {
      fromAddress[i] =
        fromAddress[i].charAt(0).toUpperCase() + fromAddress[i].slice(1);
    }
    const formatedFromAddress = fromAddress.join("%20");

    //TO COORDINATES
    const toAddress = to.split(" ");
    for (let i = 0; i < toAddress.length; i++) {
      toAddress[i] =
        toAddress[i].charAt(0).toUpperCase() + toAddress[i].slice(1);
    }
    const formatedToAddress = toAddress.join("%20");

    //API CALL
    try {
      const responseToAddress = await axios.get(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          formatedToAddress +
          ".json?access_token=" +
          token
      );

      const responseFromAddress = await axios.get(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          formatedFromAddress +
          ".json?access_token=" +
          token
      );

      //SET COORDINATES
      setFromCoordinates(responseFromAddress.data.features[0].center);
      setToCoordinates(responseToAddress.data.features[0].center);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    data && getCoordinates(data[5], data[3]);
  }, [data]);

  const getDistance = (from, to) => {
    const turf = require("@turf/turf");
    let fromPoint = turf.point(from);
    let toPoint = turf.point(to);
    let shipmentDistance = turf.distance(fromPoint, toPoint);
    setShipmentDistance(shipmentDistance.toFixed(2));
  };

  useEffect(() => {
    if (fromCoordinates !== null && toCoordinates !== null) {
      getDistance(fromCoordinates, toCoordinates);
    }
  }, [toCoordinates]);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);

  return (
    data &&
    data[0] == address && (
      <main className={`min-min-h-[94.5vh] ${inter.className}`}>
        <div className="rounded-3xl p-6 flex flex-col gap-2 w-11/12 mx-auto h-full bg-schemes-light-surfaceContainerLowest justify-between">
          <div className="flex flex-col gap-2">
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
                {data[2].slice(0, 6)}
                ...{data[2].slice(-6)}
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

            <div className="flex gap-2 items-start">
              <FaMapMarkerAlt className="text-lg text-coreColors-primary" />
              <div className="flex flex-col gap-2">
                <Link href="">{data[5]}</Link>
                <Link href="">{data[3]}</Link>
              </div>
            </div>
          </div>
          {data[4] <= 1 && <ShowCode ship={ship} />}
        </div>
      </main>
    )
  );
};

export default ShipPanel;
