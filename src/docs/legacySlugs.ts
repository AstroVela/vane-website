import type { DocSlug } from './registry'

export const LEGACY_DOC_SLUGS = {
  'quickstart/what-is-vane': 'quickstart/what-is-vane-data',
} as const satisfies Record<string, DocSlug>

export const LEGACY_DOC_SLUG_LIST = Object.keys(LEGACY_DOC_SLUGS)

export function resolveLegacyDocSlug(slug: string | undefined) {
  if (!slug) return undefined
  return LEGACY_DOC_SLUGS[slug as keyof typeof LEGACY_DOC_SLUGS]
}
