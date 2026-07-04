import type {ReactNode} from 'react'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { MDXProvider } from '@mdx-js/react'
import docsManifest from '../../docs/manifest.json'
import Nav from '../components/Nav'
import ComingSoon from './ComingSoon'
import ProductGlyph from '../docs/ProductGlyph'
import { Link, useRouter } from '../router'
import { cx } from '../components/cx'
import { mdxComponents } from '../components/mdxComponents'
import { DOCS_EDIT_BASE_URL } from '../siteLinks'
import {
  DEFAULT_DOC_SLUG,
  DOCS_ORDER,
  DOCS_PAGES,
  type DocSlug,
  type DocsSidebarEntry,
  type DocsSidebarItem,
  getDocGroup,
  getDocGroupPath,
  isDocsSidebarGroup,
  isDocSlug,
} from '../docs/registry'
import {
  DEFAULT_PRODUCT,
  PRODUCTS,
  isProductId,
  type ProductId,
} from '../docs/products'
import { resolveLegacyDocSlug } from '../docs/legacySlugs'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

type TocItem = {
  id: string
  label: string
}

type DocsManifestPage = {
  lastUpdated?: string
  slug: string
}

const docsManifestBySlug = new Map(
  (docsManifest.pages as DocsManifestPage[]).map((item) => [item.slug, item]),
)

function EditIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 11.9 2 14l2.1-.5 8.6-8.6-1.6-1.6z" />
      <path d="m10.2 4.2 1.6 1.6" />
    </svg>
  )
}

function docsEditUrl(source: string) {
  return `${DOCS_EDIT_BASE_URL}/${source}`
}

function formatLastUpdated(value: string | undefined) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date)
}

/* Parse `/docs`, `/docs/<product>`, `/docs/<product>/<slug...>`, and the legacy
   `/docs/<slug...>` form into a product + optional slug. */
function parseDocsPath(path: string): { product: ProductId; slug?: string } {
  const segs = path.replace(/^\/docs\/?/, '').split('/').filter(Boolean)
  if (segs.length === 0) return { product: DEFAULT_PRODUCT }
  if (isProductId(segs[0])) return { product: segs[0], slug: segs.slice(1).join('/') }
  // Legacy `/docs/<slug>` — resolve against the default (live) product.
  return { product: DEFAULT_PRODUCT, slug: segs.join('/') }
}

