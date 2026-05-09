# Personal Knowledge Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a VuePress 2 knowledge base with Swiss Minimalism UI, tag system, full-text search, and GitHub Actions auto-deploy.

**Architecture:** VuePress 2 static site with custom SCSS theme overriding default variables. Content organized by folders (tech/reading/thinking/life) with YAML frontmatter for tags. GitHub Actions builds and deploys to GitHub Pages on push to main.

**Tech Stack:** VuePress 2, TypeScript (config), SCSS, Node.js 20, pnpm, GitHub Actions, GitHub Pages

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies and scripts (vuepress, plugins) |
| `.gitignore` | Exclude node_modules, dist, .superpowers |
| `docs/.vuepress/config.ts` | VuePress config: nav, sidebar, plugins, theme |
| `docs/.vuepress/styles/palette.scss` | SCSS variables (colors, spacing) |
| `docs/.vuepress/styles/index.scss` | Full CSS overrides (typography, layout, components) |
| `docs/.vuepress/public/favicon.svg` | Site favicon |
| `docs/README.md` | Homepage with hero, category cards, recent articles, tag cloud |
| `docs/tech/README.md` | Tech section index |
| `docs/reading/README.md` | Reading section index |
| `docs/thinking/README.md` | Thinking section index |
| `docs/life/README.md` | Life section index |
| `docs/tech/frontend/getting-started.md` | Example article with full frontmatter |
| `.github/workflows/deploy.yml` | CI/CD pipeline |

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "personal-kb",
  "version": "1.0.0",
  "private": true,
  "description": "个人知识库 · 技术笔记 · 思考沉淀",
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
  "devDependencies": {
    "@vuepress/plugin-search": "2.0.0-rc.0",
    "vuepress": "2.0.0-rc.0",
    "@vuepress/theme-default": "2.0.0-rc.0",
    "sass": "^1.77.0"
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
docs/.vuepress/dist/
docs/.vuepress/.cache/
.superpowers/
.DS_Store
*.log
```

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`
Expected: Dependencies installed successfully, `pnpm-lock.yaml` created.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml .gitignore
git commit -m "chore: scaffold VuePress 2 project with pnpm"
```

---

### Task 2: VuePress Core Config

**Files:**
- Create: `docs/.vuepress/config.ts`

- [ ] **Step 1: Create `docs/.vuepress/config.ts`**

```typescript
import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Leo\'s KB',
  description: '个人知识库 · 技术笔记 · 思考沉淀',

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      rel: 'stylesheet'
    }],
  ],

  theme: defaultTheme({
    logo: '/favicon.svg',
    repo: '',
    docsDir: 'docs',
    sidebar: 'auto',
    editLink: false,
    lastUpdated: true,
    contributors: false,

    navbar: [
      { text: '技术', link: '/tech/' },
      { text: '读书', link: '/reading/' },
      { text: '思考', link: '/thinking/' },
      { text: '生活', link: '/life/' },
    ],
  }),

  plugins: [
    searchPlugin({
      locales: { '/': { placeholder: '搜索文章...' } },
      maxSuggestions: 10,
      hotKeys: [{ key: 'k', ctrl: true }],
    }),
  ],
})
```

- [ ] **Step 2: Verify build works (minimal)**

Run: `pnpm docs:build`
Expected: Build succeeds (warning about missing README is OK).

- [ ] **Step 3: Commit**

```bash
git add docs/.vuepress/config.ts
git commit -m "feat: add VuePress core config with search and auto-sidebar"
```

---

### Task 3: Design System — SCSS Variables

**Files:**
- Create: `docs/.vuepress/styles/palette.scss`

- [ ] **Step 1: Create `docs/.vuepress/styles/palette.scss`**

```scss
// ===== 设计系统变量 =====
// 色彩 tokens — 浅色模式
$color-primary: #475569;
$color-primary-light: #64748b;
$color-accent: #2563eb;
$color-bg: #f8fafc;
$color-bg-card: #ffffff;
$color-bg-sidebar: #f1f5f9;
$color-text: #1e293b;
$color-text-light: #64748b;
$color-text-lighter: #94a3b8;
$color-border: #e2e8f0;
$color-border-dark: #cbd5e1;
$color-code-bg: #f1f5f9;

