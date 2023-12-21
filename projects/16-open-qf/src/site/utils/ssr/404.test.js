import { expect, test } from "vitest";
import { to404 } from "./404";

test("404 redirect", () => {
  const data = to404();
  expect(data).toEqual({
    redirect: {
      permanent: false,
      destination: "/404",
    },
    props: {},
  });
});
