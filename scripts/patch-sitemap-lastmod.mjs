#!/usr/bin/env node
/**
 * 构建后处理 sitemap（由 package.json 的 build 脚本在 docusaurus build 之后调用）：
 *
 * 1. 为每个 <url> 注入逐 URL 的 <lastmod>（该页面源文件的 git 最近提交时间）。
 *    Docusaurus 默认 sitemap 不含 lastmod，而 Bing / Perplexity / AI 爬虫依赖它判断内容新鲜度；
 *    之前全站统一取仓库最后提交时间，82 条同值导致新鲜度信号失真，现改为逐 URL 真实时间。
 * 2. 把 build/en/sitemap.xml 的英文 URL 合并进根 sitemap，并为 zh/en 成对页面注入
 *    <xhtml:link rel="alternate"> hreflang 三元组（zh-CN / en-US / x-default）。
 *    Docusaurus i18n 的根 sitemap 只含默认语言，en 页"可访问但不可发现"。
 *
 * 映射规则：https://memfit.ai/<path> ↔ https://memfit.ai/en/<path>
 */
import {readFileSync, writeFileSync, existsSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {execSync} from 'child_process';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(repoRoot, 'build');
const sitemapPath = join(buildDir, 'sitemap.xml');
const enSitemapPath = join(buildDir, 'en', 'sitemap.xml');

// 兜底 lastmod：仓库最后提交时间，再退构建时间
let fallbackLastmod;
try {
  fallbackLastmod = execSync('git log -1 --format=%cI', {stdio: ['pipe', 'pipe', 'pipe']})
    .toString()
    .trim();
} catch {
  fallbackLastmod = new Date().toISOString();
}
if (Number.isNaN(Date.parse(fallbackLastmod))) {
  fallbackLastmod = new Date().toISOString();
}

// URL 路径 -> 源文件候选（存在的才保留）；en 文档优先 i18n 源，缺翻译时回退 zh 源
function urlToSourcePaths(urlPath) {
  // 去掉域名后的路径形如 '/docs/xxx/'——先剥掉首尾斜杠再匹配
  let p = urlPath.replace(/^\/+/, '').replace(/\/+$/, '');
  const isEn = p === 'en' || p.startsWith('en/');
  if (isEn) p = p.slice(2);
  const candidates = [];
  const docExts = (base) => [`${base}.md`, `${base}.mdx`, `${base}/index.md`, `${base}/index.mdx`];
  if (p === '') {
    // 首页（zh/en 同源）：入口页面 + 整个首页组件目录
    candidates.push('src/pages/index.tsx', 'src/components/NewHome/');
  } else if (p.startsWith('docs/')) {
    const rest = p.slice('docs/'.length);
    if (isEn) candidates.push(...docExts(`i18n/en/docusaurus-plugin-content-docs/current/${rest}`));
    candidates.push(...docExts(`docs/${rest}`));
  } else {
    candidates.push(
      `src/pages/${p}.mdx`, `src/pages/${p}.tsx`, `src/pages/${p}.md`,
      `src/pages/${p}.js`, `src/pages/${p}/index.tsx`, `src/pages/${p}/index.mdx`,
    );
  }
  return candidates
    .map((c) => join(repoRoot, c))
    .filter((c) => existsSync(c));
}

const gitLastIsoCache = new Map();
function lastmodFor(url) {
  const urlPath = url.replace(/^https?:\/\/[^/]+/, '');
  const paths = urlToSourcePaths(urlPath);
  if (!paths.length) return fallbackLastmod;
  const key = paths.join('|');
  if (gitLastIsoCache.has(key)) return gitLastIsoCache.get(key);
  let iso = null;
  try {
    iso = execSync(`git log -1 --format=%cI -- ${paths.map((p) => JSON.stringify(p)).join(' ')}`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: repoRoot,
    })
      .toString()
      .trim() || null;
  } catch {
    iso = null;
  }
  if (!iso || Number.isNaN(Date.parse(iso))) iso = fallbackLastmod;
  gitLastIsoCache.set(key, iso);
  return iso;
}

let xml;
try {
  xml = readFileSync(sitemapPath, 'utf-8');
} catch (err) {
  console.error(`[patch-sitemap] 无法读取 ${sitemapPath}：`, err.message);
  process.exit(1);
}

const SITE = 'https://memfit.ai';
const zhUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m.group ? m.group(1) : m[1]);

// en URL -> zh URL 映射（去掉 /en 前缀）
let enUrls = [];
if (existsSync(enSitemapPath)) {
  const enXml = readFileSync(enSitemapPath, 'utf-8');
  enUrls = [...enXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => (m.group ? m.group(1) : m[1]));
}
const zhSet = new Set(zhUrls);
const enByZh = new Map();
const enOnly = [];
for (const en of enUrls) {
  if (!en.startsWith(`${SITE}/en`)) continue;
  const rest = en.slice(`${SITE}/en`.length) || '/'; // '' -> '/'
  const zh = `${SITE}${rest === '/' ? '/' : rest}`;
  if (zhSet.has(zh)) enByZh.set(zh, en);
  else enOnly.push(en);
}

function alternates(zh, en) {
  return (
    `<xhtml:link rel="alternate" hreflang="zh-CN" href="${zh}"/>` +
    `<xhtml:link rel="alternate" hreflang="en-US" href="${en}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${zh}"/>`
  );
}

// en 独有页面（无 zh 对应）：仅声明自身语言
function selfAlternates(url) {
  return `<xhtml:link rel="alternate" hreflang="en-US" href="${url}"/>`;
}

// 清掉构建产物里可能残留的 lastmod，再逐 URL 注入源文件真实 git 时间
xml = xml.replace(/<lastmod>[^<]*<\/lastmod>/g, '');
xml = xml.replace(
  /(<url>)(<loc>([^<]+)<\/loc>)/g,
  (full, open, loc, url) => `${open}${loc}<lastmod>${lastmodFor(url)}</lastmod>`,
);

// 为已有 zh 条目注入 hreflang 交替（仅成对页面）
let altCount = 0;
xml = xml.replace(/<url>(<loc>[^<]+<\/loc>)(<lastmod>[^<]+<\/lastmod>)/g, (full, loc, lm) => {
  const zh = loc.slice(5, -6);
  const en = enByZh.get(zh);
  if (!en) return full;
  altCount++;
  return `<url>${loc}${lm}${alternates(zh, en)}`;
});

// 追加 en 条目（成对 + en 独有），lastmod 取 en 源文件自己的 git 时间
const enEntries = [];
for (const [zh, en] of enByZh) {
  enEntries.push(`<url><loc>${en}</loc><lastmod>${lastmodFor(en)}</lastmod>${alternates(zh, en)}</url>`);
}
for (const en of enOnly) {
  enEntries.push(`<url><loc>${en}</loc><lastmod>${lastmodFor(en)}</lastmod>${selfAlternates(en)}</url>`);
}
if (enEntries.length) {
  xml = xml.replace(/<\/urlset>\s*$/, `${enEntries.join('')}</urlset>`);
}

writeFileSync(sitemapPath, xml);
const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
const distinct = new Set(lastmods);
console.log(
  `[patch-sitemap] 注入 lastmod ${lastmods.length} 条（${distinct.size} 个不同时间，` +
    `区间 ${[...distinct].sort()[0]} ~ ${[...distinct].sort().pop()}）；` +
    `hreflang 成对注入 ${altCount} 条；追加 en 条目 ${enEntries.length} 个`,
);
