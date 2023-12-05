import { Header as CommonHeader } from "@osn/common-ui";
import Connect from "../connect";

export default function Header() {
  return (
    <CommonHeader>
      <div className="flex justify-between items-center grow">
        <div></div>
        <Connect />
      </div>
    </CommonHeader>
  );
}
