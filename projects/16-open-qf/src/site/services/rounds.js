import { ssrNextApi } from ".";

export function getRoundsList() {
  return ssrNextApi.fetch("rounds");
}

export function getRoundProjectsList(id) {
  return ssrNextApi.fetch(`rounds/${id}/projects`);
}
