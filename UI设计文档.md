# 个人知识库 UI 设计文档

> 2026-05-09 · 基于 VuePress 2 默认主题 · Swiss Minimalism 风格

---

## 1. 设计系统

### 1.1 风格定位

**Swiss Minimalism 2.0** — 干净、理性、高可读性，专为文档和知识管理场景优化。

| 维度 | 决策 |
|------|------|
| 风格 | Swiss Modernism 2.0 / Minimalism |
| 设计理念 | 内容第一，装饰最小化，数学化间距 |
| 字体 | Inter（标题 + 正文统一） |
| 栅格 | 12 列，8px 基准单位 |
| 适配 | Light / Dark 双模式完整支持 |
| 可访问性 | WCAG AA 最低（AAA 目标） |

### 1.2 色彩系统

#### 浅色模式

| 角色 | 色值 | CSS 变量 | 用途 |
|------|------|----------|------|
| Primary | `#475569` | `--c-brand` | 品牌色、链接、按钮 |
| Primary Light | `#64748B` | `--c-brand-light` | Hover 状态 |
| Text | `#1E293B` | `--c-text` | 正文颜色 |
| Text Secondary | `#64748B` | `--c-text-light` | 辅助文字、日期 |
| Background | `#F8FAFC` | `--c-bg` | 页面背景 |
| Background Secondary | `#FFFFFF` | `--c-bg-secondary` | 卡片、内容区背景 |
| Sidebar | `#F1F5F9` | — | 侧边栏背景 |
| Border | `#E2E8F0` | `--c-border` | 边框、分割线 |
| Code Block | `#F1F5F9` | — | 代码块背景 |
| Accent | `#2563EB` | `--c-tip` | 提示框、强调色 |
| Warning | `#D97706` | `--c-warning` | 警告色 |
| Danger | `#DC2626` | `--c-danger` | 错误/删除 |

#### 深色模式

| 角色 | 色值 | CSS 变量 | 用途 |
|------|------|----------|------|
| Primary | `#94A3B8` | `--c-brand` | 品牌色（去饱和） |
| Text | `#E2E8F0` | `--c-text` | 正文 |
| Text Secondary | `#94A3B8` | `--c-text-light` | 辅助文字 |
| Background | `#0F172A` | `--c-bg` | 页面背景 |
| Background Secondary | `#1E293B` | `--c-bg-secondary` | 卡片背景 |
| Sidebar | `#1E293B` | — | 侧边栏背景 |
| Border | `#334155` | `--c-border` | 边框 |
| Code Block | `#1E293B` | — | 代码块背景 |
| Accent | `#3B82F6` | `--c-tip` | 提示框 |

### 1.3 字体系统

| 角色 | 字体 | 字号 | 行高 | 字重 |
|------|------|------|------|------|
| H1 文章标题 | Inter | 32px / 2rem | 1.3 | 700 |
| H2 二级标题 | Inter | 24px / 1.5rem | 1.4 | 600 |
| H3 三级标题 | Inter | 20px / 1.25rem | 1.4 | 600 |
| H4 四级标题 | Inter | 18px / 1.125rem | 1.5 | 500 |
| 正文 | Inter | 16px / 1rem | 1.7 | 400 |
| 小字/辅助 | Inter | 14px / 0.875rem | 1.5 | 400 |
| 代码 | JetBrains Mono | 14px / 0.875rem | 1.6 | 400 |

Google Fonts 引入：
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### 1.4 间距系统

基于 8px 单位：

| Token | 值 | 用途 |
|-------|-----|------|
| `--spacing-xs` | 4px | 图标与文字间距 |
| `--spacing-sm` | 8px | 标签间距、列表项间距 |
| `--spacing-md` | 16px | 段落间距、卡片内边距 |
| `--spacing-lg` | 24px | 区块间距 |
| `--spacing-xl` | 32px | 章节间距 |
| `--spacing-2xl` | 48px | 页面级间距 |
| `--content-max-width` | 780px | 文章内容区最大宽度 |

