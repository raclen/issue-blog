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
- Not platform-bound: the site is a normal Astro project, so you can swap themes, add search, or extend comments later.

## Highlights

- Syncs GitHub Issues into blog posts
- Uses the `blog` label to filter publishable content
- Converts other issue labels into post tags
- Supports fixed `pubDate` and `updatedDate`
- Generates post pages and RSS automatically
- Uses GitHub Actions for scheduled and event-driven sync
- Includes a Cloudflare one-click deploy button
- Supports local development, builds, and Wrangler deployment

## Deploy

**No manual fork required.** Click the **Deploy to Cloudflare** button above and Cloudflare will walk you through authorizing GitHub, copy this template into your own account, create the Worker project, and ship the first deployment.

Settings to confirm in the wizard:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Output directory | `dist` (declared by `wrangler.jsonc` → `assets.directory`) |
| Node.js | `22` (pinned in the repo via `.node-version`) |
| Environment variable | `SITE_URL` — see below |

### The one variable you should set: `SITE_URL`

`SITE_URL` drives canonical URLs, RSS links, and the absolute entries in `sitemap-index.xml`. The deploy will still succeed without it, but every link will point at the placeholder `https://example.com` (the build prints a loud warning).

- No custom domain yet: deploy once, grab your `https://<project>.<your-subdomain>.workers.dev` URL, set `SITE_URL` to it in the Cloudflare dashboard, and redeploy once.
- Custom domain ready: just set `SITE_URL=https://your-domain.com`.

### Two things to do after deploying

The one-click deploy only publishes the **site**. Post syncing runs in GitHub Actions, so also:

1. Open your repository → **Actions** tab → click **Enable workflow** (Actions are disabled by default on forks and newly created repos).
2. Go to **Sync Issues → Run workflow** and run it once. The job creates the missing `blog` label for you.

After that, open an issue in your repo, add the `blog` label, and Actions commits the Markdown; Cloudflare rebuilds automatically on every new commit.

### I already forked — how do I deploy my own fork?

Heads up: the button in a forked README still points at the upstream template, so clicking it makes Cloudflare copy upstream again instead of deploying your fork. To deploy your own fork, pick one:

- Use the Cloudflare dashboard: **Workers & Pages → Create → Connect to Git**, pick your fork, then fill in the settings table above.
- Or point the README button at your own repository:

```md
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OWNER/REPO)
```

### Build failure checklist

- `Cannot find module 'wrangler'`, `pagefind`, or Vite errors: the build environment ran with `NODE_ENV=production`, so `npm ci` skipped devDependencies. The repo ships `.npmrc` (`include=dev`) to prevent this; if you use a custom build image, make sure devDependencies are installed.
- `Invalid or missing options: ... (description)`: RSS could not resolve its title/description — check `site.title` and `site.description` in `astro-paper.config.ts`.
- Deploying from your own machine: `npm run deploy` (same as `npm run build && wrangler deploy`).

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

Other issue labels become post tags. The `blog` label is only used as the publishing filter.

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

```bash
npm install
npm run dev
```

Sync issues from a specific repository locally:

```bash
ISSUE_REPO=OWNER/REPO GITHUB_TOKEN=YOUR_TOKEN npm run sync:issues
```

Build:

```bash
npm run build
```

Deploy:

```bash
npm run deploy
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
- `SITE_URL`: site URL used during Astro builds and RSS generation.

## Project Layout

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
├── .npmrc
├── .node-version
├── astro.config.mjs
├── astro-paper.config.ts
├── wrangler.jsonc
└── README.md
```

## License

MIT
