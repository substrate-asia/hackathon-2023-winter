import { useToast } from "@chakra-ui/react";
import { Account } from "./account";
import styles from "./Header.module.scss";
import logoImage from "../../../assets/images/logo.png";

type Props = {
  isAccountVisible: boolean;
};

function Header({ isAccountVisible }: Props) {
  const toast = useToast();

  const handleLogoClick = () => {
    toast({
      position: "top",
      title: "Today's clear sky is not as lovely as your smile",
      description: "今日的晴空万里，不及你一抹笑意 ",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <header className={styles.header}>
      <button type="button" onClick={handleLogoClick}>
        <img src={logoImage} alt="Logo" style={{ width: "95px", height: "76px", cursor: "pointer" }} />
      </button>

      {isAccountVisible && <Account />}
    </header>
  );
}

export { Header };
