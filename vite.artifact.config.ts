import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/**
 * Single-file artifact build.
 *
 * Differs from the Workers build in exactly three ways:
 *  - __ARTIFACT__ is true, which switches the router to hash mode and hands
 *    light/dark control back to the host page.
 *  - Lazy chunks are inlined, because an artifact is one document.
 *  - Output goes to dist-artifact/, never dist/ (which Wrangler deploys).
 *
 * Run through `npm run build:artifact`, which also folds the result into a
 * single publishable HTML fragment.
 */
export default defineConfig({
  plugins: [react()],
  define: { __ARTIFACT__: "true" },
  base: "./",
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    outDir: "dist-artifact",
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: "app.js",
        assetFileNames: "app[extname]",
      },
    },
  },
});
