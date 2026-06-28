import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from '../router'
import { cx } from './cx'
import { PRODUCT_ORDER, PRODUCTS } from '../docs/products'
import { DEFAULT_DOC_SLUG, DOCS_PAGES } from '../docs/registry'

type SearchItem = {
  title: string
  group: string
  product: string
  path: string
}

/* Flatten every live product's doc tree into a searchable list. Titles come
   from the registered MDX pages; paths mirror Docs.tsx's `docPath`. */
function buildIndex(): SearchItem[] {
  const items: SearchItem[] = []
  for (const pid of PRODUCT_ORDER) {
    const product = PRODUCTS[pid]
    if (product.status !== 'live' || !product.sidebar) continue
    for (const group of product.sidebar) {
      for (const item of group.items) {
        if (!item.slug || !DOCS_PAGES[item.slug]) continue
        const path = item.slug === DEFAULT_DOC_SLUG ? `/docs/${pid}` : `/docs/${pid}/${item.slug}`
        items.push({ title: DOCS_PAGES[item.slug].title, group: group.group, product: product.name, path })
      }
    }
  }
  return items
}

/* Rendered only while open (mounted fresh each time), so internal state starts
   clean without a reset effect. */
export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const { navigate } = useRouter()
  const index = useMemo(() => buildIndex(), [])
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

  return (
    <div className="cmdk-overlay" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Search the docs">
      <div className="cmdk" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <span className="cmdk-ic">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search the docs…"
            aria-label="Search the docs"
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
          {results.length === 0 && <div className="cmdk-empty">No matching pages</div>}
        </div>
        <div className="cmdk-foot">
          <span><b>↑↓</b> navigate</span>
          <span><b>↵</b> open</span>
          <span><b>esc</b> close</span>
        </div>
      </div>
    </div>
  )
}
