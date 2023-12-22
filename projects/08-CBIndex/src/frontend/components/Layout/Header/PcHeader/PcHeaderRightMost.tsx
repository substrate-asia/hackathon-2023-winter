import React, { useState, createRef } from "react";
import { Badge, Dropdown, Button } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import type { MenuProps } from "antd";
import { useTranslation } from "next-i18next";
import classes from "./style.module.less";
// import GlobalLoading from "../../../Common/GlobalLoading/GlobalLoading";
// import OgShareNotification from "../../../Notification/OgShareNotification";
const HeaderRightMost = ({ }) => {
  const { t } = useTranslation("header");
  const ogShareNotifiCationRef: any = createRef();
  const router = useRouter();
  const [globalLoading, setGloabalLoaidng] = useState(false);
  let token = localStorage.getItem("token");
  // let items: MenuProps["items"] = [
  //   {
  //     key: "1",
  //     label: (
  //       <div className={classes.profileInfo}>
  //         <div>
  //           <div>
  //             {t("userName")} {userInfo.nickname}
  //           </div>
  //         </div>
  //       </div>
  //     ),
  //     disabled: true,
  //   },
  //   {
  //     key: "2",
  //     label: (
  //       <div
  //         onClick={() => {
  //           ogShareNotifiCationRef.current.openNotification();
  //         }}
  //       >
  //         {t("inviteFriends")}
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "6",
  //     label: (
  //       <div
  //         onClick={() => {
  //           localStorage.removeItem("token");
  //           localStorage.removeItem("userId");
  //           // setGloabalLoaidng(true);
  //           router.push("/discovery");
  //           setTimeout(() => {
  //             // setGloabalLoaidng(false);
  //           }, 1500);
  //         }}
  //       >
  //         {t("logout")}
  //       </div>
  //     ),
  //   },
  // ];
  // if (userInfo.role !== "og") {
  //   items = items.filter((item) => item.key !== "2");
  // }
  return (
    <>
      {/* <OgShareNotification
        t={t}
        userInfo={userInfo}
        onRef={ogShareNotifiCationRef}
      />
      {globalLoading && <GlobalLoading />}
      {token ? (
        <div className={classes.notificationAndProfileArea}>
          <Badge dot={readStatus} offset={[-20, 0]}>
            <BellOutlined
              onClick={() => {
                router.push("/notifications");
              }}
              className={classes.notificationIcon}
            ></BellOutlined>
          </Badge>
          <Dropdown menu={{ items }}>
            <div>
              <UserOutlined
                style={{
                  border: "none",
                  padding: "3px",
                  borderRadius: "50%",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                  backgroundColor: "#50f6bf",
                  cursor: "pointer",
                }}
              />
            </div>
          </Dropdown>
        </div>
      ) : (
        <div
          className="plainBtn"
          style={{ marginLeft: "12px" }}
          onClick={() => router.push("/login")}
        >
          {t("login")}
        </div>
      )} */}
    </>
  );
};

export default HeaderRightMost;
