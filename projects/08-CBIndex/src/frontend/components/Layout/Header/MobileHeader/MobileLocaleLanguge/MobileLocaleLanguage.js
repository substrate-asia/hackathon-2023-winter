import languageDetector from "../../../../../lib/languageDetector";
import { useRouter } from "next/router";
import Link from "next/link";
import { GlobalOutlined } from "@ant-design/icons";
import classes from "./style.module.less";

const MobileLocaleLanguage = ({ locale, iconSize, change, ...rest }) => {
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
  const localeEvt = () => {
    languageDetector.cache(locale);
  };
  return (
    <Link
      href={router.pathname}
      as={`/${router.locale === "en" ? "zh_CN" : "en"}${router.asPath}`}
      locale={router.locale === "en" ? "zh_CN" : "en"}
      className={classes.localeIcon}
    >
      <>
        {router.locale !== locale && (
          <>
            <GlobalOutlined onClick={() => localeEvt()} />
          </>
        )}
      </>
    </Link>
  );
};

export default MobileLocaleLanguage;
