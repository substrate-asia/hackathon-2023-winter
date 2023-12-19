import { nextApi } from ".";

export function getActivityTags() {
  return nextApi.fetch("/tags");
}

export function getAddressActivityTags(address) {
  return nextApi.fetch(`/addresses/${address}/tags`);
}

export function getAddressContributions(address) {
  return nextApi.fetch(`/addresses/${address}/contributions`);
}

export function getAddressProjects(address) {
  return nextApi.fetch(`/addresses/${address}/projects`);
}
