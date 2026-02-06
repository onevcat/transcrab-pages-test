# TransCrab

A local-first pipeline for turning links into a beautiful translated reading site.

**Designed for OpenClaw assistants.**

## What you get

After setup, your assistant can take a link + the keyword `crab` and will:

1) fetch the article
2) convert HTML → Markdown
3) translate Markdown (default: zh-Hans)
4) commit + push to your personal repo
5) Netlify rebuilds → you get a polished page URL

## Recommended repo setup

To keep the template clean (and avoid publishing third‑party content by default), use two repos:

- **Template (public):** `transcrab` (this repo)
- **Personal content (private):** `transcrab-<you>` (your own repo for articles)

Deploy the **personal** repo to Netlify.

## One-time setup (tell your assistant)

Copy/paste to your OpenClaw assistant:

> Create a private repo named `transcrab-<me>` for my content site.
> Clone `onevcat/transcrab` locally, set remotes:
> - `upstream` → template repo
> - `origin` → my private repo
> Push code to `origin/main`.
> Configure Netlify with build command `npm run build` and publish dir `dist`.

## Daily use

- Send a URL, then send `crab`.
- If you want a different behavior, explicitly say so (e.g. `raw`, `sum`, `tr:ja`).

## Keeping your personal repo up to date

In your personal repo clone:

```bash
./scripts/sync-upstream.sh
```

## Requirements (local)

- Node.js 22+
- OpenClaw gateway running locally

## License

MIT
