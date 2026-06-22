import { useLayoutEffect, useState } from 'react'
import { MDXProvider } from '@mdx-js/react'
import Nav from '../components/Nav'
import { Link, useRouter } from '../router'
import { cx } from '../components/cx'
import { mdxComponents } from '../components/mdxComponents'
import { DOCS_NAV } from '../content/docsNav'

// Each doc topic is its own page: src/content/docs/<slug>.mdx, exporting a
// `title` (used for the page <h1>, the sidebar label, and the prev/next pager).
const modules = import.meta.glob('../content/docs/*.mdx', { eager: true })
const PAGES = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const slug = path.match(/\/([^/]+)\.mdx$/)[1]
    return [slug, { Component: mod.default, title: mod.title ?? slug }]
  }),
)

// Slugs declared in the sidebar, in order.
const NAV_SLUGS = DOCS_NAV.flatMap((g) => g.items.map((it) => it.slug).filter(Boolean))

if (import.meta.env.DEV) {
  NAV_SLUGS.filter((slug) => !PAGES[slug]).forEach((slug) =>
    console.warn(`docsNav: no page file for slug "${slug}" (src/content/docs/${slug}.mdx)`),
  )
}

// Default page and prev/next only walk slugs that have a real page file, so a
// nav entry without a matching .mdx warns (above) instead of crashing the pager.
const ORDER = NAV_SLUGS.filter((slug) => PAGES[slug])
const DEFAULT_SLUG = ORDER[0]

export default function Docs() {
  const { path } = useRouter()
  const requested = path.replace(/^\/docs\/?/, '') || DEFAULT_SLUG
  const current = PAGES[requested] ? requested : DEFAULT_SLUG
  const page = PAGES[current]
  const PageBody = page.Component
  const group = DOCS_NAV.find((g) => g.items.some((it) => it.slug === current))?.group

  const i = ORDER.indexOf(current)
  const prev = i > 0 ? ORDER[i - 1] : null
  const next = i >= 0 && i < ORDER.length - 1 ? ORDER[i + 1] : null

  const [activeSection, setActiveSection] = useState(null)
  const [toc, setToc] = useState([])

  // Re-derive the per-page "On this page" and scrollspy whenever the page
  // changes. The headings come from MDX and only exist in the DOM after mount.
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToc(
      Array.from(document.querySelectorAll('.doc h2.ds')).map((h) => ({
        id: h.id,
        label: h.textContent,
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

  const navLabel = (it) => it.label ?? PAGES[it.slug]?.title ?? it.slug

  return (
    <>
      <Nav />

      <div className="docs">
        {/* SIDEBAR — links switch doc pages; labels come from each page's title. */}
        <nav className="side">
          {DOCS_NAV.map((grp) => (
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

        {/* CONTENT — page body authored in src/content/docs/<slug>.mdx. */}
        <article className="doc">
          <div className="search">⌕ Search the docs <span className="kbd">⌘K</span></div>

          {group && <div className="crumb">{group}</div>}
          <h1 className="dh" id={current}>{page.title}</h1>

          <MDXProvider components={mdxComponents}>
            <PageBody />
          </MDXProvider>

          <div className="pager">
            {prev && <Link to={`/docs/${prev}`}>← {PAGES[prev].title}</Link>}
            {next && <Link className="nx" to={`/docs/${next}`}>{PAGES[next].title} →</Link>}
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
