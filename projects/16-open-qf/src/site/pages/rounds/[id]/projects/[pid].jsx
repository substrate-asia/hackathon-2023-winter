import BreadCrumb from "@/components/breadCrumb";
import DetailLayout from "@/components/layouts/detailLayout";
import Contributions from "@/components/project/contributors";
import ProjectDetail from "@/components/project/detail";
import Discussion from "@/components/project/discussion";
import Sidebar from "@/components/project/sidebar";
import { useServerSideProps } from "@/context/serverSideProps";
import { ssrNextApi } from "@/services";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";
import { to404 } from "@/utils/ssr/404";

const ProjectPage = withCommonPageWrapper(() => {
  const { roundId } = useServerSideProps();

  return (
    <DetailLayout sidebar={<Sidebar />}>
      <div className="flex flex-col gap-[20px]">
        <BreadCrumb
          items={[
            {
              name: "Explorer",
              url: `/rounds/${roundId}`,
            },
            {
              name: "Project Detail",
            },
          ]}
        />
        <ProjectDetail />
        <Contributions />
        <Discussion />
      </div>
    </DetailLayout>
  );
});

export default ProjectPage;

export const getServerSideProps = async (context) => {
  const roundId = Number(context.query.id);
  const projectId = Number(context.query.pid);
  const { result: detail } = await ssrNextApi.fetch(
    `/rounds/${roundId}/projects/${projectId}`,
  );
  if (!detail) {
    return to404();
  }

  return {
    props: {
      roundId,
      projectId,
      detail: detail ?? null,
      comments: {
        items: [
          {
            id: 1,
            timestamp: new Date("2021-10-13T08:04:00.000Z").getTime(),
            content:
              "Velit amet auctor feugiat consectetur malesuada suspendisse facilisi. Eget fringilla eu semper vivamus morbi nunc arcu pellentesque ac.",
            cid: "QmZQ4qfzUg2f4p5qUZ4qZvQZ7G6L7y3JqzgXt1d6VJv6uX",
            author: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
            network: "polkadot",
          },
          {
            id: 2,
            timestamp: new Date("2021-10-13T08:04:00.000Z").getTime(),
            content:
              "Velit amet auctor feugiat consectetur malesuada suspendisse facilisi. Eget fringilla eu semper vivamus morbi nunc arcu pellentesque ac.",
            cid: "QmZQ4qfzUg2f4p5qUZ4qZvQZ7G6L7y3JqzgXt1d6VJv6uX",
            author: "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk",
            network: "polkadot",
          },
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      },
      ...loadCommonServerSideProps(context),
    },
  };
};
