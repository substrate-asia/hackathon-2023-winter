import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

import { KEY_LOCAL_MAGIC_TOKEN } from "@/app/config";
import { useTwitterCodeAuthMutation, useBindWallet2UserMutation } from "@/app/services/auth";
import StyledButton from "../../components/styled/Button";
import { useNavigate } from "react-router-dom";

export type GithubLoginSource = "widget" | "webapp";
type Props = {
  code: string;
};

const TwitterCallback: FC<Props> = ({ code }) => {
  const { t } = useTranslation("auth");
  const { t: ct } = useTranslation();
  const navigateTo = useNavigate();
  // const [wallet, setWallet] = useState<Wallet>();

  //根据code生成
  const [twitterCodeAuth, { isLoading, isSuccess, error }] = useTwitterCodeAuthMutation();
  const [bindWallet2User] = useBindWallet2UserMutation();
  useEffect(() => {
    if (code) {
      twitterCodeAuth(code);
    }
  }, [code]);
  // useEffect(() => {
  //   if (isSuccess) {
  //     let address = createNewWallet();
  //     setWallet(address);
  //   }
  // }, [isSuccess]);
  // useEffect(() => {
  //   if (wallet) {
  //     // bind user wallet address to user_id
  //     bindWallet2User(wallet.address);
  //   }
  // }, [wallet]);
  const handleClose = () => {
    // window.close();
    navigateTo("/");
  };
  if (error) return <span className="text-red-500 text-lg">Something Error</span>;
  return (
    <section className="flex-center flex-col gap-3">
      <StyledButton onClick={handleClose}>{ct("action.close")}</StyledButton>
      {isSuccess && <h1>{t("github_cb_tip")}</h1>}
      <span className="text-3xl text-green-600 font-bold">
        {isLoading ? t("github_logging_in") : t("github_login_success")}
      </span>
    </section>
  );
};

export default TwitterCallback;