---

## 2. 页面设计

### 2.1 整体布局

```
┌─────────────────────────────────────────────────────┐
│  Navbar（顶部）                    🔍 搜索  🌙 深色   │
├────────────┬────────────────────────────────────────┤
│  侧边栏     │  内容区                                  │
│  (240px)   │  (max-width: 780px)                     │
│            │                                         │
│ 📁 技术笔记  │  # React 18 并发特性深入理解              │
│  ├─ 前端    │  2026-05-09 · 📁 tech/frontend          │
│  ├─ 后端    │  🏷️ React  并发  性能优化               │
│  └─ DevOps │                                         │
│ 📁 读书笔记  │  正文内容...                            │
│ 📁 思考复盘  │                                         │
│ 📁 生活记录  │                                         │
│            │                                         │
│ 🏷️ 标签索引 │                                         │
├────────────┴────────────────────────────────────────┤
│  无 Footer（内容区自然结束）                           │
└─────────────────────────────────────────────────────┘
```

### 2.2 首页设计

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│         Hey, I'm Leo 👋                             │
│         个人知识库 · 思考碎片 · 技术沉淀               │
│                                                     │
│         ┌──────────────────────────────────┐        │
│         │  🔍 搜索文章...                    │        │
│         └──────────────────────────────────┘        │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐│
│  │  💻      │  │  📚      │  │  💭      │  │  🌿  ││
│  │ 技术笔记  │  │ 读书笔记  │  │ 思考复盘  │  │ 生活  ││
│  │ (N 篇)   │  │ (N 篇)   │  │ (N 篇)   │  │(N 篇)││
│  └──────────┘  └──────────┘  └──────────┘  └──────┘│
│                                                     │
│  最近更新                                             │
│  ┌─────────────────────────────────────────┐        │
│  │ 2026-05-09                               │        │
│  │ React 18 并发特性深入理解      📁 frontend│        │
│  │ 🏷️ React  并发  性能优化                  │        │
│  ├─────────────────────────────────────────┤        │
│  │ 2026-05-02                               │        │
│  │ Clean Architecture 读书笔记    📁 reading │        │
│  │ 🏷️ 架构  读书                             │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
│  标签云                                               │
│  [React(12)] [TypeScript(9)] [性能(8)]               │
│  [架构(7)] [CSS(6)] [Node(5)] ...                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.3 文章页设计

```
┌─────────────────────────────────────────────────────┐
│  Navbar                                             │
├────────────┬────────────────────────────────────────┤
│  侧边栏     │  # 一级标题 (H1, 32px, 700)            │
│            │                                         │
│            │  📅 2026-05-09  📁 frontend             │
│            │  🏷️ [React] [并发] [性能优化]           │
│            │                                         │
│            │  正文第一段...                           │
│            │                                         │
│            │  ## 二级标题 (H2, 24px, 600)             │
│            │  正文内容，line-height 1.7               │
│            │                                         │
│            │  ### 三级标题 (H3, 20px, 600)            │
│            │                                         │
│            │  ```typescript                         │
│            │  // 代码块，JetBrains Mono              │
│            │  const foo = () => {}                  │
│            │  ```                                   │
│            │                                         │
│            │  > 引用块，左边框 Accent 色              │
│            │                                         │
│            │  ::: tip 提示框                         │
│            │  蓝色左边框，浅蓝背景                     │
│            │  :::                                    │
│            │                                         │
│            │  ← 上一篇：xxx  |  下一篇：xxx →         │
│            │                                         │
│            │  ── 目录 (TOC) ──                       │
│            │  右侧固定，桌面端显示                      │
└─────────────────────────────────────────────────────┘
```

