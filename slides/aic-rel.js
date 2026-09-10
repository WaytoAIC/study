/* aic-rel.js —— 知识点双向关联网络（数据 + 渲染器，自包含）
 *
 * 设计（2026-08-11 维正需求）：
 *   1) 学了 A 可以干嘛 → next（学完可以去：实战/案例）
 *   2) A 提到了 B，B 在哪 → needs（先懂这些）+ terms（本节提到的概念）
 *   3) 双向 = 只声明正向，反向（"哪些课用到本节"）由渲染器扫全表自动推导——
 *      单点维护：加一条正向声明，两头页面同时生效。
 *
 * 维护：只改本文件 AIC_REL 段。file 必须是 slides/ 下真实存在的页面。
 * 挂载：nav-inject.js 动态加载本文件，全部内容页（含原课 231 页被引用时）自动生效。
 */
(function () {
  'use strict';

  var REL = {
    /* ── 电商视角卡（三期）：biz = {scene 这节对卖家意味着什么, example 你什么时候会用到, skip 哪些可以跳过} ── */
    'zero-0.html': {
      biz: { scene: '卖家每天做的事里，至少一半是"人学软件"的活：填表、抠图、写文案、翻评论。这节告诉你这些活正在反过来"听人话"。',
             example: '下次让 AI 帮你把一段差评归类、把英文评论翻成中文要点、给主图写 5 版标题——这就是六个现场里的三个。',
             skip: '演示里的编程类现场（写小工具）可以先跳过，不影响后面的课。' } },
    'zero-q-prompt.html': {
      biz: { scene: '提示词写得好不好，直接决定 Listing 文案、客服回复、选品分析的产出能不能一次可用。',
             example: '写 Listing 五点、回差评邮件、让 AI 拆解竞品评论时——先用"五要素"把背景交代清楚，再让它动手。',
             skip: '关于模型内部机制的解释段落可以略读，记住"交代清楚比重抽十次有用"就够。' } },
    'learn-1.html': {
      biz: { scene: '把 AI 当老师用，是卖家学新平台、新广告工具、新类目规则最快的方式。',
             example: '开一个 Walmart 新店、第一次投 TikTok 广告、研究一个陌生类目的合规要求——先让 AI 给你出学习大纲再逐项追问。',
             skip: '本节对学生/职场通用场景的例子可以快速扫过，替换成你自己的平台和类目。' } },
    'aic-d-5-1.html': {
      needs: [{ file: '5-1.html', why: '通用版：上下文窗口的机制详解（本页为电商场景版）' }],
      next: [{ file: 'aic-team-2.html', why: '结论落背景包的完整做法' }],
      terms: [{ t: '上下文溢出的三种处理策略', file: '5-2.html' }],
      biz: { scene: '同一个对话聊太久 AI 就忘事，是运营在用 AI 做选品复盘、写周报时最常踩的坑。',
             example: '选品讨论、Listing 优化、广告复盘分开开对话；重要结论落进你的背景包，下次冷启动直接贴。',
             skip: '无需理解模型的技术细节，会"一事一对话 + 结论搬家"就够用。' } },
    '1-2-hallucination.html': {
      biz: { scene: 'AI 一本正经编数据，在选品（编月销）、合规（编条款）、报表（编费率）三个场景最危险。',
             example: '让 AI 给出任何具体数字、平台规则条款、竞品数据时——一律去官方来源核一遍，再写进你的决策表。',
             skip: '演示的技术原理部分可跳过，记住"高发区=数字/出处/私有信息"。' } },

    /* ── 实战一 · Listing 与主图 ── */
    'aic-listing-1.html': {
      next: [
        { file: 'aic-listing-2.html', why: '把 3 条假设做成 5 版图' },
        { file: 'aic-listing-3.html', why: '上架实验验证假设' },
      ],
      terms: [{ t: '可证伪的假设', file: 'aic-listing-3.html' }],
    },
    'aic-listing-2.html': {
      needs: [
        { file: 'aic-listing-1.html', why: '先有改图假设，再谈出图' },
        { file: 'zero-q-prompt.html', why: '给 AI 写"图纸"= 写好提示词' },
      ],
      next: [{ file: 'aic-listing-3.html', why: '5 版图交给数据裁决' }],
    },
    'aic-listing-3.html': {
      needs: [{ file: 'aic-listing-1.html', why: '实验验证的就是这节写的假设' }],
      next: [{ file: 'aic-listing-5.html', why: '实验跑完沉淀成 SOP' }],
      terms: [{ t: '数据幻觉与自欺', file: 'aic-select-2.html' }],
    },
    'aic-listing-4.html': {
      needs: [{ file: 'zero-q-prompt.html', why: '写给算法的部分=关键词思维' }],
      next: [{ file: 'aic-listing-3.html', why: '文案改动同样要上架实验' }],
    },
    'aic-listing-5.html': {
      needs: [{ file: 'aic-listing-3.html', why: 'SOP 沉淀的是这轮实验' }],
      next: [{ file: 'aic-team-4.html', why: '把 SOP 里的重复步骤交给 AI' }],
    },

    /* ── 实战二 · 选品 ── */
    'aic-select-1.html': {
      next: [
        { file: 'aic-select-2.html', why: '第一问"需求真不真"展开' },
        { file: 'aic-select-3.html', why: '第二问"打不打得过"展开' },
        { file: 'aic-select-4.html', why: '第三问"赚不赚钱"展开' },
      ],
    },
    'aic-select-2.html': {
      needs: [{ file: 'aic-select-1.html', why: '三问框架的第一问' }],
      terms: [{ t: 'AI 也会编数据（幻觉）', file: '1-2-hallucination.html' }],
    },
    'aic-select-3.html': {
      needs: [{ file: 'aic-select-1.html', why: '三问框架的第二问' }],
      terms: [{ t: '让 AI 独立体检=交代清楚背景', file: 'aic-team-1.html' }],
    },
    'aic-select-4.html': {
      needs: [{ file: 'aic-select-1.html', why: '三问框架的第三问' }],
      next: [{ file: 'aic-select-5.html', why: '四刀账进流水线第④步' }],
    },
    'aic-select-5.html': {
      needs: [
        { file: 'aic-select-2.html', why: '流水线第③步的验真方法' },
        { file: 'aic-select-3.html', why: '流水线第③步的首页体检' },
        { file: 'aic-select-4.html', why: '流水线第④步的四刀账' },
      ],
      next: [{ file: 'aic-team-3.html', why: '第⑤步"AI 抬杠"背后的验证思维' }],
      terms: [{ t: '上下文/背景包', file: 'aic-team-2.html' }],
    },

    /* ── 实战三 · 团队 AI 上岗 ── */
    'aic-team-1.html': {
      needs: [{ file: 'zero-q-prompt.html', why: '五要素=提示词写法的岗位版' }],
      next: [
        { file: 'aic-team-2.html', why: '把背景固化成背景包' },
        { file: 'aic-listing-2.html', why: '实战应用：给 AI 写出图"图纸"' },
      ],
      terms: [{ t: '上下文窗口', file: '5-1.html' }],
    },
    'aic-team-2.html': {
      needs: [{ file: 'aic-team-1.html', why: '先会交代，再谈固化背景' }],
      next: [{ file: 'aic-select-5.html', why: '实战应用：选品流水线的第①步立标准' }],
      terms: [{ t: '上下文溢出（背景包别贴成小说）', file: '5-2.html' }],
    },
    'aic-team-3.html': {
      needs: [{ file: '1-2-hallucination.html', why: '先看幻觉现场演示，再学验证' }],
      next: [{ file: 'aic-select-2.html', why: '实战应用：选品数据的验真' }],
      terms: [{ t: '缓解幻觉的 Prompt 手段', file: '1-2-mitigation-prompt.html' }],
    },
    'aic-team-4.html': {
      needs: [
        { file: 'aic-team-1.html', why: '交接模板=固定化的任务交代' },
        { file: 'aic-team-3.html', why: '兜底核验用这节的三招' },
      ],
      next: [{ file: 'aic-listing-5.html', why: '实战应用：图文实验 SOP 交给 AI 跑' }],
    },
  };

  /* ── 标题表：链接显示用。原课页从 COURSE_FLAT 取不到（内容页不加载 course-data），手工登记被引用者 ── */
  var TITLES = {
    'aic-listing-1.html': '主图决定第一次点击', 'aic-listing-2.html': 'AI 出图：一次 5 版主图',
    'aic-listing-3.html': '上架实验：让数据判对错', 'aic-listing-4.html': '标题与五点：写给两个读者',
    'aic-listing-5.html': '把实验变成 SOP',
    'aic-select-1.html': '能做 ≠ 值得做', 'aic-select-2.html': '需求验真：榜单会骗人',
    'aic-select-3.html': '竞争强弱一眼判', 'aic-select-4.html': '财务底线：一单赚不赚钱',
    'aic-select-5.html': 'AI 上岗：60 分钟选品流水线',
    'aic-team-1.html': 'AI 是同事，不是搜索框', 'aic-team-2.html': '喂料与边界',
    'aic-team-3.html': '验证 AI 的活', 'aic-team-4.html': '一人一流水线',
    'zero-q-prompt.html': '提示词到底怎么写才好？', '1-2-hallucination.html': '大模型幻觉演示',
    '1-2-mitigation-prompt.html': '应对幻觉：Prompt Engineering', '5-1.html': '上下文窗口：AI 的工作记忆', 'aic-d-5-1.html': '上下文窗口：为什么 AI 记不住你的店铺（电商场景版）',
    '5-2.html': '上下文溢出：三种处理策略',
  };

  var CUR = location.pathname.split('/').pop().split('?')[0];
  if (CUR && !/\.[a-z0-9]+$/i.test(CUR)) CUR += '.html'; // 托管美化 URL 补回扩展名

  /* 反向推导：谁的 needs/next/terms 指向本页 */
  function backlinks() {
    var out = [];
    Object.keys(REL).forEach(function (src) {
      if (src === CUR) return;
      var r = REL[src];
      var hit = null;
      (r.needs || []).forEach(function (x) { if (x.file === CUR) hit = x.why; });
      (r.next || []).forEach(function (x) { if (x.file === CUR) hit = x.why; });
      (r.terms || []).forEach(function (x) { if (x.file === CUR) hit = x.t; });
      if (hit) out.push({ file: src, why: hit });
    });
    return out;
  }

  function lessonUrl(file) { return 'learn.html#' + encodeURIComponent(file); }
  function titleOf(file) { return TITLES[file] || file; }

  function render() {
    var rel = REL[CUR] || {};
    var back = backlinks();
    var groups = [];
    if (rel.needs && rel.needs.length) groups.push(['🧩 先懂这些', rel.needs.map(function (x) { return { f: x.file, d: x.why }; })]);
    if (rel.terms && rel.terms.length) groups.push(['📖 本节提到的概念', rel.terms.map(function (x) { return { f: x.file, d: x.t }; })]);
    if (rel.next && rel.next.length) groups.push(['🚀 学完可以去', rel.next.map(function (x) { return { f: x.file, d: x.why }; })]);
    if (back.length) groups.push(['🔗 哪些课用到本节', back.map(function (x) { return { f: x.file, d: x.why }; })]);
    if (!groups.length) return;

    var st = document.createElement('style');
    st.textContent =
      '.aic-rel{max-width:var(--content-w,880px);margin:8px auto 40px;padding:0 28px;}' +
      '.aic-rel-card{background:var(--card,#fff);border:1.5px solid var(--border,rgba(0,0,0,.07));border-radius:14px;padding:20px 24px;}' +
      '.aic-rel-h{font-size:13px;font-weight:800;letter-spacing:1px;color:var(--sub,#6b7280);margin-bottom:12px;}' +
      '.aic-rel-g{margin:12px 0 0;}' +
      '.aic-rel-g h5{font-size:13px;font-weight:800;color:var(--text,#1c1c1e);margin:0 0 6px;}' +
      '.aic-rel-g a{display:block;font-size:13.5px;line-height:1.7;color:var(--accent,#0066ff);text-decoration:none;margin:3px 0;}' +
      '.aic-rel-g a:hover{text-decoration:underline;}' +
      '.aic-rel-g a .d{color:var(--sub,#6b7280);}';
    document.head.appendChild(st);

    var box = document.createElement('div');
    box.className = 'aic-rel';
    var html = '<div class="aic-rel-card"><div class="aic-rel-h">知识点关联</div>';
    groups.forEach(function (g) {
      html += '<div class="aic-rel-g"><h5>' + g[0] + '</h5>';
      g[1].forEach(function (it) {
        html += '<a href="' + lessonUrl(it.f) + '" target="_top">' + titleOf(it.f) + ' <span class="d">— ' + it.d + '</span></a>';
      });
      html += '</div>';
    });
    html += '</div>';
    box.innerHTML = html;

    var main = document.querySelector('main.lesson') || document.body;
    main.parentNode.insertBefore(box, main.nextSibling);
  }

  /* ── 电商视角卡：三问定型，插在课页标题区之后（阅读器内与独立打开都渲染） ── */
  function renderBiz() {
    var rel = REL[CUR]; if (!rel || !rel.biz) return;
    var b = rel.biz;
    var lang = (window.XUEAI_I18N && window.XUEAI_I18N.lang) || 'zh';
    var T = ({ zh: ['跨境卖家这样用', '这节对卖家意味着什么', '你什么时候会用到', '哪些可以跳过'],
               en: ['For cross-border sellers', 'What it means for sellers', 'When you will use it', 'What you can skip'],
               ko: ['크로스보더 셀러를 위해', '셀러에게 의미하는 것', '언제 쓰게 되나', '건너뛰어도 되는 부분'] })[lang] || ['跨境卖家这样用', '这节对卖家意味着什么', '你什么时候会用到', '哪些可以跳过'];
    var st = document.createElement('style');
    st.textContent = '.aic-biz{margin:18px 0 8px;border:1.5px solid rgba(22,163,74,.3);border-left:5px solid #16a34a;border-radius:12px;background:rgba(22,163,74,.05);padding:16px 20px;}' +
      '.aic-biz-h{font-size:12px;font-weight:800;letter-spacing:1px;color:#15803d;margin-bottom:10px;}' +
      '.aic-biz-row{display:flex;gap:10px;font-size:14px;line-height:1.75;margin:6px 0;}' +
      '.aic-biz-k{flex:none;width:126px;font-size:12px;font-weight:800;color:#15803d;padding-top:3px;}' +
      '.aic-biz-v{color:var(--text,#1c1c1e);}' +
      '@media(max-width:600px){.aic-biz-row{flex-direction:column;gap:2px;}}';
    document.head.appendChild(st);
    var box = document.createElement('div'); box.className = 'aic-biz';
    box.innerHTML = '<div class="aic-biz-h">🧭 ' + T[0] + '</div>' +
      '<div class="aic-biz-row"><div class="aic-biz-k">' + T[1] + '</div><div class="aic-biz-v">' + b.scene + '</div></div>' +
      '<div class="aic-biz-row"><div class="aic-biz-k">' + T[2] + '</div><div class="aic-biz-v">' + b.example + '</div></div>' +
      (b.skip ? '<div class="aic-biz-row"><div class="aic-biz-k">' + T[3] + '</div><div class="aic-biz-v">' + b.skip + '</div></div>' : '');
    var head = document.querySelector('main.lesson > header, article.lesson > header, .lesson-header');
    if (head && head.parentNode) head.parentNode.insertBefore(box, head.nextSibling);
    else { var m = document.querySelector('main.lesson, article.lesson, .slide-container') || document.body; m.insertBefore(box, m.firstChild); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { renderBiz(); render(); });
  else { renderBiz(); render(); }
})();
