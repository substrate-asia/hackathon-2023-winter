import { cn } from "@/utils";
import { Card as CardBase } from "@osn/common-ui";

export default function Card(props) {
  return (
    <div
      className={cn(
        "border border-fill-bg-primary",
        "bg-fill-bg-primary",
        "shadow-shadow-card-default hover:shadow-shadow-card-hover",
        "[&_.osn-card]:shadow-none [&_.osn-card]:bg-transparent",
      )}
    >
      <CardBase bordered={false} {...props}></CardBase>
    </div>
  );
}