### 2.4 标签聚合页

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│         🏷️ React                                     │
│         共 12 篇文章                                  │
│                                                     │
│  ┌─────────────────────────────────────────┐        │
│  │ React 18 并发特性深入理解                  │        │
│  │ 📁 tech/frontend · 📅 2026-05-09         │        │
│  │ 🏷️ React  并发  性能优化                  │        │
│  ├─────────────────────────────────────────┤        │
│  │ React 自定义 Hook 最佳实践                │        │
│  │ 📁 tech/frontend · 📅 2026-04-20         │        │
│  │ 🏷️ React  Hooks                         │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
│         ← 1 / 2 / 3 →                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.5 搜索体验

```
┌─────────────────────────────────────────────────────┐
│  🔍 React concurrency ───────────── ×               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  3 个结果                                            │
│                                                     │
│  ┌─ React 18 并发特性深入理解 ────────────┐          │
│  │  📁 tech/frontend                      │          │
│  │  ...并发模式让 React 应用能够同时处理多个│          │
│  │  状态更新，无需阻塞渲染线程...            │          │
│  ├─────────────────────────────────────────┤          │
│  └─────────────────────────────────────────┘          │
│                                                     │
│  ┌─ 前端性能优化实践 ──────────────────────┐          │
│  │  ...使用 React 18 的并发特性可以显著提升  │          │
│  │  用户体验...                             │          │
│  └─────────────────────────────────────────┘          │
│                                                     │
│  ┌─ 2025 年度技术回顾 ────────────────────┐          │
│  │  ...并发渲染带来的变革...                 │          │
│  └─────────────────────────────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 3. CSS 变量覆盖配置

### 3.1 VuePress 主题变量

在 `docs/.vuepress/styles/index.scss` 中覆盖默认变量：

```scss
// ===== 设计系统变量 =====
// 基础单位
$base-unit: 8px;

// 色彩 tokens
$color-primary: #475569;
$color-primary-light: #64748b;
$color-accent: #2563eb;
$color-bg: #f8fafc;
$color-bg-card: #ffffff;
$color-bg-sidebar: #f1f5f9;
$color-text: #1e293b;
$color-text-light: #64748b;
$color-border: #e2e8f0;

// ===== CSS 自定义属性 =====
:root {
  // 品牌色
  --c-brand: #{$color-primary};
  --c-brand-light: #{$color-primary-light};

  // 文字
  --c-text: #{$color-text};
  --c-text-light: #{$color-text-light};
  --c-text-lighter: #94a3b8;

  // 背景
  --c-bg: #{$color-bg};
  --c-bg-secondary: #{$color-bg-card};
  --c-bg-sidebar: #{$color-bg-sidebar};
  --c-bg-navbar: #{$color-bg-sidebar};

  // 边框
  --c-border: #{$color-border};
  --c-border-dark: #cbd5e1;

  // 代码
  --c-code-bg: #f1f5f9;

  // 提示框
  --c-tip: #{$color-accent};
  --c-tip-bg: #eff6ff;
  --c-tip-text: #1e40af;
  --c-warning: #d97706;
  --c-warning-bg: #fffbeb;
  --c-warning-text: #92400e;
  --c-danger: #dc2626;
  --c-danger-bg: #fef2f2;
  --c-danger-text: #991b1b;

  // 字体
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas',
    'Monaco', 'Andale Mono', monospace;

  // 间距
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  // 内容宽度
  --content-width: 780px;
  --sidebar-width: 240px;

  // 圆角
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  // 阴影
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08);

  // 过渡
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
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
```

### 3.2 排版覆盖

```scss
// 正文排版
.theme-default-content {
  // 正文
  p {
    font-size: 16px;
    line-height: 1.7;
    margin-bottom: 1.25em;
    color: var(--c-text);
  }

  // 链接
  a {
    color: var(--c-brand);
    text-decoration: none;
    border-bottom: 1.5px solid transparent;
    transition: border-color var(--transition-fast);

    &:hover {
      border-bottom-color: var(--c-brand);
    }
  }

  // 标题系统
  h1 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 0;
    margin-bottom: 0.75em;
    letter-spacing: -0.02em;
    color: var(--c-text);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
    margin-top: 2em;
    margin-bottom: 0.75em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid var(--c-border);
    color: var(--c-text);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    margin-top: 1.75em;
    margin-bottom: 0.5em;
    color: var(--c-text);
  }

  h4 {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.5;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  // 代码块
  pre {
    border-radius: var(--radius-md);
    font-family: var(--font-family-mono);
    box-shadow: var(--shadow-sm);

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
    border-radius: var(--radius-sm);
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
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    color: var(--c-text-light);

    p:last-child {
      margin-bottom: 0;
    }
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

  // 列表
  ul, ol {
    padding-left: 1.5em;
    line-height: 1.7;

    li {
      margin-bottom: 0.35em;
    }
  }
}
```

### 3.3 侧边栏样式

```scss
// 侧边栏
.sidebar {
  background: var(--c-bg-sidebar);
  border-right: 1px solid var(--c-border);

  .sidebar-item {
    font-size: 0.9375rem;
    line-height: 1.6;

    // 当前文章高亮
    .active {
      color: var(--c-brand);
      font-weight: 600;
      background: rgba($color-primary, 0.08);
      border-radius: var(--radius-sm);
    }
  }
}
```

### 3.4 首页样式

```scss
// 首页 Hero
.homepage-hero {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-md);

  .hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--c-text);
  }

  .hero-subtitle {
    font-size: 1.125rem;
    color: var(--c-text-light);
    margin-top: var(--spacing-md);
    line-height: 1.6;
  }

  .hero-search {
    max-width: 520px;
    margin: var(--spacing-xl) auto 0;
  }
}

