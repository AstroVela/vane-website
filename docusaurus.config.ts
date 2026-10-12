import type {Config} from '@docusaurus/types'

const config = {
  title: 'Vane',
  tagline: 'Multimodal data. Usable context.',
  favicon: 'favicon.svg',
  url: process.env.SITE_URL ?? 'https://vane.astrovela.ai',
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
  plugins: [
    require.resolve('./src/plugins/devServerWebSocketPath.ts'),
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
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'context',
        path: 'docs/context',
        routeBasePath: 'docs/context',
        sidebarPath: require.resolve('./sidebars.context.ts'),
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        path: 'blog',
        routeBasePath: 'blog',
        blogTitle: 'Vane Blog',
        blogDescription: 'Engineering notes, release deep dives, and field reports from the Vane team.',
        blogSidebarCount: 0,
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'release-notes',
        path: 'release-notes',
        routeBasePath: 'release-notes',
        blogTitle: 'Vane Data Release Notes',
        blogDescription: 'Published Vane Data versions, capabilities, and limitations.',
        blogSidebarTitle: 'Release Notes',
        blogSidebarCount: 'ALL',
        blogListComponent: '@site/src/components/ReleaseNotesList.tsx',
        blogPostComponent: '@site/src/components/ReleaseNotesPost.tsx',
        showReadingTime: false,
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
        feedOptions: { type: null },
      },
    ],
    require.resolve('./src/plugins/vaneRoutes.ts'),
    ['@docusaurus/plugin-sitemap', {ignorePatterns:['/solutions/enterprise-agent','/zh-CN/solutions/enterprise-agent','/docs/agent','/docs/rl','/zh-CN/docs/agent','/zh-CN/docs/rl']}],
  ],
  themes: ['@docusaurus/theme-classic'],
  themeConfig: {
    navbar: {
      items: [],
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
    colorMode: {
      disableSwitch: true,
    },
  },
} satisfies Config

export default config
