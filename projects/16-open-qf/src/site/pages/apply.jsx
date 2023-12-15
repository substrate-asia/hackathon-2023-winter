import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";
import ApplyLayout from "@/components/layouts/applyLayout";
import ApplyProjectForm from "@/components/apply/form";
import ApplyProjectSubmitSidebar from "@/components/apply/submit";

const ApplyPage = withCommonPageWrapper(() => {
  return (
    <ApplyLayout>
      <div className="flex gap-5 max-sm:flex-col">
        <div className="w-full">
          <ApplyProjectForm />
        </div>
        <div className="w-[392px] max-w-full">
          <ApplyProjectSubmitSidebar />
        </div>
      </div>
    </ApplyLayout>
  );
});

export default ApplyPage;

export function getServerSideProps(context) {
  return {
    props: {
      ...loadCommonServerSideProps(context),
    },
  };
}
