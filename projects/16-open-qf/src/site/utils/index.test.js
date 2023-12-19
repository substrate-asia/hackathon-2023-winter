import { expect, test } from "vitest";
import { cn } from ".";

test("tailwind merge", () => {
  const classnames = cn("m-0 p-0", "m-2");
  expect(classnames).toEqual("p-0 m-2");
});
