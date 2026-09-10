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
| 季度 | `bash scripts/upstream-sync.sh`（合并上游：框架文件保留我们的、考试页与课程数据取上游再重打补丁、剔除繁中/爸妈版，停在提交前供人工核验；首跑 2026-09-10，口径见脚本头注释）→ 本地验证 → commit+push → `bash scripts/upstream-diff.sh` 派生巡检 → 按台账处置 |
| 月度 | 死链/品牌词/口径冲突巡检（可把改动页+口径台账喂 AI 扫）；`progress`/`profile` 表 dump 备份 |
| 随时 | 发布/撤回草稿篇章；发布首个电商篇章时把 `COURSE_DEFAULT_TRACK` 改为 `'aic'` |

## 六、发布/撤回速查

```bash
# 预览（维正本机）
open "http://localhost:8809/slides/learn.html?preview=1"
# 发布某篇章：course-data.js 删该篇章的 draft: true 行 → commit+push
# 撤回：保持 draft（永不可见）或整段移除（目录消失，文件保留）
```

## 八、优先级分层与电商视角卡（三期 2026-09-10）

- **档位**：必学 / 建议 / 选修，默认由上游路线标签算出（`course-data.js` 嫁接区 `priorityOf`），人工覆盖表 `COURSE_PRIORITY_OVERRIDE` 按篇章/主题/课节三级优先；季度同步时嫁接区整段重打，覆盖表不丢
- **呈现**：目录结构不动；选修篇章默认在原位折叠（点篇章头展开）；侧栏"只看必学"开关；进度条主口径=必学（全站进度在悬停提示），结课/证书仍按全站
- **电商视角卡**：`slides/aic-rel.js` 里给课节加 `biz: {scene, example, skip}`，页面自动在标题下渲染"跨境卖家这样用"三问卡；写法按口径台账"写给卖家"规范；`scripts/upstream-diff.sh` 会报带卡源页的上游变更
- **改造分支流程**：三期在分支 `v3`（worktree `~/dev/study-v3`，预览 :8810）进行，线上只跟 `main`；上游同步照旧在 `main` 做完后 `git merge main` 进 `v3`；维正验收后由其确认合回 `main` 一次上线

## 七、发布（2026-08-21 起：push 即发布）

站点托管在火山引擎 IGA Pages，项目 `study-site`/`b9r1vxappv`，**已关联 GitHub 仓 `WaytoAIC/study` 自动部署**，绑定 waytoaic-study Supabase（8 个环境变量自动注入）。

```bash
# 就这一步，没有别的
git push
```

push 到 main 后火山自动拉代码、构建、上线，纯静态站约 1 分钟。看构建状态：
控制台 → 全站加速 → IGA Pages → study-site → 部署记录

- **`deploy-volc.sh` 已删除**：那是 zip 上传时代的产物，Git 集成后不再需要
- **正式域名** `study.waytoaic.com` 已绑定并走火山（灰云 CNAME 直连，不经 Cloudflare 代理）
- **证书**：与主站共用一张 Let's Encrypt 通配符证书，**2026-11-19 到期**，续签见 `~/Desktop/火山引擎/scripts/renew-cert.sh`
- **回滚**：部署记录里选历史版本「重新部署」。注意单项目**只保留最近 10 次部署**，更早的自动删除

