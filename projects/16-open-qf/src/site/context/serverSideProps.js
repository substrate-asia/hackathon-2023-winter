import React from "react";

const ServerSidePropsContext = React.createContext();

export const ServerSidePropsProvider = ({ serverSideProps, children }) => {
  return (
    <ServerSidePropsContext.Provider value={{ serverSideProps }}>
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
  const { serverSideProps } = useServerSidePropsContext();
  return serverSideProps;
};
