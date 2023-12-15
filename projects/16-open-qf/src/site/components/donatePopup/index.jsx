import { useCallback, useState } from "react";
import Modal from "@osn/common-ui/es/Modal";
import { useServerSideProps } from "@/context/serverSideProps";
import { cn } from "@/utils";
import { SimpleProjectCard } from "../card/project";
import SvgProjectIconPolkadotLight from "@osn/icons/subsquare/ProjectIconPolkadotLight";
import { Button } from "../button";
import useApi from "@/hooks/useApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "@/store/reducers/toastSlice";
import BigNumber from "bignumber.js";
import { sendTx } from "@/utils/sendTx";
import { useAccount } from "@/context/account";
import useSetApiSigner from "@/hooks/useSetApiSigner";
import { getDecimalByChain } from "@osn/common";
import Tooltip from "../tooltip";

function DonateInput({ value, setValue }) {
  return (
    <div className="flex gap-[8px] items-center grow">
      <input
        type="number"
        placeholder="0"
        className={cn(
          "grow",
          "placeholder-text-quaternary text14medium",
          "outline-none px-[16px] py-[12px]",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span className="text-text-primary text14semibold">DOT</span>
      <div>
        <SvgProjectIconPolkadotLight className="w-[20px] h-[20px]" />
      </div>
    </div>
  );
}

export default function DonatePopup({ open, setOpen }) {
  const dispatch = useDispatch();
  const account = useAccount();
  const api = useApi();
  const [value, setValue] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { detail } = useServerSideProps();
  const { donationAddress } = detail;

  useSetApiSigner();

  const doDonate = useCallback(async () => {
    if (!api || !account || !donationAddress) {
      return;
    }
    if (!value) {
      dispatch(newErrorToast("Please input value"));
      return;
    }
    const signerAddress = account?.address;

    const decimals = getDecimalByChain("polkadot");
    const donateValue = new BigNumber(value)
      .multipliedBy(Math.pow(10, decimals))
      .toNumber();
    const tx = api.tx.balances.transfer(donationAddress, donateValue);
    await sendTx({
      api,
      tx,
      dispatch,
      setLoading,
      onClose: () => {
        setOpen(false);
      },
      signerAddress,
    });
  }, [dispatch, api, donationAddress, value, account, setOpen]);

  return (
    <Modal open={open} setOpen={setOpen} footer={false}>
      <div className="flex flex-col gap-[20px]">
        <span className="text16semibold text-text-primary">Donate To</span>
        <SimpleProjectCard project={detail} />
        <div className="flex flex-col gap-[12px]">
          <span className="text-text-primary text16semibold">Value</span>
          <DonateInput value={value} setValue={setValue} />
        </div>
        <Tooltip content="Donation is disabled in demo mode">
          <div className="flex flex-col">
            <Button disabled={true} isLoading={isLoading} onClick={doDonate}>
              Submit Your Donation
            </Button>
          </div>
        </Tooltip>
      </div>
    </Modal>
  );
}
