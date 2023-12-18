import Card from "@/components/card";
import NetworkUser from "../../networkUser";
import dayjs from "dayjs";
import { cn } from "@/utils";
import IpfsImage from "@/components/image/ipfs";
import LocaleSymbol from "@/components/common/localeSymbol";
import { useServerSideProps } from "@/context/serverSideProps";
import Link from "next/link";
import NoData from "@/components/noData";

export default function UserTabContributionsContent() {
  const { contributions } = useServerSideProps();

  if (!contributions.length) {
    return <NoData />;
  }

  return (
    <div className="space-y-5">
      {contributions.map((item) => (
        <Card key={item.projectId} size="small">
          <div
            className={cn(
              "flex items-center gap-6",
              "max-sm:flex-col max-sm:items-start max-sm:gap-4",
            )}
          >
            <IpfsImage className="w-12 h-12" cid={item.project.logoCid} />

            <div
              className={cn(
                "w-full flex justify-between gap-5",
                "max-sm:flex-col max-sm:gap-4",
              )}
            >
              <div className="space-y-1">
                <h3 className="text16semibold">
                  <Link
                    href={`/rounds/${item.project.roundId}/projects/${item.project.id}`}
                    className="hover:underline hover:text-inherit"
                  >
                    {item.project.name}
                  </Link>
                </h3>
                <div className="flex items-center text14medium">
                  <p className="text-text-tertiary mr-2">by</p>
                  <NetworkUser
                    address={item.project.creator}
                    network="polkadot"
                  />
                </div>
              </div>

              <div className={cn("space-y-1 text-right", "max-sm:text-left")}>
                <div className="text16semibold">
                  <LocaleSymbol value={item.balance} />
                </div>
                <div className="text14medium text-text-tertiary">
                  {dayjs().format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
