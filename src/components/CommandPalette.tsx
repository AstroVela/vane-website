import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from '../router'
import { cx } from './cx'
import { PRODUCT_ORDER, PRODUCTS } from '../docs/products'
import {
  DEFAULT_DOC_SLUG,
  DOCS_PAGES,
  docGroupLabel,
  docPageTitle,
  isDocsSidebarGroup,
  type DocsSidebarEntry,
} from '../docs/registry'
import { pickLocale, type SiteLocale, useSiteLocale } from '../siteI18n'

type SearchItem = {
  title: string
  group: string
  product: string
  path: string
}

/* Flatten every live product's doc tree into a searchable list. Titles come
   from the registered MDX pages; paths mirror Docs.tsx's `docPath`. */
function buildIndex(locale: SiteLocale): SearchItem[] {
  const items: SearchItem[] = []
  const addEntries = (productId: string, productName: string, entries: DocsSidebarEntry[], groupPath: string[]) => {
    for (const entry of entries) {
      if (isDocsSidebarGroup(entry)) {
        addEntries(productId, productName, entry.items, [...groupPath, docGroupLabel(entry.group, locale)])
        continue
      }
      if (!entry.slug || !DOCS_PAGES[entry.slug]) continue
      const path = entry.slug === DEFAULT_DOC_SLUG ? `/docs/${productId}` : `/docs/${productId}/${entry.slug}`
      const title = docPageTitle(entry.slug, locale)
      const group = groupPath.join(' / ') || title
      items.push({ title, group, product: productName, path })
    }
  }

  for (const pid of PRODUCT_ORDER) {
    const product = PRODUCTS[pid]
    if (product.status !== 'live' || !product.sidebar) continue
    addEntries(pid, product.name, product.sidebar, [])
  }
  return items
}

/* Rendered only while open (mounted fresh each time), so internal state starts
   clean without a reset effect. */
export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const locale = useSiteLocale()
  const { navigate } = useRouter()
  const index = useMemo(() => buildIndex(locale), [locale])
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return index
    return index.filter((it) => `${it.title} ${it.group} ${it.product}`.toLowerCase().includes(q))
  }, [query, index])

  // Selection clamped at render so a shrinking result set never goes out of range.
  const activeIdx = results.length ? Math.min(sel, results.length - 1) : 0

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const go = (item: SearchItem) => {
    navigate(item.path)
    onClose()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel(Math.min(activeIdx + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel(Math.max(activeIdx - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results[activeIdx]
      if (item) go(item)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }
  const copy = pickLocale(
    locale,
    {
      search: 'Search the docs',
      placeholder: 'Search the docs…',
      empty: 'No matching pages',
      navigate: 'navigate',
      open: 'open',
      close: 'close',
    },
    {
      search: '搜索文档',
      placeholder: '搜索文档…',
      empty: '没有匹配的页面',
      navigate: '移动',
      open: '打开',
      close: '关闭',
    },
  )

  return (
    <div className="cmdk-overlay" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label={copy.search}>
      <div className="cmdk" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <span className="cmdk-ic">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={copy.placeholder}
            aria-label={copy.search}
          />
          <span className="kbd">ESC</span>
        </div>
        <div className="cmdk-list" ref={listRef}>
          {results.map((it, i) => (
            <button
              key={it.path}
              data-idx={i}
              className={cx('cmdk-item', i === activeIdx && 'on')}
              onMouseEnter={() => setSel(i)}
              onClick={() => go(it)}
            >
              <span className="cmdk-title">{it.title}</span>
              <span className="cmdk-meta">{it.product} · {it.group}</span>
            </button>
          ))}
          {results.length === 0 && <div className="cmdk-empty">{copy.empty}</div>}
        </div>
        <div className="cmdk-foot">
          <span><b>↑↓</b> {copy.navigate}</span>
          <span><b>↵</b> {copy.open}</span>
          <span><b>esc</b> {copy.close}</span>
        </div>
      </div>
    </div>
  )
}
