import ReplyButton from "@/components/replyButton";
import { useCallback } from "react";
import { useEditorContext } from "../editor/context";
import { fetchIdentity } from "@osn/common";
import { identityChainMap } from "@osn/constants";
import { resolveMentionFormat } from "../editor/utils";
import { useComment } from "./context";

export default function Actions() {
  const comment = useComment();
  const author = comment?.author;
  const network = comment?.network;
  const { content, setContent, forceEditor } = useEditorContext();

  const onReply = useCallback(() => {
    const identityChain = identityChainMap[network] || network;
    const identity = fetchIdentity(identityChain, author);
    const mention = resolveMentionFormat(identity, {
      address: author,
      network,
    });

    setContent(content + mention + " ");

    forceEditor();
  }, [content, setContent, forceEditor, author, network]);

  return (
    <div className="flex items-center">
      <ReplyButton onClick={onReply} />
    </div>
  );
}
