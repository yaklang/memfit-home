#!/usr/bin/env node
/**
 * 生成 src/generated/docFirstCommitDates.ts：每个文档的「首次提交时间」映射。
 * 用途：TechArticle.datePublished 应取内容真正发布日（git 首次提交），
 * 而非与 dateModified 相同的最后提交时间——两者相同会被 AI 视为
 * 「发布即最新」的弱信号。
 *
 * 键为文档 permalink（无尾斜杠，与 Docusaurus metadata.permalink 一致），
 * 由 package.json build 链在 docusaurus build 之前调用。
 */
import {readdirSync, writeFileSync, mkdirSync, existsSync} from 'fs';
import {join, relative, dirname} from 'path';
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';

const root = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
);
const DOCS = join(root, 'docs');
const OUT_DIR = join(root, 'src', 'generated');
const OUT = join(OUT_DIR, 'docFirstCommitDates.ts');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(md|mdx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** docs 相对路径 → permalink 路径段（对齐 Docusaurus：去掉数字前缀，index 归入目录） */
function toPermalinkSegment(rel) {
  let p = rel.replace(/\.(md|mdx)$/, '');
  p = p.replace(/(^|\/)\d+-/g, '$1');
  if (p.endsWith('index')) p = p.slice(0, -'index'.length).replace(/\/$/, '');
  return p;
}

function firstCommitDate(file) {
  try {
    const out = execSync(
      `git log --follow --diff-filter=A --format=%aI -- "${file}"`,
      {stdio: ['pipe', 'pipe', 'pipe'], cwd: root},
    )
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean);
    // git log 新→旧排列，最后一行是最早的添加提交
    // 统一转为 UTC Z 格式，与 dateModified 的 ISO 输出一致
    if (!out.length) return null;
    return new Date(out[out.length - 1]).toISOString();
  } catch {
    return null;
  }
}

const map = {};
for (const file of walk(DOCS)) {
  const rel = relative(DOCS, file).replace(/\\/g, '/');
  const seg = toPermalinkSegment(rel);
  const date = firstCommitDate(file);
  if (seg && date) map[`/docs/${seg}`] = date;
}

// en 构建中 permalink 带 /en 前缀（如 /en/docs/product/overview），
// en 文档为 zh 的翻译、内容对应，直接克隆一份带前缀的键，
// 避免 en 页 datePublished 回退到构建时间（zh 首提日期才是真实发布信号）
for (const key of Object.keys(map)) {
  map[`/en${key}`] = map[key];
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);
const body = `// 自动生成（scripts/gen-first-commit-dates.mjs），勿手改。
// 键：文档 permalink（无尾斜杠）；值：git 首次提交时间（ISO 8601）。
export const DOC_FIRST_COMMIT_DATES: Record<string, string> = ${JSON.stringify(
  map,
  null,
  2,
)};
`;
writeFileSync(OUT, body);
console.log(
  `[gen-first-commit-dates] ${Object.keys(map).length} 个文档 → ${relative(root, OUT)}`,
);
