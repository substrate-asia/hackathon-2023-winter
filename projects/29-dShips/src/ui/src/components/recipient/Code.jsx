"use client";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { RiQrCodeLine } from "@react-icons/all-files/ri/RiQrCodeLine";
import useGetDeliveryCode from "@/hooks/useGetDeliveryCode";

const Code = ({ ship }) => {
  const [showCode, setShowCode] = useState(false);

  const { data } = useGetDeliveryCode(ship);

  return (
    <div>
      {showCode ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowCode(false)}
            className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full p-3 transition duration-200 w-fit ml-auto"
          >
            <RiQrCodeLine className="text-2xl m-auto" />
          </button>
          <QRCode
            className="p-1"
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
            }}
            value={"http://localhost:3000/carrier/deliver/" + ship + "/" + data}
            viewBox={`0 0 256 256`}
          />
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowCode(true)}
            className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full p-3 transition duration-200 ml-auto"
          >
            <RiQrCodeLine className="text-2xl m-auto" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Code;
