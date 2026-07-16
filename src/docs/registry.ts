import docsSidebar from './sidebar.data.json'
import type {SiteLocale} from '../siteI18n'

export type DocPage = {
  source: string
  title: string
  titleZh: string
}

export const DOCS_PAGES = {
  index: {
    source: 'docs/data/index.mdx',
    title: 'Overview',
    titleZh: '概览',
  },
  'quickstart/installation': {
    source: 'docs/data/quickstart/installation.mdx',
    title: 'Installation',
    titleZh: '安装',
  },
  'quickstart/quickstart': {
    source: 'docs/data/quickstart/quickstart.mdx',
    title: 'Quickstart',
    titleZh: '快速开始',
  },
  'concepts/sql-vs-python': {
    source: 'docs/data/concepts/sql-vs-python.mdx',
    title: 'SQL vs Python',
    titleZh: 'SQL 与 Python',
  },
  'concepts/udfs': {
    source: 'docs/data/concepts/udfs.mdx',
    title: 'UDFs',
    titleZh: 'UDF',
  },
  'concepts/ai-functions': {
    source: 'docs/data/concepts/ai-functions.mdx',
    title: 'AI Functions',
    titleZh: 'AI 函数',
  },
  examples: {
    source: 'docs/data/examples/index.mdx',
    title: 'Examples',
    titleZh: '示例',
  },
  'examples/training-data-pipeline': {
    source: 'docs/data/examples/training-data-pipeline.mdx',
    title: 'Training Data Pipeline',
    titleZh: '训练数据流水线',
  },
  'examples/insurance-document-audit': {
    source: 'docs/data/examples/insurance-document-audit.mdx',
    title: 'Insurance Document Audit',
    titleZh: '保险文档审计',
  },
  'examples/tender-compliance-check': {
    source: 'docs/data/examples/tender-compliance-check.mdx',
    title: 'Tender Compliance Check',
    titleZh: '招标合规检查',
  },
  'examples/multimodal-data-lake': {
    source: 'docs/data/examples/multimodal-data-lake.mdx',
    title: 'Multimodal Data Lake',
    titleZh: '多模态数据湖',
  },
  'deploy/deployment': {
    source: 'docs/data/deploy/deployment.mdx',
    title: 'Deployment',
    titleZh: '部署',
  },
  'contributing/development': {
    source: 'docs/data/contributing/development.mdx',
    title: 'Development',
    titleZh: '开发',
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
  items: DocsSidebarEntry[]
}

export type DocsSidebarEntry = DocsSidebarItem | DocsSidebarGroup

export const DOCS_SIDEBAR = docsSidebar as DocsSidebarEntry[]

export function isDocsSidebarGroup(entry: DocsSidebarEntry): entry is DocsSidebarGroup {
  return 'group' in entry
}

function collectSidebarSlugs(entries: DocsSidebarEntry[]): DocSlug[] {
  return entries.flatMap((entry) =>
    isDocsSidebarGroup(entry)
      ? collectSidebarSlugs(entry.items)
      : entry.slug
        ? [entry.slug]
        : [],
  )
}

const sidebarSlugs = collectSidebarSlugs(DOCS_SIDEBAR)

if (process.env.NODE_ENV === 'development') {
  sidebarSlugs
    .filter((slug) => !DOCS_PAGES[slug])
    .forEach((slug) => console.warn(`docs sidebar: no page registered for slug "${slug}"`))
}

export const DOCS_ORDER = sidebarSlugs.filter((slug) => DOCS_PAGES[slug])
export const DEFAULT_DOC_SLUG: DocSlug = 'index'

export function isDocSlug(slug: string | undefined): slug is DocSlug {
  return Boolean(slug && slug in DOCS_PAGES)
}

const DOC_GROUP_LABELS_ZH: Record<string, string> = {
  'Getting Started': '快速开始',
  Concepts: '核心概念',
  Examples: '示例',
  Operations: '运维',
  Contributing: '贡献',
}

export function docPageTitle(slug: DocSlug, locale: SiteLocale) {
  const page = DOCS_PAGES[slug]
  return locale === 'zh-CN' ? page.titleZh : page.title
}

export function docGroupLabel(group: string, locale: SiteLocale) {
  return locale === 'zh-CN' ? DOC_GROUP_LABELS_ZH[group] ?? group : group
}

export function getDocGroupPath(slug: DocSlug) {
  const find = (entries: DocsSidebarEntry[], path: string[]): string[] | undefined => {
    for (const entry of entries) {
      if (isDocsSidebarGroup(entry)) {
        const nextPath = [...path, entry.group]
        const found = find(entry.items, nextPath)
        if (found) return found
      } else if (entry.slug === slug) {
        return path
      }
    }
    return undefined
  }

  return find(DOCS_SIDEBAR, [])
}

export function getDocGroup(slug: DocSlug) {
  return getDocGroupPath(slug)?.join(' / ')
}
