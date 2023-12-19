import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import LocaleSymbol from "@/components/common/localeSymbol";

test("test component", () => {
  render(<LocaleSymbol value={10000000000} />);
  const divElm = screen.getByText("1 DOT");
  expect(divElm).toBeInTheDocument();
});
