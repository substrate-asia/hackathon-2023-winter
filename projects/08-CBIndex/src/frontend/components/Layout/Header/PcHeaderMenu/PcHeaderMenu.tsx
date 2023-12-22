import React from "react";
import { useRouter } from "next/router";
import classes from "./style.module.less";
import Link from "next/link";
import { RouterPathName } from "../../../../utils/consts/Consts";

const PcHeaderMenu = () => {
  const router = useRouter();
  const headerMenuList = [
    { key: "/vaults", label: "Active Fund", pathname: RouterPathName.Vaults },
  ];

  return (
    <div className={classes.container}>
      {/* Menu */}
      <div className={classes.optionArea}>
        {headerMenuList.map((item, index) => {
          return (
            <Link href={item.key} key={item.key}>
              <div
                style={{
                  color:
                    router.pathname === item.pathname
                      ? "var(--text-second-color)"
                      : "",
                }}
                className={classes.optionItem}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default PcHeaderMenu;
