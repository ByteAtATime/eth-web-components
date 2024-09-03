import { resolve } from "path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
      "@": resolve(__dirname, "./playground"),
      "~~": resolve(__dirname, "../common"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => {
        if (format === "es") return `elements.mjs`;
        if (format === "cjs") return `elements.cjs`;
        return `elements.${format}.js`;
      },
    },
  },
  plugins: [dtsPlugin({ rollupTypes: true })],
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      name: "chromium",
      headless: true,
    },
  },
});
