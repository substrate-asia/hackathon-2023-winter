import { Button } from "@osn/common-ui";
import Card from "@/components/card";
import React, { useCallback, useState } from "react";
import { cn } from "@/utils";
import { noop } from "lodash-es";
import { newErrorToast } from "@/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { useAccount } from "@/context/account";
import { useRouter } from "next/router";
import Tooltip from "@/components/tooltip";

export default function SocialLinkItem({
  item,
  isConnected,
  onConnect = noop,
  disabled,
}) {
  const account = useAccount();
  const router = useRouter();
  const { address } = router.query;
  const isMyProfile = account?.address === address;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConnect();
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, onConnect]);

  let connectBtn = null;

  if (isMyProfile) {
    if (disabled) {
      connectBtn = (
        <Tooltip content="Disabled in demo environment">
          <div>
            <Button disabled>Connect</Button>
          </div>
        </Tooltip>
      );
    } else if (isConnected) {
      connectBtn = <Button disabled>Verified</Button>;
    } else {
      connectBtn = (
        <Button isLoading={isLoading} onClick={onClick}>
          Connect
        </Button>
      );
    }
  }

  return (
    <Card key={item.title} size="small">
      <div className="space-y-5">
        <div className="flex justify-between">
          <div className="w-12 h-12 bg-fill-bg-quaternary">
            <img src={item.image} alt="" />
          </div>
          <div className="text16semibold text-text-brand-secondary">
            {isConnected ? `+${item.power}` : "0"}
          </div>
        </div>

        <div className={cn("flex justify-between gap-5", "max-sm:flex-col")}>
          <div className="space-y-1">
            <h5 className="text16semibold text-text-primary">{item.title}</h5>
            <p className="text14medium text-text-tertiary">
              {item.description}
            </p>
          </div>
          <div className="flex items-end">{connectBtn}</div>
        </div>
      </div>
    </Card>
  );
}
