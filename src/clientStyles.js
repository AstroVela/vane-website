import './index.css'
import './pages.css'
import { decodeHash, prefersReducedMotion, scrollToHash } from './scrollToHash'

export function onRouteDidUpdate({ location, previousLocation }) {
  if (!location.hash) return

  const samePage =
    previousLocation &&
    previousLocation.pathname === location.pathname &&
    previousLocation.search === location.search

  requestAnimationFrame(() => {
    scrollToHash(decodeHash(location.hash), samePage && !prefersReducedMotion())
  })
}
