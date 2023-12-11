import { USER_INFO, USER_POWER } from "@/fixtures/user";
import Avatar from "../../accountSelector/avatar";
import Copy from "../../copy";
import IdentityOrAddr from "../identityOrAddr";
import QFpowerPie from "./qfpowerPie";
import { cn } from "@/utils";

export default function UserInfo() {
  const footerItems = [
    {
      className: "sm:hidden",
      title: "QFpower",
      items: [
        {
          label: "Score",
          value: USER_POWER.score?.toFixed(2),
        },
      ],
    },
    {
      title: "Contributions",
      items: [
        {
          label: "Contributions",
          value: USER_INFO.contributions.contributions,
        },
        {
          label: "Value",
          value: `${USER_INFO.contributions.value} DOT`,
        },
      ],
    },
    {
      title: "Project",
      items: [
        {
          label: "Proposed",
          value: USER_INFO.project.proposed,
        },
        {
          label: "Contributors",
          value: USER_INFO.project.contributors,
        },
        {
          label: "Received",
          value: `${USER_INFO.project.received} DOT`,
        },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-5 justify-between">
        <div>
          <div>
            <Avatar address={USER_INFO.address} size={64} />
          </div>
          <div className="mt-4 text-text-primary text24bold">
            <IdentityOrAddr
              noLink
              noIcon
              className="[&_*]:!text24bold"
              address={USER_INFO.address}
            />
          </div>
          <div className="mt-1 text14medium text-text-tertiary flex items-center">
            <IdentityOrAddr
              noLink
              noIcon
              className="[&_*]:!text14medium"
              address={USER_INFO.address}
            />
            <Copy text={USER_INFO.address} className="ml-1" />
          </div>
        </div>
        <QFpowerPie
          className="w-52 h-36 py-2.5 max-sm:hidden"
          percentage={USER_POWER.score}
        />
      </div>
      <div
        className={cn(
          "flex",
          "max-sm:divide-none max-sm:flex-col max-sm:gap-y-2",
        )}
      >
        {footerItems.map((item) => (
          <Item key={item.title} title={item.title} className={item.className}>
            <div
              className={cn("flex gap-x-5", "max-sm:flex-col max-sm:gap-y-1")}
            >
              {item.items.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-1",
                    "max-sm:justify-between",
                  )}
                >
                  <div className="text-text-tertiary text14medium">
                    {item.label}
                  </div>
                  <div className="text-text-primary text14semibold">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </Item>
        ))}
      </div>
    </div>
  );
}

function Item({ title, children, className = "" }) {
  return (
    <div className={cn("group flex", className)}>
      <div className={"space-y-1 w-full"}>
        <div className="text16semibold text-text-primary">{title}</div>
        {children}
      </div>

      <div className="max-sm:hidden mx-10 h-full w-px bg-fill-bg-quaternary group-last:hidden" />
    </div>
  );
}
