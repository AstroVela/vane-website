import type { DocSlug } from './registry'

export const LEGACY_DOC_SLUGS = {
  'quickstart/what-is-vane': 'index',
  'quickstart/what-is-vane-data': 'index',
  'concepts/architecture': 'index',
  'concepts/execution-model': 'index',
  'deploy/single-node': 'deploy/deployment',
  'deploy/ray-cluster': 'deploy/deployment',
  'deploy/sizing': 'deploy/deployment',
} as const satisfies Record<string, DocSlug>

export const LEGACY_DOC_SLUG_LIST = Object.keys(LEGACY_DOC_SLUGS)

export function resolveLegacyDocSlug(slug: string | undefined) {
  if (!slug) return undefined
  return LEGACY_DOC_SLUGS[slug as keyof typeof LEGACY_DOC_SLUGS]
}
