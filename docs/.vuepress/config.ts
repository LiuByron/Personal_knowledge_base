import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { searchPlugin } from '@vuepress/plugin-search'
import { generateNavbar, generateSidebar } from './autoSidebar.js'

export default defineUserConfig({
  lang: 'zh-CN',
  title: "我是传奇",
  description: '个人知识库 · 技术笔记 · 思考沉淀',

  // base: '/Personal_knowledge_base/', github pages build时需要
  base: '/', // Netlify部署时需要

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
    navbar: generateNavbar(),
    sidebar: generateSidebar(),
    editLink: false,
    lastUpdated: true,
    contributors: false
  }),

  plugins: [
    searchPlugin({
      locales: { '/': { placeholder: '搜索文章...' } },
      maxSuggestions: 10,
      hotKeys: [{ key: 'k', ctrl: true }],
    }),
  ],
})
