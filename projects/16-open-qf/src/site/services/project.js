import { ssrNextApi } from ".";

export function getProjectContributors(roundId, projectId, params = {}) {
  return ssrNextApi.fetch(
    `rounds/${roundId}/projects/${projectId}/contributors`,
    params,
  );
}
