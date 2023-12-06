import { ABI, ADDRESS } from "@/config";
import { MdCancel } from "@react-icons/all-files/md/MdCancel";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { QrReader } from "react-qr-reader";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const ConfirmPick = ({ ship }) => {
  const router = useRouter();
  const [confirmPick, setConfirmPick] = useState(false);
  const [shipCode, setShipCode] = useState(null);

  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi: ABI,
    functionName: "markPicked",
    args: [shipCode],
  });

  const { write } = useContractWrite(config);

  return confirmPick ? (
    <div className={`${inter.className} h-full w-full rounded relative`}>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            router.push(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        className="h-full w-full rounded"
        style={{ width: "100%", height: "100%" }}
        videoStyle={{ objectFit: "cover" }}
        videoContainerStyle={{
          width: "100%",
          height: "100%",
          borderRadius: "16px",
        }}
      />

      <button
        onClick={() => setConfirmPick(false)}
        className="z-10 absolute right-2 top-2 bg-schemes-light-primary text-schemes-light-onPrimary flex w-fit justify-center rounded-full p-3 hover:bg-coreColors-primary transition duration-200"
      >
        <MdCancel className="text-2xl m-auto" />
      </button>

      <div className="absolute w-full flex gap-2 z-10 bottom-0 p-2">
        <input
          className="px-2 py-1 w-full border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
          placeholder="Enter ship code"
          onChange={(e) => setShipCode(e.target.value)}
        ></input>
        <button
          onClick={() => write(false)}
          className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4 transition duration-200"
        >
          Pick
        </button>
      </div>
    </div>
  ) : (
    <button
      disabled={shipCode === ship}
      onClick={() => setConfirmPick(true)}
      className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4 transition duration-200"
    >
      Confirm pick
    </button>
  );
};

export default ConfirmPick;
