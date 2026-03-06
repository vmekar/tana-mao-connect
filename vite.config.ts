import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
// @ts-expect-error test config
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
  plugins: [react(), componentTagger(), cloudflare()],
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});