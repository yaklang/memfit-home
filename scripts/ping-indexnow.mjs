#!/usr/bin/env node
/**
 * IndexNow ping 脚本：部署后通知 Bing / Yandex / Seznam 收录更新。
 * 用法：node scripts/ping-indexnow.mjs https://memfit.ai/ [更多URL...]
 * key 文件：static/ee4db5d82d0ce79b6c5d59bfb1fa070b.txt（发布后在 https://memfit.ai/ee4db5d82d0ce79b6c5d59bfb1fa070b.txt 可访问）
 * 无参数时默认 ping sitemap 中的全部 URL。
 */
const KEY = 'ee4db5d82d0ce79b6c5d59bfb1fa070b';
const HOST = 'https://memfit.ai';

async function main() {
  let urls = process.argv.slice(2);
  if (urls.length === 0) {
    const res = await fetch(`${HOST}/sitemap.xml`);
    const xml = await res.text();
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  }
  console.log(`pinging IndexNow with ${urls.length} urls (key=${KEY})`);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${HOST}/${KEY}.txt`, urlList: urls }),
  });
  console.log('status:', res.status, res.statusText);
}
main().catch((e) => { console.error(e); process.exit(1); });
