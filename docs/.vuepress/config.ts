import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  lang: 'zh-CN',
  title: "Leo's KB",
  description: '个人知识库 · 技术笔记 · 思考沉淀',

  bundler: viteBundler(),

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
