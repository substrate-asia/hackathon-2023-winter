import React, { useState } from "react";
import { useUpdateNodesDelay } from "./useUpdateNodesDelay";

const NodeDelayContext = React.createContext();

export const NodeDelayProvider = ({ children }) => {
  const [nodesDelay, setNodesDelay] = useState({});
  useUpdateNodesDelay(setNodesDelay);

  return (
    <NodeDelayContext.Provider value={{ nodesDelay }}>
      {children}
    </NodeDelayContext.Provider>
  );
};

export const useNodeDelayContext = () => {
  const context = React.useContext(NodeDelayContext);
  if (context === undefined) {
    throw new Error(
      "useNodeDelayContext must be used within a NodeDelayProvider",
    );
  }
  return context;
};

export const useNodesDelay = () => {
  const { nodesDelay } = useNodeDelayContext();
  return nodesDelay;
};
