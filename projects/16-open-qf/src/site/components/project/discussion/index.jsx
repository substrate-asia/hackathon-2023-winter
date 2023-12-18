import { useServerSideProps } from "@/context/serverSideProps";
import CardTitle from "../title";
import DiscussionList from "./list";
import { EditorProvider } from "./editor/context";
import { useCallback } from "react";
import { nextApi } from "@/services";
import { useDispatch } from "react-redux";
import { newErrorToast } from "@/store/reducers/toastSlice";
import { useAccount } from "@/context/account";
import { signApiData } from "@/utils/signature";
import { ProjectCommentsProvider, useProjectCommentsContext } from "./context";

function DiscussionImpl() {
  const dispatch = useDispatch();
  const account = useAccount();
  const { roundId, projectId } = useServerSideProps();
  const { comments, refresh } = useProjectCommentsContext();

  const onSubmit = useCallback(
    async (content) => {
      const author = account?.address;
      if (!author) {
        dispatch(newErrorToast("Please connect your wallet"));
        return;
      }

      const data = {
        roundId,
        projectId,
        content,
        author,
        timestamp: Date.now(),
      };
      const signature = await signApiData(data, author);

      const { result, error } = await nextApi.fetch(
        `rounds/${roundId}/projects/${projectId}/comments`,
        {},
        {
          method: "POST",
          body: JSON.stringify({
            ...data,
            signature,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (result) {
        refresh();
      }

      if (error) {
        dispatch(newErrorToast(error.message));
      }
    },
    [dispatch, roundId, projectId, account?.address, refresh],
  );

  return (
    <div className="flex flex-col p-[32px] shadow-shadow-card-default">
      <CardTitle title="Discussion" count={comments?.total || 0} />
      <EditorProvider onSubmit={onSubmit}>
        <DiscussionList />
      </EditorProvider>
    </div>
  );
}

export default function Discussion() {
  return (
    <ProjectCommentsProvider>
      <DiscussionImpl />
    </ProjectCommentsProvider>
  );
}
