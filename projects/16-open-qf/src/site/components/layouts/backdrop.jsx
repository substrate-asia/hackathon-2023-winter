import { cn } from "@/utils";
import React from "react";

export default function Backdrop(props) {
  return (
    <div
      {...props}
      className={cn(
        "w-full h-[308px] border-b border-stroke-border-default bg-fill-bg-primary",
        "absolute top-20",
        "-z-50",
        props.className,
      )}
    />
  );
}
