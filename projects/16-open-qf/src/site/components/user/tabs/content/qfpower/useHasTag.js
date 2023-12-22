import { useServerSideProps } from "@/context/serverSideProps";

export default function useHasTag(tagId) {
  const { userActivityTags } = useServerSideProps();
  return !!userActivityTags.find((tag) => tag.id === tagId);
}
