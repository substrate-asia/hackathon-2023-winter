import Card from "@/components/card";
import { USER_CONTRIBUTIONS_RESULT } from "@/fixtures/user";
import NetworkUser from "../../networkUser";
import dayjs from "dayjs";
import { cn } from "@/utils";
import IpfsImage from "@/components/image/ipfs";

export default function UserTabContributionsContent() {
  return (
    <div className="space-y-5">
      {USER_CONTRIBUTIONS_RESULT.items.map((item) => (
        <Card key={item.id} size="small">
          <div
            className={cn(
              "flex items-center gap-6",
              "max-sm:flex-col max-sm:items-start max-sm:gap-4",
            )}
          >
            <IpfsImage className="w-12 h-12" cid={item.logoCid} />

            <div
              className={cn(
                "w-full flex justify-between gap-5",
                "max-sm:flex-col max-sm:gap-4",
              )}
            >
              <div className="space-y-1">
                <h3 className="text16semibold">{item.name}</h3>
                <div className="flex items-center text14medium">
                  <p className="text-text-tertiary mr-2">by</p>
                  <NetworkUser address={item.creator} network="polkadot" />
                </div>
              </div>

              <div className={cn("space-y-1 text-right", "max-sm:text-left")}>
                <div className="text16semibold">1000 DOT</div>
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
