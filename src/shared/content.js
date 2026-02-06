import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content', 'articles');

export async function listArticles() {
  let dirs = [];
  try {
    dirs = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  } catch {
    return [];
  }

  const items = [];
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const slug = d.name;

    const zhPath = path.join(CONTENT_ROOT, slug, 'zh.md');
    const metaPath = path.join(CONTENT_ROOT, slug, 'meta.json');

    try {
      const raw = await fs.readFile(zhPath, 'utf-8');
      const fm = matter(raw);

      // Best-effort: use createdAt from meta.json for stable ordering within a day.
      let createdAt = null;
      try {
        const metaRaw = await fs.readFile(metaPath, 'utf-8');
        const meta = JSON.parse(metaRaw);
        createdAt = meta?.createdAt ?? null;
      } catch {
        // ignore
      }

      items.push({
        slug,
        title: fm.data.title ?? slug,
        date: fm.data.date ?? null,
        createdAt,
        sourceUrl: fm.data.sourceUrl ?? null,
      });
    } catch {
      // ignore
    }
  }

  function ts(x) {
    if (!x) return null;
    const t = Date.parse(x);
    return Number.isFinite(t) ? t : null;
  }

  items.sort((a, b) => {
    const ac = ts(a.createdAt);
    const bc = ts(b.createdAt);
    if (ac !== null || bc !== null) return (bc ?? -1) - (ac ?? -1);

    // Fallback: date (YYYY-MM-DD) descending.
    const ad = String(a.date ?? '');
    const bd = String(b.date ?? '');
    if (ad !== bd) return bd.localeCompare(ad);

    // Last resort: slug stable.
    return String(a.slug).localeCompare(String(b.slug));
  });

  return items;
}

export async function getArticle(slug) {
  const zhPath = path.join(CONTENT_ROOT, slug, 'zh.md');
  try {
    const raw = await fs.readFile(zhPath, 'utf-8');
    const fm = matter(raw);
    const html = marked.parse(fixStrongAdjacency(fm.content));
    return {
      slug,
      title: fm.data.title ?? slug,
      date: fm.data.date ?? null,
      sourceUrl: fm.data.sourceUrl ?? null,
      html,
    };
  } catch {
    return null;
  }
}

// CommonMark-style emphasis rules are strict about delimiter adjacency.
// In Chinese translations we often have patterns like `**Item：**Item` without a space.
// Many parsers render this literally. We insert a space after a closing strong marker
// when it is immediately followed by a CJK/Latin/digit character.
function fixStrongAdjacency(md) {
  return md
    // **bold**Word -> **bold** Word
    .replace(/(\*\*[^\n]*?\*\*)(?=[0-9A-Za-z\u4E00-\u9FFF])/g, '$1 ')
    // __bold__Word -> __bold__ Word
    .replace(/(__[^\n]*?__)(?=[0-9A-Za-z\u4E00-\u9FFF])/g, '$1 ');
}
