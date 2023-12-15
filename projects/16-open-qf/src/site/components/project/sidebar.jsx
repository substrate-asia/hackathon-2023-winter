import tw from "tailwind-styled-components";
import { Button } from "@/components/button";
import { useServerSideProps } from "@/context/serverSideProps";
import { toPrecision } from "@osn/common";
import NetworkUser from "../user/networkUser";
import DonatePopup from "../donatePopup";
import { useState } from "react";

const Content = tw.div`flex flex-col gap-[16px]`;

const Info = ({ title, value }) => {
  return (
    <div className="flex flex-col gap-[4px] items-center">
      <span className="text14medium text-text-tertiary">{title}</span>
      <span className="text24bold ntext-text-primary">{value}</span>
    </div>
  );
};

function getDecimalsFromSymbol(symbol) {
  if (symbol === "DOT") {
    return 10;
  }
  return 12;
}

export default function Sidebar() {
  const [showDonatePopup, setShowDonatePopup] = useState(false);
  const { detail } = useServerSideProps();
  const contributors = detail?.contributors || [];
  const totalRaised = contributors
    .filter((item) => item.symbol === "DOT")
    .reduce((acc, cur) => acc + BigInt(cur.amount), 0n);
  const totalDot = toPrecision(
    totalRaised.toString(),
    getDecimalsFromSymbol("DOT"),
  );

  return (
    <div className="w-full p-[32px] shadow-shadow-card-default">
      <div className="flex flex-col gap-[20px] items-center">
        <Content>
          <Info title="Total Raised" value={`${totalDot} DOT`} />
          <Info title="Contributors" value={detail.contributorsCount || 0} />
          <Info
            title="Donation Address"
            value={
              <NetworkUser
                address={detail?.donationAddress}
                network="polkadot"
                iconSize={24}
                className="!text20semibold"
              />
            }
          />
        </Content>
        <Button className="w-full" onClick={() => setShowDonatePopup(true)}>
          Donate
        </Button>
        {showDonatePopup && (
          <DonatePopup open={showDonatePopup} setOpen={setShowDonatePopup} />
        )}
      </div>
    </div>
  );
}
