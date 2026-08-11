# 内容维护 SOP

> 学习站（study.waytoaic.com）的内容生产与维护手册。2026-08-11 定稿。
> 角色分工：AI 出初稿与机制维护；维正过手、给素材、拍板发布。

## 一、四个单一数据源（改内容先认门）

| 管什么 | 唯一改动点 | 说明 |
|---|---|---|
| 目录与轨道 | `slides/course-data.js` | 篇章→主题→知识点；`track:'aic'`=电商轨（缺省=基础轨）；`draft:true`=草稿（访客不可见）；`COURSE_DEFAULT_TRACK`=阅读器默认轨 |
| 知识点关联 | `slides/aic-rel.js` | 只声明正向（先懂/提到/学完可去），反向自动；REL 加条目 + TITLES 补标题 |
| 观点口径 | `docs/内容口径台账.md` | 改口径先改台账，再全站同步出处页 |
| 生命周期 | 页内 `.aic-status` 状态标 | AI 初稿 → 已过手（class 加 `reviewed`）→ 含实战思考 |

另有两本台账：`docs/派生台账.md`（派生页血缘）、`docs/架构速记.md`（系统机制）。

## 二、新增知识点七步

1. **选题定位**：进哪条轨、哪个篇章哪个主题；是全新页还是原课的场景派生页（派生走第三节流程）
2. **对口径**：过一遍口径台账，别和已有观点打架；新口径先登记
3. **写页**：新文件 `slides/aic-<篇章>-<序号>.html`，学-讲-练三段式（模板抄任意现有 aic 页），带 `AI 初稿` 状态标；prompt 演示用 `.aic-prompt` 卡
4. **挂目录**：course-data.js 对应篇章加 lesson 行（新篇章记得 `track`+`draft`）
5. **挂关联**：aic-rel.js 声明 needs/next/terms + TITLES 补标题
6. **预览过手**：`?preview=1` 看效果，维正过手补实战思考、换状态标
7. **发布**：删 `draft:true`（整篇章发布）→ commit + push；撤回=保持 draft 或移除段落

## 三、派生页（场景化重构原课）

**铁律：原课页永不改。** 要做某节原课的电商场景版：

1. 新写 `aic-d-<原名>.html`（优先原创重写：场景/案例/练习全换电商语境，机制深讲留在源页）
2. `docs/派生台账.md` 加行（派生页｜源页｜`git log -1 --format=%H -- slides/<源页>` 的输出｜备注）
3. aic-rel.js 两轨互链（needs 指向源页"通用版"）
4. 挂电商轨目录，走七步的 6-7

## 四、维正素材投递约定

- **prompt/skills 素材**：说明"给哪一节、替换哪张卡"，AI 负责填进 `.aic-prompt` 卡并把 note 里的"示例模板待替换"字样去掉
- **图片素材**：落 `slides/images/`（品牌类进 `images/brand/`），说明用在哪页哪个位置
- **观点修正**：直接说结论，AI 负责改台账+同步全站出处页
- **转化入口素材**（社群二维码/内训表单链接）：给到后替换现有 waytoaic.com 兜底链接

## 五、周期任务

| 周期 | 动作 |
|---|---|
| 季度 | `git fetch upstream && git merge upstream/main`（冲突只会落在架构速记第三节的清单文件上）→ `bash scripts/upstream-diff.sh` 出派生巡检清单 → 按台账口径处置 |
| 月度 | 死链/品牌词/口径冲突巡检（可把改动页+口径台账喂 AI 扫）；`progress`/`profile` 表 dump 备份 |
| 随时 | 发布/撤回草稿篇章；发布首个电商篇章时把 `COURSE_DEFAULT_TRACK` 改为 `'aic'` |

## 六、发布/撤回速查

```bash
# 预览（维正本机）
open "http://localhost:8809/slides/learn.html?preview=1"
# 发布某篇章：course-data.js 删该篇章的 draft: true 行 → commit+push
# 撤回：保持 draft（永不可见）或整段移除（目录消失，文件保留）
```

## 七、发布到火山引擎（2026-08-11 起）

站点托管在火山引擎 Pages（IGA，项目 `study`/5ohsyrm18a，绑定 waytoaic-study 工作区，与账号后端同厂）。每次内容达到"可以了"节点：

```bash
# commit + push 之后，一条命令发布：
bash scripts/deploy-volc.sh
```

- 脚本输出的预览链接带令牌、短时效，适合验收分享，不适合当正式入口
- **正式公开域名（study.waytoaic.com）前置 = ICP 备案**：国内 scope 的自定义域名绑定按规必须备案；备案办妥后在火山控制台绑定域名即为正式入口
- 备案期间若需要免备案的正式入口，走 Cloudflare Pages 连 GitHub 仓（见项目计划 Phase E），备案后切回火山
