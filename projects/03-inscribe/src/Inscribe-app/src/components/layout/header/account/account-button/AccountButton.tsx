import Identicon from "@polkadot/react-identicon";
import { buttonStyles } from "@gear-js/ui";
import { Button } from "@chakra-ui/react";
import "./style.css";

type Props = {
  address: string;
  name: string | undefined;
  onClick: () => void;
  isActive?: boolean;
  block?: boolean;
};

// eslint-disable-next-line
function AccountButton({ address, name, onClick, isActive, block }: Props) {
  return (
    <Button backgroundColor="green.600" borderRadius="30px" onClick={onClick}>
      <Identicon value={address} className={buttonStyles.icon} theme="polkadot" size={28} />
      {name}
    </Button>
  );
}

export { AccountButton };
