import { useServerSideProps } from "@/context/serverSideProps";
import { nextApi } from "@/services";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUpdateEffect } from "react-use";

export function useProjectContributorsData(page, page_size) {
  const { contributors } = useServerSideProps();
  const [data, setData] = useState(contributors);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id: roundId, pid: projectId } = router.query;

  useUpdateEffect(() => {
    setLoading(true);

    nextApi
      .fetch(`rounds/${roundId}/projects/${projectId}/contributors`, {
        page: page - 1,
        page_size,
      })
      .then((resp) => {
        if (resp?.result) {
          setData(resp.result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, roundId, projectId]);

  return { data, loading };
}
