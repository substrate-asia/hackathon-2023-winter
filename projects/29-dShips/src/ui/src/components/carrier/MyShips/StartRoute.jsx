import { ABI, ADDRESS } from "@/config";
import Link from "next/link";
import React from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const StartRoute = ({ ship }) => {
  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi: ABI,
    functionName: "markUnderway",
    args: [ship],
  });

  const { write, isSuccess } = useContractWrite(config);

  return (
    <>
      {isSuccess ? (
        <Link
          href={"/carrier"}
          className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary text-center rounded-full py-2 px-4"
        >
          Go back
        </Link>
      ) : (
        <button
          onClick={() => write()}
          className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4"
        >
          Start route
        </button>
      )}
    </>
  );
};

export default StartRoute;
