import Link from "next/link";
import { ArrowCaretLeft } from "@osn/icons/opensquare";
import { Fragment } from "react";
import { cn } from "@/utils";

export default function BreadCrumb({ items }) {
  return (
    <div className="flex gap-[16px] items-center">
      <div
        className={cn(
          "p-[6px]",
          "rounded-[18px] border border-stroke-border-default",
          "bg-fill-bg-primary shadow-shadow-card-default",
        )}
      >
        <ArrowCaretLeft className="w-[24px] h-[24px]" />
      </div>
      <div className="flex flex-wrap gap-[8px] text16semibold">
        {items?.map((item, index) => (
          <Fragment key={index}>
            {!!index && <span className="text-text-tertiary">/</span>}
            {item.url ? (
              <Link
                className="cursor-pointer text-text-primary"
                href={item.url}
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-text-tertiary">{item.name}</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
