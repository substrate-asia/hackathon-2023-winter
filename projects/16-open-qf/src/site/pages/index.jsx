import { ROUND_LIST_DATA } from "@/fixtures/roundList";
import RoundCard from "@/components/card/round";
import ListLayout from "@/components/layouts/listLayout";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";

const HomePage = withCommonPageWrapper(() => {
  return (
    <ListLayout title="Program Rounds" description="How OpenQF Works">
      <div className="space-y-5">
        {ROUND_LIST_DATA.map((data, idx) => (
          <RoundCard key={idx} data={data} />
        ))}
      </div>
    </ListLayout>
  );
});

export default HomePage;

export const getServerSideProps = async (context) => {
  return {
    props: {
      ...loadCommonServerSideProps(context),
    },
  };
};
