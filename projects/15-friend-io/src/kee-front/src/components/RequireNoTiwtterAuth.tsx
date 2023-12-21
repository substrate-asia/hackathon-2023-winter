import { FC, ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useGetAuthByTwitterQuery } from "@/app/services/auth";

import { useAppSelector } from "@/app/store";
import { shallowEqual } from "react-redux";

// 如果用户没有得到从twitter的授权，则跳转到twitter授权页面。

interface Props {
  children: ReactElement;
  redirectTo?: string;
}

const RequireNoTwitterAuth: FC<Props> = ({ children, redirectTo = "/twitterAuth" }) => {
  // useEffect(() => {
  //   if (wallet) {
  //     // bind user wallet address to user_id
  //     bindWallet2User(wallet.address);
  //   }
  // }, [wallet]);

  //查询用户状态，是否授权过twitter。
  const { data: twitterId } = useGetAuthByTwitterQuery();
  console.log("query-----------------");
  console.log(twitterId?.toString());
  let authTwitter = false;
  if (twitterId !== "0") {
    authTwitter = true;
  }
  console.log("authTwitter is:" + authTwitter);
  // const { authTwitter, twitterUid } = useAppSelector((store) => store.authData, shallowEqual);
  // if (authTwitter) return null;
  //  未初始化 则先走setup 流程
  console.log("to onAuthTwitter");
  if (!authTwitter) return <Navigate to={`/onAuthTwitter`} replace />;
  console.log("to home page!");
  if (authTwitter) return children;
};

export default RequireNoTwitterAuth;
