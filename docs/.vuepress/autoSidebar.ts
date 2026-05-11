import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import type { NavbarItem, SidebarConfig } from '@vuepress/theme-default'

const DOCS_ROOT = join(import.meta.dirname, '..')

// 不需要出现在导航和侧边栏中的目录
const EXCLUDE_DIRS = new Set([
  '.vuepress',
  'node_modules',
  'superpowers',
  'assets',
])

// 目录名 → 显示名映射（简体中文）；未命中则用目录名本身
const DIR_NAME_MAP: Record<string, string> = {
  tech: '技术',
  frontend: '前端开发',
  backend: '后端开发',
  devops: 'DevOps',
  reading: '读书',
  thinking: '思考',
  life: '生活',
}

// 从 .md 文件的 frontmatter 中提取 title 字段
function extractTitle(filePath: string): string | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const m = content.match(/^---\s*\ntitle:\s*(.+?)\s*\n(?:.*?\n)*?---/m)
    return m ? m[1].trim() : null
  } catch {
    return null
  }
}

// 获取 .md 文件的显示名：优先 frontmatter title → 文件名
function getMdTitle(filePath: string): string {
  return extractTitle(filePath) ?? formatTitle(filePath)
}

// 获取目录的显示名：优先映射表 → 目录名
function getDirTitle(dirName: string): string {
  return DIR_NAME_MAP[dirName] ?? dirName
}

// 格式化标题：去掉扩展名和路径，文件名中的下划线转空格
function formatTitle(path: string): string {
  const name = path.split(/[/\\]/).pop() ?? path
  return name.replace(/\.md$/, '').replace(/_/g, ' ')
}

// 生成文件路径（去掉 docs 前缀和 .md 后缀）
function toLink(filePath: string): string {
  return '/' + relative(DOCS_ROOT, filePath).replace(/\\/g, '/').replace(/\.md$/, '')
}

export function generateNavbar(): NavbarItem[] {
  const entries = readdirSync(DOCS_ROOT, { withFileTypes: true })
  const sections: NavbarItem[] = []

  for (const entry of entries) {
    if (!entry.isDirectory() || EXCLUDE_DIRS.has(entry.name)) continue
    if (entry.name.startsWith('.')) continue

    // 检查目录下是否有 README.md
    const readmePath = join(DOCS_ROOT, entry.name, 'README.md')
    try {
      statSync(readmePath)
      sections.push({
        text: getDirTitle(entry.name),
        link: `/${entry.name}/`,
      })
    } catch {
      continue
    }
  }

  return sections.sort((a, b) => (a.text as string).localeCompare(b.text as string, 'zh'))
}

function collectMdFiles(dir: string, prefix = ''): string[] {
  const results: string[] = []

  try {
    const entries = readdirSync(dir, { withFileTypes: true })

    // 先处理子目录，再处理文件（目录排前面）
    const subdirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    const files = entries.filter(
      (e) => e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md'
    )

    for (const subdir of subdirs) {
      results.push(...collectMdFiles(join(dir, subdir.name), prefix + subdir.name + sep))
    }

    for (const file of files) {
      results.push(join(dir, file.name))
    }
  } catch {
    // 目录不存在就跳过
  }

  return results
}

export function generateSidebar(): SidebarConfig {
  const sidebar: SidebarConfig = {}
  const entries = readdirSync(DOCS_ROOT, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory() || EXCLUDE_DIRS.has(entry.name)) continue
    if (entry.name.startsWith('.')) continue

    const sectionDir = join(DOCS_ROOT, entry.name)
    const sectionPath = `/${entry.name}/`

    const items: SidebarConfig[string] = []

    // section 总览链接（README.md）
    try {
      statSync(join(sectionDir, 'README.md'))
      items.push({
        text: `${getDirTitle(entry.name)}总览`,
        link: sectionPath,
      })
    } catch {
      // 没有 README 就跳过总览
    }

    // 扫描子目录和直接 md 文件
    const subEntries = readdirSync(sectionDir, { withFileTypes: true })

    // 子目录 → 折叠组
    for (const sub of subEntries) {
      if (!sub.isDirectory() || sub.name.startsWith('.')) continue

      const groupPath = join(sectionDir, sub.name)
      const mdFiles = collectMdFiles(groupPath)

      if (mdFiles.length === 0) continue

      const children = mdFiles.map(toLink)

      items.push({
        text: getDirTitle(sub.name),
        collapsible: true,
        children: children.sort().map((link) => ({
          link,
          text: getMdTitle(join(DOCS_ROOT, link.replace(/^\//, '') + '.md')),
        })),
      } as never)
    }

    // 直接在 section 根下的 md 文件（非 README）→ 作为直接链接
    for (const sub of subEntries) {
      if (!sub.isFile() || !sub.name.endsWith('.md')) continue
      if (sub.name === 'README.md') continue

      items.push({
        text: getMdTitle(join(sectionDir, sub.name)),
        link: `${sectionPath}${sub.name.replace(/\.md$/, '')}`,
      })
    }

    if (items.length > 0) {
      sidebar[sectionPath] = items
    }
  }

  return sidebar
}
