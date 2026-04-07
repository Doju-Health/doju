import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    target: ["chrome87", "firefox78", "safari13", "edge88"],
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          redux: ["redux", "@reduxjs/toolkit", "react-redux"],
        },
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    visualizer({ open: true, filename: "bundle-stats.html" }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
