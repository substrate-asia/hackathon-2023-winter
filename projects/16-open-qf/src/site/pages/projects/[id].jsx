import DetailLayout from "@/components/layouts/detailLayout";
import Contributions from "@/components/project/contributors";
import ProjectDetail from "@/components/project/detail";
import Sidebar from "@/components/project/sidebar";
import { PROJECTS_DETAIL_DATA } from "@/fixtures/projectList";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";

const ProjectPage = withCommonPageWrapper(() => {
  return (
    <DetailLayout sidebar={<Sidebar />}>
      <div className="flex flex-col gap-[20px]">
        <ProjectDetail />
        <Contributions />
      </div>
    </DetailLayout>
  );
});

export default ProjectPage;

export const getServerSideProps = async (context) => {
  const id = Number(context.query.id);
  const detail = PROJECTS_DETAIL_DATA.find((item) => item.id === id);

  return {
    props: {
      detail,
      ...loadCommonServerSideProps(context),
    },
  };
};
