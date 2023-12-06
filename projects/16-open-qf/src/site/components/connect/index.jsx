import ConnectWalletButton from "./connectWalletButton";
import { useSelector } from "react-redux";
import { accountSelector } from "@/store/reducers/accountSlice";

export default function Connect() {
  const account = useSelector(accountSelector);
  console.log(account);

  return (
    <div>
      <ConnectWalletButton />
    </div>
  );
}
