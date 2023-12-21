import { ABI, ADDRESS } from "@/config";
import React, { useState } from "react";
import { useAccount, useContractRead } from "wagmi";

const useIsVerifiedCarrier = () => {
  const [verified, setVerified] = useState(false);
  const { address } = useAccount();
  const { data } = useContractRead({
    address: ADDRESS,
    abi: ABI,
    functionName: "validCarriers",
    args: [address],
    onSuccess(data) {
      setVerified(data);
    },
  });

  return { verified };
};

export default useIsVerifiedCarrier;
