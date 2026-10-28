import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/space-grotesk/index.css'
import '@fontsource/silkscreen/latin-400.css'
import '@fontsource-variable/noto-sans-sc'
import '@fontsource-variable/jetbrains-mono'
import type {ClientModule} from '@docusaurus/types'
import './index.css'
import './pages.css'
import './marketing.css'
import { decodeHash, prefersReducedMotion, scrollToHash } from './scrollToHash'

export const onRouteDidUpdate: NonNullable<ClientModule['onRouteDidUpdate']> = ({
  location,
  previousLocation,
}) => {
  if (!location.hash) return

  const samePage = Boolean(
    previousLocation &&
    previousLocation.pathname === location.pathname &&
    previousLocation.search === location.search,
  )

  requestAnimationFrame(() => {
    scrollToHash(decodeHash(location.hash), samePage && !prefersReducedMotion())
  })
}
