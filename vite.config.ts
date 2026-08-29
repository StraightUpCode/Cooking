import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Consumed by wrangler.jsonc -> assets.directory
    outDir: "dist",
    emptyOutDir: true,
    // Module bodies are loaded with dynamic import() and must stay in their own
    // per-module chunks — grouping them would pull the whole curriculum into
    // the first paint, which is exactly what we are avoiding on mobile.
    // Only third-party code is grouped.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
