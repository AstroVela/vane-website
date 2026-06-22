import { useCallback } from 'react'
import DocusaurusLink from '@docusaurus/Link'
import { useHistory, useLocation } from '@docusaurus/router'
import { decodeHash, prefersReducedMotion, scrollToHash } from './scrollToHash'

/* ------------------------------------------------------------------
   Compatibility layer for the site's existing Link/useRouter API.
   Docusaurus owns route registration now; this module keeps the current
   components small.
   ------------------------------------------------------------------ */

export function RouterProvider({ children }) {
  return children
}

export function useNavigate() {
  const history = useHistory()

  return useCallback((to) => {
    history.push(to)
  }, [history])
}

export function useRouter() {
  const location = useLocation()
  const navigate = useNavigate()

  return { path: location.pathname, navigate }
}

/* Internal link — intercepts left-clicks, lets modified clicks behave normally. */
export function Link({ to, className, children, ...rest }) {
  const navigate = useNavigate()

  const onClick = (e) => {
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    const url = new URL(to, window.location.origin)
    const samePageHash =
      url.hash &&
      url.pathname === window.location.pathname &&
      url.search === window.location.search

    if (samePageHash) {
      e.preventDefault()
      // Same-page hash updates bypass the router so Docusaurus' instant
      // scrollIntoView does not interrupt the site's smooth anchor scroll.
      window.history.pushState(null, '', url.pathname + url.search + url.hash)
      scrollToHash(decodeHash(url.hash), !prefersReducedMotion())
      return
    }

    e.preventDefault()
    navigate(to)
  }

  return (
    <DocusaurusLink to={to} className={className} onClick={onClick} {...rest}>
      {children}
    </DocusaurusLink>
  )
}
