# Issue Blog

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raclen/issue-blog)

一个参考 `zone/blog` 做的轻量博客模板：用 GitHub Issues 写文章，同步成仓库里的 Markdown，再一键部署到 Cloudflare。

## Deploy

点击上面的 **Deploy to Cloudflare** 按钮，Cloudflare 会从 GitHub 仓库创建项目并部署静态站点。

部署配置：

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `22`
- Cloudflare config: `wrangler.jsonc`

如果你把仓库改名或 fork 到自己的账号，请把 README 顶部按钮里的仓库地址改成你的 GitHub 仓库地址：

```md
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OWNER/REPO)
```

## 写文章

1. 在当前仓库新建 Issue。
2. 给 Issue 加上 `blog` 标签。
3. GitHub Actions 会在 Issue 创建、编辑、打标签、取消标签、重新打开、关闭、删除时同步，也会每天北京时间 08:00 和 20:00 定时同步。
4. 同步结果会提交到 `src/content/blog/`。

Issue 的其他标签会变成文章标签，`blog` 标签只用于筛选文章。

## 本地开发

```bash
npm install
npm run dev
```

本地同步当前仓库 Issues：

```bash
ISSUE_REPO=OWNER/REPO GITHUB_TOKEN=YOUR_TOKEN npm run sync:issues
```

构建：

```bash
npm run build
```

部署：

```bash
npm run deploy
```

## Issue 元数据

如果想固定发布日期，可以在 Issue 正文里加入：

```md
<!-- issue-blog-meta
pubDate: 2026-06-27
updatedDate: 2026-06-27
-->
```

不写时默认使用 Issue 创建时间作为 `pubDate`，Issue 更新时间作为 `updatedDate`。

## 目录

```text
issue-blog/
├── .github/
│   ├── ISSUE_TEMPLATE/blog.md
│   └── workflows/sync-issues.yml
├── scripts/sync-issues.js
├── src/
│   ├── content/blog/
│   ├── layouts/
│   ├── lib/
│   └── pages/
├── astro.config.mjs
├── wrangler.jsonc
└── README.md
```

## 许可

MIT
