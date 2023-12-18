import BreadCrumb from "@/components/project/breadCrumb";
import DetailLayout from "@/components/layouts/detailLayout";
import Contributions from "@/components/project/contributors";
import ProjectDetail from "@/components/project/detail";
import Discussion from "@/components/project/discussion";
import Sidebar from "@/components/project/sidebar";
import { ssrNextApi } from "@/services";
import { EmptyList } from "@/utils/constants";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";
import { to404 } from "@/utils/ssr/404";
import { getProjectContributors } from "@/services/project";

const ProjectPage = withCommonPageWrapper(() => {
  return (
    <DetailLayout breadcrumb={<BreadCrumb />} sidebar={<Sidebar />}>
      <div className="flex flex-col gap-[20px]">
        <ProjectDetail />
        <Sidebar className="hidden max-md:flex" />
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

  const { result: comments } = await ssrNextApi.fetch(
    `/rounds/${roundId}/projects/${projectId}/comments`,
  );

  const { result: contributorsResult } = await getProjectContributors(
    roundId,
    projectId,
  );

  return {
    props: {
      roundId,
      projectId,
      detail: detail ?? null,
      comments: comments ?? EmptyList,
      contributors: contributorsResult ?? EmptyList,
      ...loadCommonServerSideProps(context),
    },
  };
};
