import DetailLayout from "@/components/layouts/detailLayout";
import { useRouter } from "next/router";

export default function ProjectPage() {
  const router = useRouter();
  const id = Number(router.query.id);

  return (
    <DetailLayout>
      <div>id: {id}</div>
    </DetailLayout>
  );
}
