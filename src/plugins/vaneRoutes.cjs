const docsSidebar = require('../docs/sidebar.json')

const docsSlugs = docsSidebar.flatMap((group) =>
  group.items.map((item) => item.slug).filter(Boolean),
)

function vaneRoutesPlugin() {
  return {
    name: 'vane-routes',
    async contentLoaded({ actions }) {
      const { addRoute } = actions

      addRoute({
        path: '/',
        component: '@site/src/pages/Home.jsx',
        exact: true,
      })

      addRoute({
        path: '/use-cases',
        component: '@site/src/pages/UseCases.jsx',
        exact: true,
      })

      addRoute({
        path: '/benchmarks',
        component: '@site/src/pages/Benchmarks.jsx',
        exact: true,
      })

      docsSlugs.forEach((slug) => {
        addRoute({
          path: `/docs/${slug}`,
          component: '@site/src/pages/Docs.jsx',
          exact: true,
        })
      })

      addRoute({
        path: '/docs',
        component: '@site/src/pages/Docs.jsx',
        exact: true,
      })
    },
  }
}

module.exports = vaneRoutesPlugin
