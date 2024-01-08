import languageDetector from "../../../../../lib/languageDetector";
import { useRouter } from "next/router";
import Link from "next/link";
import { GlobalOutlined } from "@ant-design/icons";
import { Button } from "antd";
import classes from "./style.module.less";
const PopupLocaleLink = ({ locale, iconSize, change, ...rest }) => {
  const router = useRouter();
  let href = rest.href || router.asPath;
  let pName = router.pathname;
  Object.keys(router.query).forEach((k) => {
    if (k === "locale") {
      pName = pName.replace(`[${k}]`, locale);
      return;
    }
    pName = pName.replace(`[${k}]`, router.query[k]);
  });
  if (locale) {
    href = rest.href ? `/${locale}${rest.href}` : pName;
  }
  if (href.indexOf(`/${locale}`) < 0) {
    href = `/${locale}${href}`;
  }
  function formatLocaleText(locale) {
    if (locale === "en") {
      return "English";
    }
    if (locale === "zh_CN") {
      return "中文";
    }
    return locale;
  }
  const localeEvt = () => {
    languageDetector.cache(locale);
  };
  return (
    <Link
      href={router.pathname}
      as={`/${router.locale === "en" ? "zh_CN" : "en"}${router.asPath}`}
      locale={router.locale === "en" ? "zh_CN" : "en"}
      className={classes.localeBtnForSidebarMenu}
    >
      <div className="plainBtn">
        <p style={{ fontSize: iconSize }} onClick={() => localeEvt()}>
          {router.locale !== locale && (
            <>
              <GlobalOutlined
                width={"100%"}
                style={{
                  marginRight: 6,
                }}
              />
              {formatLocaleText(router.locale)}
            </>
          )}
        </p>
      </div>
    </Link>
  );
};

export default PopupLocaleLink;
