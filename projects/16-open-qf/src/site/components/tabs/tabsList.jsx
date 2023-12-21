import { cn } from "@/utils";
import { noop } from "lodash-es";
import Dot from "../dot";

export default function TabsList({
  items = [],
  activeTab,
  onTabClick = noop,
  extra,
  className = "",
}) {
  return (
    <div className="flex items-center justify-between">
      <div
        className={cn(
          "text16semibold",
          "flex items-center gap-x-10",
          className,
        )}
      >
        {items.map((item, idx) => (
          <TabItem
            key={idx}
            active={item.value === activeTab}
            onClick={() => onTabClick(item)}
            {...item}
          >
            {item.content}
          </TabItem>
        ))}
      </div>
      {extra}
    </div>
  );
}

function TabItem({ children, active = false, activeCount, onClick = noop }) {
  return (
    <button
      className={cn(
        "flex items-center",
        "pb-4",
        "border-b-4 border-transparent",
        active && "border-fill-bg-brand-secondary",
      )}
      onClick={onClick}
    >
      {children}
      {!!activeCount && (
        <>
          <Dot className="mx-1" />
          <span className="text-text-tertiary">{activeCount}</span>
        </>
      )}
    </button>
  );
}
