import { expect, test } from "vitest";
import getDecimalsFromSymbol from "./decimals";

test("decimals", () => {
  const decimals = getDecimalsFromSymbol("DOT");
  expect(decimals).toEqual(10);
});