// ===== 基础单位 =====
$base-unit: 8px;

// ===== 字体 =====
$font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
  Roboto, 'Helvetica Neue', Arial, sans-serif;
$font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco',
  'Andale Mono', monospace;

// ===== 尺寸 =====
$content-width: 780px;
$sidebar-width: 240px;

// ===== 圆角 =====
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;

// ===== 过渡 =====
$transition-fast: 150ms ease;
$transition-normal: 250ms ease;
```

- [ ] **Step 2: Verify build still works**

Run: `pnpm docs:build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add docs/.vuepress/styles/palette.scss
git commit -m "feat: add design system SCSS variables"
```

---

### Task 4: Design System — Full CSS Overrides

**Files:**
- Create: `docs/.vuepress/styles/index.scss`

- [ ] **Step 1: Create `docs/.vuepress/styles/index.scss`**

```scss
@use 'palette';

// ===== CSS 自定义属性 =====
:root {
  --c-brand: #{$color-primary};
  --c-brand-light: #{$color-primary-light};
  --c-text: #{$color-text};
  --c-text-light: #{$color-text-light};
  --c-text-lighter: #{$color-text-lighter};
  --c-bg: #{$color-bg};
  --c-bg-secondary: #{$color-bg-card};
  --c-bg-sidebar: #{$color-bg-sidebar};
  --c-bg-navbar: #{$color-bg-sidebar};
  --c-border: #{$color-border};
  --c-border-dark: #{$color-border-dark};
  --c-code-bg: #{$color-code-bg};
  --c-tip: #{$color-accent};
  --c-tip-bg: #eff6ff;
  --c-tip-text: #1e40af;
  --c-warning: #d97706;
  --c-warning-bg: #fffbeb;
  --c-warning-text: #92400e;
  --c-danger: #dc2626;
  --c-danger-bg: #fef2f2;
  --c-danger-text: #991b1b;
  --font-family: #{$font-family};
  --font-family-mono: #{$font-family-mono};
  --content-width: #{$content-width};
  --sidebar-width: #{$sidebar-width};
}

// ===== 深色模式 =====
html.dark {
  --c-brand: #94a3b8;
  --c-brand-light: #cbd5e1;
  --c-text: #e2e8f0;
  --c-text-light: #94a3b8;
  --c-text-lighter: #64748b;
  --c-bg: #0f172a;
  --c-bg-secondary: #1e293b;
  --c-bg-sidebar: #1e293b;
  --c-bg-navbar: #1e293b;
  --c-border: #334155;
  --c-border-dark: #475569;
  --c-code-bg: #1e293b;
  --c-tip: #3b82f6;
  --c-tip-bg: rgba(59, 130, 246, 0.15);
  --c-tip-text: #93c5fd;
  --c-warning: #f59e0b;
  --c-warning-bg: rgba(245, 158, 11, 0.15);
  --c-warning-text: #fcd34d;
  --c-danger: #ef4444;
  --c-danger-bg: rgba(239, 68, 68, 0.15);
  --c-danger-text: #fca5a5;
}

// ===== 基础排版 =====
body {
  font-family: var(--font-family);
  font-size: 16px;
  line-height: 1.7;
  color: var(--c-text);
  background: var(--c-bg);
}

