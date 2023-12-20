import Connect from "../connect";
import Link from "next/link";
import HeaderMobileMenu from "./menu";
import { cn } from "@/utils";

export default function Header() {
  return (
    <div
      className={cn(
        "border-b border-stroke-border-default",
        "bg-fill-bg-primary",
        "flex justify-center",
      )}
    >
      <div
        className={cn(
          "w-full max-w-[1440px]",
          "py-5 px-8",
          "flex items-center justify-between",
        )}
      >
        <div className="flex items-center">
          <Link href="/">
            <img src="/logo-openqf.png" alt="" className="w-[141px] h-10" />
          </Link>
          <div className="h-6 mx-4 border-r border-stroke-border-default" />
          <div className="flex items-center gap-x-2.5">
            <img src="/symbol-opensquare.svg" alt="" />
            <img
              src="/type-opensquare.svg"
              alt=""
              className="mt-[3px] max-sm:hidden"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="max-sm:hidden flex items-center gap-x-8">
            <Link
              href={"/"}
              className={cn(
                "text-text-secondary text14semibold",
                "hover:underline hover:text-text-secondary",
              )}
            >
              Home
            </Link>
            <Connect />
          </div>

          <HeaderMobileMenu className="sm:hidden" />
        </div>
      </div>
    </div>
  );
}
