import { cn } from "@/utils";
import { noop } from "lodash-es";

export default function Tag({
  children,
  className = "",
  size = "default",
  active = false,
  onClick = noop,
  ...props
}) {
  return (
    <span
      role="button"
      className={cn(
        size === "default" && "px-4 py-1.5 text14semibold",
        size === "small" && "px-2 py-0.5 text12medium",
        "border border-stroke-action-default bg-fill-bg-primary rounded-full",
        "text-text-primary",
        active && "text-text-brand-secondary border-stroke-bg-brand-secondary",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </span>
  );
}
