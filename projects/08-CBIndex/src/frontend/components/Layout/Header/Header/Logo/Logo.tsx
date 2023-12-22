import React from "react";
import { useRouter } from "next/router";
import Image from "next/image.js";
import classes from "./style.module.less";
const Logo = () => {
  const router = useRouter();
  return (
    <>
      <div
        onClick={() => {
          router.push("/activefund/vaults");
        }}
        className={classes.logoArea}
      >
        <Image src={"/icon/cbi_logo.png"} width={96} height={34} alt="Logo" />
      </div>
    </>
  );
};
export default Logo;7
