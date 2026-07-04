import type {ComponentType} from 'react'
import docsSidebar from './sidebar.data.json'

import DocsHome from '../../docs/index.mdx'
import ConceptAiFunctionsDoc from '../../docs/concepts/ai-functions.mdx'
import ArchitectureDoc from '../../docs/concepts/architecture.mdx'
import ExecutionModelDoc from '../../docs/concepts/execution-model.mdx'
import SqlVsPythonDoc from '../../docs/concepts/sql-vs-python.mdx'
import UdfsDoc from '../../docs/concepts/udfs.mdx'
import ContributingDevelopmentDoc from '../../docs/contributing/development.mdx'
import RayClusterDoc from '../../docs/deploy/ray-cluster.mdx'
import SizingDoc from '../../docs/deploy/sizing.mdx'
import SingleNodeDoc from '../../docs/deploy/single-node.mdx'
import ExamplesHome from '../../docs/examples/index.mdx'
import InsuranceDocumentAuditDoc from '../../docs/examples/insurance-document-audit.mdx'
import MultimodalDataLakeDoc from '../../docs/examples/multimodal-data-lake.mdx'
import TenderComplianceCheckDoc from '../../docs/examples/tender-compliance-check.mdx'
import TrainingDataPipelineDoc from '../../docs/examples/training-data-pipeline.mdx'
import GuideAiFunctionsDoc from '../../docs/guides/ai-functions.mdx'
import CustomPythonUdfsDoc from '../../docs/guides/custom-python-udfs.mdx'
import EmbeddingsAtScaleDoc from '../../docs/guides/embeddings-at-scale.mdx'
import GpuInferenceDoc from '../../docs/guides/gpu-inference.mdx'
import MultimodalIngestDoc from '../../docs/guides/multimodal-ingest.mdx'
import MultimodalPipelineDoc from '../../docs/guides/multimodal-pipeline.mdx'
import PerformanceTuningDoc from '../../docs/guides/performance-tuning.mdx'
import StructuredDataLoadDoc from '../../docs/guides/structured-data-load.mdx'
import StructuredTransformationDoc from '../../docs/guides/structured-transformation.mdx'
import InstallationDoc from '../../docs/quickstart/installation.mdx'
import WhatIsVaneDoc from '../../docs/quickstart/what-is-vane-data.mdx'
import QuickstartDoc from '../../docs/quickstart/quickstart.mdx'

export type DocPage = {
  Component: ComponentType
  source: string
  title: string
}

export const DOCS_PAGES = {
  index: {
    Component: DocsHome,
    source: 'docs/index.mdx',
    title: 'Vane Data Docs',
  },
  'quickstart/what-is-vane-data': {
    Component: WhatIsVaneDoc,
    source: 'docs/quickstart/what-is-vane-data.mdx',
    title: 'What Is Vane Data?',
  },
  'quickstart/installation': {
    Component: InstallationDoc,
    source: 'docs/quickstart/installation.mdx',
    title: 'Installation',
  },
  'quickstart/quickstart': {
    Component: QuickstartDoc,
    source: 'docs/quickstart/quickstart.mdx',
    title: 'Quickstart',
  },
  'concepts/architecture': {
    Component: ArchitectureDoc,
    source: 'docs/concepts/architecture.mdx',
    title: 'Architecture',
  },
  'concepts/execution-model': {
    Component: ExecutionModelDoc,
    source: 'docs/concepts/execution-model.mdx',
    title: 'Execution Model',
  },
  'concepts/sql-vs-python': {
    Component: SqlVsPythonDoc,
    source: 'docs/concepts/sql-vs-python.mdx',
    title: 'SQL vs Python',
  },
  'concepts/udfs': {
    Component: UdfsDoc,
    source: 'docs/concepts/udfs.mdx',
    title: 'UDFs',
  },
  'concepts/ai-functions': {
    Component: ConceptAiFunctionsDoc,
    source: 'docs/concepts/ai-functions.mdx',
    title: 'AI Functions',
  },
  'guides/multimodal-ingest': {
    Component: MultimodalIngestDoc,
    source: 'docs/guides/multimodal-ingest.mdx',
    title: 'Multimodal Ingest',
  },
  'guides/structured-data-load': {
    Component: StructuredDataLoadDoc,
    source: 'docs/guides/structured-data-load.mdx',
    title: 'Structured Data Load',
  },
  'guides/custom-python-udfs': {
    Component: CustomPythonUdfsDoc,
    source: 'docs/guides/custom-python-udfs.mdx',
    title: 'Custom Python UDFs',
  },
  'guides/multimodal-pipeline': {
    Component: MultimodalPipelineDoc,
    source: 'docs/guides/multimodal-pipeline.mdx',
    title: 'Multimodal Pipeline',
  },
  'guides/structured-transformation': {
    Component: StructuredTransformationDoc,
    source: 'docs/guides/structured-transformation.mdx',
    title: 'Structured Transformation',
  },
  'guides/ai-functions': {
    Component: GuideAiFunctionsDoc,
    source: 'docs/guides/ai-functions.mdx',
    title: 'AI Functions',
  },
  'guides/gpu-inference': {
    Component: GpuInferenceDoc,
    source: 'docs/guides/gpu-inference.mdx',
    title: 'GPU Inference',
  },
  'guides/embeddings-at-scale': {
    Component: EmbeddingsAtScaleDoc,
    source: 'docs/guides/embeddings-at-scale.mdx',
    title: 'Embeddings at Scale',
  },
  'guides/performance-tuning': {
    Component: PerformanceTuningDoc,
    source: 'docs/guides/performance-tuning.mdx',
    title: 'Performance Tuning',
  },
  examples: {
    Component: ExamplesHome,
    source: 'docs/examples/index.mdx',
    title: 'Examples',
  },
  'examples/training-data-pipeline': {
    Component: TrainingDataPipelineDoc,
    source: 'docs/examples/training-data-pipeline.mdx',
    title: 'Training Data Pipeline',
  },
  'examples/insurance-document-audit': {
    Component: InsuranceDocumentAuditDoc,
    source: 'docs/examples/insurance-document-audit.mdx',
    title: 'Insurance Document Audit',
  },
  'examples/tender-compliance-check': {
    Component: TenderComplianceCheckDoc,
    source: 'docs/examples/tender-compliance-check.mdx',
    title: 'Tender Compliance Check',
  },
  'examples/multimodal-data-lake': {
    Component: MultimodalDataLakeDoc,
    source: 'docs/examples/multimodal-data-lake.mdx',
    title: 'Multimodal Data Lake',
  },
  'deploy/single-node': {
    Component: SingleNodeDoc,
    source: 'docs/deploy/single-node.mdx',
    title: 'Single Node',
  },
  'deploy/ray-cluster': {
    Component: RayClusterDoc,
    source: 'docs/deploy/ray-cluster.mdx',
    title: 'Ray Cluster',
  },
  'deploy/sizing': {
    Component: SizingDoc,
    source: 'docs/deploy/sizing.mdx',
    title: 'Sizing',
  },
  'contributing/development': {
    Component: ContributingDevelopmentDoc,
    source: 'docs/contributing/development.mdx',
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
