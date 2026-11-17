# Issue Blog

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raclen/issue-blog)

Chinese README: [README.md](./README.md)

Issue Blog is a lightweight blog template inspired by `zone/blog`. You write posts in GitHub Issues, sync them into Markdown files, and deploy the generated site to Cloudflare with one click.

## What It Solves

Many blogging setups turn writing into infrastructure work. You end up managing a CMS, database, server, backups, permissions, and deployment just to publish a post.

Issue Blog keeps the entire publishing flow inside GitHub and static hosting.

- No CMS to maintain: GitHub Issues act as the editor and content manager.
- No database to run: posts are stored as Markdown in the repository.
- No manual publishing flow: labeling an issue can sync it automatically.
- No deployment hassle: Cloudflare serves the static site fast and cheaply.
- No lock-in: your content stays in git, so it is portable, auditable, and easy to back up.

## Product Benefits

- Low-friction writing: write directly in GitHub Issues with Markdown, images, code blocks, and comments.
- Clean history: synced posts live in `src/content/blog/`, so every change is tracked in git.
- Short publishing path: add the `blog` label and the post is ready for sync.
- Low operating cost: Astro builds a static site and Cloudflare hosts it.
- Good for individuals and small teams: personal blogs, changelogs, dev logs, and internal knowledge bases all fit well.
- Not platform-bound: the site is a normal Astro project with a theme, search, and discussion links already built in, so you can extend it freely.

## Highlights

- Syncs GitHub Issues into blog posts: `blog` selects publishable content and other labels become post tags
- Fuwari-style cards with configurable author profiles, tag counts, year archives, and a table of contents
- Pagefind full-text search, light/dark themes, reading progress, word counts, reading time, code copying, and adjacent-post navigation
- Supports fixed `pubDate` and `updatedDate`, with automatic post pages, RSS, and sitemap generation
- A compact amber notice appears after a post is more than **100 full days** old; the browser recalculates its age when the page opens
- Daily sharing: monthly Markdown files with day navigation, stable date anchors, and adjacent-month links
- Links readers to the original GitHub Issue by default, with optional Giscus comments and no dependency on the template author's private comment service
- GitHub Actions sync with Cloudflare one-click deployment
- Local development, builds, and Wrangler deployment

## Deploy

Click the **Deploy to Cloudflare** button above. **No manual fork needed** — Cloudflare copies the template into your own account, creates the Worker project, and ships the first deployment for you.

| Step | What you do | Notes |
| --- | --- | --- |
| **1** | Click **Deploy to Cloudflare** | Authorize GitHub; Cloudflare creates your repository copy automatically |
| **2** | Set the `SITE_URL` environment variable | Your domain, e.g. `https://blog.example.com`. **No domain yet? Skip this step** — nothing else needs to be filled in |
| **3** | Click **Deploy** and wait 1–2 minutes | You are done when you get `https://<project>.<your-subdomain>.workers.dev` |
| **4** | Turn on post syncing (once only) | Your new repo → **Actions** → **Enable workflow** → **Sync Issues** → **Run workflow** |

That is the whole setup: open an issue in your repo, add the `blog` label, and the post is synced to Markdown and Cloudflare redeploys automatically.

- You do **not** need to create the `blog` label by hand — the workflow creates it.
- `SITE_URL` drives canonical URLs, RSS links, and the absolute entries in `sitemap-index.xml`. Deploying without it still works, but every link points at the placeholder `https://example.com` (the build log warns you). No domain yet? Deploy first, copy the `*.workers.dev` URL, set `SITE_URL` in the dashboard, then hit Redeploy once.

<details>
<summary>Build settings to check in the wizard</summary>

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Output directory | `dist` (declared by `wrangler.jsonc` → `assets.directory`) |
| Node.js | `22` (pinned in the repo via `.node-version`) |

</details>

<details>
<summary>I already forked — how do I deploy my own fork?</summary>

The button in a forked README still points at the upstream template, so clicking it makes Cloudflare copy upstream again instead of deploying your fork. Pick one:

- **Dashboard**: **Workers & Pages → Create → Connect to Git** → pick your fork → fill in the settings table above.
- **Change the button**: point the button at your own repository:

```md
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OWNER/REPO)
```

</details>

<details>
<summary>Build failure checklist</summary>

| Symptom | Fix |
| --- | --- |
| `Cannot find module 'wrangler'`, `pagefind`, or Vite errors | The build ran with `NODE_ENV=production`, so `npm ci` skipped devDependencies. The repo ships `.npmrc` (`include=dev`) to prevent this; with a custom build image, make sure devDependencies are installed |
| `Invalid or missing options: ... (description)` | `site.title` / `site.description` in `astro-paper.config.ts` must not be empty |
| Every link points at `example.com` | `SITE_URL` is not set — set it and redeploy |

You can also deploy from your own machine instead of the dashboard: `npm run deploy` (same as `npm run build && wrangler deploy`).

