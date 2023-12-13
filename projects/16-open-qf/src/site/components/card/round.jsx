import { cn } from "@/utils";
import dayjs from "dayjs";
import Tag from "../tag";
import Card from ".";
import { Button } from "../button";
import Link from "next/link";
import { abbreviateBigNumber, toPrecision } from "@osn/common";
import { DECIMALS } from "@/utils/constants";
import IpfsImage from "../image/ipfs";

export function RoundCardMetadata({ data, linkTitle = true }) {
  const title = linkTitle ? (
    <Link
      href={`/rounds/${data.id}`}
      className="hover:underline hover:text-inherit"
    >
      {data.title}
    </Link>
  ) : (
    data.title
  );

  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4",
        "max-sm:block max-sm:space-y-4",
      )}
    >
      <div>
        <h3 className="text20semibold text-text-primary">{title}</h3>
        <p className="mt-1 text14medium text-text-link">
          {dayjs(data.date.start).format("YYYY/MM/DD")} -
          {dayjs(data.date.end).format("YYYY/MM/DD")}
        </p>
      </div>

      <div>
        <Tag>{data.type || "TODO"}</Tag>
      </div>
    </div>
  );
}

export default function RoundCard({
  data = {},
  hoverable = false,
  linkTitle = true,
}) {
  return (
    <Card
      hoverable={hoverable}
      cover={<IpfsImage cid={data.bannerCid} className="object-cover" />}
      head={
        <>
          <div>
            <RoundCardMetadata data={data} linkTitle={linkTitle} />

            <p className="mt-4 text-text-secondary text14medium line-clamp-3">
              {data.description}
            </p>
          </div>
        </>
      }
    >
      <div
        className={cn("grid grid-cols-4 gap-4", "max-sm:flex max-sm:flex-col")}
      >
        <FooterItem
          label="Matching Pool"
          content={`${abbreviateBigNumber(
            toPrecision(data.asset.amount, DECIMALS),
          )} ${data.asset.id}`}
        />
        <FooterItem
          label="Contributors"
          content={data.contributors || "TODO"}
        />
        <FooterItem label="Program Funders" content={data.founders?.[0]} />
        <div className={cn("flex items-end justify-end")}>
          <Button className="max-sm:w-full">Apply</Button>
        </div>
      </div>
    </Card>
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
