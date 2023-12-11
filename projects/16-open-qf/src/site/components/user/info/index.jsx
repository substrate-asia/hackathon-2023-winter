import { USER_INFO, USER_POWER } from "@/fixtures/user";
import Avatar from "../../accountSelector/avatar";
import Copy from "../../copy";
import IdentityOrAddr from "../identityOrAddr";
import QFpowerPie from "./qfpowerPie";

export default function UserInfo() {
  const footerItems = [
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
          className="w-52 h-36 py-2.5"
          percentage={USER_POWER.score}
        />
      </div>
      <div className="flex divide-x">
        {footerItems.map((item) => (
          <Item key={item.title} title={item.title}>
            <div className="flex items-center gap-5">
              {item.items.map((item) => (
                <div key={item.label} className="flex items-center gap-1">
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

function Item({ title, children }) {
  return (
    <div className="space-y-1 px-10 first:pl-0 last:pr-0">
      <div className="text16semibold text-text-primary">{title}</div>
      {children}
    </div>
  );
}