// ===== 内容区排版 =====
.theme-default-content {
  max-width: var(--content-width);

  p {
    font-size: 16px;
    line-height: 1.75;
    margin-bottom: 1.25em;
  }

  a {
    color: var(--c-brand);
    text-decoration: none;
    border-bottom: 1.5px solid transparent;
    transition: border-color 150ms ease;

    &:hover {
      border-bottom-color: var(--c-brand);
    }
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0 0 0.75em;
    letter-spacing: -0.02em;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 2em 0 0.75em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid var(--c-border);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 1.75em 0 0.5em;
  }

  h4 {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.5;
    margin: 1.5em 0 0.5em;
  }

  // 代码块
  pre {
    border-radius: 8px;
    font-family: var(--font-family-mono);

    code {
      font-size: 0.875rem;
      line-height: 1.6;
    }
  }

  // 行内代码
  code:not(pre code) {
    font-family: var(--font-family-mono);
    font-size: 0.875em;
    background: var(--c-code-bg);
    color: #e11d48;
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-weight: 500;

    html.dark & {
      color: #fb7185;
    }
  }

  // 引用块
  blockquote {
    border-left: 4px solid var(--c-brand);
    background: var(--c-bg-secondary);
    padding: 1em 1.25em;
    margin: 1.5em 0;
    border-radius: 0 4px 4px 0;
    color: var(--c-text-light);

    p:last-child { margin-bottom: 0; }
  }

  // 表格
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
    font-size: 0.9375rem;

    th {
      background: var(--c-bg-sidebar);
      font-weight: 600;
      text-align: left;
      padding: 0.75em 1em;
      border-bottom: 2px solid var(--c-border-dark);
    }

    td {
      padding: 0.75em 1em;
      border-bottom: 1px solid var(--c-border);
    }

    tr:hover td {
      background: var(--c-bg-sidebar);
    }
  }

  ul, ol {
    padding-left: 1.5em;
    line-height: 1.7;

    li { margin-bottom: 0.35em; }
  }
}

// ===== 侧边栏 =====
.sidebar {
  background: var(--c-bg-sidebar);
  border-right: 1px solid var(--c-border);

  .sidebar-item {
    font-size: 0.9375rem;

    .active {
      color: var(--c-brand);
      font-weight: 600;
      background: rgba(71, 85, 105, 0.08);
      border-radius: 4px;
    }
  }
}

// ===== 自定义容器 =====
.custom-container.tip {
  border-color: var(--c-tip);
  background: var(--c-tip-bg);
  color: var(--c-tip-text);

  .custom-container-title {
    color: var(--c-tip-text);
  }
}

.custom-container.warning {
  border-color: var(--c-warning);
  background: var(--c-warning-bg);
  color: var(--c-warning-text);
}

.custom-container.danger {
  border-color: var(--c-danger);
  background: var(--c-danger-bg);
  color: var(--c-danger-text);
}

// ===== 搜索框 (VuePress 覆盖) =====
.search-box input {
  border-radius: 8px;
  border: 1.5px solid var(--c-border);
  font-family: var(--font-family);
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus {
    border-color: var(--c-brand);
    box-shadow: 0 0 0 3px rgba(71, 85, 105, 0.1);
  }
}

// ===== 首页自定义样式 =====
.home-hero {
  text-align: center;
  padding: 64px 16px 48px;
}

.home-hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 0;
}

.home-hero-sub {
  font-size: 1.125rem;
  color: var(--c-text-light);
  margin-top: 12px;
}

// 分类卡片网格
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  max-width: 820px;
  margin: 0 auto;
  padding: 0 16px;
}

.category-card {
  display: block;
  background: var(--c-bg-secondary);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  text-decoration: none;
  transition: all 150ms ease;

  &:hover {
    border-color: var(--c-brand);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
    text-decoration: none;
  }

  .category-card-icon {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  .category-card-name {
    font-weight: 600;
    color: var(--c-text);
  }

  .category-card-count {
    font-size: 0.8125rem;
    color: var(--c-text-light);
    margin-top: 4px;
  }
}

// 文章列表
.article-list {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 16px;
}

.article-item {
  border-bottom: 1px solid var(--c-border);
  padding: 24px 0;

  &:first-child {
    border-top: 1px solid var(--c-border);
  }
}

.article-date {
  font-size: 0.8125rem;
  color: var(--c-text-light);
  margin-bottom: 4px;
}

.article-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;

  a {
    color: var(--c-text);
    text-decoration: none;

    &:hover {
      color: var(--c-brand);
    }
  }
}

