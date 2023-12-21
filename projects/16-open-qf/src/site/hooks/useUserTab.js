import { useServerSideProps } from "@/context/serverSideProps";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import qs from "querystring";

export function useUserTab() {
  const { projects, contributions } = useServerSideProps();

  const items = [
    {
      value: "qfpower",
      content: "QFpower",
    },
    {
      value: "contributions",
      content: "Contributions",
      activeCount: contributions?.length,
    },
    {
      value: "projects",
      content: "Projects",
      activeCount: projects?.length,
    },
  ];

  const router = useRouter();
  const address = router.query.address;
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || items[0].value;

  function setTab(tab) {
    router.replace(
      {
        pathname: `/users/${address}`,
        search: `?${qs.stringify({
          ...qs.parse(searchParams.toString()),
          tab,
        })}`,
      },
      null,
      { shallow: true },
    );
  }

  return [tab, setTab, items];
}