// 分类卡片
.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 960px;
  margin: 0 auto;

  .category-card {
    background: var(--c-bg-secondary);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    text-align: center;
    transition: all var(--transition-fast);
    cursor: pointer;

    &:hover {
      border-color: var(--c-brand);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .category-icon {
      font-size: 2rem;
      margin-bottom: var(--spacing-sm);
    }

    .category-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--c-text);
    }

    .category-count {
      font-size: 0.8125rem;
      color: var(--c-text-light);
      margin-top: var(--spacing-xs);
    }
  }
}

// 文章列表
.article-list {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);

  .article-item {
    border-bottom: 1px solid var(--c-border);
    padding: var(--spacing-lg) 0;
    transition: background var(--transition-fast);

    &:hover {
      background: var(--c-bg-sidebar);
      margin: 0 calc(-1 * var(--spacing-md));
      padding-left: var(--spacing-md);
      padding-right: var(--spacing-md);
      border-radius: var(--radius-md);
    }

    .article-date {
      font-size: 0.8125rem;
      color: var(--c-text-light);
      margin-bottom: var(--spacing-xs);
    }

    .article-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--c-text);
      text-decoration: none;
      display: block;
      margin-bottom: var(--spacing-xs);
    }

    .article-meta {
      font-size: 0.8125rem;
      color: var(--c-text-light);
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
    }

    .article-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;

      .tag {
        font-size: 0.75rem;
        background: var(--c-bg-sidebar);
        color: var(--c-text-light);
        padding: 2px 8px;
        border-radius: 999px;
        text-decoration: none;
        transition: all var(--transition-fast);

        &:hover {
          background: var(--c-brand);
          color: #fff;
        }
      }
    }
  }
}