.article-meta {
  font-size: 0.8125rem;
  color: var(--c-text-light);
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.article-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;

  .tag-badge {
    font-size: 0.75rem;
    background: var(--c-bg-sidebar);
    color: var(--c-text-light);
    padding: 2px 10px;
    border-radius: 999px;
    text-decoration: none;
    transition: all 150ms ease;

    &:hover {
      background: var(--c-brand);
      color: #fff;
    }
  }
}

// 标签云
.tag-cloud {
  max-width: 780px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.tag-cloud-item {
  color: var(--c-brand);
  background: var(--c-bg-secondary);
  border: 1px solid var(--c-border);
  padding: 4px 14px;
  border-radius: 999px;
  text-decoration: none;
  transition: all 150ms ease;

  &:hover {
    background: var(--c-brand);
    color: #fff;
    border-color: var(--c-brand);
  }
}

// ===== prefers-reduced-motion =====
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify build succeeds with styles**

Run: `pnpm docs:build`
Expected: Build succeeds, SCSS compiles without errors.

- [ ] **Step 3: Commit**

```bash
git add docs/.vuepress/styles/index.scss
git commit -m "feat: add full CSS design system with light/dark mode"
```

---

### Task 5: Favicon and Public Assets

**Files:**
- Create: `docs/.vuepress/public/favicon.svg`

- [ ] **Step 1: Create `docs/.vuepress/public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#475569"/>
  <text x="16" y="23" text-anchor="middle" font-size="20"
        font-family="Inter,sans-serif" font-weight="700"
        fill="#ffffff">K</text>
</svg>
```

- [ ] **Step 2: Verify build includes favicon**

Run: `pnpm docs:build`
Expected: Build succeeds, `favicon.svg` present in `docs/.vuepress/dist/`.

- [ ] **Step 3: Commit**

```bash
git add docs/.vuepress/public/favicon.svg
git commit -m "feat: add favicon"
```

---

### Task 6: Homepage

**Files:**
- Create: `docs/README.md`

- [ ] **Step 1: Create `docs/README.md`**

```markdown
---
home: true
title: Leo's Knowledge Base
heroText: Hey, I'm Leo 👋
tagline: 个人知识库 · 技术沉淀 · 思考碎片
actions: false
---

<div class="home-hero">
  <h1 class="home-hero-title">Hey, I'm Leo 👋</h1>
  <p class="home-hero-sub">个人知识库 · 技术沉淀 · 思考碎片</p>
</div>

<div class="category-grid">

[技术笔记](/tech/)
:   💻
:   技术笔记
:   前端 / 后端 / DevOps

[读书笔记](/reading/)
:   📚
:   读书笔记
:   阅读思考与摘要

[思考复盘](/thinking/)
:   💭
:   思考复盘
:   工作复盘与成长

[生活记录](/life/)
:   🌿
:   生活记录
:   日常随笔与感悟

</div>

---

## 最近更新

<div class="article-list" markdown="0">

<div class="article-item">
  <div class="article-date">2026-05-09</div>
  <div class="article-title">
    <a href="/tech/frontend/getting-started.html">知识库搭建指南</a>
  </div>
  <div class="article-meta">
    <span>📁 tech/frontend</span>
    <span>🏷️</span>
    <span class="article-tags">
      <a href="#" class="tag-badge">VuePress</a>
      <a href="#" class="tag-badge">指南</a>
    </span>
  </div>
</div>

</div>

## 标签云

<div class="tag-cloud" markdown="0">
  <a href="#" class="tag-cloud-item">VuePress</a>
  <a href="#" class="tag-cloud-item">TypeScript</a>
  <a href="#" class="tag-cloud-item">React</a>
  <a href="#" class="tag-cloud-item">CSS</a>
  <a href="#" class="tag-cloud-item">Node.js</a>
  <a href="#" class="tag-cloud-item">DevOps</a>
  <a href="#" class="tag-cloud-item">读书</a>
  <a href="#" class="tag-cloud-item">思考</a>
</div>
```

- [ ] **Step 2: Verify homepage builds**

Run: `pnpm docs:build`
Expected: Build succeeds, homepage HTML generated.

- [ ] **Step 3: Commit**

```bash
git add docs/README.md
git commit -m "feat: add homepage with hero, category cards, and tag cloud"
```

---

### Task 7: Section Index Pages

**Files:**
- Create: `docs/tech/README.md`
- Create: `docs/reading/README.md`
- Create: `docs/thinking/README.md`
- Create: `docs/life/README.md`

- [ ] **Step 1: Create `docs/tech/README.md`**

```markdown
---
title: 技术笔记
---

# 💻 技术笔记

前端、后端、DevOps 相关的技术文章和踩坑记录。
```

- [ ] **Step 2: Create `docs/reading/README.md`**

```markdown
---
title: 读书笔记
---

# 📚 读书笔记

阅读思考、摘要与感悟。
```

- [ ] **Step 3: Create `docs/thinking/README.md`**

```markdown
---
title: 思考复盘
---

# 💭 思考复盘

工作复盘、项目反思与个人成长。
```

- [ ] **Step 4: Create `docs/life/README.md`**

```markdown
---
title: 生活记录
---

# 🌿 生活记录

日常随笔、兴趣与生活感悟。
```

- [ ] **Step 5: Verify section pages build**

Run: `pnpm docs:build`
Expected: Build succeeds, 4 section index pages generated.

- [ ] **Step 6: Commit**

```bash
git add docs/tech/README.md docs/reading/README.md docs/thinking/README.md docs/life/README.md
git commit -m "feat: add section index pages for 4 categories"
```

---

### Task 8: Example Article

**Files:**
- Create: `docs/tech/frontend/getting-started.md`

- [ ] **Step 1: Create `docs/tech/frontend/getting-started.md`**

```markdown
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
```

- [ ] **Step 2: Verify example article builds**

Run: `pnpm docs:build`
Expected: Build succeeds, article page generated at `tech/frontend/getting-started.html`.

- [ ] **Step 3: Commit**

```bash
git add docs/tech/frontend/getting-started.md
git commit -m "feat: add example article with full frontmatter"
```

---

### Task 9: CI/CD — GitHub Actions Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest

      - name: Install dependencies
        run: pnpm install

      - name: Build site
        run: pnpm docs:build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vuepress/dist

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions deploy to GitHub Pages"
```

---

### Task 10: Final Verification Build

- [ ] **Step 1: Clean build from scratch**

Run:
```bash
rm -rf docs/.vuepress/dist docs/.vuepress/.cache
pnpm docs:build
```
Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify dist output structure**

Run: `ls docs/.vuepress/dist/`
Expected: Contains `index.html`, `tech/`, `reading/`, `thinking/`, `life/`, `favicon.svg`, `404.html`.

- [ ] **Step 3: Set git remote and push**

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

用户需手动在 GitHub 仓库 Settings → Pages 中：
- Source 选择 "GitHub Actions"
- 等待首次 Action 运行完成
- 访问 `https://<username>.github.io/<repo-name>`
```

---

### Task 11: Edit Link Configuration

- [ ] **Step 1: Update config.ts to set repo**

用户需要手动在 `docs/.vuepress/config.ts` 中将 `repo` 设为实际的 GitHub 仓库路径：

```typescript
// 替换为空字符串为实际仓库
repo: 'owner/repo-name',
```

- [ ] **Step 2: Commit if changed**

```bash
git add docs/.vuepress/config.ts
git commit -m "chore: set repo for edit links"
```

---

## Verification Checklist

After all tasks complete, verify:

- [ ] `pnpm docs:dev` starts without errors
- [ ] Homepage renders: hero, 4 category cards, article list, tag cloud
- [ ] Navigation works: 技术/读书/思考/生活 links
- [ ] Sidebar auto-generates from folder structure
- [ ] Search (Ctrl+K) returns results
- [ ] Dark mode toggle works (top-right button)
- [ ] Code blocks render with syntax highlighting
- [ ] Blockquotes, tables, tip/warning/danger boxes render correctly
- [ ] Mobile: hamburger menu, readable text, no horizontal scroll
- [ ] `pnpm docs:build` completes without errors
