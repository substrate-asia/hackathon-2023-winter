import { expect, test } from "vitest";
import { cn } from ".";

test("decimals", () => {
  const clx = cn("clx1 clx2", "clx3");
  expect(clx).toEqual("clx1 clx2 clx3");
});
