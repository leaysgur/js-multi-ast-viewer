import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), svelte()],

  // For GitHub Pages
  base: "/js-multi-ast-viewer/",

  // All for `oxc-parser`(napi-rs)
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  server: {
    headers: {
      "cross-origin-embedder-policy": "require-corp",
      "cross-origin-opener-policy": "same-origin",
    },
  },
});
