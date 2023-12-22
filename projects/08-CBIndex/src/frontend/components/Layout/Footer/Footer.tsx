import React from "react";
import { useTranslation } from "next-i18next";
import classes from "./style.module.less";
import Image from "next/image";
import cbiLogo from "/public/logo/cbi_logo.png";
import xLogo from "/public/logo/x_logo.png";
import telegramLogo from "/public/logo/telegram_logo.png";
import githubLogo from "/public/logo/github_logo.png";
import mediumLogo from "/public/logo/medium_logo.png";

export default function Footer() {
  const { t } = useTranslation("footer");
  return (
    <footer className={classes.container}>
      <div className={classes.footerArea}>
        <div className={classes.mobileHeaderTopArea}></div>
        <div className={classes.cbiLogo}>
          <a href="https://cbindex.finance/" target="_blank">
            <Image src={cbiLogo} alt={"cbi"} width={48} height={50} />
          </a>
        </div>
        <div className={classes.cbiSlogan}>
          POWERING BETTER CRYPTO INVESTMENT
        </div>
        <div className={classes.socialMediaIconArea}>
          <a
            className={classes.socialMediaIcon}
            href="https://twitter.com/CBIndex_Global"
            target="_blank"
          >
            <Image src={xLogo} alt={"x"} width={26} height={26} />
          </a>
          <a
            className={classes.socialMediaIcon}
            href="https://t.me/CBIndexGlobal"
            target="_blank"
          >
            <Image src={telegramLogo} alt={"telegram"} width={24} height={24} />
          </a>
          <a
            className={classes.socialMediaIcon}
            href="https://github.com/CypherBabel-Lab"
            target="_blank"
          >
            <Image src={githubLogo} alt={"github"} width={24} height={24} />
          </a>
          <a
            className={classes.socialMediaIcon}
            href="https://medium.com/@cbindex"
            target="_blank"
          >
            <Image src={mediumLogo} alt={"github"} width={24} height={24} />
          </a>
        </div>
        <div className={classes.companyInfo}>
          DApp Version 1.0.1 Beta © 2023 CypherBabel Labs. All Rights Reserved.
        </div>
      </div>
      <div className={classes.drawALine}></div>
      <div className={classes.footerArea}>
        <div className={classes.disclaimerTitle}>
          {t("Important Disclaimer")}
        </div>
        <div className={classes.disclaimerContent}>
          {t(
            "The information, data, and services provided on the CBIndex platform are for informational purposes only and should not be considered as financial, investment, legal, or tax advice. CBIndex does not guarantee the accuracy, completeness, or timeliness of the information provided on the platform. CBIndex is not responsible for any actions taken or decisions made based on the information, data, or services provided. Crypto index data, index creation and management, index fund creation and management, and index fund investing capabilities offered by CBIndex involve a high degree of risk, and the value of investments may fluctuate and can go down as well as up. You may lose some or all of your invested capital. Past performance is not indicative of future results, and no representation or warranty is made that any investment strategy or performance will be consistent with past performance. CBIndex does not provide personalized investment advice or recommendations. Before making any investment or financial decision, users should consult with a qualified financial advisor, legal counsel, or tax professional to discuss their specific situation, objectives, and risk tolerance. Users should also carefully consider their investment objectives, risks, charges, and expenses before investing in any crypto index fund or other investment products offered on the CBIndex platform. By using the CBIndex platform, you agree to be bound by the terms and conditions of the platform and acknowledge that investing in cryptocurrencies and related products involves significant risks. CBIndex, its affiliates, and its employees are not liable for any direct, indirect, incidental, consequential, or any other damages arising from the use of the platform, its services, or any information provided on the platform. CBIndex reserves the right to modify, suspend, or discontinue any services or features available on the platform at any time without notice. CBIndex is not responsible for any errors or omissions, or for the results obtained from the use of the platform's services or information."
          )}
        </div>
      </div>
    </footer>
  );
}
