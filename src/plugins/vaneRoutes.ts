import type {PluginModule} from '@docusaurus/types'
import { LEGACY_DOC_SLUG_LIST } from '../docs/legacySlugs'

// Mirror src/docs/products.ts. Kept inline so this Node-side plugin does not
// import the React/MDX registry. Data docs are owned by content-docs; agent
// and rl still render a coming-soon teaser at `/docs/<product>`.

const vaneRoutesPlugin: PluginModule = () => {
  return {
    name: 'vane-routes',
    contentLoaded({ actions }) {
      const { addRoute } = actions

      addRoute({
        path: '/',
        component: '@site/src/pages/Home.tsx',
        exact: true,
      })

      addRoute({
        path: '/use-cases',
        component: '@site/src/pages/UseCases.tsx',
        exact: true,
      })

      addRoute({
        path: '/use-cases/training',
        component: '@site/src/pages/TrainingUseCase.tsx',
        exact: true,
      })

      addRoute({
        path: '/use-cases/enterprise-agent',
        component: '@site/src/pages/EnterpriseAgentUseCase.tsx',
        exact: true,
      })

      addRoute({
        path: '/benchmarks',
        component: '@site/src/pages/Benchmarks.tsx',
        exact: true,
      })

      addRoute({
        path: '/blog',
        component: '@site/src/pages/Blog.tsx',
        exact: true,
      })

      addRoute({
        path: '/contact',
        component: '@site/src/pages/Contact.tsx',
        exact: true,
      })

      const docsRoute = (path: string) =>
        addRoute({ path, component: '@site/src/pages/Docs.tsx', exact: true })

      ;['data'].forEach((product) => {
        LEGACY_DOC_SLUG_LIST.forEach((slug) => docsRoute(`/docs/${product}/${slug}`))
      })
      LEGACY_DOC_SLUG_LIST.forEach((slug) => docsRoute(`/docs/${slug}`))

      docsRoute('/docs/agent')
      docsRoute('/docs/rl')
      docsRoute('/docs')
    },
  }
}

export default vaneRoutesPlugin
