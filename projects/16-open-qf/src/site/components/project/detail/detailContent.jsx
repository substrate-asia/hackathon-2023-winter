import { MarkdownPreviewer } from "@osn/previewer";
import { useServerSideProps } from "@/context/serverSideProps";

export default function DetailContent() {
  const { detail } = useServerSideProps();
  return (
    <div className="flex flex-col gap-[16px]">
      <h1 className="text16semibold text-text-primary">Content</h1>
      <MarkdownPreviewer content={detail.description} />
    </div>
  );
}
