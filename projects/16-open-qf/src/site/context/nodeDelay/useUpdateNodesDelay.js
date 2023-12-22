import { useAccount } from "@/context/account";
import { useNodes, useActiveNodeUrl } from "@/context/node";
import { useCallback, useEffect } from "react";
import { getNodeDelay } from "./getNodeDelay";

export const useUpdateNodesDelay = (setNodesDelay) => {
  const nodes = useNodes();
  const currentNode = useActiveNodeUrl();
  const account = useAccount();
  const loginNetwork = account?.network;

  const setNodeDelay = useCallback(
    (nodeUrl, delay) => {
      setNodesDelay((nodesDelay) => ({ ...nodesDelay, [nodeUrl]: delay }));
    },
    [setNodesDelay],
  );

  useEffect(() => {
    if (!loginNetwork) {
      return;
    }

    let count = 0;

    const intervalId = setInterval(async () => {
      const updateNodes = (nodes || []).filter(
        (item) => item.url === currentNode,
      );

      if (updateNodes && updateNodes.length > 0) {
        const updateNode = updateNodes[count % updateNodes.length];
        const delay = await getNodeDelay(loginNetwork, updateNode.url);
        setNodeDelay(updateNode.url, delay);
      }

      count++;
    }, 5000);

    return () => clearInterval(intervalId);
  }, [nodes, loginNetwork, currentNode, setNodeDelay]);
};
