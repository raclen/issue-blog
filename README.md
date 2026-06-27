# Issue Blog

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raclen/issue-blog)

English README: [README.en.md](./README.en.md)

一个参考 `zone/blog` 做的轻量博客模板：用 GitHub Issues 写文章，自动同步成仓库里的 Markdown，再一键部署到 Cloudflare。

Issue Blog 适合想写博客、沉淀技术笔记、发布项目日志，但不想维护后台、数据库、CMS 和复杂部署流程的人。你只需要打开 GitHub Issue 写内容，剩下的同步、生成静态页面、RSS 和部署交给仓库自动完成。

## 它解决什么问题

传统博客系统经常会把“写文章”变成“维护系统”：要搭 CMS、管数据库、配置服务器、处理备份，还要考虑编辑器、权限和部署。Issue Blog 把这些都压缩到 GitHub 的现成能力里。

- 不想维护后台：GitHub Issues 就是编辑器和内容管理界面。
- 不想维护数据库：文章同步为 Markdown 文件，天然可版本化。
- 不想重复发布：Issue 创建、编辑、打标签后自动同步。
- 不想折腾部署：Cloudflare 一键部署，静态站点访问快、成本低。
- 不想内容被平台锁住：最终内容保存在仓库里，可迁移、可审计、可备份。

## 产品优势

- **写作入口轻**：直接用 GitHub Issue 写文章，支持 Markdown、图片、代码块、评论讨论。
- **内容归档清晰**：同步后的文章保存在 `src/content/blog/`，每次变更都有 Git 历史。
- **发布链路短**：给 Issue 加 `blog` 标签即可进入博客，不需要额外后台操作。
- **部署成本低**：Astro 生成静态站点，Cloudflare 托管，适合长期运行。
- **适合个人和小团队**：个人博客、项目更新、知识库、开发日志都能用。
- **不绑定平台**：文章是 Markdown，站点是普通 Astro 项目，后续可以自由改主题、加搜索、加评论。

## 特色

- GitHub Issues 同步文章
- `blog` 标签筛选发布内容
- Issue 其他标签自动转为文章标签
- 支持固定 `pubDate` 和 `updatedDate`
- 自动生成文章详情页和 RSS
- GitHub Actions 自动同步并提交 Markdown
- 支持 Cloudflare 一键部署
- 支持本地开发、构建和 Wrangler 部署

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

## 工作流

```text
GitHub Issue
  ↓ 添加 blog 标签
GitHub Actions
  ↓ 调用 scripts/sync-issues.js
Markdown 文件
  ↓ Astro build
Cloudflare 静态站点
```

## 写文章

1. 在当前仓库新建 Issue。
2. 给 Issue 加上 `blog` 标签。
3. GitHub Actions 会在 Issue 创建、编辑、打标签、取消标签、重新打开、关闭、删除时同步，也会每天北京时间 08:00 和 20:00 定时同步。
4. 同步结果会提交到 `src/content/blog/`。

Issue 的其他标签会变成文章标签，`blog` 标签只用于筛选文章。

## 适合用来做什么

- 个人技术博客
- 项目 changelog 或开发周报
- 轻量知识库
- 团队内部技术笔记
- 开源项目公告页
- 把历史 Issue 整理成可浏览文章

如果这个模板对你有帮助，欢迎点个 Star。你的支持会直接推动我继续补强主题、同步能力和部署体验。

[![Star History Chart](https://api.star-history.com/svg?repos=raclen/issue-blog&type=Date)](https://star-history.com/#raclen/issue-blog&Date)

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

## 配置项

同步脚本支持这些环境变量：

- `ISSUE_REPO`：要同步的仓库，例如 `OWNER/REPO`。GitHub Actions 中默认使用当前仓库。
- `ISSUE_LABEL`：文章标签，默认是 `blog`。
- `ISSUE_STATE`：Issue 状态，默认是 `open`。
- `GITHUB_TOKEN`：GitHub API Token，本地同步私有仓库或提高限额时使用。
- `SITE_URL`：Astro 构建时的网站地址，影响 RSS 链接。

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
