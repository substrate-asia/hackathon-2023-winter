import React, { useState } from "react";
import { AiFillEye } from "@react-icons/all-files/ai/AiFillEye";
import { AiFillEyeInvisible } from "@react-icons/all-files/ai/AiFillEyeInvisible";
import QRCode from "react-qr-code";

const ShowCode = ({ ship }) => {
  const [showCode, setShowCode] = useState(false);
  return (
    <div className="h-full flex flex-col justify-between">
      <QRCode
        className="p-1 my-5"
        size={256}
        style={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
        }}
        value={"http://localhost:3000/carrier/pick/" + ship}
        viewBox={`0 0 256 256`}
      />
      {showCode ? (
        <div className="flex gap-2 items-centerh-12">
          <p className="m-auto">{ship}</p>
          <button
            onClick={() => setShowCode(false)}
            className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4 transition duration-200"
          >
            <AiFillEyeInvisible className="text-2xl m-auto" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2 items-centerh-12">
          <p className="m-auto">**********</p>
          <button
            onClick={() => setShowCode(true)}
            className="bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4 transition duration-200"
          >
            <AiFillEye className="text-2xl m-auto" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowCode;
