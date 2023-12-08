import TabsList from "@/components/tabs/tabsList";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export default function UserTabs() {
  const items = [
    {
      value: "qfpower",
      content: "QFpower",
    },
    {
      value: "contributions",
      content: "Contributions",
      activeCount: 2,
    },
    {
      value: "projects",
      content: "Projects",
      activeCount: 3,
    },
  ];

  const router = useRouter();
  const address = router.query.address;
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  return (
    <div className="flex">
      <TabsList
        items={items}
        activeTab={activeTab}
        onTabClick={(tab) => {
          router.replace(
            {
              pathname: `/users/${address}`,
              search: `?tab=${tab.value}`,
            },
            null,
            { shallow: true },
          );
        }}
      />
    </div>
  );
}
