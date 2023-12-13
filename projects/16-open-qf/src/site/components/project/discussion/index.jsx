import { useServerSideProps } from "@/context/serverSideProps";
import CardTitle from "../title";
import DiscussionList from "./list";
import { EditorProvider } from "./editor/context";

export default function Discussion() {
  const { comments } = useServerSideProps();

  return (
    <div className="flex flex-col p-[32px] shadow-shadow-card-default">
      <CardTitle title="Discussion" count={comments?.items?.length || 0} />
      <EditorProvider>
        <DiscussionList />
      </EditorProvider>
    </div>
  );
}
