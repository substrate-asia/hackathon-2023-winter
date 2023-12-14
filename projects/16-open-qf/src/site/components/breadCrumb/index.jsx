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
      <div className="flex gap-[8px] text16semibold">
        {items?.map((item, index) => {
          if (item.url) {
            return (
              <Link
                key={index}
                className="cursor-pointer text-text-primary"
                href={item.url}
              >
                {item.name}
              </Link>
            );
          }

          return (
            <Fragment key={index}>
              <span className="text-text-tertiary">/</span>
              <span className="text-text-tertiary">{item.name}</span>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
