import { cn } from "@/utils";

export default function MainContainer({ children, className = "" }) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl",
        "mx-auto",
        "px-8 py-20",
        "max-sm:px-4 max-sm:py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
