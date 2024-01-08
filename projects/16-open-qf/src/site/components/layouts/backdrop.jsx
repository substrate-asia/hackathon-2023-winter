import { cn } from "@/utils";
import React from "react";

export default function Backdrop(props) {
  return (
    <div
      {...props}
      className={cn(
        "w-full h-[308px] border-b border-stroke-border-default bg-fill-bg-primary",
        "absolute top-[81px] max-sm:top-[71px]",
        "-z-50",
        props.className,
      )}
    />
  );
}
