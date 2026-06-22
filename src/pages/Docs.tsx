import type {ReactNode} from 'react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { MDXProvider } from '@mdx-js/react'
import Nav from '../components/Nav'
import { Link, useRouter } from '../router'
import { cx } from '../components/cx'
import { mdxComponents } from '../components/mdxComponents'
import {
  DEFAULT_DOC_SLUG,
  DOCS_ORDER,
  DOCS_PAGES,
  DOCS_SIDEBAR,
  type DocsSidebarItem,
  getDocGroup,
  isDocSlug,
} from '../docs/registry'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

type TocItem = {
  id: string
  label: string
}

export default function Docs() {
  const { path } = useRouter()
  const requested = path.replace(/^\/docs\/?/, '')
  const current = requested ? (isDocSlug(requested) ? requested : undefined) : DEFAULT_DOC_SLUG

  if (!current) {
    throw new Error(`Unknown docs slug "${requested}"`)
  }

  const page = DOCS_PAGES[current]

  if (!page) {
    throw new Error(`Unknown docs slug "${current}"`)
  }

  const PageBody = page.Component
  const group = getDocGroup(current)

  const i = DOCS_ORDER.indexOf(current)
  const prev = i > 0 ? DOCS_ORDER[i - 1] : null
  const next = i >= 0 && i < DOCS_ORDER.length - 1 ? DOCS_ORDER[i + 1] : null

  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [toc, setToc] = useState<TocItem[]>([])

  // Re-derive the per-page "On this page" and scrollspy whenever the page
  // changes. The headings come from MDX and only exist in the DOM after mount.
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
  }, [current])

  const navLabel = (it: DocsSidebarItem): ReactNode =>
    it.label ?? (it.slug ? DOCS_PAGES[it.slug].title : null)

  return (
    <>
      <Nav />

      <div className="docs">
        {/* SIDEBAR — links switch doc pages; labels come from each page's title. */}
        <nav className="side">
          {DOCS_SIDEBAR.map((grp) => (
            <div className="grp" key={grp.group}>
              <div className="gt">{grp.group}</div>
              {grp.items.map((it) =>
                it.to ? (
                  <Link to={it.to} key={it.to}>{navLabel(it)}</Link>
                ) : (
                  <Link
                    to={`/docs/${it.slug}`}
                    key={it.slug}
                    className={cx('snav', it.slug === current && 'on')}
                  >
                    {navLabel(it)}
                  </Link>
                ),
              )}
            </div>
          ))}
        </nav>

        {/* CONTENT — page body authored under docs/<section>/<slug>.mdx. */}
        <article className="doc">
          <div className="search">⌕ Search the docs <span className="kbd">⌘K</span></div>

          {group && <div className="crumb">{group}</div>}
          <h1 className="dh" id={current}>{page.title}</h1>

          <MDXProvider components={mdxComponents}>
            <PageBody />
          </MDXProvider>

          <div className="pager">
            {prev && <Link to={`/docs/${prev}`}>← {DOCS_PAGES[prev].title}</Link>}
            {next && <Link className="nx" to={`/docs/${next}`}>{DOCS_PAGES[next].title} →</Link>}
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
