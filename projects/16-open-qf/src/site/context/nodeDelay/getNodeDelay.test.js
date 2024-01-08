import { expect, test } from "vitest";
import { getNodeDelay } from "./getNodeDelay";

test(
  "Get node delay",
  async () => {
    const delay = await getNodeDelay("polkadot", "wss://dot-rpc.stakeworld.io");
    expect(Number.isInteger(delay)).toBeTruthy();
  },
  {
    timeout: 30000,
  },
);
