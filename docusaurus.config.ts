import type {Config} from '@docusaurus/types'

const config = {
  title: 'Vane',
  tagline: 'DuckDB-compatible pipelines for AI workloads',
  favicon: 'favicon.svg',
  url: process.env.SITE_URL ?? 'https://vane.dev',
  baseUrl: '/',
  organizationName: 'AstroVela',
  projectName: 'vane',
  trailingSlash: false,
  staticDirectories: ['public'],
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
      'zh-CN': {
        label: '中文',
        htmlLang: 'zh-Hans-CN',
      },
    },
  },
  clientModules: [require.resolve('./src/clientStyles.ts')],
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400..700;1,400..600&family=Silkscreen:wght@400;700&family=Space+Grotesk:wght@400..700&display=swap',
      },
    },
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'data',
        path: 'docs/data',
        routeBasePath: 'docs/data',
        sidebarPath: require.resolve('./sidebars.data.ts'),
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    require.resolve('./src/plugins/vaneRoutes.ts'),
  ],
  themes: ['@docusaurus/theme-classic'],
  themeConfig: {
    navbar: {
      items: [],
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    colorMode: {
      disableSwitch: true,
    },
  },
} satisfies Config

export default config
