import Header from "../components/Header";
import Input from "../components/Input";
import Textera from "../components/Textera";
import { useSearchParams } from "react-router-dom";
import { LoadingIcon } from "../assets";
import { useEffect, useState } from "react";
import { useContract, useTx } from "useink";
import metadata from "../utils/contract.json";
import * as U from "useink/utils";
import { notifyError, notifySuccess } from "../utils/alert";
import { ToastContainer } from "react-toastify";

function PaymentCrowdSponsor() {
  const [searchParams] = useSearchParams();
  const searchParamsObject = Object.fromEntries([...searchParams]);
  const { name, price_type, total_price, blockchain, end_at, des } = searchParamsObject;
  const CONTRACT_ADDRESS_ALPHE = import.meta.env.VITE_CONTRACT_ADDRESS_ALEPH;
  const alpheContract = useContract(CONTRACT_ADDRESS_ALPHE, metadata, "aleph-testnet");
  const [isFlagDeposit, setIsFlagDeposit] = useState(false);
  const alpheDeposit = useTx(alpheContract, "deposit");

  useEffect(() => {
    if (U.isInBlock(alpheDeposit)) {
      setIsFlagDeposit(true);
    } else if (U.isFinalized(alpheDeposit) && isFlagDeposit) {
      notifySuccess("Deposit Successfully");
      setIsFlagDeposit(false);
      setTimeout(() => {
        window.location.href = "https://hackathon.plats.events/payment-success?type=2";
      }, [2000]);
    }
  }, [alpheDeposit]);

  const handleDeposit = async () => {
    if (!localStorage.getItem("CreateNFT")) {
      notifyError("Please connect wallet");
      return;
    }
    if (!isFlagDeposit) {
      alpheDeposit.signAndSend([], { value: BigInt(0.01 * 1e12) });
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />

      <Header />
      <div className="max-w-[1200px] mx-auto ">
        <h1 className="text-[24px] font-semibold mt-4 border-b-2 w-fit border-b-blue-400">Crowd Sponsor</h1>
        <div className="p-4 pt-0 border-2 rounded-lg mt-8">
          <Input label="Name" value={name} />
          <div className="grid grid-cols-2 gap-10">
            <Input label="Blockchain" value={blockchain} />
            <Input label="Token" value={price_type} />
          </div>
          <div className="grid grid-cols-2 gap-10">
            <Input label="Total Price" value={total_price} />
            <Input label="End At" value={end_at} />
          </div>
          <Textera label="Description" value={des} />
          <div className="w-[80%] flex flex-col items-end">
            <div className="w-full">
              <h1 className="text-[20px] font-bold mt-4">Sponsor package1</h1>
              <div>
                <Input label="Name" value="Platinum" />
                <Input label="Price" value="500" />
                <Textera
                  label="Description"
                  value="Event and pre-event naming opportunities (common with Title Sponsors!)
Sponsor representative on the event planning committee
A thank you from all speakers during opening and closing ceremonies
Free tickets to events and VIP sessions
Reserved seating
Event speaker opportunities"
                />
              </div>
            </div>
            <div className="w-full">
              <h1 className="text-[20px] font-bold mt-4">Sponsor package2</h1>
              <div>
                <Input label="Name" value="Gold" />
                <Input label="Price" value="300" />
                <Textera
                  label="Description"
                  value="Special blog posts and newsletter features
Social media spotlights
Attendee discounts for those who purchase sponsor’s product, sign up for service, join a newsletter, or give a follow on social media
Press and media opportunities like interviews"
                />
              </div>
            </div>
            <div className="w-full">
              <h1 className="text-[20px] font-bold mt-4">Sponsor package3</h1>
              <div>
                <Input label="Name" value="Silver" />
                <Input label="Price" value="200" />
                <Textera
                  label="Description"
                  value="Branding opportunities on swag and promotional gear
On-site signage and banners
Logo on flyers, ads, badges and programs
Logo on website and digital promotion
Banners on event apps
Free or heavily discounted booths"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleDeposit}
        disabled={U.shouldDisable(alpheDeposit)}
        className="mt-4 bg-blue-500 hover:bg-opacity-60 text-white font-medium md:font-bold  md:py-3 md:px-8 rounded text-[16px] md:text-[20px] relative left-[50%] -translate-x-[50%] items-center flex"
      >
        <div>{isFlagDeposit && <img src={LoadingIcon} className="w-10 h-10 mr-4" />}</div>
        Deposit
      </button>
    </div>
  );
}

export default PaymentCrowdSponsor;
