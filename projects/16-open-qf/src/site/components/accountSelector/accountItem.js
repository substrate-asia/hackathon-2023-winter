import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Avatar from "./avatar";
import { encodeAddress } from "@polkadot/util-crypto";
import { ChainSS58Format, identityChainMap } from "@osn/constants";
import { fetchIdentity } from "@osn/common/es/services/identity";
import IdentityIcon from "@osn/common-ui/es/User/IdentityIcon";
import tw from "tailwind-styled-components";

const Address = tw.span`
  text12medium
  text-text-tertiary
`;

const ItemWrapper = styled.div`
  display: flex;
  height: 60px;
  padding: 12px 12px;
  gap: 12px;
  align-items: center;
  ${(p) =>
    p.header &&
    css`
      max-width: calc(100% - 48px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      pointer-events: none;
    `}
`;

const IdentityWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;

  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const IdentityName = styled.span``;

const IdentityDisplay = ({ identity, displayAccountName, chain }) => {
  return identity?.info && identity?.info?.status !== "NO_ID" ? (
    <IdentityWrapper>
      <IdentityIcon status={identity.info.status} size={12} />
      <IdentityName>{identity.info.display}</IdentityName>
    </IdentityWrapper>
  ) : (
    <span className="text-text-primary text14medium">{displayAccountName}</span>
  );
};

const AccountItem = ({ header, accountName, accountAddress, chain }) => {
  const [identity, setIdentity] = useState();
  const ss58Format = ChainSS58Format[chain];
  let address = accountAddress;
  if (typeof ss58Format === "number") {
    address = encodeAddress(accountAddress, ss58Format);
  }
  let displayAccountName = accountName;
  useEffect(() => {
    const identityChain = identityChainMap[chain] || chain;
    const fetchIdentityAbortController = new AbortController();
    fetchIdentity(identityChain, accountAddress, {
      signal: fetchIdentityAbortController.signal,
    })
      .then((identity) => {
        setIdentity(identity);
      })
      .catch(() => {});

    return () => {
      fetchIdentityAbortController.abort();
    };
  }, [accountAddress, chain]);

  return (
    <ItemWrapper header={header}>
      <Avatar address={accountAddress} size={36} />
      <div className="flex flex-col w-full overflow-hidden">
        <IdentityDisplay
          identity={identity}
          displayAccountName={displayAccountName}
          chain={chain}
        />
        <Address className="truncate">{address}</Address>
      </div>
    </ItemWrapper>
  );
};

export default AccountItem;
