import { Header as CommonHeader } from "@osn/common-ui";
import Connect from "../connect";
import Link from "next/link";
import HeaderMobileMenu from "./menu";

export default function Header() {
  return (
    <CommonHeader logoRender={(logo) => <Link href={"/"}>{logo}</Link>}>
      <div className="flex justify-between items-center grow">
        <div className="flex items-center">
          <img src="/icons/openqf.svg" alt="OpenQF" />
          <span className="ml-3 text18semibold">OpenQF</span>
        </div>

        <div className="max-sm:hidden">
          <Connect />
        </div>

        <HeaderMobileMenu className="sm:hidden" />
      </div>
    </CommonHeader>
  );
}
