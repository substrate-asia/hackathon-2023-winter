import { cn } from "@/utils";
import { SystemChecked, SystemCopy } from "@osn/icons/opensquare";
import copy from "copy-to-clipboard";
import React, { useState } from "react";
import Tooltip from "./tooltip";

export default function Copy({ text = "", className = "" }) {
  const [isCopied, setIsCopied] = useState(false);

  function copyText() {
    const copied = copy(text);
    if (copied) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }

  return (
    <Tooltip content={isCopied ? "Copied" : "Copy"} hideOnClick={false}>
      <span
        role="button"
        className={cn("group", "inline-flex", className)}
        onClick={copyText}
      >
        <SystemCopy
          className={cn(
            isCopied ? "hidden" : "inline-block",
            "w-5 h-5",
            "[&_path]:fill-text-tertiary",
            "group-hover:[&_path]:fill-text-secondary",
          )}
        />
        <SystemChecked
          className={cn(
            isCopied ? "inline-block" : "hidden",
            "w-5 h-5",
            "[&_path]:fill-[var(--accent-green500a)]",
          )}
        />
      </span>
    </Tooltip>
  );
}
