import DetailLayout from "@/components/layouts/detailLayout";
import { withCommonPageWrapper } from "@/utils/ssr";
import { useRouter } from "next/router";

const ProjectPage = withCommonPageWrapper(() => {
  const router = useRouter();
  const id = Number(router.query.id);

  return (
    <DetailLayout>
      <div>id: {id}</div>
    </DetailLayout>
  );
});

export default ProjectPage;
