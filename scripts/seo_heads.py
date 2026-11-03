#!/usr/bin/env python3
"""seo_heads.py —— 学习站页头元数据的机械补丁（框架层，内容不动）。

口径（docs/13 §2.2，维正 2026-11-03 批准）：
  · 只改 slides/*.html 的 <head>（第一个 </head> 之前），正文一字不碰
  · rebrand：标题后缀、canonical / og:url / hreflang / og:image 换成本站域名；删 zh-TW/HK/MO
    三条 hreflang（我们不发繁中页）；og:site_name 换三语站名；JSON-LD 的 publisher 换成
    WaytoAIC 学习站；author 与 <meta name="author"> 保留洛小山（上游署名要求）
  · 锁定声明：JSON-LD isAccessibleForFree 按访客在这个 URL 上实际看到的为准——
      nav-inject.js 的独立页闸（与 auth.js buildFreeSet() 同算法：prologue/freeAll 整章免费、
      其余每章前 2 节免费，取中文 course-data.js，三语同口径）锁住时隐藏 main.lesson /
      article.lesson / .slide-container；paywall.js 对带 .paywall-locked 的页截断正文。
      被藏的部分写进 hasPart.cssSelector，没藏东西就标 true 并去掉 hasPart（防 cloaking 判定）
  · complete：没有 canonical、又不是 noindex/跳转页的课节页（目前是 22 节 aic 原创页），
    补 description / canonical / og / JSON-LD（Article + LearningResource，author WaytoAIC）
  · 幂等：跑第二遍零改动

用法：
  python3 scripts/seo_heads.py --all          # 全量（upstream-sync.sh 调这个）
  python3 scripts/seo_heads.py slides/x.html  # 指定文件
  python3 scripts/seo_heads.py --all --check  # 只报告会改哪些，不写盘；有改动则退出码 1
"""
import argparse
import glob
import html
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLIDES = os.path.join(ROOT, 'slides')
SITE = 'https://study.waytoaic.com'
UP = r'https://(?:xueai\.miyang\.cn|xueai\.app)'
OG_DEFAULT = 'https://www.waytoaic.com/images/og-default.png'
SITE_NAME = {'zh': 'WaytoAIC 学习站', 'en': 'WaytoAIC Study', 'ko': 'WaytoAIC 학습'}
IN_LANG = {'zh': 'zh-CN', 'en': 'en', 'ko': 'ko'}
OG_LOCALE = {'zh': 'zh_CN', 'en': 'en_US', 'ko': 'ko_KR'}
PUBLISHER = {'@type': 'Organization', 'name': 'WaytoAIC 学习站', 'url': SITE}
AUTHOR_OURS = {'@type': 'Organization', 'name': 'WaytoAIC', 'url': 'https://www.waytoaic.com'}


def dumps(o):
    return json.dumps(o, ensure_ascii=False, separators=(',', ':'))


def esc(s):
    return html.escape(s or '', quote=True)


# ── 课程数据：用 Node vm 执行 course-data*.js 拿 window.COURSE ──
NODE_LOAD = r'''
const vm = require('vm'), fs = require('fs');
const preview = process.argv[2] === '1';
const ctx = { window: {}, location: { search: '' },
  localStorage: { getItem: () => (preview ? '1' : null), setItem() {} } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[1], 'utf8'), ctx);
process.stdout.write(JSON.stringify(ctx.window.COURSE.parts));
'''


def load_parts(name, preview):
    out = subprocess.run(['node', '-e', NODE_LOAD, os.path.join(SLIDES, name), '1' if preview else '0'],
                         capture_output=True, text=True, check=True).stdout
    return json.loads(out)


class Course:
    def __init__(self):
        # 免费集：访客视角（草稿篇章已被过滤），与 buildFreeSet() 一致
        self.free, self.known = set(), set()
        for part in load_parts('course-data.js', False):
            files = [l['file'] for t in part.get('topics') or [] for l in t.get('lessons') or [] if l and l.get('file')]
            free_all = bool(part.get('prologue') or part.get('freeAll'))
            for i, f in enumerate(files):
                self.known.add(f)
                if free_all or i < 2:
                    self.free.add(f)
        # 课节信息：含草稿篇章（补页头不看发布状态），三语各一份
        self.lessons = {}
        for lang, name in [('zh', 'course-data.js'), ('en', 'course-data.en.js'), ('ko', 'course-data.ko.js')]:
            if not os.path.exists(os.path.join(SLIDES, name)):
                continue
            for part in load_parts(name, True):
                for t in part.get('topics') or []:
                    for l in t.get('lessons') or []:
                        if l and l.get('file'):
                            self.lessons.setdefault((lang, l['file']), dict(l, topicTitle=t.get('title', '')))

    def gated(self, base):
        return base in self.known and base not in self.free


