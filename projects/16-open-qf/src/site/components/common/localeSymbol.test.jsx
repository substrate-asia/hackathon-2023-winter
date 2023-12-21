import { render, screen } from "@testing-library/react";
import LocaleSymbol from "./localeSymbol";
import { describe, expect, test } from "vitest";

describe("localeSymbol", () => {
  test("base", () => {
    render(<LocaleSymbol value="1000000000000" />);
    expect(screen.getByText("100 DOT")).toBeDefined();
  });

  test("decimal places 0", () => {
    render(<LocaleSymbol value="76819568407885" />);
    expect(screen.getByText("7,682 DOT")).toBeDefined();
  });

  test("0", () => {
    render(<LocaleSymbol value="0" />);
    expect(screen.getByText("0 DOT")).toBeDefined();
  });

  test("NaN", () => {
    render(<LocaleSymbol value={null} />);
    expect(screen.getByText("NaN DOT")).toBeDefined();
  });
});
