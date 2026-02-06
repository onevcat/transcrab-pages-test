# TransCrab Bootstrap (for OpenClaw assistants)

This repo is meant to be **used via your OpenClaw assistant**.

## 0) What you get

After setup, your assistant can take a link + the keyword `crab` and will:

1) fetch the article
2) convert to Markdown
3) translate to Chinese (default)
4) commit + push to your personal repo
5) Netlify rebuilds → you get a beautiful Chinese page URL

## 1) One-time setup (recommended structure)

You should have two repos:

- **Template (public):** this repo (`<owner>/transcrab`)
- **Personal content (private):** `<owner>/transcrab-<yourname>`

Deploy the **personal** repo to Netlify.

## 2) Assistant instructions (copy/paste to your OpenClaw)

Tell your OpenClaw assistant:

- Clone `https://github.com/<owner>/transcrab` to workspace
- Create a private repo `https://github.com/<owner>/transcrab-<yourname>`
- Add remotes:
  - `upstream` → template repo
  - `origin` → personal repo
- Push initial code to `origin/main`
- Configure Netlify to deploy from `origin/main` (build: `npm run build`, publish: `dist`)

## 3) Keeping up to date

In your personal repo clone, run:

```bash
./scripts/sync-upstream.sh
```

## 4) Daily use

Send a URL, then send `crab`.

If you want other behaviors, explicitly instruct your assistant (e.g. `raw`, `sum`, `tr:ja`).
