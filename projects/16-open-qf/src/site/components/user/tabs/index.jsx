import TabsList from "@/components/tabs/tabsList";
import { useUserTab } from "@/hooks/useUserTab";

export default function UserTabs() {
  const [tab, setTab, items] = useUserTab();

  return (
    <div className="flex overflow-auto scrollbar-none">
      <TabsList
        items={items}
        activeTab={tab}
        onTabClick={(item) => {
          setTab(item.value);
        }}
      />
    </div>
  );
}
