import type {ReactNode} from 'react'
import docsManifest from '../../docs/manifest.json'
import { DOCS_EDIT_BASE_URL } from '../siteLinks'

type DocsManifestPage = {
  lastUpdated?: string
  slug: string
  source: string
}

const docsManifestBySlug = new Map(
  (docsManifest.pages as DocsManifestPage[]).map((item) => [item.slug, item]),
)
const docsManifestBySource = new Map(
  (docsManifest.pages as DocsManifestPage[]).map((item) => [item.source, item]),
)

export function normalizeDocSource(source: string | undefined) {
  return source?.replace(/^@site\//, '')
}

export function docsEditUrl(source: string | undefined) {
  return `${DOCS_EDIT_BASE_URL}/${normalizeDocSource(source) ?? ''}`
}

export function lastUpdatedForDocId(id: string | undefined) {
  return id ? docsManifestBySlug.get(id)?.lastUpdated : undefined
}

export function lastUpdatedForDocSource(source: string | undefined) {
  const normalizedSource = normalizeDocSource(source)
  return normalizedSource ? docsManifestBySource.get(normalizedSource)?.lastUpdated : undefined
}

export function formatLastUpdated(value: string | undefined, locale = 'en') {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date)
}

export function EditIcon(): ReactNode {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 11.9 2 14l2.1-.5 8.6-8.6-1.6-1.6z" />
      <path d="m10.2 4.2 1.6 1.6" />
    </svg>
  )
}
