import { cn } from "@/utils";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { useState } from "react";

// fixed
const colors = {
  bg: "rgba(25, 30, 39, 0.9)",
  fg: "#fff",
};

export default function Tooltip({
  defaultOpen = false,
  delayDuration = 0,
  content,
  children,
  side,
  sideOffset = 2,
  hideOnClick = true,
  ...restProps
}) {
  const [open, setOpen] = useState(defaultOpen);

  const tooltipContent = content && (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={sideOffset}
        side={side}
        className={cn("z-[10000] py-2 px-3", "text14medium break-words")}
        style={{
          backgroundColor: colors.bg,
          color: colors.fg,
        }}
      >
        {content}
        <RadixTooltip.Arrow style={{ fill: colors.bg }} />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root
        delayDuration={delayDuration}
        defaultOpen={defaultOpen}
        open={!hideOnClick ? open : undefined}
        {...restProps}
      >
        <RadixTooltip.Trigger
          asChild
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </RadixTooltip.Trigger>

        {tooltipContent}
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
