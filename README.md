# TransCrab

A small local-first pipeline:

1) fetch article URL → extract main content
2) convert HTML → Markdown (keeps structure)
3) translate Markdown (default: zh-Hans)
4) build a static site (Astro)

This repo is designed for **local generation + static deployment** (Netlify/Vercel).

## Requirements

- Node.js 22+
- OpenClaw gateway running locally (ws://127.0.0.1:18789)

## Add an article

```bash
cd transcrab
node scripts/add-url.mjs "<url>" --lang zh --model openai-codex/gpt-5.2
```

Outputs are stored under `content/articles/<slug>/`:
- `source.md` (original Markdown)
- `zh.md` (translated)
- `meta.json`

## Dev / Build

```bash
npm run dev
npm run build
npm run preview
```

## Deploy (Netlify)

- Build command: `npm run build`
- Publish directory: `dist`