def lang_of(fname):
    m = re.search(r'\.(en|ko)\.html$', fname)
    return m.group(1) if m else 'zh'


def base_of(fname):
    return re.sub(r'\.(en|ko)\.html$', '.html', fname)


def has_class(s, cls, tag=None):
    t = tag or r'\w+'
    return re.search(r'<%s\b[^>]*\bclass="[^"]*\b%s\b' % (t, re.escape(cls)), s) is not None


def hidden_selectors(fname, page, course):
    """访客直开这个 URL 时被藏起来的正文选择器；空列表 = 全文可见。"""
    sel = []
    if 'nav-inject.js' in page and course.gated(base_of(fname)):
        for s, cls, tag in [('main.lesson', 'lesson', 'main'), ('article.lesson', 'lesson', 'article'),
                            ('.slide-container', 'slide-container', None)]:
            if has_class(page, cls, tag):
                sel.append(s)
    if 'paywall.js' in page and has_class(page, 'paywall-locked'):
        sel.append('.paywall-locked')
    return sel


# ── rebrand ──
def fix_title(head, fname, lang):
    name = SITE_NAME[lang]
    head = re.sub(r'(\|\s*)xueai\.(?:miyang\.cn|app)(\s*</title>)', lambda m: m.group(1) + name + m.group(2), head)
    head = re.sub(r'(<meta (?:property|name)="(?:og|twitter):title" content="[^"]*?\|\s*)xueai\.(?:miyang\.cn|app)(\s*")',
                  lambda m: m.group(1) + name + m.group(2), head)
    if fname.startswith('exam-'):  # 旧同步脚本给考试页打的是「| WaytoAIC」，并入同一口径
        head = re.sub(r'(\|\s*)WaytoAIC(\s*</title>)', lambda m: m.group(1) + name + m.group(2), head)
    return head


def fix_og_image(head):
    def og(m):
        local = os.path.join(SLIDES, m.group(2))
        return m.group(1) + (SITE + '/slides/' + m.group(2) if os.path.exists(local) else OG_DEFAULT)
    head = re.sub(r'(<meta (?:property|name)="(?:og:image|twitter:image)" content=")' + UP + r'/slides/([^"?#]+)', og, head)
    head = re.sub(r'(<meta (?:property|name)="(?:og:image|twitter:image)" content=")' + UP + r'/[^"]*', r'\g<1>' + OG_DEFAULT, head)
    return head


def fix_ld(block, sel):
    s = re.sub(r'"publisher"\s*:\s*\{[^{}]*\}', '"publisher":' + dumps(PUBLISHER), block)
    s = re.sub(r'"(url|@id)"\s*:\s*"' + UP + r'/?"', lambda m: '"%s":"%s"' % (m.group(1), SITE), s)
    if re.search(r'"isAccessibleForFree"', s):
        s = re.sub(r',?\s*"hasPart"\s*:\s*\{[^{}]*"isAccessibleForFree"[^{}]*\}', '', s)
        part = ''
        if sel:
            part = ',"hasPart":' + dumps({'@type': 'WebPageElement', 'isAccessibleForFree': False,
                                          'cssSelector': ', '.join(sel)})
        s = re.sub(r'"isAccessibleForFree"\s*:\s*(?:true|false)',
                   lambda m: '"isAccessibleForFree":' + ('false' if sel else 'true') + part, s, count=1)
    json.loads(s)  # 改坏了就当场炸，不写盘
    return s


def rebrand(head, fname, page, course):
    lang = lang_of(fname)
    head = fix_title(head, fname, lang)
    head = re.sub(r'(?m)^[ \t]*<link\b[^>]*hreflang="zh-(?:TW|HK|MO)"[^>]*>[ \t]*\n', '', head)
    head = re.sub(r'<link\b[^>]*hreflang="zh-(?:TW|HK|MO)"[^>]*>', '', head)
    head = fix_og_image(head)
    head = re.sub(UP + r'/slides/', SITE + '/slides/', head)
    head = re.sub(r'(<meta property="og:site_name" content=")[^"]*(")', r'\g<1>' + SITE_NAME[lang] + r'\2', head)
    sel = hidden_selectors(fname, page, course)
    return re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)',
                  lambda m: m.group(1) + fix_ld(m.group(2), sel) + m.group(3), head, flags=re.S)


