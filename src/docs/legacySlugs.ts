import type { DocSlug } from './registry'

export const LEGACY_DOC_SLUGS = {
  'quickstart/what-is-vane': 'index',
  'quickstart/what-is-vane-data': 'index',
  'concepts/architecture': 'index',
  'concepts/execution-model': 'index',
  examples: 'tutorials',
  'examples/common-crawl': 'tutorials/examples/common-crawl',
  'examples/minhash-dedupe': 'tutorials/examples/minhash-dedupe',
  'examples/llms-red-pajamas': 'tutorials/examples/llms-red-pajamas',
  'examples/querying-images': 'tutorials/examples/querying-images',
  'examples/image-generation': 'tutorials/examples/image-generation',
  'examples/voice-ai-analytics': 'tutorials/examples/voice-ai-analytics',
  'examples/multimodal-structured-outputs':
    'tutorials/examples/multimodal-structured-outputs',
  'examples/example-tutorials/common-crawl': 'tutorials/examples/common-crawl',
  'examples/example-tutorials/minhash-dedupe': 'tutorials/examples/minhash-dedupe',
  'examples/example-tutorials/llms-red-pajamas':
    'tutorials/examples/llms-red-pajamas',
  'examples/example-tutorials/querying-images': 'tutorials/examples/querying-images',
  'examples/example-tutorials/image-generation': 'tutorials/examples/image-generation',
  'examples/example-tutorials/voice-ai-analytics':
    'tutorials/examples/voice-ai-analytics',
  'examples/example-tutorials/multimodal-structured-outputs':
    'tutorials/examples/multimodal-structured-outputs',
  'examples/claims-disposition': 'tutorials/use-cases/claims-disposition',
  'examples/enterprise-agent-evidence': 'tutorials/use-cases/enterprise-agent-evidence',
  'examples/multimodal-training-data': 'tutorials/use-cases/multimodal-training-data',
  'examples/procurement-compliance-audit':
    'tutorials/use-cases/procurement-compliance-audit',
  'examples/web-text-deduplication': 'tutorials/use-cases/web-text-deduplication',
  'examples/end-to-end-use-cases/claims-disposition':
    'tutorials/use-cases/claims-disposition',
  'examples/end-to-end-use-cases/enterprise-agent-evidence':
    'tutorials/use-cases/enterprise-agent-evidence',
  'examples/end-to-end-use-cases/multimodal-training-data':
    'tutorials/use-cases/multimodal-training-data',
  'examples/end-to-end-use-cases/procurement-compliance-audit':
    'tutorials/use-cases/procurement-compliance-audit',
  'examples/end-to-end-use-cases/web-text-deduplication':
    'tutorials/use-cases/web-text-deduplication',
  'deploy/single-node': 'deploy/deployment',
  'deploy/ray-cluster': 'deploy/deployment',
  'deploy/sizing': 'deploy/deployment',
} as const satisfies Record<string, DocSlug>

export const LEGACY_DOC_SLUG_LIST = Object.keys(LEGACY_DOC_SLUGS)

export function resolveLegacyDocSlug(slug: string | undefined) {
  if (!slug) return undefined
  return LEGACY_DOC_SLUGS[slug as keyof typeof LEGACY_DOC_SLUGS]
}
