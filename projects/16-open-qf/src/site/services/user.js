import { ssrNextApi } from ".";

export function getActivityTags() {
  return ssrNextApi.fetch("tags");
}

export function getAddressActivityTags(address) {
  return ssrNextApi.fetch(`addresses/${address}/tags`);
}

export function getAddressContributions(address) {
  return ssrNextApi.fetch(`addresses/${address}/contributions`);
}
