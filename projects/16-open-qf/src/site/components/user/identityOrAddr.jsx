import { useIsMounted } from "@osn/common";
import { useEffect, useState } from "react";
import { fetchIdentity } from "@osn/common/es/services/identity";
import IdentityIcon from "@osn/common-ui/es/User/IdentityIcon";
import { addressEllipsis, encodeNetworkAddress } from "@osn/common";
import { identityChainMap } from "@osn/constants";
import Link from "next/link";
import { cn } from "@/utils";

export default function IdentityOrAddr({
  address,
  network,
  iconSize,
  tooltipPosition,
  noIcon,
  noLink,
  className = "",
}) {
  const isMounted = useIsMounted();
  const [identity, setIdentity] = useState();

  let ss58Address = address;
  if (address && network) {
    ss58Address = encodeNetworkAddress(address, network);
  }

  useEffect(() => {
    if (!address || !network) {
      return;
    }
    const identityChain = identityChainMap[network] || network;
    fetchIdentity(identityChain, address)
      .then((identity) => {
        if (isMounted.current) {
          setIdentity(identity);
        }
      })
      .catch(console.error);
  }, [network, address, isMounted]);

  return (
    <Link
      className={cn(
        "text-text-primary text14medium",
        "hover:underline hover:text-inherit",
        noLink && "pointer-events-none",
        className,
      )}
      href={`/users/${ss58Address}`}
    >
      {identity?.info && identity?.info?.status !== "NO_ID" ? (
        <>
          {!noIcon && (
            <IdentityIcon
              status={identity.info.status}
              showTooltip
              size={iconSize}
              position={tooltipPosition}
            />
          )}
          <span>{identity.info.display}</span>
        </>
      ) : (
        <span>{addressEllipsis(ss58Address)}</span>
      )}
    </Link>
  );
}
