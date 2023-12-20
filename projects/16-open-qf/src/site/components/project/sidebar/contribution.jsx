import tw from "tailwind-styled-components";
import { Button } from "@/components/button";
import { useServerSideProps } from "@/context/serverSideProps";
import NetworkUser from "@/components/user/networkUser";
import DonatePopup from "@/components/donatePopup";
import { useState } from "react";
import { useAccount } from "@/context/account";
import LocaleSymbol from "@/components/common/localeSymbol";

const Content = tw.div`flex flex-col gap-[16px]`;

const Info = ({ title, value }) => {
  return (
    <div className="flex flex-col gap-[4px] items-center">
      <span className="text14medium text-text-tertiary">{title}</span>
      <span className="text20semibold text-text-primary">{value}</span>
    </div>
  );
};

export default function Contribution() {
  const account = useAccount();
  const [showDonatePopup, setShowDonatePopup] = useState(false);
  const { detail } = useServerSideProps();

  return (
    <div className="bg-fill-bg-primary w-full p-[32px] shadow-shadow-card-default">
      <div className="flex flex-col gap-[20px] items-center">
        <Content>
          <Info
            title="Total Raised"
            value={<LocaleSymbol value={detail.raised || 0} />}
          />
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
        {account && (
          <Button className="w-full" onClick={() => setShowDonatePopup(true)}>
            Donate
          </Button>
        )}
        {showDonatePopup && (
          <DonatePopup open={showDonatePopup} setOpen={setShowDonatePopup} />
        )}
      </div>
    </div>
  );
}