</details>

## Workflow

```text
GitHub Issue
  ↓ add the blog label
GitHub Actions
  ↓ run scripts/sync-issues.js
Markdown files
  ↓ Astro build
Cloudflare static site
```

## Writing Posts

1. Create a new issue in this repository.
2. Add the `blog` label.
3. GitHub Actions syncs on create, edit, label change, reopen, close, and delete events, and also runs on a daily schedule.
4. The sync job commits the generated Markdown to `src/content/blog/`.

Other issue labels become post tags. The `blog` label is only used as the publishing filter. Removing it or closing an issue removes the corresponding post on the next sync, since only open issues are fetched by default.

Sync commits do not include `[skip ci]`, so hosting platforms can build the updated content. The sync workflow only listens to issue events, schedules, and manual dispatches; its own commits do not recursively trigger it.

## Pages and Theme Configuration

| Route | Content |
| --- | --- |
| `/` | Blog homepage, post list, and search entry |
| `/blog/[slug]` | Post details, table of contents, age notice, adjacent posts, and Issue discussions |
| `/tags`, `/tags/[tag]` | Tag list and paginated posts by tag |
| `/archives` | Year archives |
| `/daily`, `/daily/[month]` | Daily-sharing month list and monthly pages |
| `/rss.xml` | Blog RSS feed |
| `/sitemap-index.xml` | Sitemap |

Edit [astro-paper.config.ts](astro-paper.config.ts) to set your own `site.title`, `site.description`, `site.author`, `site.authorBio`, `site.authorAvatar`, and `site.profile`. Configure social links through `socials`, Pagefind search through `features.search`, and theme switching through `features.lightAndDarkMode`.

`comments.enabled` defaults to `false`, but posts still link to the original Issue for discussion. For embedded comments, get your repository's settings from [giscus.app](https://giscus.app), set `comments.enabled` to `true` and `provider` to `"giscus"`, and fill in `repo`, `repoId`, `category`, and `categoryId`. Optional fields are documented in [src/types/config.ts](src/types/config.ts).

Daily sharing is edited manually in `src/content/daily/YYYY-MM.md`, independently of Issue-synced blog posts. Each file represents one month and is left untouched by the sync script. See [src/content/daily/2026-11.md](src/content/daily/2026-11.md) for day headings, link entries, and indented continuation lines, and [src/utils/parseDaily.ts](src/utils/parseDaily.ts) for the parser. Rebuild after adding a new month to generate its page.

## Good Fits

- Personal tech blog
- Project changelog or weekly update
- Lightweight knowledge base
- Internal team notes
- Open source project announcements
- Converting old GitHub Issues into browsable posts

If this project helps you, please star the repo. Your support helps me keep improving the theme, sync flow, and deployment experience.

[![Star History Chart](https://api.star-history.com/svg?repos=raclen/issue-blog&type=Date)](https://star-history.com/#raclen/issue-blog&Date)

## Local Development

Use Node.js 22 and install the locked dependencies:

```bash
npm ci
```

Start the local dev server (`http://localhost:4321`):

```bash
npm run dev
```

Run type checks, build to `dist/`, and generate the Pagefind index:

```bash
npm run build
```

Preview the production output:

```bash
npm run preview
```

Build and deploy to your Cloudflare account:

```bash
npm run deploy
```

Sync issues from a specific repository (configure the Token in your local environment; never commit it):

```bash
ISSUE_REPO=OWNER/REPO npm run sync:issues
```

## Issue Metadata

To pin publish dates, add this block to the issue body:

```md
<!-- issue-blog-meta
pubDate: 2026-06-27
updatedDate: 2026-06-27
-->
```

If you do not add metadata, `pubDate` defaults to the issue creation time and `updatedDate` defaults to the issue update time.

## Config

Supported environment variables:

- `ISSUE_REPO`: repository to sync, for example `OWNER/REPO`. GitHub Actions defaults to the current repository.
- `ISSUE_LABEL`: label used to select blog posts, default `blog`.
- `ISSUE_STATE`: issue state to fetch, default `open`.
- `GITHUB_TOKEN`: GitHub API token, useful for private repositories or higher rate limits.
- `SITE_URL`: site URL used for canonical URLs and absolute RSS and sitemap links.

## Project Layout

```text
issue-blog/
├── .github/
│   ├── ISSUE_TEMPLATE/blog.md
│   └── workflows/sync-issues.yml
├── scripts/sync-issues.js
├── src/
│   ├── components/fuwari/
│   ├── content/
│   │   ├── blog/
│   │   └── daily/
│   ├── content.config.ts
│   ├── layouts/
│   ├── lib/posts.ts
│   ├── pages/
│   └── utils/parseDaily.ts
├── .npmrc
├── .node-version
├── astro.config.mjs
├── astro-paper.config.ts
├── wrangler.jsonc
└── README.md
```

## License

MIT
