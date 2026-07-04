import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildManifest, sidebarSlugs } from '../scripts/docs-utils.mjs'

test('sidebarSlugs returns nested doc slugs in navigation order', () => {
  const sidebar = [
    {
      group: 'Guides',
      items: [
        {
          group: 'Data Ingestion',
          items: [
            { slug: 'guides/multimodal-ingest' },
            { slug: 'guides/structured-data-load' },
          ],
        },
        {
          group: 'Data Transformation',
          items: [
            { slug: 'guides/custom-python-udfs' },
          ],
        },
      ],
    },
  ]

  assert.deepEqual(sidebarSlugs(sidebar, 'sidebar.data.json'), [
    'guides/multimodal-ingest',
    'guides/structured-data-load',
    'guides/custom-python-udfs',
  ])
})

test('buildManifest preserves nested sidebar groups and orders pages recursively', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'vane-docs-sidebar-'))

  try {
    mkdirSync(path.join(root, 'src/docs'), { recursive: true })
    mkdirSync(path.join(root, 'docs/guides'), { recursive: true })

    writeFileSync(
      path.join(root, 'src/docs/registry.ts'),
      `
export const DOCS_PAGES = {
  'guides/multimodal-ingest': {
    source: 'docs/guides/multimodal-ingest.mdx',
    title: 'Multimodal Ingest',
  },
  'guides/structured-data-load': {
    source: 'docs/guides/structured-data-load.mdx',
    title: 'Structured Data Load',
  },
  'guides/custom-python-udfs': {
    source: 'docs/guides/custom-python-udfs.mdx',
    title: 'Custom Python UDFs',
  },
} satisfies Record<string, DocPage>
`,
    )

    writeFileSync(
      path.join(root, 'src/docs/sidebar.data.json'),
      JSON.stringify([
        {
          group: 'Guides',
          items: [
            {
              group: 'Data Ingestion',
              items: [
                { slug: 'guides/multimodal-ingest' },
                { slug: 'guides/structured-data-load' },
              ],
            },
            {
              group: 'Data Transformation',
              items: [
                { slug: 'guides/custom-python-udfs' },
              ],
            },
          ],
        },
      ]),
    )

    writeFileSync(
      path.join(root, 'docs/guides/multimodal-ingest.mdx'),
      '---\ntitle: Multimodal Ingest\n---\n',
    )
    writeFileSync(
      path.join(root, 'docs/guides/structured-data-load.mdx'),
      '---\ntitle: Structured Data Load\n---\n',
    )
    writeFileSync(
      path.join(root, 'docs/guides/custom-python-udfs.mdx'),
      '---\ntitle: Custom Python UDFs\n---\n',
    )

    const manifest = buildManifest({
      root,
      registryPath: path.join(root, 'src/docs/registry.ts'),
      sidebarPath: path.join(root, 'src/docs/sidebar.data.json'),
    })

    assert.deepEqual(
      manifest.pages.map((page) => page.slug),
      [
        'guides/multimodal-ingest',
        'guides/structured-data-load',
        'guides/custom-python-udfs',
      ],
    )
    assert.deepEqual(manifest.sidebar, [
      {
        group: 'Guides',
        items: [
          {
            group: 'Data Ingestion',
            items: [
              {
                slug: 'guides/multimodal-ingest',
                label: 'Multimodal Ingest',
                route: '/docs/data/guides/multimodal-ingest',
              },
              {
                slug: 'guides/structured-data-load',
                label: 'Structured Data Load',
                route: '/docs/data/guides/structured-data-load',
              },
            ],
          },
          {
            group: 'Data Transformation',
            items: [
              {
                slug: 'guides/custom-python-udfs',
                label: 'Custom Python UDFs',
                route: '/docs/data/guides/custom-python-udfs',
              },
            ],
          },
        ],
      },
    ])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
