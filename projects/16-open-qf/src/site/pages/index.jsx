import RoundCard from "@/components/card/round";
import ListLayout from "@/components/layouts/listLayout";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";
import { getRoundsList } from "@/services/rounds";

const HomePage = withCommonPageWrapper(({ rounds }) => {
  return (
    <ListLayout title="Program Rounds" description="How OpenQF Works">
      <div className="space-y-5">
        {rounds.map((data, idx) => (
          <RoundCard key={idx} data={data} />
        ))}
      </div>
    </ListLayout>
  );
});

export default HomePage;

export const getServerSideProps = async (context) => {
  const { result } = await getRoundsList();
  const items = result?.items ?? [];

  return {
    props: {
      ...loadCommonServerSideProps(context),
      rounds: items,
    },
  };
};
