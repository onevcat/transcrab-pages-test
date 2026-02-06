#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import matter from 'gray-matter';
import slugify from 'slugify';
import { fetch } from 'undici';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONTENT_ROOT = path.join(ROOT, 'content', 'articles');

function usage() {
  console.log(`Usage:
  node scripts/add-url.mjs <url> [--lang zh] [--model <modelId>]

Notes:
  - Fetches HTML, extracts main article (Readability), converts to Markdown (Turndown)
  - Translates Markdown via OpenClaw agent (CLI)
  - If --model is omitted, uses the current OpenClaw default model (openclaw models status)
`);
}

function argValue(args, key, def = null) {
  const idx = args.indexOf(key);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return def;
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  usage();
  process.exit(args.length === 0 ? 2 : 0);
}

const url = args[0];
const lang = argValue(args, '--lang', 'zh');
const model = argValue(args, '--model', null);

await fs.mkdir(CONTENT_ROOT, { recursive: true });

const html = await fetchHtml(url);
const { title, markdown } = await htmlToMarkdown(html, url);
const slug = makeSlug(title || url);
const dir = path.join(CONTENT_ROOT, slug);
await fs.mkdir(dir, { recursive: true });

const now = new Date();
const date = now.toISOString().slice(0, 10);

const sourceFrontmatter = {
  title: title || slug,
  date,
  sourceUrl: url,
  lang: 'source',
};
const sourceMd = matter.stringify(markdown, sourceFrontmatter);
await fs.writeFile(path.join(dir, 'source.md'), sourceMd, 'utf-8');

const translated = translateMarkdown(markdown, { targetLang: lang, model });
const zhFrontmatter = {
  title: title || slug,
  date,
  sourceUrl: url,
  lang,
  ...(model ? { model } : {}),
};
const zhMd = matter.stringify(translated, zhFrontmatter);
await fs.writeFile(path.join(dir, `${lang}.md`), zhMd, 'utf-8');

const meta = {
  slug,
  title: title || slug,
  date,
  sourceUrl: url,
  ...(model ? { model } : {}),
  targetLang: lang,
  createdAt: now.toISOString(),
};
await fs.writeFile(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf-8');

console.log(`OK: ${slug}`);

// ----------------

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      'accept': 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

async function htmlToMarkdown(html, baseUrl) {
  // Lazy-load JSDOM (heavy)
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM(html, { url: baseUrl });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const title = article?.title || dom.window.document.title || '';
  const contentHtml = article?.content || dom.window.document.body?.innerHTML || '';

  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });

  // Keep links and images as-is
  const md = turndown.turndown(contentHtml);
  return { title: title.trim(), markdown: md.trim() + '\n' };
}

function makeSlug(title) {
  const s = slugify(title, { lower: true, strict: true, trim: true });
  return s || `article-${Date.now()}`;
}

function translateMarkdown(sourceMarkdown, { targetLang, model }) {
  const prompt = buildTranslatePrompt(sourceMarkdown, targetLang);

  // Model selection:
  // - If --model is omitted, we use OpenClaw's current default model.
  // - If --model is provided, we try to switch default model temporarily.
  // NOTE: This assumes you run one translation at a time.
  const status = getOpenClawModelsStatus();
  const before = status?.defaultModel || status?.resolvedDefault || null;
  const allowed = new Set(status?.allowed || []);

  let switched = false;
  try {
    if (model) {
      if (allowed.size > 0 && !allowed.has(model)) {
        throw new Error(
          `Requested model not allowed by this OpenClaw config: ${model}\n` +
          `Allowed models: ${Array.from(allowed).join(', ')}`
        );
      }
      if (before && model !== before) {
        run(['openclaw', 'models', 'set', model]);
        switched = true;
      }
    }

    const r = run(['openclaw', 'agent', '--agent', 'main', '--message', prompt]);

    const out = (r.stdout || '').trim();
    // Best-effort: strip code fences if the model wrapped it.
    return out.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```\s*$/, '').trim() + '\n';
  } finally {
    if (switched && before) {
      run(['openclaw', 'models', 'set', before]);
    }
  }
}

function getOpenClawModelsStatus() {
  const r = spawnSync('openclaw', ['models', 'status', '--json'], { encoding: 'utf-8' });
  if (r.status !== 0) return null;
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

function run(cmd) {
  const r = spawnSync(cmd[0], cmd.slice(1), { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
  if (r.status !== 0) {
    throw new Error(`${cmd.join(' ')} failed: ${r.stderr || r.stdout}`);
  }
  return r;
}

function buildTranslatePrompt(md, targetLang) {
  const langName = targetLang === 'zh' ? '简体中文' : targetLang;
  return [
    `你是一个翻译助手。请把下面的 Markdown 内容翻译成${langName}。`,
    `要求：`,
    `- 保留 Markdown 结构（标题/列表/引用/表格/链接）。`,
    `- 代码块、命令、URL、文件路径保持原样，不要翻译。`,
    `- 术语以忠实原意为主，但整体表达要通顺自然（约 6/4：忠实/顺畅）。`,
    `- 只输出翻译后的 Markdown 正文，不要附加解释、不要加前后缀。`,
    ``,
    `---`,
    md,
  ].join('\n');
}
