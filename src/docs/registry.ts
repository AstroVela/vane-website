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
import DedupAndCleanDoc from '../../docs/guides/dedup-and-clean.mdx'
import DorisIntegrationDoc from '../../docs/guides/doris-integration.mdx'
import EmbeddingsAtScaleDoc from '../../docs/guides/embeddings-at-scale.mdx'
import GpuInferenceUdfDoc from '../../docs/guides/gpu-inference-udf.mdx'
import IcebergLakehouseDoc from '../../docs/guides/iceberg-lakehouse.mdx'
import MultimodalIngestDoc from '../../docs/guides/multimodal-ingest.mdx'
import PerformanceTuningDoc from '../../docs/guides/performance-tuning.mdx'
import SqlMultimodalPipelineDoc from '../../docs/guides/sql-multimodal-pipeline.mdx'
import InstallationDoc from '../../docs/quickstart/installation.mdx'
import QuickstartPythonDoc from '../../docs/quickstart/quickstart-python.mdx'
import QuickstartSqlDoc from '../../docs/quickstart/quickstart-sql.mdx'
import WhatIsVaneDoc from '../../docs/quickstart/what-is-vane.mdx'

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
  'quickstart/what-is-vane': {
    Component: WhatIsVaneDoc,
    source: 'docs/quickstart/what-is-vane.mdx',
    title: 'What Is Vane?',
  },
  'quickstart/installation': {
    Component: InstallationDoc,
    source: 'docs/quickstart/installation.mdx',
    title: 'Installation',
  },
  'quickstart/quickstart-sql': {
    Component: QuickstartSqlDoc,
    source: 'docs/quickstart/quickstart-sql.mdx',
    title: 'Quickstart: SQL',
  },
  'quickstart/quickstart-python': {
    Component: QuickstartPythonDoc,
    source: 'docs/quickstart/quickstart-python.mdx',
    title: 'Quickstart: Python',
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
  'guides/embeddings-at-scale': {
    Component: EmbeddingsAtScaleDoc,
    source: 'docs/guides/embeddings-at-scale.mdx',
    title: 'Embeddings at Scale',
  },
  'guides/dedup-and-clean': {
    Component: DedupAndCleanDoc,
    source: 'docs/guides/dedup-and-clean.mdx',
    title: 'Dedup and Clean',
  },
  'guides/sql-multimodal-pipeline': {
    Component: SqlMultimodalPipelineDoc,
    source: 'docs/guides/sql-multimodal-pipeline.mdx',
    title: 'SQL Multimodal Pipeline',
  },
  'guides/doris-integration': {
    Component: DorisIntegrationDoc,
    source: 'docs/guides/doris-integration.mdx',
    title: 'Doris Integration',
  },
  'guides/iceberg-lakehouse': {
    Component: IcebergLakehouseDoc,
    source: 'docs/guides/iceberg-lakehouse.mdx',
    title: 'Iceberg Lakehouse',
  },
  'guides/gpu-inference-udf': {
    Component: GpuInferenceUdfDoc,
    source: 'docs/guides/gpu-inference-udf.mdx',
    title: 'GPU Inference UDF',
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
export const DEFAULT_DOC_SLUG: DocSlug = 'index'

export function isDocSlug(slug: string | undefined): slug is DocSlug {
  return Boolean(slug && slug in DOCS_PAGES)
}

export function getDocGroup(slug: DocSlug) {
  return DOCS_SIDEBAR.find((group) => group.items.some((item) => item.slug === slug))?.group
}
