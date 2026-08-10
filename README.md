# WaytoAIC 学习站 · AI 从入门到精通

> AI×跨境电商学习站：从大模型底层原理到 AI 工程化落地，再到跨境电商实战。
> 交互式知识点 + 学习进度 + 章节测验，免费开放学习。

🌐 **在线访问：** <https://study.waytoaic.com>

## 关于本项目

本项目基于 [itshen/learn-ai](https://github.com/itshen/learn-ai)（作者：洛小山）二次开发，遵循 **AGPL-3.0** 开源协议。感谢原作者把整套课程与站点开源。

在上游基础上的主要改动：

- 品牌与部署改为 WaytoAIC / study.waytoaic.com
- 移除上游的登录后端依赖、行为统计、水印反调试与营销组件（`auth.js`、`watermark.js`、`track.js`、`ask-alice.js` 置为空操作壳或过渡实现）
- 第一版全部课程开放，不做登录锁课
- 规划中：账号与学习进度云同步、AI×跨境电商课程篇章（"学-讲-练"三段式：费曼学习法 + 刻意练习）

改造作战地图见 [docs/架构速记.md](docs/架构速记.md)。

## 本地运行

纯静态站点，无需构建。直接用任意静态服务器：

```bash
python3 -m http.server 8000
```

打开 `http://localhost:8000` 即可。

## 目录结构

- `index.html` — 入口（语言分流后直达课程阅读器）
- `slides/learn.html` — Wiki 式课程阅读器（左目录 + 内容区）
- `slides/course-data.js` — 唯一课程数据源（篇章 → 主题 → 知识点）
- `slides/*.html` — 各知识点交互页（中/英/韩三语）
- `slides/exam-*.html` — 章节测验与全站综合考

## 许可证

[AGPL-3.0](LICENSE)。本仓库的任何公开部署（含修改版）都必须继续以 AGPL-3.0 开源并保留署名。
