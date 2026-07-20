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
  tutorials: {
    source: 'docs/data/tutorials/index.mdx',
    title: 'Overview',
    titleZh: '概览',
  },
  'tutorials/examples/common-crawl': {
    source: 'docs/data/tutorials/examples/common-crawl.mdx',
    title: 'Working with Common Crawl',
    titleZh: '处理 Common Crawl 数据',
  },
  'tutorials/examples/minhash-dedupe': {
    source: 'docs/data/tutorials/examples/minhash-dedupe.mdx',
    title: 'MinHash Text Deduplication',
    titleZh: 'MinHash 文本去重',
  },
  'tutorials/examples/llms-red-pajamas': {
    source: 'docs/data/tutorials/examples/llms-red-pajamas.mdx',
    title: 'Semantic Search on Red Pajamas',
    titleZh: 'Red Pajamas 语义检索',
  },
  'tutorials/examples/querying-images': {
    source: 'docs/data/tutorials/examples/querying-images.mdx',
    title: 'Querying Image Data',
    titleZh: '查询图像数据',
  },
  'tutorials/examples/image-generation': {
    source: 'docs/data/tutorials/examples/image-generation.mdx',
    title: 'Generating Images from Text',
    titleZh: '从文本生成图像',
  },
  'tutorials/examples/voice-ai-analytics': {
    source: 'docs/data/tutorials/examples/voice-ai-analytics.mdx',
    title: 'Voice AI Analytics',
    titleZh: '语音 AI 分析',
  },
  'tutorials/examples/multimodal-structured-outputs': {
    source: 'docs/data/tutorials/examples/multimodal-structured-outputs.mdx',
    title: 'Multimodal Structured Outputs',
    titleZh: '多模态结构化输出',
  },
  'tutorials/use-cases/claims-disposition': {
    source: 'docs/data/tutorials/use-cases/claims-disposition.mdx',
    title: 'Claims Disposition from Multimodal Evidence',
    titleZh: '基于多模态证据的理赔处置',
  },
  'tutorials/use-cases/enterprise-agent-evidence': {
    source: 'docs/data/tutorials/use-cases/enterprise-agent-evidence.mdx',
    title: 'Governing Evidence for Enterprise Agents',
    titleZh: '企业 Agent 证据治理',
  },
  'tutorials/use-cases/multimodal-training-data': {
    source: 'docs/data/tutorials/use-cases/multimodal-training-data.mdx',
    title: 'Building a Multimodal Training Release',
    titleZh: '构建多模态训练数据发布集',
  },
  'tutorials/use-cases/procurement-compliance-audit': {
    source: 'docs/data/tutorials/use-cases/procurement-compliance-audit.mdx',
    title: 'Procurement Compliance Audit',
    titleZh: '采购合规审计',
  },
  'tutorials/use-cases/web-text-deduplication': {
    source: 'docs/data/tutorials/use-cases/web-text-deduplication.mdx',
    title: 'Web Text Deduplication with Global LSH',
    titleZh: '基于全局 LSH 的网页文本去重',
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
      key?: string
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
  Tutorials: '教程',
  Examples: '示例',
  'Use cases': '端到端用例',
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
