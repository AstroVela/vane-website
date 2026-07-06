import type {PluginModule} from '@docusaurus/types'
import { LEGACY_DOC_SLUG_LIST } from '../docs/legacySlugs'

// Mirror src/docs/products.ts. Kept inline so this Node-side plugin does not
// import the React/MDX registry. Data docs are owned by content-docs; agent
// and rl still render a coming-soon teaser at `/docs/<product>`.

function localizedPath(baseUrl: string, path: string) {
  if (path === '/') return baseUrl
  return `/${[baseUrl, path].join('/').split('/').filter(Boolean).join('/')}`
}

const vaneRoutesPlugin: PluginModule = (context) => {
  return {
    name: 'vane-routes',
    contentLoaded({ actions }) {
      const { addRoute } = actions
      const routePath = (path: string) => localizedPath(context.baseUrl, path)

      addRoute({
        path: routePath('/'),
        component: '@site/src/pages/Home.tsx',
        exact: true,
      })

      addRoute({
        path: routePath('/use-cases'),
        component: '@site/src/pages/UseCases.tsx',
        exact: true,
      })

      addRoute({
        path: routePath('/use-cases/training'),
        component: '@site/src/pages/TrainingUseCase.tsx',
        exact: true,
      })

      addRoute({
        path: routePath('/use-cases/enterprise-agent'),
        component: '@site/src/pages/EnterpriseAgentUseCase.tsx',
        exact: true,
      })

      addRoute({
        path: routePath('/benchmarks'),
        component: '@site/src/pages/Benchmarks.tsx',
        exact: true,
      })

      addRoute({
        path: routePath('/blog'),
        component: '@site/src/pages/Blog.tsx',
        exact: true,
      })

      addRoute({
        path: routePath('/contact'),
        component: '@site/src/pages/Contact.tsx',
        exact: true,
      })

      const docsRoute = (path: string) =>
        addRoute({ path: routePath(path), component: '@site/src/pages/Docs.tsx', exact: true })

      LEGACY_DOC_SLUG_LIST.forEach((slug) => docsRoute(`/docs/data/${slug}`))
      LEGACY_DOC_SLUG_LIST.forEach((slug) => docsRoute(`/docs/${slug}`))

      docsRoute('/docs/agent')
      docsRoute('/docs/rl')
      docsRoute('/docs')
    },
  }
}

export default vaneRoutesPlugin
