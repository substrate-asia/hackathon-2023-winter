import { ABI, ADDRESS } from "@/config";
import React, { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";

const useGetDeliveryCode = (ship) => {
  const { address } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: ADDRESS,
    abi: ABI,
    functionName: "getDeliveryCode",
    args: [ship],
    account: address,
  });

  return { data };
};

export default useGetDeliveryCode;
