import BorderRow from "../borderRow";
import DiscussionItem from "./comment";
import Pagination from "@osn/common-ui/es/styled/Pagination";
import { useServerSideProps } from "@/context/serverSideProps";
import { uniqWith } from "lodash-es";
import { identityChainMap } from "@osn/constants";
import { encodeNetworkAddress, fetchIdentity } from "@osn/common";
import { useEditorContext } from "./editor/context";
import { resolveMentionFormat } from "./editor/utils";
import { useEffect } from "react";
import NetworkUser from "@/components/user/networkUser";
import { useProjectCommentsContext } from "./context";

async function getCommentAuthorIdentities(comments) {
  const userIdentities = await Promise.all(
    uniqWith(
      comments?.items || [],
      (a, b) => a.author === b.author && a.network === b.network,
    )
      .map((item) => ({
        address: encodeNetworkAddress(item.author, item.network),
        network: item.network,
      }))
      .map(async (item) => {
        const identityChain = identityChainMap[item.network] || item.network;
        const identity = await fetchIdentity(identityChain, item.address);
        return {
          ...item,
          identity,
        };
      }),
  );

  return userIdentities;
}

async function createSuggestions(comments) {
  const userIdentities = await getCommentAuthorIdentities(comments);
  return userIdentities.map((user) => {
    return {
      address: user.address,
      value: resolveMentionFormat(user.identity, user),
      preview: (
        <NetworkUser noLink address={user.address} network={user.network} />
      ),
    };
  });
}

function useSetEditorSuggestions() {
  const { comments } = useServerSideProps();
  const { setSuggestions } = useEditorContext();

  useEffect(() => {
    createSuggestions(comments).then((v) => {
      setSuggestions(v);
    });
  }, [comments, setSuggestions]);
}

function EmptyContent() {
  return (
    <div className="flex p-[32px] justify-center text-text-tertiary text14medium">
      No current discussions
    </div>
  );
}

export default function DiscussionList() {
  const { comments, setPage, page } = useProjectCommentsContext();

  useSetEditorSuggestions();

  let listContent = <EmptyContent />;

  if (comments?.items?.length) {
    listContent = (comments?.items || []).map((comment) => (
      <BorderRow key={comment._id}>
        <DiscussionItem comment={comment} />
      </BorderRow>
    ));
  }

  return (
    <div className="flex flex-col gap-[16px]">
      {listContent}
      <Pagination
        page={page}
        pageSize={comments?.pageSize}
        total={comments?.total}
        setPage={setPage}
      />
    </div>
  );
}
