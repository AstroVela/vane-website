import type {ComponentType} from 'react'
import docsSidebar from './sidebar.json'

import AiFunctionsDoc, { title as aiFunctionsTitle } from '../../docs/api/ai-functions.mdx'
import MapBatchesDoc, { title as mapBatchesTitle } from '../../docs/api/map-batches.mdx'
import SqlApiDoc, { title as sqlApiTitle } from '../../docs/api/sql-api.mdx'
import UdfActorsDoc, { title as udfActorsTitle } from '../../docs/api/udf-actors.mdx'
import RayRunnerDoc, { title as rayRunnerTitle } from '../../docs/execution/ray-runner.mdx'
import ConfigurationDoc, { title as configurationTitle } from '../../docs/getting-started/configuration.mdx'
import InstallationDoc, { title as installationTitle } from '../../docs/getting-started/installation.mdx'
import QuickstartDoc, { title as quickstartTitle } from '../../docs/getting-started/quickstart.mdx'
import TroubleshootingDoc, { title as troubleshootingTitle } from '../../docs/resources/troubleshooting.mdx'

export type DocPage = {
  Component: ComponentType
  source: string
  title: string
}

export const DOCS_PAGES = {
  'ai-functions': {
    Component: AiFunctionsDoc,
    source: 'docs/api/ai-functions.mdx',
    title: aiFunctionsTitle,
  },
  configuration: {
    Component: ConfigurationDoc,
    source: 'docs/getting-started/configuration.mdx',
    title: configurationTitle,
  },
  installation: {
    Component: InstallationDoc,
    source: 'docs/getting-started/installation.mdx',
    title: installationTitle,
  },
  'map-batches': {
    Component: MapBatchesDoc,
    source: 'docs/api/map-batches.mdx',
    title: mapBatchesTitle,
  },
  quickstart: {
    Component: QuickstartDoc,
    source: 'docs/getting-started/quickstart.mdx',
    title: quickstartTitle,
  },
  'ray-runner': {
    Component: RayRunnerDoc,
    source: 'docs/execution/ray-runner.mdx',
    title: rayRunnerTitle,
  },
  'sql-api': {
    Component: SqlApiDoc,
    source: 'docs/api/sql-api.mdx',
    title: sqlApiTitle,
  },
  troubleshooting: {
    Component: TroubleshootingDoc,
    source: 'docs/resources/troubleshooting.mdx',
    title: troubleshootingTitle,
  },
  'udf-actors': {
    Component: UdfActorsDoc,
    source: 'docs/api/udf-actors.mdx',
    title: udfActorsTitle,
  },
} satisfies Record<string, DocPage>

export type DocSlug = keyof typeof DOCS_PAGES

export type DocsSidebarItem =
  | {
      slug: DocSlug
      label?: string
      to?: never
    }
  | {
      to: string
      label: string
      slug?: never
    }

export type DocsSidebarGroup = {
  group: string
  items: DocsSidebarItem[]
}

export const DOCS_SIDEBAR = docsSidebar as DocsSidebarGroup[]

const sidebarSlugs = DOCS_SIDEBAR.flatMap((group) =>
  group.items
    .map((item) => item.slug)
    .filter((slug): slug is DocSlug => Boolean(slug)),
)

if (process.env.NODE_ENV === 'development') {
  sidebarSlugs
    .filter((slug) => !DOCS_PAGES[slug])
    .forEach((slug) => console.warn(`docs sidebar: no page registered for slug "${slug}"`))
}

export const DOCS_ORDER = sidebarSlugs.filter((slug) => DOCS_PAGES[slug])
export const DEFAULT_DOC_SLUG = DOCS_ORDER[0]

export function isDocSlug(slug: string | undefined): slug is DocSlug {
  return Boolean(slug && slug in DOCS_PAGES)
}

export function getDocGroup(slug: DocSlug) {
  return DOCS_SIDEBAR.find((group) => group.items.some((item) => item.slug === slug))?.group
}
