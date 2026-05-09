---
title: 知识库搭建指南
date: 2026-05-09
category: 前端
tags:
  - VuePress
  - 指南
  - GitHub Pages
sticky: true
draft: false
---

# 知识库搭建指南

记录这个个人知识库的搭建过程。

## 技术选型

- **框架**：[VuePress 2](https://v2.vuepress.vuejs.org/) — Vue 驱动的静态站点生成器
- **托管**：GitHub Pages — 免费 HTTPS + CDN
- **CI/CD**：GitHub Actions — 推送即部署
- **样式**：Swiss Minimalism 2.0 — Inter 字体 + 蓝灰色调

## 写作方式

所有文章以 Markdown 文件存放，通过 YAML frontmatter 标注标签和分类。

```yaml
---
title: 文章标题
date: 2026-05-09
category: 前端
tags:
  - React
  - 性能优化
draft: false
---
```

`draft: true` 的文章在构建时自动跳过，只对本地开发可见。

## 快速开始

```bash
# 本地开发
pnpm docs:dev

# 构建
pnpm docs:build
```