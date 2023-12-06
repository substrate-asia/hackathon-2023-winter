import { cn } from "@/utils";
import dayjs from "dayjs";
import Tag from "../tag";
import Card from ".";
import { Button } from "../button";
import Link from "next/link";

export function RoundCardMetadata({ data }) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between",
        "max-sm:block max-sm:space-y-4",
      )}
    >
      <div>
        <Link href={`/explore/${data.id}`} className="hover:underline">
          <h3 className="text20semibold text-text-primary">{data.title}</h3>
        </Link>
        <p className="mt-1 text14medium text-text-link">
          {dayjs(data.startDate).format("YYYY/MM/DD")} -
          {dayjs(data.endDate).format("YYYY/MM/DD")}
        </p>
      </div>

      <div>
        <Tag>{data.type}</Tag>
      </div>
    </div>
  );
}

export default function RoundCard({ data = {} }) {
  return (
    <div>
      <div
        className={cn("sm:hidden", "h-[120px] w-full bg-fill-bg-tertiary")}
      />

      <Card
        bordered={false}
        head={
          <>
            <div>
              <RoundCardMetadata data={data} />

              <p className="mt-4 text-text-secondary text14medium line-clamp-3">
                {data.description}
              </p>
            </div>
          </>
        }
        prefix={
          <>
            <div className="osn-card-prefix max-sm:hidden">
              <div className="w-[216px] h-[216px] bg-fill-bg-tertiary"></div>
            </div>
          </>
        }
      >
        <div
          className={cn(
            "grid grid-cols-4 gap-4",
            "max-sm:flex max-sm:flex-col",
          )}
        >
          <FooterItem
            label="Matching Pool"
            content={`${data.matchingPool} DOT`}
          />
          <FooterItem label="Contributors" content={data.contributors} />
          <FooterItem label="Program Funders" content={data.programFunders} />
          <div className={cn("flex items-end justify-end")}>
            <Button className="max-sm:w-full">Apply</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FooterItem({ label = "", content }) {
  return (
    <div className="space-y-1">
      <div className="text14medium text-text-tertiary">{label}</div>
      <div className="text16semibold text-text-primary">{content}</div>
    </div>
  );
}
