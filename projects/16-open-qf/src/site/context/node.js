import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "./account";
import { Chains } from "@osn/constants";
import { DEFAULT_POLKADOT_NODES } from "@/utils/constants";

const NodeContext = React.createContext();

function getNetworkNodes(network) {
  if (network === Chains.polkadot) {
    return DEFAULT_POLKADOT_NODES;
  }

  return [];
}

function getStorageActiveNodeUrl(network, nodes) {
  if (typeof window !== "undefined") {
    const data = window.localStorage.getItem("activeNodeUrl");
    if (data) {
      try {
        const activeNodeUrl = JSON.parse(data);
        const nodeUrl = activeNodeUrl[network];

        // check if the node is in the list
        // if not, use the default node
        if (nodeUrl && nodes.some((node) => node.url === nodeUrl)) {
          return nodeUrl;
        }
      } catch (e) {
        // ignore parse error and use the default node
      }
    }
  }

  return nodes[0]?.url || "";
}

function updateStorageActiveNodeUrl(network, nodeUrl) {
  if (typeof window !== "undefined") {
    const newData = {};

    const data = window.localStorage.getItem("activeNodeUrl");
    if (data) {
      try {
        Object.assign(newData, JSON.parse(data));
      } catch (e) {
        // ignore parse error
      }
    }

    Object.assign(newData, { [network]: nodeUrl });

    window.localStorage.setItem("activeNodeUrl", JSON.stringify(newData));
  }
}

export const NodeProvider = ({ children }) => {
  const [activeNodeUrl, _setActiveNodeUrl] = useState("");
  const account = useAccount();
  const loginNetwork = account?.network;

  const nodes = useMemo(() => getNetworkNodes(loginNetwork), [loginNetwork]);

  useEffect(() => {
    if (!loginNetwork) {
      return;
    }
    const activeNodeUrl = getStorageActiveNodeUrl(loginNetwork, nodes);
    _setActiveNodeUrl(activeNodeUrl);
  }, [loginNetwork, nodes]);

  const setActiveNodeUrl = useCallback(
    (nodeUrl) => {
      if (!loginNetwork) {
        return;
      }
      _setActiveNodeUrl(nodeUrl);
      updateStorageActiveNodeUrl(loginNetwork, nodeUrl);
    },
    [loginNetwork],
  );

  return (
    <NodeContext.Provider
      value={{
        nodes,
        activeNodeUrl,
        setActiveNodeUrl,
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};

export const useNodeContext = () => {
  const context = React.useContext(NodeContext);
  if (context === undefined) {
    throw new Error("useNodeContext must be used within a NodeProvider");
  }
  return context;
};

export const useNodes = () => {
  const { nodes } = useNodeContext();
  return nodes;
};

export const useActiveNodeUrl = () => {
  const { activeNodeUrl } = useNodeContext();
  return activeNodeUrl;
};

export const useSetActiveNodeUrl = () => {
  const { setActiveNodeUrl } = useNodeContext();
  return setActiveNodeUrl;
};
