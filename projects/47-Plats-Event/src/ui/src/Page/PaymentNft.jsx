/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContract, useTx } from "useink";
import * as U from "useink/utils";
import Header from "../components/Header";
import Input from "../components/Input";
import Textera from "../components/Textera";
import metadata from "../utils/my_collection.json";
import { LoadingIcon } from "../assets";
import { ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "../utils/alert";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import axios from "axios";

function PaymentNft() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParamsObject = Object.fromEntries([...searchParams]);
  const { nft_name, nft_des, nft_size, blockchain, img, event_id } = searchParamsObject;
  const CONTRACT_ADDRESS_ALPHE = import.meta.env.VITE_CONTRACT_COLLECTION;
  const alpheContract = useContract(CONTRACT_ADDRESS_ALPHE, metadata, "aleph-testnet");
  const [isFlagDeposit, setIsFlagDeposit] = useState(false);
  const alpheMint = useTx(alpheContract, "mint");
  const [ipfsImg, setIpfsImg] = useState("");

  const auth = `Basic ${Buffer.from(`${import.meta.env.VITE_PROJECT_ID}:${import.meta.env.VITE_API_KEY_ID}`).toString(
    "base64"
  )}`;
  const client = create({
    host: import.meta.env.VITE_HOST,
    port: import.meta.env.VITE_PORT,
    protocol: import.meta.env.VITE_PROTOCOL,
    headers: {
      authorization: auth,
    },
  });

  useEffect(() => {
    const uploadIpfs = async () => {
      try {
        const res = await axios.get(img, { responseType: "arraybuffer" });
        const added = await client.add({ content: res.data });
        const url = `${import.meta.env.VITE_SUBDOMAIN}/ipfs/${added.path}`;
        setIpfsImg(url);
      } catch (error) {
        throw new Error(error);
      }
    };
    uploadIpfs();
  }, [img]);

  useEffect(() => {
    if (U.isInBlock(alpheMint)) {
      setIsFlagDeposit(true);
    } else if (U.isFinalized(alpheMint) && isFlagDeposit) {
      notifySuccess("Create NFT Successfully");
      setIsFlagDeposit(false);
      setTimeout(() => {
        navigate(`/reward-nft?id=${event_id}`);
      }, [2000]);
    }
  }, [alpheMint]);

  const handleDeposit = async () => {
    if (!localStorage.getItem("CreateNFT")) {
      notifyError("Please connect wallet");
      return;
    }
    if (!isFlagDeposit) {
      const args = [ipfsImg];
      alpheMint.signAndSend([args]);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <Header />
      <div className="max-w-[1200px] mx-auto p-4 pt-0 border-2 rounded-lg mt-8">
        <Input label="Collection Name" value={nft_name} />
        <Textera label="Collection Description" value={nft_des} />
        <Input label="Collection Size" value={nft_size} />
        <Input label="Blockchain" value={blockchain} />
        <div className="mt-4">
          <label className="text-[20px] font-semibold pb-2" htmlFor="">
            NFT
          </label>
          <div className="overflow-hidden max-w-[400px] h-[200px]">
            <img
              src={
                img ||
                "https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
              }
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleDeposit}
        disabled={U.shouldDisable(alpheMint)}
        className="mt-4 bg-blue-500 hover:bg-opacity-60 text-white font-medium md:font-bold  md:py-3 md:px-8 rounded text-[16px] md:text-[20px] relative left-[50%] -translate-x-[50%] items-center flex"
      >
        <div>{isFlagDeposit && <img src={LoadingIcon} className="w-10 h-10 mr-4" />}</div>
        Create NFT
      </button>
    </div>
  );
}

export default PaymentNft;
