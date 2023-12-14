import styled from "styled-components";
import Avatar from "@osn/common-ui/es/Account/Avatar";
import ChainIcon from "@osn/common-ui/es/Chain/ChainIcon";
import IdentityOrAddr from "./identityOrAddr";
import Flex from "@osn/common-ui/es/styled/Flex";

const Wrapper = styled(Flex)`
  color: #2e343d;

  > :not(:first-child) {
    margin-left: 4px;
  }

  > :first-child {
    margin-right: 4px;
  }
`;

export default function NetworkUser({
  address,
  network,
  iconSize,
  tooltipPosition,
  noLink,
}) {
  return (
    <Wrapper>
      <Avatar address={address} size={20} />
      {network && <ChainIcon chainName={network} size={16} />}
      <IdentityOrAddr
        address={address}
        network={network}
        iconSize={iconSize}
        tooltipPosition={tooltipPosition}
        noLink={noLink}
      />
    </Wrapper>
  );
}
