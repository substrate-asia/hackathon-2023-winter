import { nextApi } from ".";

export function getRoundsList() {
  return nextApi.fetch("/rounds");
}
