import { nextApi } from ".";

export function getRoundsList(params = {}) {
  return nextApi.fetch("/rounds", params);
}

export function getRoundProjectsList(id, params = {}) {
  return nextApi.fetch(`/rounds/${id}/projects`, params);
}

export function getRoundCategoriesList(id) {
  return nextApi.fetch(`/rounds/${id}/categories`);
}
