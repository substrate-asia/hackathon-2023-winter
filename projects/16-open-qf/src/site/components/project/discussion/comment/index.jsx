import IpfsButton from "@/components/ipfsButton";
import NetworkUser from "@/components/user/networkUser";
import { MarkdownPreviewer } from "@osn/previewer";
import Actions from "./actions";
import { CommentProvider, useComment } from "./context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function Content() {
  const comment = useComment();
  return <MarkdownPreviewer content={comment?.content || ""} />;
}

function Meta() {
  const comment = useComment();

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-[4px] text14medium">
        <NetworkUser address={comment?.author} network="polkadot" />
        <span className="text-text-tertiary">·</span>
        <span className="text-text-tertiary">
          {dayjs(comment?.timestamp).fromNow()}
        </span>
      </div>
      <IpfsButton cid={comment.cid} />
    </div>
  );
}

export default function DiscussionItem({ comment }) {
  return (
    <CommentProvider comment={comment}>
      <div className="flex flex-col gap-[8px]">
        <Meta />
        <Content />
        <Actions />
      </div>
    </CommentProvider>
  );
}
