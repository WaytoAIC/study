#!/usr/bin/env node
/**
 * build-sitemap.mjs —— 从课程数据生成根目录 sitemap.xml 与 llms.txt（docs/13 §2.2）
 *
 * 数据源：slides/course-data.js（含 .en/.ko），用 vm 执行拿 window.COURSE。
 *   · 草稿篇章（draft:true）不进；页头带 noindex 的页不进；文件不存在的不进
 *   · 每节课三语 URL 互为 xhtml:link alternate，x-default 指中文
 *   · lastmod 取页头 JSON-LD 的 dateModified（没有就不写），保证同一份仓库跑几遍结果都一样
 * llms.txt：篇章 → 主题 → 课节链接清单，按「WaytoAIC 原创 / 原作·洛小山」两组署名。
 * 用法：node scripts/build-sitemap.mjs（upstream-sync.sh 在 seo_heads.py 之后调用）
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SLIDES = path.join(ROOT, 'slides');
const SITE = 'https://study.waytoaic.com';
const LANGS = { zh: 'course-data.js', en: 'course-data.en.js', ko: 'course-data.ko.js' };
const HREFLANG = { zh: 'zh-CN', en: 'en', ko: 'ko' };

function loadParts(name) {
  const ctx = { window: {}, location: { search: '' }, localStorage: { getItem: () => null, setItem() {} } };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(SLIDES, name), 'utf8'), ctx);
  return ctx.window.COURSE.parts.filter((p) => !p.draft);
}

const localized = (file, lang) => (lang === 'zh' ? file : file.replace(/\.html$/, `.${lang}.html`));
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const headCache = new Map();
function head(file) {
  if (!headCache.has(file)) {
    const p = path.join(SLIDES, file);
    const s = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
    headCache.set(file, s === null ? null : s.slice(0, s.indexOf('</head>')));
  }
  return headCache.get(file);
}
const indexable = (file) => {
  const h = head(file);
  return h !== null && !/<meta name="robots" content="[^"]*noindex/.test(h);
};
const metaDesc = (file) => ((head(file) || '').match(/<meta name="description" content="([^"]*)"/) || [])[1];
const lastmod = (file) => (head(file).match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})/) || [])[1];

// ── 收集：base file → { zh: 'x.html', en: 'x.en.html', ... }，保持中文课程顺序 ──
const parts = {};
for (const [lang, name] of Object.entries(LANGS)) parts[lang] = loadParts(name);
const pages = new Map();
for (const lang of Object.keys(LANGS)) {
  for (const part of parts[lang]) {
    for (const t of part.topics || []) {
      for (const l of t.lessons || []) {
        if (!l || !l.file) continue;
        const f = localized(l.file, lang);
        if (!indexable(f)) continue;
        if (!pages.has(l.file)) pages.set(l.file, {});
        pages.get(l.file)[lang] = f;
      }
    }
  }
}

// ── sitemap.xml ──
const out = ['<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  `  <url><loc>${SITE}/</loc></url>`];
let n = 1;
for (const variants of pages.values()) {
  const alts = Object.entries(variants);
  const links = alts.length > 1
    ? alts.map(([lg, f]) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[lg]}" href="${SITE}/slides/${f}"/>`)
      .concat(variants.zh ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/slides/${variants.zh}"/>`] : [])
    : [];
  for (const [, f] of alts) {
    const lm = lastmod(f);
    out.push('  <url>', `    <loc>${SITE}/slides/${f}</loc>`, ...(lm ? [`    <lastmod>${lm}</lastmod>`] : []), ...links, '  </url>');
    n++;
  }
}
out.push('</urlset>', '');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), out.join('\n'));

// ── llms.txt（中文目录为准，注明三语后缀）──
const ours = (part) => part.track === 'aic';
const section = (list) => list.flatMap((part) => [
  `### ${part.num ? part.num + ' · ' : ''}${part.title}`, '',
  ...(part.desc ? [part.desc.replace(/\s+/g, ' '), ''] : []),
  ...(part.topics || []).flatMap((t) => {
    const ls = (t.lessons || []).filter((l) => l && l.file && pages.has(l.file) && pages.get(l.file).zh);
    if (!ls.length) return [];
    const line = (l) => {
      const d = (l.desc || metaDesc(l.file) || '').replace(/\s+/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      return `- [${l.title}](${SITE}/slides/${l.file})${d ? ': ' + d : ''}`;
    };
    return [`#### ${t.title}`, '', ...ls.map(line), ''];
  }),
]);
const llms = [
  '# WaytoAIC 学习站',
  '',
  '> 免费的 AI 学习站（study.waytoaic.com）：从大模型原理、提示词与上下文工程到 AI Agent，外加 AI×跨境电商实战篇章。每节课是一个独立 HTML 页；英文版与韩文版把后缀换成 `.en.html` / `.ko.html`。',
  '',
  '原课内容来自开源项目 [itshen/learn-ai](https://github.com/itshen/learn-ai)（作者洛小山，AGPL-3.0），本站在其基础上二次开发并保持免费；站点源码 https://github.com/WaytoAIC/study 。引用原课内容请保留原作者署名，不得用于付费课程或付费社群。',
  '',
  '## WaytoAIC 原创（AI×跨境电商实战）',
  '',
  ...section(parts.zh.filter(ours)),
  '## 原作·洛小山（AI 从入门到精通）',
  '',
  ...section(parts.zh.filter((p) => !ours(p))),
];
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');

console.log(`build-sitemap: sitemap.xml ${n} 个 URL（${pages.size} 节课），llms.txt 已更新`);