export default function Docs() {
  const { path } = useRouter()
  const { product, slug } = parseDocsPath(path)
  const canonicalSlug = resolveLegacyDocSlug(slug) ?? slug
  const prod = PRODUCTS[product]
  const isLive = prod.status === 'live'

  let current: DocSlug | undefined
  if (isLive) {
    if (!canonicalSlug) current = DEFAULT_DOC_SLUG
    else if (isDocSlug(canonicalSlug)) current = canonicalSlug
    else throw new Error(`Unknown docs slug "${slug}"`)
  }

  const groupPath = useMemo(() => (current ? getDocGroupPath(current) ?? [] : []), [current])
  const group = current ? getDocGroup(current) : undefined
  const activeGroupKeys = useMemo(
    () => groupPath.map((_, index) => groupPath.slice(0, index + 1).join(' / ')),
    [groupPath],
  )

  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [toc, setToc] = useState<TocItem[]>([])
  // Collapsible sidebar groups. State holds only explicit user overrides; by
  // default a group is open iff it contains the active page (`group`), so a long
  // doc tree stays scannable and navigating auto-reveals the current section.
  // Explicit, reader-controlled open state. The active path opens when the page
  // changes, but a click can still collapse the currently active group.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(activeGroupKeys.map((key) => [key, true])),
  )
  useEffect(() => {
    if (!activeGroupKeys.length) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route-change sync: reveal the active docs path without overriding later reader clicks.
    setOpenGroups((prev) => {
      if (activeGroupKeys.every((key) => prev[key])) return prev
      return { ...prev, ...Object.fromEntries(activeGroupKeys.map((key) => [key, true])) }
    })
  }, [current, activeGroupKeys])
  const isGroupOpen = (name: string) => openGroups[name] === true
  const toggleGroup = (name: string) =>
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }))

  // Re-derive the per-page "On this page" and scrollspy whenever the page
  // changes. The headings come from MDX and only exist in the DOM after mount.
  // For coming-soon products there is no `.doc` article, so this no-ops.
  useIsomorphicLayoutEffect(() => {
    setToc(
      Array.from(document.querySelectorAll('.doc h2.ds')).map((h) => ({
        id: h.id,
        label: h.textContent ?? '',
      })),
    )

    const sections = Array.from(document.querySelectorAll('.doc h2.ds, .doc h1.dh'))
    const onScroll = () => {
      const y = (window.scrollY || document.documentElement.scrollTop) + 90
      let cur = sections[0] ? sections[0].id : null
      for (const s of sections) {
        if (s.getBoundingClientRect().top + window.scrollY <= y) cur = s.id
      }
      setActiveSection(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [product, current])

  const navLabel = (it: DocsSidebarItem): ReactNode =>
    it.label ?? (it.slug ? DOCS_PAGES[it.slug].title : null)

  const docPath = (slug: DocSlug) =>
    slug === DEFAULT_DOC_SLUG ? `/docs/${product}` : `/docs/${product}/${slug}`

  const page = current ? DOCS_PAGES[current] : null
  const PageBody = page?.Component

  const i = current ? DOCS_ORDER.indexOf(current) : -1
  const prev = i > 0 ? DOCS_ORDER[i - 1] : null
  const next = i >= 0 && i < DOCS_ORDER.length - 1 ? DOCS_ORDER[i + 1] : null
  const lastUpdated = formatLastUpdated(current ? docsManifestBySlug.get(current)?.lastUpdated : undefined)

  const renderSidebarEntry = (entry: DocsSidebarEntry, parentPath: string[], depth: number): ReactNode => {
    if (!isDocsSidebarGroup(entry)) {
      return entry.to ? (
        <Link className="ext" to={entry.to} key={entry.to}>
          <span className="ar-up">↗</span>
          {navLabel(entry)}
        </Link>
      ) : entry.slug ? (
        <Link
          to={docPath(entry.slug)}
          key={entry.slug}
          className={cx('snav', entry.slug === current && 'on')}
        >
          {navLabel(entry)}
        </Link>
      ) : null
    }

    const pathParts = [...parentPath, entry.group]
    const key = pathParts.join(' / ')
    const first = entry.items[0]
    const isTopLevelDirectLink =
      depth === 0 && entry.items.length === 1 && first && !isDocsSidebarGroup(first)

    if (isTopLevelDirectLink) {
      if (first.to) {
        return (
          <Link className="gt-link ext" to={first.to} key={key}>
            <span className="ar-up">↗</span>
            {entry.group}
          </Link>
        )
      }
      if (first.slug) {
        return (
          <Link
            key={key}
            to={docPath(first.slug)}
            className={cx('gt-link', first.slug === current && 'on')}
          >
            {entry.group}
          </Link>
        )
      }
      return null
    }

    const open = isGroupOpen(key)
    return (
      <div className={cx('grp', depth > 0 && 'subgrp', open && 'open')} key={key}>
        <button
          type="button"
          className="gt"
          aria-expanded={open}
          onClick={() => toggleGroup(key)}
        >
          <span className="gcaret" aria-hidden="true">▸</span>
          <span>{entry.group}</span>
        </button>
        {open && (
          <div className={cx('grp-items', depth > 0 && 'subitems')}>
            {entry.items.map((item) => renderSidebarEntry(item, pathParts, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // Coming-soon products (Agent / RL) reuse the same three-column docs frame as
  // a live product for layout consistency, but the sidebar carries only the
  // product identity card (no doc tree) and the teaser fills the content column.
  if (!isLive || !page || !PageBody) {
    return (
      <>
        <Nav withCta={false} />
        <div className="docs">
          <nav className="side side-soon">
            <div className="prod">
              <span className="prod-ic">
                <ProductGlyph id={product} size={15} />
              </span>
              <div>
                <div className="prod-name">{prod.name}</div>
                <div className="prod-status">In development</div>
              </div>
            </div>
          </nav>
          <main className="doc">
            <ComingSoon product={prod} />
          </main>
          <aside className="toc" aria-hidden="true" />
        </div>
      </>
    )
  }

  return (
    <>
      <Nav withSearch withCta={false} />

      <div className="docs">
        {/* SIDEBAR — a product context card, then the product's groups. */}
        <nav className="side">
          <div className="prod">
            <span className="prod-ic">
              <ProductGlyph id={product} size={15} />
            </span>
            <div className="prod-name">{prod.name}</div>
          </div>

          {(prod.sidebar ?? []).map((grp) => renderSidebarEntry(grp, [], 0))}
        </nav>

        {/* CONTENT */}
        <article className="doc">
          <div className="crumb">
            {prod.name}
            {group && <> / {group}</>}
          </div>
          <h1 className="dh" id={current}>{page.title}</h1>

          <MDXProvider components={mdxComponents}>
            <PageBody />
          </MDXProvider>

          <div className="doc-meta">
            <a className="doc-edit" href={docsEditUrl(page.source)} target="_blank" rel="noreferrer">
              <EditIcon />
              Edit this page
            </a>
            {lastUpdated && (
              <div className="doc-updated">
                Last updated on <strong>{lastUpdated}</strong>
              </div>
            )}
          </div>

          <div className="pager">
            {prev && <Link to={docPath(prev)}>← {DOCS_PAGES[prev].title}</Link>}
            {next && (
              <Link className="nx" to={docPath(next)}>
                {DOCS_PAGES[next].title} →
              </Link>
            )}
          </div>
        </article>

        {/* TOC */}
        <aside className="toc">
          {toc.length > 0 && (
            <>
              <div className="tt">On this page</div>
              {toc.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className={cx('tnav', activeSection === t.id && 'on')}
                >
                  {t.label}
                </a>
              ))}
            </>
          )}
        </aside>
      </div>
    </>
  )
}
