// @ts-check
import { defineConfig, svgoOptimizer } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const site = process.env.SITE_URL || "https://example.com";

export default defineConfig({
  site,
  output: "static",
  devToolbar: {
    enabled: false,
  },
  integrations: [
    mdx(),
    sitemap(),
    pagefind({
      indexConfig: {
        forceLanguage: "zh",
        includeCharacters: "-_+#.?:",
      },
    }),
  ],
  i18n: {
    locales: ["zh-CN"],
    defaultLocale: "zh-CN",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        external: [/^\/pagefind\//],
      },
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
