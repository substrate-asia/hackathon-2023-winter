import { MdCancel } from "@react-icons/all-files/md/MdCancel";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useRouter } from "next/router";

const Deliver = () => {
  const [confirmDeliver, setConfirmDeliver] = useState(false);

  const router = useRouter();

  return confirmDeliver ? (
    <div className="h-full w-full rounded relative">
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
        onClick={() => setConfirmDeliver(false)}
        className="z-10 absolute right-2 top-2 bg-schemes-light-primary text-schemes-light-onPrimary flex w-fit justify-center rounded-full p-3 hover:bg-coreColors-primary transition duration-200"
      >
        <MdCancel className="text-2xl m-auto" />
      </button>
    </div>
  ) : (
    <button
      onClick={() => setConfirmDeliver(true)}
      className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4"
    >
      Deliver
    </button>
  );
};

export default Deliver;
