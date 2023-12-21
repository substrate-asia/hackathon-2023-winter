/* eslint-disable react/no-unknown-property */
import { useContract, useTx } from "useink";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import metadataCollection from "../utils/my_collection.json";
import metadataFactory from "../utils/nft_collection_factory.json";
import { LoadingIcon } from "../assets";
import * as U from "useink/utils";
import { notifySuccess } from "../utils/alert";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

function RewardNFT() {
  const [searchParams] = useSearchParams();
  const searchParamsObject = Object.fromEntries([...searchParams]);
  console.log({ searchParamsObject });

  const COLLECTION_ADDRESS = import.meta.env.VITE_CONTRACT_COLLECTION;
  const FACTORY_ADDRESS = import.meta.env.VITE_CONTRACT_FACTORY;
  const collectionContract = useContract(COLLECTION_ADDRESS, metadataCollection, "aleph-testnet");
  const factoryContract = useContract(FACTORY_ADDRESS, metadataFactory, "aleph-testnet");
  const [isFlagDeposit, setIsFlagDeposit] = useState(false);
  const collectionApprove = useTx(collectionContract, "psp34::approve");
  const factoryDistribute = useTx(factoryContract, "distributeNft");
  const [luckyUsers, setLuckyUsers] = useState([]);

  const handleReward = () => {
    if (!isFlagDeposit) {
      collectionApprove.signAndSend([import.meta.env.VITE_CONTRACT_FACTORY, null, true]);
      factoryDistribute.signAndSend([import.meta.env.VITE_CONTRACT_COLLECTION, 1]);
    }
  };

  useEffect(() => {
    if (U.isInBlock(collectionApprove)) {
      setIsFlagDeposit(true);
    } else if (U.isFinalized(collectionApprove)) {
      notifySuccess("Distribute NFT Successfully");
      setIsFlagDeposit(false);
    }
  }, [collectionApprove, isFlagDeposit]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`https://hackathon.plats.events/events/user-list/${searchParamsObject?.id}`);
        setLuckyUsers(res.data.data);
      } catch (error) {
        throw new Error(error);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Header />
      <div className="max-w-[1200px] mx-auto w-full mt-6">
        <h1 className="text-[40px] font-medium">Reward</h1>
        <div className="relative overflow-x-auto w-full mt-10">
          <table className="w-full border-2 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 border-[1px]">
                  Avatar
                </th>
                <th scope="col" className="px-6 py-3 border-[1px]">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 border-[1px]">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 border-[1px]">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 border-[1px]">
                  Set Vip
                </th>
                <th scope="col" className="px-6 py-3 border-[1px]">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {luckyUsers?.map((item) => {
                return (
                  <tr key={crypto.randomUUID()} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <img
                        src="https://d10yumrfxocri1.cloudfront.net/icon/hidden_box.png"
                        className="w-12 h-12 rounded-md"
                      />
                    </th>
                    <td className="px-6 py-4 border-[1px] font-semibold">{item.name}</td>
                    <td className="px-6 py-4 border-[1px] text-[#28b765] font-semibold">{item.email}</td>
                    <td className="px-6 py-4 border-[1px] text-[#28b765] font-semibold">{item.phone}</td>
                    <td className="px-6 py-4 border-[1px]">
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer" />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 border-[1px] font-semibold">
                      {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button
          onClick={handleReward}
          className="bg-blue-500 hover:bg-opacity-60 text-white font-medium md:font-bold py-2 px-4 md:py-3 md:px-8 rounded text-[16px] md:text-[20px] relative left-[50%] -translate-x-[50%] mt-10 flex items-center"
        >
          <div>{isFlagDeposit && <img src={LoadingIcon} className="w-10 h-10 mr-4" />}</div>
          Reward NFT
        </button>
      </div>
    </div>
  );
}

export default RewardNFT;
