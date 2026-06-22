/* Sidebar structure for the docs section, co-located with the page files.

   Internal items carry a `slug` that maps to src/content/docs/<slug>.mdx and the
   route /docs/<slug>; the sidebar label and page <h1> come from that file's
   exported `title`, so renaming a page updates the nav automatically.

   The grouping, ordering, and the external route links (Examples, Benchmarks)
   are editorial choices that can't be derived from the pages, so they stay
   declared here. */
export const DOCS_NAV = [
  {
    group: 'Getting Started',
    items: [{ slug: 'quickstart' }, { slug: 'installation' }, { slug: 'configuration' }],
  },
  {
    group: 'Execution',
    items: [{ slug: 'ray-runner' }],
  },
  {
    group: 'API',
    items: [{ slug: 'sql-api' }, { slug: 'map-batches' }, { slug: 'ai-functions' }, { slug: 'udf-actors' }],
  },
  {
    group: 'Resources',
    items: [
      { to: '/use-cases', label: 'Examples' },
      { to: '/benchmarks', label: 'Benchmarks' },
      { slug: 'troubleshooting' },
    ],
  },
]
