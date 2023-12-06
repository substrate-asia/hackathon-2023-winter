import { ABI, ADDRESS } from "@/config";
import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

const useGetAllShipents = () => {
  const [shipsIds, setshipsIds] = useState([]);

  const { data, isError, isLoading } = useContractRead({
    address: ADDRESS,
    abi: ABI,
    functionName: "getAllShipments",
    onSuccess(data) {
      setshipsIds(data);
    },
  });

  return { shipsIds };
};

export default useGetAllShipents;
