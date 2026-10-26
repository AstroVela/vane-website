import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { PropSidebar } from '@docusaurus/plugin-content-docs'
import { ThemeClassNames } from '@docusaurus/theme-common'
import DocSidebarItems from '@theme/DocSidebarItems'
import IconClose from '@theme/Icon/Close'
import ProductGlyph from '../docs/ProductGlyph'
import { OPEN_DOCS_MOBILE_NAV_EVENT } from '../docs/mobileNavigation'
import { PRODUCTS } from '../docs/products'
import { pickLocale, useSiteLocale } from '../siteI18n'

type DocsMobileNavigationProps = {
  path: string
  sidebar: PropSidebar
}

export default function DocsMobileNavigation({ path, sidebar }: DocsMobileNavigationProps) {
  const locale = useSiteLocale()
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const product = path.includes('/docs/data') ? PRODUCTS.data : null
  const copy = pickLocale(
    locale,
    {
      navigation: 'Documentation navigation',
      close: 'Close documentation navigation',
    },
    {
      navigation: '文档导航',
      close: '关闭文档导航',
    },
  )

  useEffect(() => {
    const openNavigation = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
      setOpen(true)
    }

    window.addEventListener(OPEN_DOCS_MOBILE_NAV_EVENT, openNavigation)
    return () => window.removeEventListener(OPEN_DOCS_MOBILE_NAV_EVENT, openNavigation)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const returnFocus = returnFocusRef.current
    const mobileViewport = window.matchMedia('(max-width: 996px)')
    document.documentElement.classList.add('docs-mobile-nav-open')
    const frameId = window.requestAnimationFrame(() => closeRef.current?.focus())
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
    }
    const onViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    mobileViewport.addEventListener('change', onViewportChange)
    return () => {
      window.cancelAnimationFrame(frameId)
      document.documentElement.classList.remove('docs-mobile-nav-open')
      document.removeEventListener('keydown', onKeyDown)
      mobileViewport.removeEventListener('change', onViewportChange)
      returnFocus?.focus()
    }
  }, [open])

  const keepFocusInDrawer = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return

    const focusable = Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0)
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    open && (
      <div
        className="docs-mobile-nav-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false)
        }}
      >
        <aside
          id="docs-mobile-navigation"
          className="docs-mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="docs-mobile-navigation-title"
          ref={drawerRef}
          onKeyDown={keepFocusInDrawer}
        >
          <div className="docs-mobile-nav-header">
            <span id="docs-mobile-navigation-title">{copy.navigation}</span>
            <button
              type="button"
              className="docs-mobile-nav-close"
              aria-label={copy.close}
              title={copy.close}
              ref={closeRef}
              onClick={() => setOpen(false)}
            >
              <IconClose width={17} height={17} />
            </button>
          </div>

          <div className="docs-mobile-nav-body theme-doc-sidebar-container">
            <nav className="menu thin-scrollbar docs-data-menu" aria-label={copy.navigation}>
              {product && (
                <div className="prod">
                  <span className="prod-ic">
                    <ProductGlyph id={product.id} size={15} />
                  </span>
                  <div className="prod-name">{product.name}</div>
                </div>
              )}
              <ul className={`${ThemeClassNames.docs.docSidebarMenu} menu__list`}>
                <DocSidebarItems
                  items={sidebar}
                  activePath={path}
                  onItemClick={(item) => {
                    if (item.type === 'link' || (item.type === 'category' && item.href)) {
                      setOpen(false)
                    }
                  }}
                  level={1}
                />
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    )
  )
}
