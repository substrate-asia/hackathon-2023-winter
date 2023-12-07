import React, { useState } from "react";

const ServerSidePropsContext = React.createContext();

export const ServerSidePropsProvider = ({ serverSideProps, children }) => {
  const [serverSidePropsState] = useState(serverSideProps);
  return (
    <ServerSidePropsContext.Provider
      value={{
        serverSidePropsState,
      }}
    >
      {children}
    </ServerSidePropsContext.Provider>
  );
};

function useServerSidePropsContext() {
  const context = React.useContext(ServerSidePropsContext);
  if (context === undefined) {
    throw new Error(
      "useServerSidePropsContext must be used within a ServerSidePropsProvider",
    );
  }
  return context;
}

export const useServerSideProps = () => {
  const { serverSidePropsState } = useServerSidePropsContext(
    ServerSidePropsContext,
  );
  return serverSidePropsState;
};
