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
      <img
        src={`${process.env.NEXT_PUBLIC_IPFS_ENDPOINT}${detail.logoCid}`}
        alt=""
      />
    </div>
  );
}

export default function Cover() {
  const { detail } = useServerSideProps();
  return (
    <div className="flex flex-col relative">
      <img
        src={`${process.env.NEXT_PUBLIC_IPFS_ENDPOINT}${detail.bannerCid}`}
        alt=""
      />
      <Avatar />
    </div>
  );
}
