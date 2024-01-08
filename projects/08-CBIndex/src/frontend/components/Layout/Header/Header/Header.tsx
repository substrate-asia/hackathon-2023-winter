import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
import PcHeader from "../PcHeader/PcHeader";
// import MobilHeader from "../MobileHeader/MobileHeader";
// import classes from "./style.module.less";

const Header = () => {
  return (
    <div>
      <div
        className={`${"md:hidden flex"}
          }`}
      >
        <PcHeader
        />
        {/* <w3m-button /> */}
      </div>
    </div>
  );
};
export default Header;

