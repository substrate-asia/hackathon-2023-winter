import ListLayout from "@/components/layouts/listLayout";
import { find } from "lodash-es";
import RoundProjectInfo from "@/components/rounds/info";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";
import RoundProjectList from "@/components/rounds/projectList";
import { getRoundProjectsList, getRoundsList } from "@/services/rounds";

const RoundPage = withCommonPageWrapper(({ round, projects }) => {
  return (
    <ListLayout title="Explore Projects" description="How OpenQF Works">
      <div className="space-y-5">
        <RoundProjectInfo data={round} />

        <RoundProjectList projects={projects} />
      </div>
    </ListLayout>
  );
});

export default RoundPage;

export const getServerSideProps = async (context) => {
  const { result: roundsResult } = await getRoundsList();
  const rounds = roundsResult?.items ?? [];
  const id = Number(context.params.id);
  const round = find(rounds, { id });
  const { result: projectsResult } = await getRoundProjectsList(id);
  const projects = projectsResult?.items ?? [];

  return {
    props: {
      ...loadCommonServerSideProps(context),
      round,
      projects,
    },
  };
};
