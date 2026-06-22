import type {PluginModule} from '@docusaurus/types'
import docsSidebar from '../docs/sidebar.json'

type SidebarItem = {
  slug?: string
  to?: string
  label?: string
}

type SidebarGroup = {
  group: string
  items: SidebarItem[]
}

const docsSlugs = (docsSidebar as SidebarGroup[]).flatMap((group) =>
  group.items.map((item) => item.slug).filter(Boolean),
)

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

      docsSlugs.forEach((slug) => {
        addRoute({
          path: `/docs/${slug}`,
          component: '@site/src/pages/Docs.tsx',
          exact: true,
        })
      })

      addRoute({
        path: '/docs',
        component: '@site/src/pages/Docs.tsx',
        exact: true,
      })
    },
  }
}

export default vaneRoutesPlugin
