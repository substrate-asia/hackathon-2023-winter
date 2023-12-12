import ListLayout from "@/components/layouts/listLayout";
import { ROUND_LIST_DATA } from "@/fixtures/roundList";
import { find } from "lodash-es";
import { useRouter } from "next/router";
import RoundProjectInfo from "@/components/rounds/info";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";
import RoundProjectList from "@/components/rounds/projectList";

const RoundPage = withCommonPageWrapper(() => {
  const router = useRouter();
  const id = Number(router.query.id);

  const data = find(ROUND_LIST_DATA, { id }) ?? {};

  return (
    <ListLayout title="Explore Projects" description="How OpenQF Works">
      <div className="space-y-5">
        <RoundProjectInfo data={data} />

        <RoundProjectList data={data} />
      </div>
    </ListLayout>
  );
});

export default RoundPage;

export const getServerSideProps = async (context) => {
  return {
    props: {
      ...loadCommonServerSideProps(context),
    },
  };
};
