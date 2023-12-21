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
  iconSize = 20,
  tooltipPosition,
  noLink,
  className = "",
}) {
  return (
    <Wrapper>
      <Avatar address={address} size={iconSize} />
      {network && <ChainIcon chainName={network} size={iconSize * (16 / 20)} />}
      <IdentityOrAddr
        address={address}
        network={network}
        iconSize={iconSize * (16 / 20)}
        tooltipPosition={tooltipPosition}
        noLink={noLink}
        className={className}
      />
    </Wrapper>
  );
}
