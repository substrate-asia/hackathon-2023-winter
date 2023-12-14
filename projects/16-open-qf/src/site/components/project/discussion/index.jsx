import { useServerSideProps } from "@/context/serverSideProps";
import CardTitle from "../title";
import DiscussionList from "./list";
import { EditorProvider } from "./editor/context";
import { useCallback } from "react";
import { nextApi } from "@/services";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { newErrorToast } from "@/store/reducers/toastSlice";
import { useAccount } from "@/context/account";

export default function Discussion() {
  const dispatch = useDispatch();
  const router = useRouter();
  const account = useAccount();
  const { roundId, projectId } = useServerSideProps();
  const { comments } = useServerSideProps();

  const onSubmit = useCallback(
    async (content) => {
      const { result, error } = await nextApi.fetch(
        `rounds/${roundId}/projects/${projectId}/comments`,
        {},
        {
          method: "POST",
          body: JSON.stringify({
            roundId,
            projectId,
            content,
            author: account?.address,
            timestamp: Date.now(),
            //TODO: Signature
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (result) {
        router.replace(router.asPath);
      }

      if (error) {
        dispatch(newErrorToast(error.message));
      }
    },
    [dispatch, router, roundId, projectId, account?.address],
  );

  return (
    <div className="flex flex-col p-[32px] shadow-shadow-card-default">
      <CardTitle title="Discussion" count={comments?.items?.length || 0} />
      <EditorProvider onSubmit={onSubmit}>
        <DiscussionList />
      </EditorProvider>
    </div>
  );
}
