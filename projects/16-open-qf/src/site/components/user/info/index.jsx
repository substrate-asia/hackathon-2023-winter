import { USER_INFO } from "@/fixtures/user";
import Avatar from "../../accountSelector/avatar";
import Copy from "../../copy";
import IdentityOrAddr from "../identityOrAddr";
import QFpowerPie from "./qfpowerPie";
import { cn } from "@/utils";
import { useRouter } from "next/router";
import { useServerSideProps } from "@/context/serverSideProps";
import { sumBy } from "lodash-es";
import LocaleSymbol from "@/components/common/localeSymbol";

export default function UserInfo() {
  const router = useRouter();
  const address = router.query.address;
  const { activityTags, userActivityTags, contributions } =
    useServerSideProps();

  const contributionsValue = sumBy(contributions, "balance");

  const allPowerScore = sumBy(activityTags, "power");
  const userPowerScore = sumBy(userActivityTags, "power");

  const footerItems = [
    {
      className: "sm:hidden",
      title: "QFpower",
      items: [
        {
          label: "Score",
          value: userPowerScore?.toFixed(2),
        },
      ],
    },
    {
      title: "Contributions",
      items: [
        {
          label: "Contributions",
          value: contributions?.length || 0,
        },
        {
          label: "Value",
          value: <LocaleSymbol value={contributionsValue} />,
        },
      ],
    },
    false && {
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
          value: <LocaleSymbol value={USER_INFO.project.received} />,
        },
      ],
    },
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex gap-5 justify-between">
        <div>
          <div>
            <Avatar address={address} size={64} />
          </div>
          <div className="mt-4 text-text-primary text24bold">
            <IdentityOrAddr
              noLink
              noIcon
              network="polkadot"
              className="[&_*]:!text24bold"
              address={address}
            />
          </div>
          <div className="mt-1 text14medium text-text-tertiary flex items-center">
            <IdentityOrAddr
              noLink
              noIcon
              className="[&_*]:!text14medium"
              address={address}
            />
            <Copy text={address} className="ml-1" />
          </div>
        </div>
        <QFpowerPie
          className="w-52 h-36 py-2.5 max-sm:hidden"
          allScore={allPowerScore}
          userScore={userPowerScore}
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
