import {
  LogoGithub,
  LogoGoogleDoc,
  LogoGoogleDrive,
  LogoMedium,
  LogoTelegram,
  LogoTwitter,
  LogoYoutube,
  SystemLink2,
} from "@osn/icons/opensquare";

const websiteConfigs = [
  {
    host: "youtube.com",
    icon: LogoYoutube,
    name: "YouTube",
  },
  {
    host: "youtu.be",
    icon: LogoYoutube,
    name: "YouTube",
  },
  {
    host: "github.com",
    icon: LogoGithub,
    name: "GitHub",
  },
  {
    host: "github.io",
    icon: LogoGithub,
    name: "GitHub",
  },
  {
    host: "medium.com",
    icon: LogoMedium,
    name: "Medium",
  },
  {
    host: "twitter.com",
    icon: LogoTwitter,
    name: "Twitter",
  },
  {
    host: "t.me",
    icon: LogoTelegram,
    name: "Telegram",
  },
  {
    host: "docs.google.com",
    icon: LogoGoogleDoc,
    name: "Google Docs",
  },
  {
    host: "drive.google.com",
    icon: LogoGoogleDrive,
    name: "Google Drive",
  },
];

function getWebsiteConfigFromUrl(url) {
  const urlObj = new URL(url);
  const host = urlObj.host;
  return websiteConfigs.find((item) => item.host === host);
}

export default function WebsiteLink({ href }) {
  const cfg = getWebsiteConfigFromUrl(href);
  let Icon = cfg?.icon || SystemLink2;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text14medium text-text-primary"
      title={cfg?.name || href}
    >
      <Icon className="w-[20px] h-[20px]" />
    </a>
  );
}
