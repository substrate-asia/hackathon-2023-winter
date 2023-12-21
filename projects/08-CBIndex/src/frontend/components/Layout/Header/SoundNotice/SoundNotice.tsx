import { useTranslation } from "next-i18next";
import { SoundOutlined } from "@ant-design/icons";
import classes from "./style.module.less";
const SoundNotice = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <div className={classes.topNoticeArea}>
        <a href="https://sim.cbindex.finance" target="_blank">
          <SoundOutlined style={{ marginRight: "6px" }} />
          {t(
            "CBIndex Simulator V2 Beta is now live! We welcome feedback and suggestions!"
          )}
        </a>
      </div>
    </>
  );
};
export default SoundNotice;
