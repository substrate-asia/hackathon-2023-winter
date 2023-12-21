import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useContract, useTx } from "useink";
import metadataFactory from "../utils/nft_collection_factory.json";
import * as U from "useink/utils";
import { notifySuccess } from "../utils/alert";
import { ToastContainer } from "react-toastify";
import { LoadingIcon } from "../assets";

function ClaimNFT() {
  const FACTORY_ADDRESS = import.meta.env.VITE_CONTRACT_FACTORY;
  const factoryContract = useContract(FACTORY_ADDRESS, metadataFactory, "aleph-testnet");
  const [isFlagDeposit, setIsFlagDeposit] = useState(false);
  const factoryClaim = useTx(factoryContract, "claimNft");

  const handleClaimNFT = () => {
    if (!isFlagDeposit) {
      factoryClaim.signAndSend([import.meta.env.VITE_CONTRACT_COLLECTION, 1]);
    }
  };

  useEffect(() => {
    if (U.isInBlock(factoryClaim)) {
      setIsFlagDeposit(true);
    } else if (U.isFinalized(factoryClaim)) {
      notifySuccess("Claim NFT Successfully");
      setIsFlagDeposit(false);
    }
  }, [factoryClaim]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <Header />
      <div className="max-w-[1200px] mx-auto w-full mt-6 h-[600px] bg-white p-6 rounded-lg">
        <h1 className="text-[40px] mb-10 text-yellow-600 font-bold mt-10">Claim NFT</h1>
        <div className="flex items-center gap-x-6 h-[300px] shadow-lg border-[1px]">
          <div className="flex-[0.35] h-full">
            <img
              src="https://images.unsplash.com/photo-1702470170564-22dd352f5b88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8"
              className="object-cover h-full"
            />
          </div>
          <div className="h-full flex-[0.65]">
            <div className="flex items-center h-[25%]">
              <h2 className="text-[20px] mt-2 p-2 w-[250px] font-semibold">NFT Collection Name: </h2>
              <h2 className="text-[18x] mt-2 p-2 w-[250px] ">Plats Collection</h2>
            </div>
            <div className="flex items-center h-[25%]">
              <h2 className="text-[20px] mt-2 p-2 w-[250px] font-semibold">Network: </h2>
              <h2 className="text-[18x] mt-2 p-2 w-[250px] ">Aleph Zero Testnet</h2>
            </div>
            <div className="flex items-center h-[25%]">
              <h2 className="text-[20px] mt-2 p-2 w-[250px] font-semibold">NFT Id: </h2>
              <h2 className="text-[18x] mt-2 p-2 w-[250px] ">01</h2>
            </div>
            <div className="flex items-center h-[25%]">
              <h2 className="text-[20px] mt-2 p-2 w-[250px] font-semibold">Collection Id: </h2>
              <h2 className="text-[18x] mt-2 p-2 w-[250px] ">5DgJ35iXGrYqxLcaFUZEzZpSw2p64ebMVsUWHf5ugWhykAWY</h2>
            </div>
          </div>
        </div>
        <button
          onClick={handleClaimNFT}
          className="bg-blue-500 hover:bg-opacity-60 text-white font-medium md:font-bold py-2 px-4 md:py-3 md:px-8 rounded text-[16px] md:text-[20px] relative left-[50%] -translate-x-[50%] mt-16 flex items-center"
        >
          <div>{isFlagDeposit && <img src={LoadingIcon} className="w-10 h-10 mr-4" />}</div>
          Claim
        </button>
      </div>
    </div>
  );
}

export default ClaimNFT;
