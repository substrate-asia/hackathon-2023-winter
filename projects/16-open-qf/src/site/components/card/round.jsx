import { cn } from "@/utils";
import dayjs from "dayjs";
import Tag from "../tag";
import Card from ".";
import { Button } from "../button";
import Link from "next/link";
import IpfsImage from "../image/ipfs";
import LocaleSymbol from "../common/localeSymbol";

export function RoundCardMetadata({ data, linkTitle = true }) {
  let title = data.title;
  if (linkTitle) {
    title = (
      <Link
        href={`/rounds/${data.id}`}
        className="hover:underline hover:text-inherit"
      >
        {title}
      </Link>
    );
  }

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
        <Tag>{data.category}</Tag>
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
          content={<LocaleSymbol value={data.asset.amount} />}
        />
        <FooterItem
          label="Contributors"
          content={data.contributorsCount || 0}
        />
        <FooterItem label="Program Funders" content={data.founders?.[0]} />
        <div className={cn("flex items-end justify-end")}>
          <Link href="/apply" className="max-sm:w-full">
            <Button className="w-full">Apply</Button>
          </Link>
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
