import facebookIcon from "assets/images/socials/facebook.png";
import instagramIcon from "assets/images/socials/instagram.png";
import telegramIcon from "assets/images/socials/telegram.png";
import twitterIcon from "assets/images/socials/twitter.png";
import whatsappIcon from "assets/images/socials/whatsapp.png";
import styles from "./Socials.module.scss";

const socials = [
  { href: "https://www.facebook.com/profile.php?id=61550205246256", icon: facebookIcon },
  { href: "https://twitter.com/gear_techs1", icon: instagramIcon },
  { href: "https://twitter.com/gear_techs2", icon: telegramIcon },
  { href: "https://twitter.com/gear_techs3", icon: twitterIcon },
  { href: "https://twitter.com/gear_techs4", icon: whatsappIcon },
];

export function Socials() {
  const getItems = () =>
    socials.map(({ href, icon }) => (
      <li key={href}>
        <a href={href} target="_blank" rel="noreferrer">
          <img src={icon} alt="Social Icon" style={{ width: "30px", height: "30px" }} />
        </a>
      </li>
    ));

  return <ul className={styles.socials}>{getItems()}</ul>;
}
