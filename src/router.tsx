import {useCallback, type MouseEvent} from 'react'
import DocusaurusLink from '@docusaurus/Link'
import type {Props as DocusaurusLinkProps} from '@docusaurus/Link'
import { useHistory, useLocation } from '@docusaurus/router'
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { decodeHash, prefersReducedMotion, scrollToHash } from './scrollToHash'
import { resolveLinkClickUrl } from './routerUrl'

/* ------------------------------------------------------------------
   Compatibility layer for the site's existing Link/useRouter API.
   Docusaurus owns route registration now; this module keeps the current
   components small.
   ------------------------------------------------------------------ */

type Navigate = (to: string) => void

type RouterState = {
  path: string
  navigate: Navigate
}

type LinkProps = Omit<DocusaurusLinkProps, 'href' | 'to'> & {
  to: string
}

function isAbsoluteInternalRoute(to: string) {
  return to.startsWith('/') && !to.startsWith('//')
}

function shouldAutoAddBaseUrl(to: string, currentLocale: string, defaultLocale: string) {
  if (currentLocale === defaultLocale) return true
  if (!to.startsWith('/')) return true
  return isAbsoluteInternalRoute(to)
}

function useNavigate(): Navigate {
  const history = useHistory()
  const {
    i18n: { currentLocale, defaultLocale },
  } = useDocusaurusContext()
  const {withBaseUrl} = useBaseUrlUtils()

  return useCallback((to: string) => {
    const next = shouldAutoAddBaseUrl(to, currentLocale, defaultLocale)
      ? withBaseUrl(to)
      : to
    history.push(next)
  }, [currentLocale, defaultLocale, history, withBaseUrl])
}

export function useRouter(): RouterState {
  const location = useLocation()
  const navigate = useNavigate()

  return { path: location.pathname, navigate }
}

/* Internal link — intercepts left-clicks, lets modified clicks behave normally. */
export function Link({ to, className, children, autoAddBaseUrl, ...rest }: LinkProps) {
  const {
    i18n: { currentLocale, defaultLocale },
  } = useDocusaurusContext()
  const navigate = useNavigate()
  const addBaseUrl =
    autoAddBaseUrl ?? shouldAutoAddBaseUrl(to, currentLocale, defaultLocale)

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    const href = e.currentTarget.getAttribute('href') ?? to
    const url = resolveLinkClickUrl({ href, to, currentHref: window.location.href })
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
    navigate(url.pathname + url.search + url.hash)
  }

  return (
    <DocusaurusLink
      to={to}
      className={className}
      autoAddBaseUrl={addBaseUrl}
      onClick={onClick}
      {...rest}
    >
      {children}
    </DocusaurusLink>
  )
}
