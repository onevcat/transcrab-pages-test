# TransCrab bootstrap (FOR OPENCLAW ASSISTANTS)

This document is written for an **OpenClaw assistant (bot)**.

Your job is to help your human install and deploy TransCrab, then operate it reliably.

## Goal

After setup, the human can:

- send a URL
- then send `crab`

…and you will fetch → extract → markdown → translate → commit/push, and return a deployed page URL.

## One-time setup checklist

1) Confirm prerequisites
- Node.js 22+
- OpenClaw gateway is running locally
- A working model provider is configured (default: `openai-codex/gpt-5.2`)

2) Ask the human for deployment details
- Do they already have a GitHub repo ready (fork) or should you fork `onevcat/transcrab` for them?
- Do they already have a Netlify site URL, or should they create one and connect it to the repo?

3) Repo setup
- Clone the repo into the workspace
- Run `npm i`
- Run `npm run build`

4) Netlify settings
- Build command: `npm run build`
- Publish dir: `dist`

## Conversation contract

- URL alone is **not** a trigger.
- Only run the default pipeline when the human sends URL + `crab`.
- If the human provides explicit instructions, follow them instead:
  - `raw <url>`: store source only
  - `sum <url>`: summary only
  - `tr:<lang> <url>`: translate to another language

## Operating the pipeline

On `URL + crab`:

- Fetch and extract main content
- Convert HTML → Markdown (preserve structure as much as possible)
- Translate to target language
  - Keep Markdown structure
  - Do not translate code blocks, commands, URLs, file paths
- Write files under `content/articles/<slug>/`:
  - `source.md`
  - `<lang>.md` (e.g. `zh.md`)
  - `meta.json`
- Commit and push to `main`
- Reply with the deployed page URL

## Updates

To sync upstream changes into the fork:

```bash
./scripts/sync-upstream.sh
```
