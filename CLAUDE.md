# CLAUDE.md — study(学习站 study.waytoaic.com)

只放推不出来的。本仓 fork 自 `itshen/learn-ai`,**公开 AGPL-3.0**:写进来的每一行都是公开的。运维(DNS / 证书 / 备案 / 发布账本 / 自治等级)在私有运维仓 `WaytoAIC/waytoaic-ops`。

## 发布纪律(最重要)
- **`main` = 生产**:push 即火山 IGA Pages 构建上线。禁直推 main(`.claude/settings.json` deny + 分支保护:需 PR + `guard` 必过 + 禁强推删除,管理员同样生效)
- 从 `origin/main` 开分支;因为是 fork,开 PR 要写全:`gh pr create --repo WaytoAIC/study --head WaytoAIC:<branch>`
- 课页发布 = 运维仓 `publish-page` skill(reviewer 只读审 → 合并 → 线上验证 → 预建撤回草稿 PR → 24h 撤回窗);窗口内本仓不再发第二次
- 火山 webhook 偶发 500/502:合并后 5 分钟没上线,开一个空提交 PR 补触发,或控制台重新部署
- 不改页面的仓内配置(CLAUDE.md、`.claude/`)可 PR 自合并;改 `slides/nav-inject.js`、登录墙、付费墙 = L0,先问维正
- 提交标题末尾落款 `@Claude Code`,只 add 自己动过的路径

## 内容:四个单一数据源 + 新增知识点七步
权威在 [`docs/内容维护SOP.md`](docs/内容维护SOP.md),这里不复制。要点:
- 目录与轨道只改 `slides/course-data.js`;知识点关联只改 `slides/aic-rel.js`;观点口径先改 [`docs/内容口径台账.md`](docs/内容口径台账.md);生命周期看页内 `.aic-status` 状态标
- **原课页永不改**。电商场景版另写派生页 `slides/aic-d-<原名>.html`,登记 [`docs/派生台账.md`](docs/派生台账.md)
- 草稿:`draft:true` 的篇章访客不可见,带 `?preview=1` 才看得到;发布 = 删 `draft:true`
- 挂完目录跑 `python3 scripts/seo_heads.py --all && node scripts/build-sitemap.mjs`(页头换本站 + 重出 `sitemap.xml` / `llms.txt`)
- 原创页过手前保持「AI 初稿」状态标;第一人称与对外口径由维正本人写(L0)

## 公开仓红线(提交前自查,CI `guard` 同款)
- 无本机绝对路径:`git grep -nE '/Users/[a-z]+/' -- . ':!.github/*'` 应为空
- 无私钥样字符串与非公开业务数据:规则见 `.github/workflows/check.yml` 的「红线」步骤;Supabase anon key 是设计上公开的,其它任何 key 都不进仓
- 上游原作者不授权课程用于付费社群销售:站内不做「免费课 → 付费社群」阶梯(运维仓 D12)

## 备案号(两处)
- `index.html` 首页底部 + `slides/nav-inject.js` 注入条:ICP `粤ICP备2026120136号-1`、公安 `粤公网安备44030002017077号`;CI 查 `index.html`

## Supabase(学习站账号库,将升格全站账号库)
- 表结构只增不改;改动 SQL 留档在 `supabase/`(如 `supabase/pv_live.sql`)
- `supabase/.temp/` 是 CLI 本地缓存,已 gitignore,不提交

## 上游同步
- 季度跑 `bash scripts/upstream-sync.sh`(口径写在脚本头注释:框架层保留我们的、内容层跟上游、页头由 `seo_heads.py` 重打),停在提交前人工核验;之后 `bash scripts/upstream-diff.sh` 做派生巡检

## 验收与预览
- 纯静态无构建;本地预览 `python3 -m http.server 8809` 后开 `/slides/learn.html?preview=1`
- 分支预览:Cloudflare Pages 冷备项目 `study-7v2` 给每个分支一个预览地址 `<branch>.study-7v2.pages.dev`(分支名里的 `/` 变 `-`)
- 线上改动后在运维仓跑 `bash scripts/check-site.sh` 前后各一次
