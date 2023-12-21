import { cn } from "@/utils";

export default function Dot({ className = "", ...props }) {
  return (
    <span className={cn("text-text-tertiary", className)} {...props}>
      ·
    </span>
  );
}
