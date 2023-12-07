import { cn } from "@/utils";
import { Card as CardBase } from "@osn/common-ui";

export default function Card({ cover, coverPosition = "auto", ...props }) {
  return (
    <div
      className={cn(
        "border border-stroke-border-default",
        "bg-fill-bg-primary",
        "shadow-shadow-card-default hover:shadow-shadow-card-hover",
        "[&_.osn-card]:shadow-none [&_.osn-card]:bg-transparent [&_.osn-card]:h-full [&_.osn-card]:w-full",
        props.className,
      )}
    >
      {cover && (
        <div
          className={cn(
            "h-[120px] w-full bg-fill-bg-quaternary",
            coverPosition === "auto" && "sm:hidden",
            coverPosition === "top" && "block",
          )}
        >
          {cover}
        </div>
      )}
      <CardBase
        bordered={false}
        {...props}
        prefix={
          cover && (
            <>
              <div
                className={cn(
                  "osn-card-prefix",
                  coverPosition === "auto" && "max-sm:hidden",
                  coverPosition === "top" && "hidden",
                )}
              >
                <div className="w-[216px] h-[216px] bg-fill-bg-quaternary">
                  {cover}
                </div>
              </div>
            </>
          )
        }
      />
    </div>
  );
}
