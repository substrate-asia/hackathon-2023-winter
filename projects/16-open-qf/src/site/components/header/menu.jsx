import { cn } from "@/utils";
import { Button } from "@osn/common-ui";
import {
  SystemAccount,
  SystemClose,
  SystemLogout,
  SystemMenu,
} from "@osn/icons/opensquare";
import { useState } from "react";
import Card from "../card";
import NetworkUser from "../user/networkUser";
import { useClickAway, useLockBodyScroll } from "react-use";
import NodeSelect from "../nodeSelect";
import { useFloating } from "@floating-ui/react";
import { useAccount, useLogout } from "@/context/account";
import { useRouter } from "next/router";
import Connect from "../connect";
import Link from "next/link";

export default function HeaderMobileMenu({ className = "" }) {
  const account = useAccount();
  const [visible, setVisible] = useState(false);

  useLockBodyScroll(visible);

  return (
    <div className={className}>
      <div>
        <Button
          className="!p-2 !border-0 ring-1 ring-stroke-action-default"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {visible ? (
            <SystemClose className="[&_path]:fill-text-secondary" />
          ) : (
            <SystemMenu className="[&_path]:fill-text-secondary" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-[71px] bg-black/20",
          "z-50",
          !visible && "hidden",
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setVisible(false);
          }
        }}
      >
        <Card className={cn("border-0 border-b shadow-none")}>
          <div className="space-y-5">
            <div className=" py-3 text-center text14semibold text-text-secondary">
              <Link href={"/"} className="hover:text-inherit">
                Home
              </Link>
            </div>

            {account ? (
              <Account />
            ) : (
              <div className="[&_button]:w-full">
                <Connect />
              </div>
            )}

            <NodeSelect />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Account() {
  const account = useAccount();
  const { refs, floatingStyles } = useFloating();
  const [visible, setVisible] = useState(false);
  const logout = useLogout();
  const router = useRouter();

  useClickAway(refs.reference, () => {
    setVisible(false);
  });

  const items = [
    {
      icon: <SystemAccount />,
      label: "Profile",
      onClick() {
        router.push(`/users/${account.address}`);
      },
    },
    {
      label: "Disconnect",
      icon: <SystemLogout />,
      onClick() {
        logout();
        setVisible(false);
      },
    },
  ];

  return (
    <div className="relative" ref={refs.setReference}>
      <Button
        className="w-full"
        onClick={() => {
          setVisible(!visible);
        }}
      >
        <NetworkUser {...account} noLink />
      </Button>

      {visible && (
        <div
          ref={refs.setFloating}
          className="w-full z-10"
          style={floatingStyles}
        >
          <div className={cn("bg-fill-bg-primary shadow-shadow-popup", "py-2")}>
            {items.map((item, idx) => (
              <div
                role="button"
                key={idx}
                className={cn(
                  "flex items-center gap-2 w-full",
                  "px-4 py-2",
                  "text14medium text-text-primary",
                  "[&_svg_path]:fill-text-tertiary",
                  "active:bg-fill-bg-tertiary",
                )}
                onClick={item.onClick}
              >
                {item.icon}
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
