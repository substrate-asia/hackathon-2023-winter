import ListLayout from "@/components/layouts/listLayout";
import { find } from "lodash-es";
import RoundProjectInfo from "@/components/rounds/info";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";
import RoundProjectList from "@/components/rounds/projectList";
import {
  getRoundCategoriesList,
  getRoundProjectsList,
  getRoundsList,
} from "@/services/rounds";

const RoundPage = withCommonPageWrapper(({ round, projects, categories }) => {
  return (
    <ListLayout title="Explore Projects" description="How OpenQF Works">
      <div className="space-y-5">
        <RoundProjectInfo data={round} />

        <RoundProjectList projects={projects} categories={categories} />
      </div>
    </ListLayout>
  );
});

export default RoundPage;

export const getServerSideProps = async (context) => {
  const id = Number(context.params.id);

  const [
    { result: roundsResult },
    { result: projectsResult },
    { result: categories },
  ] = await Promise.all([
    getRoundsList(),
    getRoundProjectsList(id, { page_size: 25 }),
    getRoundCategoriesList(id),
  ]);

  const rounds = roundsResult?.items ?? [];
  const round = find(rounds, { id });

  const projects = projectsResult?.items ?? [];

  return {
    props: {
      ...loadCommonServerSideProps(context),
      round,
      projects,
      categories,
    },
  };
};
