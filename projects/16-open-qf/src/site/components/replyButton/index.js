import { cn } from "@/utils";
import { SystemReply } from "@osn/icons/opensquare";
import { noop } from "lodash-es";

export default function ReplyButton({ disabled, onClick = noop }) {
  return (
    <div
      className={cn(
        "cursor-pointer flex items-center gap-[8px] group",
        disabled && "pointer-events-none",
      )}
      onClick={onClick}
    >
      <div>
        <SystemReply className="w-[16px] h-[16px] [&_path]:fill-text-tertiary [&_path]:group-hover:fill-text-secondary" />
      </div>
      <span className="text14medium text-text-tertiary group-hover:text-text-secondary">
        Reply
      </span>
    </div>
  );
}
