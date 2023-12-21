import BreadCrumb from "@/components/breadCrumb";
import { useServerSideProps } from "@/context/serverSideProps";

export default function ProjectDetailBreadCrumb() {
  const { roundId, detail } = useServerSideProps();

  return (
    <BreadCrumb
      items={[
        {
          name: "Home",
          url: "/",
        },
        {
          name: `Round #${roundId}`,
          url: `/rounds/${roundId}`,
        },
        {
          name: detail?.name ?? "Project Detail",
        },
      ]}
    />
  );
}
