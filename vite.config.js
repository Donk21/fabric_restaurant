import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const page = (file) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      // Two pages: the landing and the full menu
      input: {
        main: page("./index.html"),
        menu: page("./menu.html"),
      },
    },
  },
});
