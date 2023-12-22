import { useContract, useTx, useWallet } from "useink";
import { useTxNotifications } from "useink/notifications";
// import metadata from "../../assets/erc721.json";
import metadata from "../../assets/Passport.json";
import { WriteView } from "./WriteView";

export const Erc721 = () => {
  // const contractAddress = "XvHZtPHMgx6JJKkqGwwyUsiTNnYr7UwTPjuTionGaLwwcFW";
  const contractAddress = "XxFZhk32yigWi8j4ZLEVBPzEEaGsEbrnggpd2LJWehAzPBs";
  const erc721 = useContract(contractAddress || "", metadata);

  // const approve = useTx(erc721, "approve");
  // useTxNotifications(approve);

  const { account } = useWallet();

  console.log("address is this : ", account?.address);
  return (
    <>
      {erc721 && (
        <>
          <WriteView erc721={erc721}/>
        </>
      )}
    </>
  );
};

export default Erc721;
