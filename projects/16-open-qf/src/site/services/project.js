import { nextApi } from ".";

export function getProjectContributors(roundId, projectId, params = {}) {
  return nextApi.fetch(
    `/rounds/${roundId}/projects/${projectId}/contributors`,
    params,
  );
}
