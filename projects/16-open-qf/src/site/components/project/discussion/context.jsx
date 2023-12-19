import React, { useCallback, useContext } from "react";
import { useState } from "react";
import { useUpdateEffect } from "react-use";
import { useServerSideProps } from "@/context/serverSideProps";
import { nextApi } from "@/services";
import { useRouter } from "next/router";

const ProjectCommentsContext = React.createContext();

export default ProjectCommentsContext;

export function ProjectCommentsProvider({ children }) {
  const router = useRouter();
  const { comments } = useServerSideProps();
  const [data, setData] = useState(comments);
  const [page, setPage] = useState(comments?.page + 1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refresh = useCallback(() => {
    setRefreshCounter((v) => v + 1);
  }, []);

  const { id: roundId, pid: projectId } = router.query;

  useUpdateEffect(() => {
    setIsLoading(true);

    nextApi
      .fetch(`rounds/${roundId}/projects/${projectId}/comments`, {
        page: page - 1,
        pageSize: data?.pageSize,
      })
      .then((resp) => {
        if (resp?.result) {
          setData(resp.result);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, roundId, projectId, data?.pageSize, refreshCounter]);

  return (
    <ProjectCommentsContext.Provider
      value={{
        comments: data,
        isLoading,
        page,
        setPage,
        refresh,
      }}
    >
      {children}
    </ProjectCommentsContext.Provider>
  );
}

export function useProjectCommentsContext() {
  const context = useContext(ProjectCommentsContext);
  if (context === undefined) {
    throw new Error(
      "useProjectCommentsContext must be used within a ProjectCommentsProvider",
    );
  }
  return context;
}
