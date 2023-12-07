import styled, { css } from "styled-components";
import { ReactComponent as ExitIcon } from "@osn/common-ui/es/Account/exit.svg";
import { ReactComponent as CircleIcon } from "@osn/common-ui/es/Account/circle.svg";
import { p_14_medium } from "@osn/common-ui";
import NetworkUser from "./networkUser";
import { encodeNetworkAddress } from "@osn/common";
import FlexBetween from "@osn/common-ui/es/styled/FlexBetween";
import { useState } from "react";
import { useLogout, useAccount } from "@/context/account";
import { noop } from "lodash-es";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    padding: 0;
    > :first-child {
      margin-top: 20px;
    }

    > :last-child {
      margin-bottom: 20px;
    }

    margin: 0;
    width: 100%;
    text-align: center;
  }
`;

const AccountWrapper = styled(FlexBetween)`
  ${p_14_medium};

  div {
    display: flex;
    align-items: center;

    .ui--IdentityIcon {
      display: flex !important;
      align-items: center !important;
    }
  }

  > div > :first-child {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  > div > :nth-child(2) {
    margin-right: 4px;
  }

  .button,
  .connect {
    width: 100%;
  }
`;

const AccountWrapperPC = styled(AccountWrapper)`
  border: 1px solid ${(p) => p.theme["--stroke-action-default"]};

  :hover {
    border: 1px solid ${(p) => p.theme["--stroke-action-active"]};
  }

  ${(p) =>
    p.show &&
    css`
      border: 1px solid ${(p) => p.theme["--stroke-action-active"]};
    `}
  padding: 7px 15px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MenuWrapper = styled.div`
  cursor: auto;
  min-width: 240px;
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid ${(p) => p.theme["--stroke-action-default"]};
  padding: 16px 16px 8px;
  z-index: 1;

  box-shadow: ${(p) => p.theme["--shadow-dropdown"]};

  @media screen and (max-width: 768px) {
    margin-top: 19px;
    border: none;
    box-shadow: none;
    width: 100%;
    position: initial;
    padding: 0;
    border-bottom: 20px solid white;
  }

  .connect {
    margin: auto;
  }
`;

const MenuItem = styled.div`
  margin-bottom: 8px;
  cursor: pointer;
  font-family: Inter, sans-serif;
  ${p_14_medium};
`;

const MenuDivider = styled.div`
  height: 1px;
  background: ${(p) => p.theme["--stroke-action-default"]};
  margin: 12px 0;
`;

const LogoutWrapper = styled(FlexBetween)`
  color: ${(p) => p.theme["--text-secondary"]};

  :hover {
    color: ${(p) => p.theme["--text-primary"]};
  }
`;

function ConnectedAccount({ setShowConnectPopup = noop }) {
  const [showMenu, setShowMenu] = useState(false);
  const account = useAccount();
  const logout = useLogout();
  const network = account.network;
  const address = encodeNetworkAddress(account.address, network);

  const onSwitch = () => {
    setShowConnectPopup(true);
    setShowMenu(false);
  };

  const onLogout = () => {
    logout();
    setShowMenu(false);
  };

  const Menu = (
    <MenuWrapper onClick={(e) => e.stopPropagation()}>
      {account && (
        <>
          <NetworkUser
            address={address}
            network={network}
            iconSize={12}
            tooltipPosition="down"
          />
          <MenuDivider />
          <MenuItem>
            <LogoutWrapper onClick={onSwitch}>
              Switch address
              <CircleIcon />
            </LogoutWrapper>
          </MenuItem>
          <MenuItem>
            <LogoutWrapper onClick={onLogout}>
              Log out
              <ExitIcon />
            </LogoutWrapper>
          </MenuItem>
        </>
      )}
    </MenuWrapper>
  );

  return (
    <Wrapper>
      <AccountWrapperPC
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        <NetworkUser
          address={address}
          network={network}
          iconSize={12}
          tooltipPosition="down"
          noLink={true}
        />
      </AccountWrapperPC>
      {showMenu && <>{Menu}</>}
    </Wrapper>
  );
}

export default ConnectedAccount;
