import { cn } from "@/utils";

export default function Tag({ children, className = "", ...props }) {
  return (
    <span
      className={cn(
        "px-4 py-1.5",
        "border border-stroke-action-default bg-fill-bg-primary rounded-full",
        "text14semibold text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
