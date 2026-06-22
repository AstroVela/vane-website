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
  clientModules: [require.resolve('./src/clientStyles.js')],
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
  plugins: [require.resolve('./src/plugins/vaneRoutes.cjs')],
}

module.exports = config