// 标签云
.tag-cloud {
  max-width: 780px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;

  .tag-item {
    font-size: var(--tag-size, 0.875rem);
    color: var(--c-brand);
    background: var(--c-bg-secondary);
    border: 1px solid var(--c-border);
    padding: 4px 14px;
    border-radius: 999px;
    text-decoration: none;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--c-brand);
      color: #fff;
      border-color: var(--c-brand);
    }
  }
}
```

### 3.5 搜索框样式

```scss
.search-box {
  input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    font-size: 0.9375rem;
    border: 1.5px solid var(--c-border);
    border-radius: var(--radius-lg);
    background: var(--c-bg-secondary);
    color: var(--c-text);
    transition: all var(--transition-fast);
    font-family: var(--font-family);

    &::placeholder {
      color: var(--c-text-lighter);
    }

    &:focus {
      outline: none;
      border-color: var(--c-brand);
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }
}
```

---

## 4. 交互动效

| 交互 | 时长 | 缓动 | 说明 |
|------|------|------|------|
| 链接 Hover 下划线 | 150ms | ease | border-bottom 过渡 |
| 卡片 Hover 悬浮 | 150ms | ease | translateY(-2px) + shadow |
| 按钮点击 | 100ms | ease-out | scale(0.97) 回弹 |
| 侧边栏切换 | 250ms | ease | 宽度过渡 |
| 搜索下拉出现 | 200ms | ease-out | opacity + translateY |
| 页面切换 | 200ms | ease | 内容区 fade 效果 |

遵循规则：
- 进入动画用 `ease-out`，退出用 `ease-in`
- 退出时长 ≈ 进入时长 × 60%
- 不使用 `width/height/top/left` 做动画（仅用 `transform/opacity`）
- `prefers-reduced-motion` 时禁用所有动画

---

## 5. 响应式断点

| 断点 | 宽度 | 适配策略 |
|------|------|----------|
| Mobile S | 375px | 侧边栏收为汉堡菜单，文章全宽 |
| Mobile L | 425px | 同上 |
| Tablet | 768px | 侧边栏折叠，可展开 |
| Desktop | 1024px | 侧边栏固定 240px + 内容 max-w 780px |
| Wide | 1440px | 内容居中，两侧留白 |

关键规则：
- 移动端正文 16px（防 iOS 自动缩放）
- 移动端 H1 降至 1.75rem
- 触摸目标最小 44×44px
- 分类卡片移动端 2 列

---

## 6. 无障碍（Accessibility）

| 检查项 | 标准 |
|--------|------|
| 正文对比度 | ≥ 4.5:1 (WCAG AA) |
| 大文字对比度 | ≥ 3:1（≥18.5px bold） |
| 键盘导航 | Tab 顺序与视觉顺序一致 |
| Focus 样式 | 可见的 2px outline，不依赖颜色 |
| 跳过导航 | Skip to content 链接 |
| 表单标签 | 搜索框有 aria-label |
| 图片 Alt | 所有图片有描述性 alt |
| 语义化标题 | h1→h4 不跳级 |
| 减少动画 | `prefers-reduced-motion` 完全支持 |

---

## 7. 性能优化

| 策略 | 实现 |
|------|------|
| 字体加载 | `font-display: swap` + 预加载 Inter |
| 图片格式 | WebP 优先，AVIF 备选 |
| 图片尺寸 | 声明 width/height 防 CLS |
| 代码分割 | VuePress 内置路由级分割 |
| 搜索索引 | 构建时预生成 JSON，不依赖外部服务 |
| 目标 | Lighthouse ≥ 95，CLS < 0.05 |

---

## 附：VuePress 配置参考

`docs/.vuepress/config.ts` 关键配置结构：

```typescript
import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Leo\'s Knowledge Base',
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
    logo: '/logo.svg',
    repo: 'your-username/your-repo',
    docsDir: 'docs',
    sidebar: 'auto',           // 自动按文件夹生成侧边栏
    editLink: true,
    lastUpdated: true,
    contributors: false,

    // 导航栏
    navbar: [
      { text: '技术', link: '/tech/' },
      { text: '读书', link: '/reading/' },
      { text: '思考', link: '/thinking/' },
      { text: '生活', link: '/life/' },
      { text: '标签', link: '/tags/' },
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
