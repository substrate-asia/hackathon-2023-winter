import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
