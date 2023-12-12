import { nextApi } from ".";

export function getRoundsList() {
  return nextApi.fetch("/rounds");
}

export function getRoundProjectsList(id) {
  return nextApi.fetch(`/rounds/${id}/projects`);
}
