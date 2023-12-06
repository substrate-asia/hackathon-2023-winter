import { ABI, ADDRESS } from "@/config";
import { useContractRead } from "wagmi";

const useGetShipmentDetails = (ship) => {
  const { data, isError, isLoading } = useContractRead({
    address: ADDRESS,
    abi: ABI,
    functionName: "getShipmentDetails",
    args: [ship],
  });

  return { data };
};

export default useGetShipmentDetails;
