import RoundProjectList from "@/components/rounds/projectList";
import { useServerSideProps } from "@/context/serverSideProps";

export default function UserTabProjectsContent() {
  const { projects, categories } = useServerSideProps();

  return (
    <div>
      <RoundProjectList categories={categories} projects={projects} />
    </div>
  );
}
