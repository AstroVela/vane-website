import type {PluginModule} from '@docusaurus/types'
import dataSidebar from '../docs/sidebar.data.json'

type SidebarItem = {
  slug?: string
  to?: string
  label?: string
}

type SidebarGroup = {
  group: string
  items: SidebarItem[]
}

const dataSlugs = (dataSidebar as SidebarGroup[]).flatMap((group) =>
  group.items.map((item) => item.slug).filter((slug): slug is string => Boolean(slug)),
)

// Mirror src/docs/products.ts. Kept inline so this Node-side plugin does not
// import the React/MDX registry. `data` is the only live product today; agent
// and rl render a coming-soon teaser at `/docs/<product>`.
const LIVE_PRODUCTS = ['data']
const SOON_PRODUCTS = ['agent', 'rl']

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
        path: '/benchmarks',
        component: '@site/src/pages/Benchmarks.tsx',
        exact: true,
      })

      addRoute({
        path: '/blog',
        component: '@site/src/pages/Blog.tsx',
        exact: true,
      })

      const docsRoute = (path: string) =>
        addRoute({ path, component: '@site/src/pages/Docs.tsx', exact: true })

      // Live products: `/docs/<product>/<slug...>` plus a `/docs/<product>` index.
      LIVE_PRODUCTS.forEach((product) => {
        docsRoute(`/docs/${product}`)
        dataSlugs.forEach((slug) => docsRoute(`/docs/${product}/${slug}`))
      })

      // Coming-soon products: a single teaser route.
      SOON_PRODUCTS.forEach((product) => docsRoute(`/docs/${product}`))

      // Legacy `/docs/<slug...>` links keep working (resolve to the default product).
      dataSlugs.forEach((slug) => docsRoute(`/docs/${slug}`))

      docsRoute('/docs')
    },
  }
}

export default vaneRoutesPlugin
