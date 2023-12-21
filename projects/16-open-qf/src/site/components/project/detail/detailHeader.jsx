import { useServerSideProps } from "@/context/serverSideProps";
import Divider from "@/components/divider";
import WebsiteLink from "@/components/websiteLink";
import { cn } from "@/utils";
import NetworkUser from "@/components/user/networkUser";

function MetaItem({ title, children }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="text14medium text-text-tertiary">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Meta() {
  const { detail } = useServerSideProps();
  return (
    <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full gap-[20px]">
      <MetaItem title="Create by">
        <NetworkUser address={detail.creator} network="polkadot" />
      </MetaItem>
      <MetaItem title="Donation address">
        <NetworkUser address={detail.donationAddress} network="polkadot" />
      </MetaItem>
      <MetaItem title="Category">
        <span
          className={cn(
            "px-[8px] py-[2px]",
            "text12medium text-text-secondary",
            "rounded-[10px] border border-stroke-action-default",
          )}
        >
          {detail.category}
        </span>
      </MetaItem>
      <MetaItem title="Related links">
        <div className="flex gap-[8px] flex-wrap">
          {(detail.links || []).map((item, index) => (
            <WebsiteLink key={index} href={item} />
          ))}
        </div>
      </MetaItem>
    </div>
  );
}

function Description() {
  const { detail } = useServerSideProps();

  return (
    <div className="flex flex-col gap-[8px]">
      <h1 className="text20semibold text-text-primary">{detail.name}</h1>
      <span className="text14medium text-text-tertiary">{detail.summary}</span>
    </div>
  );
}

export default function DetailHeader() {
  return (
    <>
      <Description />
      <Divider />
      <Meta />
    </>
  );
}
