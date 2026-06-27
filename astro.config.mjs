import { defineConfig } from "astro/config";

const site = process.env.SITE_URL || "https://example.com";

export default defineConfig({
  site,
  output: "static",
});
