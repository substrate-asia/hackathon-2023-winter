import IpfsImage from "@/components/image/ipfs";
import { useServerSideProps } from "@/context/serverSideProps";
import { cn } from "@/utils";

function Avatar() {
  const { detail } = useServerSideProps();
  return (
    <div
      className={cn(
        "w-[80px] h-[80px] rounded-[40px] overflow-hidden",
        "border-[2px] border-stroke-border-default",
        "absolute left-[20px] bottom-0 translate-y-[50%]",
      )}
    >
      <IpfsImage cid={detail.logoCid} />
    </div>
  );
}

export default function Cover() {
  const { detail } = useServerSideProps();
  return (
    <div className="flex flex-col relative">
      <IpfsImage cid={detail.bannerCid} />
      <Avatar />
    </div>
  );
}
