import React, { useState, useRef, createRef } from "react";
import { Router, useRouter } from "next/router";
import classes from "./style.module.less";
import { Button, Badge, Menu, theme } from "antd";
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];
import { SearchOutlined, MenuOutlined, BellOutlined } from "@ant-design/icons";
// import { Popup } from "antd-mobile";
import { useTranslation } from "next-i18next";
// import i18nextConfig from "../../../../next-i18next.config";
import PopupLocaleLink from "./MobileLocaleLanguge/PopupLocale";
import MobileLocaleLanguage from "./MobileLocaleLanguge/MobileLocaleLanguage";
// import OgShareNotification from "../../../Notification/OgShareNotification";
// import FloatCliamFaucet from "../../FloatCliamFaucet";

const MobilHeader = () => {
  const router = useRouter();
  const Language = useRef(null);
  // const token = localStorage.getItem("token");
  const { t } = useTranslation("header");
  const ogShareNotifiCationRef: any = createRef();
  const [rightMask, setRightMask] = useState(false);
  let PopupMenuList = [
    { key: "/", label: t("copyFund") },
    { key: "/portfoliocreate", label: t("leadingInvestment") },
    { key: "/swap", label: t("swap") },
    { key: "/leaderboard", label: t("leaderboard") },
    { key: "share", label: t("inviteFriends") },
    { key: "/fundmanagement", label: t("fundManagement") },
    { key: "/wallet", label: t("wallet") },
  ];


  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem(t("copyAFund"), "sub1", "", [
      getItem(t("fundList"), "/copyfund/fundlist"),
      getItem(t("leadingInvestment"), "/copyfund/be-a-leader"),
      getItem(t("swap"), "/copyfund/swap"),
    ]),
    getItem(t("activeFund"), "sub2", "", [
      getItem(t("createFund"), "/activefund/createactivefund"),
      getItem(t("investInFund"), "/activefund/investactivefund"),
    ]),
    getItem(t("indexFund"), "sub3", "", [
      getItem(t("createFund"), "/indexfund/createindexfund"),
      getItem(t("investInFund"), "/indexfund/investindexfund"),
    ]),
    getItem(t("cryptoIndex"), "sub4", "", [
      getItem(t("indexList"), "/cryptoindex/indexlist"),
      getItem(t("createIndexFromToken"), "/cryptoindex/createtokenindex"),
      getItem(t("createIndexFromCICS"), "/cryptoindex/createcicsindex"),
      getItem(t("indexAnalyze"), "/cryptoindex/analyzeindex"),
    ]),
    getItem(t("mydashboard"), "sub5", "", [
      getItem(t("wallet"), "/dashboard/myprofile"),
      getItem(t("myAsset"), "/dashboard/myasset"),
      getItem(t("copyFund"), "/dashboard/copyfund"),
      getItem(t("activeFund"), "/dashboard/activefund"),
      getItem(t("indexFund"), "/dashboard/indexfund"),
      getItem(t("cryptoIndex"), "/dashboard/cryptoindex/createdindex"),
      getItem(t("txHistory"), "/dashboard/txhistory"),
      getItem(t("invitedUser"), "/dashboard/inviteduser"),
    ]),
    getItem(t("cics"), "/cics/cicstree", ""),
    getItem(t("Leaderboard"), "/leaderboard", ""),
    getItem(t("Document"), "https://cbindex.finance/CBIndex_whitepaper_2023_v1.pdf", ""),
  ];

  // const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const rootSubmenuKeys = ["sub1", "sub2", "sub3", "sub4", "sub5"];
  const [openKeys, setOpenKeys] = useState([""]);
  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <>
      {/* narrow width */}
      <div className={classes.mobileHeaderTopArea}>
        {/* Search bar */}
        <div
          className={classes.searchIcon}
          onClick={() => {
            router.push("/searchlist");
          }}
        >
          <SearchOutlined />
        </div>
      </div>
    </>
  );
};

export default MobilHeader;
