import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    open: "/main.html"
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        main: resolve(__dirname, "main.html"),
        login: resolve(__dirname, "login.html"),
        result: resolve(__dirname, "result.html"),
        pillar: resolve(__dirname, "pillar.html")
      }
    }
  }
});
