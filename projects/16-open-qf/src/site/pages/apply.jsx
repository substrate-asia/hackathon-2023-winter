import DetailLayout from "@/components/layouts/detailLayout";
import { withCommonPageWrapper } from "@/utils/ssr";

const ApplyPage = withCommonPageWrapper(() => {
  return (
    <DetailLayout>
      <div>submit a project</div>
    </DetailLayout>
  );
});

export default ApplyPage;
