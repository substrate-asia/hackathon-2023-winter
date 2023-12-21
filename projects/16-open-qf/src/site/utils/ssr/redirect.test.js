import { expect, test } from "vitest";
import { redirect } from "./redirect";

test("redirect", () => {
  const data = redirect("/test");
  expect(data).toEqual({
    redirect: {
      permanent: false,
      destination: "/test",
    },
    props: {},
  });
});
