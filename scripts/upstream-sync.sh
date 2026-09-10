#!/usr/bin/env bash
# upstream-sync.sh —— 季度同步上游 itshen/learn-ai 的标准流程（2026-09-10 首跑口径固化）
#
# 口径（维正 2026-08-11 / 09-10 拍板）：
#   · 框架层永不跟上游：壳/登录/付费墙/导航注入/多语言/门户/证书 = 保留我们的版本
#   · 内容层全跟：新增课件、配图、英韩译文照单全收；考试页取上游后重打"解锁+换牌"补丁
#   · 课程数据取上游，再嫁接我们的三块：品牌 meta、电商实战篇章、默认轨+草稿开关
#   · 不要：繁中台港版(.tw/.hk)、爸妈版(elder-*)、上游新增的英韩证书页、playground
# 脚本停在"合并已解决、补丁已打、未提交"状态，人工按 docs/内容维护SOP.md 验证后再 commit+push。
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
[ -z "$(git status --short)" ] || { echo "工作区不干净，先处理"; exit 1; }

git fetch upstream
git show HEAD:slides/course-data.js > /tmp/ours-course-data.js
git merge upstream/main --no-commit --no-ff || true

OURS="README.md index.html slides/index.html slides/ask-alice.js slides/auth.js slides/i18n.js slides/nav-inject.js slides/paywall.js slides/track.js slides/watermark.js slides/lesson.js slides/certificate.html slides/home.html slides/home.en.html slides/home.ko.html slides/locked.html slides/locked.en.html slides/locked.ko.html slides/learn.html slides/learn.en.html slides/learn.ko.html"
for f in $OURS; do git ls-files --error-unmatch "$f" >/dev/null 2>&1 && git checkout HEAD -- "$f" && git add "$f"; done
THEIRS=$(git diff --name-only --diff-filter=U | grep -E '^slides/(exam-|course-data)' || true)
[ -n "$THEIRS" ] && { echo "$THEIRS" | xargs git checkout --theirs -- ; echo "$THEIRS" | xargs git add -- ; }
[ -z "$(git diff --name-only --diff-filter=U)" ] || { echo "仍有未处理冲突："; git diff --name-only --diff-filter=U; exit 1; }

# 剔除不要的上游文件
git ls-files --cached -- 'slides/*.tw.html' 'slides/*.hk.html' 'slides/*.tw.js' 'slides/*.hk.js' 'slides/elder*' \
  'slides/certificate.en.html' 'slides/certificate.ko.html' 'slides/playground/*' 'slides/redesign-preview.html' > /tmp/exclude.txt || true
[ -s /tmp/exclude.txt ] && { xargs git rm -q --cached -- < /tmp/exclude.txt; xargs rm -f -- < /tmp/exclude.txt; }

python3 - << 'PY'
import re, glob, os
def rd(p): return open(p, encoding='utf-8').read()
def wr(p, s): open(p, 'w', encoding='utf-8').write(s)
ours = rd('/tmp/ours-course-data.js'); up = rd('slides/course-data.js')
def brand(s, b):
    for k, v in [('brand', b), ('author', 'WaytoAIC'), ('authorUrl', 'https://www.waytoaic.com'), ('github', 'https://github.com/WaytoAIC/study')]:
        s, n = re.subn(r"(\n\s+%s:\s*')[^']*(')" % k, r"\g<1>%s\g<2>" % v, s, count=1); assert n == 1, k
    return s
up = brand(up, 'WaytoAIC · AI 电商之路')
i = ours.find("id: 'p-aic-listing'"); st = ours.rfind('    {\n', 0, i); en = ours.find('\n  ],\n', st)
up = up.replace('\n  ],\n};', '\n' + ours[st:en+1].rstrip('\n') + '\n  ],\n};', 1)
ts = ours.find('\n/* 默认轨道'); te = ours.find('\n/* ── 工具：扁平化')
up = up.replace('\n/* ── 工具：扁平化', ours[ts:te] + '\n/* ── 工具：扁平化', 1)
wr('slides/course-data.js', up)
for p, b in [('slides/course-data.en.js', 'WaytoAIC · AI Commerce'), ('slides/course-data.ko.js', 'WaytoAIC · AI 커머스')]: wr(p, brand(rd(p), b))
for p in glob.glob('slides/exam-*.html'):
    s = rd(p)
    s = re.sub(r"<script>try\{if\(localStorage\.getItem\('xa_auth'\)!=='1'\)[^<]*</script>", '<!-- WaytoAIC: 考试页开放，不加锁 -->', s)
    s = s.replace('content="洛小山"', 'content="WaytoAIC"')
    s = re.sub(r'\| (xueai\.miyang\.cn|xueai\.app)</title>', '| WaytoAIC</title>', s)
    s = re.sub(r'https://(xueai\.miyang\.cn|xueai\.app)/slides/', 'https://study.waytoaic.com/slides/', s)
    s = re.sub(r'(<meta property="og:site_name" content=")[^"]*(")', r'\1WaytoAIC 学习站\2', s)
    s = re.sub(r'\n<link rel="alternate" hreflang="zh-(TW|HK|MO)"[^>]*>', '', s)
    wr(p, s)
# 页面顺序表：取上游 SLIDE_ORDER，剔除不存在/被剔除的条目
import subprocess
upnav = subprocess.run(['git', 'show', 'upstream/main:slides/nav-inject.js'], capture_output=True, text=True).stdout
m = re.search(r'const SLIDE_ORDER = \[\n[\s\S]*?\n\];', upnav)
ent = re.findall(r"\{\s*file:\s*'([^']+)',\s*title:\s*'([^']*)'", m.group(0))
kept = [(f, t) for f, t in ent if not re.search(r'^elder|\.(tw|hk)\.', f) and os.path.exists('slides/' + f)]
block = 'const SLIDE_ORDER = [\n' + ''.join("  { file: '%s', title: '%s', num: 0 },\n" % (f, t.replace("'", "\\'")) for f, t in kept) + '];'
nav = rd('slides/nav-inject.js'); m2 = re.search(r'const SLIDE_ORDER = \[\n[\s\S]*?\n\];', nav)
wr('slides/nav-inject.js', nav[:m2.start()] + block + nav[m2.end():])
# 上游依赖其后端的新脚本：缺什么就补空壳（与 ask-alice 同口径）
refs = set()
for p in glob.glob('slides/*.html'):
    refs.update(re.findall(r'src="([a-zA-Z0-9_.-]+\.js)(?:\?[^"]*)?"', rd(p)))
for r in sorted(refs):
    if not os.path.exists('slides/' + r):
        wr('slides/' + r, "/* %s — WaytoAIC 版：已停用（上游后端耦合脚本占位壳）。原实现见 upstream。 */\n(function () { 'use strict'; })();\n" % r); print('补占位壳:', r)
missing = [f for f in set(re.findall(r"file: '([^']+)'", up)) if not os.path.exists('slides/' + f)]
print('课程数据引用缺失页:', missing)
PY
UPTIP=$(git rev-parse --short upstream/main); sed -i "" -E "s/上次同步上游: [0-9a-f]+/上次同步上游: $UPTIP/" docs/派生台账.md
git add -A slides/ docs/ scripts/ 2>/dev/null || true
for f in slides/course-data.js slides/course-data.en.js slides/course-data.ko.js slides/nav-inject.js slides/auth.js; do node --check "$f"; done
echo "合并已就绪（未提交）。接下来：本地起服务验证阅读器/登录墙/双轨 → git commit → git push → bash scripts/upstream-diff.sh"
