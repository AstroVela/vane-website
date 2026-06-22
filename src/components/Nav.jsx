import { useEffect, useState } from 'react'
import { Link } from '../router'
import { cx } from './cx'
import Mark from './Mark'
import { useGitHubStars } from './useGitHubStars'
import { GITHUB_REPO, GITHUB_URL } from '../siteLinks'

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}

/* Sticky nav. On the Home page the Get-Started CTA is hidden on the first
   screen and fades in past 460px of scroll (`ctaReveal`). Elsewhere it's a
   normal, always-visible button. */
export default function Nav({ ctaReveal = false, ctaTo = '/docs', ctaHref }) {
  const [show, setShow] = useState(false)
  const stars = useGitHubStars(GITHUB_REPO)

  useEffect(() => {
    if (!ctaReveal) return undefined
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      setShow(y > 460)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [ctaReveal])

  const ctaClass = cx('btn btn-solid btn-sm', ctaReveal && 'nav-cta', ctaReveal && show && 'show')
  const ctaInner = (
    <>
      Get Started <span className="ar">→</span>
    </>
  )

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link className="brand" to="/">
          <Mark size={24} />
          <span className="wm">vane</span>
        </Link>
        <nav className="nav-links">
          <Link to="/use-cases">Use Cases</Link>
          <Link to="/benchmarks">Benchmarks</Link>
          <Link to="/docs">Docs</Link>
          <a href="#blog">Blog</a>
        </nav>
        <div className="nav-right">
          <a className="ghp" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <GitHubIcon />
            <span>Star</span>
            {stars && <b>{stars}</b>}
          </a>
          {ctaHref ? (
            <a className={ctaClass} href={ctaHref}>
              {ctaInner}
            </a>
          ) : (
            <Link className={ctaClass} to={ctaTo}>
              {ctaInner}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
