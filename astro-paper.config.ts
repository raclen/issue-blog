import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: process.env.SITE_URL || "https://example.com",
    title: "Issue Blog",
    description: "A Cloudflare-deployable blog powered by GitHub Issues.",
    author: "raclen",
    authorBio: "用 GitHub Issues 记录思考与技术沉淀",
    profile: "https://github.com/raclen",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 8,
    perIndex: 8,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/raclen/issue-blog" },
  ],
  shareLinks: [],
  comments: {
    enabled: false,
  },
});
