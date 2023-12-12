import { useAccount } from "@/context/account";
import { useNodes, useActiveNodeUrl } from "@/context/node";
import getApi from "@osn/common/es/services/chain/api";
import { useCallback, useEffect } from "react";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TIMEOUT = 10000;

const fetchApiTime = async (api) => {
  const startTime = Date.now();
  try {
    await api.rpc.system.chain();
  } catch (e) {
    return "error";
  }

  const endTime = Date.now();
  return endTime - startTime;
};

const timeout = async (ms) => {
  await sleep(ms);
  return "timeout";
};

const testNet = async (api) => {
  return await Promise.race([fetchApiTime(api), timeout(TIMEOUT)]);
};

const getNodeDelay = async (chain, url) => {
  try {
    const api = await getApi(chain, url);
    return await testNet(api);
  } catch (e) {
    console.error("we have a error to test network", e);
    return "timeout";
  }
};

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