# ── complete ──
def first_commit_date(path):
    out = subprocess.run(['git', 'log', '--diff-filter=A', '--follow', '--format=%cs', '--', path],
                         cwd=ROOT, capture_output=True, text=True).stdout.split()
    return out[-1] if out else None


def needs_complete(head):
    return ('rel="canonical"' not in head
            and not re.search(r'<meta name="robots" content="[^"]*noindex', head)
            and 'http-equiv="refresh"' not in head)


def page_subtitle(page):
    m = re.search(r'<p class="subtitle">(.*?)</p>', page, re.S)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))).strip() if m else ''


def complete(head, fname, page, course):
    lang, base = lang_of(fname), base_of(fname)
    L = course.lessons.get((lang, base)) or course.lessons.get(('zh', base))
    if not L:
        return head
    url = SITE + '/slides/' + fname
    reader = 'learn.html' if lang == 'zh' else 'learn.%s.html' % lang
    title = L.get('title', '')
    desc = L.get('desc') or page_subtitle(page)  # aic 课节在 course-data 里没写 desc，取页内副标题（只读）
    ld = {'@context': 'https://schema.org', '@type': ['Article', 'LearningResource'],
          'headline': title, 'name': title, 'url': url, 'inLanguage': IN_LANG[lang],
          'author': AUTHOR_OURS, 'publisher': PUBLISHER, 'learningResourceType': '课程',
          'isPartOf': {'@type': 'Course', 'name': SITE_NAME[lang] + ' · ' + L['topicTitle'], 'url': SITE + '/slides/' + reader},
          'isAccessibleForFree': True, 'description': desc}
    d = first_commit_date(os.path.join('slides', fname))
    if d:
        ld['datePublished'] = d
    lines = ['<!-- SEO Start (WaytoAIC) -->']
    if '<meta name="description"' not in head:
        lines.append('<meta name="description" content="%s">' % esc(desc))
    lines += ['<link rel="canonical" href="%s">' % url,
              '<meta property="og:type" content="article">',
              '<meta property="og:site_name" content="%s">' % SITE_NAME[lang],
              '<meta property="og:title" content="%s">' % esc(title),
              '<meta property="og:description" content="%s">' % esc(desc),
              '<meta property="og:url" content="%s">' % url,
              '<meta property="og:image" content="%s">' % OG_DEFAULT,
              '<meta property="og:locale" content="%s">' % OG_LOCALE[lang],
              '<!-- SEO End -->',
              '<!--seo:begin--><script type="application/ld+json">%s</script><!--seo:end-->' % dumps(ld)]
    return head.rstrip('\n') + '\n' + '\n'.join(lines) + '\n'


def process(path, course):
    fname = os.path.basename(path)
    with open(path, encoding='utf-8') as f:
        page = f.read()
    i = page.find('</head>')
    if i < 0:
        return page, page
    head = page[:i]
    if needs_complete(head):
        head = complete(head, fname, page, course)
    head = rebrand(head, fname, page, course)
    return page, head + page[i:]


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('files', nargs='*')
    ap.add_argument('--all', action='store_true', help='处理 slides/*.html 全部页面')
    ap.add_argument('--check', action='store_true', help='只报告，不写盘；有改动退出码 1')
    a = ap.parse_args()
    files = sorted(glob.glob(os.path.join(SLIDES, '*.html'))) if a.all else a.files
    if not files:
        ap.error('给文件或 --all')
    course = Course()
    changed, left = [], []
    for p in files:
        old, new = process(p, course)
        if new != old:
            changed.append(os.path.basename(p))
            if not a.check:
                with open(p, 'w', encoding='utf-8') as f:
                    f.write(new)
        if re.search(r'xueai\.(?:miyang\.cn|app)', new[:new.find('</head>')]):
            left.append(os.path.basename(p))
    print('seo_heads: %d 页%s改动 / 共 %d 页' % (len(changed), '将' if a.check else '已', len(files)))
    if left:
        print('  页头仍含上游域名（多为保留的作者主页等，核一下）：%d 页，如 %s' % (len(left), ' '.join(left[:5])))
    sys.exit(1 if a.check and changed else 0)


if __name__ == '__main__':
    main()
