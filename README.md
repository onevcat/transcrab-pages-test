# TransCrab

A local-first pipeline that turns links into a beautiful translated reading site.

**This repo is designed to be installed and operated by an OpenClaw assistant (a bot).**

---

## What you get

After setup, your assistant can take a link + the keyword `crab` and will:

1) fetch the article
2) extract main content
3) convert HTML → Markdown
4) translate Markdown (default: zh-Hans)
5) commit + push to your repo
6) Netlify rebuilds → you get a polished page URL

---

## Installation (fork + deploy)

### 0) Fork

Fork this repo to your own GitHub account.

### 1) Deploy to Netlify

Deploy **your fork** on Netlify:

- Build command: `npm run build`
- Publish directory: `dist`

### 2) Tell your OpenClaw assistant how to operate it

Copy/paste the following to your OpenClaw assistant:

> Install TransCrab for me:
> 1) Clone my fork of `transcrab`.
> 2) When I send a URL then send `crab`, do:
>    - fetch the page
>    - extract main content
>    - convert to Markdown
>    - translate to zh-Hans (default model: openai-codex/gpt-5.2)
>    - write files under `content/articles/<slug>/` (source.md + zh.md + meta.json)
>    - commit + push to main
>    - reply with the new page URL on my Netlify site
> 3) If I give explicit instructions (e.g. `raw`, `sum`, `tr:ja`), follow those instead.
> 4) If there is only a URL but no `crab`, do not run the pipeline.

---

## Daily use (human → bot)

- Send a URL, then send `crab`.
- For other behaviors, be explicit:
  - `raw <url>`: store source only
  - `sum <url>`: summary only
  - `tr:<lang> <url>`: translate to another language

---

## Updating (when this template repo changes)

Your assistant (or you) can keep your fork in sync with this template.

### Option A: one-command update (recommended)

From your fork clone:

```bash
./scripts/sync-upstream.sh
```

### Option B: manual update

```bash
git remote add upstream https://github.com/onevcat/transcrab.git
git fetch upstream
git merge upstream/main
git push
```

---

## Requirements (local)

- Node.js 22+
- OpenClaw gateway running locally

## License

MIT
