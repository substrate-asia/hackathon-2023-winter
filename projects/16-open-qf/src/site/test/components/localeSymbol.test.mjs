import { describe, expect, test } from "vitest";
import LocaleSymbol from "@/components/common/localeSymbol";

describe("localeSymbol output", () => {
  test("base", () => {
    expect(LocaleSymbol({ value: "1000000000000" })).toBe("100 DOT");
  });

  test("decimal places 0", () => {
    expect(LocaleSymbol({ value: "76819568407885" })).toBe("7,682 DOT");
  });

  test("0", () => {
    expect(LocaleSymbol({ value: "0" })).toBe("0 DOT");
  });

  test("NaN", () => {
    expect(LocaleSymbol({ value: null })).toBe("NaN DOT");
    expect(LocaleSymbol({ value: undefined })).toBe("NaN DOT");
  });
});
