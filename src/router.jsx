import { useCallback, useEffect } from 'react'
import DocusaurusLink from '@docusaurus/Link'
import { useHistory, useLocation } from '@docusaurus/router'

/* ------------------------------------------------------------------
   Compatibility layer for the site's existing Link/useRouter API.
   Docusaurus owns route registration now; this module keeps the current
   components small while preserving the custom hash-scroll behavior.
   ------------------------------------------------------------------ */

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
  return children
}

export function useRouter() {
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      scrollToHash(location.hash.slice(1), false)
    }
  }, [location.pathname, location.hash])

  const navigate = useCallback((to) => {
    const url = new URL(to, window.location.origin)
    const samePage = url.pathname === window.location.pathname
    history.push(url.pathname + url.hash)

    const smooth = !prefersReducedMotion()
    if (url.hash) {
      // wait for the new page to mount before locating the anchor
      scrollToHash(url.hash.slice(1), smooth && samePage)
    } else if (!samePage) {
      window.scrollTo(0, 0)
    }
  }, [history])

  return { path: location.pathname, navigate }
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
    <DocusaurusLink to={to} className={className} onClick={onClick} {...rest}>
      {children}
    </DocusaurusLink>
  )
}
