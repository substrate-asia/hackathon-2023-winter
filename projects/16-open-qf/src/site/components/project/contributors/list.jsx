import NetworkUser from "@/components/user/networkUser";
import { toPrecision } from "@osn/common";
import dayjs from "dayjs";
import { cn } from "@/utils";
import Tag from "@/components/tag";
import { Pagination } from "@osn/common-ui";
import { useState } from "react";
import { useProjectContributorsData } from "@/hooks/project/useProjectContributorsData";
import { useAccount } from "@/context/account";

export default function ContributionsList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const account = useAccount();
  const { data: contributors } = useProjectContributorsData(page, pageSize);

  if (!contributors?.total) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col w-full">
        {contributors.items.map((item) => {
          const amount = toPrecision(item.balance, 10);

          return (
            <div
              key={item.address}
              className={cn(
                "grid grid-cols-3 py-5",
                "max-sm:grid-cols-2",
                "border-t border-stroke-border-default last:border-b",
                "text14medium",
              )}
            >
              <div className="flex items-center gap-x-2">
                <NetworkUser address={item.address} network="polkadot" />
                {item.address === account?.address && "block" && (
                  <Tag
                    size="small"
                    className="bg-fill-bg-tertiary border-transparent"
                  >
                    Mine
                  </Tag>
                )}
              </div>
              <div className="text-center text-text-tertiary max-sm:hidden">
                {dayjs(item.timestamp).format("YYYY-MM-DD")}
              </div>
              <div className="text-right">{amount} DOT</div>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <Pagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          total={contributors.total || 0}
        />
      </div>
    </div>
  );
}
