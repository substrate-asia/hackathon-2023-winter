import { cn } from "@/utils";

function Avatar() {
  return (
    <div
      className={cn(
        "w-[80px] h-[80px] rounded-[40px] overflow-hidden",
        "border-[2px] border-stroke-border-default",
        "absolute left-[20px] bottom-0 translate-y-[50%]",
      )}
    >
      <img src="/imgs/avatar.png" alt="" />
    </div>
  );
}

export default function Cover() {
  return (
    <div className="flex flex-col relative">
      <img src="/imgs/project-cover.png" alt="" />
      <Avatar />
    </div>
  );
}
