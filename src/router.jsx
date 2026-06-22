/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

/* ------------------------------------------------------------------
   Minimal History-API router (provider + useRouter hook + Link).
   Page routing uses pathname (so in-page `#hash` anchors stay free for
   the Use Cases chip jumps and the Docs scrollspy). External / `#`-only
   links fall through to plain <a>. Fast-refresh's "only export
   components" rule is disabled here because this is a cohesive routing
   module that also exports the hook and Link helper.
   ------------------------------------------------------------------ */

const RouterContext = createContext(null)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NAV_OFFSET = 72 // clears the 58px sticky nav (≈ the headings' scroll-margin-top)

function scrollToHash(id, smooth) {
  let tries = 0
  const attempt = () => {
    const el = document.getElementById(id)
    if (!el) {
      if (tries++ < 20) requestAnimationFrame(attempt)
      return
    }
    const y = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET
    window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'instant' })
  }
  attempt()
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    // honor a hash on first load (e.g. /use-cases#search)
    if (window.location.hash) {
      scrollToHash(window.location.hash.slice(1), false)
    }
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to) => {
    const url = new URL(to, window.location.origin)
    const samePage = url.pathname === window.location.pathname
    window.history.pushState({}, '', url.pathname + url.hash)
    if (!samePage) setPath(url.pathname)

    const smooth = !prefersReducedMotion()
    if (url.hash) {
      // wait for the new page to mount before locating the anchor
      scrollToHash(url.hash.slice(1), smooth && samePage)
    } else if (!samePage) {
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  return useContext(RouterContext)
}

/* Internal link — intercepts left-clicks, lets modified clicks behave normally. */
export function Link({ to, className, children, ...rest }) {
  const { navigate } = useRouter()
  const onClick = (e) => {
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={to} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}
