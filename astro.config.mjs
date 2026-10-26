// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  build: {
    inlineStylesheets: "auto",
  },
  output: "static",
  compressHTML: true,
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    build: {
      cssCodeSplit: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
});
