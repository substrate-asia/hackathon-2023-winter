import tw from "tailwind-styled-components";
import useInjectedWeb3 from "./useInjectedWeb3";
import { useIsMounted } from "@osn/common";
import { useEffect, useState } from "react";
import { ReactComponent as ArrowCaretRight } from "@/imgs/icons/arrow-caret-right.svg";
import { LoadingIcon } from "@osn/common-ui";

const Wrapper = tw.div`
  flex
  justify-between
  items-center
  py-[12px]
  px-[12px]
  border
  border-stroke-action-default
  ${(p) =>
    p.disabled
      ? "border-none bg-fill-bg-tertiary pointer-events-none"
      : "cursor-pointer"}
`;

const ArrowCaretRightIcon = tw(ArrowCaretRight)`
  [&_path]:fill-text-secondary
`;

export default function WalletExtension({ wallet, onClick }) {
  const [installed, setInstalled] = useState(null);
  const { loading: loadingInjectedWeb3, injectedWeb3 } = useInjectedWeb3();
  const isMounted = useIsMounted();
  const Logo = wallet.logo;

  useEffect(() => {
    if (loadingInjectedWeb3) {
      return;
    }

    if (isMounted.current) {
      setInstalled(!!injectedWeb3?.[wallet?.extensionName]);
    }
  }, [loadingInjectedWeb3, injectedWeb3, wallet?.extensionName, isMounted]);

  const disabled = loadingInjectedWeb3 || !installed;

  return (
    <Wrapper disabled={disabled} onClick={() => onClick(wallet)}>
      <div className="flex items-center gap-[8px]">
        <Logo className={wallet.title} alt={wallet.title} />
        <span className="text-text-primary text14medium">{wallet.title}</span>
      </div>
      <div>
        {loadingInjectedWeb3 ? (
          <LoadingIcon width={24} height={24} />
        ) : installed ? (
          <ArrowCaretRightIcon width={24} height={24} />
        ) : (
          <span className="text12medium text-text-tertiary">Not installed</span>
        )}
      </div>
    </Wrapper>
  );
}
