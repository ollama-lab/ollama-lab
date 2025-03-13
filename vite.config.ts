import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "node:path";
import lucideOptimizer from "./lucide-optimizer";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  clearScreen: false,
  server: {
    strictPort: true,
    host: host || false,
    port: 5173,
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari15",
    // don't minify for debug builds
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
  plugins: [solid(), lucideOptimizer()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['solid-markdown > micromark', 'solid-markdown > unified'],
  },
});
