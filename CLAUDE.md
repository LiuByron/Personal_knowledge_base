# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal knowledge base site built with **VuePress 2** (Vite bundler). Content is authored in Markdown under `docs/` and organized by category directories. The site auto-generates its navbar and sidebar from the directory structure.

## Commands

```bash
pnpm docs:dev       # Start dev server with hot reload
pnpm docs:build     # Production build → docs/.vuepress/dist/
```

Requires **Node.js >= 20** and **pnpm 9.15.0**.

## Architecture

### Auto-generated navigation (`docs/.vuepress/autoSidebar.ts`)

The navbar and sidebar are **not manually configured** — they are generated at startup by scanning the `docs/` directory tree:

- `generateNavbar()` — reads top-level directories under `docs/`, creates a nav link for each one that has a `README.md`
- `generateSidebar()` — for each top-level section, creates a sidebar with: a "总览" link from `README.md`, collapsible groups for subdirectories, and direct links for loose `.md` files

**Key behaviors:**
- Directories in `EXCLUDE_DIRS` (`.vuepress`, `node_modules`, `superpowers`, `assets`) are skipped
- `DIR_NAME_MAP` translates English directory names to Chinese display names (e.g. `tech` → `技术`, `frontend` → `前端开发`)
- File display titles come from **frontmatter `title`** field first, falling back to the filename
- Sidebar items are sorted alphabetically by file path

### Content structure

```
docs/
  .vuepress/          # VuePress config, custom styles, public assets
    config.ts          # Site config, theme, plugin setup
    autoSidebar.ts     # Navbar/sidebar generation logic
    styles/
      palette.scss     # Design tokens (colors, fonts, spacing)
      index.scss       # Full typography/layout custom styles
    public/            # Static assets (favicon, etc.)
  tech/                # 技术笔记 (frontend, backend, DevOps, AI)
  reading/             # 读书笔记
  thinking/            # 思考复盘
  life/                # 生活
```

### Base path

`config.ts` sets `base: '/Personal_knowledge_base/'` for GitHub Pages deployment. When deploying to Netlify, switch to `base: '/'`.

### Build & deploy

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds on push to `main` and deploys to GitHub Pages. The build output goes to `docs/.vuepress/dist/`.

### Styling

Custom SCSS overrides VuePress default theme with a design system defined in `palette.scss` (colors, fonts, spacing, radii). Supports both light and dark modes via CSS custom properties. Uses Inter + JetBrains Mono fonts loaded from Google Fonts.

## Adding new content

1. Create a `.md` file in the appropriate category directory
2. Add `title` in frontmatter for the desired sidebar display name:
   ```yaml
   ---
   title: 文章标题
   ---
   ```
3. If adding a new category directory, include a `README.md` for it to appear in the navbar
4. The sidebar picks up new files automatically — no config changes needed