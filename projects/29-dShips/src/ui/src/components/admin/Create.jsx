"use client";
import React, { useEffect, useState } from "react";
import { ADDRESS, ABI } from "../../config";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
const shortid = require("shortid");
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";

const Create = () => {
  const { address } = useAccount();

  const [recipient, setRecipient] = useState("");
  const [fromAddressStreet, setFromAddressStreet] = useState("");
  const [fromAddressNumber, setFromAddressNumber] = useState("");
  const [fromAddressCity, setFromAddressCity] = useState("");
  const [fromAddressCountry, setFromAddressCountry] = useState("");
  const [toAddressStreet, setToAddressStreet] = useState("");
  const [toAddressNumber, setToAddressNumber] = useState("");
  const [toAddressCity, setToAddressCity] = useState("");
  const [toAddressCountry, setToAddressCountry] = useState("");
  const [id, setId] = useState(shortid.generate());
  const [deliveryCode, setDeliveryCode] = useState(shortid.generate());

  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi: ABI,
    functionName: "createShipment",
    args: [
      id,
      recipient,
      toAddressStreet +
        " " +
        toAddressNumber +
        " " +
        toAddressCity +
        " " +
        toAddressCountry,
      fromAddressStreet +
        " " +
        fromAddressNumber +
        " " +
        fromAddressCity +
        " " +
        fromAddressCountry,
      deliveryCode,
    ],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const emptyForm = () => {
    setRecipient("");
    setFromAddressStreet("");
    setFromAddressNumber("");
    setFromAddressCity("");
    setFromAddressCountry("");
    setToAddressStreet("");
    setToAddressNumber("");
    setToAddressCity("");
    setToAddressCountry("");
    setId(shortid.generate());
    setDeliveryCode(shortid.generate());
  };

  useEffect(() => {
    isSuccess && emptyForm();
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-3xl font-black">Create</p>
      <form
        className="flex flex-col gap-4 md:w-6/12"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2">
          <label>Sender</label>
          <input
            disabled
            className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
            value={address}
          ></input>
        </div>
        <div className="flex flex-col gap-2">
          <label>From address</label>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
              placeholder="Street"
              onChange={(e) => setFromAddressStreet(e.target.value)}
              value={fromAddressStreet}
            ></input>
            <input
              className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
              placeholder="Number"
              onChange={(e) => setFromAddressNumber(e.target.value)}
              value={fromAddressNumber}
            ></input>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
              placeholder="City"
              onChange={(e) => setFromAddressCity(e.target.value)}
              value={fromAddressCity}
            ></input>
            <input
              className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
              placeholder="Country"
              onChange={(e) => setFromAddressCountry(e.target.value)}
              value={fromAddressCountry}
            ></input>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label>Recipient</label>
          <input
            className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
            onChange={(e) => setRecipient(e.target.value)}
            value={recipient}
          ></input>
        </div>
        <div className="flex flex-col gap-2">
          <label>To address</label>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
              placeholder="Street"
              onChange={(e) => setToAddressStreet(e.target.value)}
              value={toAddressStreet}
            ></input>
            <input
              className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
              placeholder="Number"
              onChange={(e) => setToAddressNumber(e.target.value)}
              value={toAddressNumber}
            ></input>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
              placeholder="City"
              onChange={(e) => setToAddressCity(e.target.value)}
              value={toAddressCity}
            ></input>
            <input
              className="px-2 py-1 border-2 rounded-full border-coreColors-secondary focus:border-coreColors-primary"
              placeholder="Country"
              onChange={(e) => setToAddressCountry(e.target.value)}
              value={toAddressCountry}
            ></input>
          </div>
        </div>
        <button
          className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4"
          onClick={() => write()}
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="text-xl m-auto animate-spin" />
          ) : (
            "Create ship"
          )}
        </button>
      </form>
    </div>
  );
};

export default Create;
