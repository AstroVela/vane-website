import type {ComponentType} from 'react'
import docsSidebar from './sidebar.data.json'

import DocsHome from '../../docs/data/index.mdx'
import ConceptAiFunctionsDoc from '../../docs/data/concepts/ai-functions.mdx'
import ArchitectureDoc from '../../docs/data/concepts/architecture.mdx'
import ExecutionModelDoc from '../../docs/data/concepts/execution-model.mdx'
import SqlVsPythonDoc from '../../docs/data/concepts/sql-vs-python.mdx'
import UdfsDoc from '../../docs/data/concepts/udfs.mdx'
import ContributingDevelopmentDoc from '../../docs/data/contributing/development.mdx'
import RayClusterDoc from '../../docs/data/deploy/ray-cluster.mdx'
import SizingDoc from '../../docs/data/deploy/sizing.mdx'
import SingleNodeDoc from '../../docs/data/deploy/single-node.mdx'
import ExamplesHome from '../../docs/data/examples/index.mdx'
import InsuranceDocumentAuditDoc from '../../docs/data/examples/insurance-document-audit.mdx'
import MultimodalDataLakeDoc from '../../docs/data/examples/multimodal-data-lake.mdx'
import TenderComplianceCheckDoc from '../../docs/data/examples/tender-compliance-check.mdx'
import TrainingDataPipelineDoc from '../../docs/data/examples/training-data-pipeline.mdx'
import GuideAiFunctionsDoc from '../../docs/data/guides/ai-functions.mdx'
import CustomPythonUdfsDoc from '../../docs/data/guides/custom-python-udfs.mdx'
import EmbeddingsAtScaleDoc from '../../docs/data/guides/embeddings-at-scale.mdx'
import GpuInferenceDoc from '../../docs/data/guides/gpu-inference.mdx'
import MultimodalIngestDoc from '../../docs/data/guides/multimodal-ingest.mdx'
import MultimodalPipelineDoc from '../../docs/data/guides/multimodal-pipeline.mdx'
import PerformanceTuningDoc from '../../docs/data/guides/performance-tuning.mdx'
import StructuredDataLoadDoc from '../../docs/data/guides/structured-data-load.mdx'
import StructuredTransformationDoc from '../../docs/data/guides/structured-transformation.mdx'
import InstallationDoc from '../../docs/data/quickstart/installation.mdx'
import QuickstartDoc from '../../docs/data/quickstart/quickstart.mdx'
import WhatIsVaneDoc from '../../docs/data/quickstart/what-is-vane-data.mdx'

export type DocPage = {
  Component: ComponentType
  source: string
  title: string
}

export const DOCS_PAGES = {
  index: {
    Component: DocsHome,
    source: 'docs/data/index.mdx',
    title: 'Vane Data Docs',
  },
  'quickstart/what-is-vane-data': {
    Component: WhatIsVaneDoc,
    source: 'docs/data/quickstart/what-is-vane-data.mdx',
    title: 'What Is Vane Data?',
  },
  'quickstart/installation': {
    Component: InstallationDoc,
    source: 'docs/data/quickstart/installation.mdx',
    title: 'Installation',
  },
  'quickstart/quickstart': {
    Component: QuickstartDoc,
    source: 'docs/data/quickstart/quickstart.mdx',
    title: 'Quickstart',
  },
  'concepts/architecture': {
    Component: ArchitectureDoc,
    source: 'docs/data/concepts/architecture.mdx',
    title: 'Architecture',
  },
  'concepts/execution-model': {
    Component: ExecutionModelDoc,
    source: 'docs/data/concepts/execution-model.mdx',
    title: 'Execution Model',
  },
  'concepts/sql-vs-python': {
    Component: SqlVsPythonDoc,
    source: 'docs/data/concepts/sql-vs-python.mdx',
    title: 'SQL vs Python',
  },
  'concepts/udfs': {
    Component: UdfsDoc,
    source: 'docs/data/concepts/udfs.mdx',
    title: 'UDFs',
  },
  'concepts/ai-functions': {
    Component: ConceptAiFunctionsDoc,
    source: 'docs/data/concepts/ai-functions.mdx',
    title: 'AI Functions',
  },
  'guides/multimodal-ingest': {
    Component: MultimodalIngestDoc,
    source: 'docs/data/guides/multimodal-ingest.mdx',
    title: 'Multimodal Ingest',
  },
  'guides/structured-data-load': {
    Component: StructuredDataLoadDoc,
    source: 'docs/data/guides/structured-data-load.mdx',
    title: 'Structured Data Load',
  },
  'guides/custom-python-udfs': {
    Component: CustomPythonUdfsDoc,
    source: 'docs/data/guides/custom-python-udfs.mdx',
    title: 'Custom Python UDFs',
  },
  'guides/multimodal-pipeline': {
    Component: MultimodalPipelineDoc,
    source: 'docs/data/guides/multimodal-pipeline.mdx',
    title: 'Multimodal Pipeline',
  },
  'guides/structured-transformation': {
    Component: StructuredTransformationDoc,
    source: 'docs/data/guides/structured-transformation.mdx',
    title: 'Structured Transformation',
  },
  'guides/ai-functions': {
    Component: GuideAiFunctionsDoc,
    source: 'docs/data/guides/ai-functions.mdx',
    title: 'AI Functions',
  },
  'guides/gpu-inference': {
    Component: GpuInferenceDoc,
    source: 'docs/data/guides/gpu-inference.mdx',
    title: 'GPU Inference',
  },
  'guides/embeddings-at-scale': {
    Component: EmbeddingsAtScaleDoc,
    source: 'docs/data/guides/embeddings-at-scale.mdx',
    title: 'Embeddings at Scale',
  },
  'guides/performance-tuning': {
    Component: PerformanceTuningDoc,
    source: 'docs/data/guides/performance-tuning.mdx',
    title: 'Performance Tuning',
  },
  examples: {
    Component: ExamplesHome,
    source: 'docs/data/examples/index.mdx',
    title: 'Examples',
  },
  'examples/training-data-pipeline': {
    Component: TrainingDataPipelineDoc,
    source: 'docs/data/examples/training-data-pipeline.mdx',
    title: 'Training Data Pipeline',
  },
  'examples/insurance-document-audit': {
    Component: InsuranceDocumentAuditDoc,
    source: 'docs/data/examples/insurance-document-audit.mdx',
    title: 'Insurance Document Audit',
  },
  'examples/tender-compliance-check': {
    Component: TenderComplianceCheckDoc,
    source: 'docs/data/examples/tender-compliance-check.mdx',
    title: 'Tender Compliance Check',
  },
  'examples/multimodal-data-lake': {
    Component: MultimodalDataLakeDoc,
    source: 'docs/data/examples/multimodal-data-lake.mdx',
    title: 'Multimodal Data Lake',
  },
  'deploy/single-node': {
    Component: SingleNodeDoc,
    source: 'docs/data/deploy/single-node.mdx',
    title: 'Single Node',
  },
  'deploy/ray-cluster': {
    Component: RayClusterDoc,
    source: 'docs/data/deploy/ray-cluster.mdx',
    title: 'Ray Cluster',
  },
  'deploy/sizing': {
    Component: SizingDoc,
    source: 'docs/data/deploy/sizing.mdx',
    title: 'Sizing',
  },
  'contributing/development': {
    Component: ContributingDevelopmentDoc,
    source: 'docs/data/contributing/development.mdx',
    title: 'Development',
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

export const DOCS_SIDEBAR = docsSidebar as DocsSidebarGroup[]

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
