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
import { cn } from "@/utils";

const RoundPage = withCommonPageWrapper(({ round, projects, categories }) => {
  return (
    <ListLayout
      title="Explore Projects"
      description="How OpenQF Works"
      backdrop={
        <div className="w-full h-full relative">
          <div
            className={cn(
              "absolute inset-0",
              "w-inherit h-inherit",
              "bg-gradient-to-b from-transparent from-[-100%] to-white to-100%",
            )}
          />
          <img
            src="/imgs/imgs-round1-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      }
    >
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
